import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import "./ProductV2FormContent.css";

// Returns a deduplicated array keeping the first occurrence of each unique value
const dedupe = (arr = [], valueKey) =>
  arr.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t[valueKey] === item[valueKey])
);

export function ProductV2FormContent({
  formData,
  setFormData,
  mode,
  categoryDropDown,
  packagesDevicesDropDown,
  operatorBrandsDropDown,
}) {

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });
  const setSelect = (key) => (val) => setFormData({ ...formData, [key]: val });

  const handleFileChange = (key) => (e) => {
    const file = e.target.files[0] ?? null;
    setFormData({ ...formData, [key]: file });
  };

  // Deduplicated dropdown lists
  const uniqueCategories = dedupe(categoryDropDown, "categoryCode");
  const uniqueBrands = dedupe(operatorBrandsDropDown, "operatorsBrandsCode");
  const uniquePackages = dedupe(packagesDevicesDropDown, "packagesDevicesCode");

  return (
    <div className="contact-form-grid">
      {/* Category, Operator, Package */}
      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={setSelect("category")}
            disabled={mode === "edit"}
          >
            <SelectTrigger className="select-trigger">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {mode === "add" ? (
                uniqueCategories?.map((cat, i) => (
                  <SelectItem
                    key={cat.categoryId ?? i}
                    value={cat.categoryCode}
                  >
                    {cat.categoryCode}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={formData.category || " "}>
                  {formData.category}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="contact-form-field">
          <Label>Operator Brand</Label>
          <Select
            value={formData.operatorBrand}
            onValueChange={setSelect("operatorBrand")}
            disabled={mode === "edit"}
          >
            <SelectTrigger className="select-trigger">
              <SelectValue placeholder="Select operator brand" />
            </SelectTrigger>
            <SelectContent>
              {mode === "add" ? (
                uniqueBrands?.map((brand, i) => (
                  <SelectItem
                    key={brand.operatorsBrandsId ?? i}
                    value={brand.operatorsBrandsCode}
                  >
                    {brand.operatorsBrandsCode}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={formData.operatorBrand || " "}>
                  {formData.operatorBrand}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="contact-form-field">
          <Label>Package</Label>
          <Select
            value={formData.package}
            onValueChange={setSelect("package")}
            disabled={mode === "edit"}
          >
            <SelectTrigger className="select-trigger">
              <SelectValue placeholder="Select package" />
            </SelectTrigger>
            <SelectContent>
              {mode === "add" ? (
                uniquePackages?.map((pkg, i) => (
                  <SelectItem
                    key={pkg.packagesDevicesId ?? i}
                    value={pkg.packagesDevicesCode}
                  >
                    {pkg.packagesDevicesCode}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={formData.package || " "}>
                  {formData.package}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Package Descriptions */}
      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Package Description (EN)</Label>
          <Input
            value={formData.packageDescriptionEnglish}
            onChange={set("packageDescriptionEnglish")}
            placeholder="Enter Package Description (English)"
          />
        </div>
        <div className="contact-form-field">
          <Label>Package Description (AR)</Label>
          <Input
            value={formData.packageDescriptionArabic}
            onChange={set("packageDescriptionArabic")}
            placeholder="Enter Package Description (Arabic)"
            dir="rtl"
          />
        </div>
        <div className="contact-form-field">
          <Label>Item Code</Label>
          <Input
            value={formData.itemCode}
            onChange={set("itemCode")}
            placeholder="Enter Item Code"
          />
        </div>
      </div>

      {/* Product Descriptions */}
      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Barcode</Label>
          <Input
            value={formData.barcode}
            onChange={set("barcode")}
            placeholder="Enter Barcode"
          />
        </div>
        <div className="contact-form-field">
          <Label>Product Description (EN)</Label>
          <Input
            value={formData.productDescriptionEnglish}
            onChange={set("productDescriptionEnglish")}
            placeholder="Enter Product Description (English)"
          />
        </div>
        <div className="contact-form-field">
          <Label>Product Description (AR)</Label>
          <Input
            value={formData.productDescriptionArabic}
            onChange={set("productDescriptionArabic")}
            placeholder="Enter Product Description (Arabic)"
            dir="rtl"
          />
        </div>
      </div>

      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Inclusive VAT</Label>
          <Input
            type="number"
            value={formData.inclusiveVAT}
            onChange={set("inclusiveVAT")}
            placeholder="Enter Inclusive VAT"
          />
        </div>

        <div className="contact-form-field uploadType">
          <Label>
            Logo (EN)
            {mode === "add" && <span className="required-star"> *</span>}
          </Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange("logoEnglishFile")}
          />
          {/* Show current image name when editing */}
          {mode === "edit" && !formData.logoEnglishFile && (
            <span className="current-file-hint">
              {formData.logoEnglish
                ? "Current logo on file"
                : "No logo uploaded"}
            </span>
          )}
        </div>

        <div className="contact-form-field uploadType">
          <Label>
            Logo (AR)
            {mode === "add" && <span className="required-star"> *</span>}
          </Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange("logoArabicFile")}
          />
          {mode === "edit" && !formData.logoArabicFile && (
            <span className="current-file-hint">
              {formData.logoArabic
                ? "Current logo on file"
                : "No logo uploaded"}
            </span>
          )}
        </div>
      </div>

      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Commission</Label>
          <Input
            type="number"
            step="0.001"
            value={formData.commission}
            onChange={set("commission")}
            placeholder="Enter Commission"
          />
        </div>

        {/* Created By / Modified By */}
        <div className="contact-form-field">
          <Label>{mode === "edit" ? "Modified By" : "Created By"}</Label>
          <Input
            value={mode === "edit" ? formData.modifiedBy : formData.createdBy}
            onChange={(e) =>
              setFormData({
                ...formData,
                ...(mode === "edit"
                  ? { modifiedBy: e.target.value }
                  : { createdBy: e.target.value }),
              })
            }
            placeholder={
              mode === "edit" ? "Enter Modified By" : "Enter Created By"
            }
          />
        </div>

        {/* Empty third column to keep the 3-column grid consistent */}
        <div className="contact-form-field" />
      </div>

    </div>
  );
}
