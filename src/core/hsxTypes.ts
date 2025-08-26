export type HsxFindingKind =
  | `SECRET_${string}`
  | `PII_${string}`
  | `PROMPT_INJECTION_${string}`
  | `META_${string}`;

export type HsxAction =
  | "REDACT"
  | "MASK_PARTIAL"
  | "TOKENIZE_LINKABLE"
  | "STRIP_LINE"
  | "FLAG_ONLY"
  | "KEEP";

export interface HsxFinding {
  id: string;
  kind: HsxFindingKind;
  offset: number;
  length: number;
  confidence: number; // 0..1
  riskWeight: number; // 0..1 weighting for aggregate risk
  source: "SIGNATURE" | "HEURISTIC" | "MERGED";
  preview?: string;
}

export interface HsxAppliedFinding extends HsxFinding {
  action: HsxAction;
  tokenReplacement?: string;
}

export interface HsxPolicyRule {
  match: { kind?: string };
  action: HsxAction;
}

export interface HsxPolicy {
  version: number;
  defaultAction: HsxAction;
  rules: HsxPolicyRule[];
  tokenization?: {
    hmacAlgo: string; // e.g. SHA256
    truncateBytes: number; // bytes of digest to encode
    encoding: "base32" | "hex";
  };
}