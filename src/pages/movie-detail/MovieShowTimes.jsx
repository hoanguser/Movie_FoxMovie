import { useEffect, useState } from 'react';
import { movieService } from '../../service/movieService';
import { cinemaService } from '../../service/cinemaService';
import { useNavigate } from 'react-router-dom';

const MovieShowTimes = ({ movieID }) => {
    const [movieShowTime, setMovieShowTime] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const uniqueDates = [];
    if (movieShowTime[activeIndex]) {
        const allTimes = movieShowTime[activeIndex]?.cumRapChieu?.flatMap(cumRap => cumRap.lichChieuPhim || []) || [];
        const datesSet = new Set(
            allTimes.map(lich => new Date(lich.ngayChieuGioChieu).toLocaleDateString("vi-VN"))
        );
        uniqueDates.push(...datesSet);
    }
    const fetchMovieShowtimes = async () => {
        try {
            const responseMovieShowtimes = await cinemaService.getMovieShowtimes(movieID);
            const data = responseMovieShowtimes.data.content;
            console.log("🚀 ~ fetchMovieShowtimes ~ data:", data)
            setMovieShowTime(data.heThongRapChieu)
        } catch (error) {
            console.log(error)
        }
    }
    const handleRedirectTicket = (showTimeID) => {
        navigate(`/ticket/${showTimeID}`);
    }
    useEffect(() => {
        fetchMovieShowtimes();
    }, [movieID])
    return (
        <div className="flex mt-5">
            <div className='flex flex-col w-[250px]'>
                {
                    movieShowTime.map((info, index) => {
                        return (
                            <div
                                key={index}
                                className={`flex items-center gap-5 p-3 cursor-pointer hover:bg-[#ce6e0672] ${activeIndex === index ? 'bg-[#f99c00]' : ''}`}
                                onClick={() => setActiveIndex(index)}
                            >
                                <img className='w-[50px] h-[50px]' src={info.logo} alt="" />
                                <span>{info.tenHeThongRap}</span>
                            </div>
                        )
                    })
                }
            </div>
            <div className="flex-1 p-4">
                <div className='grid grid-cols-7 gap-3'>
                    {uniqueDates.map(date => (
                        <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`px-3 py-1 border rounded ${selectedDate === date ? "bg-[#f99c00] text-white" : "hover:bg-[#ce6e0672]"
                                }`}
                        >
                            {date}
                        </button>
                    ))}
                </div>
                {movieShowTime[activeIndex]?.cumRapChieu.map(cumRap => {
                    const filteredTimes = cumRap.lichChieuPhim.filter(
                        lich => new Date(lich.ngayChieuGioChieu).toLocaleDateString("vi-VN") === selectedDate
                    );

                    if (filteredTimes.length === 0) return null;

                    return (
                        <div key={cumRap.maCumRap} className="mt-5 mb-5">
                            <h4 className="font-bold">{cumRap.tenCumRap}</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {filteredTimes.map(lich => (
                                    <span
                                        key={lich.maLichChieu}
                                        onClick={() => { handleRedirectTicket(lich.maLichChieu) }}
                                        className="px-3 py-1 border rounded hover:bg-[#ce6e0672] cursor-pointer"
                                    >
                                        {new Date(lich.ngayChieuGioChieu).toLocaleTimeString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default MovieShowTimes
