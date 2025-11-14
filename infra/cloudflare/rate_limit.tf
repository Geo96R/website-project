variable "enable_rate_limiting" {
  type        = bool
  default     = false
  description = "Rate limit per IP - free tier allows 10 rules max, if you buy enterpise or other features change accordingly"
}

resource "cloudflare_ruleset" "basic_rate_limit" {
  count       = var.enable_rate_limiting ? 1 : 0
  zone_id     = var.zone_id
  name        = "Basic Rate Limiting"
  description = "Limit requests per IP (FREE: 10 rules max)"
  kind        = "zone"
  phase       = "http_ratelimit"

  rules {
    description = "Rate limit per IP"
    expression  = "(http.request.uri.path eq \"/api/metrics\")"
    action      = "block"

    action_parameters {
      response {
        status_code  = 429
        content_type = "text/plain"
        content      = "Rate limit exceeded"
      }
    }

    ratelimit {
      characteristics     = ["ip.src"]
      period              = 60
      requests_per_period = 100
      mitigation_timeout  = 300
    }
  }
}

