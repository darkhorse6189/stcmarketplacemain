import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "../../Product/ProductFormDialog/ProductFormDialog.css";
import CategoryFormDialogContent from "./CategoryFormDialogContent";
import "./CategoryFormDialog.css";

export function CategoryFormDialog({ open, onClose, onSave,category,mode }) {
  const [formData, setFormData] = useState({
    categoryId: "",
    categoryCode: "",
    englishName: "",
    arabicName: "",
    createdBy: "",
    modifiedBy: "",
  });
  
  // This effect runs whenever `category`, `mode`, or `open` changes
  useEffect(() => {
    if (category && mode === "edit") {
      // Populate the form fields with the existing category data (edit mode)
      setFormData({
        categoryId: category?.categoryId || "",
        categoryCode: category?.categoryCode || "",
        englishName: category?.englishName || "",
        arabicName: category?.arabicName || "",
        createdBy: category?.createdBy || "",
        modifiedBy: category?.modifiedBy || "",
      });
    } else {
      // Adding Data (add mode) - reset form fields
      setFormData({
        categoryId: "",
        categoryCode: "",
        englishName: "",
        arabicName: "",
        createdBy: "",
        modifiedBy: "",
      });
    }
  }, [category, mode, open]);

  // To handle saving form data (for both add and edit modes)
  const handleSave = () => {
    if(mode === "edit") {
      const formatted = {
        categoryId: category?.categoryId,
        categoryCode: formData.categoryCode,
        englishName: formData.englishName,
        arabicName: formData.arabicName,
        modifiedBy: formData.modifiedBy,
      };
      onSave(formatted);
    } else {
      const formatted = {
        categoryCode: formData.categoryCode,
        englishName: formData.englishName,
        arabicName: formData.arabicName,
        createdBy: formData.createdBy,
      };
      onSave(formatted);
    }
    onClose();
  };
  
  const isFormValid = () => {
    if (mode === "add" && !formData.createdBy?.trim()) 
      return false;
    if (mode === "edit" && !formData.modifiedBy?.trim()) 
      return false;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="contact-form-dialog-content">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>
        
        <CategoryFormDialogContent formData={formData} setFormData={setFormData} mode={mode}/>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!isFormValid()}>{mode === "add" ? "Add Category" : "Save Category"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}