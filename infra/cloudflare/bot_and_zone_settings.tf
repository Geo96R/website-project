variable "enable_bot_fight_mode" {
  type        = bool
  default     = false
  description = "Enable Bot Fight Mode (FREE) - Set to true to turn on"
}

resource "cloudflare_zone_settings_override" "main" {
  zone_id = var.zone_id

  settings {
    security_level = "medium"
    always_use_https = "on"
    ssl = "full"
    browser_check = "on"
    hotlink_protection = "off"
    challenge_ttl = 1800
  }
}

resource "cloudflare_bot_management" "bots" {
  count      = var.enable_bot_fight_mode ? 1 : 0
  zone_id    = var.zone_id
  fight_mode = true
}

