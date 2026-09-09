import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddTaskForm from "../components/AddTaskForm";
import "./AddTask.css";

export default function AddTask() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className="content-container add-task-page">
      <div className="add-task-header">
        <h1>{t("addTask.pageTitle")}</h1>
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
