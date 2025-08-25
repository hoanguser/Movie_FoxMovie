import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import { notyf } from '../util/notyf';

const AuthCheck = ({ children, isNeedLogin, roles }) => {
    const { infoUser } = useSelector((state) => state.userSlice);
    if (roles && infoUser) {
        const userRole = infoUser.maLoaiNguoiDung?.trim();
        console.log("🚀 ~ AuthCheck ~ infoUser.maLoaiNguoiDung:", infoUser.maLoaiNguoiDung, "role", roles)
        if (!roles.includes(userRole)) {
            notyf.error("Bạn không có quyền truy cập")
            return <Navigate to="/" replace />;
        }
    }
    // if (infoUser && !isNeedLogin) {
    //     return <Navigate to="/" replace />;
    // }
    if (!infoUser && isNeedLogin) {
        return <Navigate to="/login" replace />;
    }
    return (
        <div>
            {children}
        </div>
    )
}

export default AuthCheck
