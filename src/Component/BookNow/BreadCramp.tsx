/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  FaRegClock,
  FaUserAlt,
  FaBaby,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

const Breadcrumbs = ({ data }: any) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 py-6 bg-white shadow-md rounded-lg">
        {/* Duration */}
        <div className="flex items-start sm:items-center gap-3">
          <FaRegClock className="text-orange-500 text-3xl shrink-0" />
          <div>
            <p className="font-semibold text-gray-500 text-sm">Duration</p>
            <p className="text-base text-gray-800">{data?.duration}</p>
          </div>
        </div>

        {/* Max Adult */}
        <div className="flex items-start sm:items-center gap-3">
          <FaUserAlt className="text-orange-500 text-3xl shrink-0" />
          <div>
            <p className="font-semibold text-gray-500 text-sm">Max Adults</p>
            <p className="text-base text-gray-800">1–{data?.max_adult}</p>
          </div>
        </div>

        {/* Max Child */}
        <div className="flex items-start sm:items-center gap-3">
          <FaBaby className="text-orange-500 text-3xl shrink-0" />
          <div>
            <p className="font-semibold text-gray-500 text-sm">Min Child Age</p>
            <p className="text-base text-gray-800">1–{data?.child_min_age}</p>
          </div>
        </div>

        {/* Pickup */}
        <div className="flex items-start sm:items-center gap-3">
          <FaMapMarkerAlt className="text-orange-500 text-3xl shrink-0" />
          <div>
            <p className="font-semibold text-gray-500 text-sm">Pickup</p>
            <p className="text-base text-gray-800">{data?.pickup}</p>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-start sm:items-center gap-3">
          <FaCalendarAlt className="text-orange-500 text-3xl shrink-0" />
          <div>
            <p className="font-semibold text-gray-500 text-sm">Availability</p>
            <p className="text-base text-gray-800">
              {data?.availability?.start} - {data?.availability?.end}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;