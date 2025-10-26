# Alchemy Worker – Production Features Demo

Spin up a full-production Worker in **60 seconds** and **see** every new flag we ship.

## 1. Bootstrap
```bash
npm create alchemy@latest
cd worker-prod-demo
alchemy configure --profile prod   # multi-account ready
```

## 2. Deploy with **all** production flags
```bash
alchemy deploy --stage preview
```
What you just enabled:
| Flag | Value | Why |
|------|-------|-----|
| `observability = true` | Auto-scraped Prometheus metrics |
| `smart_placement = true` | Respect cf.colo, reduce latency |
| `cron = "*/5 * * * *"` | Health-check every 5 min |
| `durable_objects.alarm = true` | Wake-up alarm for long tasks |
| `bindings.METRICS` | Push custom metrics |

## 3. Watch the metrics
Open [https://worker-prod-demo.preview.your-subdomain.workers.dev](https://worker-prod-demo.preview.your-subdomain.workers.dev) and click the **Metrics** badge below.

![resize_duration_ms](https://img.shields.io/endpoint?url=https%3A%2F%2Falchemy.run%2Fapi%2Fmetric%2Fresize_duration_ms)

## 4. Promote to prod
```bash
alchemy deploy --stage prod
```
Same artefact SHA → zero-downtime rollout.

## 5. Clean up
```bash
alchemy destroy --stage preview
alchemy destroy --stage prod
```

Done. **No prose, just commands.**
