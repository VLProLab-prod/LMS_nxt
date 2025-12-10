
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- CONFIG ---
const CSV_DIR = './course info-csv';
const SEED_DATA_PATH = './prisma/seed-data.js';
const SEED_USERS_PATH = './prisma/seed-users.js';
const CREDENTIALS_PATH = './credentials.txt';

// --- HELPERS ---
function parseCSVLine(text) {
    const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    const row = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            row.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
        } else {
            current += char;
        }
    }
    row.push(current.trim().replace(/^"|"$/g, ''));
    return row;
}

function generatePassword() {
    return crypto.randomBytes(4).toString('hex'); // 8 char hex
}

function normalizeEmail(email) {
    return email ? email.toLowerCase().trim() : null;
}

// --- DATA LOADING ---
let seedData = require(SEED_DATA_PATH);
let seedUsers = require(SEED_USERS_PATH);
let credentialsTxt = fs.readFileSync(CREDENTIALS_PATH, 'utf-8');

// --- INITIALIZE IDS & MAPS ---
let maxProgramId = seedData.programs.reduce((m, p) => Math.max(m, p.id || 0), 0);
let maxCourseId = seedData.courses.reduce((m, c) => Math.max(m, c.id || 0), 0);
let maxLegacyUserId = seedData.users.reduce((m, u) => Math.max(m, u.id || 0), 0);

// Maps
const programMap = {}; // Name -> ID
seedData.programs.forEach(p => programMap[p.name] = p.id);

const legacyUserMap = {}; // Email -> Legacy ID
seedData.users.forEach(u => {
    if (u.email) legacyUserMap[normalizeEmail(u.email)] = u.id;
});

const seedUserMap = {}; // Email -> User Object
seedUsers.forEach(u => {
    if (u.email) seedUserMap[normalizeEmail(u.email)] = u;
});

// CSV Configs
const csvConfigs = [
    { file: 'Msc AIML.csv', name: 'Master of Science in Artificial Intelligence', code: 'MAI' },
    { file: 'Msc (DS).csv', name: 'Master of Science in Data Science', code: 'MDS' },
    { file: 'MCA.csv', name: 'Master of Computer Applications', code: 'MCA' },
    { file: 'Bcom.csv', name: 'Bachelor of Commerce', code: 'BCOM' },
    { file: 'BCA.csv', name: 'Bachelor of Computer Applications', code: 'BCA' },
    { file: 'MA (Economic).csv', name: 'Master of Arts in Economics', code: 'MAECO' },
    { file: 'MA (English).csv', name: 'Master of Arts in English', code: 'MAENG', schoolId: 8 }
];

// --- LOGGING ---
function log(msg) {
    console.log(msg);
}

// --- MAIN LOOP ---
const files = fs.readdirSync(CSV_DIR);

