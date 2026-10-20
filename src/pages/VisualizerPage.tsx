import { BodyLoadNotice } from "@/components/BodyLoadNotice";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import FitmentSettings from "@/components/FitmentSettings";
import { useUIStore } from "@/stores";
import { useFitmentStore } from "@/stores/fitmentStore";
import { useThreeScene } from "@/hooks/useThreeScene";
import { parseShareParams } from "@/utils/shareableUrl";

const VisualizerPage = () => {
  const isSettingsOpen = useUIStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const loadConfig = useFitmentStore((s) => s.loadConfig);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.size === 0) return;
    const config = parseShareParams(searchParams);
    if (config) loadConfig(config);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useThreeScene();

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-background">
      <div className="fixed inset-x-0 top-0 z-50">
        <Header />
      </div>

      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <div
            id="three-container"
            className="absolute inset-0 z-0 overflow-hidden"
          />
        </div>
      </div>
      <BodyLoadNotice />
      <aside
        className={[
          "fixed right-0 top-0 z-[60] h-full w-[350px]",
          "bg-zinc-100",
          "shadow-[-8px_0_24px_-8px_rgba(0,0,0,0.15)]",
          "transform transition-transform duration-300 ease-in-out",
          isSettingsOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="relative h-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(false)}
            className="absolute right-2 top-2 z-1000"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="h-full overflow-hidden">
            <FitmentSettings />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default VisualizerPage;
