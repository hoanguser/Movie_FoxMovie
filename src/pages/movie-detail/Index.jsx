import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Rate } from 'antd';
import { Tabs } from 'antd';
import { movieService } from '../../service/movieService';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// 
import { Navigation } from 'swiper/modules';
import MovieShowTimes from './MovieShowTimes';

const MovieDetailPage = () => {
  const { movieID } = useParams();
  const [movieDetail, setMovieDetail] = useState();
  const linkYoutube = movieDetail?.trailer;
  const getEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error("Lỗi YouTube URL:", url);
      return "";
    }
  };
  const embedUrl = linkYoutube ? getEmbedUrl(linkYoutube) : "";
  const onChange = key => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: "Mô tả",
      children: `${movieDetail?.moTa}`,
    },
    {
      key: '2',
      label: 'Trailer',
      children: embedUrl ? (
        <div className="mt-5" >
          <iframe
            width="500"
            height="250"
            src={embedUrl}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div >
      ) : (
        <p className="text-gray-500">Không có trailer</p>
      ),
    }
  ];
  const fetchMovieDetail = async () => {
    try {
      const responseMovieDetail = await movieService.getMovieDetail(movieID);
      setMovieDetail(responseMovieDetail.data.content);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchMovieDetail();
  }, [movieID]);
  return (
    <div className='w-full max-w-[65%] mx-auto mt-10'>
      <h3 className='text-4xl mb-3 uppercase text-[#f99c00] '>Nội Dung Phim</h3>
      <div className="grid grid-cols-3 gap-7 mt-10">
        <div>
          <img className='w-[100%]' src={movieDetail?.hinhAnh} alt="" />
        </div>
        <div className='col-span-2'>
          <h3 className="text-3xl mb-5 uppercase font-bold text-shadow-amber-500">{movieDetail?.tenPhim}</h3>
          <div className='mb-4'>
            <span className='font-bold mr-2'>Đánh Giá:</span> <Rate disabled allowHalf value={movieDetail?.danhGia} />
          </div>
          <div className='mb-4'>
            <span className='font-bold mr-2'>Ngày Khởi Chiếu:</span> {movieDetail?.ngayKhoiChieu}
          </div>
          <div className="mt-5">
            {movieDetail && (
              <Tabs style={{ color: "#ffffff"}} className='text-2xl text-white' defaultActiveKey="1" items={items} onChange={onChange} />
            )}
          </div>
        </div>
      </div>
      <div className='mt-10 mb-10'>
        <h3 className='text-2xl uppercase font-bold'>Lịch Chiếu</h3>
        <div className="flex">
          <MovieShowTimes movieID={movieID} />
        </div>
      </div>
    </div >
  )
}

export default MovieDetailPage
