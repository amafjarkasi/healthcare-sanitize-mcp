import { HsxFinding } from "../core/hsxTypes.js";
import { HsxIntervalIndex } from "../core/hsxIntervalIndex.js";

export function adjudicate(findings: HsxFinding[]): HsxFinding[] {
  findings.sort(compareFindings);
  const accepted: HsxFinding[] = [];
  const index = new HsxIntervalIndex();
  for (let i = 0; i < findings.length; i++) {
    const f = findings[i]!; // We know this exists since i < length
    const overlaps = index.overlaps(f.offset, f.offset + f.length);
    if (overlaps.length === 0) {
      index.insert(f.offset, f.offset + f.length, i);
      accepted.push(f);
    }
  }
  index.finalize();
  return accepted;
}

function compareFindings(a: HsxFinding, b: HsxFinding) {
  const rank = (f: HsxFinding) => {
    if (f.kind.startsWith("SECRET_")) return 0;
    if (f.kind.startsWith("PROMPT_INJECTION_")) return 1;
    if (f.kind.startsWith("PII_")) return 2;
    return 3;
  };
  const rA = rank(a);
  const rB = rank(b);
  if (rA !== rB) return rA - rB;
  if (a.riskWeight !== b.riskWeight) return b.riskWeight - a.riskWeight;
  if (a.length !== b.length) return b.length - a.length;
  return a.offset - b.offset;
}