resource "cloudflare_record" "root_a" {
  zone_id = var.zone_id
  name    = var.domain
  content = var.server_ip
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "acme_challenge" {
  zone_id = var.zone_id
  name    = "_acme-challenge"
  content = "tTty5c4PxLUHEoh9Zrll-WHIDFo9T5cf0uYTHYPK3bI"
  type    = "TXT"
  proxied = false
  ttl     = 120
}

resource "cloudflare_record" "www_redirect" {
  zone_id = var.zone_id
  name    = "www"
  content = var.domain
  type    = "CNAME"
  proxied = true
}
