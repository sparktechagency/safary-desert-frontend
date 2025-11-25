/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { FaCalendarAlt, FaMinus, FaPlus } from "react-icons/fa";
import { useAppDispatch } from "@/redux/hooks";
import { setBooking } from "@/redux/feature/booking/bookingSlice";
import { useRouter } from "next/navigation";

// ---------- Types ----------
type Availability = { start: string; end: string };

type IncomingTourOption = {
  id?: string;
  name: string;
  amount: number;
  currency?: string;
  quantity?: number;
};

type PackageDataFromParams = {
  _id: string;
  base_price?: number;
  currency?: string;
  activityIncluded?: IncomingTourOption[];

  title?: string;
  images?: string[];
  location?: string;
  availability?: Availability;
  drop_off?: string;
  pickup?: string;

  discount?: number;
  discount_price?: { amount?: number };
};

type BookProps = { data?: PackageDataFromParams };

type FormTourOption = {
  id?: string;
  name: string;
  amount: number;
  currency: string;
  selected: boolean;
  quantity: number;
};

type FormValues = {
  date: string;
  adults: number;
  children: number;
  basePrice: number;
  currency: string;
  activityIncluded: FormTourOption[];
  transfer_option: string;
};

// ---------- Helpers ----------
const formatPrice = (amount: number, currencyCode: string) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode || "AED",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode || "AED"} ${amount.toFixed(2)}`;
  }
};

// ---------- Component ----------
export default function Book({ data }: BookProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
console.log("data---->",data?.activityIncluded);
  const basePrice = Number(data?.base_price ?? 2500);
  const currency = data?.currency ?? "AED";
  const tourOptionsData = data?.activityIncluded ?? [];

  const { control, handleSubmit, watch, setValue, getValues } =
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: {
        date: "2025-07-04",
        adults: 1,
        children: 0,
        basePrice,
        currency,
        activityIncluded: tourOptionsData.map((t, idx) => ({
          id: String(t.id ?? idx),
          name: t.name,
          amount: Number(t.amount ?? 0),
          currency: t.currency ?? currency,
          selected: false,
          quantity: Math.max(1, Number(t.quantity ?? 1)),
        })),
         transfer_option: "sharing",
      },
    });

  const { fields, update } = useFieldArray({ control, name: "activityIncluded" });

  // Watchers
  const adults = watch("adults");
  const children = watch("children");
  const formCurrency = watch("currency");
  const watchedOptions = watch("activityIncluded");

  const selectedOptions = useMemo(
    () => watchedOptions.filter((o) => o.selected),
    [watchedOptions]
  );

  const hasSelectedOption = useMemo(
    () => selectedOptions.length > 0,
    [selectedOptions]
  );

  // Totals
  const tourTotal = useMemo(
    () => selectedOptions.reduce((sum, o) => sum + Number(o?.amount || 0), 0),
    [selectedOptions]
  );

  const additionTotal = useMemo(
    () =>
      selectedOptions.reduce((sum, o) => {
        const qty = Math.max(1, Number(o.quantity ?? 1));
        return sum + (qty - 1) * Number(o.amount || 0);
      }, 0),
    [selectedOptions]
  );

  const discountPercent = Number(data?.discount ?? 0);

  const totalBeforeDiscount = useMemo(
    () => tourTotal + additionTotal,
    [tourTotal, additionTotal]
  );

  const discountAmount = useMemo(
    () => (totalBeforeDiscount * discountPercent) / 100,
    [totalBeforeDiscount, discountPercent]
  );

  const amountAfterDiscount = useMemo(
    () => Math.max(0, totalBeforeDiscount - discountAmount),
    [totalBeforeDiscount, discountAmount]
  );

  // Counters
  const incDecCounter = (field: "adults" | "children", delta: number) => {
    const curr = getValues(field);
    const next =
      field === "adults"
        ? Math.max(1, curr + delta)
        : Math.max(0, curr + delta);
    setValue(field, next, { shouldValidate: true, shouldDirty: true });
  };

  // Option handlers
  const toggleOption = (index: number) => {
    const item = getValues(`activityIncluded.${index}`);
    update(index, { ...item, selected: !item.selected });
  };

  const changeQty = (index: number, delta: number) => {
    const item = getValues(`activityIncluded.${index}`);
    if (!item.selected) return;
    const currentQty = Math.max(1, Number(item.quantity ?? 1));
    const nextQty = Math.max(1, currentQty + delta);
    update(index, { ...item, quantity: nextQty });
  };

  const dateRef = useRef<HTMLInputElement | null>(null);
  const openNativeDatepicker = () => {
    const el = dateRef.current;
    if (!el) return;
    const anyEl = el as HTMLInputElement & { showPicker?: () => void };
    if (typeof anyEl.showPicker === "function") anyEl.showPicker();
    else el.focus();
  };

  // ---------- Submit ----------
  const onSubmit = (values: FormValues) => {
    console.log("value",values);
    const selectedOnly = values.activityIncluded
      .filter((o) => o.selected)
      .map(({ id, name, currency, quantity }) => ({
         id: String(id),
        name,
        // ✅ send discounted amount
        amount: Number(amountAfterDiscount || 0),
        currency: currency || values.currency,
        quantity: Math.max(1, Number(quantity ?? 1)),
        selected: true as const,
      }));

    const tour_price = selectedOnly.reduce((sum, o) => sum + o.amount, 0);
    const additional_price = selectedOnly.reduce(
      (sum, o) => sum + (o.quantity - 1) * o.amount,
      0
    );

    const total_before_discount = tour_price + additional_price;
    const discount_percent = Number(data?.discount ?? 0);
    const discount_amount = (total_before_discount * discount_percent) / 100;

    const grand_total =
      Number(amountAfterDiscount) > 0
        ? amountAfterDiscount
        : Math.max(0, total_before_discount - discount_amount);

    dispatch(
      setBooking({
        bookingId: data?._id ?? "",
        title: data?.title ?? "",
        images: Array.isArray(data?.images) ? data.images : [],
        location: data?.location ?? "",
        availability: data?.availability
          ? { start: data.availability.start, end: data.availability.end }
          : undefined,
        drop_off: data?.drop_off ?? "",
        pickup: data?.pickup ?? "",

        date: values.date,
        adults: values.adults,
        children: values.children,
        currency: values.currency,
        activityIncluded:selectedOnly,
transfer_option:values.transfer_option,
        pricing: {
          tour_price,
          additional_price,
          total_before_discount,
          discount_percent,
          discount_amount,
          grand_total,
        },
      })
    );

    router.push("/personalInfo");
  };

  // ---------- JSX ----------
  return (
    <form
      className="max-w-7xl mx-auto p-4 bg-white"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Header */}
      <div className="bg-pink-50 p-4 rounded-lg mb-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Book VIP Desert Safari Dubai
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          {/* Date */}
          <div>
            <label
              htmlFor="booking-date"
              className="block text-sm text-gray-600 mb-1"
            >
              Select Your Date
            </label>
            <div className="relative">
              <Controller
                control={control}
                name="date"
                rules={{ required: "Select a date" }}
                render={({ field }) => (
                  <input
                    type="date"
                    id="booking-date"
                    {...field}
                    ref={(el) => {
                      field.ref(el);
                      dateRef.current = el;
                    }}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    aria-invalid={!field.value ? "true" : "false"}
                  />
                )}
              />
              <button
                type="button"
                onClick={openNativeDatepicker}
                className="absolute right-2 top-2.5 text-gray-400 text-sm"
                aria-label="Open calendar"
              >
                <FaCalendarAlt className="text-sm" />
              </button>
            </div>
          </div>
          {/* Transfer Option */}
          <div>
            <label
              htmlFor="transfer-option"
              className="block text-sm text-gray-600 mb-1"
            >
              Transfer Option
            </label>
            <Controller
              control={control}
              name="transfer_option"
              defaultValue=""
              rules={{ required: "Please select a transfer option" }}
              render={({ field }) => (
                <select
                  id="transfer-option"
                  {...field}
                  className="w-full p-2 border border-gray-300 rounded text-sm bg-pink-50 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="">Select Option</option>
                  <option value="sharing">Sharing Transfers</option>
                  <option value="private">Private Transfers</option>
                </select>
              )}
            />
          </div>

          {/* Adults */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              No of Adults
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                type="button"
                onClick={() => incDecCounter("adults", -1)}
                className="p-2 hover:bg-gray-100"
              >
                <FaMinus className="text-xs" />
              </button>
              <span className="px-3 py-2 text-sm">{adults}</span>
              <button
                type="button"
                onClick={() => incDecCounter("adults", +1)}
                className="p-2 hover:bg-gray-100"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              No of Child (1–11 yrs)
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                type="button"
                onClick={() => incDecCounter("children", -1)}
                className="p-2 hover:bg-gray-100"
              >
                <FaMinus className="text-xs" />
              </button>
              <span className="px-3 py-2 text-sm">{children}</span>
              <button
                type="button"
                onClick={() => incDecCounter("children", +1)}
                className="p-2 hover:bg-gray-100"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>
          </div>
          {/* Base Price */}
          <div className="ml-5">
            <p className="block text-sm text-gray-600 mb-1">Base Price</p>
            <p className="text-xl font-bold text-orange-500 ">
              AED {data?.discount_price?.amount}
            </p>
          </div>
        </div>
      </div>

      {/* Tour Options */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-orange-500 mb-4">
          Customize Tour Options
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="font-semibold">Tour Option</div>
          <div className="font-semibold text-center">Quantity</div>
          <div className="font-semibold text-right">Line Total</div>
        </div>

        {/* <div className="space-y-3 mt-3">
          {fields.map((field, idx) => {
            const opt = watchedOptions[idx];
            const qty = Math.max(1, Number(opt?.quantity ?? 1));
            const perLineTotal = qty * (opt?.amount ?? 0);
            const disabled = !opt?.selected;

            return (
              <div
                key={field.id}
                className={`grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 ${
                  disabled ? "opacity-80" : ""
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!!opt?.selected}
                    onChange={() => toggleOption(idx)}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">{opt?.name}</div>
                    <div className="text-orange-500 text-xs">Package Details</div>
                    <div className="text-xs text-gray-500">
                      Price per {opt?.name}:{" "}
                      {formatPrice(opt?.amount ?? 0, opt?.currency ?? formCurrency)}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div
                    className={`flex items-center justify-center border border-gray-300 rounded w-28 mx-auto ${
                      disabled ? "bg-gray-50" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => changeQty(idx, -1)}
                      className={`p-1 hover:bg-gray-100 ${
                        disabled ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="px-2 py-1 text-sm min-w-6 text-center">{qty}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(idx, +1)}
                      className={`p-1 hover:bg-gray-100 ${
                        disabled ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>

                <div className="text-right font-semibold">
                  {formatPrice(perLineTotal, opt?.currency ?? formCurrency)}
                  {!opt?.selected && (
                    <span className="block text-xs font-normal text-gray-500">
                      not included in totals
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div> */}
        <div className="space-y-3 mt-3">
          {fields.map((field, idx) => {
            const opt = watchedOptions[idx];
            const qty = Math.max(1, Number(opt?.quantity ?? 1));
            const perLineTotal = qty * (opt?.amount ?? 0);

            const displayName = opt?.name ? opt.name.replace(/_/g, " ") : "";

            return (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-2 border-b border-gray-100"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!!opt?.selected}
                    onChange={() => toggleOption(idx)}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">{displayName}</div>
                    <div className="text-orange-500 text-xs">
                      Package Details
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center border border-gray-300 rounded w-28 mx-auto">
                    <button
                      type="button"
                      onClick={() => changeQty(idx, -1)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="px-2 py-1 text-sm min-w-6 text-center">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQty(idx, +1)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-3">
                    Price per {displayName}:{" "}
                    {formatPrice(
                      opt?.amount ?? 0,
                      opt?.currency ?? formCurrency
                    )}
                  </div>
                </div>

                <div className="text-right font-semibold">
                  {formatPrice(perLineTotal, opt?.currency ?? formCurrency)}
                  {!opt?.selected && (
                    <span className="block text-xs font-normal text-gray-500">
                      not included in totals
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 py-4 bg-gray-50 rounded">
          <div className="text-center">
            <div className="text-sm text-gray-600">Tour Total</div>
            <div className="text-xl font-bold text-orange-500">
              {formatPrice(tourTotal, formCurrency)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600">Additional Price</div>
            <div className="text-xl font-bold text-orange-500">
              {formatPrice(additionTotal, formCurrency)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-xl font-bold text-orange-500">
              {formatPrice(totalBeforeDiscount, formCurrency)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600">Grand Total</div>
            <div className="text-xl font-bold text-orange-500">
              {formatPrice(
                !amountAfterDiscount || amountAfterDiscount === 0
                  ? data?.discount_price?.amount ?? 0
                  : amountAfterDiscount,
                formCurrency
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center items-center flex-col sm:flex-row gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setValue("date", "2025-07-04");
              setValue("adults", 1);
              setValue("children", 0);
              watchedOptions.forEach((_, i) =>
                update(i, {
                  ...getValues(`activityIncluded.${i}`),
                  selected: false,
                  quantity: 1,
                })
              );
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!hasSelectedOption}
            className={`px-6 py-2 rounded text-white transition-colors ${
              hasSelectedOption
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Book Now
          </button>
        </div>
      </div>
    </form>
  );
}
