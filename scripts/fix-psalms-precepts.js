/*
 * One-time data fix for precepts saved while the app counted Psalm titles
 * ("A Psalm of David.") and Psalm 119 letter headings ("ALEPH") as verses.
 *
 * Because of that bug, a precept such as "Psalms 23:1" could have been saved
 * with the text "A Psalm of David." instead of "The LORD is my shepherd...".
 *
 * For every SCRIPTURE precept, each "<Book> <ch>:<v> - <text>" block whose
 * book is Psalms is checked against data/psalms-verse-fix.json:
 *   - if <text> equals what the buggy app returned for that verse number,
 *     it is replaced with the correct KJV verse text;
 *   - anything else (correct text, user-edited text) is left untouched.
 *
 * Usage (from the project root, with DATABASE_URL set):
 *   node scripts/fix-psalms-precepts.js          # dry run, prints a report
 *   node scripts/fix-psalms-precepts.js --apply  # writes the changes
 */
"use strict";

const fs = require("fs");
const path = require("path");

const APPLY = process.argv.includes("--apply");
const MAP_FILE = path.join(__dirname, "..", "data", "psalms-verse-fix.json");

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

const PSALMS_BOOK = /^(psalms?|psa|ps)$/i;
// "Psalms 23:1 - The LORD is my shepherd; I shall not want."
const BLOCK = /^(.+?)\s+(\d+):(\d+)\s+-\s+([\s\S]*)$/;

function fixContent(content, map) {
  const blocks = String(content).split(/\n\n/);
  const changes = [];
  const fixed = blocks.map((block) => {
    const m = BLOCK.exec(block.trim());
    if (!m) return block;
    const [, book, chStr, vStr, text] = m;
    if (!PSALMS_BOOK.test(book.trim())) return block;
    const chapter = map[String(Number(chStr))];
    if (!chapter) return block; // chapter had no title: nothing shifted
    const v = Number(vStr);
    const oldText = chapter.old[v - 1];
    const newText = chapter.new[v - 1];
    if (oldText === undefined || newText === undefined) return block;
    if (oldText === newText) return block;
    if (norm(text) !== norm(oldText)) return block; // not produced by the bug
    changes.push({
      ref: `${book.trim()} ${chStr}:${vStr}`,
      from: text,
      to: newText,
    });
    return `${book.trim()} ${chStr}:${vStr} - ${newText}`;
  });
  return { content: fixed.join("\n\n"), changes };
}

async function main() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  const map = JSON.parse(fs.readFileSync(MAP_FILE, "utf8")).chapters;

  const precepts = await prisma.precept.findMany({
    where: {
      type: "SCRIPTURE",
      OR: [
        { reference: { startsWith: "Psalm", mode: "insensitive" } },
        { content: { contains: "Psalm", mode: "insensitive" } },
      ],
    },
    select: { id: true, reference: true, content: true, topicId: true },
  });

  let touched = 0;
  for (const p of precepts) {
    const { content, changes } = fixContent(p.content, map);
    if (!changes.length) continue;
    touched++;
    console.log(`\nPrecept ${p.id} (${p.reference})`);
    for (const c of changes) {
      console.log(`  ${c.ref}\n    - ${c.from}\n    + ${c.to}`);
    }
    if (APPLY) {
      await prisma.precept.update({ where: { id: p.id }, data: { content } });
    }
  }

  console.log(
    `\nChecked ${precepts.length} Psalms precepts, ${touched} need fixing.` +
      (APPLY
        ? " Changes saved."
        : " Dry run only; re-run with --apply to save."),
  );
  await prisma.$disconnect();
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { fixContent };
