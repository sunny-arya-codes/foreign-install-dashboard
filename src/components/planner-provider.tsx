"use client";

import {
  createContext,
  startTransition,
  use,
  useSyncExternalStore,
} from "react";
import {
  PLANNER_STORAGE_KEY,
  type CountryPlan,
  type PlannerPreferences,
  type PlannerState,
  type ProgramPlan,
  getDefaultPlannerState,
  normalizePlannerState,
} from "@/lib/planner-state";

type PlannerContextValue = {
  hydrated: boolean;
  planner: PlannerState;
  updatePreferences: (updates: Partial<PlannerPreferences>) => void;
  updateCountryPlan: (countrySlug: string, updates: Partial<CountryPlan>) => void;
  updateProgramPlan: (programKey: string, updates: Partial<ProgramPlan>) => void;
  importPlannerState: (payload: string) => void;
  exportPlannerState: () => string;
  resetPlannerState: () => void;
};

const PlannerContext = createContext<PlannerContextValue | null>(null);
const PLANNER_EVENT = "planner-storage";

function withTimestamp<T extends object>(value: T) {
  return {
    ...value,
    updatedAt: new Date().toISOString(),
  };
}

function readPlannerSnapshot() {
  if (typeof window === "undefined") {
    return getDefaultPlannerState();
  }

  const existing = window.localStorage.getItem(PLANNER_STORAGE_KEY);
  if (!existing) return getDefaultPlannerState();

  try {
    return normalizePlannerState(JSON.parse(existing));
  } catch {
    window.localStorage.removeItem(PLANNER_STORAGE_KEY);
    return getDefaultPlannerState();
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(PLANNER_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(PLANNER_EVENT, handler);
  };
}

function persistPlannerState(value: PlannerState) {
  window.localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event(PLANNER_EVENT));
}

export function PlannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const planner = useSyncExternalStore(
    subscribe,
    readPlannerSnapshot,
    getDefaultPlannerState,
  );
  const hydrated = true;

  function updatePlanner(updater: (current: PlannerState) => PlannerState) {
    startTransition(() => {
      const current = readPlannerSnapshot();
      persistPlannerState(withTimestamp(updater(current)));
    });
  }

  const value: PlannerContextValue = {
    hydrated,
    planner,
    updatePreferences: (updates) => {
      updatePlanner((current) => ({
        ...current,
        preferences: {
          ...current.preferences,
          ...updates,
        },
      }));
    },
    updateCountryPlan: (countrySlug, updates) => {
      updatePlanner((current) => ({
        ...current,
        countries: {
          ...current.countries,
          [countrySlug]: {
            mode: current.countries[countrySlug]?.mode ?? "active",
            note: current.countries[countrySlug]?.note ?? "",
            ...updates,
          },
        },
      }));
    },
    updateProgramPlan: (programKey, updates) => {
      updatePlanner((current) => ({
        ...current,
        programs: {
          ...current.programs,
          [programKey]: {
            stage: current.programs[programKey]?.stage ?? "research",
            priority: current.programs[programKey]?.priority ?? "P3",
            shortlist: current.programs[programKey]?.shortlist ?? false,
            deadline: current.programs[programKey]?.deadline ?? "",
            note: current.programs[programKey]?.note ?? "",
            ...updates,
          },
        },
      }));
    },
    importPlannerState: (payload) => {
      const parsed = normalizePlannerState(JSON.parse(payload));
      persistPlannerState(withTimestamp(parsed));
    },
    exportPlannerState: () => JSON.stringify(planner, null, 2),
    resetPlannerState: () => {
      startTransition(() => {
        persistPlannerState(getDefaultPlannerState());
      });
    },
  };

  return <PlannerContext value={value}>{children}</PlannerContext>;
}

export function usePlanner() {
  const context = use(PlannerContext);

  if (!context) {
    throw new Error("usePlanner must be used inside PlannerProvider.");
  }

  return context;
}
