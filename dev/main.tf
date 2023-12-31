resource "aws_ecr_repository" "ecr_repository_web_app" {
  name = "${var.resource_prefix}-ecr"

  image_scanning_configuration {
    scan_on_push = true
  }
  force_delete = true
}

resource "null_resource" "docker_packaging" {

  provisioner "local-exec" {
    command = <<EOF
	    aws ecr get-login-password --region ${data.aws_region.current.name} | docker login --username AWS --password-stdin ${aws_ecr_repository.ecr_repository_web_app.registry_id}.dkr.ecr.ap-northeast-1.amazonaws.com
	    docker buildx build --platform linux/amd64 -t ${aws_ecr_repository.ecr_repository_web_app.repository_url}:${var.image_tag} -f ../nginx/Dockerfile --build-arg AWS_REGION=${data.aws_region.current.name} --build-arg FRONTEND_URL=${var.app_url} --build-arg S3_BUCKET_NAME=${var.s3_bucket_name} --build-arg NODE_ENV=production --build-arg NEXTAUTH_URL=${var.app_url} --build-arg PUBLIC_API_URL=${var.app_url}   ../
	    docker push ${aws_ecr_repository.ecr_repository_web_app.repository_url}:${var.image_tag}
	    EOF
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    aws_ecr_repository.ecr_repository_web_app,
  ]
}

resource "aws_ecs_cluster" "ecs_cluster_web_app" {
  name = "${var.resource_prefix}-ecs-cluster"
}

module "vpc" {
  source         = "terraform-aws-modules/vpc/aws"
  version        = "4.0.1"
  name           = "${var.resource_prefix}-vpc_web_app"
  cidr           = "10.0.0.0/16"
  azs            = ["${data.aws_region.current.name}a", "${data.aws_region.current.name}c", "${data.aws_region.current.name}d"]
  public_subnets = ["10.0.0.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

module "security-group-alb" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "4.17.1"
  name    = "${var.resource_prefix}-security-group_alb"
  vpc_id  = module.vpc.vpc_id
  ingress_cidr_blocks = [
    "210.253.197.196/32",
    "210.253.209.177/32",
    "118.238.221.230/32",
    "54.249.20.115/32",
    "150.249.192.7/32",
    "150.249.202.244/32",
    "150.249.202.245/32",
    "150.249.202.253/32",
    "0.0.0.0/0"
  ]
  ingress_rules      = ["https-443-tcp", "http-80-tcp"]
  egress_cidr_blocks = ["0.0.0.0/0"]
  egress_rules       = ["all-all"]
}

module "security-group-ecs-task" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "4.17.1"
  name    = "${var.resource_prefix}-security-group_ecs_task"
  vpc_id  = module.vpc.vpc_id
  ingress_with_source_security_group_id = [
    {
      rule                     = "http-80-tcp"
      source_security_group_id = module.security-group-alb.security_group_id
    }
  ]
  egress_cidr_blocks = ["0.0.0.0/0"]
  egress_rules       = ["all-all"]
}

resource "aws_cloudwatch_log_group" "cloudwatch_log_group_web_app" {
  name = "${var.resource_prefix}-cloudwatch-log-group"
}

resource "aws_ecs_task_definition" "ecs_task_definition_web_app" {
  family = "${var.resource_prefix}-ecs-task-definition"
  container_definitions = jsonencode(
    [
      {
        "name" : "web-app",
        "image" : "${aws_ecr_repository.ecr_repository_web_app.repository_url}:${var.image_tag}",
        "portMappings" : [
          {
            "containerPort" : 80,
            "hostPort" : 80,
            "protocol" : "tcp"
          }
        ],
        "logConfiguration" : {
          "logDriver" : "awslogs",
          "options" : {
            "awslogs-group" : "${aws_cloudwatch_log_group.cloudwatch_log_group_web_app.name}",
            "awslogs-region" : "${data.aws_region.current.name}",
            "awslogs-stream-prefix" : "ecs"
          }
        }
        "environmentFiles" : [
          {
            "value" : var.secrets_file_path,
            "type" : "s3"
          }
        ],
        "environment" : [
          {
            "name" : "AWS_REGION",
            "value" : "${data.aws_region.current.name}"
          },
          {
            "name" : "FRONTEND_URL",

            "value" : "${var.app_url}"
          },
          {
            "name" : "S3_BUCKET_NAME",
            "value" : "${var.s3_bucket_name}"
          },
          {
            "name" : "NODE_ENV",
            "value" : "production"
          },
          {
            "name" : "NEXTAUTH_URL",
            "value" : "${var.app_url}"
          },
        ]
      }
    ]
  )
  cpu                      = 256
  memory                   = 512
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = var.iam_role
  task_role_arn            = var.iam_role
}

