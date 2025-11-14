# Feature Toggles

All features are on the FREE tier.

## Currently Active (Auto-deployed via GitHub Actions)

✅ A record + www redirect  
✅ WAF (blocks non-IL traffic except your IP)  
✅ SSL Full strict  
✅ Browser integrity check  
✅ Minification (CSS/JS/HTML)  
✅ Security headers (HSTS, X-Frame-Options, etc)

## Disabled (flip to enable)

❌ Bot Fight Mode - blocks bad bots  
❌ Rate Limiting - limits requests per IP

## How to Enable

### Bot Fight Mode

Edit `bot_and_zone_settings.tf`:
```hcl
enable_bot_fight_mode = true
```

Commit, push, done.

### Rate Limiting

Edit `rate_limit.tf`:
```hcl
enable_rate_limiting = true
```

Free tier = 10 rate limit rules max.  
Currently protects `/api/metrics` only.

## To Add More Features

1. Edit the `.tf` file
2. Set variable to `true`
3. Push to main
4. GitHub Actions applies it

That's it and if it doesn't work gitgud.
