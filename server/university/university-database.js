import supabaseClient from "../supabase-client.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This section contains the database activity functions for handling requests related to universities.

async function getAllUniversities() {
    try {
        const { data, error } = await supabaseClient
            .from("universities")
            .select("*");

        if (error) {
            console.error("Error fetching universities:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error:", err);

        throw err;
    }
}


async function insertUniversity(university) {
    try {
        const { data, error } = await supabaseClient
            .from("universities")
            .insert([university]);

        if (error) {
            console.error("Error inserting university:", error);
            return { success: false, message: "Failed to insert university", error };
        }

        console.log("University inserted successfully:", data);
        return { success: true, message: "University inserted successfully", data };
    } catch (err) {
        console.error("Unexpected error during insertion:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}



async function updateUniversity(uid, fieldsToUpdate) {
    try {
        const { data, error } = await supabaseClient
            .from("universities")
            .update(fieldsToUpdate)
            .eq("uid", uid);

        if (error) {
            console.error("Error updating university:", error);
            return { success: false, message: "Failed to update university", error };
        }

        console.log("University updated successfully:", data);
        return { success: true, message: "University updated successfully", data };
    } catch (err) {
        console.error("Unexpected error during update:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}


//example usage
// await updateUniversity("123e4567-e89b-12d3-a456-426614174000", {
//   uni_name: "Updated University Name",
//   uni_contact_num: "9876543210"
// });

async function deleteUniversity(uid) {
    try {
        const { data, error } = await supabaseClient
            .from("universities")
            .delete()
            .eq("uid", uid);

        if (error) {
            console.error("Error deleting university:", error);
            return { success: false, message: "Failed to delete university", error };
        }

        console.log("University deleted successfully:", data);
        return { success: true, message: "University deleted successfully", data };
    } catch (err) {
        console.error("Unexpected error during deletion:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}


async function getUniversityByUid(uid) {
    try {
        const { data, error } = await supabaseClient
            .from("universities")
            .select("*")
            .eq("uid", uid)
            .single(); // Ensures only one record is returned

        if (error) {
            console.error("Error fetching university by UID:", error);
            return { success: false, message: "Failed to fetch university", error };
        }

        return { success: true, message: "University fetched successfully", data };
    } catch (err) {
        console.error("Unexpected error during fetching university by UID:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}


async function loginUniversity(email, password) {
    try {
        const { data, error } = await supabaseClient
            .from("universities")
            .select("uid, name, email, password")
            .eq("email", email)
            .eq("password", password)
            .single(); // Ensures only one record is returned

        if (error) {
            console.error("Error during university login:", error);
            return { success: false, message: "Invalid email or password", error };
        }

        return { success: true, message: "Login successful", data };
    } catch (err) {
        console.error("Unexpected error during university login:", err);
        return { success: false, message: "Unexpected error occurred", error: err };
    }
}

// This section contains the database activity functions for handling requests related to universities.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Exporting the functions for use in other modules
export {
    getAllUniversities,
    insertUniversity,
    updateUniversity,
    deleteUniversity,
    getUniversityByUid,
    loginUniversity
};