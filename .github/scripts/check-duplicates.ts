import fs from "node:fs";
import jsonc from "jsonc-parser";

const files = fs.readdirSync("./lists");
const duplicates: any[] = [];

function check(parsed: any) {
    if (typeof parsed === "object") {
        for (const value of Object.values(parsed)) {
            check(value);
        }
    } else if (Array.isArray(parsed)) {
        const values: any[] = [];
        for (const value of parsed) {
            if (values.includes(value)) {
                duplicates.push(value);
            } else {
                values.push(value);
            }
        }
    }
}

for (const file of files) {
    const parsed = jsonc.parse(fs.readFileSync(`./lists/${file}`, "utf-8"));
    check(parsed);
}

if (duplicates.length > 0) throw "Duplicate values found: " + duplicates.join(", ");
else console.log("No duplicates found!");
