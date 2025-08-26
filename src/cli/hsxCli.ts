#!/usr/bin/env node
import fs from "node:fs";
import { loadSignatures } from "../detection/signatureLoader.js";
import { scanWithSignatures } from "../detection/signatureScanner.js";
import { adjudicate } from "../pipeline/hsxAdjudicator.js";
import { applyPolicy } from "../policy/hsxPolicyEngine.js";
import { HsxPolicy } from "../core/hsxTypes.js";

function main() {
  const args = process.argv.slice(2);
  const mode = args[0];
  if (!mode || ["--help", "-h"].includes(mode)) {
    printHelp();
    process.exit(0);
  }
  switch (mode) {
    case "scrub":
      return scrubCommand(args.slice(1));
    default:
      console.error("Unknown mode:", mode);
      printHelp();
      process.exit(1);
  }
}

function scrubCommand(rest: string[]) {
  const file = rest[0];
  if (!file) {
    console.error("Provide a file path.");
    process.exit(2);
  }
  const text = fs.readFileSync(file, "utf8");
  const sigDir = process.env.HSX_SIGNATURE_DIR || "config/signatures";
  const policyPath = process.env.HSX_POLICY_PATH || "config/hsx-policy.json";
  const signatures = loadSignatures(sigDir);
  const rawFindings = scanWithSignatures(text, signatures);
  const adjudicated = adjudicate(rawFindings);
  const policy = JSON.parse(fs.readFileSync(policyPath, "utf8")) as HsxPolicy;
  const applied = applyPolicy(adjudicated, policy, text);
  const transformed = rewrite(text, applied);
  process.stdout.write(transformed);
}

function rewrite(text: string, findings: ReturnType<typeof applyPolicy>) {
  const sorted = [...findings].sort(
    (a, b) => b.offset - a.offset || b.length - a.length
  );
  let out = text;
  for (const f of sorted) {
    const before = out.slice(0, f.offset);
    const raw = out.slice(f.offset, f.offset + f.length);
    const after = out.slice(f.offset + f.length);
    let replacement = raw;
    switch (f.action) {
      case "REDACT":
        replacement = "<REDACTED>";
        break;
      case "MASK_PARTIAL":
        replacement = maskPartial(raw);
        break;
      case "TOKENIZE_LINKABLE":
        replacement = f.tokenReplacement || "<TOKEN>";
        break;
      case "STRIP_LINE":
        replacement = "";
        break;
      case "FLAG_ONLY":
      case "KEEP":
        replacement = raw;
        break;
    }
    out = before + replacement + after;
  }
  return out;
}

function maskPartial(raw: string) {
  if (raw.length <= 6) return "*".repeat(raw.length);
  return raw.slice(0, 2) + "*".repeat(raw.length - 4) + raw.slice(-2);
}

function printHelp() {
  console.log(`hsx-cli usage:
  hsx-cli scrub <file>
Environment:
  HSX_SIGNATURE_DIR
  HSX_POLICY_PATH
  PHI_SALT`);
}

main();