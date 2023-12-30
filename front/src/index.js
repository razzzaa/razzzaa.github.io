import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "./features/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const BASE_URL = process.env.REACT_APP_SERVER_URL;

console.log(BASE_URL);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <ToastContainer />
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App url={BASE_URL} />
      </Provider>
    </QueryClientProvider>
  </Router>
);
