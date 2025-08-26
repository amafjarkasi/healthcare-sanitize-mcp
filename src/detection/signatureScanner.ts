import { HsxFinding } from "../core/hsxTypes.js";
import { HsxSignature } from "./signatureLoader.js";

export function scanWithSignatures(
  text: string,
  signatures: HsxSignature[],
): HsxFinding[] {
  const findings: HsxFinding[] = [];
  let counter = 0;
  for (const sig of signatures) {
    let re: RegExp;
    try {
      re = new RegExp(sig.pattern, "g");
    } catch {
      continue;
    }
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      findings.push({
        id: `sg_${counter++}`,
        kind: sig.kind as any,
        offset: m.index,
        length: m[0].length,
        confidence: 1,
        riskWeight: sig.riskWeight ?? inferRiskWeight(sig.kind),
        source: "SIGNATURE",
        preview: text.slice(m.index, m.index + Math.min(32, m[0].length)),
      });
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  }
  return findings;
}

function inferRiskWeight(kind: string): number {
  if (kind.startsWith("SECRET_")) return 0.9;
  if (kind.startsWith("PROMPT_INJECTION_")) return 0.7;
  if (kind.startsWith("PII_")) return 0.5;
  return 0.2;
}