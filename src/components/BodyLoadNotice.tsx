import { Button } from "@/components/ui/button";
import { STRINGS } from "@/i18n/strings";
import { useUIStore } from "@/stores";

export function BodyLoadNotice() {
  const { phase, hasBody } = useUIStore((state) => state.bodyLoadStatus);
  const retryBody = useUIStore((state) => state.retryBody);
  if (phase !== "error") return null;

  const message = hasBody ? STRINGS.car.bodyLoadFailedPrevious : STRINGS.car.bodyLoadFailed;

  return (
    <div className="absolute bottom-4 left-4 z-[70] max-w-[calc(100vw-2rem)] rounded-lg border bg-white p-3 shadow-md sm:max-w-sm">
      <p role="status" aria-live="polite" className="text-sm text-zinc-800">{message}</p>
      <Button variant="secondary" className="mt-2" onClick={retryBody}>
        {STRINGS.car.retryBody}
      </Button>
    </div>
  );
}
