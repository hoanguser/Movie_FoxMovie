import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, DatePicker, Form, InputNumber, Modal, Row, Select, Space, Spin, Table, Tag, Typography, message } from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { createShowTime, fetchSeatList, selectCreateLoading, selectSeatList, selectSeatLoading, selectShowTimeInfo } from "../../../stores/ticket";
import { movieService } from "../../../service/movieService";
import { cinemaService } from "../../../service/cinemaService";

const { Title, Text } = Typography;

function AdminTicketPage() {
    const dispatch = useDispatch();

    // Redux ticket selectors
    const seatLoading = useSelector(selectSeatLoading);
    const seatList = useSelector(selectSeatList);
    const showTimeInfo = useSelector(selectShowTimeInfo);
    const createLoading = useSelector(selectCreateLoading);

    // Local states
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const [heThongRap, setHeThongRap] = useState([]);
    const [selectedHeThong, setSelectedHeThong] = useState(null);

    const [cumRap, setCumRap] = useState([]);
    const [selectedCumRap, setSelectedCumRap] = useState(null);

    const [rap, setRap] = useState([]);
    const [selectedRap, setSelectedRap] = useState(null);

    const [dateTime, setDateTime] = useState(null);
    const [price, setPrice] = useState(75000);

    const [showtimes, setShowtimes] = useState([]);
    const [seatModalOpen, setSeatModalOpen] = useState(false);

    // Load movies + heThongRap
    useEffect(() => {
        (async () => {
            try {
                const [movieRes, heThongRes] = await Promise.all([
                    movieService.getListMovies(),
                    cinemaService.getMovieTheater(),
                ]);
                setMovies(movieRes?.data?.content || []);
                setHeThongRap(heThongRes?.data?.content || []);
            } catch (e) {
                message.error("Lỗi tải dữ liệu khởi tạo");
            }
        })();
    }, []);

    // Khi chọn hệ thống rạp => load cụm rạp + danh sách rạp
    const loadCumRapTheoHeThong = async (maHeThongRap) => {
        setCumRap([]);
        setSelectedCumRap(null);
        setRap([]);
        setSelectedRap(null);
        if (!maHeThongRap) return;
        try {
            const res = await cinemaService.getMovieTheaterDetail(maHeThongRap);
            // Tùy API trả về: content có thể là array hoặc object
            const content = res?.data?.content;
            const first = Array.isArray(content) ? content[0] : content;
            const listCum = first?.lstCumRap || first?.cumRapChieu || [];
            setCumRap(listCum);
        } catch (e) {
            message.error("Lỗi tải cụm rạp");
        }
    };

    // Khi chọn cụm rạp => set danh sách rạp
    const onSelectCumRap = (maCumRap) => {
        setSelectedCumRap(maCumRap);
        setRap([]);
        setSelectedRap(null);
        const found = cumRap.find((c) => c.maCumRap === maCumRap);
        const danhSachRap = found?.danhSachRap || found?.rapChieu || [];
        setRap(danhSachRap);
    };

    // Khi chọn phim => load lịch chiếu của phim
    const loadShowtimesByMovie = async (movieId) => {
        if (!movieId) {
            setShowtimes([]);
            return;
        }
        try {
            const res = await cinemaService.getMovieShowtimes(movieId);
            const content = res?.data?.content || {};
            const heThong = content?.heThongRapChieu || [];
            const rows = [];
            heThong.forEach((h) => {
                (h?.cumRapChieu || []).forEach((cum) => {
                    (cum?.lichChieuPhim || []).forEach((lc) => {
                        rows.push({
                            key: lc.maLichChieu,
                            maLichChieu: lc.maLichChieu,
                            ngayChieuGioChieu: lc.ngayChieuGioChieu,
                            tenRap: lc.tenRap,
                            giaVe: lc.giaVe,
                            tenCumRap: cum.tenCumRap,
                            tenHeThongRap: h.tenHeThongRap,
                        });
                    });
                });
            });
            setShowtimes(rows);
        } catch (e) {
            setShowtimes([]);
            message.error("Lỗi tải lịch chiếu theo phim");
        }
    };

    // Handle chọn phim
    const onSelectMovie = (maPhim) => {
        setSelectedMovie(maPhim);
        loadShowtimesByMovie(maPhim);
    };

    // Tạo lịch chiếu
    const onCreateShowTime = async () => {
        if (!selectedMovie || !selectedRap || !dateTime || !price) {
            message.warning("Vui lòng chọn/nhập đầy đủ: Phim, Hệ thống rạp, Cụm rạp, Rạp, Ngày giờ chiếu, Giá vé");
            return;
        }
        const payload = {
            maPhim: selectedMovie,
            ngayChieuGioChieu: dayjs(dateTime).format("DD/MM/YYYY HH:mm:ss"),
            maRap: selectedRap,
            giaVe: price,
        };
        try {
            const action = await dispatch(createShowTime(payload));
            if (createShowTime.fulfilled.match(action)) {
                message.success("Tạo lịch chiếu thành công");
                // Reload showtimes của phim hiện tại
                loadShowtimesByMovie(selectedMovie);
            } else {
                throw new Error(action.payload || "Tạo lịch chiếu thất bại");
            }
        } catch (e) {
            message.error(e.message || "Tạo lịch chiếu thất bại");
        }
    };

    // Xem ghế theo mã lịch chiếu
    const onPreviewSeats = async (maLichChieu) => {
        try {
            await dispatch(fetchSeatList(maLichChieu));
            setSeatModalOpen(true);
        } catch {
            message.error("Không lấy được danh sách ghế");
        }
    };

    // Columns table lịch chiếu
    const columns = useMemo(
        () => [
            { title: "Mã lịch chiếu", dataIndex: "maLichChieu", key: "maLichChieu", width: 130 },
            { title: "Hệ thống rạp", dataIndex: "tenHeThongRap", key: "tenHeThongRap" },
            { title: "Cụm rạp", dataIndex: "tenCumRap", key: "tenCumRap" },
            { title: "Rạp", dataIndex: "tenRap", key: "tenRap" },
            {
                title: "Ngày chiếu",
                dataIndex: "ngayChieuGioChieu",
                key: "ngayChieuGioChieu",
                render: (v) => dayjs(v).format("DD/MM/YYYY HH:mm"),
            },
            {
                title: "Giá vé",
                dataIndex: "giaVe",
                key: "giaVe",
                render: (v) => <Tag color="blue">{v?.toLocaleString()} đ</Tag>,
                width: 120,
            },
            {
                title: "Thao tác",
                key: "actions",
                width: 150,
                render: (_, record) => (
                    <Space>
                        <Button size="small" onClick={() => onPreviewSeats(record.maLichChieu)}>
                            Xem ghế
                        </Button>
                    </Space>
                ),
            },
        ],
        []
    );

    return (
        <div style={{ padding: 16 }}>
            <Title level={3}>Quản lý vé</Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <Card title="Tạo lịch chiếu" bordered>
                        <Space direction="vertical" size="large" style={{ width: "100%" }}>
                            <div>
                                <Text strong>Chọn phim</Text>
                                <Select
                                    style={{ width: "100%", marginTop: 8 }}
                                    placeholder="Chọn phim"
                                    showSearch
                                    optionFilterProp="label"
                                    value={selectedMovie}
                                    onChange={onSelectMovie}
                                    options={(movies || []).map((m) => ({ label: m.tenPhim, value: m.maPhim }))}
                                />
                            </div>

                            <div>
                                <Text strong>Hệ thống rạp</Text>
                                <Select
                                    style={{ width: "100%", marginTop: 8 }}
                                    placeholder="Chọn hệ thống rạp"
                                    value={selectedHeThong}
                                    onChange={(val) => {
                                        setSelectedHeThong(val);
                                        loadCumRapTheoHeThong(val);
                                    }}
                                    options={(heThongRap || []).map((h) => ({ label: h.tenHeThongRap, value: h.maHeThongRap }))}
                                />
                            </div>

                            <div>
                                <Text strong>Cụm rạp</Text>
                                <Select
                                    style={{ width: "100%", marginTop: 8 }}
                                    placeholder="Chọn cụm rạp"
                                    value={selectedCumRap}
                                    onChange={onSelectCumRap}
                                    disabled={!selectedHeThong}
                                    options={(cumRap || []).map((c) => ({ label: c.tenCumRap, value: c.maCumRap }))}
                                />
                            </div>

                            <div>
                                <Text strong>Rạp</Text>
                                <Select
                                    style={{ width: "100%", marginTop: 8 }}
                                    placeholder="Chọn rạp"
                                    value={selectedRap}
                                    onChange={(val) => setSelectedRap(val)}
                                    disabled={!selectedCumRap}
                                    options={(rap || []).map((r) => ({
                                        label: `${r.tenRap} (${r.maRap})`,
                                        value: r.maRap,
                                    }))}
                                />
                            </div>

                            <Row gutter={12}>
                                <Col span={14}>
                                    <Text strong>Ngày giờ chiếu</Text>
                                    <DatePicker
                                        showTime
                                        style={{ width: "100%", marginTop: 8 }}
                                        value={dateTime}
                                        onChange={setDateTime}
                                        format="DD/MM/YYYY HH:mm"
                                    />
                                </Col>
                                <Col span={10}>
                                    <Text strong>Giá vé</Text>
                                    <InputNumber
                                        min={50000}
                                        max={200000}
                                        style={{ width: "100%", marginTop: 8 }}
                                        value={price}
                                        onChange={setPrice}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                    />
                                </Col>
                            </Row>

                            <div>
                                <Button type="primary" loading={createLoading} onClick={onCreateShowTime} block>
                                    Tạo lịch chiếu
                                </Button>
                            </div>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card
                        title={
                            <Space>
                                <Text strong>Danh sách lịch chiếu</Text>
                                {selectedMovie ? (
                                    <Tag color="green">Phim: {movies.find((m) => m.maPhim === selectedMovie)?.tenPhim}</Tag>
                                ) : (
                                    <Tag>Chưa chọn phim</Tag>
                                )}
                            </Space>
                        }
                    >
                        <Table
                            size="small"
                            rowKey="maLichChieu"
                            columns={columns}
                            dataSource={showtimes}
                            pagination={{ pageSize: 8 }}
                        />
                    </Card>
                </Col>
            </Row>

            <Modal
                title={showTimeInfo ? `Phòng vé - ${showTimeInfo?.tenCumRap} - ${showTimeInfo?.tenRap}` : "Phòng vé"}
                open={seatModalOpen}
                onCancel={() => setSeatModalOpen(false)}
                footer={null}
                width={900}
            >
                {seatLoading ? (
                    <div style={{ textAlign: "center", padding: 24 }}>
                        <Spin />
                    </div>
                ) : (
                    <div style={{ maxHeight: 500, overflow: "auto" }}>
                        <div style={{ marginBottom: 12 }}>
                            <Text strong>Phim: </Text>
                            <Text>{showTimeInfo?.tenPhim} - {showTimeInfo?.ngayChieu} {showTimeInfo?.gioChieu}</Text>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 6 }}>
                            {(seatList || []).map((seat) => (
                                <div
                                    key={seat.maGhe}
                                    title={`${seat.tenGhe} - ${seat.giaVe?.toLocaleString()}đ`}
                                    style={{
                                        textAlign: "center",
                                        padding: 8,
                                        borderRadius: 6,
                                        background: seat.daDat ? "#ffccc7" : "#d9f7be",
                                        border: "1px solid #d9d9d9",
                                        fontSize: 12,
                                    }}
                                >
                                    {seat.tenGhe}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default AdminTicketPage;