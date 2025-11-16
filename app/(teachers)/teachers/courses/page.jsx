import React from "react";
import { Grid } from "@mui/material";
import { Masonry } from "@mui/lab";
import Coursecard from "../../../client/components/Coursecard";

async function Course() {
  const response = await fetch("https://jsonplaceholder.typicode.com/albums");

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const mydata = await response.json(); // FIX: await

  return (
    <>
      <div className="pt-25 text-5xl p-6">My Courses</div>
      
      <div className=" w-90vw text-black  p-5">
        <Grid container spacing={5}>
          {mydata.map((item) => (
               <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Coursecard id={item.id} Course={item.title} />
            </Grid>
          ))}
        </Grid>
        
      </div>
    </>
  );
}

export default Course;
