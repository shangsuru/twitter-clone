variable "resource_prefix" {
  default = "intern-henryhelm-tclone"
}

variable "iam_role" {
  default = "arn:aws:iam::741641693274:role/intern-devops-ecs"
}

variable "record_name" {
  default = "henryhelm"
}

variable "s3_bucket_name" {
  default = "intern-henryhelm"
}

variable "app_url" {
  default = "https://henryhelm.intern.aws.prd.demodesu.com"
}

variable "secrets_file_path" {
  default = "arn:aws:s3:::intern-henryhelm/secrets.env"
}

variable "image_tag" {

}
