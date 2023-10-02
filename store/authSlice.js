import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  authenticated: false,
  user: null,
  isLoading: false,
  error: null,
  fetching_user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.user = action.payload;
      state.authenticated = true;
      state.fetching_user = false;
    },
    setUserNull: (state) => {
      state.isLoading = false;
      state.error = null;
      state.user = null;
      state.authenticated = false;
      state.fetching_user = false;
    },
  },
});

export const { setUser, setUserNull } = authSlice.actions;
export default authSlice.reducer;
