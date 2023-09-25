import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/navBar";
import WishList from "./pages/WishList";
import Footer from "./components/footer";
import Statistics from "./pages/Statistics";

const showHeaderBarPaths = ["/", "/wishlist", "/path2", "/statistics"];
const showFooterBarPaths = ["/", "/wishlist", "/path2", "/statistics"];

function App() {
  const headerLocation = useLocation();
  const showHeaderBar = showHeaderBarPaths.includes(headerLocation.pathname);

  const footerLocation = useLocation();
  const showFooterBar = showFooterBarPaths.includes(footerLocation.pathname);

  return (
    <>
      {showHeaderBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
      {showFooterBar && <Footer />}
    </>
  );
}

export default App;
