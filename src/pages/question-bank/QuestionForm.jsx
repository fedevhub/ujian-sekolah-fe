// import { useEffect, useState } from "react";
// import { CaretLeft, CircleNotch } from "@phosphor-icons/react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";
// import Button from "../../components/button";
// import Input from "../../components/input";
// import {
//     useCreateQuestion,
//     useQuestionDetail,
//     useUpdateQuestion,
// } from "../../hooks/useQuestions";

// const QuestionForm = ({ mode = "create" }) => {
//     const navigate = useNavigate();
//     const { courseId, questionId } = useParams();
//     const isEdit = mode === "edit";

//     const [questionText, setQuestionText] = useState("");
//     const [type, setType] = useState("multiple_choice");
//     const [options, setOptions] = useState(["", "", "", ""]);
//     const [correctAnswer, setCorrectAnswer] = useState("");

//     const { data: question, isLoading } = useQuestionDetail(questionId, isEdit);
//     const createMutation = useCreateQuestion();
//     const updateMutation = useUpdateQuestion();
//     const saving = createMutation.isPending || updateMutation.isPending;

//     useEffect(() => {
//         if (!question || !isEdit) return;

//         setQuestionText(question.question_text || question.question || "");
//         setType(question.type || "multiple_choice");
//         setOptions(Array.isArray(question.options) ? question.options : ["", "", "", ""]);
//         setCorrectAnswer(question.correct_answer || "");
//     }, [question, isEdit]);

//     const handleOptionChange = (index, value) => {
//         setOptions((currentOptions) =>
//             currentOptions.map((option, optionIndex) =>
//                 optionIndex === index ? value : option,
//             ),
//         );
//     };

//     const handleSave = async () => {
//         if (!questionText.trim()) {
//             toast.error("Silakan isi pertanyaan");
//             return;
//         }

//         if (type === "multiple_choice" && options.some((option) => !option.trim())) {
//             toast.error("Lengkapi semua pilihan jawaban");
//             return;
//         }

//         if (type === "multiple_choice" && !correctAnswer) {
//             toast.error("Pilih jawaban yang benar");
//             return;
//         }

//         const payload = {
//             course_id: Number(courseId),
//             question_text: questionText.trim(),
//             type,
//             ...(type === "multiple_choice"
//                 ? { options: options.map((option) => option.trim()), correct_answer: correctAnswer }
//                 : {}),
//         };

//         try {
//             if (isEdit) {
//                 await updateMutation.mutateAsync({ id: questionId, data: payload });
//             } else {
//                 await createMutation.mutateAsync(payload);
//             }
//             navigate(`/question-bank/${courseId}`);
//         } catch (error) {
//             console.error("Error saving question:", error);
//             toast.error("Gagal menyimpan soal");
//         }
//     };

//     return (
//         <div className="flex flex-col w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
//             {isLoading && (
//                 <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
//                     <CircleNotch size={32} className="text-[#465FFF] animate-spin" />
//                 </div>
//             )}

//             <div className="p-6 lg:p-8 flex flex-col gap-6">
//                 <Button onClick={() => navigate(`/question-bank/${courseId}`)} variant="secondary" glossy className="w-fit">
//                     <CaretLeft size={16} weight="bold" />
//                     Kembali
//                 </Button>

//                 <div>
//                     <h2 className="text-2xl font-bold text-[#1D2939]">
//                         {isEdit ? "Edit Soal" : "Tambah Soal"}
//                     </h2>
//                     <p className="text-[#475467] mt-1">Lengkapi pertanyaan dan jawaban soal.</p>
//                 </div>

//                 <div className="flex flex-col gap-5 max-w-3xl">
//                     <Input
//                         label="Pertanyaan"
//                         placeholder="Masukkan pertanyaan..."
//                         value={questionText}
//                         onChange={(event) => setQuestionText(event.target.value)}
//                     />

