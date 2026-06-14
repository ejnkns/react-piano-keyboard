import { ReactElement } from "react";
import { UseMusicNotes } from "../hooks/useMusicNotes";
import { SetOptions } from "../types";
import { getControls } from "./getControls";

export const Controls = ({
  set,
  defaultValues,
  onClose,
}: {
  set: UseMusicNotes["set"];
  defaultValues?: Partial<SetOptions>;
  onClose?: () => void;
}) => {
  const { knobs, buttonGroups } = getControls({ set, defaultValues });

  const renderGroup = (items: { name: string; control: () => ReactElement }[]) =>
    items.map(({ name, control }, index) => (
      <div
        key={`${name}-${index}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        {control()}
      </div>
    ));

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        padding: "12px 16px",
        background: "var(--piano-controls-bg)",
        borderRadius: "8px 8px 0 0",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {renderGroup(knobs)}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {renderGroup(buttonGroups)}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              background: "transparent",
              padding: 6,
              color: "var(--piano-text-muted)",
              border: "1px solid var(--piano-border-strong)",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                clip: "rect(0,0,0,0)",
              }}
            >
              Close keyboard
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
