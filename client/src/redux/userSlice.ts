import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "../types/user-slice";

const initialState: UserState = {
  user: null,
  token: null,
  listings: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setListing: (state, action) => {
      state.listings = action.payload.listings;
    },
    setTripList: (state, action) => {
      state.user!.tripList = action.payload.trips;
    },
    setWishList: (state, action) => {
      state.user!.wishList = action.payload.wishList;
    },
    setPropertyList: (state, action) => {
      state.user!.propertyList = action.payload.properties;
    },
    setReservationList: (state, action) => {
      state.user!.reservationList = action.payload.reservations;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setListing,
  setTripList,
  setWishList,
  setPropertyList,
  setReservationList,
} = userSlice.actions;

export default userSlice.reducer;
