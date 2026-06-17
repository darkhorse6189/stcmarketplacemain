import { useState, useEffect, useMemo } from "react";
import { CategoryFormDialog } from "../CategoryFormDialog/CategoryFormDialog";
import { DeleteConfirmDialog } from "../../DeleteDialog/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import "./CategoryTable.css";
import ActionButton from "./ActionButton";
import CategoryDataTable from "./CategoryDataTable";
import dhmarketplaceServiceInstance from "../../../services/DHMarketPlaceServices";
import Pagination from "../../Pagination/Pagination";
import { ActionLoader } from "../../ActionLoader/ActionLoader";

export function CategoryTable({ categories, setCategory, title, isAdmin }) {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [dataActionCategory, setDataActionCategory] = useState(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [pageData, setPageData] = useState([]);
  const pageSize = 20;

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories || [];

    return categories.filter(
      (category) =>
        category?.categoryCode?.toLowerCase().includes(query) ||
        category?.englishName?.toLowerCase().includes(query) ||
        category?.arabicName?.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  const noSearchFound =
    searchQuery.trim() !== "" &&
    filteredCategories.length === 0;

  const totalNumberOfPages = Math.ceil(filteredCategories.length / pageSize); // Calculate total pages\
  const [activeActions, setActiveActions] = useState(null); // Active action buttons state

  useEffect(() => {
    const start = (currentPageNumber - 1) * pageSize;
    const end = start + pageSize;
    setPageData(filteredCategories.slice(start, end));
  }, [currentPageNumber, filteredCategories]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalNumberOfPages) return; // prevent invalid pages
    setCurrentPageNumber(page);
  };

  // Handle row selection (for checkbox selection in table)
  const handleSelectRow = (id, checked) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev); // Create a copy of the previous selected row IDs
      checked ? newSet.add(id) : newSet.delete(id); // If checkbox is checked, add the row ID; if unchecked, remove it
      return newSet; // Return the updated set of selected rows
    });
  };

  // Open delete confirmation dialog
  const handleDelete = () => {
    setActiveActions("delete");
    setDeleteDialogOpen(true);
  };

  // Open add category dialog
  const handleAdd = () => {
    setActiveActions("add");
    setAddDialogOpen(true);
  };

  // Handle edit button click
  const handleEdit = () => {
    setActiveActions("edit");
    // Only allow editing if exactly one row is selected
    if (selectedRows.size === 1) {
      const categoryId = Array.from(selectedRows)[0]; // Get selected category ID
      const category = categories.find((p) => p.categoryId === categoryId); // Find category from list
      if (category) {
        setEditingCategory(category);
        setEditDialogOpen(true);
      }
    }
  };

  // Save category (handles both add and edit)
  const handleSaveProduct = async (categoryData) => {
    try {
      if (editingCategory) {
        setDataActionCategory("edit");
        await dhmarketplaceServiceInstance.updateCategory({
          categoryId: editingCategory?.categoryId,
          ...categoryData,
        });

        // Refresh Category list after updating
        const refreshed = await dhmarketplaceServiceInstance.getAllCategory();
        setCategory(refreshed?.data);

        setDataActionCategory(null);

        toast({ title: "Category updated successfully" });
        setActiveActions(null);
      } else {
        setDataActionCategory("add");
        // Add a new category
        const newCategory = {
          categoryCode: categoryData?.categoryCode || "",
          englishName: categoryData?.englishName || "",
          arabicName: categoryData?.arabicName || "",
          createdBy: categoryData?.createdBy || "",
        };

        // Call API to add new category
        const response = await dhmarketplaceServiceInstance.addCategory(
          newCategory
        );

        // Refresh Category list after adding
        const refreshed = await dhmarketplaceServiceInstance.getAllCategory();
        setCategory(refreshed?.data);

         setDataActionCategory(null);

        if (response?.data?.CategoryCreationResponse?.success) {
          toast({ title: "Category added successfully" });
          setActiveActions(null);
        } else {
          throw new Error("Category adding failed!!");
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      toast({ title: "handleSaveProduct category failed!" });
    }
    // Reset selection and editing state after save
    setSelectedRows(new Set());
    setEditingCategory(null);
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    const rowsToDelete = Array.from(selectedRows);
    if (rowsToDelete.length === 0) return;

    try {
      setDataActionCategory("delete");
      // Call API for each selected row
      await Promise.all(
        rowsToDelete?.map((id) => {
          const item = categories?.find((p) => p?.categoryId === id);
          return dhmarketplaceServiceInstance.deleteCategory(
            id,
            item?.categoryCode
          );
        })
      );

      // Refresh Category list after updating
      const refreshed = await dhmarketplaceServiceInstance.getAllCategory();
      setCategory(refreshed?.data);

      setDataActionCategory(null);

      toast({
        title: `${rowsToDelete.length} category(s) deleted successfully`,
      });
      setActiveActions(null);
    } catch (error) {
      toast({ title: "Failed to delete Category!" });
    }

    // Reset selection and close dialog
    setSelectedRows(new Set());
    setDeleteDialogOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPageNumber(1);
  };

  return (
    <div className="contacts-table-container">
      {/* Header */}
      <div className="contacts-table-header">
        <div className="contacts-table-header-content">
          <div className="contacts-table-title-row">
            <h1 className="contacts-table-title">{title} </h1>
          </div>

          {/* Action Button */}
          <ActionButton
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedRowsCount={selectedRows.size}
            activeActions={activeActions}
            isAdmin={isAdmin}
          />
        </div>
      </div>

      {dataActionCategory && (
        <ActionLoader
          loadingAction={
            dataActionCategory === "add"
              ? "Adding"
              : dataActionCategory === "edit"
              ? "Updating"
              : dataActionCategory === "delete"
              ? "Deleting"
              : null
          }
        />
      )}

      {/* No Search Found Message */}
      {noSearchFound && (
        <div className="no-search-found">
          No category found for “{searchQuery}”
        </div>
      )}
      
      {!noSearchFound && (
        <>
          {/* Table */}
          <CategoryDataTable
            categoryList={pageData}
            selectedRows={selectedRows}
            handleSelectRow={handleSelectRow}
            loadingAction={activeActions}
            noSearchFound={noSearchFound}
            isAdmin={isAdmin}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPageNumber}
            totalPages={totalNumberOfPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add Category Dialog */}
      <CategoryFormDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          setActiveActions(null);
        }}
        onSave={handleSaveProduct}
        mode="add"
      />

      {/* Edit Category Dialog */}
      <CategoryFormDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingCategory(null);
          setActiveActions(null);
        }}
        onSave={handleSaveProduct}
        category={editingCategory}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setActiveActions(null);
        }}
        onConfirm={handleConfirmDelete}
        count={selectedRows.size}
      />
    </div>
  );
}
