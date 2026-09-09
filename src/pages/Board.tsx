import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { getData, patchData } from "../lib/firebase";
import { type Task, type Contact, type TaskStatus, taskSchema } from "../lib/schemas";
import TaskCard from "../components/TaskCard";
import TaskDetailsModal from "../components/TaskDetailsModal";
import Modal from "../components/Modal";
import AddTaskForm from "../components/AddTaskForm";
import "./Board.css";
import { useDroppable } from "@dnd-kit/core";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To do" },
  { id: "inProgress", title: "In progress" },
  { id: "awaitingFeedback", title: "Await feedback" },
  { id: "done", title: "Done" },
];

function BoardColumn({
  col,
  tasks,
  contacts,
  onAddTask,
  onTaskClick,
  onMoveTask,
}: {
  col: { id: TaskStatus; title: string };
  tasks: Task[];
  contacts: Contact[];
  onAddTask: (status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onMoveTask: (task: Task, newStatus: TaskStatus) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: col.id,
    data: {
      type: "Column",
      column: col,
    },
  });

  return (
    <div className="board-column">
      <div className="column-header">
        <h2>{col.title}</h2>
        <button
          className="column-add-btn"
          onClick={() => onAddTask(col.id)}
        >
          <img src="/assets/imgs/plus button.png" alt="Add" />
        </button>
      </div>

      <div className="column-content" id={col.id} ref={setNodeRef}>
        <SortableContext
          id={col.id}
          items={tasks.map((t) => t.id)}
          strategy={rectSortingStrategy}
        >
          <div className="sortable-list">
            {tasks.length === 0 ? (
              <div className="empty-column-placeholder">
                No tasks {col.title}
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  contacts={contacts}
                  onClick={() => onTaskClick(task)}
                  onMoveTask={onMoveTask}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [addTaskStatus, setAddTaskStatus] = useState<TaskStatus>("todo");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // drag starts after moving 5px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [tasksData, contactsData] = await Promise.all([
          getData<Record<string, unknown>>("tasks"),
          getData<Record<string, Contact>>("contacts"),
        ]);

        if (!active) return;

        if (tasksData) {
          const loadedTasks: Task[] = Object.entries(tasksData).flatMap(
            ([id, val]) => {
              const parsed = taskSchema.safeParse({ ...(val as object), id });
              return parsed.success ? [parsed.data] : [];
            }
          );
          setTasks(loadedTasks);
        }

        if (contactsData) {
          setContacts(Object.values(contactsData));
        }
      } catch (err) {
        console.error("Failed to load board data", err);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleMoveTask = async (task: Task, newStatus: TaskStatus) => {
    try {
      await patchData(`tasks/${task.id}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Failed to move task", err);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = COLUMNS.some((col) => col.id === overId);

    if (!isActiveTask) return;

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (isOverTask) {
        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(newTasks, activeIndex, overIndex);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      }

      if (isOverColumn) {
        const newTasks = [...tasks];
        newTasks[activeIndex].status = overId as TaskStatus;
        return arrayMove(newTasks, activeIndex, newTasks.length - 1);
      }

      return tasks;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const activeTask = tasks.find((t) => t.id === activeId);
    
    // We already optimistically updated the status in handleDragOver.
    // Now we just persist it.
    if (activeTask) {
      try {
        await patchData(`tasks/${activeId}`, { status: activeTask.status });
      } catch (err) {
        console.error("Failed to update task status in Firebase", err);
      }
    }
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="content-container board-page">
      <div className="board-header-row">
        <div className="board-header-left">
          <h1>Board</h1>
        </div>
        <div className="board-header-right">
          <div className="board-search">
            <input
              type="text"
              placeholder="Find Task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="search-divider"></div>
            <img src="/assets/imgs/search.svg" alt="Search" />
          </div>
          <button
            className="btn-primary add-task-btn"
            onClick={() => {
              setAddTaskStatus("todo");
              setIsAddTaskOpen(true);
            }}
          >
            Add task <img src="/assets/imgs/add.png" alt="Add" />
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="board-columns">
          {COLUMNS.map((col) => {
            const columnTasks = filteredTasks.filter(
              (t) => t.status === col.id
            );

            return (
              <BoardColumn
                key={col.id}
                col={col}
                tasks={columnTasks}
                contacts={contacts}
                onAddTask={(status) => {
                  setAddTaskStatus(status);
                  setIsAddTaskOpen(true);
                }}
                onTaskClick={(task) => setSelectedTask(task)}
                onMoveTask={handleMoveTask}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              contacts={contacts}
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDetailsModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        contacts={contacts}
        onTaskUpdated={(updated) => {
          setTasks((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
          );
          setSelectedTask(updated);
        }}
        onTaskDeleted={(id) => {
          setTasks((prev) => prev.filter((t) => t.id !== id));
        }}
      />

      <Modal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        className="add-task-modal-wrapper"
      >
        <div className="modal-add-task-header">
          <h2>Add Task</h2>
        </div>
        <AddTaskForm
          initialStatus={addTaskStatus}
          onCancel={() => setIsAddTaskOpen(false)}
          onTaskAdded={(newTask) => {
            setTasks((prev) => [...prev, newTask]);
            setIsAddTaskOpen(false);
          }}
        />
      </Modal>
    </main>
  );
}
