const BASE_URL = process.env.REACT_APP_BASE_URL

export const fetchAllUsers = async () => {
    const rawResponse = await fetch(`${BASE_URL}/all`);
    return await rawResponse.json();
}

export const fetchUser = async (id) => {
    const rawResponse = await fetch(`${BASE_URL}/users/${id}`);
    return await rawResponse.json();
}

export const createUser = async (user) =>  {
    try {
        const rawResponse = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!rawResponse.ok) {
            throw new Error(`HTTP error! Status: ${rawResponse.status}`);
        }

        return await rawResponse.json();
    } catch (error) {
        console.error("Error in createUser:", error);
        throw error; // Rethrow the error to be caught by the calling code
    }
};

export const updateUser = async(user, id) =>  {
    if(user.id){            // delete user to update, so no collusion
        delete user.id;
    }
    const rawResponse = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(user),
    });
    return await rawResponse.json();
};

export const deleteUser = async(id) => {
    const rawResponse = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
    return await rawResponse.json();
}