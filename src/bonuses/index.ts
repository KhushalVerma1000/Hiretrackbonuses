import type { ComponentType } from "react";
import type { BonusMeta } from "@/lib/types";
import type { BonusEmailBuilder } from "@/lib/email/types";
import { meta as costPerHire } from "./cost-per-hire-calculator/meta";
import CostPerHire from "./cost-per-hire-calculator/Calculator";
import CostPerHireToolkit from "./cost-per-hire-calculator/Toolkit";
import { buildEmail as costPerHireEmail } from "./cost-per-hire-calculator/email";

export type Bonus = { meta: BonusMeta; Component: ComponentType; Extra?: ComponentType; email?: BonusEmailBuilder };
// Extra = server-rendered toolkit/reference section. email = optional builder for a personalised delivery email;
// a bonus without one still gets a generic "here is your bonus" email, so email works for every bonus automatically.

// ADD NEW BONUSES HERE: import its meta + component, then add one line below.
export const bonuses: Bonus[] = [
  { meta: costPerHire, Component: CostPerHire, Extra: CostPerHireToolkit, email: costPerHireEmail },
];

export const getBonus = (slug: string) => bonuses.find((b) => b.meta.slug === slug);

// Not published yet. Shown as text only on the home page (no links, no indexing).
export const planned = [
  "Candidate ghosting risk score", "Interview scorecard pack", "Recruiter KPI dashboard sheet", "Client onboarding kit",
  "Multi-language follow-up message pack", "Hiring-in-a-new-country question list", "7-day hiring email course",
  "Free pipeline audit", "Live \"fix my pipeline\" session",
];
