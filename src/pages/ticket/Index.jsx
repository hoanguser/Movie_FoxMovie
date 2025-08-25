import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { cinemaService } from '../../service/cinemaService';
import Section from '../../HOC/Section';
import { Spin } from 'antd';
import { notyf } from '../../util/notyf';

const TicketMoviePage = () => {
    const { showTimeID } = useParams();
    const [showtimeDetail, setShowtimeDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    console.log("🚀 ~ TicketMoviePage ~ showTimeID:", showTimeID)
    const fetchShowTimeDetail = async () => {
        try {
            setLoading(true);
            const res = await cinemaService.getMovieShowtimeDetail(showTimeID);
            console.log("🚀 ~ fetchShowTimeDetail ~ res:", res)
            setShowtimeDetail(res.data.content);
        } catch (error) {
            setError(error.response?.data?.content || "Có lỗi xảy ra!")
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchShowTimeDetail();
    }, [showTimeID])

    const handleSelectSeat = (seat) => {
        if (seat.daDat) return;
        setSelectedSeats((prev) => {
            const isSelected = prev.find((s) => s.maGhe === seat.maGhe);
            if (isSelected) {
                return prev.filter((s) => s.maGhe !== seat.maGhe);
            } else {
                return [...prev, seat];
            }
        });
    };

    // Tính tổng tiền
    const totalPrice = selectedSeats.reduce(
        (sum, seat) => sum + seat.giaVe,
        0
    );
    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            notyf.error("Vui lòng chọn ghế trước khi đặt vé!");
            return;
        }
        const bookingData = {
            maLichChieu: showTimeID,
            danhSachVe: selectedSeats.map((seat) => ({
                maGhe: seat.maGhe,
                giaVe: seat.giaVe,
            })),
        };

        try {
            setLoading(true);
            await cinemaService.bookTickets(bookingData);
            notyf.success("Đặt vé thành công 🎉");
            setSelectedSeats([]);
            fetchShowTimeDetail();
        } catch (err) {
            notyf.error(err.response?.data?.content || "Đặt vé thất bại!");
        } finally {
            setLoading(false);
        }
    };
    if (loading) return <div className='h-[50vh] p-10 flex justify-center items-center'><Spin /> <span className='ml-5'> Đang tải dữ liệu... </span></div>;
    if (error) return <p style={{ color: "red" }}>❌ {error}</p>;
    return (
        <div
            className="relative text-white py-10"
            style={{
                backgroundImage:
                    "url('https://phongvu.vn/cong-nghe/wp-content/uploads/2024/11/hinh-nen-venom-4k-17-1392x783.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-[#000000bf] bg-opacity-70"></div>
            <Section>
                <div className="relative z-10" style={{ padding: "20px" }}>
                    <h1 className='text-2xl uppercase font-bold text-center'>🎬 Đặt vé xem phim</h1>
                    {showtimeDetail && (
                        <div className='mt-10'>
                            <div className='mb-10'>
                                <span>
                                    {showtimeDetail.thongTinPhim?.ngayChieu} -{" "}
                                    {showtimeDetail.thongTinPhim?.gioChieu}
                                </span> - <span>{showtimeDetail.thongTinPhim?.tenRap}</span>
                            </div>
                            <div className="grid grid-cols-3">
                                <div className='col-span-2'>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: "8px", maxWidth: "500px" }}>
                                        {showtimeDetail.danhSachGhe?.map((ghe) => {
                                            const isSelected = selectedSeats.find((s) => s.maGhe === ghe.maGhe);
                                            return (
                                                <button
                                                    key={ghe.maGhe}
                                                    disabled={ghe.daDat}
                                                    onClick={() => handleSelectSeat(ghe)}
                                                    style={{
                                                        padding: "5px",
                                                        borderRadius: "4px",
                                                        border: "1px solid #333",
                                                        background: ghe.daDat
                                                            ? "#ccc"
                                                            : isSelected
                                                                ? "blue"
                                                                : ghe.loaiGhe === "Vip"
                                                                    ? "#f99c00"
                                                                    : "#4caf50",
                                                        color: "white",
                                                        cursor: ghe.daDat ? "not-allowed" : "pointer",
                                                    }}
                                                >
                                                    {ghe.tenGhe}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-10 flex gap-7">
                                        <div className='flex gap-2'>
                                            <div>Ghế đã chọn</div>
                                            <div className='bg-[#ccc] px-4 py-2 rounded'></div>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div>Ghế đang chọn</div>
                                            <div className='bg-blue-500 px-4 py-2 rounded'></div>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div>Ghế VIP</div>
                                            <div className='bg-[#f99c00] px-4 py-2 rounded'></div>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div>Ghế Thường</div>
                                            <div className='bg-[#4caf50] px-4 py-2 rounded'></div>
                                        </div>
                                    </div>
                                </div>
                                <div className='shadow-sm shadow-[#f99c00] rounded-2xl p-5 text-center'>
                                    <h2 className='text-xl font-bold text-[#f99c00] uppercase'>{showtimeDetail.thongTinPhim?.tenPhim}</h2>
                                    <div className='w-[100%] h-[1px] bg-[#f99c00] mt-5 mb-5'></div>
                                    <div className="flex justify-between items-center">
                                        <div>Ngày giờ chiếu:</div>
                                        <div>{showtimeDetail.thongTinPhim?.ngayChieu} -{" "}
                                            {showtimeDetail.thongTinPhim?.gioChieu}</div>
                                    </div>
                                    <div className='w-[100%] h-[1px] bg-[#f99c00] mt-5 mb-5'></div>
                                    <div className="flex justify-between items-center">
                                        <div>Cụm rạp</div>
                                        <div>{showtimeDetail.thongTinPhim?.tenCumRap}</div>
                                    </div>
                                    <div className='w-[100%] h-[1px] bg-[#f99c00] mt-5 mb-5'></div>
                                    <div className="flex justify-between items-center">
                                        <div>Rạp</div>
                                        <div>{showtimeDetail.thongTinPhim?.tenRap}</div>
                                    </div>
                                    <div className='w-[100%] h-[1px] bg-[#f99c00] mt-5 mb-5'></div>
                                    <div className="flex justify-between items-center">
                                        <div>Địa chỉ:</div>
                                        <div>{showtimeDetail.thongTinPhim?.diaChi}</div>
                                    </div>
                                    {/* Danh sách ghế */}
                                    <div className='w-[100%] h-[1px] bg-[#f99c00] mt-5 mb-5'></div>
                                    <div className="flex justify-between items-center">
                                        <div>Ghế chọn:</div>
                                        <div>
                                            <h3>
                                                {" "}
                                                {selectedSeats.map((s) => s.tenGhe).join(", ") || "Chưa chọn"}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className='w-[100%] h-[1px] bg-[#f99c00] mt-5 mb-5'></div>
                                    <div className="flex justify-between items-center">
                                        <div>Tổng tiền</div>
                                        <div>
                                            {totalPrice.toLocaleString()} VNĐ
                                        </div>
                                    </div>
                                    <div className='w-[100%] h-[1px] bg-[#f99c00] mt-5 mb-5'></div>
                                    <button
                                        onClick={handleBooking}
                                        className='w-full px-5 py-2 bg-[#f99c00] text-white rounded-md cursor-pointer border-none uppercase font-bold'
                                    >
                                        Đặt vé
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                    }
                </div >
            </Section>
        </div>
    )
}

export default TicketMoviePage
