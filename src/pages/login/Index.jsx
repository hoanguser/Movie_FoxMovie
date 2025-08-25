import React, { useEffect } from 'react'
import { Button, Checkbox, Form, Input } from 'antd';
import { userService } from '../../service/userService';
import { useDispatch, useSelector } from 'react-redux';
import { setInfoUserAction } from '../../stores/user';
import { keysLocalStorage, localStorageUtil } from '../../util/localStorage';
import { useNavigate } from 'react-router-dom';
import { notyf } from '../../util/notyf';
const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};
const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const { infoUser } = useSelector((state) => state.userSlice);
    const onFinish = async (values) => {
        try {
            const responseLogin = await userService.login(values);
            const infoUser = responseLogin.data.content;
            dispatch(setInfoUserAction(infoUser));
            localStorageUtil.set(keysLocalStorage.INFO_USER, infoUser)
            notyf.success("Đăng nhập thành công 🎉");
            infoUser.maLoaiNguoiDung === "QuanTri" ? navigate("/admin") : navigate("/");
            console.log("🚀 ~ onFinish ~ infoUser.maLoaiNguoiDung:", infoUser.maLoaiNguoiDung)
        } catch (error) {
            console.log(error)
            notyf.error(error?.response.data.content)
        }
    };
    return (
        <div className='text-white p-8 rounded-2xl text-center shadow-sm shadow-[#f99c00]'>
            <h3 className='text-2xl font-bold uppercase text-[#f99c00]'>
                Đăng Nhập
            </h3>
            <div className='flex justify-center items-center mt-5 mb-4'>
                <div className='w-[100px] h-[100px] rounded-full shadow-2xl shadow-[#f99c00] flex justify-center items-center'>
                    <img className='w-[60%]' src="/images/logo.png" alt="" />
                </div>
            </div>
            {/* "taiKhoan admin": "hoangNguyen",
            "matKhau": "123456", */}
            {/* "taiKhoan user": "hoangUser",
            "matKhau": "123456", */}
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="taiKhoan"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="matKhau"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            {/*  */}
        </div>
    )
}

export default LoginPage
