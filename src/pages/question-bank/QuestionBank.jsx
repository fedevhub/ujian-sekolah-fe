import { useState, useEffect } from "react";
import { Plus, CircleNotch } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button";
import Input from "../../components/input";
import Pagination from "../../components/pagination";
import Modal from "../../components/modal";
import QuestionTable from "./components/question-table";
import QuestionDelete from "./components/question-delete";
import FilterDropdown from "../../components/filter-dropdown";
import {
    useQuestionsByCourse,
    useDeleteQuestion,
} from "../../hooks/useQuestions";
import { useDebounce } from "../../hooks/useDebounce";
import { useDisclosure } from "../../hooks/useDisclosure";

const QuestionBank = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const deleteModal = useDisclosure();
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const [pagination, setPagination] = useState({
        current_page: 1,
        limit: 10,
    });
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [selectedType, setSelectedType] = useState("");

    useEffect(() => {
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    }, [debouncedSearch]);

    const {
        data: questionsData,
        isLoading,
        isFetching,
    } = useQuestionsByCourse(courseId, {
        page: pagination.current_page,
        limit: pagination.limit,
        search: debouncedSearch,
        type: selectedType || undefined,
    });

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const deleteQuestionMutation = useDeleteQuestion();

    const questions = questionsData?.data || [];
    const queryPagination = questionsData?.pagination || {
        current_page: 1,
        total_page: 1,
        total_data: 0,
        limit: 10,
    };

    const loading = isLoading || isFetching || deleteQuestionMutation.isPending;

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, current_page: newPage }));
    };

    const handleLimitChange = (newLimit) => {
        setPagination((prev) => ({ ...prev, limit: newLimit, current_page: 1 }));
    };

    const handleDeleteClick = (question) => {
        setSelectedQuestion(question);
        deleteModal.open();
    };

    const handleDeleteConfirm = async (question) => {
        try {
            await deleteQuestionMutation.mutateAsync(question.id);
            deleteModal.close();
            setSelectedQuestion(null);
        } catch (err) {
            // Error ditangani secara internal di dalam komponen QuestionDelete
            console.error("Gagal menghapus soal:", err);
        }
    };

    return (
        <div className="flex w-full flex-col gap-6 px-1 pb-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight text-[#1D2939]">Bank Soal</h1>
                    <p className="mt-0.5 text-[#475467]">
                        Pengelolaan dan penyusunan soal ujian dalam satu tempat.
                    </p>
                </div>
                <Button
                    variant="primary"
                    className="h-11 w-full gap-2 md:w-auto"
                    onClick={() => navigate(`/question-bank/${courseId}/create`)}
                >
                    <Plus size={18} />
                    Tambah Soal
                </Button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-end">
                    <div className="flex flex-1 items-end gap-3">
                        <div className="flex-1">
                            <Input
                                label="Search"
                                placeholder="Cari soal..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <FilterDropdown
                            options={[
                                { label: "Semua Tipe", value: "" },
                                { label: "Pilihan Ganda", value: "multiple_choice" },
                                { label: "Esai", value: "essay" },
                            ]}
                            selectedValue={selectedType}
                            onSelect={handleTypeSelect}
                            className="w-full md:w-auto"
                            placeholder="Filter"
                        />
                    </div>
                </div>

                <div className="relative min-h-50">
                    {loading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                            <CircleNotch size={32} className="animate-spin text-[#465FFF]" />
                        </div>
                    )}
                    <QuestionTable
                        questions={questions}
                        currentPage={queryPagination.current_page}
                        limit={queryPagination.limit}
                        onEdit={(question) =>
                            navigate(`/question-bank/${courseId}/edit/${question.id}`)
                        }
                        onDelete={handleDeleteClick}
                    />
                </div>

                <Pagination
                    currentPage={queryPagination.current_page}
                    totalPages={queryPagination.total_page}
                    limit={pagination.limit}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                />
            </div>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close}>
                <QuestionDelete
                    question={selectedQuestion}
                    onClose={deleteModal.close}
                    onDelete={handleDeleteConfirm}
                    isLoading={loading}
                    error={deleteQuestionMutation.error}
                />
            </Modal>
        </div>
    );
};

export default QuestionBank;