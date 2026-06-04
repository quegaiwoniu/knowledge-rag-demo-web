import { type HealthResponse } from "../types/api";

type HealthBadgeProps = {
  data: HealthResponse | null;
  loading: boolean;
  error: string | null;
};

export function HealthBadge({ data, loading, error }: HealthBadgeProps) {
  let label = "Checking";
  let tone = "neutral";

  if (error) {
    label = "Unavailable";
    tone = "danger";
  } else if (!loading && data?.status === "UP") {
    label = "Healthy";
    tone = "success";
  }

  return (
    <div className={`health-badge health-badge--${tone}`}>
      <span className="health-dot" />
      <div>
        <p className="health-label">{label}</p>
        <p className="health-meta">{data?.application ?? (error || "Backend status pending")}</p>
      </div>
    </div>
  );
}
