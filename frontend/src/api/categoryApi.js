import { api } from "./axios";

export const listCategories = () => api.get("/categories");
