import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "./ProductFormDialog.css";
import { ProductFormContent } from "./ProductFormContent";

export function ProductFormDialog({
  open,
  onClose,
  onSave,
  product,
  mode,
  categories,
  operatorBrands,
  packageDevices,
  categoryDropDown,
  packagesDevicesDropDown,
  operatorBrandsDropDown,
}) {
  const [formData, setFormData] = useState({
    productId: "",
    categoryId: "",
    operatorsBrandsId: "",
    packagesDevicesId: "",
    itemCode: "",
    barcode: "",
    englishDescription: "",
    arabicDescription: "",
    faceValue: "",
    grossPrice: "",
    discount: "",
    percentage: "",
    exclusiveVAT: "",
    inclusiveVAT: "",
    VAT: "",
    status: "",
    storage: "",
    color: "",
    typeId: "",
    weight: "",
    image: null,
    createdBy: "",
    modifiedBy: "",
  });

  // Fill form data in edit mode
  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        productId: product?.productId || "",
        categoryId: product?.categoryId || "",
        operatorsBrandsId: product?.operatorsBrandsId || "",
        packagesDevicesId: product?.packagesDevicesId || "",
        itemCode: product?.itemCode || "",
        barcode: product?.barcode || "",
        englishDescription: product?.englishDescription || "",
        arabicDescription: product?.arabicDescription || "",
        faceValue: product?.faceValue || "",
        grossPrice: product?.grossPrice || "",
        discount: product?.discount || "",
        percentage: product?.percentage || "",
        exclusiveVAT: product?.exclusiveVAT || "",
        inclusiveVAT: product?.inclusiveVAT || "",
        VAT: product?.VAT || "",
        status: product?.status || "",
        storage: product?.storage || "",
        color: product?.color || "",
        typeId: product?.typeId || "",
        weight: product?.weight || "",
        image: product?.image || "",
        createdBy: product?.createdBy || "",
        modifiedBy: product?.modifiedBy || "",
      });
    } else {
      setFormData({
        categoryId: "",
        operatorsBrandsId: "",
        packagesDevicesId: "",
        itemCode: "",
        barcode: "",
        englishDescription: "",
        arabicDescription: "",
        faceValue: "",
        grossPrice: "",
        discount: "",
        percentage: "",
        exclusiveVAT: "",
        inclusiveVAT: "",
        VAT: "",
        status: "",
        storage: "",
        color: "",
        typeId: "",
        weight: "",
        image: null,
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
    if(mode === "edit") {
      const formatted = {
        productId: product?.productId,
        categoryId: product?.categoryId,
        operatorsBrandsId: product?.operatorsBrandsId,
        packagesDevicesId: product?.packagesDevicesId,
        itemCode: formData.itemCode,
        barcode: formData.barcode,
        englishDescription: formData.englishDescription,
        arabicDescription: formData.arabicDescription,
        faceValue: formData.faceValue,
        grossPrice: formData.grossPrice,
        discount: formData.discount,
        percentage: formData.percentage,
        exclusiveVAT: formData.exclusiveVAT,
        inclusiveVAT: formData.inclusiveVAT,
        VAT: formData.VAT,
        status: formData.status,
        storage: formData.storage,
        color: formData.color,
        typeId: formData.typeId,
        weight: formData.weight,
        image: formData.image,
        modifiedBy: formData.modifiedBy,
      };
      onSave(formatted);
    } else {
      const formatted = {
        productId: formData.productId,
        categoryId: formData.categoryId,
        operatorsBrandsId: formData.operatorsBrandsId,
        packagesDevicesId: formData.packagesDevicesId,
        itemCode: formData.itemCode,
        barcode: formData.barcode,
        englishDescription: formData.englishDescription,
        arabicDescription: formData.arabicDescription,
        faceValue: formData.faceValue,
        grossPrice: formData.grossPrice,
        discount: formData.discount,
        percentage: formData.percentage,
        exclusiveVAT: formData.exclusiveVAT,
        inclusiveVAT: formData.inclusiveVAT,
        VAT: formData.VAT,
        status: formData.status,
        storage: formData.storage,
        color: formData.color,
        typeId: formData.typeId,
        weight: formData.weight,
        image:  await fileToBase64(formData.image),
        createdBy: formData.createdBy,
      };
      onSave(formatted);
    }
    onClose();
  };

  // Get codes arrays
  const categoriesCodes = categories?.map((cat) => cat.code);
  const operatorBrandsCodes = operatorBrands?.map((brand) => brand?.code);
  const packageDevicesCodes = packageDevices?.map(
    (packageDevice) => packageDevice.code
  );

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
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <ProductFormContent
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          categoriesCodes={categoriesCodes}
          operatorBrandsCodes={operatorBrandsCodes}
          packageDevicesCodes={packageDevicesCodes}
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