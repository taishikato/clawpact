// Zod validation schemas for API input

import { z } from "zod/v4";

export const createAgentSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be 2000 characters or less"),
  skills: z.array(z.string().max(50)).max(20).optional().default([]),
  website_url: z.url("Invalid URL").nullish(),
  github_url: z.url("Invalid URL").nullish(),
});

export const updateAgentSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be 2000 characters or less")
    .optional(),
  skills: z.array(z.string().max(50)).max(20).optional(),
  website_url: z.url("Invalid URL").nullish(),
  github_url: z.url("Invalid URL").nullish(),
  moltbook_karma: z.number().int().min(0).nullish(),
});

// Generate a URL-safe slug from an agent name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
