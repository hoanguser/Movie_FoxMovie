import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Tabs } from "antd";
import * as yup from "yup";
import { userService } from "../../service/userService";
import { notyf } from "../../util/notyf";
import { useDispatch } from "react-redux";
import { setInfoUserAction } from "../../stores/user";
import { keysLocalStorage, localStorageUtil } from "../../util/localStorage";
const schema = yup.object({
    taiKhoan: yup
        .string()
        .trim()
        .required("ko dc de trong"),
    soDT: yup
        .string()
        .matches(
            /^(?:\+?84|0)(?:3[2-9]|5[25689]|7(?:0|[6-9])|8[1-9]|9[0-9])\d{7}$/,
            "So dien thoai vn dau may"
        )
        .required("nhap vo de trong db"),
})
const UserInfoPage = () => {
    const [activeTab, setActiveTab] = useState("1");
    const [bookingHistory, setBookingHistory] = useState([]);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            taiKhoan: "",
            matKhau: "",
            hoTen: "",
            email: "",
            soDT: "",
            maLoaiNguoiDung: "",
        },
        resolver: yupResolver(schema),
        mode: "onChange"
    });

    const handleSubmitValueForm = async (dataForm) => {
        console.log("dataForm: ", dataForm);
        try {
            await userService.upDateInfoUser({ ...dataForm, maNhom: "GP00" });
            const resUser = await userService.getInfoUser();
            const updatedUser = resUser.data.content;
            dispatch(setInfoUserAction(updatedUser));
            localStorageUtil.set(keysLocalStorage.INFO_USER, updatedUser);
            notyf.success("Cập Nhật Thành Công");
        } catch (error) {
            console.log(error)
            notyf.error(error?.data.content)
        }
    };
    const fetchInfoUser = async () => {
        try {
            const response = await userService.getInfoUser();
            console.log("th", response)
            const { email, hoTen, maLoaiNguoiDung, maNhom, matKhau, soDT, taiKhoan } = response.data.content;
            setBookingHistory(response.data.content.thongTinDatVe);
            console.log("🚀 ~ fetchInfoUser ~ setBookingHistory:", bookingHistory)
            reset({
                taiKhoan,
                matKhau,
                hoTen,
                email,
                soDT,
                maLoaiNguoiDung
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchInfoUser()
    }, [])
    return (
        // <div className="flex justify-center py-10">
        //     <div className="bg-gray-900 text-white max-w-3xl w-full p-10 rounded-2xl shadow-lg shadow-[#f99c00]">
        //         {/* Header */}
        //         <div className="flex flex-col items-center">
        //             <div className="w-28 h-28 rounded-full shadow-lg shadow-[#f99c00] overflow-hidden flex justify-center items-center bg-gray-800">
        //                 <img className="w-[70%]" src="/images/logo.png" alt="avatar" />
        //             </div>
        //             <h3 className="mt-4 text-2xl font-bold uppercase text-[#f99c00]">
        //                 Thông Tin Người Dùng
        //             </h3>
        //         </div>

        //         {/* Form */}
        //         <form
        //             onSubmit={handleSubmit(handleSubmitValueForm)}
        //             className="mt-8 space-y-6"
        //         >
        //             {/* Tài khoản */}
        //             <div className="grid grid-cols-3 gap-4 items-center">
        //                 <label className="font-medium">Tài khoản</label>
        //                 <div className="col-span-2">
        //                     <input
        //                         {...register("taiKhoan")}
        //                         className="border border-[#f99c00] p-2 rounded-lg w-full bg-transparent"
        //                         type="text"
        //                         readOnly
        //                     />
        //                     <p className="text-red-500 text-sm">{errors.taiKhoan?.message}</p>
        //                 </div>
        //             </div>

        //             {/* Mật khẩu */}
        //             <div className="grid grid-cols-3 gap-4 items-center">
        //                 <label className="font-medium">Mật khẩu</label>
        //                 <div className="col-span-2">
        //                     <input
        //                         {...register("matKhau")}
        //                         className="border border-[#f99c00] p-2 rounded-lg w-full bg-transparent"
        //                         type="password"
        //                     />
        //                     <p className="text-red-500 text-sm">{errors.matKhau?.message}</p>
        //                 </div>
        //             </div>

        //             {/* Họ tên */}
        //             <div className="grid grid-cols-3 gap-4 items-center">
        //                 <label className="font-medium">Họ tên</label>
        //                 <div className="col-span-2">
        //                     <input
        //                         {...register("hoTen")}
        //                         className="border border-[#f99c00] p-2 rounded-lg w-full bg-transparent"
        //                         type="text"
        //                     />
        //                     <p className="text-red-500 text-sm">{errors.hoTen?.message}</p>
        //                 </div>
        //             </div>

        //             {/* Email */}
        //             <div className="grid grid-cols-3 gap-4 items-center">
        //                 <label className="font-medium">Email</label>
        //                 <div className="col-span-2">
        //                     <input
        //                         {...register("email")}
        //                         className="border border-[#f99c00] p-2 rounded-lg w-full bg-transparent"
        //                         type="email"
        //                     />
        //                     <p className="text-red-500 text-sm">{errors.email?.message}</p>
        //                 </div>
        //             </div>

        //             {/* Số điện thoại */}
        //             <div className="grid grid-cols-3 gap-4 items-center">
        //                 <label className="font-medium">Số điện thoại</label>
        //                 <div className="col-span-2">
        //                     <input
        //                         {...register("soDT")}
        //                         className="border border-[#f99c00] p-2 rounded-lg w-full bg-transparent"
        //                         type="text"
        //                     />
        //                     <p className="text-red-500 text-sm">{errors.soDT?.message}</p>
        //                 </div>
        //             </div>

        //             {/* Submit button */}
        //             <div className="flex justify-end">
        //                 <button className="bg-[#f99c00] px-6 py-2 rounded-lg hover:bg-amber-900 transition text-white font-semibold">
        //                     Cập Nhật
        //                 </button>
        //             </div>
        //         </form>
        //     </div>
        // </div>
        <div className="max-w-5xl mx-auto py-10">
            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                items={[
                    {
                        key: "1",
                        label: "Thông tin người dùng",
                        children: (
                            <div className="flex justify-center py-10">
                                <div className="bg-gray-900 text-white max-w-3xl w-full p-10 rounded-2xl shadow-lg shadow-[#f99c00]">
                                    {/* Header */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-28 h-28 rounded-full shadow-lg shadow-[#f99c00] overflow-hidden flex justify-center items-center bg-gray-800">
                                            <img className="w-[70%]" src="/images/logo.png" alt="avatar" />
                                        </div>
                                        <h3 className="mt-4 text-2xl font-bold uppercase text-[#f99c00]">
                                            Thông Tin Người Dùng
                                        </h3>
                                    </div>

                                    {/* Form */}
                                    <form
                                        onSubmit={handleSubmit(handleSubmitValueForm)}
                                        className="mt-8 space-y-6"
                                    >
                                        {/* Tài khoản */}
                                        <div className="grid grid-cols-3 gap-4 items-center">
                                            <label className="font-medium">Tài khoản</label>
                                            <div className="col-span-2">
                                                <input
                                                    {...register("taiKhoan")}
                                                    className="border border-[#f99c00] p-2 rounded-lg w-full bg-transparent"
                                                    type="text"
                                                    readOnly
                                                />
                                                <p className="text-red-500 text-sm">{errors.taiKhoan?.message}</p>
                                            </div>
                                        </div>

                                        {/* Mật khẩu */}
                                        <div className="grid grid-cols-3 gap-4 items-center">
                                            <label className="font-medium">Mật khẩu</label>
                                            <div className="col-span-2">
                                                <input
                                                    {...register("matKhau")}
                                                    className="border border-[#f99c00] p-2 rounded-lg w-full bg-transparent"
                                                    type="password"
                                                />
                                                <p className="text-red-500 text-sm">{errors.matKhau?.message}</p>
                                            </div>
                                        </div>

                                        {/* Họ tên */}
                                        <div className="grid grid-cols-3 gap-4 items-center">
                                            <label className="font-medium">Họ tên</label>
                                            <div className="col-span-2">
                                                <input
                                                    {...register("hoTen")}
                                                    className="border border-[#f99c00] p-2 rounded-lg w-full bg-transparent"
                                                    type="text"
                                                />
                                                <p className="text-red-500 text-sm">{errors.hoTen?.message}</p>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="grid grid-cols-3 gap-4 items-center">
                                            <label className="font-medium">Email</label>
                                            <div className="col-span-2">
                                                <input
                                                    {...register("email")}
                                                    className="border border-[#f99c00] p-2 rounded-lg w-full bg-transparent"
                                                    type="email"
                                                />
                                                <p className="text-red-500 text-sm">{errors.email?.message}</p>
                                            </div>
                                        </div>

                                        {/* Số điện thoại */}
                                        <div className="grid grid-cols-3 gap-4 items-center">
                                            <label className="font-medium">Số điện thoại</label>
                                            <div className="col-span-2">
                                                <input
                                                    {...register("soDT")}
                                                    className="border border-[#f99c00] p-2 rounded-lg w-full bg-transparent"
                                                    type="text"
                                                />
                                                <p className="text-red-500 text-sm">{errors.soDT?.message}</p>
                                            </div>
                                        </div>

                                        {/* Submit button */}
                                        <div className="flex justify-end">
                                            <button className="bg-[#f99c00] px-6 py-2 rounded-lg hover:bg-amber-900 transition text-white font-semibold">
                                                Cập Nhật
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ),
                    },
                    {
                        key: "2",
                        label: "Lịch sử đặt vé",
                        children: (
                            <div className="grid md:grid-cols-2 gap-6">
                                {bookingHistory?.map((ticket, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-800 rounded-xl shadow-sm shadow-[#f99c00] p-5 flex gap-3"
                                    >
                                        <img
                                            src={ticket.hinhAnh}
                                            alt={ticket.tenPhim}
                                            className="rounded-lg mb-3 h-52 object-cover"
                                        />
                                        <div>
                                            <h3 className="text-lg font-bold text-[#f99c00] uppercase">
                                                {ticket.tenPhim}
                                            </h3>
                                            <p className="text-sm text-gray-300 mt-2">
                                                Ngày đặt: {new Date(ticket.ngayDat).toLocaleString("vi-VN")}
                                            </p>
                                            <div className="mt-2">
                                                <p className="text-md text-[#f99c00]">Ghế đã đặt:</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {ticket.danhSachGhe.map((ghe, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-[#f99c00] text-white font-bold px-2 py-1 rounded text-xs"
                                                        >
                                                            {ghe.tenGhe} - {ghe.tenRap}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default UserInfoPage;
