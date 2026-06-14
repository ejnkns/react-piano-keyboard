import { UseMusicNotes } from '../hooks/useMusicNotes';
import { SetOptions } from '../types';
export declare const getControls: ({ set, defaultValues, }: {
    set: UseMusicNotes["set"];
    defaultValues?: Partial<SetOptions>;
}) => {
    knobs: {
        name: string;
        control: () => import("react").JSX.Element;
    }[];
    buttonGroups: {
        name: string;
        control: () => import("react").JSX.Element;
    }[];
};
//# sourceMappingURL=getControls.d.ts.map