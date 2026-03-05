import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import ResidentLayout from "./pages/ResidentLayout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RequestPage from "./pages/RequestPage";
import ServiceStatus from "./pages/ServiceStatus";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ResidentManagement from "./pages/ResidentManagement";
import RequestManagement from "./pages/RequestManagement";
import AnnouncementManagement from "./pages/AnnouncementManagement";
import Reports from "./pages/Reports";
import AccountManagement from "./pages/AccountManagement";
import SystemSettings from "./pages/SystemSettings";
import AdminRegister from "./pages/AdminRegister";
import StaffApproval from "./pages/StaffApproval";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/resident",
    Component: ResidentLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "requests",
        Component: RequestPage,
      },
      {
        path: "status",
        Component: ServiceStatus,
      },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin/register",
    Component: AdminRegister,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: AdminDashboard,
      },
      {
        path: "residents",
        Component: ResidentManagement,
      },
      {
        path: "requests",
        Component: RequestManagement,
      },
      {
        path: "announcements",
        Component: AnnouncementManagement,
      },
      {
        path: "reports",
        Component: Reports,
      },
      {
        path: "account",
        Component: AccountManagement,
      },
      {
        path: "settings",
        Component: SystemSettings,
      },
      {
        path: "staff-approval",
        Component: StaffApproval,
      },
    ],
  },
]);
