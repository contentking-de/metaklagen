"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button, Input, Card } from "@/components/ui";
import { mandateFormSchema, MandateFormData } from "@/lib/validations";
import { gtag_report_conversion } from "@/lib/googleAds";

function FormularContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [agbAccepted, setAgbAccepted] = useState(false);
  const totalSteps = 3;
  
  // Heutiges Datum als Maximum für Datumsfelder (Format: YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<MandateFormData>({
    resolver: zodResolver(mandateFormSchema),
  });

  // URL-Parameter lesen und Partner-ID speichern
  useEffect(() => {
    // Partner-ID aus URL-Parameter lesen
    const partnerId = searchParams.get("partner");
    if (partnerId) {
      // In localStorage speichern (für die gesamte Session)
      localStorage.setItem("partnerId", partnerId);
      setValue("partnerId", partnerId);
    } else {
      // Falls keine Partner-ID in URL, aus localStorage laden (falls vorhanden)
      const storedPartnerId = localStorage.getItem("partnerId");
      if (storedPartnerId) {
        setValue("partnerId", storedPartnerId);
      }
    }

    // Referrer speichern (falls vorhanden)
    if (typeof window !== "undefined" && document.referrer) {
      setValue("referrer", document.referrer);
    }
  }, [searchParams, setValue]);

  const hatRechtschutz = watch("hatRechtschutz");

  const nextStep = async () => {
    let fieldsToValidate: (keyof MandateFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["vorname", "nachname", "email", "telefon"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["adresse", "plz", "wohnort", "geburtsdatum"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: MandateFormData) => {
    // Wenn keine Rechtschutzversicherung → Weiterleitung
    if (!data.hatRechtschutz) {
      // Report conversion before redirect
      gtag_report_conversion("https://meta-klage.de");
      return;
    }

    setIsSubmitting(true);

    try {
      // Partner-ID aus localStorage holen, falls nicht im Formular
      const partnerId = data.partnerId || localStorage.getItem("partnerId") || undefined;
      const referrer = data.referrer || (typeof window !== "undefined" ? document.referrer : undefined);

      const response = await fetch("/api/mandate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          partnerId,
          referrer,
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Absenden");
      }

      // Partner-ID aus localStorage entfernen nach erfolgreichem Absenden
      localStorage.removeItem("partnerId");

      // Report conversion before redirecting to confirmation page
      gtag_report_conversion();
      
      // Redirect to confirmation page
      router.push("/bestaetigung");
    } catch (error) {
      console.error("Fehler:", error);
      alert("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-alt">
      <Header />

      <section className="pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Schadenersatz fordern
            </h1>
            <p className="text-text-muted text-lg">
              Fülle das Formular aus, um uns mit Deiner Datenschutzklage gegen META zu beauftragen.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">
                Schritt {currentStep} von {totalSteps}
              </span>
              <span className="text-sm text-text-muted">
                {currentStep === 1 && "Persönliche Daten"}
                {currentStep === 2 && "Adresse & Geburtsdatum"}
                {currentStep === 3 && "Account-Daten"}
              </span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Form */}
          <Card variant="elevated" padding="lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Persönliche Daten */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-primary mb-4">
                    Persönliche Daten
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Vorname"
                      placeholder="Max"
                      required
                      {...register("vorname")}
                      error={errors.vorname?.message}
                    />
                    <Input
                      label="Nachname"
                      placeholder="Mustermann"
                      required
                      {...register("nachname")}
                      error={errors.nachname?.message}
                    />
                  </div>

                  <Input
                    label="E-Mail"
                    type="email"
                    placeholder="max@beispiel.de"
                    required
                    {...register("email")}
                    error={errors.email?.message}
                  />

                  <Input
                    label="Telefon"
                    type="tel"
                    placeholder="+49 123 456789"
                    hint="Optional, für Rückfragen"
                    {...register("telefon")}
                    error={errors.telefon?.message}
                  />
                </div>
              )}

              {/* Step 2: Adresse */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-primary mb-4">
                    Adresse & Geburtsdatum
                  </h2>

                  <Input
                    label="Straße und Hausnummer"
                    placeholder="Musterstraße 123"
                    required
                    {...register("adresse")}
                    error={errors.adresse?.message}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="PLZ"
                      placeholder="12345"
                      maxLength={5}
                      required
                      {...register("plz")}
                      error={errors.plz?.message}
                    />
                    <Input
                      label="Wohnort"
                      placeholder="Berlin"
                      required
                      {...register("wohnort")}
                      error={errors.wohnort?.message}
                    />
                  </div>

                  <Input
                    label="Geburtsdatum"
                    type="date"
                    required
                    max={today}
                    {...register("geburtsdatum")}
                    error={errors.geburtsdatum?.message}
                    hint="Du musst mindestens 18 Jahre alt sein"
                  />
                </div>
              )}

              {/* Step 3: Account-Daten & Versicherung */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-primary mb-4">
                    Account-Daten & Versicherung
                  </h2>

                  <p className="text-text-muted text-sm mb-4">
                    Gib an, seit wann Du Facebook und/oder Instagram nutzt. Mindestens ein Account muss angegeben werden.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Instagram-Account seit"
                      type="date"
                      min="2010-10-06"
                      max={today}
                      {...register("instagramAccountDatum")}
                      error={errors.instagramAccountDatum?.message}
                      hint="Instagram gibt es seit 6. Oktober 2010"
                    />
                    <Input
                      label="Facebook-Account seit"
                      type="date"
                      min="2004-02-04"
                      max={today}
                      {...register("facebookAccountDatum")}
                      error={errors.facebookAccountDatum?.message}
                      hint="Facebook gibt es seit 4. Februar 2004"
                    />
                  </div>

                  {/* Rechtschutzversicherung */}
                  <div className="mt-8 p-6 bg-background-alt rounded-xl border border-border">
                    <h3 className="font-semibold text-primary mb-4">
                      Rechtschutzversicherung
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          value="true"
                          checked={hatRechtschutz === true}
                          onChange={() => {
                            const event = {
                              target: { name: "hatRechtschutz", value: true },
                            };
                            register("hatRechtschutz").onChange(event);
                          }}
                          className="w-5 h-5 text-accent border-border focus:ring-accent"
                        />
                        <span className="text-text group-hover:text-primary transition-colors">
                          Ja, ich habe eine Rechtschutzversicherung
                        </span>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          value="false"
                          checked={hatRechtschutz === false}
                          onChange={() => {
                            const event = {
                              target: { name: "hatRechtschutz", value: false },
                            };
                            register("hatRechtschutz").onChange(event);
                          }}
                          className="w-5 h-5 text-accent border-border focus:ring-accent"
                        />
                        <span className="text-text group-hover:text-primary transition-colors">
                          Nein, ich habe keine Rechtschutzversicherung
                        </span>
                      </label>
                    </div>

                    {errors.hatRechtschutz && (
                      <p className="mt-2 text-sm text-error">{errors.hatRechtschutz.message}</p>
                    )}

                    {hatRechtschutz && (
                      <div className="mt-6 space-y-4 animate-fade-in">
                        <Input
                          label="Versicherer"
                          placeholder="z.B. ARAG, Allianz, HUK-Coburg"
                          required
                          {...register("versicherer")}
                          error={errors.versicherer?.message}
                        />
                        <Input
                          label="Versicherungsnummer"
                          placeholder="z.B. RSV-123456789"
                          {...register("versicherungsnummer")}
                          error={errors.versicherungsnummer?.message}
                          hint="Optional - Findest Du auf Deiner Versicherungspolice"
                        />
                        <Input
                          label="Abschlussdatum der Versicherung"
                          type="date"
                          max={today}
                          {...register("versicherungsAbschlussdatum")}
                          error={errors.versicherungsAbschlussdatum?.message}
                          hint="Optional"
                        />
                        <div className="mt-4">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              {...register("versicherungsnehmerAbweichend")}
                              className="w-5 h-5 text-accent border-border rounded focus:ring-accent"
                            />
                            <span className="text-sm text-text group-hover:text-primary transition-colors">
                              Ich bin nicht selbst Versicherungsnehmer
                            </span>
                          </label>
                        </div>

                        {watch("versicherungsnehmerAbweichend") && (
                          <div className="space-y-4 animate-fade-in">
                            <Input
                              label="Name des Versicherungsnehmers"
                              placeholder="Vor- und Nachname des Versicherungsnehmers"
                              required
                              {...register("versicherungsnehmer")}
                              error={errors.versicherungsnehmer?.message}
                              hint="Die Person, auf die die Versicherung läuft"
                            />
                            <Input
                              label="Verhältnis zum Versicherungsnehmer"
                              placeholder="z.B. Ehegatte, Kind, Lebenspartner"
                              required
                              {...register("versicherungsnehmerVerhaeltnis")}
                              error={errors.versicherungsnehmerVerhaeltnis?.message}
                              hint="In welchem Verhältnis stehst Du zum Versicherungsnehmer?"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {hatRechtschutz === false && (
                      <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg animate-fade-in">
                        <p className="text-sm text-warning font-medium">
                          Ohne Rechtschutzversicherung können wir Dich leider nicht vertreten. 
                          Du wirst nach Absenden zu meta-klage.de weitergeleitet.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AGB & Datenschutz Checkbox */}
                  <div className="mt-6">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={agbAccepted}
                        onChange={(e) => setAgbAccepted(e.target.checked)}
                        className="w-5 h-5 mt-0.5 text-accent border-border rounded focus:ring-accent"
                      />
                      <span className="text-sm text-text-muted group-hover:text-text transition-colors">
                        Ich habe die{" "}
                        <Link href="/agb" className="text-accent hover:underline" target="_blank">
                          AGB
                        </Link>{" "}
                        und die{" "}
                        <Link href="/datenschutz" className="text-accent hover:underline" target="_blank">
                          Datenschutzerklärung
                        </Link>{" "}
                        gelesen und erkläre mich damit einverstanden.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Zurück
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={nextStep}
                  >
                    Weiter
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={!agbAccepted}
                    className={!agbAccepted ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {hatRechtschutz === false ? "Weiter zu meta-klage.de" : "Schadenersatz fordern"}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Trust Elements */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-text-muted text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>SSL verschlüsselt</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>DSGVO-konform</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Anwaltliche Schweigepflicht</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function FormularPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background-alt">
        <Header />
        <section className="pt-28 pb-20 md:pt-32 md:pb-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-text-muted">Lade Formular...</div>
          </div>
        </section>
        <Footer />
      </main>
    }>
      <FormularContent />
    </Suspense>
  );
}

