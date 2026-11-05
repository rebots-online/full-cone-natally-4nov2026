import { createHash } from "node:crypto";
import { existsSync, readFileSync, cpSync } from "node:fs";
import { join } from "node:path";

const [stageDir, builtDir] = process.argv.slice(2);
if (!stageDir || !builtDir) {
  console.error("usage: node stage-marketing-overlay.mjs <stageDir> <builtDir>");
  process.exit(1);
}

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

const stageIndexPath = join(stageDir, "index.html");
const builtIndexPath = join(builtDir, "index.html");
if (!existsSync(builtIndexPath)) throw new Error(`missing built index.html: ${builtIndexPath}`);
// Expected staged base is the unified entry document of this exact build; the
// pre-unification frozen-content pin is updated to equality with the build.
const stagedIndex = readFileSync(stageIndexPath);
if (!stagedIndex.equals(readFileSync(builtIndexPath))) {
  throw new Error(`staged index.html does not match the built unified entry document: ${sha256(stagedIndex)}`);
}

const landingPath = join(builtDir, "landing.html");
if (!existsSync(landingPath)) throw new Error(`missing built landing.html: ${landingPath}`);
const landing = readFileSync(landingPath, "utf8");
if (!landing.includes("marketing-experience-root")) throw new Error("landing.html missing marketing-experience-root");
if (!landing.includes("natally-version")) throw new Error("landing.html missing natally-version");
if (landing.includes("/src/marketing.tsx")) throw new Error("landing.html has raw /src/marketing.tsx reference");

const marketingPath = join(builtDir, "marketing.html");
if (!existsSync(marketingPath)) throw new Error(`missing built marketing.html: ${marketingPath}`);
const marketing = readFileSync(marketingPath, "utf8");
if (!marketing.includes("natally-release-id")) throw new Error("marketing.html redirect document missing natally-release-id");

for (const dir of ["assets", "marketing-assets", "auth"]) {
  const src = join(builtDir, dir);
  if (existsSync(src)) cpSync(src, join(stageDir, dir), { recursive: true, force: true });
}

cpSync(marketingPath, join(stageDir, "marketing.html"), { force: true });
cpSync(landingPath, join(stageDir, "landing.html"), { force: true });

const stagedMarketingPath = join(stageDir, "marketing.html");
const stagedLandingPath = join(stageDir, "landing.html");
console.log(JSON.stringify({
  stage: stageDir,
  indexSha256: sha256(stagedIndex),
  marketingSha256: sha256(readFileSync(stagedMarketingPath)),
  landingSha256: sha256(readFileSync(stagedLandingPath)),
}));
