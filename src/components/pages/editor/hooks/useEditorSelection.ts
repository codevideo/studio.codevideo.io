import { useState } from "react";
export function useEditorSelection(ids: string[]) {
  const [selected, setSelected] = useState<string | null>(null);
  return {
    selectedId: selected && ids.includes(selected) ? selected : null,
    select: setSelected,
  };
}
