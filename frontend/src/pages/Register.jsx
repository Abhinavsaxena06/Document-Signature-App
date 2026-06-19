import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await api.post("/users/register", {
                name,
                email,
                password
            });

            alert("Registration Successful");
            navigate("/login");

        } catch (err) {
            console.log(err);
            alert("Registration Failed");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">

            <div className="card p-4 shadow" style={{ width: "400px", borderRadius: "12px" }}>

                <h3 className="text-center mb-3">Create Account</h3>

                <form onSubmit={handleRegister}>

                    <input
                        className="form-control mb-2"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        className="form-control mb-2"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="btn btn-primary w-100">
                        Register
                    </button>

                </form>

                <p className="text-center mt-3">
                    Already have account? <Link to="/login">Login</Link>
                </p>

            </div>
        </div>
    );
}

export default Register;