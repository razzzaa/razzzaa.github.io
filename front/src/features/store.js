import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer, { setAuth, setUsers } from "./authSlice";
import axios from "axios";
import { apiSlice } from "./followersApi";
import { vocationApi } from "./getAllDataApi";
import filterReducer from "./favDateSlice";
import { followersCountApi } from "./getSummedCount";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    filter: filterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [vocationApi.reducerPath]: vocationApi.reducer,
    [followersCountApi.reducerPath]: followersCountApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      vocationApi.middleware,
      followersCountApi.middleware
    ),
});

const checkAuth = async () => {
  try {
    const res = await axios.get(
      "https://travelreactserver.onrender.com/api/isLogged"
    );
    if (res.data.success === true) {
      const { name, mail, id, isAdmin } = res.data;
      store.dispatch(setAuth(true));
      store.dispatch(setUsers({ name, mail, id, isAdmin }));
    } else {
      store.dispatch(setAuth(false));
    }
  } catch (error) {
    console.log(error);
    store.dispatch(setAuth(false));
  }
};

checkAuth();

/* useEffect(() => {
  checkAuth();
}, []); */

export default store;
