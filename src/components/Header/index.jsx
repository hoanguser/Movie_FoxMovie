import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setLogoutAction } from '../../stores/user';
import Section from '../../HOC/Section';
import { DotChartOutlined, DownOutlined, HistoryOutlined, LoginOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
const HeaderPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { infoUser } = useSelector((state) => state.userSlice);
    const handleLogout = () => {
        dispatch(setLogoutAction())
    }
    const items = [
        {
            key: '1',
            label: 'Trang cá nhân',
            icon: <UserOutlined />,
            onClick: () => {
                navigate("/info");
            },
        },
        {
            key: '2',
            label: 'Lịch sử',
            icon: <HistoryOutlined />,
        },
        ...(infoUser?.maLoaiNguoiDung === "QuanTri"
            ? [
                {
                    key: "admin",
                    label: "Trang quản trị",
                    icon: <DotChartOutlined />,
                    onClick: () => {
                        navigate("/admin");
                    },
                },
            ]
            : []),
        {
            type: 'divider',
        },
        {
            key: '4',
            label: (
                <button onClick={handleLogout}>Đăng xuất</button>
            ),
            icon: <LoginOutlined />,
            danger: true,
        },
    ];
    return (
        <div className='py-4 bg-[#0e1b25] text-white shadow-md shadow-[#f99e0089]'>
            <Section>
                <div className='flex justify-between items-center'>
                    <div>
                        <img className='w-[130px] h-[70px]' src="/images/logo.png" alt="" />
                    </div>
                    <div className='flex justify-between items-center gap-7'>
                        <a href="/">Trang Chủ</a>
                        <a href="/">Sản Phẩm</a>
                        <a href="/">Sự Kiện</a>
                        <a href="/">Rạp/Giá Vé</a>
                    </div>
                    {
                        infoUser ? (
                            <div className='text-white'>
                                <Dropdown menu={{ items }}>
                                    <a onClick={e => e.preventDefault()}>
                                        <Space>
                                            {infoUser?.hoTen}
                                            <DownOutlined />
                                        </Space>
                                    </a>
                                </Dropdown>
                            </div>
                        ) : (
                            <div className='text-white'>
                                <button onClick={() => {
                                    navigate("/login");
                                }} className='px-2 py-1 rounded bg-[#f99c00]'>Đăng Nhập</button>
                                <button onClick={() => {
                                    navigate("/register");
                                }} className='ml-2 px-2 py-1 rounded bg-white text-black'>Đăng Ký</button>
                            </div>
                        )
                    }
                </div>
            </Section>
        </div>
    )
}

export default HeaderPage