resource "aws_ecs_service" "ecs_service_web_app" {
  name            = "${var.resource_prefix}-ecs-service"
  cluster         = aws_ecs_cluster.ecs_cluster_web_app.id
  task_definition = aws_ecs_task_definition.ecs_task_definition_web_app.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets          = module.vpc.public_subnets
    security_groups  = [module.security-group-ecs-task.security_group_id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = module.alb.target_group_arns[0]
    container_name   = "web-app"
    container_port   = 80
  }
}

module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "8.7.0"
  name    = "${var.resource_prefix}-alb"
  vpc_id  = module.vpc.vpc_id
  security_groups = [
    module.security-group-alb.security_group_id,
  ]
  load_balancer_type = "application"
  subnets            = module.vpc.public_subnets

  target_groups = [
    {
      backend_protocol     = "HTTP"
      backend_port         = 80
      target_type          = "ip"
      deregistration_delay = 10
      health_check = {
        enabled             = true
        interval            = 30
        path                = "/backend/health"
        port                = "traffic-port"
        healthy_threshold   = 3
        unhealthy_threshold = 3
        timeout             = 6
        matcher             = "200"
      }
    }
  ]

  https_listeners = [
    {
      port               = "443"
      protocol           = "HTTPS"
      certificate_arn    = module.acm.acm_certificate_arn
      target_group_index = 0
    }
  ]
}

data "aws_route53_zone" "demo" {
  name = "intern.aws.prd.demodesu.com"
}

resource "aws_route53_record" "alb_alias" {
  zone_id = data.aws_route53_zone.demo.zone_id
  name    = var.record_name
  type    = "A"

  alias {
    name                   = module.alb.lb_dns_name
    zone_id                = module.alb.lb_zone_id
    evaluate_target_health = false
  }
}

module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "~> 4.0"

  domain_name = "${var.record_name}.${data.aws_route53_zone.demo.name}"
  zone_id     = data.aws_route53_zone.demo.zone_id

  wait_for_validation = true

}

resource "aws_appautoscaling_target" "autoscaling_target_web_app" {
  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.ecs_cluster_web_app.name}/${aws_ecs_service.ecs_service_web_app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  min_capacity       = 1
  max_capacity       = 5
}

resource "aws_appautoscaling_policy" "ecsfargate_scale_out" {
  name               = "scale_out"
  policy_type        = "StepScaling"
  service_namespace  = aws_appautoscaling_target.autoscaling_target_web_app.service_namespace
  resource_id        = aws_appautoscaling_target.autoscaling_target_web_app.resource_id
  scalable_dimension = aws_appautoscaling_target.autoscaling_target_web_app.scalable_dimension

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 30
    metric_aggregation_type = "Average"

    step_adjustment {
      metric_interval_lower_bound = 0
      scaling_adjustment          = 1
    }
  }
}

resource "aws_appautoscaling_policy" "ecsfargate_scale_in" {
  name               = "scale_in"
  policy_type        = "StepScaling"
  service_namespace  = aws_appautoscaling_target.autoscaling_target_web_app.service_namespace
  resource_id        = aws_appautoscaling_target.autoscaling_target_web_app.resource_id
  scalable_dimension = aws_appautoscaling_target.autoscaling_target_web_app.scalable_dimension

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 30
    metric_aggregation_type = "Average"

    step_adjustment {
      metric_interval_upper_bound = 0
      scaling_adjustment          = -1
    }
  }
}

resource "aws_cloudwatch_metric_alarm" "ecsfargate_cpu_high" {
  alarm_name          = "cpu_utilization_high"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "30"
  statistic           = "Average"
  threshold           = "20"

  dimensions = {
    ClusterName = aws_ecs_cluster.ecs_cluster_web_app.name
    ServiceName = aws_ecs_service.ecs_service_web_app.name
  }

  alarm_actions = [
    aws_appautoscaling_policy.ecsfargate_scale_out.arn
  ]
}

resource "aws_cloudwatch_metric_alarm" "ecsfargate_cpu_low" {
  alarm_name          = "cpu_utilization_low"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "30"
  statistic           = "Average"
  threshold           = "10"

  dimensions = {
    ClusterName = aws_ecs_cluster.ecs_cluster_web_app.name
    ServiceName = aws_ecs_service.ecs_service_web_app.name
  }

  alarm_actions = [
    aws_appautoscaling_policy.ecsfargate_scale_in.arn
  ]
}