import { useState, useEffect } from "react";
import { Plus, CircleNotch, CaretLeft } from "@phosphor-icons/react";
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

    const loading = isLoading || deleteQuestionMutation.isPending;

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, current_page: newPage }));
    };

    const handleLimitChange = (newLimit) => {
        setPagination((prev) => ({ ...prev, limit: newLimit, current_page: 1 }));
    };

    const handleDeleteClick = (question) => {
        setSelectedQuestion(question);
        deleteModal.onOpen();
    };

    const handleDeleteConfirm = async (question) => {
        try {
            await deleteQuestionMutation.mutateAsync(question.id);
            deleteModal.onClose();
            setSelectedQuestion(null);
        } catch (err) {
            // Error ditangani secara internal di dalam komponen QuestionDelete
            console.error("Gagal menghapus soal:", err);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 mb-2"
                    >
                        <CaretLeft size={16} />
                        Kembali
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Bank Soal</h1>
                    <p className="text-sm text-gray-500">
                        Kelola daftar pertanyaan dan tipe soal untuk kursus ini.
                    </p>
                </div>
                <Button
                    variant="primary"
                    className="gap-2"
                    onClick={() => navigate(`/question-bank/${courseId}/create`)}
                >
                    <Plus size={18} />
                    Tambah Soal
                </Button>
            </div>

            {/* Filter & Search Section */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="w-full md:w-96">
                    <Input
                        placeholder="Cari pertanyaan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <FilterDropdown
                        options={[
                            { label: "Semua Tipe", value: "" },
                            { label: "Pilihan Ganda", value: "multiple_choice" },
                            { label: "Esai", value: "essay" },
                        ]}
                        selectedValue={selectedType}
                        onSelect={handleTypeSelect}
                        placeholder="Filter Tipe Soal"
                    />
                    {isFetching && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CircleNotch size={16} className="animate-spin" />
                            Memperbarui...
                        </div>
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 flex-1">
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

            {/* Pagination Section */}
            {queryPagination.total_page > 1 && (
                <div className="flex justify-end">
                    <Pagination
                        currentPage={queryPagination.current_page}
                        totalPage={queryPagination.total_page}
                        limit={queryPagination.limit}
                        totalData={queryPagination.total_data}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                    />
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
                <QuestionDelete
                    question={selectedQuestion}
                    onClose={deleteModal.onClose}
                    onDelete={handleDeleteConfirm}
                    isLoading={loading}
                    error={deleteQuestionMutation.error}
                />
            </Modal>
        </div>
    );
};

export default QuestionBank;