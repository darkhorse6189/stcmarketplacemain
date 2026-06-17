import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./PackageDevicesFormDialog.css"
import "./PackageDevicesFormContent.css"

export function PackageDevicesFormContent({
  formData,
  setFormData,
  mode
}) {
  return (
    <div className="contact-form-grid">
      {/* Package Devices Info */}
      <div className="contact-form-row">
        <div className="contact-form-field">
          <Label>Package Devices Code</Label>
          <Input
            value={formData.packagesDevicesCode} // Bind to form state
            onChange={(e) =>
              setFormData({ ...formData, packagesDevicesCode: e.target.value }) // Update code field
            }
            placeholder="Enter Package Device Code"
          />
        </div>
        <div className="contact-form-field">
          <Label>Description (EN)</Label>
          <Input
            value={formData.englishName} // Bind to form state
            onChange={(e) =>
              setFormData({ ...formData, englishName: e.target.value }) // Update English name field
            }
            placeholder="Enter English Name"
          />
        </div>
        <div className="contact-form-field">
          <Label>Description (AR)</Label>
          <Input
            value={formData.arabicName} // Bind to form state
            onChange={(e) =>
              setFormData({ ...formData, arabicName: e.target.value }) // Update Arabic name field
            }
            placeholder="Enter Arabic Name" 
          />
        </div>
      </div>

      <div className="contact-form-row">
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
            required={true}
          />
        </div>
      </div>
    </div>
  );
}