import { useState } from "react";
import api from "../services/api";

function SignDocument() {

    const [documentId, setDocumentId] = useState("");
    const [signatureId, setSignatureId] = useState("");
    const [pageNumber, setPageNumber] = useState("");
    const [x, setX] = useState("");
    const [y, setY] = useState("");

    const signDocument = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await api.post(
                "/documents/sign",
                {
                    documentId:
                        Number(documentId),

                    signatureId:
                        Number(signatureId),

                    pageNumber:
                        Number(pageNumber),

                    x:
                        Number(x),

                    y:
                        Number(y)
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);

            alert("Document Signed Successfully");

        } catch (error) {

            console.error(error);

            alert("Signing Failed");
        }
    };

    return (
        <div
            style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                marginTop: "20px",
                boxShadow:
                    "0px 0px 10px rgba(0,0,0,0.1)"
            }}
        >
            <h2>Sign Document</h2>

            <input
                type="number"
                placeholder="Document ID"
                value={documentId}
                onChange={(e) =>
                    setDocumentId(e.target.value)
                }
            />

            <br /><br />

            <input
                type="number"
                placeholder="Signature ID"
                value={signatureId}
                onChange={(e) =>
                    setSignatureId(e.target.value)
                }
            />

            <br /><br />

            <input
                type="number"
                placeholder="Page Number"
                value={pageNumber}
                onChange={(e) =>
                    setPageNumber(e.target.value)
                }
            />

            <br /><br />

            <input
                type="number"
                placeholder="X Position"
                value={x}
                onChange={(e) =>
                    setX(e.target.value)
                }
            />

            <br /><br />

            <input
                type="number"
                placeholder="Y Position"
                value={y}
                onChange={(e) =>
                    setY(e.target.value)
                }
            />

            <br /><br />

            <button
                onClick={signDocument}
            >
                Sign Document
            </button>

        </div>
    );
}

export default SignDocument;