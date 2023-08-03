variable "resource_prefix" {
  default = "intern-henryhelm-tclone"
}

variable "iam_role" {
  default = "arn:aws:iam::741641693274:role/intern-devops-ecs"
}

variable "zone_id" {
  default = "Z1HCSX5F3LI1KR"
}

variable "record_name" {
  default = "henryhelm"
}

variable "s3_bucket_name" {
  default = "intern-henryhelm"
}

variable "url" {
  default = "https://henryhelm.intern.aws.prd.demodesu.com"
}

variable "image_tag" {

}
