import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "../../Product/ProductFormDialog/ProductFormDialog.css";
import OperatorBrandFormDialogContent from "./OperatorBrandFormDialogContent";
import "./OperatorBrandFormDialog.css";

export function OperatorBrandFormDialog({
  open,
  onClose,
  onSave,
  operatorBrand,
  mode,
}) {
  const [formData, setFormData] = useState({ // Form state management
    operatorsBrandsId: "",
    operatorsBrandsCode: "",
    englishName: "",
    arabicName: "",
    createdBy: "",
    modifiedBy: "",
  });

  // Fill form data in edit mode
  useEffect(() => { // Populate form when editing existing operator brand
    if (operatorBrand && mode === "edit") {
      setFormData({
        operatorsBrandsId: operatorBrand?.operatorsBrandsId || "",
        operatorsBrandsCode: operatorBrand?.operatorsBrandsCode || "",
        englishName: operatorBrand?.englishName || "",
        arabicName: operatorBrand?.arabicName || "",
        createdBy: operatorBrand?.createdBy || "",
        modifiedBy: operatorBrand?.modifiedBy || "",
      });
    } else { // Reset form for add mode
      setFormData({
        operatorsBrandsId: "",
        operatorsBrandsCode: "",
        englishName: "",
        arabicName: "",
        createdBy: operatorBrand?.createdBy || "",
        modifiedBy: operatorBrand?.modifiedBy || "",
      });
    }
  }, [operatorBrand, mode, open]); // Re-run when these dependencies change

  const handleSave = () => { // Format and save operator brand data
    if(mode === "edit") {
      const formatted = {
        operatorsBrandsId: operatorBrand?.operatorsBrandsId,
        operatorsBrandsCode: formData.operatorsBrandsCode,
        englishName: formData.englishName,
        arabicName: formData.arabicName,
        modifiedBy: formData.modifiedBy,
      };
      onSave(formatted);
    } else {
      const formatted = {
        operatorsBrandsCode: formData.operatorsBrandsCode,
        englishName: formData.englishName,
        arabicName: formData.arabicName,
        createdBy: formData.createdBy,
      };
      onSave(formatted);
    }

    onClose(); // Close dialog after save
  };

  const isFormValid = () => {
    if (mode === "add" && !formData.createdBy?.trim()) 
      return false;
    if (mode === "edit" && !formData.modifiedBy?.trim()) 
      return false;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}> {/* Controlled dialog component */}
      <DialogContent className="contact-form-dialog-content">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Operator Brand" : "Edit Operator Brand"} {/* Dynamic title */}
          </DialogTitle>
        </DialogHeader>

        <OperatorBrandFormDialogContent formData={formData} setFormData={setFormData} mode={mode}/>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}> {/* Cancel button */}
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid()}> {/* Save/Add button */}
            {mode === "add" ? "Add Operator Brand" : "Save Operator Brand"} 
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}