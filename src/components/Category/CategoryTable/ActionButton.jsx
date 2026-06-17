import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";
import "./ActionButton.css";

function ActionButton({
  onAdd,
  onEdit,
  onDelete,
  searchQuery,
  onSearchChange,
  selectedRowsCount,
  activeActions,
  isAdmin,
}) {
  return (
    <div className="contacts-table-actions">
      {isAdmin && (
        <Button size="sm" variant="outline" className={`gap-2 shadow-md hover:shadow-md transition-shadow ${activeActions === "add" ? "activeButtons" : ""} `} onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      )}

      {isAdmin && (
        <Button
          size="sm"
          variant="outline"
          className={`gap-2 shadow-md hover:shadow-md transition-shadow ${activeActions === "edit" ? "activeButtons" : ""} `}
          onClick={onEdit}
          disabled={selectedRowsCount !== 1}
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      )}

      {isAdmin && (
        <Button
          size="sm"
          variant="outline"
          className={`gap-2 shadow-md hover:shadow-md transition-shadow ${activeActions === "delete" ? "activeButtons" : ""} `}
          onClick={onDelete}
          disabled={selectedRowsCount === 0}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      )}

      <Input
        placeholder="Search Category..."
        value={searchQuery}
        onChange={onSearchChange}
        className="contacts-table-search"
      />
    </div>
  );
}

export default ActionButton;
