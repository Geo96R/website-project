# Redirect handled by CNAME record above
# Dynamic redirect rulesets require Pro plan or special permissions
# Using proxied CNAME for www -> root is the free tier approach

# WAF rules already exist in Cloudflare dashboard
# Managing via dashboard is simpler for firewall rules on free tier
# Terraform rulesets can conflict with existing dashboard rules
# Keep managing your WAF rule manually or delete it first then uncomment:

# resource "cloudflare_ruleset" "waf_block" {
#   zone_id     = var.zone_id
#   name        = "Block non-Israel traffic except allowed IPs"
#   kind        = "zone"
#   phase       = "http_request_firewall_custom"
#   description = "Block all traffic except from Israel and whitelisted IPs"
#
#   rules {
#     action = "block"
#     expression = "(ip.src.country ne \"IL\" and not ip.src in {${var.allowed_ip}})"
#     description = "Block traffic not from Israel or whitelisted IPs"
#     enabled = true
#   }
# }

