import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "./ProductV2FormDialog.css";
import { ProductV2FormContent } from "./ProductV2FormContent";

export function ProductV2FormDialog({
  open,
  onClose,
  onSave,
  product,
  mode,
  categoryDropDown,
  packagesDevicesDropDown,
  operatorBrandsDropDown,
}) {
  const [formData, setFormData] = useState({
    category: "",
    operatorBrand: "",
    package: "",
    packageDescriptionEnglish: "",
    packageDescriptionArabic: "",
    itemCode: "",
    barcode: "",
    productDescriptionEnglish: "",
    productDescriptionArabic: "",
    inclusiveVAT: "",
    commission: "",
     // the user does NOT upload a new file in edit mode
    logoEnglish: "",
    logoArabic: "",
    logoEnglishFile: null,
    logoArabicFile: null,
    createdBy: "",
    modifiedBy: "",
  });

  // Fill form data in edit mode
  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        category: product?.category || "",
        operatorBrand: product?.operatorBrand || "",
        package: product?.package || "",
        packageDescriptionEnglish: product?.packageDescriptionEnglish || "",
        packageDescriptionArabic: product?.packageDescriptionArabic || "",
        itemCode: product?.itemCode || "",
        barcode: product?.barcode || "",
        productDescriptionEnglish: product?.productDescriptionEnglish || "",
        productDescriptionArabic: product?.productDescriptionArabic || "",
        inclusiveVAT: product?.inclusiveVAT ?? "",
        commission: product?.commission ?? "",
        logoEnglish: product?.logoEnglish || "",
        logoArabic: product?.logoArabic || "",
        logoEnglishFile: null,
        logoArabicFile: null,
        createdBy: product?.createdBy || "",
        modifiedBy: product?.modifiedBy || "",
      });
    } else {
      setFormData({
        category: "",
        operatorBrand: "",
        package: "",
        packageDescriptionEnglish: "",
        packageDescriptionArabic: "",
        itemCode: "",
        barcode: "",
        productDescriptionEnglish: "",
        productDescriptionArabic: "",
        inclusiveVAT: "",
        commission: "",
        // the user does NOT upload a new file in edit mode
        logoEnglish: "",
        logoArabic: "",
        logoEnglishFile: null,
        logoArabicFile: null,
        createdBy: "",
        modifiedBy: "",
      });
    }
  }, [product, mode, open]);

  // Convert file to base64
  const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]); // pure base64
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSave = async () => {

    // Convert any newly chosen files to base64.
    const logoEnglish = formData.logoEnglishFile
      ? await fileToBase64(formData.logoEnglishFile)
      : formData.logoEnglish || "";

    const logoArabic = formData.logoArabicFile
      ? await fileToBase64(formData.logoArabicFile)
      : formData.logoArabic || "";

    if(mode === "edit") {
      const formatted = {
        productId: product?.productId,
        category: product?.category,
        operatorBrand: product?.operatorBrand,
        package: product?.package,
        packageDescriptionEnglish: formData.packageDescriptionEnglish,
        packageDescriptionArabic: formData.packageDescriptionArabic,
        itemCode: formData.itemCode,
        barcode: formData.barcode,
        productDescriptionEnglish: formData.productDescriptionEnglish,
        productDescriptionArabic: formData.productDescriptionArabic,
        inclusiveVAT: formData.inclusiveVAT,
        commission: formData.commission,
        logoEnglish,
        logoArabic,
        modifiedBy: formData.modifiedBy,
      };
      onSave(formatted);
    } else {
      const formatted = {
        category: formData.category,
        operatorBrand: formData.operatorBrand,
        package: formData.package,
        packageDescriptionEnglish: formData.packageDescriptionEnglish,
        packageDescriptionArabic: formData.packageDescriptionArabic,
        itemCode: formData.itemCode,
        barcode: formData.barcode,
        productDescriptionEnglish: formData.productDescriptionEnglish,
        productDescriptionArabic: formData.productDescriptionArabic,
        inclusiveVAT: formData.inclusiveVAT,
        commission: formData.commission,
        logoEnglish,
        logoArabic,
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

    // Both logos are required when adding a new product
    if (mode === "add" && !formData.logoEnglishFile) return false;
    if (mode === "add" && !formData.logoArabicFile) return false;

    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="contact-form-dialog-content">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <ProductV2FormContent
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          categoryDropDown={categoryDropDown}
          packagesDevicesDropDown={packagesDevicesDropDown}
          operatorBrandsDropDown={operatorBrandsDropDown}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid()}>
            {mode === "add" ? "Add Product" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}