// Import required modules
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer"); 


// Configure Multer
// const uploadMiddleware = multer({ dest: "uploads/" }); // Files will be stored in the 'uploads' folder
const uploadMiddleware = multer({ storage: multer.memoryStorage() });

// Import controllers for universities
const {
    handleGetAllUniversities,
    handleInsertUniversity,
    handleUpdateUniversity,
    handleDeleteUniversity,
    handleGetUniversityByUid,
    handleUniversityLogin,
    handleUploadStudentsExcel
} = require("./university/university-middle-controler.js");

// Import controllers for batches
const {
    handleAddBatch,
    handleGetAllBatches,
    handleGetBatchesByUniversityId,
    handleGetBatchById,
    handleUpdateBatch,
    handleDeleteBatch,
} = require("./batches/batches-middle-controler.js");

// Import controllers for students
const {
    handleInsertStudent,
    handleGetAllStudents,
    handleGetStudentById,
    handleGetStudentsByUniversityId,
    handleGetStudentsByBatchId,
    handleUpdateStudent,
    handleDeleteStudent,
    handleStudentLogin,
    handleGetCourseMetadataByBatchId,
    handleGetCourseforStudents,
    handleGetQuestionforStudent
} = require("./students/students-middle-controler.js");

// Import controllers for courses
const {
    handleInsertCourseMetadata,
    handleGetAllCoursesMetadata,
    handleGetCourseByIdMetadata,
    handleUpdateCourseMetadata,
    handleDeleteCourseMetadata,
    handleGetCoursesByBatchId,
} = require("./courses/course-middle-controler.js");


// Import controllers for units and questions
const {
    handleAddCourse,
    handleGetCourse,
    handleUpdateCourse,
    handleDeleteCourse,
    handleAddUnit,
    handleGetUnits,
    handleUpdateUnit,
    handleDeleteUnit,
    handleAddSubUnit,
    handleGetSubUnits,
    handleUpdateSubUnit,
    handleDeleteSubUnit,
} = require("./units and questions/units-and-questions-middle-controler.js");



const app = express();
const PORT = 3000;

// Middleware Section
// --------------------------------------------------------------------------------
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Routes for Universities
// --------------------------------------------------------------------------------
app.get("/universities", handleGetAllUniversities); // Fetch all universities
app.get("/universities/:uid", handleGetUniversityByUid); // Fetch a university by UID
app.post("/universities", handleInsertUniversity); // Insert a new university
app.put("/universities/:uid", handleUpdateUniversity); // Update a university by UID
app.delete("/universities/:uid", handleDeleteUniversity); // Delete a university by UID
app.post("/universities/login", handleUniversityLogin); // University login
app.post("/universities/upload-students", uploadMiddleware.single("file"), handleUploadStudentsExcel); //

// Routes for Batches
// --------------------------------------------------------------------------------
app.post("/batches", handleAddBatch); // Add a new batch
app.get("/batches", handleGetAllBatches); // Fetch all batches
app.get("/batches/university/:universityId", handleGetBatchesByUniversityId); // Fetch batches by university ID
app.get("/batches/:batchId", handleGetBatchById); // Fetch a batch by batch ID
app.put("/batches/:batchId", handleUpdateBatch); // Update a batch by batch ID
app.delete("/batches/:batchId", handleDeleteBatch); // Delete a batch by batch ID

// Routes for Students
// --------------------------------------------------------------------------------
app.post("/students", handleInsertStudent); // Add a new student
app.get("/students", handleGetAllStudents); // Fetch all students
app.get("/students/:studentId", handleGetStudentById); // Fetch a student by ID
app.get("/students/university/:uniId", handleGetStudentsByUniversityId); // Fetch students by university ID
app.get("/students/batch/:batchId", handleGetStudentsByBatchId); // Fetch students by batch ID
app.put("/students/:studentId", handleUpdateStudent); // Update a student by ID
app.delete("/students/:studentId", handleDeleteStudent); // Delete a student by ID
app.post("/students/login", handleStudentLogin); // Student login
app.get("/students/course-metadata/batch/:batchId", handleGetCourseMetadataByBatchId); // Fetch course metadata by batch ID
app.get("/students/course/:courseId", handleGetCourseforStudents); // Fetch a course by course ID for students
app.post("/students/questions", handleGetQuestionforStudent); // Fetch questions for a student

// Routes for Courses
// --------------------------------------------------------------------------------
app.post("/coursesmetadata", handleInsertCourseMetadata); // Add a new course
app.get("/coursesmetadata", handleGetAllCoursesMetadata); // Fetch all courses
app.get("/coursesmetadata/:courseId", handleGetCourseByIdMetadata); // Fetch a course by ID
app.put("/coursesmetadata/:courseId", handleUpdateCourseMetadata); // Update a course by ID
app.delete("/coursesmetadata/:courseId", handleDeleteCourseMetadata); // Delete a course by ID
app.get("/coursesmetadata/batch/:batchId", handleGetCoursesByBatchId); // Fetch courses by batch ID



// Routes for units and questions
// --------------------------------------------------------------------------------
// Course-level operations
app.post("/courses", handleAddCourse); // Add a new course
app.get("/courses/:courseId", handleGetCourse); // Fetch a course by ID
app.put("/courses/:courseId", handleUpdateCourse); // Update a course by ID
app.delete("/courses/:courseId", handleDeleteCourse); // Delete a course by ID

// Unit-level operations
app.post("/courses/:courseId/units", handleAddUnit); // Add a new unit to a course
app.get("/courses/:courseId/units", handleGetUnits); // Fetch all units of a course
app.put("/courses/:courseId/units/:unitId", handleUpdateUnit); // Update a unit by ID
app.delete("/courses/:courseId/units/:unitId", handleDeleteUnit); // Delete a unit by ID

// Sub-unit-level operations
app.post("/courses/:courseId/units/:unitId/sub-units", handleAddSubUnit); // Add a new sub-unit to a unit
app.get("/courses/:courseId/units/:unitId/sub-units", handleGetSubUnits); // Fetch all sub-units of a unit
app.put("/courses/:courseId/units/:unitId/sub-units/:subUnitId", handleUpdateSubUnit); // Update a sub-unit by ID
app.delete("/courses/:courseId/units/:unitId/sub-units/:subUnitId", handleDeleteSubUnit); // Delete a sub-unit by ID


// Start the Server
// --------------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});