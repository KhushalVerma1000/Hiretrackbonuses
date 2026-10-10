import type { ComponentType } from "react";
import type { BonusMeta } from "@/lib/types";
import { meta as costPerHire } from "./cost-per-hire-calculator/meta";
import CostPerHire from "./cost-per-hire-calculator/Calculator";

export type Bonus = { meta: BonusMeta; Component: ComponentType };

// ADD NEW BONUSES HERE: import its meta + component, then add one line below.
export const bonuses: Bonus[] = [
  { meta: costPerHire, Component: CostPerHire },
];

export const getBonus = (slug: string) => bonuses.find((b) => b.meta.slug === slug);

// Not published yet. Shown as text only on the home page (no links, no indexing).
export const planned = [
  "Candidate ghosting risk score", "Interview scorecard pack", "Recruiter KPI dashboard sheet", "Client onboarding kit",
  "Multi-language follow-up message pack", "Hiring-in-a-new-country question list", "7-day hiring email course",
  "Free pipeline audit", "Live \"fix my pipeline\" session",
];
