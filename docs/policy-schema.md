# Policy Schema

```json
{
  "version": 1,
  "defaultAction": "KEEP",
  "rules": [
    { "match": { "kind": "SECRET_*" }, "action": "REDACT" }
  ],
  "tokenization": {
    "hmacAlgo": "SHA256",
    "truncateBytes": 9,
    "encoding": "base32"
  }
}
```

Rules are evaluated in order; first match wins. `match.kind` supports one wildcard `*` (converted to `.*`).

Tokenization config is optional; disable by omitting the object.