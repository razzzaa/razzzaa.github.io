import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  name: null,
  mail: null,
  id: null,
  isAdmin: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUsers: (state, action) => {
      const { name, mail, id, isAdmin } = action.payload;
      state.name = name;
      state.mail = mail;
      state.id = id;
      state.isAdmin = isAdmin;
    },
  },
});

export const { setAuth, setUsers } = authSlice.actions;
export default authSlice.reducer;
