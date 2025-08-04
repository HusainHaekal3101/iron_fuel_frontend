import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useContext } from "react";
import { UserContext } from "./UserProvider.jsx";
import Homepage from "./pages/Homepage";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Success from "./pages/Success.jsx";
import Profile from "./pages/Profile.jsx";
import PurchaseHistory from "./pages/PurchaseHistory.jsx";

const App = () => {
  const { userEmail, loading } = useContext(UserContext);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Navbar />
      <div className="pt-5">
        <Routes>
          <Route path="/" element={userEmail ? <Navigate to="/products" /> : <Homepage />} />
          <Route path="/products" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart userEmail={userEmail} /></ProtectedRoute>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/purchase-history" element={<ProtectedRoute><PurchaseHistory /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
