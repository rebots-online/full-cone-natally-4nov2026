import { createHash } from "node:crypto";
import { existsSync, readFileSync, cpSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [stageDir, builtDir] = process.argv.slice(2);
if (!stageDir || !builtDir) {
  console.error("usage: node stage-marketing-overlay.mjs <stageDir> <builtDir>");
  process.exit(1);
}

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

const stageIndexPath = join(stageDir, "index.html");
const stageIndexHash = sha256(readFileSync(stageIndexPath));
if (stageIndexHash !== "e3ad942d63bf7dc179688ac845c739212ad133fc26842ff4dc1976dbdd062baa") {
  throw new Error(`staged index.html hash mismatch: ${stageIndexHash}`);
}

const marketingPath = join(builtDir, "marketing.html");
if (!existsSync(marketingPath)) throw new Error(`missing built marketing.html: ${marketingPath}`);

const marketing = readFileSync(marketingPath, "utf8");
if (!marketing.includes("natally-version")) throw new Error("marketing.html missing natally-version");
if (marketing.includes("/src/marketing.tsx")) throw new Error("marketing.html has raw /src/marketing.tsx reference");

for (const dir of ["assets", "marketing-assets", "auth"]) {
  const src = join(builtDir, dir);
  if (existsSync(src)) cpSync(src, join(stageDir, dir), { recursive: true, force: true });
}

cpSync(marketingPath, join(stageDir, "marketing.html"), { force: true });

const redirectScript = `<script>
(function () {
  var p = location.pathname;
  if (p !== "/" && p !== "/index.html") return;
  if (new URLSearchParams(location.search).get("app") === "1") return;
  var offer = new URLSearchParams(location.search).get("offer");
  if (offer === "reading" || offer === "conversation") return;
  var u = new URL("/marketing.html", location.origin);
  u.search = location.search;
  u.hash = location.hash;
  location.replace(u.href);
})();
</script>`;

let index = readFileSync(stageIndexPath, "utf8");
const headAt = index.indexOf("<head>");
if (headAt === -1) throw new Error("index.html has no <head>");
const insertAt = headAt + "<head>".length;
index = index.slice(0, insertAt) + "\n" + redirectScript + index.slice(insertAt);
writeFileSync(stageIndexPath, index);

const stagedMarketingPath = join(stageDir, "marketing.html");
console.log(JSON.stringify({
  stage: stageDir,
  indexSha256: sha256(readFileSync(stageIndexPath)),
  marketingSha256: sha256(readFileSync(stagedMarketingPath)),
}));
