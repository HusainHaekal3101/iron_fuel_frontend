import { useEffect, useState } from "react";
import axios from "axios";

const Checkout = ({ userEmail }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            const res = await axios.get(`https://iron-fuel-express-api.vercel.app/cart/${userEmail}`);
            setCartItems(res.data);
        };
        fetchCart();
    }, [userEmail]);

    const handleCheckout = async () => {
        try {
            const res = await axios.post("https://iron-fuel-express-api.vercel.app/create-checkout-session", {
                items: cartItems,
            });
            window.location.href = res.data.url;
        } catch (err) {
            console.error("Checkout error:", err);
            alert("Checkout failed. Try again.");
        }
    };

    return (
        <div className="container text-white mt-5">
            <h2>Checkout</h2>
            {cartItems.length === 0 ? (
                <p>No items to checkout</p>
            ) : (
                <button className="btn btn-success" onClick={handleCheckout}>
                    Proceed to Payment
                </button>
            )}
        </div>
    );
};

export default Checkout;
