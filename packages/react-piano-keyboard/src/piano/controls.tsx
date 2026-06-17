import { ReactElement } from "react";
import { Audio, UseMusicNotes } from "../use-piano/use-music-notes";
import { getControls } from "./controls/get-controls";

export const Controls = ({
  set,
  defaultValues,
  onClose,
}: {
  set: UseMusicNotes["set"];
  defaultValues?: Partial<Audio.SetOptions>;
  onClose?: () => void;
}) => {
  const { knobs, buttonGroups } = getControls({ set, defaultValues });

  const renderGroup = (
    items: { name: string; control: () => ReactElement }[],
  ) =>
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
      </div>
    </div>
  );
};
