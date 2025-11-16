"use client"

import React from "react";
import { useRouter } from "next/navigation";

const Coursecard = ({ id, Course }) => {
  const router = useRouter();
  return (
    <div className="bg-white w-80 border-2 border-gray-300 h-88 text-black p-4 rounded-lg flex flex-col">

      {/* CONTENT */}
      <div className="grow">
        <h3 className="font-bold text-black text-sm">ID: {id}</h3>
        <p className="text-sm mt-2 text-black line-clamp-3">{Course}</p>
      </div>

      {/* BUTTON AREA (Right Bottom) */}
      <div className="flex justify-end mt-4">
        <button className="rounded-lg text-white bg-gray-800 py-2 px-2 w-30 text-center" onClick={()=>router.push(`/teachers/courses/${id}`)}>
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Coursecard;
