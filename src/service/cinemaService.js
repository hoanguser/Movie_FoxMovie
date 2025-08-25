import { axiosCustom } from "./config"

export const cinemaService = {
    // showTIMES
    getMovieShowtimes: (movieID) => {
        return axiosCustom.get(`/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${movieID}`)
    },
    getMovieShowtimeDetail: (showTimeID) => {
        return axiosCustom.get(`/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${showTimeID}`)
    },
    // MOVIE THEATER
    getMovieTheater: () => {
        return axiosCustom.get("/QuanLyRap/LayThongTinHeThongRap")
    },
    getMovieTheaterDetail: (maHeThongRap) => {
        return axiosCustom.get(`/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${maHeThongRap}&maNhom=GP01`)
    },
    // BOOKTICKETS
    bookTickets: (thongTinDatVe) => {
        return axiosCustom.post("/QuanLyDatVe/DatVe", thongTinDatVe)
    }
}