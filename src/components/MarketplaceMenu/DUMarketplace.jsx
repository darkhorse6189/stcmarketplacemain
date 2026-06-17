import Header from "../Header/Header";
import MarketplaceMenu from "./MarketplaceMenu";


function DUMarketplace({ userTypeRoute }) {
    return (
        <div>
            <Header />
            <MarketplaceMenu userTypeRoute={userTypeRoute} />
            DU MarketPlace Page - User Type: {userTypeRoute}
        </div>
    );
}

export default DUMarketplace;
