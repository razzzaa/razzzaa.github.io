import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const url = process.env.REACT_APP_SERVER_URL;
function TokenTimer() {
  const timeoutDuration = 900000;
  let logoutTimer;
  const navigate = useNavigate();

  const handleLogOut = () => {
    axios
      .get(`${url}/api/logout`)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      handleLogOut();
    }, timeoutDuration);
  };

  useEffect(() => {
    resetLogoutTimer();

    const handleInteraction = () => {
      resetLogoutTimer();
    };

    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("keydown", handleInteraction);

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      clearTimeout(logoutTimer);
    };
  }, []);
}

export default TokenTimer;
