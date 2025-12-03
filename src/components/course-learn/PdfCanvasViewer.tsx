import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useEmblaCarousel from "embla-carousel-react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Download, ExternalLink, Loader2 } from "lucide-react";

const PDFJS_VERSION = "4.4.168";
const PDFJS_SCRIPT = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
const PDFJS_WORKER = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

interface PdfCanvasViewerProps {
  src?: string;
  title?: string;
}

type PdfImagePage = {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
};

const loadPdfJs = (): Promise<any> => {
  if (typeof window === "undefined") return Promise.reject("Window not available");

  const existing = (window as any).pdfjsLib;
  if (existing) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PDFJS_SCRIPT;
    script.async = true;
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) {
        reject(new Error("PDF.js failed to load"));
        return;
      }
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      resolve(pdfjsLib);
    };
    script.onerror = () => reject(new Error("Could not load PDF.js"));
    document.body.appendChild(script);
  });
};

export const PdfCanvasViewer = ({ src, title }: PdfCanvasViewerProps) => {
  const [pages, setPages] = useState<PdfImagePage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const loadingTaskRef = useRef<any>(null);

  const subtitle = useMemo(() => {
    if (!numPages) return "Swipe or use arrows to move between pages.";
    return `Swipe or use arrows to move between ${numPages} pages.`;
  }, [numPages]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCurrentPage(emblaApi.selectedScrollSnap() + 1);
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !pages.length) return;
    emblaApi.reInit();
    emblaApi.scrollTo(currentPage - 1, true);
  }, [emblaApi, currentPage, pages.length]);

  useEffect(() => {
    let isCancelled = false;

    const renderPdf = async () => {
      if (!src) return;
      setError(null);
      setLoading(true);
      setPages([]);
      setNumPages(0);
      setCurrentPage(1);

      try {
        const pdfjsLib = await loadPdfJs();
        const loadingTask = pdfjsLib.getDocument(src);
        loadingTaskRef.current = loadingTask;
        const pdf = await loadingTask.promise;
        if (isCancelled) return;
        setNumPages(pdf.numPages || 0);

        const renderedPages: PdfImagePage[] = [];
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.2 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;
          if (isCancelled) return;
          renderedPages.push({
            pageNumber,
            dataUrl: canvas.toDataURL("image/png"),
            width: viewport.width,
            height: viewport.height,
          });
          setPages([...renderedPages]);
        }

        setLoading(false);
      } catch (err) {
        if (isCancelled) return;
        setError(err instanceof Error ? err.message : "Unable to load PDF.");
        setLoading(false);
      }
    };

    renderPdf();

    return () => {
      isCancelled = true;
      if (loadingTaskRef.current) {
        loadingTaskRef.current.destroy?.();
      }
    };
  }, [src]);

  if (!src) return null;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Preview unavailable</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(numPages || prev + 1, prev + 1));
  };

  const handleInputChange = (value: number) => {
    if (!numPages) return;
    const nextPage = Math.min(Math.max(1, value), numPages);
    setCurrentPage(nextPage);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/50 px-4 py-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{title || "Lesson Attachment"}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {numPages ? <Badge variant="secondary">{numPages} pages</Badge> : null}
          <Button variant="outline" size="sm" asChild>
            <a href={src} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Open original
            </a>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <a href={src} download className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentPage === 1 || loading}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-foreground">
            Page {currentPage} {numPages ? `of ${numPages}` : ""}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={loading || (numPages ? currentPage >= numPages : false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {numPages ? (
          <div className="flex flex-1 items-center gap-3">
            <Input
              type="range"
              min={1}
              max={numPages}
              value={currentPage}
              onChange={(event) => handleInputChange(Number(event.target.value))}
              className="flex-1"
            />
          </div>
        ) : null}
      </div>

      <div className="relative overflow-hidden rounded-xl border bg-background">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-xs font-medium">Preparing your pages...</p>
            </div>
          </div>
        )}

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {pages.map((page) => (
              <div
                key={page.pageNumber}
                className="flex min-w-0 flex-[0_0_100%] items-center justify-center bg-muted/30 px-6 py-8 md:flex-[0_0_85%] lg:flex-[0_0_70%]"
              >
                <div className="overflow-hidden rounded-lg border bg-white shadow-md">
                  <img
                    src={page.dataUrl}
                    alt={`Page ${page.pageNumber}`}
                    className="block h-auto max-h-[75vh] w-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!loading && !pages.length ? (
        <Alert>
          <AlertTitle>Rendering in progress</AlertTitle>
          <AlertDescription>We are preparing your PDF preview. It will appear here shortly.</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
};
