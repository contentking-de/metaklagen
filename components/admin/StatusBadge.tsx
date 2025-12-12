import { MandateStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: MandateStatus;
}

const statusConfig: Record<MandateStatus, { label: string; className: string }> = {
  NEU: {
    label: "Neu",
    className: "bg-accent/10 text-accent",
  },
  IN_BEARBEITUNG: {
    label: "In Bearbeitung",
    className: "bg-blue-100 text-blue-700",
  },
  ABGESCHLOSSEN: {
    label: "Abgeschlossen",
    className: "bg-success/10 text-success",
  },
  ABGELEHNT: {
    label: "Abgelehnt",
    className: "bg-error/10 text-error",
  },
};

export default function MandateStatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

