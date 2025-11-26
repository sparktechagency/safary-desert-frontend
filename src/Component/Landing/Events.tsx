/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Image from "next/image";

import { CircleCheckBig } from "lucide-react";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import {Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslations } from "next-intl";
import React from "react";
import { useRouter } from "next/navigation";



export default function ExclusiveArrangements({events}:any) {
    const title = useTranslations("home");
  // console.log("events----->",events);
    const router = useRouter();
    const handleNavigate = (id: string) => {
      router.push(`/events/${id}`);
    }; 
  return (
    <section className="w-full py-12 px-4 md:px-8 font-nunito">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
<div className="text-center mb-12">
  <h2
    className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-balance"
    dangerouslySetInnerHTML={{ __html: title("eventTitle") }}
  />
</div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          pagination={{ clickable: true }}
         
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="arrangements-swiper"
        >
          {events?.result?.map((arrangement:any, index:number) => (
            <SwiperSlide key={index}>
              <div className="relative font-nunito overflow-hidden rounded-2xl border-2 border-orange-400 group cursor-pointer transition-transform mb-8" onClick={()=>handleNavigate(arrangement?._id)}>
                {/* Background Image and Gradient */}
                <div className="relative h-80 md:h-96">
                  <Image
                    src={arrangement.image}
                    alt={arrangement.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-[#FB5A10] opacity-70" />
                </div>

                {/* Content Overlay */}
                <div className="w-full justify-center items-center absolute inset-0 p-6 flex flex-col ">
                  {/* Title */}
                  <div>
                    <div className="rounded-lg px-4 py-2 inline-block">
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{arrangement.title}</h3>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="space-y-4">  
                    {/* Timing */}
                    <div className="bg-[#FECCB5] backdrop-blur-sm rounded-lg px-4 py-2 text-center border border-orange-300/30">
                      <p className="font-semibold text-black">{arrangement.start_time} to {arrangement.end_time}</p>
                    </div>

                    {/* Pricing */}
                    <div className="bg-[#FFFFFF] backdrop-blur-sm rounded-lg px-4 py-2 text-center border border-orange-300/30 ">
                      <p className="font-semibold text-black">Adult {arrangement.max_adult} - Child {arrangement.max_child}</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {arrangement.features.map((feature:any, featureIndex:number) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <div className="rounded px-2 py-1 flex items-center gap-2 w-full">
                            <p className="text-sm font-medium text-white flex gap-3">
                              <CircleCheckBig />  {feature}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
