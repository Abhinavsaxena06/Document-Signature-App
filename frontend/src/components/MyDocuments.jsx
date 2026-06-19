import { useEffect, useState } from "react";
import api from "../services/api";

function MyDocuments() {

    const [documents, setDocuments] = useState([]);

    const loadDocuments = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await api.get(
                "/documents/my-documents",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setDocuments(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);

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
            <h2>My Documents</h2>

            {documents.length === 0 ? (
                <p>No documents found</p>
            ) : (
                <table
                    border="1"
                    cellPadding="10"
                    width="100%"
                >
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>File Name</th>
                        <th>Status</th>
                    </tr>
                    </thead>

                    <tbody>
                    {documents.map((doc) => (
                        <tr key={doc.id}>
                            <td>{doc.id}</td>
                            <td>{doc.fileName}</td>
                            <td>{doc.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}

export default MyDocuments;