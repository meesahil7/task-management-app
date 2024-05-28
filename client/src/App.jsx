import { FloatButton } from "antd";
import "./App.css";
import MainRoutes from "./routes/MainRoutes";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuthContext } from "./context/AuthContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function App() {
  const { authUser, setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const handleLogOut = () => {
    setAuthUser(null);
    Cookies.remove("quleepAuth");
    navigate("/login");
  };
  return (
    <>
      <MainRoutes />
      {authUser && (
        <FloatButton
          icon={<LogoutOutlined />}
          tooltip="Logout"
          onClick={handleLogOut}
        />
      )}
    </>
  );
}

export default App;
