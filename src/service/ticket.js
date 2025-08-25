import { axiosCustom } from "./config";

export const ticketService = {
  // GET: /QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu={id}
  getSeatList: (showTimeID) =>
    axiosCustom.get(
      `/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${showTimeID}`
    ),

  // POST: /QuanLyDatVe/DatVe
  // payload: { maLichChieu, danhSachVe: [{maGhe, giaVe}], taiKhoanNguoiDung? }
  bookTickets: (payload) => axiosCustom.post("/QuanLyDatVe/DatVe", payload),

  // POST: /QuanLyDatVe/TaoLichChieu
  // payload: { maPhim, ngayChieuGioChieu: "DD/MM/YYYY HH:mm:ss", maRap, giaVe }
  createShowTime: (payload) =>
    axiosCustom.post("/QuanLyDatVe/TaoLichChieu", payload),
};
