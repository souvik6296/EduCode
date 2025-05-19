import { getDatabase, ref, set, push, update, remove, get, child } from "firebase/database";
// import app from "../firebase-config.js";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
    databaseURL: "https://ai-projects-d261b-default-rtdb.firebaseio.com/"
  };
  const firebaseApp = initializeApp(firebaseConfig);

const db = getDatabase(firebaseApp);

// Function to add a new course
async function addCourse(courseId, courseData) {
    try {
        const courseRef = ref(db, `EduCode/Courses/${courseId}`);
        await set(courseRef, courseData);
        return { success: true, message: "Course added successfully" };
    } catch (error) {
        console.error("Error adding course:", error);
        return { success: false, message: "Failed to add course", error };
    }
}

// Function to get a course by course ID
async function getCourse(courseId) {
    try {
        const courseRef = ref(db, `EduCode/Courses/${courseId}`);
        const snapshot = await get(courseRef);
        if (snapshot.exists()) {
            return { success: true, data: snapshot.val() };
        } else {
            return { success: false, message: "Course not found" };
        }
    } catch (error) {
        console.error("Error fetching course:", error);
        return { success: false, message: "Failed to fetch course", error };
    }
}

// Function to update a course
async function updateCourse(courseId, updates) {
    try {
        const courseRef = ref(db, `EduCode/Courses/${courseId}`);
        await update(courseRef, updates);
        return { success: true, message: "Course updated successfully" };
    } catch (error) {
        console.error("Error updating course:", error);
        return { success: false, message: "Failed to update course", error };
    }
}

// Function to delete a course
async function deleteCourse(courseId) {
    try {
        const courseRef = ref(db, `EduCode/Courses/${courseId}`);
        await remove(courseRef);
        return { success: true, message: "Course deleted successfully" };
    } catch (error) {
        console.error("Error deleting course:", error);
        return { success: false, message: "Failed to delete course", error };
    }
}

// Function to add a unit to a course
async function addUnit(courseId, unitData) {
    try {
        const unitsRef = ref(db, `EduCode/Courses/${courseId}/units`);
        const newUnitRef = push(unitsRef);
        await set(newUnitRef, unitData);
        return { success: true, message: "Unit added successfully", unitId: newUnitRef.key };
    } catch (error) {
        console.error("Error adding unit:", error);
        return { success: false, message: "Failed to add unit", error };
    }
}

// Function to update a unit in a course
async function updateUnit(courseId, unitId, updates) {
    try {
        const unitRef = ref(db, `EduCode/Courses/${courseId}/units/${unitId}`);
        await update(unitRef, updates);
        return { success: true, message: "Unit updated successfully" };
    } catch (error) {
        console.error("Error updating unit:", error);
        return { success: false, message: "Failed to update unit", error };
    }
}

// Function to delete a unit from a course
async function deleteUnit(courseId, unitId) {
    try {
        const unitRef = ref(db, `EduCode/Courses/${courseId}/units/${unitId}`);
        await remove(unitRef);
        return { success: true, message: "Unit deleted successfully" };
    } catch (error) {
        console.error("Error deleting unit:", error);
        return { success: false, message: "Failed to delete unit", error };
    }
}

// Function to get all units of a course
async function getUnits(courseId) {
    try {
        const unitsRef = ref(db, `EduCode/Courses/${courseId}/units`);
        const snapshot = await get(unitsRef);
        if (snapshot.exists()) {
            return { success: true, data: snapshot.val() };
        } else {
            return { success: false, message: "No units found" };
        }
    } catch (error) {
        console.error("Error fetching units:", error);
        return { success: false, message: "Failed to fetch units", error };
    }
}

// Function to add a sub-unit to a unit
async function addSubUnit(courseId, unitId, subUnitData) {
    try {
        const subUnitsRef = ref(db, `EduCode/Courses/${courseId}/units/${unitId}/sub-units`);
        const newSubUnitRef = push(subUnitsRef);
        await set(newSubUnitRef, subUnitData);
        return { success: true, message: "Sub-unit added successfully", subUnitId: newSubUnitRef.key };
    } catch (error) {
        console.error("Error adding sub-unit:", error);
        return { success: false, message: "Failed to add sub-unit", error };
    }
}

// Function to update a sub-unit
async function updateSubUnit(courseId, unitId, subUnitId, updates) {
    try {
        const subUnitRef = ref(db, `EduCode/Courses/${courseId}/units/${unitId}/sub-units/${subUnitId}`);
        await update(subUnitRef, updates);
        return { success: true, message: "Sub-unit updated successfully" };
    } catch (error) {
        console.error("Error updating sub-unit:", error);
        return { success: false, message: "Failed to update sub-unit", error };
    }
}

// Function to delete a sub-unit
async function deleteSubUnit(courseId, unitId, subUnitId) {
    try {
        const subUnitRef = ref(db, `EduCode/Courses/${courseId}/units/${unitId}/sub-units/${subUnitId}`);
        await remove(subUnitRef);
        return { success: true, message: "Sub-unit deleted successfully" };
    } catch (error) {
        console.error("Error deleting sub-unit:", error);
        return { success: false, message: "Failed to delete sub-unit", error };
    }
}

// Function to get all sub-units of a unit
async function getSubUnits(courseId, unitId) {
    try {
        const subUnitsRef = ref(db, `EduCode/Courses/${courseId}/units/${unitId}/sub-units`);
        const snapshot = await get(subUnitsRef);
        if (snapshot.exists()) {
            return { success: true, data: snapshot.val() };
        } else {
            return { success: false, message: "No sub-units found" };
        }
    } catch (error) {
        console.error("Error fetching sub-units:", error);
        return { success: false, message: "Failed to fetch sub-units", error };
    }
}

// Export all functions
export {
    addCourse,
    getCourse,
    updateCourse,
    deleteCourse,
    addUnit,
    updateUnit,
    deleteUnit,
    getUnits,
    addSubUnit,
    updateSubUnit,
    deleteSubUnit,
    getSubUnits,
};