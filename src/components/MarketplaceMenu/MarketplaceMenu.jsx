import { Link, useLocation } from "react-router-dom";
import "./MarketplaceMenu.css";

const marketplaces = [
    { name: "STC", path: "/", type: "stc" },
    { name: "DU", path: "/du", type: "du" }
];

const MarketplaceMenu = ({userTypeRoute}) => {
    const location = useLocation();

    const filteredMarketplaces = marketplaces.filter(
        (m) => m.type === userTypeRoute
    );
    
    return (
        <nav className="marketplace-menu">
            {filteredMarketplaces?.map((m) => (
                <Link
                    key={m.path}
                    to={m.path}
                    className={location.pathname === m.path ? "active" : ""}
                >
                    {m.name}
                </Link>
            ))}
        </nav>
    );
};

export default MarketplaceMenu;
