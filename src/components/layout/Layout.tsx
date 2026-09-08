import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";
import "./Layout.css";

/** App-Rahmen für eingeloggte Seiten: Sidebar + Header + Inhalt (Outlet). */
export default function Layout() {
  return (
    <>
      <Sidebar />
      <MobileSidebar />
      <Header />
      <Outlet />
    </>
  );
}
