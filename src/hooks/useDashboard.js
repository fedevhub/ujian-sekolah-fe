import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export const useAdminStats = (enabled = true) => {
    return useQuery({
        queryKey: ["dashboard-admin"],
        queryFn: async () => {
            const response = await dashboardService.getAdminStats();
            if (!response.success) throw new Error("Gagal mengambil statistik admin");
            return response.data;
        },
        enabled,
    });
};
