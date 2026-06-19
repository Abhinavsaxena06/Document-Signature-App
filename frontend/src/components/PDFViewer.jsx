import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PDFViewer({ pdfFile }) {

    const [numPages, setNumPages] = useState(null);

    return (
        <div>
            <Document
                file={pdfFile}
                onLoadSuccess={({ numPages }) => {
                    setNumPages(numPages);
                }}
                onLoadError={(error) => {
                    console.error("PDF ERROR:", error);
                }}
            >
                {numPages &&
                    Array.from(
                        new Array(numPages),
                        (_, index) => (
                            <Page
                                pageNumber={1}
                                scale={1}
                                onRenderSuccess={(page) => {
                                    props.onPageRender(page);
                                }}
                            />
                        )
                    )}
            </Document>
        </div>
    );
}

export default PDFViewer;