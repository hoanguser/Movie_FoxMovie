import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    listMovie: [],
    movieDetail: null,
}

const movieSlice = createSlice({
    name: "movieSlice",
    initialState,
    reducers: {
        setListMovieAction: (state, action) => {
            state.listMovie = action.payload;
        },
        setMovieDetailAction: (state, action) => {
            state.movieDetail = action.payload;
        }
    }
});

export const { setListMovieAction, setMovieDetailAction } = movieSlice.actions
export default movieSlice.reducer