export type KnobProps = {
    name: string;
    defaultValue?: number;
    min: number;
    max: number;
    step: number;
    unit?: string;
    onChange?: (value: number) => void;
};
export declare const Knob: ({ name, defaultValue, min, max, step, unit, onChange }: KnobProps) => import("react").JSX.Element;
//# sourceMappingURL=Knob.d.ts.map