import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import "./ProductFormContent.css";

export function ProductFormContent({
  formData,
  setFormData,
  mode,
  categoryDropDown,
  packagesDevicesDropDown,
  operatorBrandsDropDown,
}) {
  return (
    <div className="contact-form-grid">
      {/* Category, Operator, Package */}
      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Category</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(val) =>
              setFormData({ ...formData, categoryId: val })
            }
            disabled={mode === "edit"}
          >
            <SelectTrigger className="select-trigger">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {mode === "add" ? (
                categoryDropDown?.map((cat, index) => (
                  <SelectItem key={index} value={cat.categoryId}>
                    {cat.categoryCode}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={formData.categoryId || undefined}>
                  {formData.categoryId}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="contact-form-field">
          <Label>Operator Brand</Label>
          <Select
            value={formData.operatorsBrandsId}
            onValueChange={(val) =>
              setFormData({ ...formData, operatorsBrandsId: val })
            }
            disabled={mode === "edit"}
          >
            <SelectTrigger className="select-trigger">
              <SelectValue placeholder="Select operator brand" />
            </SelectTrigger>
            <SelectContent>
              {mode === "add" ? (
                operatorBrandsDropDown?.map((brand, index) => (
                  <SelectItem key={index} value={brand?.operatorsBrandsId}>
                    {brand?.operatorsBrandsCode}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={formData.operatorsBrandsId || undefined}>
                  {formData.operatorsBrandsId}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="contact-form-field">
          <Label>Package Device</Label>
          <Select
            value={formData.packagesDevicesId}
            onValueChange={(val) =>
              setFormData({ ...formData, packagesDevicesId: val })
            }
            disabled={mode === "edit"}
          >
            <SelectTrigger className="select-trigger">
              <SelectValue placeholder="Select package/device" />
            </SelectTrigger>
            <SelectContent>
              {mode === "add" ? (
                packagesDevicesDropDown?.map((packageDevice, index) => (
                  <SelectItem key={index} value={packageDevice?.packagesDevicesId}>
                    {packageDevice?.packagesDevicesCode}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={formData.packagesDevicesId || undefined}>
                  {formData.packagesDevicesId}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Info */}
      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Item Code</Label>
          <Input
            value={formData.itemCode}
            onChange={(e) =>
              setFormData({ ...formData, itemCode: e.target.value })
            }
            placeholder="Enter Item Code"
          />
        </div>
        <div className="contact-form-field">
          <Label>Barcode</Label>
          <Input
            value={formData.barcode}
            onChange={(e) =>
              setFormData({ ...formData, barcode: e.target.value })
            }
            placeholder="Enter Barcode"
          />
        </div>
        <div className="contact-form-field">
          <Label>English Description</Label>
          <Input
            value={formData.englishDescription}
            onChange={(e) =>
              setFormData({ ...formData, englishDescription: e.target.value })
            }
            placeholder="Enter English Description"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Arabic Description</Label>
          <Input
            value={formData.arabicDescription}
            onChange={(e) =>
              setFormData({ ...formData, arabicDescription: e.target.value })
            }
            placeholder="Enter Arabic Description"
          />
        </div>
        <div className="contact-form-field">
          <Label>Face Value</Label>
          <Input
            type="number"
            value={formData.faceValue}
            onChange={(e) =>
              setFormData({ ...formData, faceValue: e.target.value })
            }
            placeholder="Enter Face Value"
          />
        </div>
        <div className="contact-form-field">
          <Label>Gross Price</Label>
          <Input
            type="number"
            value={formData.grossPrice}
            onChange={(e) =>
              setFormData({ ...formData, grossPrice: e.target.value })
            }
            placeholder="Enter Gross Price"
          />
        </div>
      </div>
      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Discount</Label>
          <Input
            type="number"
            value={formData.discount}
            onChange={(e) =>
              setFormData({ ...formData, discount: e.target.value })
            }
            placeholder="Enter Discount"
          />
        </div>
        <div className="contact-form-field">
          <Label>Percentage</Label>
          <Input
            type="number"
            value={formData.percentage}
            onChange={(e) =>
              setFormData({ ...formData, percentage: e.target.value })
            }
            placeholder="Enter Percentage"
          />
        </div>
        <div className="contact-form-field">
          <Label>Exclusive VAT</Label>
          <Input
            type="number"
            value={formData.exclusiveVAT}
            onChange={(e) =>
              setFormData({ ...formData, exclusiveVAT: e.target.value })
            }
            placeholder="Enter Exclusive VAT"
          />
        </div>
      </div>
      {/* Pricing */}
      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Inclusive VAT</Label>
          <Input
            type="number"
            value={formData.inclusiveVAT}
            onChange={(e) =>
              setFormData({ ...formData, inclusiveVAT: e.target.value })
            }
            placeholder="Enter Inclusive VAT"
          />
        </div>
        <div className="contact-form-field">
          <Label>VAT</Label>
          <Input
            type="number"
            value={formData.VAT}
            onChange={(e) => setFormData({ ...formData, VAT: e.target.value })}
            placeholder="Enter VAT"
          />
        </div>
        <div className="contact-form-field">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Y">Active</SelectItem>
              <SelectItem value="N">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Storage</Label>
          <Input
            value={formData.storage}
            onChange={(e) =>
              setFormData({ ...formData, storage: e.target.value })
            }
            placeholder="Enter Storage"
          />
        </div>
        <div className="contact-form-field">
          <Label>Color</Label>
          <Input
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
            placeholder="Enter Color"
          />
        </div>
        <div className="contact-form-field">
          <Label>Type ID</Label>
          <Input
            type="number"
            value={formData.typeId}
            onChange={(e) =>
              setFormData({ ...formData, typeId: e.target.value })
            }
            placeholder="Enter Type ID"
          />
        </div>
      </div>
      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Weight</Label>
          <Input
            type="number"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: e.target.value })
            }
            placeholder="Enter Weight"
          />
        </div>
        <div className="contact-form-field uploadType">
          <Label>Image</Label>
          <Input
            // value={formData.image}
            type="file" 
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
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
      </div>
    </div>
  );
}
