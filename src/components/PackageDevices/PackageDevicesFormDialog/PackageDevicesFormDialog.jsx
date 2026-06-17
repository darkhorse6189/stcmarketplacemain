import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "./PackageDevicesFormDialog.css"
import { PackageDevicesFormContent } from "./PackageDevicesFormContent";
export function PackageDevicesFormDialog({
  open,
  onClose,
  onSave,
  packageDevice,
  mode,
}) {
  const [formData, setFormData] = useState({ // Form state management
    packagesDevicesId: "",
    packagesDevicesCode: "",
    englishName: "",
    arabicName: "",
    createdBy: "",
    modifiedBy: "",
  });

  // Fill form data in edit mode
  useEffect(() => { // Populate form when editing existing package device
    if (packageDevice && mode === "edit") {
      setFormData({
        packagesDevicesId: packageDevice?.packagesDevicesId || "",
        packagesDevicesCode: packageDevice?.packagesDevicesCode || "",
        englishName: packageDevice?.englishName || "",
        arabicName: packageDevice?.arabicName || "",
        createdBy: packageDevice?.createdBy || "",
        modifiedBy: packageDevice?.modifiedBy || "",
      });
    } else { // Reset form for add mode
      setFormData({
        packagesDevicesId: "",
        packagesDevicesCode: "",
        englishName: "",
        arabicName: "",
        createdBy: "",
        modifiedBy: "",
      });
    }
  }, [packageDevice, mode, open]); // Re-run when these dependencies change

  const handleSave = () => {
    if(mode === "edit") {
      const formatted = {
        packagesDevicesId: packageDevice?.packagesDevicesId,
        packagesDevicesCode: formData.packagesDevicesCode,
        englishName: formData.englishName,
        arabicName: formData.arabicName,
        modifiedBy: formData.modifiedBy,
      };
      onSave(formatted);
    } else {
      const formatted = {
        packagesDevicesCode: formData.packagesDevicesCode,
        englishName: formData.englishName,
        arabicName: formData.arabicName,
        createdBy: formData.createdBy,
      };
      onSave(formatted);
    }
    onClose();
  };

  const isFormValid = () => {

  if (mode === "add" && !formData.createdBy?.trim()) return false;
  if (mode === "edit" && !formData.modifiedBy?.trim()) return false;

  return true;
};
  return (
    <Dialog open={open} onOpenChange={onClose}> {/* Controlled dialog component */}
      <DialogContent className="contact-form-dialog-content">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Package Device" : "Edit Package Device"} {/* Dynamic title */}
          </DialogTitle>
        </DialogHeader>

        <PackageDevicesFormContent
          formData={formData}
          setFormData={setFormData}
          mode={mode}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}> {/* Cancel button */}
            Cancel
          </Button>
          <Button onClick={handleSave}  disabled={!isFormValid()}> {/* Save/Add button */}
            {mode === "add" ? "Add Package Device" : "Save Package Device"} {/* Dynamic button text */}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}