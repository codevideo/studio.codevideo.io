import { useEffect, useRef, useState } from "react";
import {
  IAction,
  advancedCommandValueSeparator,
} from "@fullstackcraftllc/codevideo-types";
import { useDebounce } from "../../../../../hooks/useDebounce";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { setAllowFocusInEditor } from "../../../../../store/editorSlice";
import { getValueKind, splitAdvancedValue } from "../../utils/valueKind";
export function ActionValueField({
  action,
  onCommit,
}: {
  action: IAction;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(action.value);
  const draftRef = useRef(action.value);
  const committed = useRef(action.value);
  const callback = useRef(onCommit);
  callback.current = onCommit;
  const dispatch = useAppDispatch();
  const kind = getValueKind(action);
  useEffect(() => {
    setDraft(action.value);
    draftRef.current = action.value;
    committed.current = action.value;
  }, [action.value]);
  const commit = (value: string) => {
    if (value !== committed.current) {
      committed.current = value;
      callback.current(value);
    }
  };
  const debounced = useDebounce(commit, 300);
  // Flush on selection changes; a quick click must not discard the last keystrokes.
  useEffect(
    () => () => {
      commit(draftRef.current);
      dispatch(setAllowFocusInEditor(true));
    },
    [],
  );
  const change = (value: string) => {
    draftRef.current = value;
    setDraft(value);
    debounced(value);
  };
  const focus = {
    onFocus: () => dispatch(setAllowFocusInEditor(false)),
    onBlur: () => {
      commit(draftRef.current);
      dispatch(setAllowFocusInEditor(true));
    },
  };
  if (kind === "caret") {
    const parts = draft.split(advancedCommandValueSeparator);
    return (
      <div className="cv-pair">
        {["File", "Row", "Column"].map((label, index) => (
          <label key={label} className="cv-field-label">
            {label}
            <input
              {...focus}
              type={index === 0 ? "text" : "number"}
              min={index === 0 ? undefined : 1}
              value={parts[index] ?? ""}
              onChange={(event) => {
                const next = [...parts];
                next[index] = event.target.value;
                change(next.join(advancedCommandValueSeparator));
              }}
            />
          </label>
        ))}
      </div>
    );
  }
  if (kind === "pair") {
    const [from, to] = splitAdvancedValue(draft, advancedCommandValueSeparator);
    return (
      <div className="cv-pair">
        <label className="cv-field-label">
          {action.name === "file-explorer-set-file-contents" ? "File" : "From"}
          <textarea
            {...focus}
            value={from}
            onChange={(e) =>
              change(e.target.value + advancedCommandValueSeparator + to)
            }
          />
        </label>
        <label className="cv-field-label">
          {action.name === "file-explorer-set-file-contents"
            ? "Contents"
            : "To"}
          <textarea
            {...focus}
            value={to}
            onChange={(e) =>
              change(from + advancedCommandValueSeparator + e.target.value)
            }
          />
        </label>
      </div>
    );
  }
  return (
    <label className="cv-field-label">
      {kind === "milliseconds"
        ? "Wait (milliseconds)"
        : kind === "repeat"
          ? "Repeat (1–100)"
          : kind === "markdown"
            ? "Slide (Markdown)"
            : kind === "url"
              ? "URL"
              : "Value"}
      {kind === "repeat" || kind === "milliseconds" ? (
        <input
          {...focus}
          type="number"
          min={kind === "repeat" ? 1 : 0}
          max={kind === "repeat" ? 100 : undefined}
          value={draft}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (
              e.target.value &&
              Number.isInteger(n) &&
              n >= (kind === "repeat" ? 1 : 0) &&
              (kind !== "repeat" || n <= 100)
            )
              change(e.target.value);
          }}
        />
      ) : kind === "url" ? (
        <input
          {...focus}
          type="url"
          value={draft}
          onChange={(e) => change(e.target.value)}
        />
      ) : (
        <textarea
          {...focus}
          className={kind === "prose" ? "cv-prose" : "cv-code"}
          value={draft}
          maxLength={kind === "prose" ? 1000 : undefined}
          onChange={(e) => change(e.target.value)}
          rows={8}
        />
      )}
    </label>
  );
}
