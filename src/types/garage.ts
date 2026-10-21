import type { CarAppearance } from "@/utils/carAppearance";

export type SavedConfigPayload = {
      version?: number;
      appearance?: CarAppearance;
      model?: string;
      settings?: Readonly<Record<string, number | undefined>>;
};

export type SavedConfig = {
  id: string;
  name: string;
  updatedAt: string;
  payload?: SavedConfigPayload;
};

export type GarageProps = {
  userId: string;
  maxSaves?: number;
};
