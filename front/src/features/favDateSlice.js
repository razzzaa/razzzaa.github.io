import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFavFiltered: false,
  isDateFiltered: false,
};

const filterSlice = createSlice({
  name: "favDateFilter",
  initialState,
  reducers: {
    setFavoritesFilter: (state, action) => {
      state.isFavFiltered = action.payload;
    },
    setDateFilter: (state, action) => {
      state.isDateFiltered = action.payload;
    },
  },
});

export const { setFavoritesFilter, setDateFilter } = filterSlice.actions;
export default filterSlice.reducer;
