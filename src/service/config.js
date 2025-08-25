import axios from "axios";
import {localStorageUtil, keysLocalStorage } from "../util/localStorage"
const BASE_URL = "https://movienew.cybersoft.edu.vn/api";
const authorization = localStorageUtil.get(keysLocalStorage.INFO_USER)?.accessToken;
export const axiosCustom = axios.create({
    headers: {
        TokenCybersoft:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8",
        Authorization: `Bearer ` + authorization,
    },
    baseURL: BASE_URL,
});