import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "./ProductsTable.css";
import "./FilterPanel.css";
import { useState, useEffect, useMemo } from "react";

export function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  categories,
  operatorsBrands,
  packagesDevices,
}) {
  const [filteredOperatorsBrandsList, setFilteredOperatorsBrandsList] =
    useState([]);
  const [filteredPackagesDevicesList, setFilteredPackagesDevicesList] =
    useState([]);

  const [previousCategoriesList, setPreviousCategoriesList] = useState([]);
  const [previousOperatorsBrandsList, setPreviousOperatorsBrandsList] =
    useState([]);
  const [previousPackagesDevicesList, setPreviousPackagesDevicesList] =
    useState([]);

  // Update previous categories only when valid data exists
  useEffect(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      setPreviousCategoriesList(categories);
    }
    if (
      Array.isArray(filteredOperatorsBrandsList) &&
      filteredOperatorsBrandsList.length > 0
    ) {
      setPreviousOperatorsBrandsList(filteredOperatorsBrandsList);
    }
    if (
      Array.isArray(filteredPackagesDevicesList) &&
      filteredPackagesDevicesList.length > 0
    ) {
      setPreviousPackagesDevicesList(filteredPackagesDevicesList);
    }
  }, [categories, filteredOperatorsBrandsList, filteredPackagesDevicesList]);

  // Use categories if present, otherwise fallback
  const categoryOptions = useMemo(() => {
    return categories?.length > 0 ? categories : previousCategoriesList;
  }, [categories, previousCategoriesList]);

  const operatorsBrandsOptions = useMemo(() => {
    return filteredOperatorsBrandsList?.length > 0
      ? filteredOperatorsBrandsList
      : previousOperatorsBrandsList;
  }, [filteredOperatorsBrandsList, previousOperatorsBrandsList]);

  const packagesDevicesOptions = useMemo(() => {
    return filteredPackagesDevicesList?.length > 0
      ? filteredPackagesDevicesList
      : previousPackagesDevicesList;
  }, [filteredPackagesDevicesList, previousPackagesDevicesList]);

  // Handle category change - reset brand and package when category changes
  const handleCategoryChange = (value) => {
    // Reset brand and package filters when category changes
    if (value === "all") {
      // If selecting "All Categories", reset both brand and package
      onFilterChange("categoryId", value);
      onFilterChange("operatorsBrandsId", "all");
      onFilterChange("packagesDevicesId", "all");
    } else {
      // If selecting a specific category, just reset brand and package
      onFilterChange("categoryId", value);
      onFilterChange("operatorsBrandsId", "all");
      onFilterChange("packagesDevicesId", "all");
    }
  };

  // Handle brand change - reset package when brand changes
  const handleBrandChange = (value) => {
    if (value === "all") {
      onFilterChange("operatorsBrandsId", value);
      onFilterChange("packagesDevicesId", "all");
    } else {
      onFilterChange("operatorsBrandsId", value);
      onFilterChange("packagesDevicesId", "all");
    }
  };

  // Update filtered operators when category changes
  useEffect(() => {
    if (filters.categoryId !== "all") {
      const matchedOperators = operatorsBrands.filter((operator) =>
        operator?.categories?.category?.some(
          (cat) => cat.categoryId == filters.categoryId
        )
      );
      setFilteredOperatorsBrandsList(matchedOperators);
    } else {
      // If "all" categories, show all operators
      setFilteredOperatorsBrandsList(operatorsBrands);
    }
  }, [filters.categoryId, operatorsBrands]);

  // Update filtered packages when brand changes
  useEffect(() => {
    if (filters.operatorsBrandsId !== "all") {
      const matchedPackages = packagesDevices.filter((packageDevice) =>
        packageDevice?.operatorsBrands?.operatorBrand?.some(
          (brand) => brand.operatorsBrandsId == filters.operatorsBrandsId
        )
      );
      setFilteredPackagesDevicesList(matchedPackages);
    } else {
      // If "all" brands, show all packages
      setFilteredPackagesDevicesList(packagesDevices);
    }
  }, [filters.operatorsBrandsId, packagesDevices]);

  // Handle clear all filters
  const handleClearAllFilters = () => {
    onClearFilters();
    setFilteredOperatorsBrandsList(operatorsBrands);
    setFilteredPackagesDevicesList(packagesDevices);
  };

  return (
    <div className="contacts-table-filter-box ">
      <div className="contacts-table-filter-content ">
        <div className="flex gap-4">
          {/* Category Filter */}
          <div className="filterBgColor">
            <span className="contacts-table-filter-label">Category:</span>
            <Select
              value={filters.categoryId}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="contacts-table-filter-select">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map((category, index) => (
                  <SelectItem key={index} value={category.categoryId}>
                    {category.categoryCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand Filter */}
          <div className="filterBgColor">
            <span className="contacts-table-filter-label">Brand:</span>
            <Select
              value={filters.operatorsBrandsId}
              onValueChange={handleBrandChange}
              disabled={filters.categoryId === "all"}
            >
              <SelectTrigger className="contacts-table-filter-select">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {operatorsBrandsOptions.map((brand, index) => (
                  <SelectItem key={index} value={brand.operatorsBrandsId}>
                    {brand.operatorsBrandsCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Package Filter */}
          <div className="filterBgColor">
            <span className="contacts-table-filter-label">Package:</span>
            <Select
              value={filters.packagesDevicesId}
              onValueChange={(value) =>
                onFilterChange("packagesDevicesId", value)
              }
              disabled={
                filters.categoryId === "all" ||
                filters.operatorsBrandsId === "all"
              }
            >
              <SelectTrigger className="contacts-table-filter-select">
                <SelectValue placeholder="Select Package" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                {packagesDevicesOptions.map((device, index) => (
                  <SelectItem key={index} value={device.packagesDevicesId}>
                    {device.packagesDevicesCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="filter-clear-align">
          <Button size="sm" onClick={handleClearAllFilters}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
