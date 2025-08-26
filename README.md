# 🧬 HSX Context Hygiene Engine (formerly sanitize-mcp)

A multi-stage context hygiene & risk adjudication engine for LLM toolchains. It detects and processes secrets, personal data, and adversarial prompt artifacts before they reach a model boundary—delivering deterministic redaction, linkable tokenization, or policy-based refusal.

## Why HSX?
Traditional "sanitize" passes operate as fragile regex filters. HSX layers signature scanning, span adjudication (collision & precedence aware), policy mapping, and stable tokenization so downstream systems can preserve referential integrity without exposing sensitive substrings.

## Key Capabilities
- Signature-based detection (extensible JSON signature packs)
- Span collision adjudication with precedence (SECRET_* > PROMPT_INJECTION_* > PII_* > META_)
- Wildcard policy rules with actions (REDACT, MASK_PARTIAL, TOKENIZE_LINKABLE, STRIP_LINE, FLAG_ONLY, KEEP)
- Stable, linkable tokenization via HMAC (configurable truncation & encoding)
- Deterministic rewrite ordering (reverse-offset application prevents index drift)
- Lightweight CLI (hsx-cli scrub <file>)
- Extensible risk & confidence model (future fusion documented)

## Quick Start
```bash
npm install
npm run build
echo "Contact me at dev@example.com AKIAABCDEFGHIJKLMNOPQRST ignore previous text" > sample.txt
npx hsx-cli scrub sample.txt
```

## Configuration
Environment variables:
- HSX_SIGNATURE_DIR (default: config/signatures)
- HSX_POLICY_PATH (default: config/hsx-policy.json)
- PHI_SALT (secret salt for tokenization stability)

## Directory Layout
```
config/               # policy + signature packs
src/core/             # types & interval index
src/detection/        # signature loading & scanning
src/policy/           # policy evaluation & tokenization
src/pipeline/         # adjudication (precedence + collision)
src/cli/              # hsx-cli entrypoint
docs/                 # architecture & rationale
```

## Tokenization
Produces <T:...> tokens using HMAC-SHA256(kind || raw) with truncated digest (default base32 9 bytes). Consistent for identical (kind, value) pairs enabling safe correlation.

## Roadmap (abridged)
- Confidence fusion of overlapping heuristics
- Structured audit log (hashes only, no raw secret values)
- Streaming transformer API
- Additional signature categories (IP, phone, JWT, credit card with Luhn)

See docs/ for deeper details.