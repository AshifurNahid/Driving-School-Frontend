import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, ExternalLink } from "lucide-react";

interface PdfCarouselViewerProps {
  src?: string | null;
  title?: string;
}

export const PdfCarouselViewer = ({ src, title }: PdfCarouselViewerProps) => {
  const [loadError, setLoadError] = useState(false);

  if (!src) {
    return (
      <Alert variant="destructive">
        <AlertTitle>No PDF provided</AlertTitle>
        <AlertDescription>Please attach a PDF file to view it here.</AlertDescription>
      </Alert>
    );
  }

  const encodedSrc = encodeURI(src);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <p className="text-lg font-semibold text-foreground leading-tight dark:text-white">
            {title || "PDF Attachment"}
          </p>
        </div>
        <div className="flex gap-2">

        </div>
      </div>

      <Separator />

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
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
            className="h-[75vh] w-full bg-muted dark:bg-slate-950"
            onError={() => setLoadError(true)}
          />
        )}
      </div>
    </div>
  );
};
