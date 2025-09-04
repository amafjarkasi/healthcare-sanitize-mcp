# Confidence & Risk Fusion (Planned)

Formula sketch:
```
confidence = base_confidence * sourceReliability * (1 - overlapPenalty)
```
Aggregate risk across findings:
```
GlobalRisk = 1 - Π(1 - (riskWeight * confidence))
```

Used for policy escalation (future: threshold -> refusal or human review flag).