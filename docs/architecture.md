# HSX Architecture

## Pipeline Stages
1. Input Acquisition
2. Signature Scan (regex driven)
3. (Future) Heuristic / ML Enrichment
4. Span Adjudication (collision resolution & precedence ordering)
5. Policy Application (rule mapping, action resolution, tokenization)
6. Rewrite (reverse-ordered substitution)
7. (Future) Audit & Metrics Export

## Data Shapes
- HsxFinding: raw detection
- HsxAppliedFinding: post-policy action

## Adjudication
Precedence rank: SECRET_* (0) < PROMPT_INJECTION_* (1) < PII_* (2) < META_* (3). Tiebreakers: riskWeight desc, length desc, offset asc.

## Interval Index
Simple sorted array index adequate for medium text (<5MB). Future upgrade: segment tree or sweep-line for large contexts.