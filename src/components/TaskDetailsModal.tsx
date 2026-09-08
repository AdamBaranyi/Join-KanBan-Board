import { useState } from "react";
import Modal from "./Modal";
import type { Task, Contact } from "../lib/schemas";
import { patchData, deleteData } from "../lib/firebase";
import "./TaskDetailsModal.css";
import AddTaskForm from "./AddTaskForm";

type TaskDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  contacts: Contact[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
};

export default function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  contacts,
  onTaskUpdated,
  onTaskDeleted,
}: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!task) return null;

  const handleSubtaskToggle = async (index: number) => {
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    
    try {
      await patchData(`tasks/${task.id}`, { subtasks: updatedSubtasks });
      onTaskUpdated({ ...task, subtasks: updatedSubtasks });
    } catch (err) {
      console.error("Failed to update subtask", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteData(`tasks/${task.id}`);
      onTaskDeleted(task.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const taskAssignees = task.assignedTo
    .map((id) => contacts.find((c) => c.id === id))
    .filter((c) => c !== undefined) as Contact[];

  return (
    <Modal isOpen={isOpen} onClose={() => {
      setIsEditing(false);
      onClose();
    }} className={`task-details-modal ${isEditing ? 'is-editing' : ''}`}>
      {isEditing ? (
        <div className="task-edit-container">
          <div className="task-edit-header" style={{ width: '100%', marginBottom: '16px' }}>
            <h2 style={{margin: 0, fontSize: '36px', color: 'var(--color-primary)'}}>Edit Task</h2>
          </div>
          <AddTaskForm
            initialTask={task}
            initialStatus={task.status}
            onCancel={() => setIsEditing(false)}
            onTaskUpdated={(updatedTask) => {
              onTaskUpdated(updatedTask);
              setIsEditing(false);
            }}
          />
        </div>
      ) : (
        <div className="task-details-content">
          <div className={`task-category ${task.category === 'User Story' ? 'user-story' : 'technical-task'}`}>
            {task.category}
          </div>
          
          <h2 className="task-title">{task.title}</h2>
          <p className="task-description">{task.description}</p>
          
          <div className="task-info-row">
            <span className="task-info-label">Due date:</span>
            <span className="task-info-value">{task.dueDate}</span>
          </div>

          <div className="task-info-row">
            <span className="task-info-label">Priority:</span>
            <span className="task-info-value priority">
              {task.priority}
              {task.priority === "Urgent" && <img src="/assets/imgs/urgent-priority-board.svg" alt="Urgent" />}
              {task.priority === "Medium" && <img src="/assets/imgs/priority_medium.svg" alt="Medium" />}
              {task.priority === "Low" && <img src="/assets/imgs/low-priority-board.svg" alt="Low" />}
            </span>
          </div>

          <div className="task-assignees-section">
            <span className="task-info-label">Assigned To:</span>
            <div className="assignees-list">
              {taskAssignees.map(contact => (
                <div key={contact.id} className="assignee-item">
                  <div className="contact-badge" style={{ backgroundColor: "#ff7a00" }}>
                    {contact.firstname[0]}{contact.lastname[0]}
                  </div>
                  <span>{contact.firstname} {contact.lastname}</span>
                </div>
              ))}
            </div>
          </div>

          {task.subtasks.length > 0 && (
            <div className="task-subtasks-section">
              <span className="task-info-label">Subtasks</span>
              <div className="subtasks-list">
                {task.subtasks.map((subtask, idx) => (
                  <div 
                    key={idx} 
                    className="subtask-item"
                    onClick={() => handleSubtaskToggle(idx)}
                  >
                    <img 
                      src={subtask.completed ? "/assets/imgs/checkbox_checked.svg" : "/assets/imgs/checkbox_empty.svg"} 
                      alt="checkbox" 
                    />
                    <span>{subtask.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="task-actions">
            <button className="action-btn delete" onClick={handleDelete}>
              <img src="/assets/imgs/delete.svg" alt="Delete" /> Delete
            </button>
            <div className="action-divider"></div>
            <button className="action-btn edit" onClick={() => {
              // Not fully implemented edit yet, but we have the button
              setIsEditing(true);
            }}>
              <img src="/assets/imgs/edit.svg" alt="Edit" /> Edit
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
