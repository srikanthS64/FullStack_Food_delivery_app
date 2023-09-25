import axios from "axios";


export const baseURL = "http://localhost:5001/fullstact-food-delivery-app"

export const validateUserJWTToken = async (token) => {
    try {
        const res = await axios.get(`${baseURL}/api/users/jwtverfication`, {
            headers : {Authorization: "Bearer "+ token}
        })
        return res.data.data
    } catch (err) {
        return null;
    }
}