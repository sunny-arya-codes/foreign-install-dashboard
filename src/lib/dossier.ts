import { cache } from "react";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export type ScholarshipLink = {
  label: string;
  url: string;
};

export type RootDoc = {
  slug: string;
  title: string;
  markdown: string;
};

export type TrackerRow = {
  country: string;
  university: string;
  program: string;
  programSlug: string;
  programKey: string;
  degreeType: string;
  fitLabel: string;
  fundingFit: string;
  status: string;
  countrySlug: string;
  universitySlug: string;
};

export type ProgramDetail = {
  title: string;
  degreeType: string;
  fitLabel: string;
  why: string;
  requirements: string[];
  documents: string[];
  timingNote: string;
  sources: ScholarshipLink[];
};

export type UniversityDetail = {
  name: string;
  slug: string;
  academicFit: string;
  fundingFit: string;
  whyShortlisted: string;
  finalNote: string;
  rawMarkdown: string;
  programs: ProgramDetail[];
};

export type CountryDetail = {
  name: string;
  slug: string;
  tier: "A" | "B" | "C";
  budgetFit: string;
  bestUseCase: string;
  overviewMarkdown: string;
  documentsMarkdown: string;
  scholarships: ScholarshipLink[];
  universities: UniversityDetail[];
  programCount: number;
  scholarshipCount: number;
  highFitCount: number;
};

export type DossierData = {
  profile: {
    degree: string;
    completion: string;
    cgpa: string;
    experience: string;
  };
  generatedAt: string;
  techStack: {
    framework: string;
    version: string;
    officialReference: string;
  };
  rootDocs: RootDoc[];
  commonDocs: RootDoc[];
  tracker: TrackerRow[];
  countries: CountryDetail[];
  stats: {
    totalCountries: number;
    totalPrograms: number;
    totalScholarshipLinks: number;
    totalHighFitPrograms: number;
    totalStrongFundingPrograms: number;
  };
};

const DOSSIER_ROOT = join(process.cwd(), "content", "dossier");

const COUNTRY_META: Record<
  string,
  { tier: "A" | "B" | "C"; budgetFit: string; bestUseCase: string }
> = {
  Germany: {
    tier: "A",
    budgetFit: "Very strong",
    bestUseCase: "Main master's route",
  },
  Taiwan: {
    tier: "A",
    budgetFit: "Very strong",
    bestUseCase: "Scholarship-led technical master's",
  },
  Finland: {
    tier: "A",
    budgetFit: "Strong if scholarship",
    bestUseCase: "High-quality master's with fee waiver",
  },
  South_Korea: {
    tier: "A",
    budgetFit: "Strong",
    bestUseCase: "Funded AI / CS MS-PhD routes",
  },
  New_Zealand: {
    tier: "A",
    budgetFit: "Strong for PhD",
    bestUseCase: "Research-heavy path",
  },
  Singapore: {
    tier: "B",
    budgetFit: "Medium only with funding",
    bestUseCase: "Premium outcome, selective, costly",
  },
  UK: {
    tier: "B",
    budgetFit: "Medium only with funding",
    bestUseCase: "1-year master's if funded",
  },
  Australia: {
    tier: "B",
    budgetFit: "Medium only with funding",
    bestUseCase: "RTP / research or partial-fee route",
  },
  US: {
    tier: "C",
    budgetFit: "Weak without funding",
    bestUseCase: "Funded PhD / thesis MS only",
  },
  Norway: {
    tier: "C",
    budgetFit: "Weak",
    bestUseCase: "Backup only",
  },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readText(relativePath: string) {
  return readFileSync(join(DOSSIER_ROOT, relativePath), "utf8");
}

function titleFromMarkdown(markdown: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "Untitled";
}

function parseMarkdownLinks(markdown: string): ScholarshipLink[] {
  return Array.from(markdown.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)).map(
    ([, label, url]) => ({
      label,
      url,
    }),
  );
}

