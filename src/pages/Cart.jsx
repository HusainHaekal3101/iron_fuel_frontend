import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const Cart = ({ userEmail }) => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.get(`https://iron-fuel-express-api.vercel.app/cart/${userEmail}`);
                setCartItems(res.data);
            } catch (err) {
                console.error("Failed to fetch cart items", err);
                setError("Something went wrong. Please check the backend.");
            }
        };

        fetchCart();
    }, [userEmail]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://iron-fuel-express-api.vercel.app/cart/${id}`);
            setCartItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Failed to delete item", err);
        }
    };

    const handleCheckout = async () => {
        try {
            const res = await axios.post("https://iron-fuel-express-api.vercel.app/create-checkout-session", {
                cartItems,
            });
            window.location.href = res.data.url;
        } catch (err) {
            console.error("Checkout error:", err);
            alert("Checkout failed");
        }
    };

    const updateQuantity = async (id, newQty) => {
        if (newQty < 1) return;

        try {
            await axios.put(`https://iron-fuel-express-api.vercel.app/cart/${id}`, { quantity: newQty });
            setCartItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, quantity: newQty } : item
                )
            );
        } catch (err) {
            console.error("Failed to update quantity", err);
        }
    };

    const getTotal = () =>
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    return (
        <div className="container mt-4">
            <h2>My Cart</h2>
            {error && <p className="text-danger">{error}</p>}

            {cartItems.length === 0 ? (
                <p>No items in cart.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.id} className="card mb-3 d-flex flex-row">
                            <img
                                src={item.image_url || "https://via.placeholder.com/100"}
                                className="img-thumbnail"
                                alt={item.product_name}
                                style={{ width: "120px", objectFit: "cover" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{item.product_name}</h5>
                                <p className="card-text text-muted">Great quality gym item.</p>
                                <p className="card-text">
                                    <strong>RM {item.price}</strong>
                                </p>
                                <div className="d-flex align-items-center gap-2">
                                    <label className="mb-0">Qty:</label>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                            </div>
                            <button
                                className="btn btn-danger align-self-start m-3"
                                onClick={() => handleDelete(item.id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}

                    <div className="mt-4 border-top pt-3">
                        <h5>Subtotal: RM {getTotal()}</h5>
                        <p>Estimated Shipping: RM 0.00</p>
                        <h4>Total: RM {getTotal()}</h4>
                        <button className="btn btn-primary w-100" onClick={handleCheckout}>Checkout Securely</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
