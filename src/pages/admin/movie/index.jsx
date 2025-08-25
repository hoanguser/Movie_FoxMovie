// File: src/pages/admin/movie/index.jsx
// Function: AdminMoviePage
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Space,
  Popconfirm,
  InputNumber,
  DatePicker,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { movieService } from "../../../service/movieService";
import { notyf } from "../../../util/notyf";

function AdminMoviePage() {
  const qc = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy toàn bộ danh sách phim
  const { data: movieData, isFetching, refetch } = useQuery({
    queryKey: ["listMovieAll"],
    queryFn: () => movieService.getListMovies(),
    staleTime: 5 * 60 * 1000,
  });

  // Xử lý dữ liệu phim
  const listMovie = movieData?.data?.content || [];

  // Lọc phim theo từ khóa tìm kiếm
  const filteredMovies = React.useMemo(() => {
    if (!searchTerm) return listMovie;
    const lower = searchTerm.toLowerCase();
    return listMovie.filter((m) =>
      String(m.tenPhim || "").toLowerCase().includes(lower)
    );
  }, [listMovie, searchTerm]);

  // Cập nhật phân trang khi dữ liệu thay đổi
  useEffect(() => {
    setPagination((p) => ({
      ...p,
      total: filteredMovies.length,
      current: 1, // Reset về trang đầu khi tìm kiếm
    }));
  }, [filteredMovies]);

  // Lấy dữ liệu cho trang hiện tại
  const paginatedData = React.useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filteredMovies.slice(start, start + pagination.pageSize);
  }, [filteredMovies, pagination.current, pagination.pageSize]);

  // Thêm phim
  const addMutation = useMutation({
    mutationFn: async (values) => {
      const formData = new FormData();
      const ngayKhoiChieu = values.ngayKhoiChieu
        ? values.ngayKhoiChieu.format("DD/MM/YYYY")
        : "";

      formData.append("tenPhim", values.tenPhim);
      formData.append("trailer", values.trailer);
      formData.append("moTa", values.moTa);
      formData.append("ngayKhoiChieu", ngayKhoiChieu);
      formData.append("danhGia", values.danhGia);
      formData.append("maNhom", "GP01");

      if (fileList.length > 0) {
        formData.append("hinhAnh", fileList[0].originFileObj);
      }

      return await movieService.addMovie(formData);
    },
    onSuccess: () => {
      notyf.success("Thêm phim thành công");
      qc.invalidateQueries({ queryKey: ["listMovieAll"] });
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
    },
    onError: (error) => {
      notyf.error(error.response?.data?.content || "Có lỗi xảy ra!");
    },
  });

  // Sửa phim
  const editMutation = useMutation({
    mutationFn: async (values) => {
      const formData = new FormData();
      const ngayKhoiChieu = values.ngayKhoiChieu
        ? values.ngayKhoiChieu.format("DD/MM/YYYY")
        : "";

      formData.append("maPhim", editingMovie.maPhim);
      formData.append("tenPhim", values.tenPhim);
      formData.append("trailer", values.trailer);
      formData.append("moTa", values.moTa);
      formData.append("ngayKhoiChieu", ngayKhoiChieu);
      formData.append("danhGia", values.danhGia);
      formData.append("maNhom", "GP01");

      if (fileList.length > 0) {
        formData.append("hinhAnh", fileList[0].originFileObj);
      }

      return await movieService.updateMovie(formData);
    },
    onSuccess: () => {
      notyf.success("Cập nhật phim thành công");
      qc.invalidateQueries({ queryKey: ["listMovieAll"] });
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
    },
    onError: (error) => {
      notyf.error(error.response?.data?.content || "Có lỗi xảy ra!");
    },
  });

  // Xóa phim
  const deleteMutation = useMutation({
    mutationFn: async (maPhim) => await movieService.deleteMovie(maPhim),
    onSuccess: () => {
      notyf.success("Xóa phim thành công");
      qc.invalidateQueries({ queryKey: ["listMovieAll"] });
    },
    onError: (error) => {
      notyf.error(error.response?.data?.content || "Có lỗi xảy ra!");
    },
  });

  const columns = [
    { title: "Mã phim", dataIndex: "maPhim", key: "maPhim", width: 100 },
    { title: "Tên phim", dataIndex: "tenPhim", key: "tenPhim" },
    {
      title: "Trailer",
      dataIndex: "trailer",
      key: "trailer",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          Xem trailer
        </a>
      )
    },
    { title: "Mô tả", dataIndex: "moTa", key: "moTa", ellipsis: true },
    {
      title: "Ngày khởi chiếu",
      dataIndex: "ngayKhoiChieu",
      key: "ngayKhoiChieu",
      render: (val) => {
        if (!val) return "";
        const d = dayjs(val, "DD/MM/YYYY");
        return d.isValid() ? d.format("DD/MM/YYYY") : String(val);
      },
      width: 160,
    },
    {
      title: "Đánh giá",
      dataIndex: "danhGia",
      key: "danhGia",
      width: 100,
      render: (rating) => `${rating}/10`
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      render: (src) => (
        <img
          src={src}
          alt="poster"
          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }}
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder-movie.jpg";
          }}
        />
      ),
      width: 120,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phim này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => deleteMutation.mutate(record.maPhim)}
          >
            <Button danger loading={deleteMutation.isPending}>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            onClick={() => {
              setIsEdit(true);
              setEditingMovie(record);
              setIsModalOpen(true);

              // Định dạng ngày khởi chiếu
              let ngayKhoiChieuValue = null;
              if (record.ngayKhoiChieu) {
                try {
                  ngayKhoiChieuValue = dayjs(record.ngayKhoiChieu, "DD/MM/YYYY");
                } catch (e) {
                  console.error("Lỗi định dạng ngày:", e);
                }
              }

              form.setFieldsValue({
                tenPhim: record.tenPhim,
                trailer: record.trailer,
                moTa: record.moTa,
                danhGia: record.danhGia,
                ngayKhoiChieu: ngayKhoiChieuValue,
              });
              setFileList([]);
            }}
          >
            Sửa
          </Button>
        </Space>
      ),
      width: 180,
    },
  ];

  const handleAddMovie = () => {
    setIsEdit(false);
    setEditingMovie(null);
    setIsModalOpen(true);
    form.resetFields();
    setFileList([]);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (isEdit) {
        editMutation.mutate(values);
      } else {
        addMutation.mutate(values);
      }
    });
  };

  const handleTableChange = (pag) => {
    setPagination({
      ...pagination,
      current: pag.current,
      pageSize: pag.pageSize,
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-2xl font-bold text-gray-800">🎬 Quản lý phim</h3>
        <Input.Search
          allowClear
          placeholder="Tìm theo tên phim"
          onSearch={(val) => {
            setSearchTerm(val.trim());
          }}
          onChange={(e) => {
            if (!e.target.value) setSearchTerm("");
          }}
          style={{ maxWidth: 360 }}
        />
      </div>

      <Button
        type="primary"
        onClick={handleAddMovie}
        style={{ marginBottom: 16 }}
      >
        + Thêm phim
      </Button>

      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="maPhim"
        bordered
        loading={isFetching}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} phim`,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={isEdit ? "✏️ Sửa phim" : "➕ Thêm phim"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText={isEdit ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        confirmLoading={addMutation.isPending || editMutation.isPending}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="tenPhim"
            label="Tên phim"
            rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
          >
            <Input placeholder="Nhập tên phim" />
          </Form.Item>

          <Form.Item
            name="trailer"
            label="Trailer"
            rules={[{ required: true, message: "Vui lòng nhập link trailer" }]}
          >
            <Input placeholder="Nhập link trailer YouTube" />
          </Form.Item>

          <Form.Item
            name="moTa"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea placeholder="Nhập mô tả phim" rows={3} />
          </Form.Item>

          <Form.Item
            name="ngayKhoiChieu"
            label="Ngày khởi chiếu"
            rules={[{ required: true, message: "Vui lòng chọn ngày khởi chiếu" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full"
              placeholder="Chọn ngày khởi chiếu"
            />
          </Form.Item>

          <Form.Item
            name="danhGia"
            label="Đánh giá"
            rules={[
              { required: true, message: "Vui lòng nhập điểm đánh giá" },
              { type: 'number', min: 1, max: 10, message: 'Đánh giá phải từ 1 đến 10' }
            ]}
          >
            <InputNumber min={1} max={10} className="w-full" placeholder="1 - 10" />
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            extra={isEdit ? "Chỉ tải lên nếu muốn thay đổi ảnh hiện tại" : ""}
          >
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList.slice(-1))}
              maxCount={1}
              accept="image/*"
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
            {isEdit && editingMovie?.hinhAnh && fileList.length === 0 ? (
              <div style={{ marginTop: 8 }}>
                <div>Ảnh hiện tại:</div>
                <img
                  src={editingMovie.hinhAnh}
                  alt="preview"
                  style={{ width: 120, marginTop: 4, borderRadius: 4 }}
                  onError={(e) => (e.currentTarget.src = "/images/placeholder-movie.jpg")}
                />
              </div>
            ) : null}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminMoviePage;