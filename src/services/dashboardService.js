import api from "../config/api";

export const dashboardService = {
    getAdminStats: async () => {
        const response = await api.get("dashboard/admin");
        return response.data;
    },
};