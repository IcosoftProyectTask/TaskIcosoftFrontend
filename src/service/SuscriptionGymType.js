import { isAxiosError } from "axios";
import api from "../lib/axios";

//obtener tipo de subcripciones
export async function getSuscriptiongymtype() {
    try {
        const { data } = await api.get("/suscriptiongymtype");
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}


