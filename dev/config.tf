terraform {
  backend "s3" {
    bucket  = "intern-henryhelm"
    key     = "twitter.tfstate"
    region  = "ap-northeast-1"
    encrypt = "true"
  }
}

provider "aws" {
  region = "ap-northeast-1"
  default_tags {
    tags = {
      Project = "henryhelm"
    }
  }
}

data "aws_region" "current" {}
