# Cloudflare Infrastructure as Code

Manage your CF DNS, WAF, and SSL via Terraform + GitHub Actions.

## Quick Setup

### 1. Create CF API Token

Go to Cloudflare Dashboard > Profile > API Tokens > Create Token

**Template**: Edit zone DNS

**Permissions needed**:
```
Zone > DNS > Edit
Zone > Zone > Edit  
Zone > Zone WAF > Edit
Zone > SSL and Certificates > Edit
Zone > Cache Purge > Purge
```

**Zone Resources**: Include your zone (george-devops.info)

Copy the token when done.

### 2. Get Your Zone ID

Go to CF Dashboard > Select your domain > Right sidebar under API section

The URL looks like: `dash.cloudflare.com/ZONE_ID_HERE/domain.com`

Copy that ZONE_ID.

### 3. Add GitHub Secrets

Repo > Settings > Secrets and variables > Actions > New repository secret

Add these 4 secrets:

| Secret Name | Value | Where to Get It |
|-------------|-------|-----------------|
| `CF_API_TOKEN` | Your CF API token | From step 1 |
| `CF_ZONE_ID` | Your zone ID | From step 2 |
| `SERVER_IP` | Your server IP | Your VPS/K3s cluster IP |
| `ALLOWED_IP` | Your home IP(s) | whatismyip.com/curl -4 ifconfig.me - for multiple: `1.2.3.4 2.3.4.5` (space-separated) |

## What This Manages

- **A Record**: Points your domain to your server (proxied through CF)
- **TXT Record**: _acme-challenge for Let's Encrypt SSL
- **WAF Rule**: Blocks all traffic except from Israel + your IP
- **SSL**: Full strict mode
- **www Redirect**: www.domain.com > domain.com
- **Security Headers**: HSTS, X-Frame-Options, etc (enabled by default)
- **Bot Fight Mode**: Disabled by default (flip to enable)

## How It Works

1. Edit Terraform files
2. Commit and push to main
3. GitHub Actions runs terraform automatically
4. Changes applied to CF

No local terraform needed.

## Enable/Disable Features

Edit these variables in the `.tf` files:

- **Bot Fight Mode**: Set `enable_bot_fight_mode = true` in `bot_and_zone_settings.tf`
- **Rate Limiting**: Set `enable_rate_limiting = true` in `rate_limit.tf`  
- **Security Headers**: Already enabled, set to `false` to disable

See `FEATURES.md` for details.

## Manual Run (optional)

```bash
cd infra/cloudflare
terraform init
terraform plan
terraform apply
```
