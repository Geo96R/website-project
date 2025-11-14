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

For a bit more clarity, if you push this while you have existing record it will fail thats ok
unless you plan to move everything to full terraform, go to https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs
and reconstruct things in a way that both your API capabilities and the terraform can fully manage your entire application at the cloudflare level IMO
Deleting records constantly and recreating is a bit of a waste of time resources and production efficency

Further more if your site was live previouslly to adding Terraform
and you delete your dns records to play with this, make sure to restart your application with a good ol kubectl rollout restart and then wait for it to be up [kubectl get pods -w]