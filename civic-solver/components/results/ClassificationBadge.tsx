import type { IssueCategory } from "@/lib/types";

const CONFIG: Record<
  IssueCategory,
  { icon: string; label: string; color: string; bg: string; border: string }
> = {
  GOVERNMENT: {
    icon: "🏛️",
    label: "City responsibility",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  PRIVATE_SERVICE: {
    icon: "🛠️",
    label: "Private service",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  REGULATORY: {
    icon: "📋",
    label: "Regulatory / Information",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
};

interface Props {
  category: IssueCategory;
  issueType: string;
}

export default function ClassificationBadge({ category, issueType }: Props) {
  const config = CONFIG[category];

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg} ${config.border} ${config.color} font-semibold text-sm`}
      role="status"
      aria-label={`Classification: ${config.label}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
}
