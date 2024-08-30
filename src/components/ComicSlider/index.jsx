import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ComicCard from './../ComicCard';
import { fetchNewComics, saveIdComics } from '../../services/comicService';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ComicSlider = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const comics = await fetchNewComics();
        await saveIdComics(comics)
        setComics(comics);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <FaChevronRight color='black' />,
    prevArrow: <FaChevronLeft color='black'/>,
  };

  if (loading) return <p className='text-center'>Loading...</p>;
  if (error) return <p className='text-center'>Error: {error.message}</p>;

  return (
    <div className="relative z-0">
      <Slider {...settings} className="space-x-4">
        {comics.map((comic, i) => (
          <div key={i} className="">
            <ComicCard comic={comic} slider={true}/>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ComicSlider;
