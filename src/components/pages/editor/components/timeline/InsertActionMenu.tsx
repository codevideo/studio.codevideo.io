import { useState } from "react";
import { Popover, Button } from "@radix-ui/themes";
import { AllActions } from "@fullstackcraftllc/codevideo-types";
import {
  familyColors,
  familyOf,
  insertableActions,
} from "../../utils/actionFamilies";
import { ActionFamilyBadge } from "../common/ActionFamilyBadge";
export function InsertActionMenu({
  onInsert,
  disabled,
  open: controlledOpen,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onInsert: (name: AllActions) => void;
  disabled: boolean;
}) {
  const [localOpen, setLocalOpen] = useState(false);
  const open = controlledOpen ?? localOpen;
  const setOpen = (value: boolean) => {
    setLocalOpen(value);
    onOpenChange?.(value);
  };
  const [search, setSearch] = useState("");
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button size="1" variant="soft" disabled={disabled}>
          + Insert action
        </Button>
      </Popover.Trigger>
      <Popover.Content className="cv-action-picker" width="340px">
        <input
          aria-label="Search actions"
          placeholder="Search actions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="cv-action-picker-list">
          {Object.keys(familyColors).map((f) => (
            <section key={f}>
              <h4>{f}</h4>
              {insertableActions
                .filter(
                  (n) => familyOf(n) === f && n.includes(search.toLowerCase()),
                )
                .map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      onInsert(n as AllActions);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <ActionFamilyBadge name={n} />
                  </button>
                ))}
            </section>
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
