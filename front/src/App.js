import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import SpinnerFullPage from "./components/SpinnerFullPage";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import NavBar from "./components/navBar";
// import WishList from "./pages/WishList";
// import Footer from "./components/footer";
// import Statistics from "./pages/Statistics";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const WishList = lazy(() => import("./pages/WishList"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Footer = lazy(() => import("./components/footer"));
const NavBar = lazy(() => import("./components/navBar"));

const showHeaderBarPaths = ["/", "/wishlist", "/path2", "/statistics"];
const showFooterBarPaths = ["/", "/wishlist", "/path2", "/statistics"];

function App({ url }) {
  const headerLocation = useLocation();
  const showHeaderBar = showHeaderBarPaths.includes(headerLocation.pathname);

  const footerLocation = useLocation();
  const showFooterBar = showFooterBarPaths.includes(footerLocation.pathname);

  return (
    <>
      <Suspense fallback={<SpinnerFullPage />}>
        {showHeaderBar && <NavBar url={url} />}
        <Routes>
          <Route path="/" element={<Home url={url} />} />
          <Route path="/login" element={<Login url={url} />} />
          <Route path="/register" element={<Register url={url} />} />
          <Route path="/wishlist" element={<WishList url={url} />} />
          <Route path="/statistics" element={<Statistics url={url} />} />
        </Routes>
        {showFooterBar && <Footer />}
      </Suspense>
    </>
  );
}

export default App;
