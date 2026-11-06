import { AllActions } from "@fullstackcraftllc/codevideo-types";
import {
  familyColors,
  familyOf,
  insertableActions,
  colorOf,
} from "../../utils/actionFamilies";
export function ActionTypeSelect({
  name,
  onChange,
}: {
  name: string;
  onChange: (name: AllActions) => void;
}) {
  return (
    <label className="cv-field-label">
      Action type
      <select
        style={{ color: `var(--${colorOf(name)}-11)` }}
        value={name}
        onChange={(e) => onChange(e.target.value as AllActions)}
      >
        {!insertableActions.includes(name) && (
          <option value={name}>{name}</option>
        )}
        {Object.keys(familyColors).map((f) => (
          <optgroup
            key={f}
            label={f}
            style={{ color: `var(--${colorOf(f + "-")}-11)` }}
          >
            {insertableActions
              .filter((n) => familyOf(n) === f)
              .map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
