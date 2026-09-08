import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, Contact } from "../lib/schemas";
import "./TaskCard.css";

type TaskCardProps = {
  task: Task;
  contacts: Contact[];
  onClick: () => void;
};

export default function TaskCard({ task, contacts, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "Task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progressPercent =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Get first 3 assignees for display
  const taskAssignees = task.assignedTo
    .map((id) => contacts.find((c) => c.id === id))
    .filter((c) => c !== undefined) as Contact[];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${isDragging ? "dragging" : ""}`}
      onClick={() => {
        // Prevent opening modal if we're just dragging
        if (!isDragging) {
          onClick();
        }
      }}
    >
      <div className={`task-category ${task.category === 'User Story' ? 'user-story' : 'technical-task'}`}>
        {task.category}
      </div>
      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">{task.description}</p>
      
      {totalSubtasks > 0 && (
        <div className="task-subtasks">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <span className="progress-text">
            {completedSubtasks}/{totalSubtasks} Subtasks
          </span>
        </div>
      )}

      <div className="task-footer">
        <div className="task-assignees">
          {taskAssignees.slice(0, 3).map((contact, idx) => (
            <div
              key={contact.id}
              className="assignee-badge"
              style={{
                zIndex: 3 - idx,
                transform: `translateX(-${idx * 8}px)`,
                backgroundColor: "#ff7a00" // We could generate a color based on id
              }}
            >
              {contact.firstname[0]}{contact.lastname[0]}
            </div>
          ))}
          {taskAssignees.length > 3 && (
            <div className="assignee-badge more" style={{ transform: `translateX(-24px)` }}>
              +{taskAssignees.length - 3}
            </div>
          )}
        </div>
        <div className="task-priority">
          {task.priority === "Urgent" && (
            <img src="/assets/imgs/urgent-priority-board.svg" alt="Urgent" />
          )}
          {task.priority === "Medium" && (
            <img src="/assets/imgs/priority_medium.svg" alt="Medium" />
          )}
          {task.priority === "Low" && (
            <img src="/assets/imgs/low-priority-board.svg" alt="Low" />
          )}
        </div>
      </div>
    </div>
  );
}
