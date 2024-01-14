"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Page, Document as PdfDocument, pdfjs } from "react-pdf";

/**
 * @see https://dev.to/mfts/building-a-beautiful-document-viewer-with-react-pdf-666
 *      - component from here
 * @see https://github.com/wojtekmaj/react-pdf/blob/main/sample/next-app/app/Sample.tsx
 *      - `workerSrc` and `options` shown here made this work
 *      - also next.config.js
 */

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
  standardFontDataUrl: "standard_fonts/",
};

interface PDFViewerProps {
  file: ComponentProps<typeof PdfDocument>["file"];
  fileName: string;
  webViewLink: string;
}

export default function PDFViewer({
  file,
  fileName,
  webViewLink,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1); // start on first page
  const [, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState<number>();

  /**
   * Get resume's navbar width for the pdf width
   */
  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (navRef.current) {
      setPageWidth(navRef.current.clientWidth);
    }

    const handleResize = () => {
      if (navRef.current) {
        setPageWidth(navRef.current.clientWidth);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: PDFDocumentProxy) {
    setNumPages(numPages);
  }
  function onPageLoadSuccess() {
    setLoading(false);
  }

  return (
    <>
      <Nav
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        ref={navRef}
        numPages={numPages}
        fileName={fileName}
        href={webViewLink}
      />
      <PdfDocument
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
        renderMode="canvas"
        className={"h-[30rem]"}
      >
        <Page
          className="w-full"
          key={pageNumber}
          pageNumber={pageNumber}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          onLoadSuccess={onPageLoadSuccess}
          onRenderError={() => setLoading(false)}
          width={pageWidth}
        />
      </PdfDocument>
    </>
  );
}

const Nav = forwardRef<
  HTMLDivElement,
  {
    pageNumber: number;
    setPageNumber: Dispatch<SetStateAction<number>>;
    numPages: number;
    fileName: string;
    href: string;
  }
>(({ pageNumber, setPageNumber, numPages, fileName, href }, ref) => {
  return (
    <nav ref={ref} className="bg-black">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link
                href={href}
                target="_blank"
                className="text-2xl font-bold tracking-tighter text-white underline hover:text-blue-600"
              >
                {fileName}
              </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="flex items-center justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">
              <span>
                <button
                  onClick={() =>
                    setPageNumber((prevPageNumber) => prevPageNumber - 1)
                  }
                  disabled={pageNumber <= 1}
                  className="flex items-center"
                >
                  <ChevronLeftIcon className="h-4" aria-hidden="true" />
                </button>
              </span>
              <span>{pageNumber}</span>
              <span className="text-gray-400"> / {numPages}</span>
              <span>
                <button
                  onClick={() =>
                    setPageNumber((prevPageNumber) => prevPageNumber + 1)
                  }
                  disabled={pageNumber >= numPages}
                  className="flex items-center"
                >
                  <ChevronRightIcon className="h-4" aria-hidden="true" />
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});
