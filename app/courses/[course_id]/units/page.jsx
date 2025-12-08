"use client";
import { useEffect, useState, use } from "react";

export default function UnitsPage({ params }) {
  const unwrappedParams = use(params);
  const { course_id } = unwrappedParams;
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!course_id) return;
    fetch(`/api/navigation/courses/${course_id}/units`)
      .then((res) => res.json())
      .then((data) => {
        setUnits(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [course_id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Units</h1>

      {units.length === 0 && <p>No units found for this course.</p>}

      <ul>
        {units.map((u) => (
          <li key={u.section_id}>
            <a href={`/courses/${course_id}/units/${u.section_id}`}>
              {u.unit_code ? `${u.unit_code} - ` : ""}{u.unit_title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
