import supabaseClient from "../supabase-client.js";
import { getDatabase, ref, set, push, update, remove, get, child } from "firebase/database";
// import app from "../firebase-config.js";
import { initializeApp } from "firebase/app";
import baseUrl from "../j0baseUrl.js";
import compilerCache from "../compilerCache.js";
import hiddenTestCasesCache from "../hiddenTestCasesCache.js";





// Firebase configuration
const firebaseConfig = {
    databaseURL: "https://ai-projects-d261b-default-rtdb.firebaseio.com/"
};
const firebaseApp = initializeApp(firebaseConfig);

const db = getDatabase(firebaseApp);

// Function to insert a new student
async function insertStudent(student) {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .insert([student]);

        if (error) {
            console.error("Error inserting student:", error);
            return { success: false, message: "Failed to insert student", error };
        }

        console.log("Student inserted successfully:", data);
        return { success: true, message: "Student inserted successfully", data };
    } catch (err) {
        console.error("Unexpected error during student insertion:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}

// Function to get all students
async function getAllStudents() {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .select("*");

        if (error) {
            console.error("Error fetching all students:", error);
            return { success: false, message: "Failed to fetch students", error };
        }

        return { success: true, message: "Students fetched successfully", data };
    } catch (err) {
        console.error("Unexpected error during fetching students:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}

// Function to get a student by student_id
async function getStudentById(studentId) {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .select("*")
            .eq("student_id", studentId)
            .single();

        if (error) {
            console.error("Error fetching student by ID:", error);
            return { success: false, message: "Failed to fetch student", error };
        }

        return { success: true, message: "Student fetched successfully", data };
    } catch (err) {
        console.error("Unexpected error during fetching student by ID:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}

// Function to get students by university ID
async function getStudentsByUniversityId(uniId) {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .select("*")
            .eq("uni_id", uniId);

        if (error) {
            console.error("Error fetching students by university ID:", error);
            return { success: false, message: "Failed to fetch students", error };
        }

        return { success: true, message: "Students fetched successfully", data };
    } catch (err) {
        console.error("Unexpected error during fetching students by university ID:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}

// Function to get students by batch ID
async function getStudentsByBatchId(batchId) {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .select("*")
            .eq("batch_id", batchId);

        if (error) {
            console.error("Error fetching students by batch ID:", error);
            return { success: false, message: "Failed to fetch students", error };
        }

        return { success: true, message: "Students fetched successfully", data };
    } catch (err) {
        console.error("Unexpected error during fetching students by batch ID:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}

// Function to update student data
async function updateStudent(studentId, fieldsToUpdate) {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .update(fieldsToUpdate)
            .eq("student_id", studentId);

        if (error) {
            console.error("Error updating student:", error);
            return { success: false, message: "Failed to update student", error };
        }

        console.log("Student updated successfully:", data);
        return { success: true, message: "Student updated successfully", data };
    } catch (err) {
        console.error("Unexpected error during student update:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}

// Function to delete a student
async function deleteStudent(studentId) {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .delete()
            .eq("student_id", studentId);

        if (error) {
            console.error("Error deleting student:", error);
            return { success: false, message: "Failed to delete student", error };
        }

        console.log("Student deleted successfully:", data);
        return { success: true, message: "Student deleted successfully", data };
    } catch (err) {
        console.error("Unexpected error during student deletion:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}

// Function for login logic
async function loginStudent(userId, password) {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .select("student_id, student_name, profile_image_link, batch_id, phone_num, uni_reg_id, section, email_id, uni_id")
            .eq("user_id", userId)
            .eq("password", password)
            .single();

        if (error) {
            console.error("Error during student login:", error);
            return { success: false, message: "Invalid credentials", error };
        }

        return { success: true, message: "Login successful", data };
    } catch (err) {
        console.error("Unexpected error during student login:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}


// Function to get course metadata for a given batch
async function getCourseMetadataByBatchId(batchId) {
    try {
        // Get registered_courses_id field from the batches table
        const { data: batchData, error: batchError } = await supabaseClient
            .from("batches")
            .select("registered_courses_id")
            .eq("batch_id", batchId)
            .single();

        if (batchError) {
            console.error("Error fetching batch data:", batchError);
            return { success: false, message: "Failed to fetch batch information", error: batchError };
        }

        const courseIds = batchData.registered_courses_id;

        // If no courses are registered, return an empty array
        if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
            return { success: true, message: "No courses registered for this batch", data: [] };
        }

        // Fetch course metadata from the courses table for each course ID
        const { data: courses, error: coursesError } = await supabaseClient
            .from("courses")
            .select("*")
            .in("course_id", courseIds);

        if (coursesError) {
            console.error("Error fetching course metadata:", coursesError);
            return { success: false, message: "Failed to fetch course metadata", error: coursesError };
        }

        return { success: true, message: "Course metadata fetched successfully", data: courses };
    } catch (err) {
        console.error("Unexpected error fetching course metadata:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}



// Function to get a course by course ID with student progress details
async function getCourseforStudents(courseId, studentId) {
    try {
        const courseRef = ref(db, `EduCode/Courses/${courseId}`);
        const snapshot = await get(courseRef);

        if (!snapshot.exists()) {
            return { success: false, message: "Course not found" };
        }

        const courseData = snapshot.val();

        // Deep copy to avoid modifying original
        const cleanCourseData = JSON.parse(JSON.stringify(courseData));

        // Traverse and remove 'mcq' and 'coding' fields from sub-units
        for (const unitId in cleanCourseData.units) {
            const unit = cleanCourseData.units[unitId];
            if (unit['sub-units']) {
                for (const subUnitId in unit['sub-units']) {
                    const subUnit = unit['sub-units'][subUnitId];

                    // Remove 'mcq' and 'coding' keys if they exist
                    delete subUnit.mcq;
                    delete subUnit.coding;

                    // Fetch progress details from the resumes table
                    const { data: resumeData, error: resumeError } = await supabaseClient
                        .from("resumes")
                        .select("subunit_coding_status, subunit_mcq_status")
                        .eq("student_id", studentId)
                        .eq("course_id", courseId)
                        .eq("unit_id", unitId)
                        .eq("sub_unit_id", subUnitId)
                        .single();

                    if (resumeError) {
                        console.error(`Error fetching resume data for sub-unit ${subUnitId}:`, resumeError);
                        subUnit.codingStatus = "not_started";
                        subUnit.mcqStatus = "not_started";
                    } else {
                        subUnit.codingStatus = resumeData?.subunit_coding_status || "not_started";
                        subUnit.mcqStatus = resumeData?.subunit_mcq_status || "not_started";
                    }
                }
            }
        }

        return { success: true, data: cleanCourseData };
    } catch (error) {
        console.error("Error fetching course:", error);
        return { success: false, message: "Failed to fetch course", error };
    }
}

async function getQuestionforStudent(courseId, unitId, subUnitId, studentId, questionType) {
    try {
        const unitPath = `EduCode/Courses/${courseId}/units/${unitId}/sub-units/${subUnitId}`;

        // Step 1: Check the resumes table for resumed questions
        const { data: resumeData, error: resumeError } = await supabaseClient
            .from("resumes")
            .select("resumed_coding_question_ids, resumed_mcq_question_ids, subunit_coding_status, subunit_mcq_status")
            .eq("student_id", studentId)
            .eq("course_id", courseId)
            .eq("unit_id", unitId)
            .eq("sub_unit_id", subUnitId)
            .single();

        if (resumeError) {
            console.error("Error fetching resume data:", resumeError);
        }

        // Step 2: Fetch the full sub-unit data from Firebase
        const courseRef = ref(db, unitPath);
        const snapshot = await get(courseRef);
        if (!snapshot.exists()) {
            return { success: false, message: "Sub-unit not found" };
        }
        const subUnitData = snapshot.val();

        let questionsToReturn = {};

        // Helper function to get last submitted code for a question
        const getLastSubmission = async (questionId) => {
            const { data: submissionData, error: submissionError } = await supabaseClient
                .from("student_submission")
                .select("submission_id, last_submission, status, last_submitted_code")
                .eq("student_id", studentId)
                .eq("course_id", courseId)
                .eq("unit_id", unitId)
                .eq("sub_unit_id", subUnitId)
                .eq("question_id", questionId)
                .order("last_submission", { ascending: false })
                .limit(1);

            if (submissionError || !submissionData || submissionData.length === 0) {
                return null;
            }
            return submissionData[0];
        };

        // Step 3: If resumed data exists, return those specific questions with last submission
        if (resumeData && questionType === "Coding" && resumeData.resumed_coding_question_ids?.length > 0) {
            const coding = subUnitData.coding || {};
            const selected = await Promise.all(resumeData.resumed_coding_question_ids.map(async (id) => {
                const q = coding[id];
                if (!q) return null;

                // Get last submission for this question
                const lastSubmission = await getLastSubmission(id);

                const { ["compiler-code"]: _, ["hidden-test-cases"]: __, ...rest } = q;
                return {
                    id,
                    ...rest,
                    lastSubmission: lastSubmission || null
                };
            }));

            questionsToReturn.codingQuestions = selected.filter(Boolean);
            return {
                success: true,
                message: "Resumed questions fetched successfully",
                data: questionsToReturn
            };
        }

        if (resumeData && questionType === "MCQ" && resumeData.resumed_mcq_question_ids?.length > 0) {
            const mcq = subUnitData.mcq || {};
            const selected = resumeData.resumed_mcq_question_ids.map(id => mcq[id]).filter(Boolean);
            questionsToReturn.mcqQuestions = selected;
            return {
                success: true,
                message: "Resumed questions fetched successfully",
                data: questionsToReturn
            };
        }

        // Step 4: If no resumed data, pick fresh questions
        if (questionType === "Coding") {
            const codingQuestions = subUnitData.coding || {};
            const questionToBeShown = subUnitData.question_to_be_shown || 2;

            const codingArray = Object.entries(codingQuestions).map(([id, q]) => ({ id, ...q }));
            const selected = codingArray.sort(() => Math.random() - 0.5).slice(0, questionToBeShown);

            // Remove compiler-code & hidden-test-cases and add empty lastSubmission
            const cleanSelected = selected.map(({ ["compiler-code"]: _, ["hidden-test-cases"]: __, ...rest }) => ({
                ...rest,
                lastSubmission: null
            }));

            questionsToReturn.codingQuestions = cleanSelected;
            var codingIds = selected.map(q => q.id);
        }

        if (questionType === "MCQ") {
            const mcqQuestions = subUnitData.mcq || {};
            const shuffle = subUnitData["shuffle-questions"];
            const mcqArray = Object.entries(mcqQuestions).map(([id, q]) => ({ id, ...q }));

            const selected = shuffle ? mcqArray.sort(() => Math.random() - 0.5) : mcqArray;

            questionsToReturn.mcqQuestions = selected;
            var mcqIds = selected.map(q => q.id);
        }

        // Step 5: Save selected question IDs in resume
        const resumePayload = {
            student_id: studentId,
            course_id: courseId,
            unit_id: unitId,
            sub_unit_id: subUnitId,
            resumed_coding_question_ids: codingIds || [],
            resumed_mcq_question_ids: mcqIds || [],
            subunit_coding_status: questionType === "Coding" ? "resumed" : resumeData?.subunit_coding_status || "not_started",
            subunit_mcq_status: questionType === "MCQ" ? "resumed" : resumeData?.subunit_mcq_status || "not_started"
        };

        const { error: saveResumeError } = await supabaseClient.from("resumes").upsert(resumePayload);
        if (saveResumeError) {
            console.error("Error saving resume data:", saveResumeError);
            return { success: false, message: "Failed to save resume data", error: saveResumeError };
        }

        return {
            success: true,
            message: "Questions fetched successfully",
            data: questionsToReturn
        };
    } catch (error) {
        console.error("Unexpected error in getQuestionforStudent:", error);
        return { success: false, message: "Unexpected error occurred", error };
    }
}



























///Compilation Section


// Helper: Encode to base64
function encryptBase64(data) {
    return Buffer.from(data, "utf-8").toString("base64");
}

// Helper: Decode from base64
function decryptBase64(data) {
    return Buffer.from(data, "base64").toString("utf-8");
}

// Helper: Sleep for polling
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function compileAndRun(userWrittenCode, languageId, sampleInputOutput, courseId, unitId, subUnitId, questionId, studentId) {
    try {
        // 1. Get compiler code (preset correct solution) from cache or Firebase
        const cacheKey = `${courseId}&${unitId}&${subUnitId}&${questionId}`;
        let compilerCode = compilerCache[cacheKey];
        // let compilerCode;
        if (!compilerCode) {
            const compilerRef = ref(db, `EduCode/Courses/${courseId}/units/${unitId}/sub-units/${subUnitId}/coding/${questionId}/compiler-code/code`);
            const snapshot = await get(compilerRef);
            if (!snapshot.exists()) {
                return { success: false, message: "Compiler code not found" };
            }
            compilerCode = snapshot.val().trim();
            compilerCache[cacheKey] = compilerCode;
        }
        // return {compilerCode}

        // 2. Save user's submission (optional, can be kept as before)
        const { data: submissionData, error: submissionError } = await supabaseClient
            .from('student_submission')
            .upsert({
                student_id: studentId,
                course_id: courseId,
                unit_id: unitId,
                sub_unit_id: subUnitId,
                question_id: questionId,
                last_submitted_code: userWrittenCode,
                status: "resumed",
                last_submission: new Date().toISOString()
            }, {
                onConflict: ['student_id', 'course_id', 'unit_id', 'sub_unit_id', 'question_id']
            })
            .select('submission_id');

        if (submissionError) {
            console.error('Error saving submission:', submissionError);
            return { success: false, message: "Cannot save last submission", error: submissionError };
        }

        // 3. Prepare submissions (for BOTH compiler code and user code)
        const submissions = sampleInputOutput.flatMap(([input]) => [
            // Submission for COMPILER CODE (correct solution)
            {
                source_code: encryptBase64(compilerCode),
                language_id: languageId,
                stdin: encryptBase64(input)
            },
            // Submission for USER CODE
            {
                source_code: encryptBase64(userWrittenCode),
                language_id: languageId,
                stdin: encryptBase64(input)
            }
        ]);

        // 4. Submit BOTH codes to Judge0 in a single batch
        const submitRes = await fetch(`${baseUrl}/submissions/batch?base64_encoded=true`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ submissions })
        });
        const submitJson = await submitRes.json();
        const tokens = submitJson.map(obj => obj.token);
        if (!tokens || !tokens.length) {
            return { success: false, message: "No submission tokens returned", error: submitJson };
        }

        // 5. Poll for ALL results (both compiler and user code runs)
        const results = await Promise.all(tokens.map(async token => {
            let result;
            while (true) {
                const res = await fetch(`${baseUrl}/submissions/${token}?base64_encoded=true`);
                result = await res.json();
                if (result.status && result.status.id >= 3) break;
                await sleep(1500);
            }
            // Decode base64 fields
            if (result.stdout) result.stdout = decryptBase64(result.stdout);
            if (result.stderr) result.stderr = decryptBase64(result.stderr);
            if (result.compile_output) result.compile_output = decryptBase64(result.compile_output);
            if (result.message) result.message = decryptBase64(result.message);
            return result;
        }));

        // 6. Compare compiler output (expected) vs user output (actual)
        const formattedResults = sampleInputOutput.map(([input, expectedOutput], index) => {
            const compilerResult = results[index * 2];     // Even indices: Compiler code runs
            const userResult = results[index * 2 + 1];    // Odd indices: User code runs

            const testCasePassed = 
                userResult.stdout?.trim() === compilerResult.stdout?.trim();

            return {
                [`testCase${index + 1}`]: {
                    
                    // compilerResult
                    input: input.trim(),
                    testCasePassed,
                    expectedOutput: compilerResult.stdout?.trim() || "",
                    userOutput: userResult.stdout?.trim() || "",
                    compilerMessage: compilerResult.stderr || userResult.compile_output || userResult.stderr || userResult.message || null
                }
            };
        });

        // 7. Determine overall submission status
        const allTestsPassed = formattedResults.every(testCase =>
            Object.values(testCase)[0].testCasePassed
        );
        const hasErrors = formattedResults.some(testCase =>
            Object.values(testCase)[0].compilerMessage
        );

        const submissionStatus = allTestsPassed ? 'Accepted' :
            hasErrors ? 'Error' : 'Rejected';

        return {
            success: true,
            results: formattedResults,
            submissionStatus,
            submissionId: submissionData?.[0]?.submission_id || null
        };
    } catch (error) {
        console.error("Error in compileAndRun:", error);
        return { success: false, message: "Unexpected error occurred", error };
    }
}


async function submitandcompile(userWrittenCode, languageId, courseId, unitId, subUnitId, questionId, studentId) {
    try {
        // 1. Check cache for compiler code and hidden test cases
        const cacheKey = `${courseId}&${unitId}&${subUnitId}&${questionId}`;
        
        let compilerCode = compilerCache[cacheKey];
        let hiddenTestCases = hiddenTestCasesCache[cacheKey];

        // Fetch compiler code if not in cache
        if (!compilerCode) {
            const compilerRef = ref(db, `EduCode/Courses/${courseId}/units/${unitId}/sub-units/${subUnitId}/coding/${questionId}/compiler-code/code`);
            const compilerSnapshot = await get(compilerRef);
            if (!compilerSnapshot.exists()) {
                return { success: false, message: "Compiler code not found" };
            }
            compilerCode = compilerSnapshot.val();
            compilerCache[cacheKey] = compilerCode;
        }

        // Fetch hidden test cases if not in cache
        if (!hiddenTestCases) {
            const testCasesRef = ref(db, `EduCode/Courses/${courseId}/units/${unitId}/sub-units/${subUnitId}/coding/${questionId}/hidden-test-cases`);
            const testCasesSnapshot = await get(testCasesRef);
            if (!testCasesSnapshot.exists() || !testCasesSnapshot.val().length) {
                return { success: false, message: "Hidden test cases not found" };
            }
            hiddenTestCases = testCasesSnapshot.val();
            hiddenTestCasesCache[cacheKey] = hiddenTestCases;
        }

        // Format test cases: [input, expectedOutput][]
        const testCases = hiddenTestCases.map(testCase => [testCase.input, testCase.output]);

        // 2. Save submission status as "submitted"
        const { data: submissionData, error: submissionError } = await supabaseClient
            .from('student_submission')
            .upsert({
                student_id: studentId,
                course_id: courseId,
                unit_id: unitId,
                sub_unit_id: subUnitId,
                question_id: questionId,
                last_submitted_code: userWrittenCode,
                status: "submitted",
                last_submission: new Date().toISOString()
            }, {
                onConflict: ['student_id', 'course_id', 'unit_id', 'sub_unit_id', 'question_id']
            })
            .select('submission_id');

        if (submissionError) {
            console.error('Error saving submission:', submissionError);
            return { success: false, message: "Cannot save submission", error: submissionError };
        }

        // 3. Prepare submissions for BOTH compiler code and user code
        const submissions = testCases.flatMap(([input]) => [
            // Compiler code (correct solution)
            {
                source_code: encryptBase64(compilerCode),
                language_id: languageId,
                stdin: encryptBase64(input)
            },
            // User code
            {
                source_code: encryptBase64(userWrittenCode),
                language_id: languageId,
                stdin: encryptBase64(input)
            }
        ]);

        // 4. Submit batch to Judge0
        const submitRes = await fetch(`${baseUrl}/submissions/batch?base64_encoded=true`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ submissions })
        });
        const submitJson = await submitRes.json();
        const tokens = submitJson.map(obj => obj.token);
        if (!tokens || !tokens.length) {
            return { success: false, message: "No submission tokens returned", error: submitJson };
        }

        // 5. Poll for results (both compiler and user code runs)
        const results = await Promise.all(tokens.map(async token => {
            let result;
            while (true) {
                const res = await fetch(`${baseUrl}/submissions/${token}?base64_encoded=true`);
                result = await res.json();
                if (result.status && result.status.id >= 3) break;
                await sleep(1500);
            }
            // Decode base64 fields
            if (result.stdout) result.stdout = decryptBase64(result.stdout);
            if (result.stderr) result.stderr = decryptBase64(result.stderr);
            if (result.compile_output) result.compile_output = decryptBase64(result.compile_output);
            if (result.message) result.message = decryptBase64(result.message);
            return result;
        }));

        // 6. Compare compiler output (expected) vs user output (actual)
        let passedCount = 0;
        const formattedResults = testCases.map(([input], index) => {
            const compilerResult = results[index * 2];     // Compiler code result
            const userResult = results[index * 2 + 1];    // User code result
            const isPassed = userResult.stdout?.trim() === compilerResult.stdout?.trim();

            if (isPassed) passedCount++;

            return {
                [`hiddenTestCase${index + 1}`]: {
                    testCasePassed: isPassed,
                    compilerMessage: userResult.compile_output || userResult.stderr || userResult.message || null
                }
            };
        });

        // 7. Determine submission status
        const allTestsPassed = passedCount === testCases.length;
        const hasErrors = formattedResults.some(testCase =>
            Object.values(testCase)[0].compilerMessage
        );

        const submissionStatus = allTestsPassed ? 'Accepted' :
            hasErrors ? 'Error' : 'Rejected';

        return {
            success: true,
            results: formattedResults,
            submissionStatus,
            passedCount,
            totalCount: testCases.length,
            totalMarks: testCases.length * 10, // Assuming each hidden test case is worth 10 marks
            marksObtained: passedCount * 10,
            submissionId: submissionData?.[0]?.submission_id || null
        };
    } catch (error) {
        console.error("Error in submitandcompile:", error);
        return { success: false, message: "Unexpected error occurred", error };
    }
}

/**
 * Submit test results and update resume status for coding questions
 * @param {Object} details - All required details for results and resume update
 * @returns {Promise<Object>} - Success or error object
 */
async function submitTest(details) {
    const {
        university_id,
        student_id,
        course_id,
        unit_id,
        sub_unit_id,
        result_type, // 'coding' or 'mcq'
        score : marks_obtained, // Marks obtained by the student
        total: total_marks, // Total marks for the test
        submitted_at // should be ISO string
    } = details;
    try {
        // 0. Delete previous result with same unique fields
        await supabaseClient
            .from("results")
            .delete()
            .eq("university_id", university_id)
            .eq("student_id", student_id)
            .eq("course_id", course_id)
            .eq("unit_id", unit_id)
            .eq("sub_unit_id", sub_unit_id)
            .eq("result_type", result_type);
        // 1. Insert into results table
        const { data: resultData, error: resultError } = await supabaseClient
            .from("results")
            .insert([{
                university_id,
                student_id,
                course_id,
                unit_id,
                sub_unit_id,
                result_type,
                marks_obtained,
                total_marks,
                submitted_at
            }]);
        if (resultError) {
            return { success: false, message: "Failed to insert result", error: resultError };
        }
        // 2. Update resumes table based on result_type
        let updateFields = {};
        if (result_type === "coding") {
            updateFields = {
                resumed_coding_question_ids: [],
                subunit_coding_status: "completed"
            };
        } else if (result_type === "mcq") {
            updateFields = {
                resumed_mcq_question_ids: [],
                subunit_mcq_status: "completed"
            };
        }
        const { error: resumeError } = await supabaseClient
            .from("resumes")
            .update(updateFields)
            .eq("student_id", student_id)
            .eq("course_id", course_id)
            .eq("unit_id", unit_id)
            .eq("sub_unit_id", sub_unit_id);
        if (resumeError) {
            return { success: false, message: "Failed to update resume", error: resumeError };
        }
        return { success: true, message: "Test submitted and resume updated successfully", data: resultData };
    } catch (err) {
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}

/**
 * Get student profile by student_id
 * @param {string} studentId
 * @returns {Promise<Object>} - Profile fields or error
 */
async function getStudentProfile(studentId) {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .select("student_name, password, profile_image_link, user_id, phone_num, uni_reg_id, section, email_id")
            .eq("student_id", studentId)
            .single();
        if (error) {
            return { success: false, message: "Failed to fetch student profile", error };
        }
        return { success: true, data };
    } catch (err) {
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}

/**
 * Update any number of fields for a student by student_id
 * @param {string} studentId
 * @param {Object} fieldsToUpdate
 * @returns {Promise<Object>} - Success or error object
 */
async function updateStudentFields(studentId, fieldsToUpdate) {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .update(fieldsToUpdate)
            .eq("student_id", studentId)
            .select();
        if (error) {
            return { success: false, message: "Failed to update student fields", error };
        }
        return { success: true, message: "Student fields updated successfully", data };
    } catch (err) {
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}

/**
 * Get test result status by unique fields, fetch score and total from results table
 * @param {Object} params - { university_id, student_id, course_id, unit_id, sub_unit_id, result_type }
 * @returns {Promise<Object>} - { total, marks_obtained, percentage, status }
 */
async function getTestResultStatus(params) {
    const { university_id, student_id, course_id, unit_id, sub_unit_id, result_type } = params;
    try {
        const { data, error } = await supabaseClient
            .from("results")
            .select("marks_obtained, total_marks")
            .eq("university_id", university_id)
            .eq("student_id", student_id)
            .eq("course_id", course_id)
            .eq("unit_id", unit_id)
            .eq("sub_unit_id", sub_unit_id)
            .eq("result_type", result_type)
            .single();
        if (error || !data) {
            return { success: false, message: "Result not found", error };
        }
        const total = Number(data.total_marks);
        const marks_obtained = Number(data.marks_obtained);
        if (isNaN(total) || isNaN(marks_obtained) || total === 0) {
            return { success: false, message: "Invalid total or marks obtained" };
        }
        const percentage = (marks_obtained / total) * 100;
        const status = percentage >= 50 ? "passed" : "failed";
        return {
            success: true,
            total,
            marks_obtained,
            percentage: Number(percentage.toFixed(2)),
            status
        };
    } catch (err) {
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}

// Helper to detect image content type from buffer (no file-type)
function detectImageMimeType(buffer) {
    if (!buffer || buffer.length < 4) return null;
    // JPEG
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return 'image/jpeg';
    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return 'image/png';
    // GIF
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return 'image/gif';
    // BMP
    if (buffer[0] === 0x42 && buffer[1] === 0x4D) return 'image/bmp';
    // WEBP
    if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return 'image/webp';
    return 'application/octet-stream';
}

// Upload an image buffer to Supabase Storage and return the public URL
async function uploadStudentImage(imageBuffer, filename) {
    try {
        const bucket = "edu-code-student-images";
        const contentType = detectImageMimeType(imageBuffer);
        // Upload the image to Supabase Storage
        const { data, error } = await supabaseClient.storage
            .from(bucket)
            .upload(filename, imageBuffer, {
                cacheControl: '3600',
                upsert: true,
                contentType
            });
        if (error) {
            return { success: false, message: "Failed to upload image", error };
        }
        // Get the public URL
        const { publicURL } = supabaseClient.storage.from(bucket).getPublicUrl(filename).data;
        return { success: true, url: publicURL };
    } catch (error) {
        return { success: false, message: "Failed to upload image", error };
    }
}

// Export all functions
export {
    insertStudent,
    getAllStudents,
    getStudentById,
    getStudentsByUniversityId,
    getStudentsByBatchId,
    updateStudent,
    deleteStudent,
    loginStudent,
    getCourseMetadataByBatchId,
    getCourseforStudents,
    getQuestionforStudent,
    compileAndRun,
    submitandcompile,
    submitTest,
    getStudentProfile,
    updateStudentFields,
    getTestResultStatus,
    uploadStudentImage
};