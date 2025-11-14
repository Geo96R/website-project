output "domain" {
  value = var.domain
}

output "cf_zone_id" {
  value = var.zone_id
}

output "root_record_id" {
  value = try(cloudflare_record.root_a.id, "")
  description = "A record ID (empty if not yet created)"
}

output "ssl_mode" {
  value = cloudflare_zone_settings_override.main.settings[0].ssl
}
