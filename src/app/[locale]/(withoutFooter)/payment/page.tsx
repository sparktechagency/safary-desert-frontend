"use client";
import { useEffect, useState } from "react";
import { selectBooking } from "@/redux/feature/booking/bookingSlice";
import { useAppSelector } from "@/redux/hooks";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { message } from "antd";
import { useRouter } from "next/navigation";

export default function DesertBookingForm() {
  const bookingState = useAppSelector(selectBooking);
  console.log("booking state----->",bookingState);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [readonlyData, setReadonlyData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
const router = useRouter()
  const onPrevious = () => {
   router.back()
  };
  // show redux data
  useEffect(() => {
    if (bookingState) setReadonlyData(bookingState);
  }, [bookingState]);

  const handleCheckout = async () => {
    try {
      setIsSubmitting(true);

      const checkoutData = {
        item: {
          packageId:bookingState?.bookingId, // replace with dynamic id if available
          currency: readonlyData?.currency,
          customerEmail: readonlyData?.customer_email,
          price: readonlyData?.pricing?.grand_total || 0,
        },
      };

      console.log("Checkout Data →", checkoutData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/package/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(checkoutData),
        }
      );

      if (!response.ok) throw new Error("Checkout failed");
      const data = await response.json();
      console.log("Checkout Success:", data);
      message.success("Checkout successful!");
      router.push(data?.data?.url)
    } catch (error) {
      console.error("Error during checkout:", error);
      message.error("Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!readonlyData) {
    return <div className="p-6 text-gray-600">Loading booking data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white mt-16 font-nunito">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-orange-500 mb-2">
          {readonlyData.title}
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{readonlyData.location}</span>
        </div>
      </div>

      {/* Display booking info */}
      <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
        <p>
          <strong>Date:</strong> {readonlyData.date}
        </p>
        <p>
          <strong>Adults:</strong> {readonlyData.adults}
        </p>
        <p>
          <strong>Children:</strong> {readonlyData.children}
        </p>
        <p>
          <strong>Customer:</strong> {readonlyData.customer_name}
        </p>
        <p>
          <strong>Email:</strong> {readonlyData.customer_email}
        </p>
        <p>
          <strong>Phone:</strong> {readonlyData.customer_phone}
        </p>
        <p>
          <strong>Pickup Location:</strong> {readonlyData.pickup_location}
        </p>
        <p>
          <strong>Transfer option:</strong> {readonlyData.transfer_option}
        </p>
        <p>
          <strong>Currency:</strong> {readonlyData.currency}
        </p>
        {/* <p>
          <strong>Base Tour Price:</strong> AED {readonlyData.pricing?.tour_price}
        </p>
        <p>
          <strong>Additional Price:</strong> AED {readonlyData.pricing?.additional_price}
        </p> */}
        <p className="font-bold text-orange-600">
          <strong>Grand Total:</strong> AED {readonlyData.pricing?.grand_total}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6">
        <Link href="" className="flex-1">
          <button
          onClick={onPrevious}
            type="button"
            className="w-full py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors"
          >
            Previous
          </button>
        </Link>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleCheckout}
          className="flex-1 py-3 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Confirm & Checkout"}
        </button>
      </div>
    </div>
  );
}
