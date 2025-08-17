"use client";

import React, { useEffect, useState } from "react";

// Swiper components, modules and styles
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export default function App() {
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroImages() {
      try {
        const res = await fetch("/api/homepage/hero");
        const data = await res.json();


        if (data && data.length) {
          console.log("Parsed hero images:", data);
          const images = data;
          
          setHeroImages(images);
        } else {
          setHeroImages([]);
        }
      } catch (err) {
        setHeroImages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchHeroImages();
  }, []);

  return (
    <Swiper
      navigation={true}
      pagination={{ type: "bullets", clickable: true }}
      autoplay={true}
      loop={true}
      modules={[Autoplay, Navigation, Pagination]}
      className="homepage-hero-swiper"
      style={{ height: "100vh" }}
    >
      {loading ? (
        <SwiperSlide>Loading...</SwiperSlide>
      ) : heroImages.length > 0 ? (
        heroImages.map((img, idx) => (
          console.log("img:", img),
          <SwiperSlide key={idx}>
            <Image src={img.filePath} alt={img.originalName} layout="fill" objectFit="cover" />
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide>No images found</SwiperSlide>
      )}
    </Swiper>
  );
}