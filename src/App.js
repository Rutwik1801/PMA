import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import NewProjectForm from "./pages/NewProjectForm";
import NewTaskForm from "./pages/NewTaskForm";
import TasksPage from "./pages/TasksPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFoundPage from "./pages/NotFound";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/:id" element={<TasksPage />} />
        <Route path="/new-project" element={<NewProjectForm />} />
        <Route path="/projects/:id/new-task" element={<NewTaskForm />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* REACT - TOASTIFY */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