//                     <div className="flex flex-col gap-1.5">
//                         <label className="font-medium text-[#344054] text-sm">Tipe Soal</label>
//                         <select
//                             value={type}
//                             onChange={(event) => setType(event.target.value)}
//                             className="h-11 px-3 rounded-[10px] border border-[#e4e7ec] text-sm text-[#344054] outline-none focus:border-[#3641f5]"
//                         >
//                             <option value="multiple_choice">Pilihan Ganda</option>
//                             <option value="essay">Esai</option>
//                         </select>
//                     </div>

//                     {type === "multiple_choice" && (
//                         <div className="flex flex-col gap-3">
//                             <span className="font-medium text-[#344054] text-sm">Pilihan Jawaban</span>
//                             {options.map((option, index) => (
//                                 <div key={index} className="flex items-center gap-3">
//                                     <input
//                                         type="radio"
//                                         name="correct-answer"
//                                         value={index}
//                                         checked={correctAnswer === String(index)}
//                                         onChange={() => setCorrectAnswer(String(index))}
//                                     />
//                                     <Input
//                                         placeholder={`Pilihan ${index + 1}`}
//                                         value={option}
//                                         onChange={(event) => handleOptionChange(index, event.target.value)}
//                                         className="flex-1"
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
//                 <Button variant="secondary" glossy onClick={() => navigate(`/question-bank/${courseId}`)} disabled={saving}>
//                     Batal
//                 </Button>
//                 <Button onClick={handleSave} disabled={saving || isLoading}>
//                     {saving ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default QuestionForm;

import { useEffect, useState } from "react";
import { CaretDown, CaretLeft, CircleNotch, Plus, X } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/button";
import Input from "../../components/input";
import {
    useCreateQuestion,
    useQuestionDetail,
    useUpdateQuestion,
} from "../../hooks/useQuestions";

const getOptionText = (option) =>
    typeof option === "object"
        ? option.option_text || option.text || option.value || option.content || ""
        : String(option);

const getOptionOrder = (option, index) => {
    if (!option || typeof option !== "object") return index;
    const order = option.order ?? option.sort_order ?? option.position ?? option.id ?? option.option_id;
    const numericOrder = Number(order);
    return Number.isFinite(numericOrder) ? numericOrder : index;
};

const normalizeOptions = (question) => {
    const rawOptions =
        question?.options ??
        question?.question_options ??
        question?.answer_options ??
        question?.choices ??
        [];

    const parsedOptions =
        typeof rawOptions === "string"
            ? (() => {
                try {
                    const parsed = JSON.parse(rawOptions);
                    return Array.isArray(parsed) ? parsed : parsed?.data || [];
                } catch {
                    return [];
                }
            })()
            : Array.isArray(rawOptions?.data)
                ? rawOptions.data
                : Array.isArray(rawOptions)
                    ? rawOptions
                    : [];

    return parsedOptions
        .map((option, index) => ({ option, index }))
        .sort((a, b) => getOptionOrder(a.option, a.index) - getOptionOrder(b.option, b.index))
        .map(({ option }) => ({
            text: getOptionText(option),
            isCorrect: Boolean(option?.is_correct),
        }));
};

