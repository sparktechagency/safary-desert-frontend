import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

/* ---------- Types ---------- */
export interface Availability {
  start: string;
  end: string;
}

export interface SelectedTourOption {
  id: string | number;
  name: string;
  amount: number;
  currency: string;
  quantity: number; // >= 1
  selected: true;
}

export interface Pricing {
  tour_price: number;
  additional_price: number;

  total_before_discount: number;
  discount_percent: number;
  discount_amount: number;

  grand_total: number;
}


export interface SetBookingPayload {
  // from data (params)
  bookingId:string
  title: string;
  images: string[];
  location: string;
  availability?: Availability; // optional
  drop_off?: string;
  pickup?: string;

  // from form
  date: string;
  adults: number;
  children: number;
  currency: string;
  tour_options: SelectedTourOption[];
transfer_option:string;
  // totals
  pricing: Pricing;
    // NEW: personal info (keep optional so you can set later)
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_country?: string;
  pickup_location?: string;
}

export type BookingState = SetBookingPayload;

/* ---------- Initial ---------- */
const initialState: BookingState = {
  bookingId:"",
  title: "",
  images: [],
  location: "",
  availability: undefined, // since it's optional
  drop_off: "",
  pickup: "",

  date: "",
  adults: 1,
  children: 0,
  transfer_option:"",
  currency: "AED",
  tour_options: [],
pricing: { 
  tour_price: 0, 
  additional_price: 0, 
  total_before_discount: 0,
  discount_percent: 0,
  discount_amount: 0,
  grand_total: 0 
},

 // personal info defaults (empty)
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  customer_country: "",
  pickup_location: "",



};

/* ---------- Slice ---------- */
const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBooking: (_state, action: PayloadAction<SetBookingPayload>) => action.payload,
     setPersonalInfo: (
      state,
      action: PayloadAction<{
        customer_name?: string;
        customer_email?: string;
        customer_phone?: string;
        customer_country?: string;
        pickup_location?: string;
      }>
    ) => {
      const p = action.payload;
      if (p.customer_name !== undefined) state.customer_name = p.customer_name;
      if (p.customer_email !== undefined) state.customer_email = p.customer_email;
      if (p.customer_phone !== undefined) state.customer_phone = p.customer_phone;
      if (p.customer_country !== undefined) state.customer_country = p.customer_country;
      if (p.pickup_location !== undefined) state.pickup_location = p.pickup_location;
    },
    resetBooking: () => initialState,
  },
});

export const { setBooking, resetBooking,setPersonalInfo } = bookingSlice.actions;
export const selectBooking = (state: RootState) => state.booking;
export default bookingSlice.reducer;
