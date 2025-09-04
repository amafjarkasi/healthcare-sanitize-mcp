import crypto from "node:crypto";
import { HsxFinding, HsxAppliedFinding, HsxPolicy } from "../core/hsxTypes.js";

export function applyPolicy(
  findings: HsxFinding[],
  policy: HsxPolicy,
  text: string,
  envSalt = process.env.PHI_SALT || ""
): HsxAppliedFinding[] {
  return findings.map(f => {
    const action = resolveAction(f.kind, policy);
    let tokenReplacement: string | undefined;
    if (action === "TOKENIZE_LINKABLE") {
      tokenReplacement = makeStableToken(f, text, policy, envSalt);
    }
    return { ...f, action, tokenReplacement };
  });
}

function resolveAction(kind: string, policy: HsxPolicy) {
  for (const rule of policy.rules) {
    if (rule.match.kind) {
      const pattern = "^" + rule.match.kind.replace("*", ".*") + "$";
      if (new RegExp(pattern).test(kind)) return rule.action;
    }
  }
  return policy.defaultAction;
}

function makeStableToken(
  finding: HsxFinding,
  text: string,
  policy: HsxPolicy,
  salt: string
) {
  const raw = text.slice(finding.offset, finding.offset + finding.length);
  const tcfg = policy.tokenization;
  if (!tcfg) return "<TOKEN_DISABLED>";
  const h = crypto
    .createHmac("sha256", salt)
    .update(finding.kind)
    .update(":")
    .update(raw)
    .digest();
  const slice = h.subarray(0, tcfg.truncateBytes);
  const enc =
    tcfg.encoding === "base32"
      ? toBase32(slice)
      : slice.toString("hex");
  return `<T:${enc}>`;
}

const BASE32_ALPH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function toBase32(buf: Buffer) {
  let bits = 0;
  let value = 0;
  let output = "";
  for (const b of buf) {
    bits += 8;
    value = (value << 8) | b;
    while (bits >= 5) {
      output += BASE32_ALPH[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += BASE32_ALPH[(value << (5 - bits)) & 31];
  return output;
}