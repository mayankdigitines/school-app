# School App Backend API Documentation

This documentation provides details on how to use the School Management System API.

## Base URL

All API requests should be made to:
`http://localhost:5000/api/v1`

## Authentication

This API uses **JSON Web Tokens (JWT)** for authentication.

1.  **Login** to receive a `token`.
2.  Include the token in the **Authorization** header of subsequent requests.

**Header Format:**

```
Authorization: Bearer <your_token_here>
```

## Standard Response Format

**Success:**

```json
{
  "status": "success",
  "results": 5, // Optional, for arrays
  "data": { ... }
}
```

**Error:**

```json
{
  "status": "fail" | "error",
  "message": "Error description here"
}
```

---

## 1. Authentication Module

### Login

Authenticates a user (SuperAdmin, SchoolAdmin, Teacher, or Parent) and returns a JWT token.

- **Endpoint:** `POST /auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "username": "email@example.com", // Email for Admin/Teacher, Phone for Parent
    "password": "password123",
    "role": "SchoolAdmin" // Options: "SuperAdmin", "SchoolAdmin", "Teacher", "Parent"
  }
  ```
- **Success Response:**
  ```json
  {
    "status": "success",
    "token": "eyJhbGciOiJIUzI1...",
    "data": {
      "user": { ... },
      "role": "SchoolAdmin"
    }
  }
  ```

### Register Parent

Allows a parent to register and request to add their child to a class.

- **Endpoint:** `POST /auth/register-parent`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "Parent Name",
    "phone": "9876543210",
    "password": "securepassword",
    "schoolCode": "SCHL123", // Unique code provided by the school
    "studentName": "Child Name",
    "studentRollNo": "23",
    "grade": "10",
    "section": "A"
  }
  ```
- **Success Response:**
  ```json
  {
    "status": "success",
    "message": "Registration successful. Waiting for Class Teacher approval."
  }
  ```

---

## 2. Admin Module (SuperAdmin)

### Create School

Creates a new school and its first School Admin.

- **Endpoint:** `POST /admin/create-school`
- **Access:** SuperAdmin
- **Request Body:**
  ```json
  {
    "name": "Springfield High School",
    "email": "info@springfield.edu",
    "phone": "1234567890",
    "address": "123 School Lane",
    "adminName": "Principal Skinner",
    "adminEmail": "admin@springfield.edu",
    "adminPassword": "adminpassword"
  }
  ```
- **Success Response:**
  ```json
  {
    "status": "success",
    "data": {
      "school": { "schoolCode": "SPRI123", ... },
      "admin": { ... }
    }
  }
  ```

---

## 3. Admin Module (SchoolAdmin)

All endpoints in this section require a valid `SchoolAdmin` token.

### Add Class

Creates a new class (Grade + Section).

- **Endpoint:** `POST /admin/add-class`
- **Request Body:**
  ```json
  {
    "grade": "10",
    "section": "A"
  }
  ```

### Get Classes

Retrieves all classes in the school.

- **Endpoint:** `GET /admin/classes`
- **Success Response:**
  ```json
  {
    "status": "success",
    "results": 2,
    "data": {
      "classes": [
        {
          "grade": "10",
          "section": "A",
          "classTeacher": { "name": "Teacher Name", "email": "..." }
        }
      ]
    }
  }
  ```

### Add Teacher

Creates a new teacher account.

- **Endpoint:** `POST /admin/add-teacher`
- **Request Body:**
  ```json
  {
    "name": "Edna Krabappel",
    "email": "edna@springfield.edu",
    "password": "password123",
    "phone": "555555555",
    "subjects": ["Math", "Science"]
  }
  ```

### Get Teachers

Retrieves all teachers in the school.

- **Endpoint:** `GET /admin/teachers`

### Assign Class Teacher

Assigns a teacher to a specific class.

- **Endpoint:** `PATCH /admin/assign-class-teacher`
- **Request Body:**
  ```json
  {
    "teacherId": "65b...",
    "classId": "65c..."
  }
  ```

### Update Teacher

Updates teacher details.

- **Endpoint:** `PATCH /admin/update-teacher/:teacherId`
- **Request Body:** (All fields optional)
  ```json
  {
    "name": "New Name",
    "email": "newemail@example.com",
    "password": "newpassword",
    "phone": "9999999999",
    "subjects": ["History"],
    "classId": "65c..." // To assign class directly
  }
  ```

---

## 4. Teacher Module

All endpoints in this section require a valid `Teacher` token.

### Get Teacher Notices

Retrieves notices relevant to teachers (Audience: 'All' or 'Teachers').

- **Endpoint:** `GET /teachers/notices`

### Post Notice

Creates a new notice or homework. Supports file attachments.

- **Endpoint:** `POST /teachers/notices`
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `title`: (Text) Notice Title
  - `content`: (Text) Notice Content
  - `audience`: (Text) 'All', 'Teachers', 'Class', 'Student'
  - `targetClassId`: (Text, Optional) Required if audience is 'Class'
  - `targetStudentId`: (Text, Optional) Required if audience is 'Student'
  - `attachments`: (File, Max 5)

### Get Pending Requests (Class Teacher Only)

Retrieves pending student registration requests for the class assigned to the logged-in teacher.

- **Endpoint:** `GET /teachers/requests`
- **Success Response:**
  ```json
  {
    "status": "success",
    "data": {
      "requests": [
        {
          "studentName": "Bart Simpson",
          "parent": { "name": "Homer", "phone": "..." },
          "status": "Pending"
        }
      ]
    }
  }
  ```

### Handle Student Request (Class Teacher Only)

Approves or Rejects a student registration request.

- **Endpoint:** `POST /teachers/requests/handle`
- **Request Body:**
  ```json
  {
    "requestId": "65d...",
    "status": "Approved", // or "Rejected"
    "rejectionReason": "Invalid roll number" // Required if Rejected
  }
  ```

### Get Class Students

Retrieves detailed list of students.

- **Endpoint:** `GET /teachers/students`
- **Query Parameters:**
  - `classId` (Optional): If not provided, defaults to the teacher's assigned class.

---

## 5. Parent Module

All endpoints in this section require a valid `Parent` token.

### Get My Children

Retrieves all children linked to the logged-in parent account.

- **Endpoint:** `GET /parents/children`
- **Success Response:**
  ```json
  {
    "status": "success",
    "data": {
      "students": [
        {
          "name": "Lisa Simpson",
          "studentClass": { "grade": "2", "section": "A" }
        }
      ]
    }
  }
  ```

### Get Dashboard Notices

Retrieves notices relevant to the parent's children (School-wide + Class specific + Student specific).

- **Endpoint:** `GET /parents/dashboard`
