import { isAxiosError } from "axios";
import api from "../lib/axios";


//obtener grafica1
export async function getGraficaCurrent() {
    try {
        const data = await api.get("/statistics/income/current-year/monthly");
        return data.data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function getCurrentMonth() {
    try {
        const data = await api.get("/statistics/income/daily-current-month");
        return data.data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function getComparisonByYear() {
    try {
        const data = await api.get("/statistics/income/comparison-by-year");
        return data.data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function getCheckIns() {
    try {
        const data = await api.get("/statistics/check-in-stats-years");
        return data.data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}


export async function getCountLastDays() {
    try {
        const data = await api.get("/statistics/count-last-31-days");
        return data.data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

