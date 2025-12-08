"use client";
import { useEffect, useState, use } from "react";

export default function CoursesPage({ params }) {
  const unwrappedParams = use(params);
  const { program_id } = unwrappedParams;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!program_id) return;
    fetch(`/api/navigation/programs/${program_id}/courses`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [program_id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Courses</h1>
      <ul>
        {courses.map((c) => (
          <li key={c.course_id}>
            <a href={`/courses/${c.course_id}/units`}>
              {c.course_code} - {c.course_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
