import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { convert } from "./utils/convert-strongs";

export interface StrongsEntryResponse {
  strongs: string;
  greek: {
    beta: string;
    unicode: string;
    translit: string;
  };
  pronunciation: string;
  derivation?: string;
  derivationRef?: string;
  strongsDef: string;
  kjvDef: string;
  see?: string;
}

@Injectable()
export class StrongsKJVService implements OnModuleInit {
  private strongsData: Map<string, StrongsEntryResponse> = new Map();

  async onModuleInit() {
    // await convert();

    const filePath = path.join("data", "strongs-greek-dictionary.json");
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `JSON file not found at ${filePath}. Make sure it exists and is copied to dist`
      );
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(raw);

    const entries = json.strongsdictionary?.entries?.entry;
    if (!entries) {
      throw new Error("No entries found in JSON");
    }

    const arrayEntries = Array.isArray(entries) ? entries : [entries];

    for (const entry of arrayEntries) {
      const strongsId = entry?.strongs?.padStart(5, "0");
      if (!strongsId) continue;

      const normalized: StrongsEntryResponse = {
        strongs: strongsId,
        greek: {
          beta: entry?.greek?.$?.BETA || "",
          unicode: entry?.greek?.$?.unicode || "",
          translit: entry?.greek?.$?.translit || "",
        },
        pronunciation: entry?.pronunciation?.$?.strongs || "",
        derivation: typeof entry?.strongs_derivation === "string"
          ? entry.strongs_derivation
          : entry?.strongs_derivation?._ || "",
        derivationRef: entry?.strongs_derivation?.strongsref?.$?.strongs || undefined,
        strongsDef: entry?.strongs_def || "",
        kjvDef: entry?.kjv_def || "",
        see: entry?.see?.$?.strongs || undefined,
      };

      this.strongsData.set(strongsId, normalized);
    }

    if (this.strongsData.size === 0) {
      throw new NotFoundException("No Strong's entries found");
    }

    console.log(`✅ Loaded ${this.strongsData.size} Strong's entries`);
  }

  // Fetch all entries (paginated)
  findAll(page = 1, limit = 100): StrongsEntryResponse[] {
    const allEntries = Array.from(this.strongsData.values());
    const start = (page - 1) * limit;
    const end = start + limit;
    return allEntries.slice(start, end);
  }

  // Fetch a single entry by Strong's number
  findById(id: string): StrongsEntryResponse {
    const strongsId = id.padStart(5, "0");
    const entry = this.strongsData.get(strongsId);
    if (!entry) {
      throw new NotFoundException(`Strong's number ${id} not found`);
    }
    return entry;
  }
}