function parseBulletLines(block: string) {
  return block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function between(text: string, startLabel: string, endLabel?: string) {
  const startIndex = text.indexOf(startLabel);
  if (startIndex === -1) return "";
  const afterStart = text.slice(startIndex + startLabel.length);
  if (!endLabel) return afterStart.trim();
  const endIndex = afterStart.indexOf(endLabel);
  if (endIndex === -1) return afterStart.trim();
  return afterStart.slice(0, endIndex).trim();
}

function parseCsv(input: string) {
  const rows: string[][] = [];
  let currentField = "";
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentField += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
      }
      currentField = "";
      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

function parseTracker() {
  const [headerRow, ...dataRows] = parseCsv(readText("05_Application_Tracker.csv"));
  const headerIndex = Object.fromEntries(
    headerRow.map((column, index) => [column, index]),
  );

  return dataRows.map((row) => {
    const country = row[headerIndex.country];
    const university = row[headerIndex.university];
    const program = row[headerIndex.program];

    return {
      country,
      university,
      program,
      programSlug: slugify(program),
      programKey: [country, university, program].map(slugify).join("__"),
      degreeType: row[headerIndex.degree_type],
      fitLabel: row[headerIndex.fit_label],
      fundingFit: row[headerIndex.funding_fit],
      status: row[headerIndex.status],
      countrySlug: slugify(country),
      universitySlug: slugify(university),
    } satisfies TrackerRow;
  });
}

function parseProgramBlocks(section: string) {
  return section
    .split(/\n(?=### )/g)
    .map((entry) => entry.trim())
    .filter((entry) => entry.startsWith("### "));
}

function parseUniversity(relativePath: string): UniversityDetail {
  const rawMarkdown = readText(relativePath);
  const name = titleFromMarkdown(rawMarkdown);
  const fitSummary = between(rawMarkdown, "## Fit summary", "## Program shortlist");
  const academicFit =
    fitSummary.match(/- Academic fit:\s*(.+)/)?.[1]?.trim() ?? "Unknown";
  const fundingFit =
    fitSummary.match(/- Funding fit:\s*(.+)/)?.[1]?.trim() ?? "Unknown";
  const whyShortlisted =
    fitSummary.match(/- Why shortlisted:\s*(.+)/)?.[1]?.trim() ?? "";

  const finalNote =
    between(rawMarkdown, "## Final note").replace(/\n+/g, " ").trim() ?? "";
  const programSection = between(
    rawMarkdown,
    "## Program shortlist",
    "## Final note",
  );

  const programs = parseProgramBlocks(programSection).map((block) => {
    const title =
      block.match(/^###\s+\d+\.\s+(.+)$/m)?.[1]?.trim() ?? "Untitled Program";
    const degreeType =
      block.match(/- Degree type:\s*(.+)/)?.[1]?.trim() ?? "Unknown";
    const fitLabel =
      block.match(/- My fit label:\s*(.+)/)?.[1]?.trim() ?? "Unknown";
    const why =
      block.match(/- Why this matters:\s*(.+)/)?.[1]?.trim() ?? "";
    const requirements = parseBulletLines(
      between(block, "Published requirement snapshot:", "Typical documents to prepare:"),
    );
    const documents = parseBulletLines(
      between(block, "Typical documents to prepare:", "Official sources:"),
    ).filter((item) => !item.startsWith("Timing note:"));
    const timingNote =
      block.match(/- Timing note:\s*(.+)/)?.[1]?.trim() ?? "Verify live cycle.";
    const sources = parseMarkdownLinks(between(block, "Official sources:"));

    return {
      title,
      degreeType,
      fitLabel,
      why,
      requirements,
      documents,
      timingNote,
      sources,
    } satisfies ProgramDetail;
  });

  return {
    name,
    slug: slugify(name),
    academicFit,
    fundingFit,
    whyShortlisted,
    finalNote,
    rawMarkdown,
    programs,
  };
}

function parseCountry(countryFolder: string): CountryDetail {
  const universitiesRoot = join(DOSSIER_ROOT, countryFolder, "Universities");
  const universityFolders = readdirSync(universitiesRoot).filter((entry) =>
    statSync(join(universitiesRoot, entry)).isDirectory(),
  );

  const universities = universityFolders
    .map((folder) =>
      parseUniversity(join(countryFolder, "Universities", folder, "Programs_and_Requirements.md")),
    )
    .sort((left, right) => left.name.localeCompare(right.name));

  const meta = COUNTRY_META[countryFolder];
  const scholarshipLinks = parseMarkdownLinks(
    readText(join(countryFolder, "02_Scholarships.md")),
  );

  return {
    name: countryFolder.replaceAll("_", " "),
    slug: slugify(countryFolder),
    tier: meta.tier,
    budgetFit: meta.budgetFit,
    bestUseCase: meta.bestUseCase,
    overviewMarkdown: readText(join(countryFolder, "00_Country_Overview.md")),
    documentsMarkdown: readText(join(countryFolder, "01_Country_Documents.md")),
    scholarships: scholarshipLinks,
    universities,
    programCount: universities.reduce(
      (total, university) => total + university.programs.length,
      0,
    ),
    scholarshipCount: scholarshipLinks.length,
    highFitCount: universities.reduce(
      (total, university) =>
        total +
        university.programs.filter((program) => program.fitLabel === "High").length,
      0,
    ),
  };
}

function parseRootDocs(folderName?: string) {
  const basePath = folderName ? join(DOSSIER_ROOT, folderName) : DOSSIER_ROOT;
  return readdirSync(basePath)
    .filter((entry) => entry.endsWith(".md"))
    .sort()
    .map((entry) => {
      const relativePath = folderName ? join(folderName, entry) : entry;
      const markdown = readText(relativePath);
      return {
        slug: slugify(entry.replace(/^\d+_/, "").replace(/\.md$/, "")),
        title: titleFromMarkdown(markdown),
        markdown,
      } satisfies RootDoc;
    });
}

function parseProfile(readmeMarkdown: string) {
  const lines = readmeMarkdown.split("\n");
  const bulletLines = lines.filter((line) => line.startsWith("- "));
  const cleanValue = (value: string) =>
    value.replace(/^- /, "").replace(/`/g, "").trim();

  return {
    degree:
      cleanValue(bulletLines[0] ?? "") ||
      "IIT Madras B.S. in Data Science and Applications",
    completion:
      cleanValue(bulletLines[1] ?? "").replace("Expected completion:", "").trim() ||
      "Apr/May 2026",
    cgpa:
      cleanValue(bulletLines[2] ?? "").replace("Current CGPA:", "").trim() ||
      "~7.0/10",
    experience:
      cleanValue(bulletLines[3] ?? "") ||
      "Backend / GenAI engineering experience at FreshMenu",
  };
}

export const getDossier = cache((): DossierData => {
  const readmeMarkdown = readText("README.md");
  const tracker = parseTracker();
  const countries = Object.keys(COUNTRY_META).map(parseCountry);

  return {
    profile: parseProfile(readmeMarkdown),
    generatedAt: "2026-04-08",
    techStack: {
      framework: "Next.js",
      version: "16.2.2",
      officialReference: "https://nextjs.org/blog",
    },
    rootDocs: parseRootDocs().filter(
      (doc) =>
        doc.title !== "Abroad Study Research Dossier" &&
        doc.slug !== "application-tracker",
    ),
    commonDocs: parseRootDocs("Common_Documents"),
    tracker,
    countries,
    stats: {
      totalCountries: countries.length,
      totalPrograms: tracker.length,
      totalScholarshipLinks: countries.reduce(
        (total, country) => total + country.scholarships.length,
        0,
      ),
      totalHighFitPrograms: tracker.filter((program) => program.fitLabel === "High")
        .length,
      totalStrongFundingPrograms: tracker.filter((program) =>
        program.fundingFit.includes("Strong"),
      ).length,
    },
  };
});

export function getCountryBySlug(slug: string) {
  return getDossier().countries.find((country) => country.slug === slug);
}
