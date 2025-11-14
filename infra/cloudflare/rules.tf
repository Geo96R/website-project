resource "cloudflare_ruleset" "redirect_www" {
  zone_id = var.zone_id
  name    = "Redirect www to root"
  kind    = "zone"
  phase   = "http_request_redirect"

  rules {
    action = "redirect"
    expression = "(http.host eq \"www.${var.domain}\")"
    action_parameters {
      from_value {
        status_code = 301
        target_url  = "https://${var.domain}"
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

