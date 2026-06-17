import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import "./TableSidebar.css";

export function TableSidebar({
  isCollapsed,
  onToggle,
  tableView,
  setTableView 
}) {
  return (
    <>
      {/* Mobile overlay for closing sidebar */}
      {!isCollapsed && <div className="sidebar-overlay" onClick={onToggle} />}

      {/* Main sidebar container */}
      <aside
        className={cn(
          "sidebar-container",
          isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
        )}
      >
        <div className="sidebar-inner">
         {/* Sidebar header with title and toggle button */}
          <div className="sidebar-header">
            {!isCollapsed && <h2 className="sidebar-title">Tables</h2>}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hover:bg-accent"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Scrollable area for table list */}
          <ScrollArea className="sidebar-lists">

            {/* Categories table button */}
            <div className="sidebar-lists-content">
              <button
                onClick={() => setTableView("categories")} // Displays Category table when clicked(Lifting StateUp)
                className={cn(
                  "sidebar-list-button",
                  tableView === "categories" && "sidebar-list-button-active"
                )}
              >
                {!isCollapsed ? (
                  <div className="sidebar-list-label">Category</div>
                ) : (
                  <div className="sidebar-list-dot" />
                )}
              </button>
            </div>

            {/* Operators table button */}
            <div className="sidebar-lists-content">
              <button
                onClick={() => setTableView("operators")} // Displays operators Brands table when clicked(Lifting StateUp)
                className={cn(
                  "sidebar-list-button",
                  tableView === "operators" && "sidebar-list-button-active"
                )}
              >
                {!isCollapsed ? (
                  <div className="sidebar-list-label">Operator Brands</div>
                ) : (
                  <div className="sidebar-list-dot" />
                )}
              </button>
            </div>

            {/* Packages table button */}
            <div className="sidebar-lists-content">
              <button
                onClick={() => setTableView("packages")} // Displays Package Devices table when clicked(Lifting StateUp)
                className={cn(
                  "sidebar-list-button",
                  tableView === "packages" && "sidebar-list-button-active" 
                )}
              >
                {!isCollapsed ? (
                  <div className="sidebar-list-label">Package Devices</div>
                ) : (
                  <div className="sidebar-list-dot" />
                )}
              </button>
            </div>

            {/* Products table button */}
            <div className="sidebar-lists-content">
              <button
                onClick={() => setTableView("products")} // Displays Products table when clicked(Lifting StateUp)
                className={cn(
                  "sidebar-list-button",
                  tableView === "products" && "sidebar-list-button-active"
                )}
              >
                {!isCollapsed ? (
                  <div className="sidebar-list-label">Products</div>
                ) : (
                  <div className="sidebar-list-dot" />
                )}
              </button>
            </div>

            {/* ProductsV2 table button */}
            <div className="sidebar-lists-content">
              <button
                onClick={() => setTableView("productsV2")} // Displays Products V2 table when clicked(Lifting StateUp)
                className={cn(
                  "sidebar-list-button",
                  tableView === "productsV2" && "sidebar-list-button-active"
                )}
              >
                {!isCollapsed ? (
                  <div className="sidebar-list-label">Products V2</div>
                ) : (
                  <div className="sidebar-list-dot" />
                )}
              </button>
            </div>


             {/* ProductsV2 table button */}
            <div className="sidebar-lists-content">
              <button
                onClick={() => setTableView("syncdata")} // Displays Products V2 table when clicked(Lifting StateUp)
                className={cn(
                  "sidebar-list-button",
                  tableView === "syncdata" && "sidebar-list-button-active"
                )}
              >
                {!isCollapsed ? (
                  <div className="sidebar-list-label">Sync Data</div>
                ) : (
                  <div className="sidebar-list-dot" />
                )}
              </button>
            </div>


          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
