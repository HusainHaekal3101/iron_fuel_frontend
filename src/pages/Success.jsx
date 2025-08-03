import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserProvider";

const Success = () => {
    const navigate = useNavigate();
    const { userEmail } = useContext(UserContext);
    const [countdown, setCountdown] = useState(7);

    useEffect(() => {
        const clearCart = async () => {
            try {
                await axios.delete(`https://iron-fuel-express-api.vercel.app/cart/clear/${userEmail}`);
            } catch (err) {
                console.error("Failed to clear cart after payment", err);
            }
        };

        if (userEmail) clearCart();

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    navigate("/products");
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate, userEmail]);

    return (
        <div className="text-center mt-5 text-dark"
            style={{ backgroundColor: "white", padding: "2rem" }}>
            <h1 className="mb-4">Your order is on its way to you!</h1>

            <div
                className="card p-4 mx-auto mt-4"
                style={{ maxWidth: "400px", backgroundColor: "white" }}
            >
                <h4 className="mb-3">Payment Successful!</h4>
                <p>Thank you for your purchase!</p>
                <p><strong>Total:</strong> (Displayed in Stripe receipt)</p>
                <p>For issues, email <strong>support@ironfuel.com</strong></p>
                <p>Redirecting to product page in {countdown} seconds...</p>
                <button className="btn btn-dark mt-2" onClick={() => navigate("/products")}>
                    Return to Home
                </button>
            </div>
        </div>
    );
};

export default Success;
