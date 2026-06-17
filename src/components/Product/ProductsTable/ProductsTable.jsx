import { useState, useEffect } from "react";
import { ProductFormDialog } from "../ProductFormDialog/ProductFormDialog";
import { DeleteConfirmDialog } from "../../DeleteDialog/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import "./ProductsTable.css";
import { ActionButtons } from "./ActionButtons";
import { FilterPanel } from "./FilterPanel";
import { ProductsDataTable } from "./ProductsDataTable";
import Pagination from "../../Pagination/Pagination";
import dhmarketplaceServiceInstance from "../../../services/DHMarketPlaceServices";
import { ActionLoader } from "../../ActionLoader/ActionLoader";

export function ProductsTable({
  products,
  productsFault,
  setProduct,
  categories,
  operatorsBrands,
  packagesDevices,
  images,
  callGetProduct,
  currentPageNumber,
  totalNumberOfPages,
  categoryDropDown,
  packagesDevicesDropDown,
  operatorBrandsDropDown,
  productRequestRef,
  isAdmin,
}) {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeActions, setActiveActions] = useState(null);
  const [dataActionProduct, setDataActionProduct] = useState(null);
  const [isBlurred, setIsBlurred] = useState(false);
  const [blurTimer, setBlurTimer] = useState(null);

  const [filters, setFilters] = useState({
    // Multi-filter state
    categoryId: "all",
    operatorsBrandsId: "all",
    packagesDevicesId: "all",
  });

  // Add this useEffect in ProductsTable
  useEffect(() => {
    // Only call API if any filter is not "all"
    if (
      filters.categoryId !== "all" ||
      filters.operatorsBrandsId !== "all" ||
      filters.packagesDevicesId !== "all"
    ) {
      callGetProduct(
        filters.categoryId,
        filters.operatorsBrandsId,
        filters.packagesDevicesId,
        1
      );
    } else {
      callGetProduct(null, null, null, 1);
    }
  }, [filters]); // This will trigger whenever filters change

  useEffect(() => {
    startBlurTimer();

    return () => {
      if (blurTimer) clearTimeout(blurTimer);
    };
  }, []);

  const startBlurTimer = () => {
    if (blurTimer) clearTimeout(blurTimer);

    const timer = setTimeout(() => {
      setIsBlurred(true);
    }, 10000); // 20 seconds

    
    setBlurTimer(timer);
  };

  const handleMouseEnter = () => {
    if (blurTimer) clearTimeout(blurTimer);
    setIsBlurred(false);
  };

  const handleMouseLeave = () => {
    startBlurTimer();
  };

  const handleFilterChange = (filterType, value) => {
    // Only update the filter, API call will be triggered by useEffect
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      categoryId: "all",
      operatorsBrandsId: "all",
      packagesDevicesId: "all",
    });
    // setFilterOpen(false);
    // setActiveActions(null);
  };

  const filteredProducts = (products || []).filter((product) => {
    // SEARCH MATCH
    const matchesSearch =
      searchQuery.trim() === "" ||
      getCategoryCodeById(product?.categoryId)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      getOperatorsBrandsCode(product?.operatorsBrandsId)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      getPackageDevicesCode(product?.packagesDevicesId)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.itemCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.englishDescription
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.arabicDescription
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    // FILTER MATCH
    const matchesFilters = products;
    return matchesSearch && matchesFilters;
  });

  const noSearchFound =
    searchQuery.trim() !== "" && filteredProducts.length === 0;

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

  const handleToggleFilter = () => {
    // setActiveActions("filter");
    setActiveActions((prev) => (prev === "filter" ? null : "filter"));
    setFilterOpen(!filterOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (
      filters?.categoryId === "all" &&
      filters?.operatorsBrandsId === "all" &&
      filters?.packagesDevicesId === "all"
    )
      callGetProduct(null, null, null, page);
    else {
      callGetProduct(
        filters?.categoryId,
        filters?.operatorsBrandsId,
        filters?.packagesDevicesId,
        page
      );
    }
  };

  // Get brands for selected category
  const handleAdd = () => {
    setActiveActions("add");
    // Open add product dialog
    setAddDialogOpen(true);
  };

  const handleEdit = () => {
    setActiveActions("edit");
    // Open edit dialog for selected product
    if (selectedRows.size === 1) {
      const productId = Array.from(selectedRows)[0];
      const product = products.find((p) => p.productId === productId);
      if (product) {
        setEditingProduct(product);
        setEditDialogOpen(true);
      }
    }
  };

  // Save product (add or update)
  const handleSaveProduct = async (productData) => {
    // Handle product creation/update
    try {
      if (editingProduct) {
        setDataActionProduct("edit");
        await dhmarketplaceServiceInstance.updateProduct({
          productId: editingProduct.productId,
          ...productData,
        });

        // Refresh product list after updating
        const refreshed = await dhmarketplaceServiceInstance.getAllProduct(
          productRequestRef.current
        );
        setProduct(refreshed?.data);

        setDataActionProduct(null);

        toast({ title: "Product updated successfully" });
        setActiveActions(null);
      } else {
        setDataActionProduct("add");
        const newProduct = {
          // Create new product
          categoryId: productData?.categoryId || "",
          operatorsBrandsId: productData?.operatorsBrandsId || "",
          packagesDevicesId: productData?.packagesDevicesId || "",
          itemCode: productData?.itemCode || "",
          barcode: productData?.barcode || "",
          englishDescription: productData?.englishDescription || "",
          arabicDescription: productData?.arabicDescription || "",
          faceValue: productData?.faceValue || "",
          grossPrice: productData?.grossPrice || "",
          discount: productData?.discount || "",
          percentage: productData?.percentage || "",
          exclusiveVAT: productData?.exclusiveVAT || "",
          inclusiveVAT: productData?.inclusiveVAT || "",
          VAT: productData?.VAT || "",
          status: productData?.status || "",
          storage: productData?.storage || "",
          color: productData?.color || "",
          typeId: productData?.typeId || "",
          weight: productData?.weight || "",
          image: productData?.image || "",
          createdBy: productData?.createdBy || "",
        };

        // Adding new product via API
        const response = await dhmarketplaceServiceInstance.addProduct(
          newProduct
        );

        // Refresh product list after updating
        const refreshed = await dhmarketplaceServiceInstance.getAllProduct(
          productRequestRef.current
        );
        setProduct(refreshed?.data);

        setDataActionProduct(null);

        if (response?.data?.ProductCreationResponse?.success) {
          toast({ title: "Product Added Successfully" });
          setActiveActions(null);
        } else {
          throw new Error("Product Adding Failed!!");
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      toast({ title: "handleSaveProduct Product Operation failed!" });
    }

    setSelectedRows(new Set()); // Clear selection
    setEditingProduct(null); // Reset editing state
  };

  const handleConfirmDelete = async () => {
    const rowsToDelete = Array.from(selectedRows);
    if (rowsToDelete.length === 0) return;

    try {
      setDataActionProduct("delete");
      // Call API for each selected row
      await Promise.all(
        rowsToDelete?.map((id) => {
          return dhmarketplaceServiceInstance.deleteProduct(id);
        })
      );

      // Refresh product list after updating
      const refreshed = await dhmarketplaceServiceInstance.getAllProduct(
        productRequestRef.current
      );
      setProduct(refreshed?.data);

      setDataActionProduct(null);

      toast({
        title: `${rowsToDelete.length} Product(s) deleted successfully`,
      });
      setActiveActions(null);
    } catch (error) {
      toast({ title: "Failed to Delete Product!!" });
    }

    setSelectedRows(new Set()); // Clear selection after delete
    setDeleteDialogOpen(false); // Close confirmation dialog
  };

  function getCategoryCodeById(id, defaultValue = "") {
    return (
      categories.find((cat) => cat.categoryId === id)?.categoryCode ||
      defaultValue
    );
  }

  function getOperatorsBrandsCode(id, defaultValue = "") {
    return (
      operatorsBrands.find((op) => op.operatorsBrandsId === id)
        ?.operatorsBrandsCode || defaultValue
    );
  }

  function getPackageDevicesCode(id, defaultValue = "") {
    return (
      packagesDevices.find((pd) => pd.packagesDevicesId === id)
        ?.packagesDevicesCode || defaultValue
    );
  }

  return (
    <div className="contacts-table-container">
      {/* Header Section */}
      <div className="contacts-table-header">
        <div className="contacts-table-header-content">
          <div className="contacts-table-title-row">
            <h1 className="contacts-table-title">PRODUCTS </h1>
          </div>
          {/* Action Buttons */}
          <ActionButtons
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFilter={handleToggleFilter}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedRowsCount={selectedRows.size}
            activeActions={activeActions}
            isAdmin={isAdmin}
          />

          {filterOpen && ( // Conditional filter panel
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              categories={categories || []}
              operatorsBrands={operatorsBrands || []}
              packagesDevices={packagesDevices || []}
            />
          )}
        </div>
      </div>

      {dataActionProduct && (
        <ActionLoader
          loadingAction={
            dataActionProduct === "add"
              ? "Adding"
              : dataActionProduct === "edit"
              ? "Updating"
              : dataActionProduct === "delete"
              ? "Deleting"
              : null
          }
        />
      )}

      {/* No Search Found Message */}
      {noSearchFound && (
        <div className="no-search-found">
          No Products found for “{searchQuery}”
        </div>
      )}

      {!noSearchFound && (
        <>
          {/* Table Section */}
          <div
            className={`contacts-table-body ${isBlurred ? "blurred" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <ProductsDataTable
              products={filteredProducts}
              productsFault={productsFault}
              categories={categories || []}
              operatorsBrands={operatorsBrands || []}
              packagesDevices={packagesDevices || []}
              selectedRows={selectedRows}
              onSelectRow={handleSelectRow}
              images={images}
              getCategoryCodeById={getCategoryCodeById}
              getOperatorsBrandsCode={getOperatorsBrandsCode}
              getPackageDevicesCode={getPackageDevicesCode}
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

      {/* Add Product Dialog */}
      <ProductFormDialog
        open={addDialogOpen}
        categories={categories || []}
        operatorBrands={operatorsBrands || []}
        packageDevices={packagesDevices || []}
        onClose={() => {
          setAddDialogOpen(false); // Close add dialog
          setActiveActions(null);
        }}
        onSave={handleSaveProduct} // Handle product creation
        mode="add"
        categoryDropDown={categoryDropDown}
        packagesDevicesDropDown={packagesDevicesDropDown}
        operatorBrandsDropDown={operatorBrandsDropDown}
      />

      {/* Edit Product Dialog */}
      <ProductFormDialog
        open={editDialogOpen}
        categories={categories || []}
        operatorBrands={operatorsBrands || []}
        packageDevices={packagesDevices || []}
        onClose={() => {
          setEditDialogOpen(false); // Close edit dialog
          setEditingProduct(null); // Clear editing product
          setActiveActions(null);
        }}
        onSave={handleSaveProduct} // Handle product update
        product={editingProduct} // Pass product to edit
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
