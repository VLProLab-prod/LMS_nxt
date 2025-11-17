"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { Card, Grid } from "@mui/material";


const Coursecard = ({ id, Course, unitCount, topicCount }) => {
  const router = useRouter();
  return (
    <Card>
    <div className="bg-white w-80 border-l-4 border-t-2 border-r-2 border-b-2 border-r-gray-200 border-t-gray-200 border-b-gray-200 border-blue-500 h-88 text-black p-4 rounded-lg flex flex-col">

      {/* CONTENT */}
      <div className="grow">
                <h2 className="text-2xl mt-2 text-black line-clamp-3">{Course}</h2>
        <h3 className="font-bold text-black text-sm">ID: {id}</h3>
         {/* Cards */}
          <div className="">
        <Grid container spacing={2} direction="row">
          <Grid item xs={6}>
            <Card>
             <div className="w-30 h-25 justify-center text-gray-600 text-left px-2 py-2 bg-blue-400/20">Units<br/>{unitCount || 0}</div>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
            <div className="w-30 h-25 justify-center text-gray-600 text-left px-2 py-2 bg-lime-400/20">Topics<br/>{topicCount || 0}</div>
            </Card>
          </Grid>
        </Grid>
      </div>
      </div>
    
      {/* BUTTON AREA (Right Bottom) */}
      <div className="flex justify-end mt-4">
        <button className="rounded-lg text-white bg-gray-800 py-2 px-2 w-30 text-center" onClick={()=>router.push(`/teachers/courses/${id}`)}>
          Learn More
        </button>
      </div>
    </div>
    </Card>
  );
};

export default Coursecard;
