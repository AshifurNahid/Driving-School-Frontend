import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";

const PDF_SOURCES: { script: string; worker: string }[] = [
  {
    script: import.meta.env.VITE_PDFJS_SRC,
    worker: import.meta.env.VITE_PDFJS_WORKER_SRC,
  },
  {
    script: "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.min.js",
    worker:
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.js",
  },
  {
    script: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.js",
    worker:
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js",
  },
  {
    script: "/pdfjs/pdf.min.js",
    worker: "/pdfjs/pdf.worker.min.js",
  },
].filter(
  (source): source is { script: string; worker: string } =>
    Boolean(source.script) && Boolean(source.worker)
);

type PdfDocument = any;
type PdfjsLib = any;

declare global {
  interface Window {
    pdfjsLib?: PdfjsLib;
  }
}

let pdfJsPromise: Promise<PdfjsLib> | null = null;

const loadPdfJs = async () => {
  if (typeof window === "undefined") throw new Error("PDF viewer unavailable");
  if (window.pdfjsLib) return window.pdfjsLib;

  if (!pdfJsPromise) {
    pdfJsPromise = new Promise((resolve, reject) => {
      let attempt = 0;

      const tryLoad = () => {
        const source = PDF_SOURCES[attempt];
        if (!source) {
          reject(new Error("Failed to load PDF.js library"));
          return;
        }

        const existing = document.querySelector<HTMLScriptElement>(
          `script[src='${source.script}']`
        );

        const onLoad = () => {
          if (window.pdfjsLib?.GlobalWorkerOptions) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = source.worker;
            resolve(window.pdfjsLib);
            return;
          }
          attempt += 1;
          tryLoad();
        };

        const onError = () => {
          attempt += 1;
          tryLoad();
        };

        if (existing) {
          existing.addEventListener("load", onLoad, { once: true });
          existing.addEventListener("error", onError, { once: true });
          return;
        }

        const script = document.createElement("script");
        script.src = source.script;
        script.async = true;
        script.onload = onLoad;
        script.onerror = onError;
        document.head.appendChild(script);
      };

      tryLoad();
    });
  }

  return pdfJsPromise;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const PageCanvas = ({
  pdf,
  pageNumber,
  width,
  scale,
  onRendered,
}: {
  pdf: PdfDocument;
  pageNumber: number;
  width: number;
  scale: number;
  onRendered?: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let renderTask: any;
    let cancelled = false;

    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const scaledViewport = page.getViewport({ scale: (width / viewport.width) * scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      renderTask = page.render({ canvasContext: context, viewport: scaledViewport });
      await renderTask.promise;
      if (!cancelled) onRendered?.();
    };

    renderPage();

    return () => {
      cancelled = true;
      if (renderTask?.cancel) renderTask.cancel();
    };
  }, [pdf, pageNumber, width, scale, onRendered]);

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} className="max-w-full rounded-xl shadow-lg" />
    </div>
  );
};

interface PdfCarouselViewerProps {
  src?: string | null;
  title?: string;
}

export const PdfCarouselViewer = ({ src, title }: PdfCarouselViewerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PdfDocument | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [fitMode, setFitMode] = useState<"width" | "page" | "manual">("width");
  const [containerWidth, setContainerWidth] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setContainerWidth(entry.contentRect.width);
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const effectiveWidth = useMemo(() => {
    const base = Math.max(containerWidth - 64, 320);
    if (fitMode === "page") return Math.min(base, 900);
    return base;
  }, [containerWidth, fitMode]);

  const renderScale = fitMode === "manual" ? zoom : 1;

  useEffect(() => {
    if (!src) return;
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      setPdfDoc(null);
      try {
        const pdfjs = await loadPdfJs();
        if (!pdfjs?.GlobalWorkerOptions) throw new Error("PDF.js unavailable");
        const documentProxy = await pdfjs.getDocument(src).promise;
        if (!isMounted) return;
        setPdfDoc(documentProxy);
        setNumPages(documentProxy.numPages || 0);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setError("We couldn't load this PDF. Please try again or download it directly.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [src]);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => {
      const index = carouselApi.selectedScrollSnap() || 0;
      setCurrentPage(index + 1);
    };
    carouselApi.on("select", onSelect);
    return () => carouselApi.off("select", onSelect);
  }, [carouselApi]);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const goToPage = (page: number) => {
    if (!carouselApi) return;
    const target = clamp(page, 1, numPages || 1);
    setCurrentPage(target);
    carouselApi.scrollTo(target - 1, true);
  };

  const handleInputChange = (value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    goToPage(parsed);
  };

  const handleZoomChange = (direction: "in" | "out") => {
    setFitMode("manual");
    setZoom((prev) => {
      const next = direction === "in" ? prev + 0.15 : prev - 0.15;
      return clamp(Number(next.toFixed(2)), 0.5, 2.5);
    });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen?.();
    }
  };

  if (!src) return null;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Preview unavailable</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-border/80 bg-muted/50 p-4 shadow-lg backdrop-blur"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-card/80 px-4 py-3 shadow-sm">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Resource</p>
          <p className="text-sm font-semibold text-foreground">{title || "Lesson attachment"}</p>
          <p className="text-xs text-muted-foreground">Swipe or use arrows to move between pages.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleZoomChange("out")}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleZoomChange("in")}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button
            size="sm"
            variant={fitMode === "width" ? "default" : "outline"}
            onClick={() => setFitMode("width")}
          >
            <Maximize2 className="mr-2 h-4 w-4" /> Fit to width
          </Button>
          <Button
            size="sm"
            variant={fitMode === "page" ? "default" : "outline"}
            onClick={() => setFitMode("page")}
          >
            <Minimize2 className="mr-2 h-4 w-4" /> Fit page
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-card/60 px-4 py-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">Page {currentPage}</span>
          <span className="text-xs">of {numPages || "..."}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide">Jump to</span>
          <Input
            type="number"
            className="w-20"
            value={currentPage}
            min={1}
            max={numPages || undefined}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        </div>
      </div>

      <div className="relative mt-4 rounded-2xl bg-background/80 p-4 shadow-inner">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/80">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs">Loading PDF pages...</p>
            </div>
          </div>
        )}

        {pdfDoc && numPages ? (
          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="w-full"
            setApi={setCarouselApi}
            orientation="horizontal"
          >
            <CarouselContent className="-ml-2">
              {Array.from({ length: numPages }).map((_, index) => (
                <CarouselItem key={index} className="pl-2 md:basis-full">
                  <div
                    className={cn(
                      "relative rounded-2xl bg-muted/60 p-3 shadow-sm transition",
                      currentPage - 1 === index ? "ring-2 ring-primary/60" : "ring-1 ring-transparent"
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Page {index + 1}</span>
                      <span className="rounded-full bg-background px-2 py-1 shadow-sm">{renderScale.toFixed(2)}x</span>
                    </div>
                    <PageCanvas
                      pdf={pdfDoc}
                      pageNumber={index + 1}
                      width={effectiveWidth}
                      scale={renderScale}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-6 bg-background/90 shadow" />
            <CarouselNext className="-right-6 bg-background/90 shadow" />
          </Carousel>
        ) : null}
      </div>
    </div>
  );
};
