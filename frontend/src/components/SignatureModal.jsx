import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

function SignatureModal({
    show,
    onClose,
    onSave
}) {

    const [mode, setMode] =
        useState("type");

    const [signatureText, setSignatureText] =
        useState("");

    const [color, setColor] =
        useState("#000000");

    const [uploadedImage, setUploadedImage] =
        useState(null);

    const fonts = [
        "'Brush Script MT', cursive",
        "'Segoe Script', cursive",
        "'Lucida Handwriting', cursive",
        "'Monotype Corsiva', cursive",
        "'Comic Sans MS', cursive",
        "serif",
        "sans-serif",
        "monospace"
    ];

    const [font, setFont] =
        useState(fonts[0]);

    const sigPad = useRef(null);

    if (!show) return null;

    const saveTypedSignature = () => {

        if (!signatureText.trim()) {
            alert("Enter a signature");
            return;
        }

        onSave({
            type: "typed",
            text: signatureText,
            font,
            color
        });

        onClose();
    };

    const saveDrawnSignature = () => {

        if (
            !sigPad.current ||
            sigPad.current.isEmpty()
        ) {
            alert("Please draw a signature");
            return;
        }

        const image =
            sigPad.current
                .getTrimmedCanvas()
                .toDataURL("image/png");

        onSave({
            type: "drawn",
            image
        });

        onClose();
    };

    const saveUploadedSignature = () => {

        if (!uploadedImage) {
            alert("Upload a signature image");
            return;
        }

        onSave({
            type: "drawn",
            image: uploadedImage
        });

        onClose();
    };

    return (

        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
                background:
                    "rgba(0,0,0,0.6)",
                zIndex: 9999
            }}
        >

            <div
                className="bg-white p-4 rounded shadow"
                style={{
                    width: "850px",
                    maxHeight: "90vh",
                    overflowY: "auto"
                }}
            >

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h3>Create Signature</h3>

                    <button
                        className="btn btn-sm btn-danger"
                        onClick={onClose}
                    >
                        X
                    </button>

                </div>

                {/* TABS */}

                <div className="mb-4">

                    <button
                        className={`btn me-2 ${
                            mode === "type"
                                ? "btn-primary"
                                : "btn-outline-primary"
                        }`}
                        onClick={() =>
                            setMode("type")
                        }
                    >
                        Type
                    </button>

                    <button
                        className={`btn me-2 ${
                            mode === "draw"
                                ? "btn-success"
                                : "btn-outline-success"
                        }`}
                        onClick={() =>
                            setMode("draw")
                        }
                    >
                        Draw
                    </button>

                    <button
                        className={`btn ${
                            mode === "upload"
                                ? "btn-dark"
                                : "btn-outline-dark"
                        }`}
                        onClick={() =>
                            setMode("upload")
                        }
                    >
                        Upload
                    </button>

                </div>

                {/* TYPE MODE */}

                {mode === "type" && (

                    <>
                        <input
                            className="form-control mb-3"
                            placeholder="Type your signature"
                            value={signatureText}
                            onChange={(e) =>
                                setSignatureText(
                                    e.target.value
                                )
                            }
                        />

                        <select
                            className="form-select mb-3"
                            value={font}
                            onChange={(e) =>
                                setFont(
                                    e.target.value
                                )
                            }
                        >
                            {fonts.map((f, index) => (
                                <option
                                    key={index}
                                    value={f}
                                >
                                    Font Style {index + 1}
                                </option>
                            ))}
                        </select>

                        <div className="mb-3">

                            <label>
                                Signature Color
                            </label>

                            <input
                                type="color"
                                className="form-control form-control-color"
                                value={color}
                                onChange={(e) =>
                                    setColor(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <h5>Preview</h5>

                        <div
                            className="border p-4 rounded"
                            style={{
                                minHeight: "100px"
                            }}
                        >

                            <span
                                style={{
                                    fontFamily: font,
                                    fontSize: "50px",
                                    color
                                }}
                            >
                                {signatureText}
                            </span>

                        </div>

                        <button
                            className="btn btn-primary mt-3"
                            onClick={
                                saveTypedSignature
                            }
                        >
                            Save Signature
                        </button>

                    </>
                )}

                {/* DRAW MODE */}

                {mode === "draw" && (

                    <>
                        <SignatureCanvas
                            ref={sigPad}
                            penColor="black"
                            canvasProps={{
                                width: 750,
                                height: 250,
                                className:
                                    "border rounded"
                            }}
                        />

                        <div className="mt-3">

                            <button
                                className="btn btn-warning me-2"
                                onClick={() =>
                                    sigPad.current.clear()
                                }
                            >
                                Clear
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={
                                    saveDrawnSignature
                                }
                            >
                                Save Drawing
                            </button>

                        </div>
                    </>
                )}

                {/* UPLOAD MODE */}

                {mode === "upload" && (

                    <>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control mb-3"
                            onChange={(e) => {

                                const file =
                                    e.target.files[0];

                                if (!file) return;

                                const reader =
                                    new FileReader();

                                reader.onload =
                                    () =>
                                        setUploadedImage(
                                            reader.result
                                        );

                                reader.readAsDataURL(
                                    file
                                );

                            }}
                        />

                        {uploadedImage && (

                            <div className="mb-3">

                                <img
                                    src={uploadedImage}
                                    alt="Uploaded Signature"
                                    style={{
                                        maxWidth:
                                            "300px",
                                        border:
                                            "1px solid #ddd"
                                    }}
                                />

                            </div>

                        )}

                        <button
                            className="btn btn-dark"
                            onClick={
                                saveUploadedSignature
                            }
                        >
                            Use This Signature
                        </button>

                    </>
                )}

            </div>

        </div>
    );
}

export default SignatureModal;