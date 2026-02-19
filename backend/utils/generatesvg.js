import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get current directory in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateAndSaveSubjectIcon = (subjectName) => {
  // 1. Generate the SVG Content
  const avatar = createAvatar(initials, {
    seed: subjectName,
    radius: 10,
    backgroundColor: [
      'f44336', 'e91e63', '9c27b0', '673ab7', '3f51b5', 
      '2196f3', '03a9f4', '00bcd4', '009688', '4caf50', 
      '8bc34a', 'ffc107', 'ff9800', 'ff5722', '795548', 
      '607d8b'
    ],
    chars: 2,
  });

  const svgContent = avatar.toString();

  // 2. Determine paths
  // Use a timestamp to ensure unique filenames
  const fileName = `subject-${Date.now()}-${Math.floor(Math.random() * 1000)}.svg`;
  
  // Go up one level from 'utils' to 'uploads'
  const uploadDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadDir, fileName);

  // 3. Ensure uploads folder exists
  if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 4. Save the file to disk
  fs.writeFileSync(filePath, svgContent);

  // 5. Return the simple relative path (Force forward slashes for URLs)
  return `uploads/${fileName}`;
};