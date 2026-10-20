import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Share2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores";
import { useFitmentStore } from "@/stores/fitmentStore";
import { buildShareUrl } from "@/utils/shareableUrl";
import { STRINGS } from "@/i18n/strings";

// How long the share button stays showing "Copied!" before reverting.
const COPIED_FEEDBACK_MS = 2000;

const Header = () => {
  const navigate = useNavigate();
  const toggleSettings = useUIStore((s) => s.toggleSettings);
  const model = useFitmentStore((s) => s.model);
  const settings = useFitmentStore((s) => s.settings);
  const appearance = useFitmentStore((s) => s.appearance);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = buildShareUrl({ model, settings, appearance });
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  };

  return (
    <>
      {/* Back button (top-left) */}
      <div className="fixed left-4 top-4 z-50">
        <Button
          variant="secondary"
          size="icon"
          className="
            h-10 w-10 rounded-full
            bg-zinc-100 shadow-md
            hover:bg-zinc-200
          "
          onClick={() => navigate("/")}
          aria-label={STRINGS.visualizer.goBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Top-right buttons */}
      <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
        {/* Share button */}
        <Button
          variant="secondary"
          size={copied ? "default" : "icon"}
          className="
            h-10 rounded-full
            bg-zinc-100 shadow-md
            hover:bg-zinc-200
            transition-all duration-200
          "
          onClick={handleShare}
          aria-label={STRINGS.visualizer.copyShareLink}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span className="ml-1 text-sm">{STRINGS.visualizer.copied}</span>
            </>
          ) : (
            <Share2 className="h-5 w-5" />
          )}
        </Button>

        {/* Settings button */}
        <Button
          variant="secondary"
          size="icon"
          className="
            h-10 w-10 rounded-full
            bg-zinc-100 shadow-md
            hover:bg-zinc-200
          "
          onClick={toggleSettings}
          aria-label={STRINGS.visualizer.openSettings}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
};

export default Header;
