import { ActionFamilyBadge } from "../common/ActionFamilyBadge";
export function InspectorHeader({
  name,
  index,
}: {
  name?: string;
  index: number;
}) {
  return (
    <header className="cv-inspector-header">
      <span className="cv-section-label">
        {name ? `ACTION ${index + 1}` : "LESSON OVERVIEW"}
      </span>
      {name && <ActionFamilyBadge name={name} />}
    </header>
  );
}
