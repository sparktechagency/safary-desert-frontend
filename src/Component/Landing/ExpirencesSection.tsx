/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useTranslations } from "next-intl";

type ExperiencesSectionProps = {
  packages: {
    result: {
      _id: string;
      title: string;
      description: string;
      coverImage: string;
      discount: number;
      original_price: { amount: string };
      discount_price: { amount: string };
    }[];
  };
};

export default function ExperiencesSection({ packages }: ExperiencesSectionProps) {
  const t = useTranslations("buttons");
  const title = useTranslations("home");

  return (
    <>
      {/* SEO Head Tag (only 1, dynamic generation for all is not optimal) */}
      <Head>
        <title>{title("experiencesTitle")} - Wanderlust Adventures</title>
        <meta
          name="description"
          content="Best desert safari and travel experiences in Dubai - Book your adventure with Wanderlust Adventures"
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <section className="py-16 px-4 md:px-6 lg:px-8 font-nunito overflow-hidden w-full mb-5">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            {title("experiencesTitle")}
          </h2>

          {/* Swiper Slider */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              navigation={{
                prevEl: ".swiper-button-prev-custom",
                nextEl: ".swiper-button-next-custom",
              }}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet !bg-orange-500",
                bulletActiveClass: "swiper-pagination-bullet-active !bg-orange-600",
              }}
              breakpoints={{
                480: { slidesPerView: 1, spaceBetween: 20 },
                640: { slidesPerView: 1.2, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
                1440: { slidesPerView: 4, spaceBetween: 30 },
              }}
              className="experiences-swiper"
            >
              {packages?.result.map((experience) => (
                <SwiperSlide key={experience._id}>
                  <div className="rounded-2xl shadow-md h-full flex flex-col overflow-hidden bg-white transition-transform hover:scale-[1.01] duration-300">
                    {/* Image */}
                    <div className="relative h-56 md:h-64 lg:h-72 w-full">
                      <Image
                        src={experience.coverImage}
                        alt={experience.title}
                        layout="fill"
                        className="object-cover w-full h-full"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-orange-500 mb-2">
                        {experience.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                        {experience.description}
                      </p>

                      {/* Prices */}
                      <div className="flex flex-wrap gap-2 items-center text-sm mb-4">
                        <span className="bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                          {experience.discount || 0}% OFF
                        </span>
                        <span className="line-through text-gray-400">
                          {experience?.original_price?.amount}
                        </span>
                        <span className="text-orange-600 font-semibold text-base">
                          {experience?.discount_price?.amount}
                        </span>
                        <span className="text-gray-500 text-sm">/ Person + VAT</span>
                      </div>

                      {/* CTAs */}
                      <div className="flex gap-2 mt-auto w-full">
                        {/* Book Now */}
                        <Link href={`/bookNow/${experience._id}`} className="flex-1">
                          <span className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition duration-200">
                            {t("bookNow")}
                          </span>
                        </Link>

                        {/* WhatsApp */}
                        <a
                          href="https://wa.me/971000000000" // replace with your business number
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 block text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                        >
                          {t("whatsapp")}
                        </a>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Arrows */}
            <button
              className="swiper-button-prev-custom absolute left-0 top-1/2 z-10 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
              aria-label="Previous slide"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="swiper-button-next-custom absolute right-0 top-1/2 z-10 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
              aria-label="Next slide"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}