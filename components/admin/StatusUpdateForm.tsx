"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MandateStatus } from "@prisma/client";
import { Button } from "@/components/ui";

interface StatusUpdateFormProps {
  mandateId: string;
  currentStatus: MandateStatus;
}

const statusOptions: { value: MandateStatus; label: string }[] = [
  { value: "NEU", label: "Neu" },
  { value: "IN_BEARBEITUNG", label: "In Bearbeitung" },
  { value: "ABGESCHLOSSEN", label: "Abgeschlossen" },
  { value: "ABGELEHNT", label: "Abgelehnt" },
];

export default function StatusUpdateForm({ mandateId, currentStatus }: StatusUpdateFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<MandateStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === currentStatus) {
      return;
    }

    setIsUpdating(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/mandate/${mandateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren");
      }

      setMessage({ type: "success", text: "Status erfolgreich aktualisiert" });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Fehler beim Aktualisieren des Status" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {statusOptions.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all
              ${status === option.value
                ? "border-accent bg-accent/10 text-accent"
                : "border-border hover:border-accent/50"
              }
            `}
          >
            <input
              type="radio"
              name="status"
              value={option.value}
              checked={status === option.value}
              onChange={(e) => setStatus(e.target.value as MandateStatus)}
              className="sr-only"
            />
            <span className="text-sm font-medium">{option.label}</span>
          </label>
        ))}
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-success/10 text-success"
              : "bg-error/10 text-error"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button
        type="submit"
        variant="secondary"
        size="sm"
        isLoading={isUpdating}
        disabled={status === currentStatus}
      >
        Status speichern
      </Button>
    </form>
  );
}

