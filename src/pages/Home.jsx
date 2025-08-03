import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";
import { auth } from "../firebase";
import "../App.css";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [sort, setSort] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            const snapshot = await getDocs(collection(db, "products"));
            let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (category) {
                items = items.filter(item => item.category === category);
            }

            if (sort === "lowToHigh") {
                items.sort((a, b) => a.price - b.price);
            } else if (sort === "highToLow") {
                items.sort((a, b) => b.price - a.price);
            }

            setProducts(items);
        };
        fetchProducts();
    }, [sort, category]);

    const handleAddToCart = async (product) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("Please log in to add to cart");
                return;
            }

            const payload = {
                user_email: user.email,
                product_id: product.id,
                product_name: product.name,
                price: product.price,
                quantity: 1,
                image_url: product.image_url,
            };

            const res = await axios.post("https://iron-fuel-express-api.vercel.app/cart", payload);
            console.log("Item added:", res.data);
            alert("Item added to cart!");
        } catch (error) {
            console.error("Add to cart error:", error);
            alert("Failed to add item to cart");
        }
    };

    const handleClearFilters = () => {
        setSort("");
        setCategory("");
    };

    return (
        <div className="container-fluid py-5 text-white">
            <div className="row">
                {/* Filter Section */}
                <div className="col-md-3">
                    <div className="bg-dark p-3 rounded">
                        <h5 className="text-white">Filter</h5>
                        <div className="form-group">
                            <label className="text-white">Sort By</label>
                            <select
                                className="form-control"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="">-- Select --</option>
                                <option value="lowToHigh">Price: Low to High</option>
                                <option value="highToLow">Price: High to Low</option>
                            </select>
                        </div>
                        <div className="form-group mt-3">
                            <label className="text-white">Category</label>
                            <select
                                className="form-control"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">-- All --</option>
                                <option value="Shirts">Shirts</option>
                                <option value="Jackets">Jackets</option>
                                <option value="Sweatshirts">Sweatshirts</option>
                                <option value="Pants">Pants</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Training Weights">Training Weights</option>
                                <option value="Benches">Benches</option>
                                <option value="Training Belts">Training Belts</option>
                            </select>
                        </div>
                        <button
                            className="btn btn-outline-light mt-3 w-100"
                            onClick={handleClearFilters}
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                <div className="col-md-9">
                    <h2 className="mb-4">Products</h2>
                    <div className="row">
                        {products.map(product => (
                            <div className="col-md-4 mb-4" key={product.id}>
                                <div className="card h-100 bg-dark text-white product-card">
                                    <img
                                        src={product.image_url}
                                        className="card-img-top"
                                        alt={product.name}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p>RM {product.price}</p>
                                        <div className="mb-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span key={star} style={{ color: star <= 4 ? 'gold' : 'gray' }}>★</span>
                                            ))}
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
