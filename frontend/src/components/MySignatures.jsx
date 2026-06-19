import { useEffect, useState } from "react";
import api from "../services/api";

function MySignatures() {

    const [signatures, setSignatures] = useState([]);

    const loadSignatures = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await api.get(
                "/signatures/my",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setSignatures(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {
        loadSignatures();
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
            <h2>My Signatures</h2>

            {signatures.length === 0 ? (
                <p>No signatures found</p>
            ) : (
                <table
                    border="1"
                    cellPadding="10"
                    width="100%"
                >
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Path</th>
                    </tr>
                    </thead>

                    <tbody>
                    {signatures.map((sig) => (
                        <tr key={sig.id}>
                            <td>{sig.id}</td>
                            <td>{sig.type}</td>
                            <td>{sig.signaturePath}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}

export default MySignatures;