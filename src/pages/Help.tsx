import { useNavigate } from "react-router-dom";

export default function Help() {
  const navigate = useNavigate();
  return (
    <main className="content-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '48px', margin: 0 }}>Help</h1>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="/assets/imgs/arrow_left_line_hover.svg" alt="Back" />
        </button>
      </div>
      <p style={{ fontSize: '20px', lineHeight: '1.5' }}>
        Welcome to the Help page for <b>Join 360</b>, your comprehensive guide to using our Kanban-based project management tool. Here, we'll provide an overview of what Join 360 is, how it can benefit your team, and detailed instructions on how to use it.
      </p>
      
      <h2 style={{ fontSize: '27px', marginTop: '24px', marginBottom: '16px' }}>What is Join 360?</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        Join 360 is a fully modernized, responsive Kanban project management tool. It was built using a cutting-edge React tech stack (React 19, TypeScript, Vite) and utilizes Firebase Realtime Database for real-time synchronization. "Kanban", a Japanese term meaning "signboard", is an agile framework designed to help you visualize your work, limit work-in-progress, and maximize efficiency.
      </p>

      <h2 style={{ fontSize: '27px', marginTop: '24px', marginBottom: '16px' }}>How to use it</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        Here is a step-by-step guide on how to navigate and use the Join 360 platform:
        <br/><br/>
        <b>1. Dashboard Summary:</b> Get a quick overview of all tasks across your board. Check urgent deadlines, total tasks in progress, and your next upcoming milestones.
        <br/><br/>
        <b>2. Manage Contacts:</b> Head over to the Contacts tab to add your team members. You can store their names, emails, and phone numbers. They will automatically be available for task assignment.
        <br/><br/>
        <b>3. Add Tasks:</b> Click "Add Task" to create a new ticket. You can set a title, description, due date, category, priority, assign team members, and even break the work down into smaller subtasks.
        <br/><br/>
        <b>4. Kanban Board:</b> Use our fluid drag-and-drop interface to move tasks between "To do", "In progress", "Await feedback", and "Done" columns. Click any task to view details, toggle subtasks, or edit the ticket.
      </p>
    </main>
  );
}
