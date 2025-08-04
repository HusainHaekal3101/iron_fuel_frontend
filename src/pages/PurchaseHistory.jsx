import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserProvider";

const PurchaseHistory = () => {
    const { userEmail } = useContext(UserContext);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`https://iron-fuel-express-api.vercel.app/history/${userEmail}`);
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch purchase history", err);
            }
        };

        if (userEmail) fetchHistory();
    }, [userEmail]);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">🧾 Purchase History</h2>
            {history.length === 0 ? (
                <p>No purchase history found.</p>
            ) : (
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Price (MYR)</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.product_name}</td>
                                <td>{item.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>{(item.price * item.quantity).toFixed(2)}</td>
                                <td>{new Date(item.purchased_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PurchaseHistory;
