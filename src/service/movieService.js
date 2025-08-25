import { axiosCustom } from "./config";

export const movieService = {
  getListMovies: () =>
    axiosCustom.get("/QuanLyPhim/LayDanhSachPhim?maNhom=GP01"),
  getListMoviesPaging: (params) =>
    axiosCustom.get("/QuanLyPhim/LayDanhSachPhimPhanTrang", { params }),
  getMovieDetail: (movieID) =>
    axiosCustom.get(`/QuanLyPhim/LayThongTinPhim?MaPhim=${movieID}`),
  // Tìm danh sách phim theo tên: /QuanLyPhim?tenPhim=...&maNhom=GP01
  getMoviesByName: ({ tenPhim = "", maNhom = "GP01" } = {}) =>
    axiosCustom.get("/QuanLyPhim", { params: { tenPhim, maNhom } }),
  addMovie: (data) => axiosCustom.post("/QuanLyPhim/ThemPhimUploadHinh", data),
  updateMovie: (data) =>
    axiosCustom.post("/QuanLyPhim/CapNhatPhimUpload", data),
  deleteMovie: (movieID) =>
    axiosCustom.delete(`/QuanLyPhim/XoaPhim?MaPhim=${movieID}`),
};
