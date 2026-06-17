import { useEffect, useState, useMemo } from "react";
import { PackageDevicesFormDialog } from "../PackageDevicesFormDialog/PackageDevicesFormDialog";
import { DeleteConfirmDialog } from "../../DeleteDialog/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import "./PackageDevicesTable.css";
import { ActionButtons } from "./ActionButtons";
import { PackageDevicesDataTable } from "./PackageDevicesDataTable";
import dhmarketplaceServiceInstance from "../../../services/DHMarketPlaceServices";
import Pagination from "../../Pagination/Pagination";
import { ActionLoader } from "../../ActionLoader/ActionLoader";

export function PackageDevicesTable({
  packageDevices,
  setPackagesDevices,
  title,
  isAdmin,
}) {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPackageDevice, setEditingPackageDevice] = useState(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [dataActionPackageDevice, setDataActionPackageDevice] = useState(null);
  const [pageData, setPageData] = useState([]);
  const pageSize = 20;

  const filteredPackageDevices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return packageDevices || [];

    return packageDevices.filter(
      (packageDevices) =>
        packageDevices?.packagesDevicesCode?.toLowerCase().includes(query) ||
        packageDevices?.englishName?.toLowerCase().includes(query) ||
        packageDevices?.arabicName?.toLowerCase().includes(query)
    );
  }, [packageDevices, searchQuery]);

  const noSearchFound =
    searchQuery.trim() !== "" &&
    filteredPackageDevices.length === 0;

  const totalNumberOfPages = Math.ceil(
    filteredPackageDevices.length / pageSize
  ); // Calculate total pages
  const [activeActions, setActiveActions] = useState(null); // Active action buttons state

  useEffect(() => {
    const start = (currentPageNumber - 1) * pageSize;
    const end = start + pageSize;
    setPageData(filteredPackageDevices.slice(start, end));
  }, [currentPageNumber, filteredPackageDevices]);

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
    setActiveActions("delete");
    // Open delete confirmation dialog
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setActiveActions("add");
    // Open add package device dialog
    setAddDialogOpen(true);
  };

  const handleEdit = () => {
    setActiveActions("edit");
    // Open edit dialog for selected package device
    if (selectedRows.size === 1) {
      const packageDeviceId = Array.from(selectedRows)[0];
      const packageDevice = packageDevices.find(
        (p) => p.packagesDevicesId === packageDeviceId
      );
      if (packageDevice) {
        setEditingPackageDevice(packageDevice);
        setEditDialogOpen(true);
      }
    }
  };

  // Save Package Device (add or update)
  const handleSaveProduct = async (packageDeviceData) => {
    try {
      if (editingPackageDevice) {
        setDataActionPackageDevice("edit");
        await dhmarketplaceServiceInstance.updatePackagesDevices({
          packagesDevicesId: editingPackageDevice.packagesDevicesId,
          ...packageDeviceData,
        });

        // Refresh package devices list after updating
        const refreshed =
          await dhmarketplaceServiceInstance.getAllPackagesDevices();
        setPackagesDevices(
          refreshed?.data?.PackagesDevicesResponse?.success
            ?.packagesDevicesDetails
        );
        setPackagesDevices(refreshed?.data);

        setDataActionPackageDevice(null);

        toast({ title: "Package device updated successfully" });
        setActiveActions(null);
      } else {
        setDataActionPackageDevice("add");
        const newPackageDevice = {
          // Create new package device
          packagesDevicesCode: packageDeviceData?.packagesDevicesCode || "",
          englishName: packageDeviceData?.englishName || "",
          arabicName: packageDeviceData?.arabicName || "",
          createdBy: packageDeviceData?.createdBy || "",
        };

        // Adding new package device via API
        const response = await dhmarketplaceServiceInstance.addPackagesDevices(
          newPackageDevice
        );

        // Refresh package devices list after addition
        const refreshed =
          await dhmarketplaceServiceInstance.getAllPackagesDevices();
        setPackagesDevices(refreshed?.data);

        setDataActionPackageDevice(null);

        if (response?.data?.PackagesDevicesCreationResponse?.success) {
          toast({ title: "Package device added successfully" });
          setActiveActions(null);
        } else {
          throw new Error("Package device adding failed!!");
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      toast({ title: "handleSaveProduct Operation failed!" });
    }
    setSelectedRows(new Set()); // Clear selection
    setEditingPackageDevice(null); // Reset editing state
  };

  const handleConfirmDelete = async () => {
    const rowsToDelete = Array.from(selectedRows);
    if (rowsToDelete.length === 0) return;

    try {
      setDataActionPackageDevice("delete");
      // Call API for each selected row
      await Promise.all(
        rowsToDelete?.map((id) => {
          const item = packageDevices.find((p) => p?.packagesDevicesId === id);
          return dhmarketplaceServiceInstance.deletePackagesDevices(
            id,
            item?.packagesDevicesCode
          );
        })
      );

      // Refresh package devices list after deletion
      const refreshed =
        await dhmarketplaceServiceInstance.getAllPackagesDevices();
      setPackagesDevices(refreshed?.data);

      setDataActionPackageDevice(null);

      toast({
        title: `${rowsToDelete.length} Package Device(s) deleted successfully`,
      });
      setActiveActions(null);
    } catch (error) {
      toast({ title: "Failed to Delete Package Device!!" });
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
          <ActionButtons
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

      {dataActionPackageDevice && (
        <ActionLoader
          loadingAction={
            dataActionPackageDevice === "add"
              ? "Adding"
              : dataActionPackageDevice === "edit"
              ? "Updating"
              : dataActionPackageDevice === "delete"
              ? "Deleting"
              : null
          }
        />
      )}

      {/* No Search Found Message */}
      {noSearchFound && (
        <div className="no-search-found">
          No Package Device found for “{searchQuery}”
        </div>
      )}

      {!noSearchFound && (
          <>
          {/* Table Section */}
          <div className="contacts-table-body">
            <PackageDevicesDataTable
              packageDevices={pageData}
              selectedRows={selectedRows}
              onSelectRow={handleSelectRow}
              isAdmin={isAdmin}
            />
          </div>

          {/* Pagination Section */}
          <Pagination
            currentPage={currentPageNumber}
            totalPages={totalNumberOfPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add Package Device Dialog */}
      <PackageDevicesFormDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false); // Close add dialog
          setActiveActions(null);
        }} // Close add dialog
        onSave={handleSaveProduct} // Handle package device creation
        mode="add"
      />

      {/* Edit Package Device Dialog */}
      <PackageDevicesFormDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false); // Close edit dialog
          setEditingPackageDevice(null); // Clear editing package device
          setActiveActions(null);
        }}
        onSave={handleSaveProduct} // Handle package device update
        packageDevice={editingPackageDevice} // Pass package device to edit
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
