import { useState } from "react";
import api from "../services/api";

function UploadSignature() {

    const [file, setFile] = useState(null);

    const uploadSignature = async () => {

        if (!file) {
            alert("Select a signature image");
            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            await api.post(
                "/signatures/upload",
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

            alert("Signature Uploaded");

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
                marginTop: "20px",
                boxShadow:
                    "0px 0px 10px rgba(0,0,0,0.1)"
            }}
        >
            <h2>Upload Signature</h2>

            <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                    setFile(e.target.files[0])
                }
            />

            <br />
            <br />

            <button
                onClick={uploadSignature}
            >
                Upload Signature
            </button>

        </div>
    );
}

export default UploadSignature;