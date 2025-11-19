import { NextResponse } from "next/server";
import { pool } from "../../../../lib/db";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

// GET route to fetch courses
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const programId = searchParams.get('programId');
    const schoolId = searchParams.get('schoolId');

    let query;
    let params = [];

    if (courseId) {
      // Fetch specific course with its sections and content items
      query = `
        SELECT 
          c.course_id,
          c.title as course_name,
          c.course_code,
          c.status as course_status,
          p.program_name,
          p.program_code,
          s.school_name,
          cs.section_id,
          cs.title as section_title,
          cs.order_index as section_order,
          ci.content_id,
          ci.title as topic_name,
          ci.estimated_duration_min,
          ci.workflow_status,
          ci.learning_objectives
        FROM courses c
        LEFT JOIN programs p ON c.program_id = p.program_id
        LEFT JOIN schools s ON p.school_id = s.school_id
        LEFT JOIN coursesections cs ON c.course_id = cs.course_id
        LEFT JOIN contentitems ci ON cs.section_id = ci.section_id
        WHERE c.course_id = ?
        ORDER BY cs.order_index ASC, ci.content_id ASC
      `;
      params = [courseId];
    } else {
      // Fetch all courses with basic info
      query = `
        SELECT 
          c.course_id,
          c.title as course_name,
          c.course_code,
          c.status as course_status,
          p.program_name,
          p.program_code,
          s.school_name,
          COUNT(DISTINCT cs.section_id) as unit_count,
          COUNT(DISTINCT ci.content_id) as topic_count
        FROM courses c
        LEFT JOIN programs p ON c.program_id = p.program_id
        LEFT JOIN schools s ON p.school_id = s.school_id
        LEFT JOIN coursesections cs ON c.course_id = cs.course_id
        LEFT JOIN contentitems ci ON cs.section_id = ci.section_id
      `;

      // Add filters if provided
      if (programId) {
        query += ` WHERE c.program_id = ?`;
        params.push(programId);
      } else if (schoolId) {
        query += ` WHERE p.school_id = ?`;
        params.push(schoolId);
      }

      query += `
        GROUP BY c.course_id, c.title, c.course_code, c.status, 
                 p.program_name, p.program_code, s.school_name
        ORDER BY s.school_name, p.program_name, c.title
      `;
    }

    const [rows] = await pool.query(query, params);

    if (courseId) {
      // Structure data for single course with units and topics
      if (!rows.length) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }

      const courseData = {
        course_id: rows[0].course_id,
        name: rows[0].course_name,
        course_code: rows[0].course_code,
        status: rows[0].course_status,
        program: rows[0].program_name,
        department: rows[0].school_name,
        units: []
      };

      // Group sections and topics
      const unitsMap = new Map();

      rows.forEach(row => {
        if (row.section_id && !unitsMap.has(row.section_id)) {
          unitsMap.set(row.section_id, {
            id: `u${row.section_id}`,
            section_id: row.section_id,
            name: row.section_title,
            order: row.section_order,
            topics: []
          });
        }

        if (row.content_id && unitsMap.has(row.section_id)) {
          const unit = unitsMap.get(row.section_id);
          unit.topics.push({
            id: `t${row.content_id}`,
            content_id: row.content_id,
            name: row.topic_name,
            estimatedTime: row.estimated_duration_min || 0,
            status: mapWorkflowStatus(row.workflow_status),
            learning_objectives: row.learning_objectives
          });
        }
      });

      courseData.units = Array.from(unitsMap.values()).sort((a, b) => a.order - b.order);

      return NextResponse.json(courseData);
    } else {
      // Return list of all courses
      const courses = rows.map(row => ({
        course_id: row.course_id,
        name: row.course_name,
        course_code: row.course_code,
        status: row.course_status,
        program: row.program_name,
        department: row.school_name,
        unit_count: row.unit_count || 0,
        topic_count: row.topic_count || 0
      }));

      return NextResponse.json({ courses });
    }

  } catch (err) {
    console.error("GET route error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Helper function to map database workflow status to frontend status
function mapWorkflowStatus(dbStatus) {
  const statusMap = {
    'Planned': 'planned',
    'Scripted': 'scripted', 
    'Editing': 'editing',
    'Post-Editing': 'post-editing',
    'Ready_for_Video_Prep': 'ready',
    'Under_Review': 'review',
    'Published': 'published'
  };
  
  return statusMap[dbStatus] || 'planned';
}

export async function POST(req) {
  try {
    const form = await req.formData();

    const userEmail = form.get("userEmail");
    const schoolName = form.get("schoolName");
    const programName = form.get("programName");
    const semesterName = form.get("semesterName");
    const courseCode = form.get("courseCode");
    const courseName = form.get("courseName");
    const courseId = form.get("courseId");
    const unitCode = form.get("unitCode");
    const title = form.get("title");
    const profName = form.get("profName");

    const pptFile = form.get("ppt");
    const otherFiles = form.getAll("otherFiles");

    //validate teacher
    const [rows] = await pool.query(
      "SELECT user_id FROM Users WHERE email = ?",
      [userEmail]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 401 });
    }

    const teacher = rows[0];

    const SAFE = (s = "") => String(s).replace(/[\/\\:?<>|"]/g, "-");

    const base = process.env.STORAGE_BASE;
    const school = SAFE(schoolName);
    const program = SAFE(programName);
    const semester = SAFE(semesterName);
    const courseFolder = SAFE(`${courseCode} - ${courseName}`);
    const unitFolder = SAFE(`${unitCode} - ${title} - ${profName}`);

    const fullPath = path.join(base, school, program, semester, courseFolder, unitFolder);

    await fs.mkdir(fullPath, { recursive: true });
    await fs.mkdir(path.join(fullPath, "Materials"), { recursive: true });

    let pptFilename = null;

    //save PPT
    if (pptFile && pptFile.name) {
      const arrayBuffer = await pptFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      pptFilename = `${unitFolder}${path.extname(pptFile.name)}`;
      await fs.writeFile(path.join(fullPath, pptFilename), buffer);
    }

    //insert section
    const [insert] = await pool.query(
      `INSERT INTO CourseSections 
       (course_id, title, order_index, unit_code, prof_name, storage_path, ppt_filename)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        courseId,
        title,
        0,
        unitCode,
        profName,
        fullPath,
        pptFilename
      ]
    );

    const sectionId = insert.insertId;

    //save other materials
    for (const file of otherFiles) {
      if (!file || !file.name) continue;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const filename = SAFE(file.name);
      const filePath = path.join(fullPath, "Materials", filename);

      await fs.writeFile(filePath, buffer);

      await pool.query(
        `INSERT INTO UnitMaterials (section_id, filename, file_path, file_type, uploaded_by)
        VALUES (?, ?, ?, ?, ?)`,
        [
          sectionId,
          filename,
          filePath,
          path.extname(filename),
          teacher.user_id
        ]
      );
    }

    return NextResponse.json({ success: true, directory: fullPath });

  } catch (err) {
    console.error("route error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}