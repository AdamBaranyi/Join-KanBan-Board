import { useNavigate } from "react-router-dom";
import AddTaskForm from "../components/AddTaskForm";
import "./AddTask.css";

export default function AddTask() {
  const navigate = useNavigate();

  return (
    <main className="content-container add-task-page">
      <div className="add-task-header">
        <h1>Add Task</h1>
      </div>
      <div className="add-task-form-wrapper">
        <AddTaskForm
          onTaskAdded={() => {
            setTimeout(() => {
              navigate("/board");
            }, 1500);
          }}
          onCancel={() => navigate(-1)}
        />
      </div>
    </main>
  );
}
