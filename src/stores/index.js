import { configureStore } from "@reduxjs/toolkit";
import movieSlice from "./movie/index.js";
import userSlice from "./user/index.js";
import ticketSlice from "./ticket/index.js";
import theaterSlice from "./theater/index.js";

export const store = configureStore({
  reducer: {
    movieSlice,
    userSlice,
    ticketSlice,
    theaterSlice,
  },
});
