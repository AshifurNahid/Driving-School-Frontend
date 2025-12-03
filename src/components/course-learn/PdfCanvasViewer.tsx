import { useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";

interface PdfCanvasViewerProps {
  src?: string;
  title?: string;
}

export const PdfCanvasViewer = ({ src, title }: PdfCanvasViewerProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const viewerUrl = useMemo(() => {
    if (!src) return null;
    const encoded = encodeURIComponent(src);
    return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encoded}`;
  }, [src]);

  useEffect(() => {
    setHasLoaded(false);
    setError(null);
    setLoading(Boolean(src));
  }, [src]);

  if (!src || !viewerUrl) return null;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Preview unavailable</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">{title || "Lesson Attachment"}</p>
          <p className="text-xs text-muted-foreground">
            Full-featured PDF viewer with search, page navigation, and download controls.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={src} target="_blank" rel="noreferrer" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Open original
          </a>
        </Button>
      </div>
      <div className="relative overflow-hidden rounded-lg border bg-background">
        {loading && !hasLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-xs">Loading PDF viewer...</p>
            </div>
          </div>
        )}
        <iframe
          src={viewerUrl}
          title={title || "PDF viewer"}
          className="h-[70vh] w-full border-0"
          onLoad={() => {
            setHasLoaded(true);
            setLoading(false);
          }}
          onError={() => {
            setError("Unable to load the PDF. Please download the file instead.");
            setLoading(false);
          }}
          allowFullScreen
        />
      </div>
    </div>
  );
};
