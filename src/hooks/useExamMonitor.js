import { useQuery } from "@tanstack/react-query";
import { examService } from "../services/examService";

// Get all active exams
export const useActiveExams = () => {
  return useQuery({
    queryKey: ["active-exams"],
    queryFn: async () => {
      const response = await examService.getActiveExams();
      if (!response.success)
        throw new Error(response.message || "Gagal mengambil data ujian aktif");
      const payload = response.data;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.exams)) return payload.exams;
      if (Array.isArray(payload?.items)) return payload.items;
      if (Array.isArray(payload?.rows)) return payload.rows;
      return [];
    },
    refetchInterval: 5000,
  });
};

// Get specific exam monitor details (student attempts list)
export const useExamMonitorDetails = (examId, page, limit) => {
  return useQuery({
    queryKey: ["exam-monitor", examId, { page, limit }],
    queryFn: async () => {
      const response = await examService.getExamMonitor(examId, {
        page,
        limit,
      });
      if (!response.success || !response.data) {
        throw new Error("Gagal mengambil data monitor ujian");
      }
      return response.data;
    },
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000,
  });
};

// The API does not expose a Socket.IO endpoint, so monitor updates use polling.
export const useExamMonitorSocket = () => {};
