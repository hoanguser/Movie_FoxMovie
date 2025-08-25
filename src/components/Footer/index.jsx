import React from 'react'
import Section from '../../HOC/Section'

const Footer = () => {
  return (
    <footer
      className="relative text-white py-10 mt-10"
      style={{
        backgroundImage:
          "url('https://cdn.tgdd.vn/Files/2022/08/22/1458489/anhnetflix2_1280x843-800-resize.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Lớp phủ mờ */}
      <div className="absolute inset-0 bg-[#000000bf] bg-opacity-70"></div>
      {/* Nội dung footer */}
      <Section>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo + Địa chỉ + SĐT */}
          <div className="col-span-3 flex flex-col items-center md:items-start text-center md:text-left p-5">
            <div className="mb-5">
              <img
                className="w-[130px] h-[70px]"
                src="/images/logo.png"
                alt="MovieInHands Logo"
              />
            </div>
            <p className="text-sm mb-2">
              137 - Học Viện Công Nghệ Bưu Chính Viễn Thông, Quận 9, Thành Phố Hồ
              Chí Minh
            </p>
            <p className="text-sm">
              Gọi cho: <span className="text-orange-500">(+84) 39 858 4505</span>
            </p>
          </div>

          {/* Chính sách */}
          <div className="flex flex-col items-center md:items-start p-5">
            <h3 className="text-lg font-semibold mb-3">Chính Sách</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-orange-500 cursor-pointer">
                Terms of Use
              </li>
              <li className="hover:text-orange-500 cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-orange-500 cursor-pointer">Security</li>
            </ul>
          </div>

          {/* Tài khoản */}
          <div className="flex flex-col items-center md:items-start p-5">
            <h3 className="text-lg font-semibold mb-3">Tài Khoản</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-orange-500 cursor-pointer">My Account</li>
              <li className="hover:text-orange-500 cursor-pointer">Watchlist</li>
              <li className="hover:text-orange-500 cursor-pointer">Collections</li>
              <li className="hover:text-orange-500 cursor-pointer">User Guide</li>
            </ul>
          </div>
        </div>
      </Section>
    </footer>
  )
}

export default Footer
