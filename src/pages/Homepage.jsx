import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "../App.css";

const HomePage = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignup) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate("/products");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="homepage-container d-flex flex-column justify-content-center align-items-center text-white vh-100">
            <div className="form-container text-center mb-4">
                <h1 className="mb-2">Welcome to IronFuel</h1>
                <p className="mb-4">Where Grit Meets Gear</p>

                <div className="auth-toggle mb-3">
                    <button
                        className={`btn ${!isSignup ? "btn-light" : "btn-outline-light"} me-2`}
                        onClick={() => setIsSignup(false)}
                    >
                        Log In
                    </button>
                    <button
                        className={`btn ${isSignup ? "btn-light" : "btn-outline-light"}`}
                        onClick={() => setIsSignup(true)}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ width: "300px" }}>
                    <input
                        type="email"
                        placeholder="Email address"
                        className="form-control mb-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="form-control mb-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="btn btn-outline-light w-100" type="submit">
                        {isSignup ? "Create Account" : "Log In"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HomePage;
