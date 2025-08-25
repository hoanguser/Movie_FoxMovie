import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { theaterService } from "../../service/theater";

// Lấy hệ thống rạp
export const fetchSystems = createAsyncThunk(
  "theater/fetchSystems",
  async (_, { rejectWithValue }) => {
    try {
      const res = await theaterService.getTheaterSystems();
      return res.data?.content || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Lấy cụm rạp theo hệ thống
export const fetchClustersBySystem = createAsyncThunk(
  "theater/fetchClustersBySystem",
  async (maHeThongRap, { rejectWithValue }) => {
    try {
      const res = await theaterService.getClustersBySystem(maHeThongRap);
      // API trả về: [{ maHeThongRap, tenHeThongRap, lstCumRap: [...] }] hoặc tương tự
      const content = res.data?.content;
      // Đưa về dạng mảng cụm rạp
      const clusters = Array.isArray(content)
        ? (content[0]?.lstCumRap || [])
        : content?.lstCumRap || [];
      return clusters;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Lấy lịch chiếu toàn hệ thống theo maNhom (GP01)
export const fetchSystemShowtimes = createAsyncThunk(
  "theater/fetchSystemShowtimes",
  async (maNhom = "GP01", { rejectWithValue }) => {
    try {
      const res = await theaterService.getSystemShowtimes(maNhom);
      return res.data?.content || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Lấy lịch chiếu theo mã phim
export const fetchMovieShowtimes = createAsyncThunk(
  "theater/fetchMovieShowtimes",
  async (maPhim, { rejectWithValue }) => {
    try {
      const res = await theaterService.getMovieShowtimes(maPhim);
      return res.data?.content || {};
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  systems: [],
  systemsLoading: false,
  systemsError: null,

  clusters: [],
  clustersLoading: false,
  clustersError: null,
  selectedSystem: null,

  systemShowtimes: [],
  systemShowtimesLoading: false,
  systemShowtimesError: null,

  movieShowtimes: null,
  movieShowtimesLoading: false,
  movieShowtimesError: null,
};

const theaterSlice = createSlice({
  name: "theater",
  initialState,
  reducers: {
    setSelectedSystem: (state, action) => {
      state.selectedSystem = action.payload;
      state.clusters = [];
      state.clustersError = null;
    },
    clearMovieShowtimes: (state) => {
      state.movieShowtimes = null;
      state.movieShowtimesError = null;
    },
  },
  extraReducers: (builder) => {
    // Systems
    builder
      .addCase(fetchSystems.pending, (state) => {
        state.systemsLoading = true;
        state.systemsError = null;
      })
      .addCase(fetchSystems.fulfilled, (state, action) => {
        state.systemsLoading = false;
        state.systems = action.payload;
      })
      .addCase(fetchSystems.rejected, (state, action) => {
        state.systemsLoading = false;
        state.systemsError = action.payload || "Lỗi lấy hệ thống rạp";
      });

    // Clusters
    builder
      .addCase(fetchClustersBySystem.pending, (state) => {
        state.clustersLoading = true;
        state.clustersError = null;
        state.clusters = [];
      })
      .addCase(fetchClustersBySystem.fulfilled, (state, action) => {
        state.clustersLoading = false;
        state.clusters = action.payload;
      })
      .addCase(fetchClustersBySystem.rejected, (state, action) => {
        state.clustersLoading = false;
        state.clustersError = action.payload || "Lỗi lấy cụm rạp";
      });

    // System showtimes
    builder
      .addCase(fetchSystemShowtimes.pending, (state) => {
        state.systemShowtimesLoading = true;
        state.systemShowtimesError = null;
        state.systemShowtimes = [];
      })
      .addCase(fetchSystemShowtimes.fulfilled, (state, action) => {
        state.systemShowtimesLoading = false;
        state.systemShowtimes = action.payload;
      })
      .addCase(fetchSystemShowtimes.rejected, (state, action) => {
        state.systemShowtimesLoading = false;
        state.systemShowtimesError = action.payload || "Lỗi lấy lịch chiếu hệ thống";
      });

    // Movie showtimes
    builder
      .addCase(fetchMovieShowtimes.pending, (state) => {
        state.movieShowtimesLoading = true;
        state.movieShowtimesError = null;
        state.movieShowtimes = null;
      })
      .addCase(fetchMovieShowtimes.fulfilled, (state, action) => {
        state.movieShowtimesLoading = false;
        state.movieShowtimes = action.payload;
      })
      .addCase(fetchMovieShowtimes.rejected, (state, action) => {
        state.movieShowtimesLoading = false;
        state.movieShowtimesError = action.payload || "Lỗi lấy lịch chiếu phim";
      });
  },
});

export const { setSelectedSystem, clearMovieShowtimes } = theaterSlice.actions;

// Selectors
export const selectSystems = (state) => state.theaterSlice.systems;
export const selectSystemsLoading = (state) => state.theaterSlice.systemsLoading;

export const selectSelectedSystem = (state) => state.theaterSlice.selectedSystem;
export const selectClusters = (state) => state.theaterSlice.clusters;
export const selectClustersLoading = (state) => state.theaterSlice.clustersLoading;

export const selectSystemShowtimes = (state) => state.theaterSlice.systemShowtimes;
export const selectSystemShowtimesLoading = (state) => state.theaterSlice.systemShowtimesLoading;

export const selectMovieShowtimes = (state) => state.theaterSlice.movieShowtimes;
export const selectMovieShowtimesLoading = (state) => state.theaterSlice.movieShowtimesLoading;

export default theaterSlice.reducer;