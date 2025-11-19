"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import Createunitmodal from "../../../../client/components/Createunitmodal";
import CreateTopicmodal from "../../../../client/components/CreateTopicmodal";

export default function CourseStructureDesign() {
  const [course, setCourse] = useState(null);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [isopen,setisopen] = useState(false);

  // 🔹 API FUNCTION to fetch course data
  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/teacher/display?courseId=${params.id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch course data');
      }
      const data = await res.json();
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  
  useEffect(() => {
    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  if (!course) return <p>Loading...</p>;

  const getAllTopics = () => {
    return course.units ? course.units.flatMap((u) => u.topics || []) : [];
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
          title={<span className="text-2xl">{course.name || course.course_name}</span>}
          subheader={`${course.department || 'Department'} • ${course.program || 'Program'} • ${course.units ? course.units.length : 0} units • ${getAllTopics().length} topics`}
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
            {course.units && course.units.length > 0 ? (
              course.units.map((unit, unitIndex) => (
                <Accordion
                  key={unit.id || unit.section_id}
                  expanded={expandedUnit === (unit.id || unit.section_id)}
                  onChange={() =>
                    setExpandedUnit(expandedUnit === (unit.id || unit.section_id) ? null : (unit.id || unit.section_id))
                  }
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="flex justify-between w-full">
                      <span className="font-medium">
                        Unit {unitIndex + 1}: {unit.name}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {unit.topics ? unit.topics.length : 0} topics
                      </span>
                    </div>
                  </AccordionSummary>

                  <AccordionDetails>
                    <div className="space-y-2">
                      {(!unit.topics || unit.topics.length === 0) && (
                        <p className="text-gray-500 italic text-center py-4">
                          No topics added yet
                        </p>
                      )}

                      {unit.topics && unit.topics.map((topic, topicIndex) => (
                        <div
                          key={topic.id || topic.content_id}
                          className="flex justify-between items-center bg-white border-2 border-gray-300 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-gray-600">
                              {unitIndex + 1}.{topicIndex + 1}
                            </span>

                            <span>{topic.name}</span>

                            <span className="text-sm text-gray-500">
                              ({topic.estimatedTime || topic.estimated_duration_min || 0} min)
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
                            <Button size="small">
                              <Tooltip title="Script">
                                <FileCheck/>
                              </Tooltip>
                            </Button>

                            <Button size="small">
                              <Tooltip title="Edit">
                                <SquarePen/>
                              </Tooltip>
                            </Button>

                            <Button size="small" color="error">
                              <Tooltip title="Delete">
                                <Trash/>
                              </Tooltip>
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button variant="contained" className="w-full mt-2" onClick={()=>setisopen(true)}>
                        + Add Topic
                      </Button>
                    <CreateTopicmodal open={isopen} onClose={()=>setisopen(false)}/>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <p className="text-gray-500 italic text-center py-8">
                No units found for this course
              </p>
            )}

            <Button variant="outlined" className="w-full" onClick={()=>setOpen(true)}>
              + Add Unit
            </Button>
            <Createunitmodal
        open={open}
        onClose={() => setOpen(false)}
      />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
