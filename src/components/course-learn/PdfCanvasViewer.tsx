import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ZoomIn, ZoomOut } from "lucide-react";

interface PdfCanvasViewerProps {
  src?: string;
  title?: string;
}

// Lightweight PDF renderer using pdf.js loaded from CDN to avoid bundling heavy assets.
export const PdfCanvasViewer = ({ src, title }: PdfCanvasViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pdfInstance = useRef<any>(null);

  const renderPage = async () => {
    if (!pdfInstance.current) return;
    const pdf = pdfInstance.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pageData = await pdf.getPage(page);
    const viewport = pageData.getViewport({ scale });
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport,
    } as any;

    await pageData.render(renderContext).promise;
  };

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // @vite-ignore allows remote import for CDN-hosted pdf.js
        const pdfjsLib = (await import(
          /* @vite-ignore */ "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.mjs"
        )) as any;
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js";

        const loadingTask = pdfjsLib.getDocument(src);
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        pdfInstance.current = pdf;
        setPageCount(pdf.numPages || 1);
        setPage(1);
      } catch (err) {
        console.error("PDF render error", err);
        setError("Unable to load the PDF. Please verify the link and try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
      pdfInstance.current = null;
    };
  }, [src]);

  useEffect(() => {
    if (pdfInstance.current) {
      renderPage();
    }
  }, [page, scale]);

  const goToPage = (direction: "prev" | "next") => {
    setPage((prev) => {
      if (direction === "prev") return Math.max(prev - 1, 1);
      return Math.min(prev + 1, pageCount);
    });
  };

  if (!src) {
    return (
      <Alert>
        <AlertTitle>No lesson attachment</AlertTitle>
        <AlertDescription>
          This lesson doesn't provide a PDF attachment yet. Please check back later.
        </AlertDescription>
      </Alert>
    );
  }

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
          <p className="text-xs text-muted-foreground">PDF viewer powered by pdf.js</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => goToPage("prev")} disabled={page <= 1}>
            Prev
          </Button>
          <div className="text-sm font-medium">
            Page {page} / {pageCount}
          </div>
          <Button variant="outline" size="sm" onClick={() => goToPage("next")} disabled={page >= pageCount}>
            Next
          </Button>
          <div className="flex items-center gap-2">
            <ZoomOut className="h-4 w-4 text-muted-foreground" />
            <Slider
              className="w-28"
              value={[scale]}
              min={0.6}
              max={2}
              step={0.1}
              onValueChange={(value) => setScale(value[0])}
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-sm text-muted-foreground">{Math.round(scale * 100)}%</div>
        </div>
      </div>
      <div className="flex min-h-[420px] items-center justify-center rounded-lg border bg-background">
        {loading ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Preparing your PDF...</p>
          </div>
        ) : (
          <canvas ref={canvasRef} className="max-h-[80vh] w-full rounded-lg bg-secondary" />
        )}
      </div>
    </div>
  );
};
