"use client";

import React, { useEffect, useState } from "react";

// Swiper components, modules and styles
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import HomeSlider from "@/components/common/loading/homeSlider";

export default function App() {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    async function fetchHeroImages() {
      try {
        const res = await fetch("/api/homepage/hero");
        const data = await res.json();

        if (data && data.length) {
          setHeroImages(data);
        } else {
          setHeroImages([]);
        }
      } catch (err) {
        setHeroImages([]);
      } finally {
        // Ensure skeleton shows for at least 1500ms
        timeoutId = setTimeout(() => setLoading(false), 1500);
      }
    }
    fetchHeroImages();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (loading) {
    return <HomeSlider />;
  }

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
      {heroImages.length > 0 ? (
        heroImages.map((img, idx) => (
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