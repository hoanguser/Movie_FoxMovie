import React, { useEffect, useMemo, useState } from "react";
import {
    Card,
    Col,
    InputNumber,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Typography,
    Button,
    message
} from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
    clearMovieShowtimes,
    fetchClustersBySystem,
    fetchMovieShowtimes,
    fetchSystemShowtimes,
    fetchSystems,
    selectClusters,
    selectClustersLoading,
    selectMovieShowtimes,
    selectMovieShowtimesLoading,
    selectSelectedSystem,
    selectSystemShowtimes,
    selectSystemShowtimesLoading,
    selectSystems,
    selectSystemsLoading,
    setSelectedSystem,
} from "../../../stores/theater";

const { Title, Text } = Typography;

function AdminTheaterPage() {
    const dispatch = useDispatch();

    const systems = useSelector(selectSystems);
    const systemsLoading = useSelector(selectSystemsLoading);

    const selectedSystem = useSelector(selectSelectedSystem);
    const clusters = useSelector(selectClusters);
    const clustersLoading = useSelector(selectClustersLoading);

    const systemShowtimes = useSelector(selectSystemShowtimes);
    const systemShowtimesLoading = useSelector(selectSystemShowtimesLoading);

    const movieShowtimes = useSelector(selectMovieShowtimes);
    const movieShowtimesLoading = useSelector(selectMovieShowtimesLoading);

    const [movieId, setMovieId] = useState(null);

    useEffect(() => {
        dispatch(fetchSystems());
        dispatch(fetchSystemShowtimes("GP01"));
    }, [dispatch]);

    const onSelectSystem = (maHeThongRap) => {
        dispatch(setSelectedSystem(maHeThongRap));
        if (maHeThongRap) {
            dispatch(fetchClustersBySystem(maHeThongRap));
        }
    };

    const onLoadMovieShowtimes = () => {
        if (!movieId && movieId !== 0) {
            message.warning("Nhập mã phim để tra cứu lịch chiếu");
            return;
        }
        dispatch(fetchMovieShowtimes(movieId));
    };

    const onRefreshSystemShowtimes = () => {
        dispatch(fetchSystemShowtimes("GP01"));
    };

    const onRefreshSystems = () => {
        dispatch(fetchSystems());
    };

    const clusterColumns = useMemo(
        () => [
            { title: "Mã cụm", dataIndex: "maCumRap", key: "maCumRap", width: 120 },
            { title: "Tên cụm rạp", dataIndex: "tenCumRap", key: "tenCumRap" },
            { title: "Địa chỉ", dataIndex: "diaChi", key: "diaChi" },
            {
                title: "Số rạp",
                key: "soRap",
                width: 100,
                render: (_, record) => (record.danhSachRap?.length || record.rapChieu?.length || 0),
            },
        ],
        []
    );

    // Flatten dữ liệu lịch chiếu toàn hệ thống để hiển thị bảng
    const flatSystemShowtimes = useMemo(() => {
        const rows = [];
        (systemShowtimes || []).forEach((sys) => {
            const sysName = sys.tenHeThongRap;
            (sys.lstCumRap || sys.cumRapChieu || []).forEach((cum) => {
                const cumName = cum.tenCumRap;
                (cum.danhSachPhim || cum.danhSachPhimChieu || cum.lichChieuPhim || []).forEach((m) => {
                    const tenPhim = m.tenPhim || m.tenPhimChieu || "";
                    (m.lstLichChieuTheoPhim || m.lichChieu || m.lichChieuPhim || []).forEach((lc) => {
                        rows.push({
                            key: lc.maLichChieu,
                            heThongRap: sysName,
                            cumRap: cumName,
                            tenPhim,
                            ngayChieuGioChieu: lc.ngayChieuGioChieu,
                            maRap: lc.maRap,
                            tenRap: lc.tenRap,
                            giaVe: lc.giaVe,
                        });
                    });
                });
            });
        });
        return rows;
    }, [systemShowtimes]);

    const systemShowtimeColumns = useMemo(
        () => [
            { title: "Hệ thống", dataIndex: "heThongRap", key: "heThongRap", width: 160 },
            { title: "Cụm rạp", dataIndex: "cumRap", key: "cumRap", width: 200 },
            { title: "Phim", dataIndex: "tenPhim", key: "tenPhim" },
            {
                title: "Ngày chiếu",
                dataIndex: "ngayChieuGioChieu",
                key: "ngayChieuGioChieu",
                width: 180,
                render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
                sorter: (a, b) => new Date(a.ngayChieuGioChieu) - new Date(b.ngayChieuGioChieu),
            },
            { title: "Rạp", dataIndex: "tenRap", key: "tenRap", width: 160 },
            {
                title: "Giá vé",
                dataIndex: "giaVe",
                key: "giaVe",
                width: 120,
                render: (v) => <Tag color="blue">{v ? v.toLocaleString() + " đ" : "-"}</Tag>,
                sorter: (a, b) => a.giaVe - b.giaVe,
            },
        ],
        []
    );

    // Dữ liệu lịch chiếu theo mã phim: hiển thị sơ bộ tên phim + cụm + lịch
    const flatMovieShowtimes = useMemo(() => {
        if (!movieShowtimes) return [];
        const rows = [];
        const heThong = movieShowtimes.heThongRapChieu || [];
        heThong.forEach((sys) => {
            const sysName = sys.tenHeThongRap;
            (sys.cumRapChieu || []).forEach((cum) => {
                const cumName = cum.tenCumRap;
                (cum.lichChieuPhim || []).forEach((lc) => {
                    rows.push({
                        key: lc.maLichChieu,
                        heThongRap: sysName,
                        cumRap: cumName,
                        ngayChieuGioChieu: lc.ngayChieuGioChieu,
                        tenRap: lc.tenRap,
                        giaVe: lc.giaVe,
                    });
                });
            });
        });
        return rows;
    }, [movieShowtimes]);

    const movieShowtimeColumns = useMemo(
        () => [
            { title: "Hệ thống", dataIndex: "heThongRap", key: "heThongRap", width: 160 },
            { title: "Cụm rạp", dataIndex: "cumRap", key: "cumRap", width: 200 },
            {
                title: "Ngày chiếu",
                dataIndex: "ngayChieuGioChieu",
                key: "ngayChieuGioChieu",
                width: 180,
                render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
                sorter: (a, b) => new Date(a.ngayChieuGioChieu) - new Date(b.ngayChieuGioChieu),
            },
            { title: "Rạp", dataIndex: "tenRap", key: "tenRap", width: 160 },
            {
                title: "Giá vé",
                dataIndex: "giaVe",
                key: "giaVe",
                width: 120,
                render: (v) => <Tag color="purple">{v ? v.toLocaleString() + " đ" : "-"}</Tag>,
                sorter: (a, b) => a.giaVe - b.giaVe,
            },
        ],
        []
    );

    return (
        <div style={{ padding: 16 }}>
            <Title level={3}>Quản lý rạp</Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={8}>
                    <Card
                        title="Hệ thống rạp"
                        bordered
                        extra={
                            <Button
                                icon={<ReloadOutlined />}
                                size="small"
                                onClick={onRefreshSystems}
                            />
                        }
                    >
                        <Space direction="vertical" style={{ width: "100%" }} size="large">
                            <div>
                                <Text strong>Chọn hệ thống rạp</Text>
                                <Select
                                    style={{ width: "100%", marginTop: 8 }}
                                    placeholder="Chọn hệ thống rạp"
                                    loading={systemsLoading}
                                    value={selectedSystem}
                                    onChange={onSelectSystem}
                                    options={(systems || []).map((s) => ({
                                        label: s.tenHeThongRap,
                                        value: s.maHeThongRap,
                                    }))}
                                />
                            </div>

                            <div>
                                <Text strong>Cụm rạp</Text>
                                <div style={{ marginTop: 8 }}>
                                    {clustersLoading ? (
                                        <Spin />
                                    ) : (
                                        <Table
                                            size="small"
                                            rowKey="maCumRap"
                                            columns={clusterColumns}
                                            dataSource={clusters}
                                            pagination={{ pageSize: 5 }}
                                            scroll={{ y: 300 }}
                                        />
                                    )}
                                </div>
                            </div>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    <Card
                        title={
                            <Space>
                                <Text strong>Lịch chiếu toàn hệ thống</Text>
                                <Tag color="green">maNhom=GP01</Tag>
                            </Space>
                        }
                        extra={
                            <Button
                                icon={<ReloadOutlined />}
                                size="small"
                                onClick={onRefreshSystemShowtimes}
                            />
                        }
                    >
                        {systemShowtimesLoading ? (
                            <Spin />
                        ) : (
                            <Table
                                size="small"
                                rowKey="key"
                                columns={systemShowtimeColumns}
                                dataSource={flatSystemShowtimes}
                                pagination={{ pageSize: 10, showSizeChanger: true }}
                                scroll={{ x: 1000 }}
                            />
                        )}
                    </Card>

                    <Card
                        title="Lịch chiếu theo mã phim"
                        style={{ marginTop: 16 }}
                        extra={
                            <Button
                                onClick={() => dispatch(clearMovieShowtimes())}
                                size="small"
                            >
                                Xóa kết quả
                            </Button>
                        }
                    >
                        <Space align="start" style={{ marginBottom: 12 }}>
                            <Text strong>Nhập mã phim</Text>
                            <InputNumber
                                min={0}
                                value={movieId}
                                onChange={setMovieId}
                                style={{ width: 160 }}
                                placeholder="Mã phim"
                            />
                            <Button
                                type="primary"
                                loading={movieShowtimesLoading}
                                onClick={onLoadMovieShowtimes}
                                icon={<SearchOutlined />}
                            >
                                Tìm kiếm
                            </Button>
                        </Space>

                        {movieShowtimes && movieShowtimes.tenPhim && (
                            <div style={{ marginBottom: 16 }}>
                                <Text strong>Phim: </Text>
                                <Text>{movieShowtimes.tenPhim}</Text>
                            </div>
                        )}

                        <Table
                            size="small"
                            rowKey="key"
                            columns={movieShowtimeColumns}
                            dataSource={flatMovieShowtimes}
                            pagination={{ pageSize: 10, showSizeChanger: true }}
                            scroll={{ x: 1000 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AdminTheaterPage;