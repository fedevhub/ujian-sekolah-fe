import { useNavigate } from "react-router-dom";
import { PencilSimpleLine, ListChecks, Trash } from "@phosphor-icons/react";
import Table from "../../../components/table";
import Button from "../../../components/button";
import Badge from "../../../components/badge";
import { formatDateTimeWithComma } from "../../../utils/date";

const ExamTableTeacher = ({ data = [], onAction }) => {
    const navigate = useNavigate();

    const teacherColumns = [
        {
            header: "Ujian",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-[#344054] truncate">
                        {row.title}
                    </span>
                    <span className="text-xs text-[#475467] line-clamp-1">
                        {row.description}
                    </span>
                </div>
            ),
        },
        {
            header: "Mata Pelajaran",
            render: (row) => (
                <span className="text-[#475467] line-clamp-2">{row.course?.title}</span>
            ),
        },
        {
            header: "Waktu Mulai - Selesai",
            className: "whitespace-nowrap",
            render: (row) => {
                const start = row.start_time || row.start_at || row.start_date;
                const end = row.end_time || row.end_at || row.end_date;

                return (
                    <span className="text-[#475467]">
                        {formatDateTimeWithComma(start)} s/d {formatDateTimeWithComma(end)}
                    </span>
                );
            },
        },
        {
            header: "Durasi",
            className: "whitespace-nowrap",
            render: (row) => (
                <span className="inline-flex rounded bg-[#ECF3FF] px-2.5 py-1 text-[#3641F5]">
                    {row.duration ?? 0} Menit
                </span>
            ),
        },
    ];

    return (
        <div className="[&>div]:border-0 [&>div]:shadow-none [&>div]:rounded-none">
            <Table
                columns={teacherColumns}
                data={data}
                renderActions={(row, closeMenu) => (
                    <div className="flex flex-col">
                        <Button
                            variant="ghost"
                            className="justify-start! rounded-none! h-10 px-4 gap-2.5"
                            onClick={() => {
                                onAction?.("edit", row);
                                closeMenu();
                            }}
                        >
                            <PencilSimpleLine size={18} className="text-gray-500" />
                            <span className="font-medium text-gray-700">Edit Ujian</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="justify-start! rounded-none! h-10 px-4 gap-2.5"
                            onClick={() => {
                                onAction?.("questions", row);
                                closeMenu();
                            }}
                        >
                            <ListChecks size={18} className="text-gray-500" />
                            <span className="font-medium text-gray-700">Kelola Soal</span>
                        </Button>
                        <div className="border-t border-gray-100" />
                        <Button
                            variant="ghostDestructive"
                            className="justify-start! rounded-none! h-10 px-4 gap-2.5"
                            onClick={() => {
                                onAction?.("delete", row);
                                closeMenu();
                            }}
                        >
                            <Trash size={18} />
                            <span className="font-medium">Delete Ujian</span>
                        </Button>
                    </div>
                )}
            />
        </div>
    );
};

export default ExamTableTeacher;