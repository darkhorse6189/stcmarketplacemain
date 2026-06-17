import { useState, useEffect } from "react";
import { ProductV2FormDialog } from "../ProductV2FormDialog/ProductV2FormDialog";
import { DeleteConfirmDialog } from "../../DeleteDialog/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import "./ProductsV2Table.css";
import { ActionButtons } from "./ActionButtons";
import { FilterPanel } from "./FilterPanel";
import { ProductsV2DataTable } from "./ProductsV2DataTable";
import Pagination from "../../Pagination/Pagination";
import dhmarketplaceServiceInstance from "../../../services/DHMarketPlaceServices";
import { ActionLoader } from "../../ActionLoader/ActionLoader";

export function ProductsV2Table({
  products,
  productsFault,
  setProduct,
  images,
  callGetProductV2,
  currentPageNumber,
  totalNumberOfPages,
  categoryDropDown,
  packagesDevicesDropDown,
  operatorBrandsDropDown,
  productRequestRefV2,
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
    category: "all",
    operatorBrand: "all",
    package: "all",
  });

  useEffect(() => {
    if (
      filters.category !== "all" ||
      filters.operatorBrand !== "all" ||
      filters.package !== "all"
    ) {
      callGetProductV2(
        filters.category,
        filters.operatorBrand,
        filters.package,
        null,
        1,
        null
      );
    } else {
      callGetProductV2(null, null, null, null, 1, null);
    }
  }, [filters]);

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
    }, 10000);


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
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ category: "all", operatorBrand: "all", package: "all" });
  };

  const filteredProducts = (products || []).filter((product) => {
    if (searchQuery.trim() === "") return true;
    const q = searchQuery.toLowerCase();
    return (
      product.category?.toLowerCase().includes(q) ||
      product.operatorBrand?.toLowerCase().includes(q) ||
      product.package?.toLowerCase().includes(q) ||
      product.itemCode?.toLowerCase().includes(q) ||
      product.barcode?.toLowerCase().includes(q) ||
      product.productDescriptionEnglish?.toLowerCase().includes(q) ||
      product.productDescriptionArabic?.toLowerCase().includes(q) ||
      product.packageDescriptionEnglish?.toLowerCase().includes(q) ||
      product.packageDescriptionArabic?.toLowerCase().includes(q)
    );
  });

  const noSearchFound =
    searchQuery.trim() !== "" && filteredProducts.length === 0;

  const handleSelectRow = (id, checked) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleAdd = () => {
    setActiveActions("add");
    setAddDialogOpen(true);
  };

  const handleEdit = () => {
    setActiveActions("edit");
    if (selectedRows.size === 1) {
      const productId = Array.from(selectedRows)[0];
      const product = products.find((p) => p.productId === productId);
      if (product) {
        setEditingProduct(product);
        setEditDialogOpen(true);
      }
    }
  };

  const handleDelete = () => {
    setActiveActions("delete");
    setDeleteDialogOpen(true);
  };

  const handleToggleFilter = () => {
    setActiveActions((prev) => (prev === "filter" ? null : "filter"));
    setFilterOpen((prev) => !prev);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handlePageChange = (page) => {
    const { category, operatorBrand, package: pkg } = filters;
    callGetProductV2(
      category !== "all" ? category : null,
      operatorBrand !== "all" ? operatorBrand : null,
      pkg !== "all" ? pkg : null,
      null,
      page,
      null
    );
  };

  // Save product (add or update)
  const handleSaveProduct = async (productData) => {
    // Handle product creation/update
    try {
      if (editingProduct) {
        setDataActionProduct("edit");

        const updatePayload = {
          productId: editingProduct.productId,
          category: productData?.category || "",
          operatorBrand: productData?.operatorBrand || "",
          package: productData?.package || "",
          packageDescriptionEnglish: productData?.packageDescriptionEnglish || "",
          packageDescriptionArabic: productData?.packageDescriptionArabic || "",
          itemCode: productData?.itemCode || "",
          barcode: productData?.barcode || "",
          productDescriptionEnglish: productData?.productDescriptionEnglish || "",
          productDescriptionArabic: productData?.productDescriptionArabic || "",
          logoEnglish: productData?.logoEnglish || "",
          logoArabic: productData?.logoArabic || "",
          inclusiveVAT: productData?.inclusiveVAT || "",
          commission: productData?.commission || "",
          modifiedBy: productData?.modifiedBy || "",
        };

        await dhmarketplaceServiceInstance.updateProductV2(updatePayload);

        // Refresh product list after updating
        const refreshed = await dhmarketplaceServiceInstance.getAllProductV2(
          productRequestRefV2.current
        );

        setProduct(refreshed?.data);
        setDataActionProduct(null);
        toast({ title: "Product updated successfully" });
        setActiveActions(null);
      } else {
        setDataActionProduct("add");

        const createPayload = {
          category: productData?.category || "",
          operatorBrand: productData?.operatorBrand || "",
          package: productData?.package || "",
          packageDescriptionEnglish: productData?.packageDescriptionEnglish || "",
          packageDescriptionArabic: productData?.packageDescriptionArabic || "",
          itemCode: productData?.itemCode || "",
          barcode: productData?.barcode || "", // ← NEW
          productDescriptionEnglish: productData?.productDescriptionEnglish || "",
          productDescriptionArabic: productData?.productDescriptionArabic || "",
          inclusiveVAT: productData?.inclusiveVAT || "",
          logoEnglish: productData?.logoEnglish || "",
          logoArabic: productData?.logoArabic || "",
          commission: productData?.commission || "",
          createdBy: productData?.createdBy || "",
        };

        // Adding new product via API
        const response = await dhmarketplaceServiceInstance.addProductV2(
          createPayload
        );

        // Refresh product list after updating
        const refreshed = await dhmarketplaceServiceInstance.getAllProductV2(
          productRequestRefV2.current
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

    setSelectedRows(new Set());
    setEditingProduct(null);
  };

  const handleConfirmDelete = async () => {
    const rowsToDelete = Array.from(selectedRows);
    if (rowsToDelete.length === 0) return;

    try {
      setDataActionProduct("delete");
      // Call API for each selected row
      await Promise.all(
        rowsToDelete?.map((id) => {
          return dhmarketplaceServiceInstance.deleteProductV2(id);
        })
      );

      // Refresh product list after updating
      const refreshed = await dhmarketplaceServiceInstance.getAllProductV2(
        productRequestRefV2.current
      );
      setProduct(refreshed?.data);
      setDataActionProduct(null);
      toast({
        title: `${rowsToDelete.length} product(s) deleted successfully`,
      });
      setActiveActions(null);
    } catch (error) {
      toast({ title: "Failed to Delete Product!!" });
    }

    setSelectedRows(new Set()); // Clear selection after delete
    setDeleteDialogOpen(false); // Close confirmation dialog
  };

  return (
    <div className="contacts-table-container">
      {/* Header Section */}
      <div className="contacts-table-header">
        <div className="contacts-table-header-content">
          <div className="contacts-table-title-row">
            <h1 className="contacts-table-title">PRODUCTS V2</h1>
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
            isAdmin={false}
          />

          {/* {filterOpen && ( // Conditional filter panel
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              categoryDropDown={categoryDropDown || []}
              operatorBrandsDropDown={operatorBrandsDropDown || []}
              packagesDevicesDropDown={packagesDevicesDropDown || []}
            /> 
          )} */}
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
            <ProductsV2DataTable
              products={filteredProducts}
              productsFault={productsFault}
              selectedRows={selectedRows}
              onSelectRow={handleSelectRow}
              images={images}
              isAdmin={false}
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
      <ProductV2FormDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          setActiveActions(null);
        }}
        onSave={handleSaveProduct}
        mode="add"
        categoryDropDown={categoryDropDown}
        packagesDevicesDropDown={packagesDevicesDropDown}
        operatorBrandsDropDown={operatorBrandsDropDown}
      />

      {/* Edit Product Dialog */}
      <ProductV2FormDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingProduct(null);
          setActiveActions(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
        mode="edit"
        categoryDropDown={categoryDropDown}
        packagesDevicesDropDown={packagesDevicesDropDown}
        operatorBrandsDropDown={operatorBrandsDropDown}
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
