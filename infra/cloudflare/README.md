# Cloudflare Terraform 



Manages DNS records and zone settings via GitHub Actions.

## Secrets Required (Already Set)

- `CF_API_TOKEN` - Cloudflare API token
- `CF_ZONE_ID` - Your zone ID
- `SERVER_IP` - VPS IP
- `ALLOWED_IP` - Your home IP (optional)

## What's Managed

- DNS: A record, TXT, CNAME
- Zone settings: SSL, browser check
- Bot Fight Mode (disabled by default)

## First Run Issue

If you get "record already exists" error:
1. Delete your 3 DNS records in Cloudflare dashboard (A, TXT, CNAME)
2. Push any change to trigger Terraform again
3. Terraform will create and manage them

## WAF/Security Headers

Keep managing WAF rules manually in CF dashboard - Terraform rulesets conflict with existing rules.
