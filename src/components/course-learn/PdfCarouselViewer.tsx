import { useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, ExternalLink, RefreshCcw } from "lucide-react";

interface PdfCarouselViewerProps {
  src?: string | null;
  title?: string;
}

export const PdfCarouselViewer = ({ src, title }: PdfCarouselViewerProps) => {
  const [loadError, setLoadError] = useState(false);

  const encodedSrc = useMemo(() => (src ? encodeURI(src) : null), [src]);

  if (!src) {
    return (
      <Alert variant="destructive">
        <AlertTitle>No PDF provided</AlertTitle>
        <AlertDescription>Please attach a PDF file to view it here.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/70 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Resource</p>
          <p className="text-lg font-semibold text-foreground leading-tight">
            {title || "PDF Attachment"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" asChild>
            <a href={encodedSrc || undefined} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in new tab
            </a>
          </Button>
          <Button variant="default" size="sm" asChild>
            <a href={encodedSrc || undefined} download>
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
          {loadError && (
            <Button variant="outline" size="sm" onClick={() => setLoadError(false)}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Retry
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-muted/80 via-background to-background shadow-inner">
        {loadError ? (
          <Alert variant="destructive" className="m-4">
            <AlertTitle>Unable to load PDF</AlertTitle>
            <AlertDescription>
              This PDF couldn't be displayed in the browser. Please download the file or open it in
              a new tab instead.
            </AlertDescription>
          </Alert>
        ) : (
          <iframe
            title={title || "PDF Viewer"}
            src={`${encodedSrc}#toolbar=1&navpanes=0`}
            className="h-[78vh] w-full border-0 bg-muted"
            onError={() => setLoadError(true)}
          />
        )}
      </div>
    </div>
  );
};
