import React from "react";
import { Grid, Typography, Box, Card, CardContent, Chip } from "@mui/material";
import Coursecard from "../../../../client/components/Coursecard";

async function ProgramDetail({ params }) {
  const { id } = await params;
  
  // Use the full URL for server-side fetch
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  // Fetch program details and its courses
  const response = await fetch(`${baseUrl}/api/teacher/display?programId=${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch program data");
  }

  const data = await response.json();
  const courses = data.courses || [];
  
  // Get program info from first course (since all courses in this program will have same program info)
  const programInfo = courses.length > 0 ? {
    name: courses[0].program,
   // ProgramType:courses[0].program_code || "NA",
    department: courses[0].department,
    code: courses[0].program_code || courses[0].course_code  ||'N/A' //course code correction required
  } : null;

  return (
    <>
      <Box className="pt-25 p-6">
        {programInfo && (
          <Card className="mb-6 bg-blue-50">
            <CardContent>
              <Typography variant="h3" component="h1" className="text-4xl font-bold text-gray-800 mb-2">
                {programInfo.name}
              </Typography>
              <Box className="flex items-center gap-4 mb-4">
                <Chip 
                  label={programInfo.code}
                  color="primary"
                  variant="outlined"
                  className="font-mono font-semibold"
                />
                <Typography variant="subtitle1" className="text-gray-600">
                  {programInfo.department}
                </Typography>
              </Box>
              <Typography variant="body1" className="text-gray-700">
                {courses.length} {courses.length === 1 ? 'course' : 'courses'} available in this program
              </Typography>
            </CardContent>
          </Card>
        )}
        
        <Typography variant="h4" component="h2" className="text-2xl font-semibold text-gray-800 mb-4">
          Courses in this Program
        </Typography>
      </Box>
      
      <div className="w-90vw text-black p-5">
        <Grid container spacing={4}>
          {courses.length > 0 ? (
            courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course.course_id}>
                <Coursecard 
                  id={course.course_id}
                  Course={course.name}
                   unitCount={course.unit_count}
                topicCount={course.topic_count}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box className="text-center py-12">
                <Typography variant="h6" className="text-gray-500">
                  No courses found for this program
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
}

export default ProgramDetail;
