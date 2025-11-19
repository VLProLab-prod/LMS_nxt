import { NextResponse } from "next/server";
import { pool } from "../../../../lib/db";

export const runtime = "nodejs";

// GET route to fetch programs
export async function GET(req) {
  try {
    const query = `
      SELECT 
        p.program_id,
        p.program_name,
        p.program_code,
        s.school_name,
        s.school_id,
        COUNT(DISTINCT c.course_id) as course_count
      FROM programs p
      LEFT JOIN schools s ON p.school_id = s.school_id
      LEFT JOIN courses c ON p.program_id = c.program_id
      GROUP BY p.program_id, p.program_name, p.program_code, s.school_name, s.school_id
      ORDER BY s.school_name, p.program_name
    `;

    const [rows] = await pool.query(query);

    const programs = rows.map(row => ({
      program_id: row.program_id,
      program_name: row.program_name,
      program_code: row.program_code,
      school_name: row.school_name,
      school_id: row.school_id,
      course_count: row.course_count || 0
    }));

    return NextResponse.json({ programs });

  } catch (err) {
    console.error("GET programs error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
