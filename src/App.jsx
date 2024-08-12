import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import AffliatesMain from "./components/affliates/AffliatesMain";
import { useEffect, useState } from "react";
import Sidebar from "./components/affliates/sidebar/Sidebar";
import Dashboard from "./components/affliates/dashboard/Dashboard";
import Profile from "./components/affliates/profile/Profile";
import Users from "./components/affliates/users/Users";
import Wallet from "./components/affliates/wallet/Wallet";
import { ADMIN_SIDEBAR_OPTIONS, SIDEBAR_OPTIONS } from "./Constants";
import AdminLogin from "./components/login/AdminLogin";
import AdminDashboard from "./components/admin/dashboard/AdminDashboard";
import UsersList from "./components/admin/users/UsersList";
import EditUser from "./components/admin/users/EditUser";
import UserType from "./components/admin/users/UserType";
import ViewUser from "./components/admin/users/ViewUser";
import { useSelector } from "react-redux";
import { capitalizeWords } from "./utils/helpers";
import { Badge, Button } from "antd";
import PayoutHistory from "./components/admin/payouthistory/PayoutHistory";
import Notification from "./components/notification/Notification";
import useApi from "./hooks/useApi";

function App() {
  let locationCheck = !(
    location.pathname.includes("/login") ||
    location.pathname.includes("/register")
  );
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [showNotification, setShowNotification] = useState(false);
  const { data, loading, get, error } = useApi();
  const paths = ["/login", "/register"];
  const { user_data } = useSelector((state) => state?.user);

  function handleLogout(){
    localStorage.clear('token')
    navigate('/login')
  }

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    if (locationCheck) {
      if (localStorage.getItem("token") == null) {
        navigate("/login");
      }
    }
  }, [localStorage.getItem("token")]);

  useEffect(() => {
    if (locationCheck) {
      let data = (
        location.pathname.includes("/admin")
          ? ADMIN_SIDEBAR_OPTIONS
          : SIDEBAR_OPTIONS
      ).find(
        (option) =>
          option.key ===
          (location.pathname.includes("/admin")
            ? location.pathname.replace("/admin", "").replace("/", "")
            : location.pathname.replace("/", ""))
      );  
      setSelectedMenu(location.pathname.includes("user") ? "users" : data?.key ?? "dashboard");
    }
    if(location.pathname === "/" && localStorage.getItem("token")){
      navigate("/dashboard")
    }
  }, [location.pathname]);

  useEffect(() => {
    if(locationCheck){
      try {
        get("/notification/count");
      } catch (error) {
        console.log(error)
      }
    }
  }, [])
  

  return (
    <section className="affliate-user-persona">
      {locationCheck && (
        <Sidebar
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
          menuOptions={
            location.pathname.includes("/admin")
              ? ADMIN_SIDEBAR_OPTIONS
              : SIDEBAR_OPTIONS
          }
          setSelectedMenu={setSelectedMenu}
          selectedMenu={selectedMenu}
        />
      )}
      <div
        className="albion-affliate-route-section"
        style={{
          width: paths.some((path) => location.pathname.includes(path))
            ? "100%"
            : "80%",
          margin: paths.some((path) => location.pathname.includes(path))
            ? "0 auto"
            : "",
        }}
      >
        {
          showNotification && <Notification
            setShowNotification={setShowNotification}
          />
        }
        <header
          className="affliate-links-header"
          style={{ display: locationCheck ? "flex" : "none" }}
        >
          <h1>Welcome Back! {capitalizeWords(user_data?.first_name)}</h1>
          <div>
            <Badge
              count={data?.data?.count ?? 0}
            >
              <i class="fi fi-br-bell-notification-social-media" onClick={() => setShowNotification(true)}></i>
            </Badge>
            <Button className="logout_btn" onClick={handleLogout}>
              <i class="fi fi-bs-sign-out-alt"></i>
              Logout
            </Button>
          </div>
        </header>
        <section
          className="affliate-user-persona-route-area"
          style={{
            background: locationCheck
              ? "rgba(140, 25, 63, 0.0196078431)"
              : "#fff",
            display: locationCheck ? "" : "flex",
            alignItems: locationCheck ? "" : "center",
            justifyContent: locationCheck ? "" : "center",
            minHeight: "100vh",
            height: "auto",
            width: "100%",
            marginTop: locationCheck ? "65px" : "",
          }}
        >
          <Routes>
            {location.pathname.includes("/admin") ? (
              <>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/user-view/:id" element={<ViewUser />} />
                <Route path="/admin/user-edit/:id" element={<EditUser />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UsersList />} />
                <Route path="/admin/types" element={<UserType />} />
                <Route path="/admin/payout_history" element={<PayoutHistory/>} />
              </>
            ) : (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/users" element={<Users />} />
                <Route path="/wallet" element={<Wallet />} />
              </>
            )}
            <Route path="*" element={() => <h1>Page Not Found</h1>} />
          </Routes>
        </section>
      </div>
    </section>
  );
}

export default App;
