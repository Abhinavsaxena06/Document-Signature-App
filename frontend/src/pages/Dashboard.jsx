import { useState } from "react";
import api from "../services/api";

import PDFViewer from "../components/PDFViewer";
import SignatureDraggable from "../components/SignatureDraggable";

import SignatureModal from "../components/SignatureModal";
import InitialsModal from "../components/InitialsModal";
import NameModal from "../components/NameModal";

function Dashboard() {

    const [pdfFile, setPdfFile] = useState(null);
    const [documentId, setDocumentId] = useState(null);
    const [signedDocumentId, setSignedDocumentId] = useState(null);

    const [signatures, setSignatures] = useState([]);
    const [pageHeightPx, setPageHeightPx] = useState(0);
    const [pdfScale, setPdfScale] = useState(1);
    console.log("SIGNATURES STATE =", signatures);

    // MODALS
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [showInitialsModal, setShowInitialsModal] = useState(false);
    const [showNameModal, setShowNameModal] = useState(false);

    // ---------------- UPLOAD PDF ----------------
    const uploadPdfToServer = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await api.post("/documents/upload", formData);
            setDocumentId(res.data.id);

        } catch (err) {
            console.error(err);
            alert("PDF upload failed");
        }
    };

    // ---------------- SIGN PDF ----------------
    const savePDF = async () => {
        try {

            if (!documentId || signatures.length === 0) {
                alert("Upload PDF + add signature first");
                return;
            }

            const sig = signatures[0];

            console.log("SIGNATURE =", sig);

            const payload = {
                documentId: documentId,
                signatureId: sig.signatureId,
                pageNumber: sig.pageNumber || 1,

                x: sig.x,
                y: sig.y,
                width: sig.width,
                height: sig.height,

                scale: pdfScale,
                pageHeightPx: pageHeightPx
            };

            console.log("PAYLOAD =", payload);

            const res = await api.post(
                "/documents/sign",
                payload
            );

            setSignedDocumentId(res.data.id);

            alert("PDF Signed Successfully");

        } catch (err) {
            console.error(err);
            alert("Sign failed");
        }
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">

                {/* LEFT */}
                <div className="col-md-3 p-3 border-end">

                    <h4>Upload PDF</h4>

                    <input
                        type="file"
                        className="form-control"
                        accept="application/pdf"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            setPdfFile(file);
                            uploadPdfToServer(file);
                        }}
                    />

                    <hr />

                    <p><b>Doc ID:</b> {documentId}</p>
                    <p><b>Total Items:</b> {signatures.length}</p>

                </div>

                {/* CENTER */}
                <div
                    className="col-md-6 p-3 bg-light"
                    style={{
                        position: "relative",
                        minHeight: "100vh",
                        overflow: "auto"
                    }}
                >
                    {!pdfFile ? (
                        <h5>Upload PDF to start</h5>
                    ) : (
                        <>
                            <PDFViewer
                                pdfFile={pdfFile}
                                onPageRender={(page) => {
                                    setPageHeightPx(page.height);
                                }}
                            />

                            {signatures.map(sig => (
                                <SignatureDraggable
                                    key={sig.id}
                                    signature={sig}
                                    setSignatures={setSignatures}
                                />
                            ))}
                        </>
                    )}
                </div>

                {/* RIGHT */}
                <div className="col-md-3 p-3 border-start">

                    <h4>Tools</h4>

                    <button
                        className="btn btn-danger w-100 mb-2"
                        onClick={() => setShowSignatureModal(true)}
                    >
                        Add Signature
                    </button>

                    <button
                        className="btn btn-primary w-100 mb-2"
                        onClick={() => setShowInitialsModal(true)}
                    >
                        Add Initials
                    </button>

                    <button
                        className="btn btn-success w-100 mb-2"
                        onClick={() => setShowNameModal(true)}
                    >
                        Add Name
                    </button>

                    <button
                        className="btn btn-dark w-100 mt-3"
                        onClick={savePDF}
                    >
                        Sign PDF
                    </button>

                    <button
                        className="btn btn-outline-success w-100 mt-2"
                        onClick={async () => {
                            if (!signedDocumentId) {
                                return alert("No signed PDF");
                            }

                            try {
                                const token = localStorage.getItem("token");

                                const response = await api.get(
                                    `/documents/download/${signedDocumentId}`,
                                    {
                                        responseType: "blob",
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );

                                const url = window.URL.createObjectURL(
                                    new Blob([response.data])
                                );

                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "signed.pdf";
                                document.body.appendChild(a);
                                a.click();
                                a.remove();

                                window.URL.revokeObjectURL(url);

                            } catch (err) {
                                console.error(err);
                                alert("Download failed");
                            }
                        }}
                    >
                        Download
                    </button>

                </div>

            </div>

            {/* MODALS */}
            <SignatureModal
                show={showSignatureModal}
                onClose={() => setShowSignatureModal(false)}
onSave={async (data) => {
    try {

        let imageToSend = data.image;

        // 🔥 FIX: convert typed text into image
        if (!imageToSend && data.text) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = 300;
            canvas.height = 100;

            ctx.font = `40px ${data.font || "cursive"}`;
            ctx.fillStyle = data.color || "#000";
            ctx.fillText(data.text, 10, 60);

            imageToSend = canvas.toDataURL("image/png");
        }

        const res = await api.post("/signatures/create", {
            text: data.text || null,
            image: imageToSend,
            type: data.type
        });

        setSignatures(prev => [
            ...prev,
            {
                id: Date.now(),
                signatureId: res.data.id,
                type: data.type,
                text: data.text || null,
                image: imageToSend,   // 🔥 ALWAYS PRESENT NOW
                font: data.font || null,
                color: data.color || null,
                x: 100,
                y: 100,
                width: 180,
                height: 60,
                pageNumber: 1
            }
        ]);

        setShowSignatureModal(false);

        } catch (err) {
            console.error(err);
            alert("Failed to save signature");
        }
    }}
            />

            <InitialsModal
                show={showInitialsModal}
                onClose={() => setShowInitialsModal(false)}
                onSave={(text) => {
                    setSignatures(prev => [
                        ...prev,
                        {
                            id: Date.now(),
                            type: "typed",
                            subtype: "initials",
                            text,
                            font: "cursive",
                            color: "#000",
                            x: 120,
                            y: 120,
                            width: 120,
                            height: 60,
                            pageNumber: 1
                        }
                    ]);
                    setShowInitialsModal(false);
                }}
            />

            <NameModal
                show={showNameModal}
                onClose={() => setShowNameModal(false)}
                onSave={(text) => {
                    setSignatures(prev => [
                        ...prev,
                        {
                            id: Date.now(),
                            type: "typed",
                            subtype: "name",
                            text,
                            font: "cursive",
                            color: "#000",
                            x: 150,
                            y: 150,
                            width: 220,
                            height: 60,
                            pageNumber: 1
                        }
                    ]);
                    setShowNameModal(false);
                }}
            />

        </div>
    );
}

export default Dashboard;