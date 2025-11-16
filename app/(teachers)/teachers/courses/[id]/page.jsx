"use client";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import {Tooltip} from "@mui/material";
import { Trash,SquarePen,FileCheck } from 'lucide-react';
import ProgressBar from "../../../../client/components/ProgressBar";

export default function CourseStructureDesign() {
  const [course, setCourse] = useState(null);
  const [expandedUnit, setExpandedUnit] = useState(null);

  // 🔹 EMPTY API FUNCTION — you can fill it later
  const fetchCourse = async () => {
    // const res = await fetch("/api/your-endpoint");
    // const data = await res.json();
    // setCourse(data);
  };

  // 🔹 load dummy data for now
  useEffect(() => {
    const dummyCourse = {
      name: "Data Structures",
      department: "CSE",
      program: "B.Tech",
      units: [
        {
          id: "u1",
          name: "Introduction",
          topics: [
            {
              id: "t1",
              name: "What is a Data Structure?",
              estimatedTime: 20,
              status: "planned",
            },
            {
              id: "t2",
              name: "Time Complexity Basics",
              estimatedTime: 35,
              status: "upload",
              teacherNotes: "Needs review",
            },
          ],
        },
        {
          id: "u2",
          name: "Linear Structures",
          topics: [
            {
              id: "t3",
              name: "Arrays",
              estimatedTime: 25,
              status: "review",
            },
          ],
        },
        {
          id: "u3",
          name: "Trees",
          topics: [],
        },
      ],
    };

    setCourse(dummyCourse);

    // If you want to switch to real API later:
    // fetchCourse();
  }, []);

  if (!course) return <p>Loading...</p>;

  const getAllTopics = () => {
    return course.units.flatMap((u) => u.topics);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Button variant="outlined">← Back to Courses</Button>
      </div>

      {/* Course Info */}
      <Card>
        <CardHeader
          title={<span className="text-2xl">{course.name}</span>}
          subheader={`${course.department} • ${course.program} • ${course.units.length} units • ${getAllTopics().length} topics`}
        />
      </Card>

      {/* Course Structure */}
      <Card>
        <CardHeader
          title="Course Structure"
          subheader="Manage units and topics for this course"
        />

        <CardContent>
          <div className="space-y-4 border-2 border-white">
            {course.units.map((unit, unitIndex) => (
              <Accordion
                key={unit.id}
                expanded={expandedUnit === unit.id}
                onChange={() =>
                  setExpandedUnit(expandedUnit === unit.id ? null : unit.id)
                }
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div className="flex justify-between w-full">
                    <span className="font-medium">
                      Unit {unitIndex + 1}: {unit.name}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {unit.topics.length} topics
                    </span>
                  </div>
                </AccordionSummary>

                <AccordionDetails>
                  <div className="space-y-2">
                    {unit.topics.length === 0 && (
                      <p className="text-gray-500 italic text-center py-4">
                        No topics added yet
                      </p>
                    )}

                    {unit.topics.map((topic, topicIndex) => (
                      <div
                        key={topic.id}
                        className="flex justify-between items-center bg-white border-2 border-gray-300 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-gray-600">
                            {unitIndex + 1}.{topicIndex + 1}
                          </span>

                          <span>{topic.name}</span>

                          <span className="text-sm text-gray-500">
                            ({topic.estimatedTime} min)
                          </span>

                          <span className="px-2 py-1 bg-gray-200 text-blue-600 text-xs rounded">
                            <ProgressBar status={topic.status}/>
                        
                          </span>

                          {topic.teacherNotes && (
                            <span className="text-xs text-gray-500 italic">
                              "{topic.teacherNotes}"
                            </span>
                          )}
                        </div>

                        <div className="flex">
                          <Button  size="small" >
                           
                           <Tooltip title="Script">
                               <FileCheck/>
                            </Tooltip>
                          </Button>

                          <Button  size="small">
                             <Tooltip title="Edit">
                               <SquarePen/>
                            </Tooltip>
                          </Button>

                          <Button  size="small" color="error">
                            <Tooltip title="Delete">
                                <Trash/>
                            </Tooltip>
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button variant="contained" className="w-full mt-2 text-3xl">
                      + Add Topic
                    </Button>
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}

            <Button variant="outlined" className="w-full ">
              + Add Unit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
