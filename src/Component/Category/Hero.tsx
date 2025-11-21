/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Calendar, ChevronDown,MountainSnow, Search, User } from "lucide-react"
import { Modal } from "antd" // Import Ant Design Modal and Button
import scene from '@/assests/scene.jpg'
import { useTranslations } from "next-intl";
// src/types/activity.ts
export enum Activity {
  DUNE_BASHING = "Dune Bashing",
  CAMEL_RIDE = "Camel Ride",
  QUAD_BIKING = "Quad Biking",
  DUNE_BUGGY_RIDE = "Dune Buggy Ride",
  TEA_COFFEE_SOFT_DRINKS = "Tea, Coffee, & Soft Drinks",
  HENNA_TATTOOS = "Henna Tattoos",
  FIRE_SHOW = "Fire Show in the Desert",
  ARABIC_COSTUMES = "Arabic Costumes",
  SHISHA_SMOKING = "Shisha Smoking",
  FALCON_PICTURES = "Falcon To Take Pictures",
  SAND_BOARDING = "Sand-Boarding",
  BELLY_DANCE_SHOW = "Belly Dance Show",
}

export default function HeroSection({setIsModalVisible,isModalVisible,setSelectedDate,selectedDate,setChildCount,childCount,setAdults,adults,setSelectedActivity,selectedActivity,handleSearch}:any) {
  const title = useTranslations("category");
  const nav = useTranslations("nav");

  // Show modal
  const showModal = () => {
    setIsModalVisible(true)
  }

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // Increment/Decrement logic
  const incrementAdults = () => setAdults(adults + 1)
  const decrementAdults = () => setAdults(adults > 0 ? adults - 1 : 0)

  const incrementChildren = () => setChildCount(childCount + 1)
  const decrementChildren = () => setChildCount(childCount > 0 ? childCount - 1 : 0)

  return (
    <section className="relative h-screen w-full overflow-hidden font-nunito">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat h-[600px]"
        style={{
          backgroundImage: `url(${scene.src})`,
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Main Heading */}
        <h1 className="mb-4 text-4xl font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
      {title("title")}
        </h1>

        {/* Breadcrumb */}
        <nav className="mb-16 flex items-center space-x-2 text-lg">
          <span className="text-white">{nav("home")}</span>
          <span className="text-white">{">"}</span>
          <span className="text-orange-500 font-bold">{nav("category")}</span>
        </nav>

        {/* Booking Form */}
        <div className="w-full  max-w-5xl relative top-12">
          <div className="flex flex-col py-5 gap-0 rounded-lg bg-white shadow-xl md:flex-row">
            {/* Activity Selection */}
            <div className="flex flex-1 items-center gap-3 border-b border-gray-200 p-4 md:border-b-0 md:border-r">
             <MountainSnow className="h-6 w-6 text-orange-500" />
                <label className="block text-sm font-medium text-gray-700 border-gray-400 border-r-1 px-3">Activity</label>
              <div className="flex-1">
                <div className="relative">
             <select
        value={selectedActivity}
        onChange={(e) => setSelectedActivity(e.target.value)}
        className="w-full appearance-none bg-transparent text-gray-600 focus:outline-none px-3 hover:cursor-pointer"
      >
        <option value="">Select Activity</option>
        {Object.values(Activity).map((activity) => (
          <option key={activity} value={activity}>
            {activity}
          </option>
        ))}
      </select>
                  <ChevronDown className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 " />
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="flex flex-1 items-center gap-3 border-b border-gray-200 p-4 md:border-b-0 md:border-r">
              <Calendar className="h-6 w-6 text-orange-500 " />
                <label className="block text-sm font-medium text-gray-700 border-gray-400 border-r-1 px-3">Dates</label> 
              <div className="flex-1">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  placeholder="DD-MM-YYYY"
                  className="w-full bg-transparent text-gray-600 focus:outline-none hover:cursor-pointer"
                />
              </div>
            </div>

            {/* Guests Button */}
            <div className="flex flex-1 items-center gap-3 border-b border-gray-200 p-4 md:border-b-0 md:border-r">
              <User className="h-6 w-6 text-orange-500" />
                <label className="block text-sm font-medium text-gray-700 border-gray-400 border-r-1 px-3">Guests</label>
              <div className="flex-1">
                <div className="relative">
                  <button
                    onClick={showModal}
                    className="w-full text-gray-600 focus:outline-none hover:cursor-pointer"
                  >
                    Select Guests
                  </button>
                  <ChevronDown className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-center justify-center p-2">
              <button    onClick={handleSearch} className="h-12 w-full rounded-md bg-orange-500 px-8 text-white hover:bg-orange-600 md:w-auto hover:cursor-pointer">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ant Design Modal for Guest Selection */}
      <Modal
        title="Select Guests"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
<div className="flex flex-col gap-6">
  {/* Adults Selection */}
  <div className="flex justify-between gap-5 items-center"> 
    <span className="text-md  text-black"><span className="font-bold">Adults</span> <br />  (Age 12+)</span>
    <div className="flex items-center gap-4">
      <button
        onClick={decrementAdults}
        className="text-orange-500 text-xl w-8 h-8 flex justify-center items-center border border-orange-500 rounded-full hover:bg-orange-100"
      >
        -
      </button>
      <span className="text-xl">{adults}</span>
      <button
        onClick={incrementAdults}
        className="text-orange-500 text-xl w-8 h-8 flex justify-center items-center border border-orange-500 rounded-full hover:bg-orange-100"
      >
        +
      </button>
    </div>
  </div>

  {/* Children Selection */}
  <div className="flex justify-between gap-5 items-center">
    <span className="text-md  text-black"><span className="font-bold">Children</span> <br /> (Age 3-11)</span>
    <div className="flex items-center gap-4">
      <button
        onClick={decrementChildren}
        className="text-orange-500 text-xl w-8 h-8 flex justify-center items-center border border-orange-500 rounded-full hover:bg-orange-100"
      >
        -
      </button>
      <span className="text-xl text-black">{childCount}</span>
      <button
        onClick={incrementChildren}
        className="text-orange-500 text-xl w-8 h-8 flex justify-center items-center border border-orange-500 rounded-full hover:bg-orange-100"
      >
        +
      </button>
    </div>
  </div>

  {/* Save Button */}
  <div className="flex justify-end mt-6">
    <button
      onClick={handleCancel}
      className="bg-orange-500 text-white py-1 px-5 rounded-full text-lg hover:bg-orange-600 transition-colors"
    >
      Done
    </button>
  </div>
</div>


      </Modal>
    </section>
  )
}
