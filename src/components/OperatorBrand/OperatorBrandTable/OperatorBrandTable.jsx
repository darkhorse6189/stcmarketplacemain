import { useState, useEffect, useMemo } from "react";
import { OperatorBrandFormDialog } from "../OperatorBrandFormDialog/OperatorBrandFormDialog";
import { DeleteConfirmDialog } from "../../DeleteDialog/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import "./OperatorBrandTable.css";
import OperatorBrandDataTable from "./OperatorBrandDataTable";
import ActionButton from "./ActionButton";
import dhmarketplaceServiceInstance from "../../../services/DHMarketPlaceServices";
import Pagination from "../../Pagination/Pagination";
import { ActionLoader } from "../../ActionLoader/ActionLoader";

export function OperatorBrandTable({
  operatorsBrands,
  setOperatorBrands,
  title,
  isAdmin,
}) {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingOperatorsBrand, setEditingOperatorsBrand] = useState(null);
  const [dataActionOperatorBrand, setDataActionOperatorBrand] = useState(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [pageData, setPageData] = useState([]);
  const pageSize = 20;

  const filteredOperatorBrands = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return operatorsBrands || [];

    return operatorsBrands.filter(
      (operatorsBrand) =>
        operatorsBrand?.operatorsBrandsCode?.toLowerCase().includes(query) ||
        operatorsBrand?.englishName?.toLowerCase().includes(query) ||
        operatorsBrand?.arabicName?.toLowerCase().includes(query)
    );
  }, [operatorsBrands, searchQuery]);

  const noSearchFound =
    searchQuery.trim() !== "" &&
    filteredOperatorBrands.length === 0;

  const totalNumberOfPages = Math.ceil(
    filteredOperatorBrands.length / pageSize
  ); // Calculate total pages
  const [activeActions, setActiveActions] = useState(null); // Active action buttons state

  useEffect(() => {
    const start = (currentPageNumber - 1) * pageSize;
    const end = start + pageSize;
    setPageData(filteredOperatorBrands.slice(start, end));
  }, [currentPageNumber, filteredOperatorBrands]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalNumberOfPages) return; // prevent invalid pages
    setCurrentPageNumber(page);
  };

  const handleSelectRow = (id, checked) => {
    // Toggle single row selection
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      checked ? newSet.add(id) : newSet.delete(id);
      return newSet;
    });
  };

  const handleDelete = () => {
    // Open delete confirmation dialog
    setActiveActions("delete");
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    // Open add operator brand dialog
    setActiveActions("add");
    setAddDialogOpen(true);
  };

  const handleEdit = () => {
    // Open edit dialog for selected operator brand
    setActiveActions("edit");
    if (selectedRows.size === 1) {
      const operatorsBrandId = Array.from(selectedRows)[0];
      const operatorsBrand = operatorsBrands.find(
        (p) => p.operatorsBrandsId === operatorsBrandId
      );
      if (operatorsBrand) {
        setEditingOperatorsBrand(operatorsBrand);
        setEditDialogOpen(true);
      }
    }
  };

  // Save product (add or update)
  const handleSaveProduct = async (operatorsBrandData) => {
    // Handle operator brand creation/update
    try {
      if (editingOperatorsBrand) {
        setDataActionOperatorBrand("edit");
        await dhmarketplaceServiceInstance.updateOperatorsBrands({
          operatorsBrandsId: editingOperatorsBrand.operatorsBrandsId,
          ...operatorsBrandData,
        });

        // Refresh Operator Brand list after updating
        const refreshed =
          await dhmarketplaceServiceInstance.getAllOperatorsBrands();
        setOperatorBrands(refreshed?.data);
        
        setDataActionOperatorBrand(null);

        toast({ title: "Operators Brand updated successfully" });
        setActiveActions(null);
      } else {
        setDataActionOperatorBrand("add");
        const newOperatorBrand = {
          // Create new operator brand
          operatorsBrandsCode: operatorsBrandData?.operatorsBrandsCode || "",
          englishName: operatorsBrandData?.englishName || "",
          arabicName: operatorsBrandData?.arabicName || "",
          createdBy: operatorsBrandData?.createdBy || "",
        };
        // Adding new Operator Brand via API
        const response = await dhmarketplaceServiceInstance.addOperatorsBrands(
          newOperatorBrand
        );

        // Refresh Operator Brand list after adding
        const refreshed =
          await dhmarketplaceServiceInstance.getAllOperatorsBrands();
        setOperatorBrands(refreshed?.data);

        setDataActionOperatorBrand(null);

        if (response?.data?.OperatorsBrandsCreationResponse?.success) {
          toast({ title: "Operators Brand Added Successfully" });
          setActiveActions(null);
        } else {
          throw new Error("Operators Brand Adding Failed!!");
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      toast({ title: "handleSaveProduct operatorsBrand Operation failed!" });
    }

    setSelectedRows(new Set()); // Clear selection
    setEditingOperatorsBrand(null); // Reset editing state
  };

  const handleConfirmDelete = async () => {
    // Execute operator brand deletion
    const rowsToDelete = Array.from(selectedRows);
    if (rowsToDelete.length === 0) return;

    try {
      setDataActionOperatorBrand("delete");
      // Call API for each selected row
      await Promise.all(
        rowsToDelete?.map((id) => {
          const item = operatorsBrands?.find(
            (p) => p?.operatorsBrandsId === id
          );
          return dhmarketplaceServiceInstance.deleteOperatorsBrands(
            id,
            item?.operatorsBrandsCode
          );
        })
      );

      // Refresh Operator Brand list after adding
      const refreshed =
        await dhmarketplaceServiceInstance.getAllOperatorsBrands();
      setOperatorBrands(refreshed?.data);

      setDataActionOperatorBrand(null);
      toast({
        title: `${rowsToDelete.length} Operator Brand(s) Deleted Successfully`,
      });
      setActiveActions(null);
    } catch (error) {
      toast({ title: "Failed to Delete Operator Brand!!" });
    }

    setSelectedRows(new Set()); // Clear selection after delete
    setDeleteDialogOpen(false); // Close confirmation dialog
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPageNumber(1);
  };

  return (
    <div className="contacts-table-container">
      {/* Header Section */}
      <div className="contacts-table-header">
        <div className="contacts-table-header-content">
          <div className="contacts-table-title-row">
            <h1 className="contacts-table-title">{title} </h1>
          </div>

          {/* Action Buttons */}
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

      {dataActionOperatorBrand && (
        <ActionLoader
          loadingAction={
            dataActionOperatorBrand === "add"
              ? "Adding"
              : dataActionOperatorBrand === "edit"
              ? "Updating"
              : dataActionOperatorBrand === "delete"
              ? "Deleting"
              : null
          }
        />
      )}
      
      {/* No Search Found Message */}
      {noSearchFound && (
        <div className="no-search-found">
          No Operator Brand found for “{searchQuery}”
        </div>
      )}

      {!noSearchFound && (
          <>
          {/* Table Section */}
          <OperatorBrandDataTable
            operatorsBrandsList={pageData}
            selectedRows={selectedRows}
            handleSelectRow={handleSelectRow}
            isAdmin={isAdmin}
          />

          {/* Pagination Section */}
          <Pagination
            currentPage={currentPageNumber}
            totalPages={totalNumberOfPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add Operator Brand Dialog */}
      <OperatorBrandFormDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false); // Close add dialog
          setActiveActions(null);
        }} // Close add dialog
        onSave={handleSaveProduct} // Handle operator brand creation
        mode="add"
      />

      {/* Edit Operator Brand Dialog */}
      <OperatorBrandFormDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false); // Close edit dialog
          setEditingOperatorsBrand(null); // Clear editing operator brand
          setActiveActions(null);
        }}
        onSave={handleSaveProduct} // Handle operator brand update
        operatorBrand={editingOperatorsBrand} // Pass operator brand to edit
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setActiveActions(null);
        }} // Close delete dialog
        onConfirm={handleConfirmDelete} // Execute deletion
        count={selectedRows.size} // Show number of items to delete
      />
    </div>
  );
}
