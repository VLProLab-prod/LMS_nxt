"use client";
import { useState } from "react";

export default function CreateUnitPage() {
  const [form, setForm] = useState({
    userEmail: "",
    schoolName: "",
    programName: "",
    semesterName: "",
    courseCode: "",
    courseName: "",
    courseId: "",
    unitCode: "",
    title: "",
    profName: "",
  });

  const [pptFile, setPptFile] = useState(null);
  const [otherFiles, setOtherFiles] = useState([]);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();

    const fd = new FormData();
    for (const key in form) fd.append(key, form[key]);

    if (pptFile) fd.append("ppt", pptFile);
    otherFiles.forEach((f) => fd.append("otherFiles", f));

    const res = await fetch("/api/teacher/create-unit", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Unit</h1>

      <form onSubmit={submit} className="space-y-4">

        <input
          name="userEmail"
          placeholder="Teacher Email"
          onChange={update}
          className="w-full border p-2 rounded"
        />

        <input
          name="schoolName"
          placeholder="School Name"
          onChange={update}
          className="w-full border p-2 rounded"
        />

        <input
          name="programName"
          placeholder="Program Name"
          onChange={update}
          className="w-full border p-2 rounded"
        />

        <input
          name="semesterName"
          placeholder="Semester Name"
          onChange={update}
          className="w-full border p-2 rounded"
        />

        <input
          name="courseCode"
          placeholder="Course Code"
          onChange={update}
          className="w-full border p-2 rounded"
        />

        <input
          name="courseName"
          placeholder="Course Name"
          onChange={update}
          className="w-full border p-2 rounded"
        />

        <input
          name="courseId"
          placeholder="Course ID"
          onChange={update}
          className="w-full border p-2 rounded"
        />

        <input
          name="unitCode"
          placeholder="Unit Code (U01V01)"
          onChange={update}
          className="w-full border p-2 rounded"
        />

        <input
          name="title"
          placeholder="Unit Title"
          onChange={update}
          className="w-full border p-2 rounded"
        />

        <input
          name="profName"
          placeholder="Professor Name"
          onChange={update}
          className="w-full border p-2 rounded"
        />

        <div>
          <label className="font-medium">PPT File:</label>
          <input
            type="file"
            onChange={(e) => setPptFile(e.target.files[0])}
            className="mt-1 w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-medium">Other Materials:</label>
          <input
            type="file"
            multiple
            onChange={(e) => setOtherFiles(Array.from(e.target.files))}
            className="mt-1 w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700"
        >
          Create Unit
        </button>
      </form>
    </div>
  );
}
