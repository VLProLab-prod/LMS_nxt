"use client";
import { useEffect, useState } from "react";

export default function SchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/navigation/schools")
      .then((res) => res.json())
      .then((data) => {
        setSchools(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Schools</h1>
      <ul>
        {schools.map((s) => (
          <li key={s.school_id}>
            <a href={`/schools/${s.school_id}/programs`}>{s.school_name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
