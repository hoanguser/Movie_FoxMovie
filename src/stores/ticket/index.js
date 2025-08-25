import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ticketService } from "../../service/ticket";

// Lấy danh sách ghế theo mã lịch chiếu
export const fetchSeatList = createAsyncThunk(
  "ticket/fetchSeatList",
  async (showTimeID, { rejectWithValue }) => {
    try {
      const res = await ticketService.getSeatList(showTimeID);
      return res.data?.content; // { thongTinPhim, danhSachGhe }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Đặt vé
export const bookTickets = createAsyncThunk(
  "ticket/bookTickets",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await ticketService.bookTickets(payload);
      return res.data?.content;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Tạo lịch chiếu
export const createShowTime = createAsyncThunk(
  "ticket/createShowTime",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await ticketService.createShowTime(payload);
      return res.data?.content;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,

  // Lấy danh sách phòng vé
  seatLoading: false,
  seatError: null,
  showTimeInfo: null, // thongTinPhim
  seatList: [], // danhSachGhe
  selectedSeats: [], // [{maGhe, giaVe}]

  // Đặt vé
  bookingLoading: false,
  bookingError: null,
  bookingResult: null,

  // Tạo lịch chiếu
  createLoading: false,
  createError: null,
  createResult: null,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    toggleSelectSeat: (state, action) => {
      const seat = action.payload; // { maGhe, giaVe, daDat? }
      if (seat?.daDat) return;
      const exists = state.selectedSeats.find((s) => s.maGhe === seat.maGhe);
      if (exists) {
        state.selectedSeats = state.selectedSeats.filter(
          (s) => s.maGhe !== seat.maGhe
        );
      } else {
        state.selectedSeats.push({ maGhe: seat.maGhe, giaVe: seat.giaVe });
      }
    },
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
    },
  },
  extraReducers: (builder) => {
    // Lấy danh sách ghế
    builder
      .addCase(fetchSeatList.pending, (state) => {
        state.seatLoading = true;
        state.seatError = null;
      })
      .addCase(fetchSeatList.fulfilled, (state, action) => {
        state.seatLoading = false;
        state.showTimeInfo = action.payload?.thongTinPhim || null;
        state.seatList = action.payload?.danhSachGhe || [];
      })
      .addCase(fetchSeatList.rejected, (state, action) => {
        state.seatLoading = false;
        state.seatError = action.payload || "Lỗi lấy danh sách ghế";
      });

    // Đặt vé
    builder
      .addCase(bookTickets.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
        state.bookingResult = null;
      })
      .addCase(bookTickets.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookingResult = action.payload || {
          message: "Đặt vé thành công",
        };
        state.selectedSeats = []; // clear ghế đã chọn
      })
      .addCase(bookTickets.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload || "Đặt vé thất bại";
      });

    // Tạo lịch chiếu
    builder
      .addCase(createShowTime.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createResult = null;
      })
      .addCase(createShowTime.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createResult = action.payload || {
          message: "Tạo lịch chiếu thành công",
        };
      })
      .addCase(createShowTime.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "Tạo lịch chiếu thất bại";
      });
  },
});

export const { toggleSelectSeat, clearSelectedSeats } = ticketSlice.actions;

// Selectors
export const selectSeatList = (state) => state.ticketSlice.seatList;
export const selectShowTimeInfo = (state) => state.ticketSlice.showTimeInfo;
export const selectSelectedSeats = (state) => state.ticketSlice.selectedSeats;
export const selectSeatLoading = (state) => state.ticketSlice.seatLoading;
export const selectBookingLoading = (state) => state.ticketSlice.bookingLoading;
export const selectCreateLoading = (state) => state.ticketSlice.createLoading;
export const selectTotalPrice = (state) =>
  state.ticketSlice.selectedSeats.reduce((sum, s) => sum + (s.giaVe || 0), 0);

export default ticketSlice.reducer;
