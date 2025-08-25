import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
const { Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem(<NavLink to="/admin">Quản Lý user</NavLink>, '/admin', <PieChartOutlined />),
    getItem(<NavLink to="/admin/movie">Quản Lý phim</NavLink>, '/admin/movie', <DesktopOutlined />),
    getItem(<NavLink to="/admin/ticket">Quản Lý vé</NavLink>, '/admin/ticket', <DesktopOutlined />),
    getItem(<NavLink to="/admin/theater">Quản Lý rạp</NavLink>, '/admin/theater', <DesktopOutlined />),

];
const AdminTemplate = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <div className="demo-logo-vertical mt-5 mb-5" >
                    <img className='w-[130px] h-[70px]' src="/images/logo.png" alt="" />
                </div>
                <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Outlet />
            </Layout>
        </Layout>
    )
}

export default AdminTemplate
