import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/users/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "token",
                response.data
            );

            alert("Login Successful");

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            alert("Invalid Credentials");
        }
    };

    return (
        <div
            className="container-fluid vh-100 d-flex justify-content-center align-items-center"
            style={{
                background:
                    "linear-gradient(135deg,#667eea,#764ba2)"
            }}
        >
            <div
                className="card shadow-lg border-0"
                style={{
                    width: "450px",
                    borderRadius: "20px"
                }}
            >
                <div className="card-body p-5">

                    <h1
                        className="text-center fw-bold mb-2"
                    >
                        DocSign
                    </h1>

                    <p
                        className="text-center text-muted mb-4"
                    >
                        Secure Digital Signature Platform
                    </p>

                    <h3
                        className="text-center mb-4"
                    >
                        Login
                    </h3>

                    <form onSubmit={handleLogin}>

                        <div className="mb-3">

                            <label className="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="mb-4">

                            <label className="form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2"
                        >
                            Login
                        </button>

                    </form>

                    <p
                        className="text-center mt-4"
                    >
                        Don't have an account?

                        <Link
                            to="/register"
                            className="ms-2 text-decoration-none"
                        >
                            Register
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Login;