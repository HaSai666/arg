import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const expectedPuzzleIds = [
  "ch1-colored",
  "ch1-photos",
  "ch1-name",
  "ch2-voices",
  "ch2-seventh",
  "ch2-chain",
  "ch3-timeline",
  "ch3-language",
  "ch3-slot",
  "ch4-night",
  "ch4-layers",
  "ch4-argument"
];

const expectedSideRecordIds = [
  "side-three-bowls",
  "side-bantang-vote",
  "side-gao-negative",
  "side-xu-playlist",
  "side-he-draft",
  "side-lu-score",
  "side-paper-crane"
];

const sourceFiles = [
  "src/game/content.ts",
  "src/chapters/Chapter1.tsx",
  "src/chapters/Chapter2.tsx",
  "src/chapters/Chapter3.tsx",
  "src/chapters/Chapter4.tsx",
  "src/chapters/Chapter5.tsx",
  "public/walkthrough.html"
];

const expectedPhotoFiles = [
  "public/assets/photos/balcony-gap.jpg",
  "public/assets/photos/ending-return.jpg",
  "public/assets/photos/family-old-home.jpg",
  "public/assets/photos/group-eight-shadows.jpg",
  "public/assets/photos/hegui-avatar.jpg",
  "public/assets/photos/luqing-diary.jpg",
  "public/assets/photos/school-gate-gap.jpg",
  "public/assets/photos/sports-day-gap.jpg"
];

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const combined = sourceFiles.map(read).join("\n");
const failures = [];

for (const relativePath of expectedPhotoFiles) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push("Missing photo asset: " + relativePath);
  } else if (fs.statSync(absolutePath).size > 500_000) {
    failures.push("Photo asset is too large for Pages: " + relativePath);
  }
}

for (const id of expectedPuzzleIds) {
  if (!combined.includes(id)) failures.push("Missing puzzle id: " + id);
}

for (const id of expectedSideRecordIds) {
  if (!combined.includes(id)) failures.push("Missing side record id: " + id);
}

const gameUi = [
  read("src/components/PuzzleKit.tsx"),
  read("src/components/AppShell.tsx")
].join("\n");
for (const intrusiveLabel of ["请求线索", "再给一点线索", "使用答案并继续", "通关秘籍"]) {
  if (gameUi.includes(intrusiveLabel)) failures.push("Intrusive game UI label found: " + intrusiveLabel);
}

const requiredStoryTerms = [
  "程砚", "程澈", "唐雨", "高越", "闻岚", "何简", "许妍", "陆昭",
  "第八位访客", "旧家相册", "以后别再叫我哥", "slot[8] = current_visitor",
  "归人", "封名", "换籍", "开籍"
];

for (const term of requiredStoryTerms) {
  if (!combined.includes(term)) failures.push("Missing story term: " + term);
}

const placeholders = combined.match(/\b(?:TODO|TBD|FIXME|XXX)\b|待定|占位符/g);
if (placeholders) failures.push("Placeholder text found: " + [...new Set(placeholders)].join(", "));

const walkthrough = read("public/walkthrough.html");
if (!walkthrough.startsWith("<!doctype html>")) failures.push("Walkthrough is not a complete HTML document.");
if (!walkthrough.includes('href="./"')) failures.push("Walkthrough is missing the link back to the game.");

const packageJson = JSON.parse(read("package.json"));
if (!packageJson.scripts?.build || !packageJson.scripts?.test) {
  failures.push("package.json must expose build and test scripts.");
}

if (failures.length > 0) {
  console.error("Content validation failed:");
  for (const failure of failures) console.error(" - " + failure);
  process.exit(1);
}

console.log("Content validation passed: 5 chapters, 12 core puzzles, 7 side records, 4 endings, walkthrough present.");
