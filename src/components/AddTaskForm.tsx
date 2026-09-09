import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { postData, patchData, getData } from "../lib/firebase";
import type {
  Task,
  TaskPriority,
  TaskCategory,
  TaskStatus,
  Contact,
} from "../lib/schemas";
import "./AddTaskForm.css";

type AddTaskFormProps = {
  initialStatus?: TaskStatus;
  initialTask?: Task;
  onTaskAdded?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
  onCancel?: () => void;
};

export default function AddTaskForm({
  initialStatus = "todo",
  initialTask,
  onTaskAdded,
  onTaskUpdated,
  onCancel,
}: AddTaskFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? "");
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority ?? "Medium");
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category ?? "Technical Task");
  const [assignedTo, setAssignedTo] = useState<string[]>(initialTask?.assignedTo ?? []);
  const [subtasks, setSubtasks] = useState<{ title: string; completed: boolean }[]>(initialTask?.subtasks ?? []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsOpen, setContactsOpen] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getData<Record<string, Contact>>("contacts");
        if (data) {
          setContacts(Object.values(data));
        }
      } catch (err) {
        console.error("Failed to load contacts", err);
      }
    })();
  }, []);

  const addSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([
        ...subtasks,
        { title: newSubtaskTitle.trim(), completed: false },
      ]);
      setNewSubtaskTitle("");
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const toggleAssignee = (id: string) => {
    if (assignedTo.includes(id)) {
      setAssignedTo(assignedTo.filter((cId) => cId !== id));
    } else {
      setAssignedTo([...assignedTo, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !dueDate.trim() || !category) {
      setError(t("addTask.errorValidation"));
      return;
    }

    const newTask: Omit<Task, "id"> = {
      title,
      description,
      dueDate,
      priority,
      category,
      status: initialStatus,
      assignedTo,
      subtasks,
      createdAt: Date.now(),
    };

    try {
      if (initialTask) {
        const updatedTask: Task = { ...initialTask, ...newTask };
        await patchData(`tasks/${initialTask.id}`, newTask);
        setSuccess(true);
        if (onTaskUpdated) onTaskUpdated(updatedTask);
      } else {
        const res = await postData("tasks", newTask);
        const createdTask: Task = { ...newTask, id: res.name };
        setSuccess(true);
        if (onTaskAdded) onTaskAdded(createdTask);
      }
    } catch (err) {
      setError(t("addTask.errorSave"));
      console.error(err);
    }
  };

  return (
    <div className="add-task-form-container">
      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="form-content">
          {/* Left Column */}
          <div className="form-left">
            <div className="form-group">
              <label>{t("addTask.titleLabel")}<span className="required">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("addTask.titlePlaceholder")}
                required
              />
            </div>

            <div className="form-group">
              <label>{t("addTask.descLabel")}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("addTask.descPlaceholder")}
              />
            </div>

            <div className="form-group">
              <label>{t("addTask.assignedToLabel")}</label>
              <div className="custom-select-container">
                <div
                  className="custom-select-header"
                  onClick={() => setContactsOpen(!contactsOpen)}
                >
                  {t("addTask.selectContacts")}
                  <img
                    src={`/assets/imgs/arrow_drop_downaa.svg`}
                    alt="toggle"
                    className={contactsOpen ? "open" : ""}
                  />
                </div>
                {contactsOpen && (
                  <div className="custom-select-dropdown">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`dropdown-item ${
                          assignedTo.includes(contact.id) ? "selected" : ""
                        }`}
                        onClick={() => toggleAssignee(contact.id)}
                      >
                        <div className="contact-badge">
                          {contact.firstname[0]}
                          {contact.lastname[0]}
                        </div>
                        <span className="contact-name">
                          {contact.firstname} {contact.lastname}
                        </span>
                        <img
                          src={
                            assignedTo.includes(contact.id)
                              ? "/assets/imgs/checkbox_checked.svg"
                              : "/assets/imgs/checkbox_empty.svg"
                          }
                          alt="checkbox"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-divider"></div>

          {/* Right Column */}
          <div className="form-right">
            <div className="form-group">
              <label>{t("addTask.dueDateLabel")}<span className="required">*</span></label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>{t("addTask.prioLabel")}</label>
              <div className="prio-buttons">
                <button
                  type="button"
                  className={`prio-btn urgent ${
                    priority === "Urgent" ? "active" : ""
                  }`}
                  onClick={() => setPriority("Urgent")}
                >
                  {t("addTask.urgent")} <img src="/assets/imgs/urgent-priority-board.svg" alt="Urgent" />
                </button>
                <button
                  type="button"
                  className={`prio-btn medium ${
                    priority === "Medium" ? "active" : ""
                  }`}
                  onClick={() => setPriority("Medium")}
                >
                  {t("addTask.medium")}{" "}
                  <img src="/assets/imgs/priority_medium.svg" alt="Medium" />
                </button>
                <button
                  type="button"
                  className={`prio-btn low ${
                    priority === "Low" ? "active" : ""
                  }`}
                  onClick={() => setPriority("Low")}
                >
                  {t("addTask.low")} <img src="/assets/imgs/low-priority-board.svg" alt="Low" />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>{t("addTask.categoryLabel")}<span className="required">*</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                required
              >
                <option value="Technical Task">{t("addTask.technicalTask")}</option>
                <option value="User Story">{t("addTask.userStory")}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t("addTask.subtasksLabel")}</label>
              <div className="subtask-input-container">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder={t("addTask.newSubtaskPlaceholder")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSubtask();
                    }
                  }}
                />
                <button type="button" onClick={addSubtask} className="subtask-add-btn">
                  <img src="/assets/imgs/add.png" alt="Add" />
                </button>
              </div>
              <ul className="subtasks-list">
                {subtasks.map((sub, i) => (
                  <li key={i}>
                    <span>{sub.title}</span>
                    <button type="button" onClick={() => removeSubtask(i)}>
                      <img src="/assets/imgs/delete.png" alt="Delete" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <div className="form-required-info">
            <span className="required">*</span>{t("addTask.requiredInfo")}
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                if (onCancel) onCancel();
              }}
            >
              {t("addTask.clearBtn")} <img src="/assets/imgs/iconoir_cancel.svg" alt="Clear" />
            </button>
            <button type="submit" className="btn-primary">
              {initialTask ? t("addTask.saveBtn") : t("addTask.createBtn")} <img src="/assets/imgs/check.svg" alt="Save" />
            </button>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && (
          <div className="form-success-overlay">
            {initialTask ? t("addTask.taskUpdated") : t("addTask.taskAdded")}
            <img src="/assets/imgs/Board.svg" alt="Board" />
          </div>
        )}
      </form>
    </div>
  );
}
