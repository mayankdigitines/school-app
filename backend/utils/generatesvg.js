import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

export const generateSubjectIcon = (subjectName) => {
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

  return avatar.toString();
};