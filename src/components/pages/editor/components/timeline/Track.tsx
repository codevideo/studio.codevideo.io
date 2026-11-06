export function Track({ label }: { label: "V" | "A" }) {
  return <div className={"cv-track cv-track-" + label} aria-hidden="true" />;
}
