import { type ReactNode } from "react";

type CapabilityCardProps = {
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function CapabilityCard({ kicker, title, description, children }: CapabilityCardProps) {
  return (
    <section className="panel capability-card">
      <div className="panel-header capability-card__header">
        <div>
          <p className="panel-kicker">{kicker}</p>
          <h2>{title}</h2>
          <p className="capability-card__description">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
