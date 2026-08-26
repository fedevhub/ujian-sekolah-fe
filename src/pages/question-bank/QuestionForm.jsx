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

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button";
import Input from "../../components/input";
import { useCreateQuestion } from "../../hooks/useQuestions";

const ActiveQuestionForm = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [questionText, setQuestionText] = useState("");
    const createQuestion = useCreateQuestion();

    const handleSave = async () => {
        if (!questionText.trim()) return;
        await createQuestion.mutateAsync({
            course_id: Number(courseId),
            question_text: questionText.trim(),
            type: "essay",
        });
        navigate(`/question-bank/${courseId}`);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-[#1D2939]">Tambah Soal</h2>
            <Input
                label="Pertanyaan"
                placeholder="Masukkan pertanyaan..."
                value={questionText}
                onChange={(event) => setQuestionText(event.target.value)}
            />
            <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => navigate(`/question-bank/${courseId}`)}>
                    Batal
                </Button>
                <Button onClick={handleSave} disabled={createQuestion.isPending}>
                    {createQuestion.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
            </div>
        </div>
    );
};

export default ActiveQuestionForm;
