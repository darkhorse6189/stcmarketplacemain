import "./Header.css";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../services/AuthProvider";
const Header = () => {
  
    const { logout, ssoDisabled } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-logo">DH MarketPlace</h1>
        <Button
          onClick={logout}
          disabled={ssoDisabled}
          style={{
            backgroundColor: "#d32f2f", // deep red
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: "500",
            marginLeft: "auto",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#b71c1c")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#d32f2f")}
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
