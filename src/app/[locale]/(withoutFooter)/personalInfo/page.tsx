"use client";

import { useEffect, useRef, useState } from "react";
import { setPersonalInfo } from "@/redux/feature/booking/bookingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Script from "next/script";

interface PersonalInfoFormData {
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  pickupLocation: string;
}

export default function PersonalInfoForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>();

  // Initialize Google Autocomplete only when script is loaded
  useEffect(() => {
    if (!scriptLoaded || !pickupInputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(pickupInputRef.current, {
      types: ["geocode"],
      componentRestrictions: { country: "AE" }, 
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        setValue("pickupLocation", place.formatted_address);
      }
    });
  }, [scriptLoaded, setValue]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    console.log("Personal Info Form Data:", data);

    dispatch(
      setPersonalInfo({
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phoneNumber,
        customer_country: data.country,
        pickup_location: data.pickupLocation,
      })
    );

    router.push("/payment");
  };

  const onPrevious = () => {
   router.back()
  };

  return (
    <>
      {/* Load Google Maps API */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  {...register("phoneNumber", { required: "Phone number is required" })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  {...register("country", { required: "Country is required" })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
              </div>

              {/* Pickup Location (Autocomplete) */}
              <div>
                <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <input
                  id="pickupLocation"
                  type="text"
                  placeholder="Search your apartment or location"
                  {...register("pickupLocation", { required: "Pickup location is required" })}
                  ref={pickupInputRef}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.pickupLocation && (
                  <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onPrevious}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Next"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
