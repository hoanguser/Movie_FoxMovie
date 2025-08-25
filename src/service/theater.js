import { axiosCustom } from "./config";

export const theaterService = {
  // GET: /QuanLyRap/LayThongTinHeThongRap
  getTheaterSystems: () => axiosCustom.get("/QuanLyRap/LayThongTinHeThongRap"),

  // GET: /QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap={id}
  getClustersBySystem: (maHeThongRap) =>
    axiosCustom.get(`/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`),

  // GET: /QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=GP01
  getSystemShowtimes: (maNhom = "GP01") =>
    axiosCustom.get(`/QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=${maNhom}`),

  // GET: /QuanLyRap/LayThongTinLichChieuPhim?MaPhim={id}
  getMovieShowtimes: (maPhim) =>
    axiosCustom.get(`/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`),
};