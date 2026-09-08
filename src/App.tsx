import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Summary from "./pages/Summary";
import Board from "./pages/Board";
import AddTask from "./pages/AddTask";
import Contacts from "./pages/Contacts";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Legal from "./pages/Legal";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Öffentlich */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Geschützt: nur eingeloggt, mit App-Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/summary" element={<Summary />} />
            <Route path="/board" element={<Board />} />
            <Route path="/add-task" element={<AddTask />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/help" element={<Help />} />
          </Route>
        </Route>

        {/* Rechtliches (auch ausgeloggt erreichbar) */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </BrowserRouter>
  );
}
