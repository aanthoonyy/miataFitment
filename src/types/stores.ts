import type { Settings } from "./settings";
import type { SavedConfig, SavedConfigPayload } from "./garage";
import type { CarModel } from "@/constants/wheelPositions";
import type { WheelDesign } from "@/constants/wheelDesigns";
import type { BodyParts, BodySlot } from "@/constants/bodyParts";

// The model plus settings pair that gets saved, shared and restored.
export interface FitmentConfig {
    model: CarModel;
    settings: Settings;
}

export interface FitmentStore {
    // State
    model: CarModel;
    settings: Settings;
    // Purely how the wheel is drawn, so it stays out of Settings and out of
    // saved/shared configs.
    wheelDesign: WheelDesign;
    // Which part sits in each body slot. Purely how the car is drawn, so like
    // wheelDesign it stays out of Settings and out of saved/shared configs.
    bodyParts: BodyParts;
    // A free-form hex, so it is whatever the colour wheel last landed on rather
    // than a name from a list.
    carColor: string;

    // Whether the rear axle tracks the front. Lives here rather than with the
    // UI state because it decides what the settings themselves are, and the
    // store keeps the pair in step on every write.
    matchWheels: boolean;
    matchTires: boolean;

    // Actions
    setModel: (model: CarModel) => void;
    setWheelDesign: (design: WheelDesign) => void;
    setBodyPart: (slot: BodySlot, value: string) => void;
    setCarColor: (hex: string) => void;
    updateSettings: (patch: Partial<Settings>) => void;
    resetSettings: () => void;
    loadConfig: (config: FitmentConfig) => void;
    setMatchWheels: (match: boolean) => void;
    setMatchTires: (match: boolean) => void;
}

export interface GarageStore {
    // State
    configs: SavedConfig[];
    saveName: string;
    saveDialogOpen: boolean;
    loading: boolean;
    maxSaves: number;

    // Actions
    setConfigs: (configs: SavedConfig[]) => void;
    setSaveName: (name: string) => void;
    setSaveDialogOpen: (open: boolean) => void;
    setMaxSaves: (max: number) => void;

    fetchConfigs: (userId: string) => Promise<void>;
    saveConfig: (
        userId: string,
        name: string,
        payload: SavedConfigPayload,
    ) => Promise<void>;
    overwriteConfig: (
        configId: string,
        payload: SavedConfigPayload,
    ) => Promise<void>;
    deleteConfig: (configId: string) => Promise<void>;
    resetSaveDialog: () => void;
}

// Lives here rather than with UIStore's other members because UIStore refers to
// it, and a type this small is not worth an import cycle.
export type SettingsTab = "alignment" | "wheels" | "tires" | "car" | "account";

export interface UIStore {
    // Settings panel state
    isSettingsOpen: boolean;
    activeTab: SettingsTab;

    // Bounce simulation
    bounceRequested: boolean;

    // Actions
    setSettingsOpen: (open: boolean) => void;
    toggleSettings: () => void;
    setActiveTab: (tab: SettingsTab) => void;
    requestBounce: () => void;
    clearBounceRequest: () => void;
}

export interface UserSettingsStore {
    // State
    darkMode: boolean;
    metric: boolean;
    loading: boolean;
    saving: boolean;
    error: unknown;

    // Actions
    setDarkMode: (dark: boolean, userId?: string | null) => Promise<void>;
    setMetric: (metric: boolean, userId?: string | null) => Promise<void>;
    toggleDarkMode: (userId?: string | null) => Promise<void>;
    toggleMetric: (userId?: string | null) => Promise<void>;
    fetchSettings: (userId: string) => Promise<void>;
}
