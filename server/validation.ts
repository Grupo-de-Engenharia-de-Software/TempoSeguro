import { z } from "zod";

const ALERT_TYPE_VALUES = [
  "flood",
  "landslide",
  "fire",
  "strongWind",
  "storm",
  "lightning",
  "hail",
  "heatWave",
  "coldWave",
  "tornado",
  "earthquake",
  "evacuation",
  "shelter",
  "blockedRoad",
  "powerOutage",
] as const;

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "");
}

export const NewMarkerSchema = z.object({
  position: z.tuple([
    z.number().min(-90).max(90),
    z.number().min(-180).max(180),
  ]),
  title: z
    .string()
    .min(1)
    .max(200)
    .transform(stripHtml),
  type: z.enum(ALERT_TYPE_VALUES),
});

export const ApproveMarkerSchema = z.union([
  z.string().uuid(),
  z.array(z.string().uuid()).min(1).max(50),
]);

export type ValidatedNewMarker = z.infer<typeof NewMarkerSchema>;
