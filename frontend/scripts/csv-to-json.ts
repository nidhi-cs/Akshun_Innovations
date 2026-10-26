import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const audienceValues = ["school", "college", "iti", "polytechnic", "industry"] as const;
const rowSchema = z.object({
  id: z.string().min(1),
  modelNo: z.string().regex(/^AKI-E\d{3}$/, "must match AKI-E###"),
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  departmentSlug: z.string().min(1),
  categorySlug: z.string().min(1),
  shortDescription: z.string().max(160),
  description: z.string().min(1),
  features: z.string().min(1),
  specs: z.string().min(1),
  experiments: z.string().optional().default(""),
  includedAccessories: z.string().optional().default(""),
  images: z.string().min(1),
  datasheetUrl: z.string().optional().default(""),
  audience: z.string().min(1),
  tags: z.string().min(1),
  isFeatured: z.string().transform((value) => value.toLowerCase() === "true"),
  isNew: z.string().transform((value) => value.toLowerCase() === "true"),
});

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      fields.push(field.trim());
      field = "";
    } else {
      field += character;
    }
  }
  fields.push(field.trim());
  return fields;
}

function list(value: string): string[] {
  return value.split("|").map((item) => item.trim()).filter(Boolean);
}

function specs(value: string): { label: string; value: string }[] {
  return list(value).map((entry) => {
    const separator = entry.indexOf(":");
    if (separator < 1) throw new Error(`spec "${entry}" must use Label: Value`);
    return { label: entry.slice(0, separator).trim(), value: entry.slice(separator + 1).trim() };
  });
}

async function main(): Promise<void> {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] ?? path.resolve(process.cwd(), "data/products.json");
  if (!inputPath) throw new Error("Usage: npx tsx scripts/csv-to-json.ts <input.csv> [output.json]");

  const lines = (await readFile(inputPath, "utf8")).split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) throw new Error("CSV must include a header and at least one product row.");
  const headers = parseCsvLine(lines[0]);
  const products = lines.slice(1).map((line, index) => {
    const rowNumber = index + 2;
    try {
      const values = parseCsvLine(line);
      const record = Object.fromEntries(headers.map((header, headerIndex) => [header, values[headerIndex] ?? ""]));
      const parsed = rowSchema.parse(record);
      const audience = list(parsed.audience);
      const invalidAudience = audience.filter((value) => !audienceValues.includes(value as (typeof audienceValues)[number]));
      if (invalidAudience.length) throw new Error(`audience contains invalid value(s): ${invalidAudience.join(", ")}`);
      return {
        id: parsed.id,
        modelNo: parsed.modelNo,
        name: parsed.name,
        slug: parsed.slug,
        departmentSlug: parsed.departmentSlug,
        categorySlug: parsed.categorySlug,
        shortDescription: parsed.shortDescription,
        description: parsed.description,
        features: list(parsed.features),
        specs: specs(parsed.specs),
        ...(parsed.experiments ? { experiments: list(parsed.experiments) } : {}),
        ...(parsed.includedAccessories ? { includedAccessories: list(parsed.includedAccessories) } : {}),
        images: list(parsed.images),
        ...(parsed.datasheetUrl ? { datasheetUrl: parsed.datasheetUrl } : {}),
        audience,
        tags: list(parsed.tags),
        isFeatured: parsed.isFeatured,
        isNew: parsed.isNew,
      };
    } catch (error) {
      const detail = error instanceof z.ZodError ? error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ") : error instanceof Error ? error.message : String(error);
      throw new Error(`Row ${rowNumber}: ${detail}`);
    }
  });

  await writeFile(outputPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  console.log(`Imported ${products.length} products into ${outputPath}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
