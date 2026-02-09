// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'School Application',
//       version: '1.0.0',
//       description: 'API documentation for School App Backend',
//     },
//     servers: [
//       {
//         url: 'http://localhost:5000/api/v1',
//         description: 'Local server'
//       },
//       {
//         url: 'https://school-app-backend-nu.vercel.app/api/v1',
//         description: 'Production server'
//       }
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT'
//         }
//       },
//       schemas: {
//         // Error: {
//         //   type: 'object',
//         //   properties: {
//         //     status: { type: 'string' },
//         //     message: { type: 'string' }
//         //   }
//         // },
//         School: {
//           type: 'object',
//           required: ['schoolCode', 'name'],
//           properties: {
//             _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
//             schoolCode: { type: 'string', example: 'SCH001' },
//             name: { type: 'string', example: 'Greenwood High' },
//             contactInfo: {
//               type: 'object',
//               properties: {
//                 email: { type: 'string', example: 'info@greenwood.com' },
//                 phone: { type: 'string', example: '+1234567890' },
//                 address: { type: 'string', example: '123 School Lane' }
//               }
//             },
//             createdAt: { type: 'string', format: 'date-time' }
//           }
//         },
//         Admin: {
//           type: 'object',
//           required: ['name', 'email', 'password', 'role'],
//           properties: {
//             _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
//             name: { type: 'string', example: 'Admin User' },
//             email: { type: 'string', format: 'email', example: 'admin@school.com' },
//             role: { type: 'string', enum: ['SuperAdmin', 'SchoolAdmin'], example: 'SchoolAdmin' },
//             school: { type: 'string', example: '60d0fe4f5311236168a109ca' }
//           }
//         },
//         Class: {
//           type: 'object',
//           required: ['grade', 'section', 'school'],
//           properties: {
//             _id: { type: 'string', example: '60d0fe4f5311236168a109cc' },
//             grade: { type: 'string', example: '10' },
//             section: { type: 'string', example: 'A' },
//             school: { type: 'string', example: '60d0fe4f5311236168a109ca' },
//             classTeacher: { type: 'string', example: '60d0fe4f5311236168a109cd', nullable: true }
//           }
//         },
//         Teacher: {
//           type: 'object',
//           required: ['name', 'email', 'password', 'school'],
//           properties: {
//             _id: { type: 'string', example: '60d0fe4f5311236168a109cd' },
//             name: { type: 'string', example: 'John Doe' },
//             email: { type: 'string', format: 'email', example: 'teacher@school.com' },
//             phone: { type: 'string', example: '1234567890' },
//             school: { type: 'string', example: '60d0fe4f5311236168a109ca' },
//             subjects: { 
//               type: 'array', 
//               items: { type: 'string' },
//               example: ['Math', 'Physics']
//             },
//             assignedClass: { type: 'string', example: '60d0fe4f5311236168a109cc', nullable: true },
//             isClassTeacher: { type: 'boolean', example: false }
//           }
//         },
//         Student: {
//           type: 'object',
//           required: ['name', 'rollNumber', 'school', 'studentClass', 'parent'],
//           properties: {
//             _id: { type: 'string', example: '60d0fe4f5311236168a109ce' },
//             name: { type: 'string', example: 'Alice Smith' },
//             rollNumber: { type: 'string', example: '101' },
//             school: { type: 'string', example: '60d0fe4f5311236168a109ca' },
//             studentClass: { type: 'string', example: '60d0fe4f5311236168a109cc' },
//             parent: { type: 'string', example: '60d0fe4f5311236168a109cf' }
//           }
//         },
//         Parent: {
//           type: 'object',
//           required: ['name', 'phone', 'password', 'school'],
//           properties: {
//             _id: { type: 'string', example: '60d0fe4f5311236168a109cf' },
//             name: { type: 'string', example: 'Bob Smith' },
//             phone: { type: 'string', example: '9876543210' },
//             school: { type: 'string', example: '60d0fe4f5311236168a109ca' }
//           }
//         },
//         Notice: {
//           type: 'object',
//           required: ['title', 'content', 'school', 'postedBy'],
//           properties: {
//             _id: { type: 'string', example: '60d0fe4f5311236168a109d0' },
//             title: { type: 'string', example: 'Holiday Announcement' },
//             content: { type: 'string', example: 'School will remain closed tomorrow.' },
//             school: { type: 'string', example: '60d0fe4f5311236168a109ca' },
//             postedBy: {
//               type: 'object',
//               properties: {
//                 userId: { type: 'string' },
//                 role: { type: 'string', enum: ['SchoolAdmin', 'Teacher'] },
//                 name: { type: 'string' }
//               }
//             },
//             audience: { 
//               type: 'string', 
//               enum: ['All', 'Teachers', 'Students', 'Class', 'Student'],
//               default: 'All'
//             },
//             targetClass: { type: 'string', nullable: true },
//             targetStudent: { type: 'string', nullable: true },
//             attachments: { 
//               type: 'array', 
//               items: { type: 'string' } 
//             },
//             createdAt: { type: 'string', format: 'date-time' }
//           }
//         },
//         StudentRequest: {
//           type: 'object',
//           required: ['parent', 'school', 'requestedClass', 'studentName', 'rollNumber'],
//           properties: {
//               _id: { type: 'string', example: '60d0fe4f5311236168a109d1' },
//               parent: { type: 'string', example: '60d0fe4f5311236168a109cf' },
//               school: { type: 'string', example: '60d0fe4f5311236168a109ca' },
//               requestedClass: { type: 'string', example: '60d0fe4f5311236168a109cc' },
//               studentName: { type: 'string', example: 'Alice Smith' },
//               rollNumber: { type: 'string', example: '101' },
//               status: { type: 'string', enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
//               rejectionReason: { type: 'string', nullable: true }
//           }
//         }
//       }
//     }
//   },
//   apis: [path.join(__dirname, '..', 'routes', '*.js')], // Path to the API docs
// };

// export default swaggerOptions;
