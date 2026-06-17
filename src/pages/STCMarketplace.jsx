import { useEffect, useState } from "react";
import Index from "./Index";
import "./STCMarketplace.css";

import AlertModal from "../components/AlertModal/AlertModal";
import Header from "../components/Header/Header";
import MarketplaceMenu from "../components/MarketplaceMenu/MarketplaceMenu";
import Footer from "../components/Footer/Footer";

const STCMarketplace = ({isAuthorized, showAlert, userType, setShowAlert, logout,authenticated,userTypeRoute}) => {

  return (
    <>
      <AlertModal
        show={showAlert}
        title="⚠️ Access Denied"
        body="You are not Authorized!"
        variant="info"
        onConfirm={() => {
          setShowAlert(false);
          logout();
        }}
      />

      {isAuthorized && authenticated && (
        <>
          <Header />
          <MarketplaceMenu userTypeRoute={userTypeRoute}/>
          <Index role={userType}/>
          <Footer />
        </>
      )}
    </>
  );
};

export default STCMarketplace;
