import { useState, useEffect, useRef } from "react";
import { ProductsTable } from "@/components/Product/ProductsTable/ProductsTable";
import { CategoryTable } from "@/components/Category/CategoryTable/CategoryTable";
import { PackageDevicesTable } from "@/components/PackageDevices/PackageDevicesTable/PackageDevicesTable";
import { OperatorBrandTable } from "@/components/OperatorBrand/OperatorBrandTable/OperatorBrandTable";
import { TableSidebar } from "@/components/TableSidebar/TableSidebar";
import "./Index.css";
import { Spinner } from "@/components/ui/spinner"
import dhmarketplaceServiceInstance from "../services/DHMarketPlaceServices"
import { ProductsV2Table } from "../components/ProductV2/ProductsV2Table/ProductsV2Table";
import SyncDataTable from "../components/ProductV2/ProductsV2Table/SyncDataTable";

const Index = ({ role = "admin"}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [productList, setProductList] = useState(null);
  const [productListV2, setProductListV2] = useState(null);
  const [operatorBrands, setOperatorBrands] = useState(null);
  const [packagesDevices, setPackagesDevices] = useState(null);
  const [category, setCategory] = useState(null);
  const [tableView, setTableView] = useState("products");

  const isAdmin = role === "admin";

  const productRequestRef = useRef({
    ProductRequest: {
      categoryId: null,
      operatorsBrandsId: null,
      packagesDevicesId: null,
      filters: {
        categories: true,
        operatorsBrands: true,
        packagesDevices: true,
        products: true,
        images: true,
      },
      pageSetup: {
        pageNumber: 1,
        pageSize: 20,
      },
    },
  });

  const productRequestRefV2 = useRef({
    ProductRequest: {
      category: null,
      operatorBrand: null,
      package: null,
      itemCode: null,
      barcode: null,
      pageSetup: {
        pageNumber: 1,
        pageSize: 20,
      },
    },
  });

  useEffect(() => {
      // Fetch Products Data
      dhmarketplaceServiceInstance
      .getAllProduct(productRequestRef.current)
      .then((response) => {
          setProductList(response?.data);
      })
      .catch((error) => {
          console.error("API Error getAllProduct:", error);
      });

      // Fetch Products Data for V2
      dhmarketplaceServiceInstance
      .getAllProductV2(productRequestRefV2.current)
      .then((response) => {
          setProductListV2(response?.data);
      })
      .catch((error) => {
          console.error("API Error getAllProductV2:", error);
      });

      // Fetch Operators Brands Data
      dhmarketplaceServiceInstance
      .getAllOperatorsBrands()
      .then((response) => {
          setOperatorBrands(response?.data);
      })
      .catch((error) => {
          console.error("API Error getAllOperatorsBrands:", error);
      });

      // Fetch Packages Devices Data
      dhmarketplaceServiceInstance
      .getAllPackagesDevices()
      .then((response) => {
          setPackagesDevices(response?.data);
      })
      .catch((error) => {
          console.error("API Error getAllPackagesDevices:", error);
      });

      // Fetch Category Data
      dhmarketplaceServiceInstance
      .getAllCategory()
      .then((response) => {
          setCategory(response?.data);
      })
      .catch((error) => {
          console.error("API Error getAllCategory:", error);
      });

  }, []);

  function callGetProduct(categoryId, operatorsBrandsId, packagesDevicesId, pageNumber, from) {
    // Destructure the ref to get everything except pageSetup
    const { pageSetup, ...restProductRequest } = productRequestRef.current.ProductRequest;

    // Create base request without pageSetup
    const baseRequest = {
      ProductRequest: {
        ...restProductRequest,
        categoryId: categoryId !== "all" ? categoryId : null,
        operatorsBrandsId: operatorsBrandsId !== "all" ? operatorsBrandsId : null,
        packagesDevicesId: packagesDevicesId !== "all" ? packagesDevicesId : null,
      }
    };

    // Only add pageSetup if pageNumber is valid
    if (pageNumber !== undefined && pageNumber !== null && pageNumber !== "") {
      baseRequest.ProductRequest.pageSetup = {
        pageNumber: pageNumber,
        pageSize: 20
      };
    }

    // Update the ref so next calls use the new page & filters
    productRequestRef.current = baseRequest;

    // Call API
    dhmarketplaceServiceInstance
      .getAllProduct(baseRequest)
      .then((response) => {
        setProductList(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }

  function callGetProductV2(category, operatorBrand, packages, itemCode, pageNumber, barcode, from) {
    // Destructure the ref to get everything except pageSetup
    const { pageSetup, ...restProductRequest } = productRequestRefV2.current.ProductRequest;

    // Create base request without pageSetup
    const baseRequest = {
      ProductRequest: {
        ...restProductRequest,
        category: category !== "all" ? category : null,
        operatorBrand: operatorBrand !== "all" ? operatorBrand : null,
        package: packages !== "all" ? packages : null,
        itemCode: itemCode || null,
        barcode: barcode || null
      }
    };

    // Only add pageSetup if pageNumber is valid
    if (pageNumber !== undefined && pageNumber !== null && pageNumber !== "") {
      baseRequest.ProductRequest.pageSetup = {
        pageNumber: pageNumber,
        pageSize: 20
      };
    }

    // Update the ref so next calls use the new page & filters
    productRequestRefV2.current = baseRequest;

    // Call API
    dhmarketplaceServiceInstance
      .getAllProductV2(baseRequest)
      .then((response) => {
        setProductListV2(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }

  // Show a loading message until data is fetched
  if (!productList || !productListV2 || !operatorBrands || !packagesDevices || !category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="spinner-main size-8" />
      </div>
    )
  }
  
  // --- Dynamic Table View Renderer ---
  const renderTableView = () => {
    switch (tableView) {
      case "products":
        return (
          <ProductsTable
            products={productList?.ProductResponse?.success?.products?.product}
            productsFault={productList?.ProductResponse?.fault}
            setProduct={setProductList}
            categories={productList?.ProductResponse?.success?.categories?.category}
            operatorsBrands={
              productList?.ProductResponse?.success?.operatorsBrands?.operatorBrand
            }
            packagesDevices={
              productList?.ProductResponse?.success?.packagesDevices?.packageDevice
            }
            callGetProduct={callGetProduct}
            currentPageNumber={productList?.ProductResponse?.success?.pageDetails?.currentPageNumber}
            totalNumberOfPages={productList?.ProductResponse?.success?.pageDetails?.totalNumberOfPages}
            categoryDropDown={category?.CategoryResponse?.success?.categoryDetails}
            packagesDevicesDropDown={packagesDevices?.PackagesDevicesResponse?.success?.packagesDevicesDetails}
            operatorBrandsDropDown={operatorBrands?.OperatorsBrandsResponse?.success?.operatorsBrandsDetails}
            productRequestRef={productRequestRef}
            images={productList?.ProductResponse?.success?.images?.image}
            isAdmin={isAdmin}
          />
        );
      case "productsV2": {
        const pageDetails = productListV2?.ProductResponse?.success?.pageDetails;
        const totalResults = pageDetails?.totalNumberOfResults ?? 0;
        const pageSize = pageDetails?.pageSize ?? 20;
        const backendTotalPages = pageDetails?.totalNumberOfPages ?? 0;

        // Backend uses floor division (108/20=5), losing last 8 records.
        // Always recompute using ceiling so the last partial page is reachable.
        const computedTotalPages = Math.max(1, Math.ceil(totalResults / pageSize));
        
        return (
          <ProductsV2Table
            products={productListV2?.ProductResponse?.success?.productDetails}
            productsFault={productListV2?.ProductResponse?.fault}
            setProduct={setProductListV2}
            callGetProductV2={callGetProductV2}
            currentPageNumber={pageDetails?.currentPageNumber}
            totalNumberOfPages={computedTotalPages}
            categoryDropDown={category?.CategoryResponse?.success?.categoryDetails}
            packagesDevicesDropDown={packagesDevices?.PackagesDevicesResponse?.success?.packagesDevicesDetails}
            operatorBrandsDropDown={operatorBrands?.OperatorsBrandsResponse?.success?.operatorsBrandsDetails}
            productRequestRefV2={productRequestRefV2}
            images={productListV2?.ProductResponse?.success?.imageDetails}
            isAdmin={isAdmin}
          />
        );
      }
      case "categories":
        return (
          <CategoryTable
            categories={category?.CategoryResponse?.success?.categoryDetails}
            setCategory={setCategory}
            title={"CATEGORY"}
            isAdmin={isAdmin}
          />
        );
      case "packages":
        return (
          <PackageDevicesTable
            packageDevices={packagesDevices?.PackagesDevicesResponse?.success?.packagesDevicesDetails}
            setPackagesDevices={setPackagesDevices}
            title={"PACKAGE DEVICES"}
            isAdmin={isAdmin}
          />
        );
      case "operators":
        return (
          <OperatorBrandTable
            operatorsBrands={operatorBrands?.OperatorsBrandsResponse?.success?.operatorsBrandsDetails}
            setOperatorBrands={setOperatorBrands}
            title={"OPERATOR BRANDS"}
            isAdmin={isAdmin}
          />
        );
      case "syncdata":
        return (
          <SyncDataTable
        
          />
        );
    }
  };

  return (
    <div className="index-container">
      <div className="index-main-flex">
        <TableSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          tableView={tableView}
          setTableView={setTableView}
        />
        
        <div className="index-content">
          {/* Main Content */}
          <main className="index-main">{renderTableView()}</main>
        </div>
      </div>
    </div>
  );
};

export default Index;