import type { TrackerRow } from "@/lib/dossier";

export const PLANNER_STORAGE_KEY = "foreign-install-dashboard/v1";

export const TRACKER_STAGES = [
  { id: "research", label: "Research" },
  { id: "priority", label: "Priority" },
  { id: "applying", label: "Applying" },
  { id: "submitted", label: "Submitted" },
  { id: "decision", label: "Decision" },
] as const;

export const PRIORITY_LEVELS = ["P1", "P2", "P3"] as const;

export const COUNTRY_MODES = [
  { id: "focus", label: "Focus" },
  { id: "active", label: "Active" },
  { id: "backup", label: "Backup" },
  { id: "drop", label: "Drop" },
] as const;

export const DEGREE_TARGETS = ["Either", "Masters", "PhD"] as const;
export const INTAKE_TARGETS = ["Spring 2027", "Fall 2027", "Rolling"] as const;
export const BUDGET_MODES = ["Tight", "Moderate", "Flexible"] as const;
export const TEST_STATUSES = [
  "Not started",
  "Planning",
  "Booked",
  "Completed",
] as const;
export const GRE_MODES = [
  "Skip unless required",
  "Take only for selective options",
  "Definitely taking",
] as const;
export const DOC_PROGRESS = [
  "Not started",
  "In progress",
  "Ready",
] as const;

export type TrackerStage = (typeof TRACKER_STAGES)[number]["id"];
export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];
export type CountryMode = (typeof COUNTRY_MODES)[number]["id"];

export type PlannerPreferences = {
  targetDegree: (typeof DEGREE_TARGETS)[number];
  targetIntake: (typeof INTAKE_TARGETS)[number];
  budgetMode: (typeof BUDGET_MODES)[number];
  englishTest: (typeof TEST_STATUSES)[number];
  grePlan: (typeof GRE_MODES)[number];
  sopStatus: (typeof DOC_PROGRESS)[number];
  lorStatus: (typeof DOC_PROGRESS)[number];
  cvStatus: (typeof DOC_PROGRESS)[number];
};

export type CountryPlan = {
  mode: CountryMode;
  note: string;
};

export type ProgramPlan = {
  stage: TrackerStage;
  priority: PriorityLevel;
  shortlist: boolean;
  deadline: string;
  note: string;
};

export type PlannerState = {
  version: 1;
  updatedAt: string | null;
  preferences: PlannerPreferences;
  countries: Record<string, CountryPlan>;
  programs: Record<string, ProgramPlan>;
};

export const DEFAULT_PREFERENCES: PlannerPreferences = {
  targetDegree: "Either",
  targetIntake: "Fall 2027",
  budgetMode: "Tight",
  englishTest: "Planning",
  grePlan: "Skip unless required",
  sopStatus: "Not started",
  lorStatus: "Not started",
  cvStatus: "In progress",
};

export const DEFAULT_PROGRAM_PLAN: ProgramPlan = {
  stage: "research",
  priority: "P3",
  shortlist: false,
  deadline: "",
  note: "",
};

export function getDefaultPlannerState(): PlannerState {
  return {
    version: 1,
    updatedAt: null,
    preferences: DEFAULT_PREFERENCES,
    countries: {},
    programs: {},
  };
}

export function inferStageFromStatus(status: string): TrackerStage {
  const normalized = status.toLowerCase();

  if (normalized.includes("decision")) return "decision";
  if (normalized.includes("submitted")) return "submitted";
  if (normalized.includes("apply")) return "applying";
  if (normalized.includes("priority")) return "priority";

  return "research";
}

export function getProgramFallbackPlan(program: TrackerRow): ProgramPlan {
  return {
    ...DEFAULT_PROGRAM_PLAN,
    stage: inferStageFromStatus(program.status),
    priority: program.fitLabel === "High" ? "P1" : program.fitLabel === "Medium" ? "P2" : "P3",
  };
}

export function getCountryFallbackMode(tier: "A" | "B" | "C"): CountryMode {
  if (tier === "A") return "focus";
  if (tier === "B") return "active";
  return "backup";
}

export function normalizePlannerState(value: unknown): PlannerState {
  const fallback = getDefaultPlannerState();

  if (!value || typeof value !== "object") return fallback;

  const candidate = value as Partial<PlannerState>;

  return {
    version: 1,
    updatedAt:
      typeof candidate.updatedAt === "string" ? candidate.updatedAt : fallback.updatedAt,
    preferences: {
      ...fallback.preferences,
      ...(candidate.preferences && typeof candidate.preferences === "object"
        ? candidate.preferences
        : {}),
    },
    countries:
      candidate.countries && typeof candidate.countries === "object"
        ? Object.fromEntries(
            Object.entries(candidate.countries).map(([key, entry]) => [
              key,
              {
                mode:
                  entry && typeof entry === "object" && "mode" in entry
                    ? ((entry.mode as CountryMode) ?? "active")
                    : "active",
                note:
                  entry && typeof entry === "object" && "note" in entry
                    ? String(entry.note ?? "")
                    : "",
              },
            ]),
          )
        : fallback.countries,
    programs:
      candidate.programs && typeof candidate.programs === "object"
        ? Object.fromEntries(
            Object.entries(candidate.programs).map(([key, entry]) => [
              key,
              {
                ...DEFAULT_PROGRAM_PLAN,
                ...(entry && typeof entry === "object" ? entry : {}),
              },
            ]),
          )
        : fallback.programs,
  };
}
