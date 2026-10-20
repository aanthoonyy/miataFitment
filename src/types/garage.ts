// What is actually sitting in the database, which is arbitrary JSON written by
// whatever version of the app saved it. Rows predating the units rename hold
// the old field names, so readers run it through readFitmentConfig rather
// than trusting any particular shape.
export type SavedConfigPayload = {
      version?: number;
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
