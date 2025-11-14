variable "cloudflare_api_token" {
  type        = string
  description = "CF API token"
  sensitive   = true
}

variable "zone_id" {
  type        = string
  description = "CF Zone ID"
}

variable "domain" {
  type        = string
  default     = "george-devops.info"
}

variable "server_ip" {
  type        = string
  description = "VPS/K3s/LB IP"
  sensitive   = true
}

variable "allowed_ip" {
  type        = string
  description = "Your IP(s) for WAF whitelist - single: 1.2.3.4 or multiple: 1.2.3.4 2.3.4.5 3.4.5.6"
  sensitive   = true
}

