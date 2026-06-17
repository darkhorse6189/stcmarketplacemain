import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./Pagination.css";
import React from "react";

function Pagination({ currentPage, setCurrentPage, getPageNumbers, totalPages }) {
    return (
        <div className="contacts-table-pagination">
            <div className="contacts-table-pagination-controls">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="contacts-table-pagination-button"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers()?.map((page, idx) => (
                    <Button
                        key={idx}
                        variant={page === currentPage ? "default" : "outline"}
                        size="icon"
                        onClick={() => typeof page === "number" && setCurrentPage(page)}
                        disabled={typeof page === "string"}
                        className={cn(
                        "contacts-table-pagination-button",
                        typeof page === "string" && "contacts-table-pagination-ellipsis"
                        )}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="contacts-table-pagination-button"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default Pagination;
