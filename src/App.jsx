import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/protected-route";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/not-found/NotFound";
import User from "./pages/user/User"; 
import UserForm from "./pages/user/UserForm";
import Course from "./pages/course/Course";
import CourseForm from "./pages/course/CourseForm";
import StudentManagement from "./pages/course/StudentManagement";
import ExamList from "./pages/exam/management/ExamList";
import ExamForm from "./pages/exam/management/ExamForm";
import QuestionManagement from "./pages/exam/management/QuestionManagement";
import CourseList from "./pages/question-bank/CourseList";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/users">
                <Route index element={<User />} />
                <Route path="create" element={<UserForm mode="create" />} />
                <Route path="edit/:id" element={<UserForm mode="edit" />} />
              </Route>

              <Route path="/courses">
                <Route index element={<Course />} />
                <Route path="create" element={<CourseForm mode="create" />} />
                <Route path="edit/:id" element={<CourseForm mode="edit" />} />
                <Route path=":id/students" element={<StudentManagement />} />
              </Route>                        
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['teacher']} />} />
              <Route path="/exams">
                <Route index element={<ExamList />} />
                <Route path="create" element={<ExamForm mode="create" />} />
                <Route path="edit/:id" element={<ExamForm mode="edit" />} />
                <Route path=":id/questions" element={<QuestionManagement />} />
              </Route>
              <Route path="/question-bank">
                <Route index element={<CourseList />} />
              </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;