files.forEach(filename => {
    if (!filename.endsWith('.csv')) return;

    // Find config
    const config = csvConfigs.find(c => filename.includes(c.file.replace('.csv', '')));
    if (!config) {
        log(`Skipping unknown CSV: ${filename}`);
        return;
    }

    log(`Processing ${filename} -> ${config.name}`);

    // Get/Create Program
    let programId = programMap[config.name];
    if (!programId) {
        programId = ++maxProgramId;
        seedData.programs.push({
            id: programId,
            schoolId: config.schoolId || 4, // Default to School of Science (4) or check manually? Assumed for now.
            name: config.name,
            code: config.code
        });
        programMap[config.name] = programId;
        log(`Created program: ${config.name} (ID: ${programId})`);
    }

    // Read CSV
    const content = fs.readFileSync(path.join(CSV_DIR, filename), 'utf-8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    const headers = parseCSVLine(lines[0]);

    const idxCode = headers.findIndex(h => h.includes('Code'));
    const idxName = headers.findIndex(h => h.includes('Course Name'));
    const idxType = headers.findIndex(h => h.includes('Course Type'));
    const idxCat = headers.findIndex(h => h.includes('Category Of Course'));
    const idxEmail = headers.findIndex(h => h.includes('Gmail ID'));

    // Process Rows
    for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        if (row.length < headers.length - 2) continue;

        const courseName = row[idxName];
        let rawCode = row[idxCode];
        const type = row[idxType] || '';
        const cat = row[idxCat] || '';
        const emailStr = row[idxEmail];

        // 1. Filter
        const fullRow = row.join(' ').toLowerCase();
        if (fullRow.includes('no faculty required') || fullRow.includes('swayam')) {
            // log(`Skipping ignored course: ${courseName}`);
            continue;
        }

        // 2. Generate/Refine Code
        let code = rawCode ? rawCode.trim() : '';
        const isMDC = type.includes('MDC') || cat.includes('MDC') || code.includes('MDC');

        if (isMDC) {
            code = 'MDC-012';
        } else if (!code || code.length < 2) {
            // Placeholder Logic
            if (config.code === 'MAENG') {
                // Format: MAE-001, MAE-002, ... based on index
                code = `MAE-${String(i).padStart(3, '0')}`;
            } else {
                code = `${config.code}-GEN-${i}`;
            }
        }

        // Ensure uniqueness among *other* courses in seed, unless it matches this one
        // Wait, course code must be unique. 
        // If MDC-012 exists and title is different, we must suffix.
        let suffix = 1;
        let finalCode = code;

        // Helper to check collision
        const checkCollision = (cCode) => {
            return seedData.courses.find(c => c.code === cCode && c.title !== courseName);
        };

        while (checkCollision(finalCode)) {
            finalCode = `${code}-${suffix++}`;
        }
        code = finalCode;

        // 3. Upsert Course
        let course = seedData.courses.find(c => c.title === courseName && c.programId === programId);
        if (course) {
            course.code = code;
            // log(`Updated course: ${courseName}`);
        } else {
            course = {
                id: ++maxCourseId,
                programId: programId,
                title: courseName,
                code: code
            };
            seedData.courses.push(course);
            // log(`Created course: ${courseName}`);
        }

        // 4. Process Teachers
        if (!emailStr) continue;
        const emails = emailStr.split(/[\s,]+/).filter(e => e.includes('@'));

        emails.forEach(e => {
            const email = normalizeEmail(e);

            // A. Ensure in seed-users.js (Main User DB)
            if (!seedUserMap[email]) {
                const pwd = generatePassword();
                const parts = email.split('@')[0].split('.');
                const firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Teacher';
                const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';

                const newUser = {
                    role: 'teacher',
                    email: e, // original casing
                    firstName: firstName,
                    lastName: lastName,
                    password: pwd,
                    isLegacy: true
                };
                seedUsers.push(newUser);
                seedUserMap[email] = newUser;

                // Append credentials
                const roleSpace = 'teacher'.padEnd(18, ' ');
                const emailSpace = e.padEnd(46, ' ');
                if (!credentialsTxt.includes(e)) {
                    credentialsTxt += `Role: ${roleSpace} | Email: ${emailSpace} | Password: ${pwd}\n`;
                }
                log(`Created New User: ${e}`);
            }

            // B. Ensure in seed-data.js (Legacy User Map for Seed Script)
            let legacyId = legacyUserMap[email];
            if (!legacyId) {
                legacyId = ++maxLegacyUserId;
                const uObj = seedUserMap[email];
                seedData.users.push({
                    id: legacyId,
                    roleId: 2, // 2 = Teacher Role ID approx? Or just legacy mapping?
                    // Actual roleId in seed.js is looked up by roleName.
                    // But seed-data.js users array often has roleId. 
                    // Let's copy structure: { id, roleId: 2, email, firstName, lastName }
                    // Role ID 2 is usually Teacher in the seeded roles list (Admin=1, Teacher=2 mostly)
                    email: uObj.email,
                    firstName: uObj.firstName,
                    lastName: uObj.lastName
                });
                legacyUserMap[email] = legacyId;
            }

            // C. Create Assignment
            const assignmentExists = seedData.assignments.find(a => a.userId === legacyId && a.courseId === course.id);
            if (!assignmentExists) {
                seedData.assignments.push({ userId: legacyId, courseId: course.id });
                // log(`Assigned ${email} to ${course.title}`);
            }
        });
    }
});

// --- WRITE BACK ---
const seedDataContent = `module.exports = ${JSON.stringify(seedData, null, 4)};`;
fs.writeFileSync(SEED_DATA_PATH, seedDataContent);

const seedUsersContent = `/**
 * Auto-generated by update_seeds.js
 * Static list of users and passwords for seeding.
 */
module.exports = ${JSON.stringify(seedUsers, null, 2)};
`;
fs.writeFileSync(SEED_USERS_PATH, seedUsersContent);

fs.writeFileSync(CREDENTIALS_PATH, credentialsTxt);

// --- GITIGNORE ---
const gitignorePath = './.gitignore';
let gitignore = fs.readFileSync(gitignorePath, 'utf-8');
let modifiedGitignore = false;
if (!gitignore.includes('course info-csv')) {
    gitignore += '\ncourse info-csv/\n';
    modifiedGitignore = true;
}
if (!gitignore.includes('credentials.txt')) {
    gitignore += 'credentials.txt\n';
    modifiedGitignore = true;
}
if (modifiedGitignore) {
    fs.writeFileSync(gitignorePath, gitignore);
}

log('Done processing.');
