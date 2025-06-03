import {
    insertStudent,
    getAllStudents,
    getStudentById,
    getStudentsByUniversityId,
    getStudentsByBatchId,
    updateStudent,
    deleteStudent,
    loginStudent,
    getCourseMetadataByBatchId
} from "./student-database.js";

// Controller to handle inserting a new student
async function handleInsertStudent(req, res) {
    try {
        const student = req.body; // Assuming the student data is sent in the request body
        const result = await insertStudent(student);
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in handleInsertStudent:", error);
        res.status(500).json({ success: false, message: "Unexpected error occurred", error });
    }
}

// Controller to handle fetching all students
async function handleGetAllStudents(req, res) {
    try {
        const result = await getAllStudents();
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in handleGetAllStudents:", error);
        res.status(500).json({ success: false, message: "Unexpected error occurred", error });
    }
}

// Controller to handle fetching a student by student ID
async function handleGetStudentById(req, res) {
    try {
        const { studentId } = req.params; // Assuming the student ID is sent as a URL parameter
        const result = await getStudentById(studentId);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result); // Return 404 if the student is not found
        }
    } catch (error) {
        console.error("Error in handleGetStudentById:", error);
        res.status(500).json({ success: false, message: "Unexpected error occurred", error });
    }
}

// Controller to handle fetching students by university ID
async function handleGetStudentsByUniversityId(req, res) {
    try {
        const { uniId } = req.params; // Assuming the university ID is sent as a URL parameter
        const result = await getStudentsByUniversityId(uniId);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result); // Return 404 if no students are found
        }
    } catch (error) {
        console.error("Error in handleGetStudentsByUniversityId:", error);
        res.status(500).json({ success: false, message: "Unexpected error occurred", error });
    }
}

// Controller to handle fetching students by batch ID
async function handleGetStudentsByBatchId(req, res) {
    try {
        const { batchId } = req.params; // Assuming the batch ID is sent as a URL parameter
        const result = await getStudentsByBatchId(batchId);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result); // Return 404 if no students are found
        }
    } catch (error) {
        console.error("Error in handleGetStudentsByBatchId:", error);
        res.status(500).json({ success: false, message: "Unexpected error occurred", error });
    }
}

// Controller to handle updating a student
async function handleUpdateStudent(req, res) {
    try {
        const { studentId } = req.params; // Assuming the student ID is sent as a URL parameter
        const fieldsToUpdate = req.body; // Assuming the fields to update are sent in the request body
        const result = await updateStudent(studentId, fieldsToUpdate);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in handleUpdateStudent:", error);
        res.status(500).json({ success: false, message: "Unexpected error occurred", error });
    }
}

// Controller to handle deleting a student
async function handleDeleteStudent(req, res) {
    try {
        const { studentId } = req.params; // Assuming the student ID is sent as a URL parameter
        const result = await deleteStudent(studentId);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in handleDeleteStudent:", error);
        res.status(500).json({ success: false, message: "Unexpected error occurred", error });
    }
}

// Controller to handle student login
async function handleStudentLogin(req, res) {
    try {
        const { userId, password } = req.body; // Assuming the user ID and password are sent in the request body
        const result = await loginStudent(userId, password);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(401).json(result); // Return 401 for invalid credentials
        }
    } catch (error) {
        console.error("Error in handleStudentLogin:", error);
        res.status(500).json({ success: false, message: "Unexpected error occurred", error });
    }
}

// Controller to handle fetching course metadata by batch ID
async function handleGetCourseMetadataByBatchId(req, res) {
    try {
        const { batchId } = req.params; // Assuming the batch ID is sent as a URL parameter
        const result = await getCourseMetadataByBatchId(batchId);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result); // Return 404 if no metadata is found
        }
    } catch (error) {
        console.error("Error in handleGetCourseMetadataByBatchId:", error);
        res.status(500).json({ success: false, message: "Unexpected error occurred", error });
    }
}

// Export all controllers
export {
    handleInsertStudent,
    handleGetAllStudents,
    handleGetStudentById,
    handleGetStudentsByUniversityId,
    handleGetStudentsByBatchId,
    handleUpdateStudent,
    handleDeleteStudent,
    handleGetCourseMetadataByBatchId,
    handleStudentLogin,
};