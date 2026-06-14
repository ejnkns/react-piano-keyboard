export type SelectOptions<T extends string> = {
  id: number | string;
  name: T;
  icon?: string;
};

export const displayOscillators = [
  { id: 1, name: "sine" as const },
  { id: 2, name: "triangle" as const },
  { id: 3, name: "sawtooth" as const },
  { id: 4, name: "square" as const },
] satisfies [SelectOptions<"sine" | "triangle" | "sawtooth" | "square">, ...SelectOptions<"sine" | "triangle" | "sawtooth" | "square">[]];
