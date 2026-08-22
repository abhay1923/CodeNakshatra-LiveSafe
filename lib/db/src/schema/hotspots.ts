import { pgTable, serial, text, doublePrecision, timestamp, integer, real } from "drizzle-orm/pg-core";

// Populated from real NCRB (National Crime Records Bureau) district-year
// data via ml-pipeline/03_export_hotspots.py — see ml-pipeline/README.md.
// Previously this table did not exist at all, so the frontend's
// `supabase.from('hotspots').select('*')` call always failed and silently
// fell back to hand-authored demo data (see hotspots_v5.ts history).
export const hotspotsTable = pgTable("hotspots", {
  id: serial("id").primaryKey(),
  externalId: text("external_id").notNull().unique(), // e.g. "d_tamil_nadu_chennai"
  district: text("district").notNull(),
  state: text("state").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  riskLevel: text("risk_level", { enum: ["low", "medium", "high", "critical"] }).notNull(),
  riskScore: real("risk_score").notNull(), // 0-100, real NCRB `severity` composite
  dataCompleteness: real("data_completeness").notNull(), // 0-100
  totalCrimesReported: integer("total_crimes_reported").notNull(),
  crimeRatePerLakh: real("crime_rate_per_lakh"), // null where Census population couldn't be matched
  reportedCategories: text("reported_categories").array().notNull(), // real NCRB crime heads
  primaryWarning: text("primary_warning").notNull(),
  trend: text("trend", { enum: ["rising", "stable", "falling"] }).notNull(),
  populationLakh: real("population_lakh"),
  radiusMeters: integer("radius_meters").notNull(),
  dataYear: integer("data_year").notNull(), // most recent NCRB year available for this district
  geoSource: text("geo_source").notNull(), // "exact" | "fuzzy:<matched-name>" — geocoding provenance
  predictedNextYearSeverity: real("predicted_next_year_severity").notNull(),
  predictedNextYearRiskLevel: text("predicted_next_year_risk_level").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type InsertHotspot = typeof hotspotsTable.$inferInsert;
export type Hotspot = typeof hotspotsTable.$inferSelect;
