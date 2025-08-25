import React from 'react'
import CarouselMovie from './components/CarouselMovie'
import ListMovie from './components/ListMovie'
import Section from '../../HOC/Section'
import MovieTheaterList from './components/MovieTheaterList'

const HomePage = () => {
  return (
    <>
      <CarouselMovie />
      <Section titleSection={"Danh Sách Phim"}>
        <ListMovie />
      </Section>
      <Section titleSection={"Danh Sách Rạp"}>
        <MovieTheaterList />
      </Section>
    </>
  )
}

export default HomePage
