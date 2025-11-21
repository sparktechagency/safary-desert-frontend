/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Pagination } from "antd";
import { MountainSnow, Phone } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import HeroSection from "./Hero";
import { useRouter } from "next/navigation";

export default function Packages({ packages, setFilters }: any) {
  const [selectedActivity, setSelectedActivity] = useState("");
  const [adults, setAdults] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [page, setPage] = useState(1);

  console.log("packages------->", packages);

  const meta = packages?.meta;
  // Use the 'limit' from meta for dynamic items per page
  const limit = meta?.limit;
  const totalItems = meta?.total;

  // Calculate current items to show based on page and limit

  const currentItems = packages?.result;

  //  handle page change
  const onPageChange = (page: number) => {
    setPage(page);
    setFilters((prev: any) => ({ ...prev, page }));
  };

  //  handle filter apply (e.g. when search button clicked)
  const handleSearch = () => {
    setFilters({
      activity: selectedActivity,
      availability: selectedDate,
      child_min_age: childCount,
      max_adult: adults,
      page: 1,
      limit,
    });
  };

const router = useRouter()

const handleNavigate=(id:string)=>{
  router.push(`/bookNow/${id}`)
}


  return (
    <div>
      <HeroSection
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
        adults={adults}
        setAdults={setAdults}
        childCount={childCount}
        setChildCount={setChildCount}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleSearch={handleSearch}
      />
      <section className="pb-8 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {currentItems?.map((tour: any) => (
              <div
                key={tour.id}
                onClick={()=>handleNavigate(tour?._id)}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:cursor-pointer"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Section */}
                  <div className="md:w-1/3 relative h-64 md:h-auto">
                    <Image
                      src={tour.coverImage}
                      alt={tour.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-3 leading-tight">
                        {tour.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {tour.description}
                      </p>

                      {/* Activities List */}
                      {tour?.activity?.length > 0 && (
                        <div className="flex items-center flex-wrap gap-2 mb-4">
                          <MountainSnow className="h-5 w-5 text-orange-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700">
                            {tour?.activity.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pricing and Actions */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                          {tour.discount ? tour?.discount : 0}% OFF
                        </span>
                        <span className="text-gray-400 line-through text-sm">
                          {tour?.original_price?.amount}
                        </span>
                        <span className="text-2xl font-bold text-gray-900">
                          {tour?.discount_price?.amount}
                        </span>
                        <span className="text-sm text-gray-500">
                          / Person + VAT
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link href={`/bookNow/${tour?._id}`}>
                          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                            Book Now
                          </button>
                        </Link>
                        <Link href={"https://web.whatsapp.com/"}>
                          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4" />
                            WhatsApp
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <Pagination
              current={page}
              pageSize={limit}
              total={totalItems}
              onChange={onPageChange}
              showSizeChanger={false}
              // Show the total number of pages (meta.totalPage)
              pageSizeOptions={[limit?.toString()]}
              className="[&_.ant-pagination-item-active]:bg-orange-500 [&_.ant-pagination-item-active]:border-orange-500 [&_.ant-pagination-item-active_a]:text-white [&_.ant-pagination-item]:border-gray-300 [&_.ant-pagination-item_a]:text-gray-600 [&_.ant-pagination-prev]:text-gray-600 [&_.ant-pagination-next]:text-gray-600"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
