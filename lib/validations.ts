import { z } from "zod";

export const mandateFormSchema = z.object({
  vorname: z
    .string()
    .min(2, "Vorname muss mindestens 2 Zeichen haben")
    .max(50, "Vorname darf maximal 50 Zeichen haben"),
  nachname: z
    .string()
    .min(2, "Nachname muss mindestens 2 Zeichen haben")
    .max(50, "Nachname darf maximal 50 Zeichen haben"),
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein"),
  telefon: z.string().optional(),
  adresse: z
    .string()
    .min(5, "Adresse muss mindestens 5 Zeichen haben")
    .max(200, "Adresse darf maximal 200 Zeichen haben"),
  plz: z
    .string()
    .regex(/^\d{5}$/, "PLZ muss 5 Ziffern haben"),
  wohnort: z
    .string()
    .min(2, "Wohnort muss mindestens 2 Zeichen haben")
    .max(100, "Wohnort darf maximal 100 Zeichen haben"),
  geburtsdatum: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      return age >= 18;
    }, "Du musst mindestens 18 Jahre alt sein"),
  instagramAccountDatum: z.string().optional(),
  facebookAccountDatum: z.string().optional(),
  hatRechtschutz: z.boolean().optional(),
  versicherer: z.string().optional(),
  versicherungsnummer: z.string().optional(),
  versicherungsAbschlussdatum: z.string().optional(),
  versicherungsnehmer: z.string().optional(),
  versicherungsnehmerAbweichend: z.boolean().optional(),
  versicherungsnehmerVerhaeltnis: z.string().optional(),
  partnerId: z.string().optional(),
  referrer: z.string().optional(),
}).refine(
  (data) => data.instagramAccountDatum || data.facebookAccountDatum,
  {
    message: "Mindestens ein Account-Datum (Instagram oder Facebook) muss angegeben werden",
    path: ["instagramAccountDatum"],
  }
).refine(
  (data) => data.hatRechtschutz !== undefined,
  {
    message: "Bitte wähle aus, ob Du eine Rechtschutzversicherung hast",
    path: ["hatRechtschutz"],
  }
).refine(
  (data) => !data.hatRechtschutz || (data.hatRechtschutz && data.versicherer && data.versicherer.length > 0),
  {
    message: "Versicherer ist erforderlich bei vorhandener Rechtschutzversicherung",
    path: ["versicherer"],
  }
).refine(
  (data) => !data.versicherungsnehmerAbweichend || (data.versicherungsnehmerAbweichend && data.versicherungsnehmer && data.versicherungsnehmer.length > 0),
  {
    message: "Bitte gib den Namen des Versicherungsnehmers an",
    path: ["versicherungsnehmer"],
  }
).refine(
  (data) => !data.versicherungsnehmerAbweichend || (data.versicherungsnehmerAbweichend && data.versicherungsnehmerVerhaeltnis && data.versicherungsnehmerVerhaeltnis.length > 0),
  {
    message: "Bitte gib Dein Verhältnis zum Versicherungsnehmer an",
    path: ["versicherungsnehmerVerhaeltnis"],
  }
);

export type MandateFormData = z.infer<typeof mandateFormSchema>;

export const loginSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen haben"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

