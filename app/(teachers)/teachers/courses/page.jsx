import React from "react";
import { Grid } from "@mui/material";
import { Masonry } from "@mui/lab";
import Coursecard from "../../../client/components/Coursecard";

async function Course() {
  // Use the full URL for server-side fetch
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  const response = await fetch(`${baseUrl}/api/teacher/display`);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  const mydata = data.courses || []; // Handle the nested structure

  return (
    <>
      <div className="pt-25 text-5xl p-6">My Courses</div>
      
      <div className=" w-90vw text-black  p-5">
        <Grid container spacing={5}>
          {mydata.map((item) => (
               <Grid item xs={12} sm={6} md={4} lg={3} key={item.course_id}>
              <Coursecard id={item.course_id} Course={item.name} />
            </Grid>
          ))}
        </Grid>
        
      </div>
    </>
  );
}

export default Course;
