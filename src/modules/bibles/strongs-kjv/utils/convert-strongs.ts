import fs from "fs";
import path from "path";
import { parseStringPromise } from "xml2js";

// Define the structure of a single XML entry
interface StrongsEntry {
    $: { id: string };
    lemma?: string;
    translit?: string;
    pron?: string;
    definition?: string;
    usage?: string;
}

// Define the dictionary type
interface StrongsDictionary {
    [id: string]: {
        strongs: string;
        lemma?: string;
        translit?: string;
        pron?: string;
        definition?: string;
        usage?: string;
    };
}

export async function convert(): Promise<void> {
    try {
        // Path to your XML file
        const xmlFilePath = path.join(
            "data",
            "strongsgreek.xml"
        );
    

        const xml = fs.readFileSync(xmlFilePath, "utf8");

        // Parse XML to JS object
        const result = await parseStringPromise(xml, { explicitArray: false });
        // console.log("Parsed XML structure:", JSON.stringify(result, null, 2));

        // // Access entries (adjust path based on XML structure)
        // let entries: StrongsEntry[] | StrongsEntry | undefined =
        //     result?.lexicon?.entry;

        // if (!entries) {
        //     console.error("❌ No entries found in XML!");
        //     return;
        // }

        // // Ensure entries is always an array
        // if (!Array.isArray(entries)) entries = [entries];

        // const dictionary: StrongsDictionary = {};

        // for (const entry of entries) {
        //     const id = entry.$?.id;
        //     if (!id) continue;

        //     dictionary[id] = {
        //         strongs: id,
        //         lemma: entry.lemma,
        //         translit: entry.translit,
        //         pron: entry.pron,
        //         definition: entry.definition,
        //         usage: entry.usage,
        //     };
        // }

        // Output JSON file
        const jsonFilePath = path.join(
            "data",
            "strongs-greek-dictionary.json"
        );

        fs.writeFileSync(jsonFilePath, JSON.stringify(result, null, 2), "utf8");
    } catch (err) {
        console.error("❌ Error converting XML to JSON:", err);
    }
}

// import fs from "fs";
// import path from "path";
// import { parseStringPromise } from "xml2js";

// // Define the structure of a single XML entry
// interface StrongsEntryXML {
//   $: { id: string };
//   lemma?: string;
//   translit?: string;
//   pron?: string;
//   definition?: string;
//   usage?: string;
// }

// // Define the dictionary type
// interface StrongsDictionary {
//   [id: string]: {
//     strongs: string;
//     lemma?: string;
//     translit?: string;
//     pron?: string;
//     definition?: string;
//     usage?: string;
//   };
// }

// export async function convert(): Promise<void> {
//   try {
//     // 1️⃣ Path to XML file
//     const xmlFilePath = path.join("data", "strongsgreek.xml");

//     if (!fs.existsSync(xmlFilePath)) {
//       throw new Error(`XML file not found at ${xmlFilePath}`);
//     }

//     const xml = fs.readFileSync(xmlFilePath, "utf8");

//     // 2️⃣ Parse XML
//     const result = await parseStringPromise(xml, { explicitArray: false });

//     // 3️⃣ Extract entries (adjust path based on XML structure)
//     let entries: StrongsEntryXML[] | StrongsEntryXML | undefined =
//       result?.root?.lexicon?.entry;

//     if (!entries) {
//       console.error("❌ No entries found in XML!");
//       return;
//     }

//     // 4️⃣ Ensure entries is always an array
//     if (!Array.isArray(entries)) entries = [entries];

//     // 5️⃣ Convert to dictionary
//     const dictionary: StrongsDictionary = {};
//     for (const entry of entries) {
//       const id = entry.$?.id;
//       if (!id) continue;

//       dictionary[id] = {
//         strongs: id,
//         lemma: entry.lemma,
//         translit: entry.translit,
//         pron: entry.pron,
//         definition: entry.definition,
//         usage: entry.usage,
//       };
//     }

//     // 6️⃣ Output JSON file
//     const jsonFilePath = path.join("data", "strongs-greek-dictionary.json");
//     fs.writeFileSync(jsonFilePath, JSON.stringify(dictionary, null, 2), "utf8");

//     console.log(`✅ Converted XML → JSON successfully (${Object.keys(dictionary).length} entries)`);
//   } catch (err: any) {
//     console.error("❌ Error converting XML to JSON:", err.message || err);
//   }
// }

