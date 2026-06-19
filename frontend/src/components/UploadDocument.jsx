import { useState } from "react";
import api from "../services/api";

function UploadDocument() {

    const [file, setFile] = useState(null);

    const uploadDocument = async () => {

        if (!file) {
            alert("Select a PDF first");
            return;
        }

        try {

            const formData = new FormData();

            formData.append(
                "file",
                file
            );

            const token =
                localStorage.getItem("token");

            await api.post(
                "/documents/upload",
                formData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

            alert("Document Uploaded");

        } catch (error) {

            console.error(error);

            alert("Upload Failed");
        }
    };

    return (
        <div
            style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow:
                    "0px 0px 10px rgba(0,0,0,0.1)"
            }}
        >
            <h2>Upload Document</h2>

            <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                    setFile(e.target.files[0])
                }
            />

            <br />
            <br />

            <button
                onClick={uploadDocument}
            >
                Upload
            </button>
        </div>
    );
}

export default UploadDocument;