import React, { useState } from 'react';
import { userService } from '../../../service/userService';
import { Table, Modal, Form, Input, Button, Tag, Space } from "antd";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notyf } from '../../../util/notyf';

const AdminHomePage = () => {
  const qc = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Lấy danh sách người dùng
  const { data } = useQuery({
    queryKey: ["listUser"],
    queryFn: async () => await userService.getListUser(),
  });

  // Xóa user
  const deleteMutation = useMutation({
    mutationFn: async (taiKhoan) => {
      try {
        const res = await userService.deleteUser(taiKhoan);
        notyf.success("Xóa người dùng thành công");
        return res;
      } catch (error) {
        const errMsg = error.response?.data?.content || "Có lỗi xảy ra!";
        notyf.error(errMsg);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["listUser"] });
    }
  });



  // Sửa user
  const editMutation = useMutation({
    mutationFn: async (values) => {
      try {
        const payload = {
          taiKhoan: values.taiKhoan,
          matKhau: values.matKhau,
          email: values.email,
          soDT: values.soDT,
          hoTen: values.hoTen,
          maLoaiNguoiDung: values.maLoaiNguoiDung,
          maNhom: values.maNhom || "GP00" // Thêm mã nhóm mặc định nếu không có
        };
        const res = await userService.editUser(payload);
        notyf.success("Cập nhật người dùng thành công");
        return res;
      } catch (error) {
        const errMsg = error.response?.data?.content || "Có lỗi xảy ra!";
        notyf.error(errMsg);
        throw error; // Ném lỗi để mutation xử lý thất bại
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["listUser"] }); // Cập nhật lại danh sách
      setIsModalOpen(false); // Đóng modal
      form.resetFields(); // Reset form
    }
  });

  const listUser = data?.data?.content || [];

  const columns = [
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Họ Tên", dataIndex: "hoTen", key: "hoTen" },
    {
      title: "Mã Loại Người Dùng", dataIndex: "maLoaiNguoiDung", key: "maLoaiNguoiDung",
      render: (text) => (
        <Tag color={text === "QuanTri" ? "red" : "blue"}>{text}</Tag>
      )
    },
    { title: "Tài Khoản", dataIndex: "taiKhoan", key: "taiKhoan" },
    { title: "Mật khẩu", dataIndex: "matKhau", key: "matKhau" },
    { title: "Số điện thoại", dataIndex: "soDT", key: "soDT" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button danger onClick={() => deleteMutation.mutate(record.taiKhoan)}>Xóa</Button>
          <Button type="primary" onClick={() => {
            setIsEdit(true);
            setEditingUser(record);
            setIsModalOpen(true);
            form.setFieldsValue(record);
          }}>Sửa</Button>
        </Space>
      )
    }
  ];

  const handleAddUser = () => {
    setIsEdit(false);
    setEditingUser(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        editMutation.mutate(values);
      } else {
        addMutation.mutate(values);
      }
    });
  };

  return (
    <div className='p-8 bg-gray-50 min-h-screen'>
      <h3 className='text-2xl font-bold mb-4 text-gray-800'>👤 Quản lý người dùng</h3>
      {/* <Button type="primary" onClick={handleAddUser} style={{ marginBottom: 16 }}>+ Thêm người dùng</Button> */}
      <Table
        columns={columns}
        dataSource={listUser}
        rowKey="taiKhoan"
        bordered
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={isEdit ? "✏️ Sửa người dùng" : "➕ Thêm người dùng"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText={isEdit ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="taiKhoan"
            label="Tài khoản"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
          >
            <Input placeholder="Nhập tài khoản" disabled={isEdit} />
          </Form.Item>
          <p className="text-xs text-gray-500 -mt-2 mb-2">Nhập tài khoản đăng nhập</p>

          <Form.Item
            name="matKhau"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <p className="text-xs text-gray-500 -mt-2 mb-2">Mật khẩu ít nhất 6 ký tự</p>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>
          <p className="text-xs text-gray-500 -mt-2 mb-2">Nhập email hợp lệ (ví dụ: abc@gmail.com)</p>

          <Form.Item
            name="soDT"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <p className="text-xs text-gray-500 -mt-2 mb-2">Chỉ nhập số, không chứa ký tự đặc biệt</p>

          <Form.Item
            name="hoTen"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
          <p className="text-xs text-gray-500 -mt-2 mb-2">Nhập đầy đủ họ và tên</p>

          <Form.Item
            name="maLoaiNguoiDung"
            label="Mã loại người dùng"
            rules={[{ required: true, message: "Vui lòng nhập mã loại người dùng" }]}
          >
            <Input placeholder="QuanTri / KhachHang" />
          </Form.Item>
          <p className="text-xs text-gray-500 -mt-2">Chọn loại: QuanTri hoặc KhachHang</p>

          <Form.Item
            name="maNhom"
            label="Mã nhóm"
            rules={[{ required: false }]}
          >
            <Input placeholder="Nhập mã nhóm nếu cần" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminHomePage;
