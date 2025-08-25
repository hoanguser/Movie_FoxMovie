import React from 'react'
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userService } from '../../service/userService';
import { notyf } from '../../util/notyf';
import { useNavigate } from 'react-router-dom';
const schema = yup.object({
    taiKhoan: yup
        .string()
        .trim()
        .required("Không được để trống"),
    email: yup
        .string()
        .trim()
        .email("Email không hợp lệ")
        .required("Không được để trống"),
    soDT: yup
        .string()
        .matches(
            /^(?:\+?84|0)(?:3[2-9]|5[25689]|7(?:0|[6-9])|8[1-9]|9[0-9])\d{7}$/,
            "Số điện thoại phải là của Việt Nam"
        )
        .required("Vui lòng nhập số điện thoại"),
    matKhau: yup
        .string()
        .trim()
        .required("Vui lòng nhập mật khẩu"),
    hoTen: yup
        .string()
        .trim()
        .required("Vui lòng nhập họ và tên")
})
const RegisterPage = () => {
    const navigate = useNavigate();
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
        },
        resolver: yupResolver(schema),
        mode: "onChange"
    });
    const handleSubmitValueForm = async (dataForm) => {
        console.log("dataForm: ", dataForm);
        try {
            await userService.regiterUser({ ...dataForm, maNhom: "GP00" });
            notyf.success("Đăng ký người dùng thành công")
            navigate("/login")
        } catch (error) {
            console.log(error?.response.data.content)
            notyf.error(error?.response.data.content)
        }
    };
    return (
        <div>
            <div className='text-white w-[500px] p-8 mt-3 rounded-2xl text-center shadow-sm shadow-[#f99c00]'>
                <h3 className='text-2xl font-bold uppercase text-[#f99c00]'>
                    Đăng Ký
                </h3>
                <div className='flex justify-center items-center mt-5 mb-4'>
                    <div className='w-[100px] h-[100px] rounded-full shadow-2xl shadow-[#f99c00] flex justify-center items-center'>
                        <img className='w-[60%]' src="/images/logo.png" alt="" />
                    </div>
                </div>
                <div className="p-8 text-left">
                    <form
                        onSubmit={handleSubmit(handleSubmitValueForm)}
                        className="space-y-3"
                    >
                        {/* Tài khoản */}
                        <div>
                            <p className="w-full mb-1">Tài khoản</p>
                            <input
                                {...register("taiKhoan")}
                                className="border border-[#f99c00] p-2 rounded-2xl w-[100%]"
                                type="text"
                            />
                            <p className="text-red-500">{errors.taiKhoan?.message}</p>
                        </div>
                        {/* Mật khẩu */}
                        <div>
                            <p className="w-full mb-1">Mật khẩu</p>
                            <input
                                {...register("matKhau")}
                                className="border border-[#f99c00]  p-2 rounded-2xl w-[100%]"
                                type="text"
                            />
                            <p className="text-red-500">{errors.matKhau?.message}</p>
                        </div>
                        {/* Họ tên */}
                        <div>
                            <p className="w-full mb-1">Họ tên</p>
                            <input
                                {...register("hoTen")}
                                className="border border-[#f99c00]  p-2 rounded-2xl w-[100%]"
                                type="text"
                            />
                            <p className="text-red-500">{errors.hoTen?.message}</p>
                        </div>
                        {/* Email */}
                        <div>
                            <p className="w-full mb-1">Email</p>
                            <input
                                {...register("email")}
                                className="border border-[#f99c00]  p-2 rounded-2xl w-[100%]"
                                type="text"
                            />
                            <p className="text-red-500">{errors.email?.message}</p>
                        </div>
                        {/* Số điện thoại */}
                        <div>
                            <p className="w-full mb-1">Số điện thoại</p>
                            <input
                                {...register("soDT")}
                                className="border border-[#f99c00]  p-2 rounded-2xl w-[100%]"
                                type="text"
                            />
                            <p className="text-red-500">{errors.soDT?.message}</p>
                        </div>
                        <button className="mt-3 bg-[#f99c00] p-2 hover:bg-amber-900 rounded text-white w-full">
                            Đăng Ký
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
