"use client";
import { useEffect, useState, use } from "react";

export default function ProgramsPage({ params }) {
  const unwrappedParams = use(params);
  const { school_id } = unwrappedParams;
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!school_id) return;
    fetch(`/api/navigation/schools/${school_id}/programs`)
      .then((res) => res.json())
      .then((data) => {
        setPrograms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [school_id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Programs</h1>
      <ul>
        {programs.map((p) => (
          <li key={p.program_id}>
            <a href={`/programs/${p.program_id}/courses`}>
              {p.program_name} ({p.program_code})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