const ActiveQuestionForm = ({ mode = "create" }) => {
    const navigate = useNavigate();
    const { courseId, questionId } = useParams();
    const isEdit = mode === "edit";
    const [questionText, setQuestionText] = useState("");
    const [type, setType] = useState("");
    const [options, setOptions] = useState(["", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
    const createQuestion = useCreateQuestion();
    const updateQuestion = useUpdateQuestion();
    const { data: question, isLoading: isQuestionLoading } = useQuestionDetail(
        questionId,
        isEdit,
    );
    const saving = createQuestion.isPending || updateQuestion.isPending;

    useEffect(() => {
        if (!isEdit || !question) return;

        setQuestionText(question.question_text || question.question || "");
        setType(question.type || "essay");
        const normalizedOptions = normalizeOptions(question);
        const questionOptions = normalizedOptions.map((option) => option.text);
        setOptions(questionOptions.length > 0 ? questionOptions : ["", "", ""]);

        const savedAnswer = question.correct_answer;
        const correctOptionIndex = normalizedOptions.findIndex((option) => option.isCorrect);
        const answerIndex = questionOptions.findIndex((option) => String(option) === String(savedAnswer));
        setCorrectAnswer(
            correctOptionIndex >= 0
                ? String(correctOptionIndex)
                : savedAnswer === undefined || savedAnswer === null
                    ? ""
                    : answerIndex >= 0
                        ? String(answerIndex)
                        : String(savedAnswer),
        );
    }, [isEdit, question]);

    const handleOptionChange = (index, value) => {
        setOptions((currentOptions) =>
            currentOptions.map((option, optionIndex) =>
                optionIndex === index ? value : option,
            ),
        );
    };

    const handleAddOption = () => {
        setOptions((currentOptions) => [...currentOptions, ""]);
    };

    const handleTypeSelect = (selectedType) => {
        setType(selectedType);
        setCorrectAnswer("");
        setIsTypeMenuOpen(false);
    };

    const handleRemoveOption = (index) => {
        if (options.length <= 2) {
            toast.error("Minimal harus ada dua opsi jawaban");
            return;
        }

        setOptions((currentOptions) =>
            currentOptions.filter((_, optionIndex) => optionIndex !== index),
        );
        setCorrectAnswer((currentAnswer) => {
            if (currentAnswer === String(index)) return "";
            if (Number(currentAnswer) > index) return String(Number(currentAnswer) - 1);
            return currentAnswer;
        });
    };

    const handleSave = async () => {
        if (!type) {
            toast.error("Pilih tipe soal terlebih dahulu");
            return;
        }
        if (!questionText.trim()) {
            toast.error("Isi teks pertanyaan terlebih dahulu");
            return;
        }
        if (type === "multiple_choice" && options.some((option) => !option.trim())) {
            toast.error("Lengkapi semua opsi jawaban");
            return;
        }
        if (type === "multiple_choice" && !correctAnswer) {
            toast.error("Pilih satu opsi jawaban yang benar");
            return;
        }

        try {
            const payload = {
                question_text: questionText.trim(),
                type,
                ...(type === "multiple_choice"
                    ? {
                        options: options.map((option, index) => ({
                            option_text: option.trim(),
                            is_correct: correctAnswer === String(index),
                        })),
                    }
                    : {}),
            };

            if (isEdit) {
                await updateQuestion.mutateAsync({
                    id: questionId,
                    data: { course_id: Number(courseId), ...payload },
                });
            } else {
                await createQuestion.mutateAsync({
                    course_id: Number(courseId),
                    ...payload,
                });
            }
            navigate(`/question-bank/${courseId}`);
        } catch (error) {
            console.error("Gagal menyimpan soal:", error);
            const serverMessage =
                error.response?.data?.message || error.response?.data?.errors;
            const message = typeof serverMessage === "object"
                ? Object.values(serverMessage).flat().join(" ")
                : serverMessage;
            toast.error(message || (isEdit ? "Gagal mengubah soal" : "Gagal menambahkan soal"));
        }
    };

    return (
        <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {isQuestionLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                    <CircleNotch size={32} className="animate-spin text-[#465FFF]" />
                </div>
            )}
            <div className="grid gap-8 p-6 lg:grid-cols-[1fr_1.5fr] lg:gap-14 lg:p-8">
                <div className="flex flex-col items-start">
                    <Button
                        variant="secondary"
                        glossy
                        className="mb-4"
                        onClick={() => navigate(`/question-bank/${courseId}`)}
                    >
                        <CaretLeft size={16} weight="bold" />
                        Kembali
                    </Button>
                    <h2 className="text-2xl font-medium text-[#1D2939]">
                        {isEdit ? "Edit Soal" : "Tambah Soal"}
                    </h2>
                    <p className="mt-1 max-w-xs text-sm leading-relaxed text-[#667085]">
                        {isEdit
                            ? "Perbarui pertanyaan dan opsi jawaban pada Bank Soal."
                            : "Tambahkan pertanyaan ke dalam Bank Soal. Tentukan tipe soal dan opsi jawabannya."}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#344054]" htmlFor="question-type">
                            Tipe Soal
                        </label>
                        <div className="relative w-full">
                            <button
                                id="question-type"
                                type="button"
                                aria-haspopup="listbox"
                                aria-expanded={isTypeMenuOpen}
                                onClick={() => setIsTypeMenuOpen((isOpen) => !isOpen)}
                                className="flex h-10 w-full items-center justify-between rounded-[10px] border border-[#e4e7ec] bg-white px-3 text-left text-sm text-[#344054] outline-none focus:border-[#3641f5]"
                            >
                                <span>
                                    {type === "multiple_choice"
                                        ? "Pilihan Ganda"
                                        : type === "essay"
                                            ? "Esai"
                                            : "Pilih Tipe Soal"}
                                </span>
                                <CaretDown size={16} className="text-[#667085]" />
                            </button>
                            {isTypeMenuOpen && (
                                <div
                                    role="listbox"
                                    aria-labelledby="question-type"
                                    className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-[10px] border border-gray-200 bg-white py-1 shadow-lg"
                                >
                                    {[
                                        { value: "", label: "Pilih Tipe Soal" },
                                        { value: "multiple_choice", label: "Pilihan Ganda" },
                                        { value: "essay", label: "Esai" },
                                    ].map((option) => (
                                        <button
                                            key={option.value || "empty"}
                                            type="button"
                                            role="option"
                                            aria-selected={type === option.value}
                                            onClick={() => handleTypeSelect(option.value)}
                                            className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[#F9FAFB] ${type === option.value
                                                ? "bg-[#F0F2FF] text-[#3641f5]"
                                                : "text-[#344054]"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#344054]" htmlFor="question-text">
                            Teks Pertanyaan
                        </label>
                        <textarea
                            id="question-text"
                            rows={3}
                            placeholder="Masukkan teks pertanyaan..."
                            value={questionText}
                            onChange={(event) => setQuestionText(event.target.value)}
                            className="w-full resize-none rounded-[10px] border border-[#e4e7ec] px-3 py-2.5 text-sm text-[#344054] outline-none placeholder:text-[#98a2b3] focus:border-[#3641f5]"
                        />
                    </div>

                    {type === "multiple_choice" && (
                        <div className="flex flex-col gap-3 border-t border-gray-100 pt-3">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-[#344054]">Opsi Jawaban</span>
                                <span className="text-xs text-[#98A2B3]">
                                    Pilih <span className="text-[#3641f5]">Satu</span> Opsi Benar
                                </span>
                            </div>
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 rounded-[10px] border px-3 py-1 ${correctAnswer === String(index)
                                        ? "border-[#8CE5BD] bg-[#ECFDF3]"
                                        : "border-transparent bg-[#F2F4F7]"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="correct-answer"
                                        checked={correctAnswer === String(index)}
                                        onChange={() => setCorrectAnswer(String(index))}
                                        aria-label={`Tandai opsi ${index + 1} sebagai jawaban benar`}
                                        className="accent-[#3641f5]"
                                    />
                                    <span className="w-4 text-xs font-medium text-[#667085]">
                                        {String.fromCharCode(65 + index)}.
                                    </span>
                                    <Input
                                        placeholder={`Ketikkan opsi ${String.fromCharCode(65 + index)}...`}
                                        value={option}
                                        onChange={(event) => handleOptionChange(index, event.target.value)}
                                        className="flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveOption(index)}
                                        className="p-2 text-[#98A2B3] transition-colors hover:text-[#D92D20]"
                                        aria-label={`Hapus opsi ${index + 1}`}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddOption}
                                className="flex w-fit items-center gap-2 text-sm font-medium text-[#3641f5] hover:text-[#2932c7]"
                            >
                                <Plus size={16} />
                                Tambah Opsi Lainnya
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-3">
                <Button
                    variant="secondary"
                    onClick={() => navigate(`/question-bank/${courseId}`)}
                    disabled={saving || isQuestionLoading}
                >
                    Batal
                </Button>
                <Button onClick={handleSave} disabled={saving || isQuestionLoading}>
                    {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Soal"}
                </Button>
            </div>
        </div>
    );
};

export default ActiveQuestionForm;
