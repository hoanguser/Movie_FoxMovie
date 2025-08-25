import React, { useEffect, useState } from 'react'
import { cinemaService } from '../../../service/cinemaService'
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Badge, Card, Space } from 'antd';
// import

const MovieTheaterDetail = ({ maHeThongRap }) => {
  console.log("🚀 ~ MovieTheaterDetail ~ maHeThongRap:", maHeThongRap)
  const [movieTheaterDetail, setMovieTheaterDetail] = useState([]);
  const [activeList, setActiveList] = useState(0);
  const fetchMovieTheaterDetail = async () => {
    try {
      const res = await cinemaService.getMovieTheaterDetail(maHeThongRap)
      console.log("🚀 ~ fetchMovieTheaterDetail ~ res:", res.data.content)
      setMovieTheaterDetail(res.data.content);
    } catch (error) {
      console.log("🚀 ~ fetchMovieTheaterDetail ~ error:", error)
    }
  }
  useEffect(() => {
    fetchMovieTheaterDetail();
  }, [maHeThongRap])
  const allCumRap = movieTheaterDetail.flatMap((heThong) => heThong.lstCumRap);
  return (
    // <div>
    //   <div className="flex">
    //     <div className='flex flex-col'>
    //       {movieTheaterDetail.map((heThong, idxHeThong) => (
    //         heThong?.lstCumRap.map((cumRap, idxCumRap) => (
    //           <div
    //             key={idxCumRap}
    //             className={`flex items-center gap-5 py-6 px-3 cursor-pointer hover:bg-[#ce6e0672] ${activeList === idxCumRap ? 'bg-[#f99c00]' : ''
    //               }`}
    //             onClick={() => setActiveList(idxCumRap)}
    //           >
    //             <div>
    //               {cumRap.tenCumRap}
    //             </div>
    //           </div>
    //         ))
    //       ))}
    //     </div>
    //   </div>
    // </div>
    <div className="flex">
      {/* Sidebar danh sách cụm rạp */}
      <PerfectScrollbar style={{ maxHeight: 600}}>
        <div className="flex flex-col border-r">
          {allCumRap.map((cumRap, idxCumRap) => (
            <div
              key={cumRap.maCumRap}
              className={`flex items-center gap-5 py-6 px-3 cursor-pointer hover:bg-[#ce6e0672] ${activeList === idxCumRap ? "bg-[#f99c00]" : ""
                }`}
              onClick={() => setActiveList(idxCumRap)}
            >
              {cumRap.tenCumRap}
            </div>
          ))}
        </div>
      </PerfectScrollbar>

      {/* Nội dung phim của cụm rạp đang chọn nhé :>>>> */}
      <PerfectScrollbar style={{ maxHeight: 600, maxWidth: 700 }}>
        <div className="flex-1 p-5">
          {allCumRap[activeList] && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {allCumRap[activeList].tenCumRap}
              </h2>

              {allCumRap[activeList].danhSachPhim.map((phim) => (
                <div
                  key={phim.maPhim}
                  className="mb-6 border-b pb-4 flex gap-4"
                >
                  <Space direction="vertical" size="middle">
                    {phim.hot ? (
                      <Badge.Ribbon text="Hot" color="red">
                        <img
                          src={phim.hinhAnh}
                          alt={phim.tenPhim}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </Badge.Ribbon>
                    ) : (
                      <img
                        src={phim.hinhAnh}
                        alt={phim.tenPhim}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                  </Space>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 uppercase">{phim.tenPhim}</h3>
                    {/* {phim.hot && (
                        <span className="bg-red-600 text-white text-xs font-bold rounded">
                          HOT
                        </span>
                      )} */}
                    <div className="flex flex-wrap gap-2">
                      {phim.lstLichChieuTheoPhim.map((lich) => (
                        <button
                          key={lich.maLichChieu}
                          className="px-3 py-1 border rounded hover:bg-orange-500"
                        >
                          {new Date(lich.ngayChieuGioChieu).toLocaleString("vi-VN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}{" "}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PerfectScrollbar>
    </div>
  )
}

export default MovieTheaterDetail
