/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import { Calendar1Icon } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import hillCar from '@/assests/hill-car.jpg';
import { getSingleActivity } from '@/utils/api/api';




function formatDate(d?: string) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}


export default async function ActivityDetails({ params }: any) {
  const { id } = params;
  const activity = await getSingleActivity(id);
// console.log("single Activity------>",activity);
  const title = activity?.data?.title
  const date = formatDate(activity?.data?.createdAt);
  const remoteImage =activity?.data?.image;
  const articleHtml = activity?.data?.description ?? '';

  const safeHtml = DOMPurify.sanitize(articleHtml);

  return (
    <div className="max-w-screen-xl mx-auto p-5 font-nunito">
      <header>
        <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
          {/* If remote url exists use it, else fallback image */}
          {remoteImage ? (
            <Image
              src={remoteImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <Image
              src={hillCar}
              alt={title}
              fill
              className="object-cover"
              priority
              placeholder="blur"
            />
          )}
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl mt-5 font-semibold">{title}</h1>
          <div className="flex gap-3 items-center">
            <Calendar1Icon className="text-[#FB5A10]" />
            <p className="text-sm md:text-lg mt-2">{date}</p>
          </div>
        </div>
      </header>

      <section className="mt-10 space-y-8 text-lg text-gray-800">
        {safeHtml ? (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        ) : (
          <p>No content available.</p>
        )}
      </section>
    </div>
  );
}
