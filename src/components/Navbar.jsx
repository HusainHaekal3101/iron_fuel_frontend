import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Dropdown } from "react-bootstrap";
import { FaShoppingBag, FaUser } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCartCount = async () => {
            if (user) {
                try {
                    const res = await axios.get(`https://iron-fuel-express-api.vercel.app/cart/${user.email}`);
                    const totalQty = res.data.reduce((sum, item) => sum + item.quantity, 0);
                    setCartCount(totalQty);
                } catch (err) {
                    console.error("Failed to fetch cart count", err);
                }
            }
        };

        fetchCartCount();
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    return (
        <nav className="navbar navbar-dark bg-dark px-4">
            <Link to="/" className="navbar-brand fw-bold">
                IronFuel
            </Link>

            <div className="d-flex align-items-center gap-4">
                {user !== undefined && (
                    <>
                        <Link to="/cart" className="position-relative text-white fs-5">
                            <FaShoppingBag />
                            {cartCount > 0 && (
                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    style={{ fontSize: "0.6rem" }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Dropdown align="end">
                            <Dropdown.Toggle
                                as="div"
                                role="button"
                                className="text-white fs-5"
                                style={{ cursor: "pointer" }}
                            >
                                <FaUser />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/purchase-history">My History</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
