/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Image from "next/image"


import { useTranslations } from "next-intl"
import { use } from "react";
import { useRouter } from "next/navigation";


export default function DesertSafariActivities({activities}:any) {
  // console.log("activities------->",activities);
  const title = useTranslations("home");
  const router = useRouter();
  const handleNavigate = (id: string) => {
    router.push(`/activity/${id}`);
  };  
  return (
    <div className="max-w-7xl px-5 mx-auto mb-5 font-nunito">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-foreground">
       {title("activitiesTitle")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {activities?.result?.map((activity:any) => (
          <div
            key={activity?._id}
            onClick={()=>handleNavigate(activity?._id)}
            className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="aspect-[4/3] relative">
              <Image
                src={activity?.image || "/placeholder.svg"}
                alt={activity?.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            </div>
            <div className="p-3 md:p-4">
              <h3 className="text-sm md:text-base font-medium text-card-foreground text-center">{activity?.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
