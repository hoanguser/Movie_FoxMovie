import React, { useEffect, useState } from 'react'
import { cinemaService } from '../../../service/cinemaService'
import MovieTheaterDetail from './MovieTheaterDetail';

const MovieTheaterList = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [theaterList, setTheaterList] = useState([]);
    const [maHeThongRap, setMaHeThongRap] = useState(null);
    const fetchMovieTheaterList = async () => {
        try {
            const responseMovieTheaterList = await cinemaService.getMovieTheater();
            const  data = responseMovieTheaterList.data.content
            setTheaterList(data)
            setMaHeThongRap(data[0]?.maHeThongRap)
            console.log("🚀 ~ fetchMovieTheaterList ~ responseMovieTheaterList.data.content:", responseMovieTheaterList.data.content)
        } catch (error) {
            console.log("🚀 ~ fetchMovieTheaterList ~ error:", error)
        }
    }
    console.log("🚀 ~ MovieTheaterList ~ maHeThongRap:", maHeThongRap)

    useEffect(() => {
        fetchMovieTheaterList();
    }, [])
    return (
        <div className='flex mt-5'>
            <div className='flex flex-col w-[250px]'>
                {
                    theaterList.map((info, index) => {
                        return (
                            <div
                                key={index}
                                className={`flex items-center gap-5 p-3 cursor-pointer hover:bg-[#ce6e0672] ${activeIndex === index ? 'bg-[#f99c00]' : ''}`}
                                onClick={() => {
                                    setActiveIndex(index)
                                    setMaHeThongRap(info.maHeThongRap);
                                }}
                            >
                                <img className='w-[50px] h-[50px]' src={info.logo} alt="" />
                                <span>{info.tenHeThongRap}</span>
                            </div>
                        )
                    })
                }
            </div>
            <div className='ml-3'>
            <MovieTheaterDetail maHeThongRap={maHeThongRap} />
            </div>
        </div>
    )
}

export default MovieTheaterList
