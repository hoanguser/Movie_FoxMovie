import axios from 'axios'
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setListMovieAction } from '../../../stores/movie';
import { axiosCustom } from "../../../service/config"
import { movieService } from '../../../service/movieService';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Meta } = Card;
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
// import required modules
import { Grid, Pagination } from 'swiper/modules';
const ListMovie = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const listMovie = useSelector((state) => state.movieSlice.listMovie);
    // console.log(listMovie);
    const fetchListMovie = async () => {
        try {
            const responseListMovie = await movieService.getListMovies();
            dispatch(setListMovieAction(responseListMovie.data.content));
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(() => {
        fetchListMovie();
    }, []);
    const handleRedirectMoviePage = (movieID) => {
        navigate(`/detail/${movieID}`);
    }
    return (
        <div className='mt-10 mb-10'>
            <Swiper
                slidesPerView={5}
                grid={{
                    rows: 2,
                    fill: "row"
                }}
                spaceBetween={30}
                modules={[Grid, Pagination]}
                className="mySwiper"
            >
                {
                    listMovie.map((movie, index) => {
                        return (
                            <SwiperSlide>
                                <div key={index} className='relative group'>
                                    <Card
                                        onClick={() => { handleRedirectMoviePage(movie.maPhim) }}
                                        hoverable
                                        bodyStyle={{ display: 'none' }}
                                        cover={<img alt="example" src={movie.hinhAnh} className='!h-[350px] w-[100%] object-cover' />}
                                    >
                                    </Card>
                                    <div className="absolute bottom-0 left-0 w-full bg-[rgba(0,0,0,0.75)] opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center transition duration-300 h-[100px]">
                                        <p className="text-white mb-4 font-semibold px-1 uppercase">{movie.tenPhim}</p>
                                        <div className="flex gap-2">
                                            <button className="bg-[#f99c00] text-white px-3 py-1 rounded" onClick={() => { handleRedirectMoviePage(movie.maPhim) }}>XEM CHI TIẾT</button>
                                            <button className="bg-white text-black px-3 py-1 rounded">MUA VÉ</button>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>

            {/* <div className="grid grid-cols-4 gap-4 mt-10">
                {
                    listMovie.map((movie, index) => {
                        return (
                            <div key={index} className='relative group'>
                                <Card
                                    hoverable
                                    bodyStyle={{ display: 'none' }}
                                    cover={<img alt="example" src={movie.hinhAnh} className='!h-[350px] object-cover' />}
                                >
                                </Card>
                                <div className="absolute bottom-0 left-0 w-full bg-[rgba(0,0,0,0.75)] opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center transition duration-300 h-[100px]">
                                    <p className="text-white mb-4 font-semibold">{movie.tenPhim}</p>
                                    <div className="flex gap-2">
                                        <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => { handleRedirectMoviePage(movie.maPhim) }}>XEM CHI TIẾT</button>
                                        <button className="bg-white text-black px-3 py-1 rounded">MUA VÉ</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div> */}
        </div>
    )
}

export default ListMovie
