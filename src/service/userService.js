import { axiosCustom } from "./config";

export const userService = {
  login: (infoUser) => {
    return axiosCustom.post("/QuanLyNguoiDung/DangNhap", infoUser);
  },
  regiterUser: (infoUser) => {
    return axiosCustom.post(
      "/QuanLyNguoiDung/DangKy",
      infoUser
    );
  },
  getInfoUser: () => {
    return axiosCustom.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
  },
  editUser: (infoUser) => {
    return axiosCustom.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", infoUser);
  },
  getListUser: () => {
    return axiosCustom.get("/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP00");
  },
  deleteUser: (taiKhoan) => {
    return axiosCustom.delete(
      `/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`
    );
  },
  addUser: (infoUser) => {
    return axiosCustom.post("/QuanLyNguoiDung/ThemNguoiDung", infoUser);
  },
};
