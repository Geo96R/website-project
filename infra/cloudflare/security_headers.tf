variable "enable_security_headers" {
  type        = bool
  default     = false
  description = "Add security headers - requires Transform Rules (Pro plan or special permissions)"
}

resource "cloudflare_ruleset" "security_headers" {
  count       = var.enable_security_headers ? 1 : 0
  zone_id     = var.zone_id
  name        = "Security Headers"
  description = "Add security headers to all responses"
  kind        = "zone"
  phase       = "http_response_headers_transform"

  rules {
    description = "Security headers for all responses"
    expression  = "true"
    action      = "rewrite"

    action_parameters {
      headers {
        name      = "Strict-Transport-Security"
        operation = "set"
        value     = "max-age=31536000; includeSubDomains"
      }

      headers {
        name      = "X-Frame-Options"
        operation = "set"
        value     = "DENY"
      }

      headers {
        name      = "X-Content-Type-Options"
        operation = "set"
        value     = "nosniff"
      }

      headers {
        name      = "Referrer-Policy"
        operation = "set"
        value     = "strict-origin-when-cross-origin"
      }

      headers {
        name      = "X-XSS-Protection"
        operation = "set"
        value     = "1; mode=block"
      }
    }
  }
}

