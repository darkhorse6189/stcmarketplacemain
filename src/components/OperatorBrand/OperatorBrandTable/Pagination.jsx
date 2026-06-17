import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./Pagination.css";

function Pagination({ currentPage, totalPages, setCurrentPage, getPageNumbers }) {
    return (
        <div className="contacts-table-pagination">
            <div className="contacts-table-pagination-controls">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} // Go to previous page
                    disabled={currentPage === 1} // Disable on first page
                    className="contacts-table-pagination-button"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers()?.map(
                    (
                        page,
                        idx // Render page buttons
                    ) => (
                    <Button
                        key={idx}
                        variant={page === currentPage ? "default" : "outline"} // Highlight current page
                        size="icon"
                        onClick={() => typeof page === "number" && setCurrentPage(page)} // Only numbers are clickable
                        disabled={typeof page === "string"} // Disable ellipsis buttons
                        className={cn(
                            "contacts-table-pagination-button",
                            typeof page === "string" && "contacts-table-pagination-ellipsis"
                        )}
                        >
                        {page}
                        </Button>
                    )
                )}

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} // Go to next page
                    disabled={currentPage === totalPages} // Disable on last page
                    className="contacts-table-pagination-button"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default Pagination;
