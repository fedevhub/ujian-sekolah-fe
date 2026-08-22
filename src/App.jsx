// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { useState } from "react";

// import Button from "./components/button";
// import Input from "./components/input";
// import Modal from "./components/modal";


// const App = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="*"
//           element={
//             <div className="flex gap-4 w-1/3 justify-center p-4 items-center">
//               <Input
//                 label="name"
//                 id="name"
//                 placeholder="Masukkan nama anda"
//                 required
//               />

//               <Button onClick={() => setIsModalOpen(true)}>
//                 Click Me
//               </Button>

//               <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//                 <div className="p-6">
//                   <h2 className="text-lg font-semibold text-[#344054]">Modal Example</h2>
//                   <p className="mt-2 text-sm text-[#667085]">
//                     Ini hanya mockup modal sederhana.
//                   </p>
//                   <div className="mt-6 flex justify-end">
//                     <Button onClick={() => setIsModalOpen(false)}>Close</Button>
//                   </div>
//                 </div>
//               </Modal>
//             </div>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Layout from "./layouts/layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Layout />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;