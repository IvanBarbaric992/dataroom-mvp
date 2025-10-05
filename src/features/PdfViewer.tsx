import { useState } from 'react';

import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'sonner';

import Button from '@/components/common/button';
import type { NodeRecord } from '@/entities/node/node.types';
import { db } from '@/shared/lib/database';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: NodeRecord | null;
}

const PdfViewer = ({ open, onOpenChange, node }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [pdfData, setPdfData] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPdfData = async (node: NodeRecord) => {
    if (!node.blobId) {
      toast.error('PDF data not found');
      return;
    }

    setLoading(true);
    try {
      const blob = await db.blobs.get(node.blobId);
      if (!blob) {
        toast.error('PDF file not found');
        return;
      }

      setPdfData(blob.data);
    } catch (error) {
      console.error('Failed to load PDF:', error);
      toast.error('Failed to load PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    toast.error('Failed to load PDF document');
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(3, prev + 0.2));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.2));
  };

  // Load PDF when modal opens with valid node
  if (open && node && !pdfData && !loading) {
    loadPdfData(node).catch(console.error);
  }

  // Reset state when modal closes
  if (!open && pdfData) {
    setPdfData(null);
    setPageNumber(1);
    setNumPages(0);
    setScale(1.2);
  }

  if (!open || !node) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4`}>
      <div
        className={`flex h-full w-full max-w-4xl flex-col rounded-lg bg-background sm:h-[90vh] sm:w-[90vw]`}
      >
        <div className="flex flex-col gap-2 border-b p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
          <div>
            <h2 className="text-lg font-semibold">{node.name}</h2>
            <p className="text-sm text-muted-foreground">
              {numPages > 0 && `Page ${pageNumber.toString()} of ${numPages.toString()}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" onClick={zoomOut}>
                <ZoomOut className="h-4 w-4" />
                <span className="sr-only">Zoom out</span>
              </Button>
              <span className="min-w-[3rem] text-center text-sm font-medium">
                {Math.round(scale * 100)}%
              </span>
              <Button size="sm" variant="outline" onClick={zoomIn}>
                <ZoomIn className="h-4 w-4" />
                <span className="sr-only">Zoom in</span>
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button disabled={pageNumber <= 1} size="sm" variant="outline" onClick={goToPrevPage}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                disabled={pageNumber >= numPages}
                size="sm"
                variant="outline"
                onClick={goToNextPage}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading PDF...</p>
            </div>
          ) : pdfData ? (
            <div className="flex justify-center">
              <Document
                file={pdfData}
                loading={
                  <div className="flex items-center justify-center p-8">
                    <p className="text-muted-foreground">Loading document...</p>
                  </div>
                }
                onLoadError={handleDocumentLoadError}
                onLoadSuccess={handleDocumentLoadSuccess}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  loading={
                    <div className="flex items-center justify-center p-8">
                      <p className="text-muted-foreground">Loading page...</p>
                    </div>
                  }
                />
              </Document>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No PDF data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
