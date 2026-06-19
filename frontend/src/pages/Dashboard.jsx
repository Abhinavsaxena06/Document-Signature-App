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

    // EDIT STATE
    const [selectedSignature, setSelectedSignature] = useState(null);

    // MODALS
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [showInitialsModal, setShowInitialsModal] = useState(false);
    const [showNameModal, setShowNameModal] = useState(false);

    // ---------------- UPLOAD ----------------
    const uploadPdfToServer = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post("/documents/upload", formData);
        setDocumentId(res.data.id);
    };

    // ---------------- DELETE SIGNATURE ----------------
    const deleteSignature = (id) => {
        setSignatures(prev => prev.filter(sig => sig.id !== id));
    };

    // ---------------- UPDATE SIGNATURE (REAL TIME) ----------------
    const updateSignature = (updated) => {
        setSignatures(prev =>
            prev.map(sig =>
                sig.id === updated.id ? updated : sig
            )
        );
    };

    // ---------------- SIGN PDF ----------------
    const savePDF = async () => {

        if (!documentId || signatures.length === 0) {
            alert("Upload PDF + add signature first");
            return;
        }

        const sig = signatures[0];

        const payload = {
            documentId,
            signatureId: sig.signatureId,
            pageNumber: sig.pageNumber || 1,
            x: sig.x,
            y: sig.y,
            width: sig.width,
            height: sig.height,
            scale: pdfScale,
            pageHeightPx
        };

        const res = await api.post("/documents/sign", payload);
        setSignedDocumentId(res.data.id);

        alert("PDF Signed Successfully");
    };

    return (
        <div className="container-fluid vh-100 bg-dark text-light">

            <div className="row h-100">

                {/* LEFT */}
                <div className="col-md-3 p-3 border-end border-secondary">
                    <h4>Upload PDF</h4>

                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            setPdfFile(file);
                            uploadPdfToServer(file);
                        }}
                    />

                    <hr />
                    <p>Doc ID: {documentId}</p>
                </div>

                {/* CENTER (SCROLL ONLY HERE) */}
                <div
                    className="col-md-6 p-3"
                    style={{
                        height: "100vh",
                        overflowY: "auto",
                        background: "#1e1e1e",
                        position: "relative"
                    }}
                >
                    {!pdfFile ? (
                        <h5>Upload PDF to start</h5>
                    ) : (
                        <div style={{ position: "relative" }}>

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
                                    onClick={() => {
                                        setSelectedSignature(sig);
                                        setShowSignatureModal(true);
                                    }}
                                    onDelete={() => deleteSignature(sig.id)}
                                />
                            ))}

                        </div>
                    )}
                </div>

                {/* RIGHT */}
                <div className="col-md-3 p-3 border-start border-secondary">

                    <h4>Tools</h4>

                    <button
                        className="btn btn-danger w-100 mb-2"
                        onClick={() => {
                            setSelectedSignature(null);
                            setShowSignatureModal(true);
                        }}
                    >
                        Add Signature
                    </button>

                    <button className="btn btn-primary w-100 mb-2" onClick={() => setShowInitialsModal(true)}>
                        Add Initials
                    </button>

                    <button className="btn btn-success w-100 mb-2" onClick={() => setShowNameModal(true)}>
                        Add Name
                    </button>

                    <button className="btn btn-dark w-100 mt-3" onClick={savePDF}>
                        Sign PDF
                    </button>

                    <button className="btn btn-outline-success w-100 mt-2"
                        onClick={async () => {
                            const res = await api.get(
                                `/documents/download/${signedDocumentId}`,
                                { responseType: "blob" }
                            );

                            const url = window.URL.createObjectURL(new Blob([res.data]));
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "signed.pdf";
                            a.click();
                        }}>
                        Download
                    </button>

                </div>
            </div>

            {/* SIGNATURE MODAL (EDIT + CREATE) */}
            <SignatureModal
                show={showSignatureModal}
                onClose={() => setShowSignatureModal(false)}

                initialData={selectedSignature}

                onSave={async (data) => {

                    let imageToSend = data.image;

                    if (!imageToSend && data.text) {
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");

                        canvas.width = 300;
                        canvas.height = 100;

                        ctx.font = `40px ${data.font || "cursive"}`;
                        ctx.fillText(data.text, 10, 60);

                        imageToSend = canvas.toDataURL();
                    }

                    // EDIT MODE
                    if (selectedSignature) {
                        updateSignature({
                            ...selectedSignature,
                            text: data.text,
                            image: imageToSend,
                            font: data.font,
                            color: data.color
                        });
                    }
                    // CREATE MODE
                    else {
                        const res = await api.post("/signatures/create", {
                            text: data.text,
                            image: imageToSend,
                            type: data.type
                        });

                        setSignatures(prev => [
                            ...prev,
                            {
                                id: Date.now(),
                                signatureId: res.data.id,
                                text: data.text,
                                image: imageToSend,
                                font: data.font,
                                color: data.color,
                                x: 100,
                                y: 100,
                                width: 180,
                                height: 60,
                                pageNumber: 1
                            }
                        ]);
                    }

                    setShowSignatureModal(false);
                    setSelectedSignature(null);
                }}
            />

            <InitialsModal show={showInitialsModal} onClose={() => setShowInitialsModal(false)} />
            <NameModal show={showNameModal} onClose={() => setShowNameModal(false)} />

        </div>
    );
}

export default Dashboard;