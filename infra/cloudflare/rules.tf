resource "cloudflare_ruleset" "redirect_www" {
  zone_id     = var.zone_id
  name        = "Redirect www to root"
  description = "Redirect www subdomain to root"
  kind        = "zone"
  phase       = "http_request_dynamic_redirect"

  rules {
    description = "Redirect www to root domain"
    expression  = "(http.host eq \"www.${var.domain}\")"
    action      = "redirect"
    action_parameters {
      from_value {
        status_code = 301
        target_url {
          value = "https://${var.domain}"
        }
        preserve_query_string = false
      }
    }
  }
}

resource "cloudflare_ruleset" "waf_block" {
  zone_id     = var.zone_id
  name        = "Block non-Israel traffic except allowed IPs"
  kind        = "zone"
  phase       = "http_request_firewall_custom"
  description = "Block all traffic except from Israel and whitelisted IPs"

  rules {
    action = "block"
    expression = "(ip.src.country ne \"IL\" and not ip.src in {${var.allowed_ip}})"
    description = "Block traffic not from Israel or whitelisted IPs"
    enabled = true
  }
}

