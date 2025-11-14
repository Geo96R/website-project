output "domain" {
  value = var.domain
}

output "cf_zone_id" {
  value = var.zone_id
}

output "root_record_id" {
  value = cloudflare_record.root_a.id
}

output "ssl_mode" {
  value = cloudflare_zone_settings_override.main.settings[0].ssl
}
