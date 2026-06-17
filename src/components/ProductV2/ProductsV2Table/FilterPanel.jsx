import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "./ProductsV2Table.css";
import "./FilterPanel.css";

export function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  categoryDropDown,
  operatorBrandsDropDown,
  packagesDevicesDropDown,
}) {
  
  // Handle category change - reset brand and package when category changes
  const handleCategoryChange = (value) => {
     // Changing category resets dependent filters
    onFilterChange("category", value);
    onFilterChange("operatorBrand", "all");
    onFilterChange("package", "all");
  };

  // Handle brand change - reset package when brand changes
  const handleBrandChange = (value) => {
    // Changing brand resets package filter
    onFilterChange("operatorBrand", value);
    onFilterChange("package", "all");
  };

  const handlePackageChange = (value) => {
    onFilterChange("package", value);
  };

  // Handle clear all filters
  const handleClearAll = () => {
    onClearFilters();
  };

  return (
    <div className="contacts-table-filter-box">
      <div className="contacts-table-filter-content">
        <div className="flex gap-4">
          {/* Category Filter */}
          <div className="filterBgColor">
            <span className="contacts-table-filter-label">Category:</span>
            <Select
              value={filters.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="contacts-table-filter-select">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {(categoryDropDown || []).map((cat, index) => (
                  <SelectItem
                    key={cat.categoryId ?? index}
                    value={cat.categoryCode}
                  >
                    {cat.categoryCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand Filter */}
          <div className="filterBgColor">
            <span className="contacts-table-filter-label">Brand:</span>
            <Select
              value={filters.operatorBrand}
              onValueChange={handleBrandChange}
              disabled={filters.category === "all"}
            >
              <SelectTrigger className="contacts-table-filter-select">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {(operatorBrandsDropDown || []).map((brand, index) => (
                  <SelectItem
                    key={brand.operatorsBrandsId ?? index}
                    value={brand.operatorsBrandsCode}
                  >
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
              value={filters.package}
              onValueChange={handlePackageChange}
              disabled={
                filters.category === "all" || filters.operatorBrand === "all"
              }
            >
              <SelectTrigger className="contacts-table-filter-select">
                <SelectValue placeholder="Select Package" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                {(packagesDevicesDropDown || []).map((pkg, index) => (
                  <SelectItem
                    key={pkg.packagesDevicesId ?? index}
                    value={pkg.packagesDevicesCode}
                  >
                    {pkg.packagesDevicesCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="filter-clear-align">
          <Button size="sm" onClick={handleClearAll}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
