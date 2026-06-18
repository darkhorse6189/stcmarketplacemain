import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import STCMarketplace from "./pages/STCMarketplace";
import { useAuth } from "./services/AuthProvider";
import DUMarketplace from "./components/MarketplaceMenu/DUMarketplace";
const App = () => {

  const {
    keycloakInstance,
    logout,
    getMatchingRoles,
    authenticated,
    ssoDisabled
  } = useAuth();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [userType, setUserType] = useState(null); // "admin" | "user"
  const [userTypeRoute, setUserTypeRoute] = useState(null);
  const [routeResolved, setRouteResolved] = useState(false);





useEffect(() => {

  
  if (authenticated && keycloakInstance && !ssoDisabled) {
    const matchingRoles = getMatchingRoles();
    if (matchingRoles.length === 0) {
      setIsAuthorized(false);
      setUserType(null);
      setShowAlert(true);
      setRouteResolved(true);
      return;
    }

    const role = matchingRoles[0].toLowerCase(); // e.g. "stcadmin", "duuser"


    
    // marketplace
    const route = role.startsWith("stc") ? "stc" :
                  role.startsWith("du") ? "du" : null;

    // user type
    const userType = role.includes("admin") ? "admin" :
                     role.includes("user") ? "user" : null;

    if (route && userType) {
      setIsAuthorized(true);
      setUserType(userType);
      setUserTypeRoute(route);
      setShowAlert(false);
    } else {
      setIsAuthorized(false);
      setShowAlert(true);
    }

    setRouteResolved(true);
  } else if (ssoDisabled) {
    setIsAuthorized(true);
    setUserType("admin");
    setUserTypeRoute("stc");
    setRouteResolved(true);
  }
}, [authenticated, keycloakInstance, ssoDisabled, getMatchingRoles]);
  if (!routeResolved) {
  return null; // or <LoadingSpinner />
}

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Marketplaces */}
          <Route
            path="/"
            element={
              userTypeRoute === "stc" ? (
                <STCMarketplace
                  isAuthorized={isAuthorized}
                  showAlert={showAlert}
                  userType={userType}
                  setShowAlert={setShowAlert}
                  logout={logout}
                  authenticated={authenticated}
                  userTypeRoute={userTypeRoute}
                />
              ) : userTypeRoute === "du" ? (
                <Navigate to="/du" replace />
              ) : (
                // userTypeRoute is null → unauthorized user, show the alert modal
                <STCMarketplace
                  isAuthorized={false}
                  showAlert={showAlert}
                  userType={null}
                  setShowAlert={setShowAlert}
                  logout={logout}
                  authenticated={authenticated}
                  userTypeRoute={null}
                />
              )
            }
          />

          <Route
            path="/du"
            element={
              userTypeRoute === "du" ? (
                <DUMarketplace userTypeRoute={userTypeRoute} />
              ) : (
                <NotFound />
              )
            }
          />

          {/* Redirect old path */}
          <Route
            path="/stc-marketplace"
            element={<Navigate to="/" replace />}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
