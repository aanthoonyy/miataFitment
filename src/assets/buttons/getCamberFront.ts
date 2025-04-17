import { getSettings } from "../store/settingsStore";

function getCamberFront() {
    const settings = getSettings();
    return settings.frontCamber;
}

export { getCamberFront };