# Observability Plan

Metrics (Prometheus-style):
- hsx_findings_total{kind,action}
- hsx_policy_rule_hits{ruleId}
- hsx_redaction_latency_ms (histogram)

Logging rules:
- Never persist raw secret values
- Use truncated previews or token references