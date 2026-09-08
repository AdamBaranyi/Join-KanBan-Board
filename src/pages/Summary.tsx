import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../lib/firebase";
import { taskSchema, type Task } from "../lib/schemas";
import { getCurrentUser } from "../lib/session";
import "./Summary.css";

type Metrics = {
  total: number;
  todo: number;
  inProgress: number;
  awaitingFeedback: number;
  done: number;
  urgent: number;
};

const EMPTY: Metrics = {
  total: 0,
  todo: 0,
  inProgress: 0,
  awaitingFeedback: 0,
  done: 0,
  urgent: 0,
};

/** Tageszeit-abhängige Begrüssung (wie im Original). */
function greetingByTime(): string {
  const hour = new Date().getHours();
  if (hour >= 18) return "Good evening,";
  if (hour >= 12) return "Good afternoon,";
  return "Good morning,";
}

export default function Summary() {
  const navigate = useNavigate();
  const goBoard = () => navigate("/board");

  const user = getCurrentUser();
  const isGuestUser = !user || user.name === "Guest";
  const userName = isGuestUser ? "" : user.name;
  const greeting = isGuestUser
    ? greetingByTime().slice(0, -1) + "!"
    : greetingByTime();

  const [metrics, setMetrics] = useState<Metrics>(EMPTY);
  const [urgentDate, setUrgentDate] = useState("No upcoming deadline");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await getData<Record<string, unknown>>("tasks");
        const tasks: Task[] = data
          ? Object.values(data).flatMap((v) => {
              const parsed = taskSchema.safeParse(v);
              return parsed.success ? [parsed.data] : [];
            })
          : [];

        const m: Metrics = { ...EMPTY, total: tasks.length };
        let earliest: Date | null = null;

        for (const task of tasks) {
          if (task.status === "todo") m.todo++;
          else if (task.status === "inProgress") m.inProgress++;
          else if (task.status === "awaitingFeedback") m.awaitingFeedback++;
          else if (task.status === "done") m.done++;

          if (task.priority === "Urgent") {
            m.urgent++;
            if (task.dueDate) {
              const d = new Date(task.dueDate);
              if (!earliest || d < earliest) earliest = d;
            }
          }
        }

        if (!active) return;
        setMetrics(m);
        setUrgentDate(
          earliest
            ? earliest.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "No upcoming deadline",
        );
      } catch (e) {
        console.error("Error loading summary metrics:", e);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="content-container summary-content">
      <div className="summary-header-container">
        <h1>Join 360</h1>
        <div className="summary-divider"></div>
        <span className="subtitle">Key Metrics at a Glance</span>
      </div>

      <div className="summary-main-wrapper">
        <section className="metrics-container">
          <div className="metrics-row">
            <div className="metric-card" onClick={goBoard}>
              <div className="metric-icon-circle icon-edit">
                <img src="/assets/imgs/edit_white.svg" alt="To-do" />
              </div>
              <div className="metric-info">
                <span className="metric-number">{metrics.todo}</span>
                <span className="metric-label">To-do</span>
              </div>
            </div>

            <div className="metric-card" onClick={goBoard}>
              <div className="metric-icon-circle icon-check">
                <img src="/assets/imgs/check.svg" alt="Done" />
              </div>
              <div className="metric-info">
                <span className="metric-number">{metrics.done}</span>
                <span className="metric-label">Done</span>
              </div>
            </div>
          </div>

          <div className="metric-card urgent-card" onClick={goBoard}>
            <div className="urgent-left">
              <div className="metric-icon-circle icon-urgent">
                <img src="/assets/imgs/urgent-icon.png" alt="Urgent" />
              </div>
              <div className="metric-info">
                <span className="metric-number">{metrics.urgent}</span>
                <span className="metric-label">Urgent</span>
              </div>
            </div>
            <div className="urgent-divider"></div>
            <div className="urgent-right">
              <span className="urgent-date">{urgentDate}</span>
              <span className="urgent-label">Upcoming Deadline</span>
            </div>
          </div>

          <div className="metrics-row small-cards">
            <div className="metric-card small" onClick={goBoard}>
              <span className="metric-number">{metrics.total}</span>
              <span className="metric-label">
                Tasks in
                <br />
                Board
              </span>
            </div>
            <div className="metric-card small" onClick={goBoard}>
              <span className="metric-number">{metrics.inProgress}</span>
              <span className="metric-label">
                Tasks In
                <br />
                Progress
              </span>
            </div>
            <div className="metric-card small" onClick={goBoard}>
              <span className="metric-number">{metrics.awaitingFeedback}</span>
              <span className="metric-label">
                Awaiting
                <br />
                Feedback
              </span>
            </div>
          </div>
        </section>

        <section className="greeting-container">
          <span id="greeting-time">{greeting}</span>
          <span id="greeting-name">{userName}</span>
        </section>
      </div>
    </main>
  );
}
