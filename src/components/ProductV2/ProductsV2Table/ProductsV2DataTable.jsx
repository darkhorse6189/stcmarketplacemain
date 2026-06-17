import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import ImageModalDialog from "./ImageModalDialog";
import "./ProductsV2DataTable.css";
const COLUMN_COUNT_BASE = 18;

export function ProductsV2DataTable({
  products,
  selectedRows,
  onSelectRow,
  images,
  productsFault,
  isAdmin
}) {
  const totalColumns = isAdmin ? COLUMN_COUNT_BASE + 1 : COLUMN_COUNT_BASE;
  
  // imageDetails[] → { productId, image } lookup map
  const imageMap = Array.isArray(images)
    ? Object.fromEntries(
        images.map((img) => [
          img.productId,
          { logoEn: img.logoEnglish, logoAr: img.logoArabic },
        ])
      )
    : {};

  const [selectedImage, setSelectedImage] = useState(null);

  // Convert base64 blob to an object URL
  const base64ToImageUrl = (base64, mime = "image/png") => {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const blob = new Blob([new Uint8Array(byteNumbers)], { type: mime });
    return URL.createObjectURL(blob);
  };

  const handleOpenImage = (productId, lang = "en") => {
    try {
      const imgs = imageMap[productId];
      if (!imgs) return;
      const base64 = lang === "ar" ? imgs.logoAr : imgs.logoEn;
      if (!base64) return;
      const url = base64ToImageUrl(base64);
      setSelectedImage(url);
    } catch (e) {
      console.error("Failed to load image:", e);
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      {
        productsFault ? (
          <div className="productNotFoundMessage">
            {productsFault?.nativeDescription || "Filtered Product Does Not Exist."}
          </div>
        ) : (
          <Table>
            <TableHeader className="border-b-2">
              <TableRow className="contacts-table-header-row">
                {isAdmin && (
                  <TableHead className="contacts-table-cell-checkbox"></TableHead>
                )}
                <TableHead className="contacts-table-header-cell">
                  Logo (EN)
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Logo (AR)
                </TableHead>
                <TableHead className="contacts-table-header-cell">Product ID</TableHead>
                <TableHead className="contacts-table-header-cell">
                  Category
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Operator Brand
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Package
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Package Desc (EN)
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Package Desc (AR)
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Barcode
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Item Code
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Description (EN)
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Description (AR)
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Inclusive VAT
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Commission
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Created On
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Created By
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Modified On
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Modified By
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.length > 0 ? (
                products?.map((product, index) => {
                  const imgs = imageMap[product?.productId];
                  const hasLogoEn = !!imgs?.logoEn;
                  const hasLogoAr = !!imgs?.logoAr;
                  return (
                    <TableRow key={product?.productId ?? index} className="products-table-row">
                      {isAdmin && (
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.has(product.productId)}
                            onCheckedChange={(checked) =>
                              onSelectRow(product.productId, checked)
                            }
                          />
                        </TableCell>
                      )}
                      
                      {/* Logo EN */}
                    <TableCell>
                      {hasLogoEn ? (
                        <button
                          onClick={() =>
                            handleOpenImage(product.productId, "en")
                          }
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View (EN)
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </TableCell>

                    {/* Logo AR */}
                    <TableCell>
                      {hasLogoAr ? (
                        <button
                          onClick={() =>
                            handleOpenImage(product.productId, "ar")
                          }
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View (AR)
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">No Image</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {product?.productId}
                      </TableCell>
                      <TableCell>
                        {product?.category}
                      </TableCell>
                      <TableCell>
                        {product?.operatorBrand}
                      </TableCell>
                      <TableCell>
                        {product?.package}
                      </TableCell>
                      <TableCell>{product?.packageDescriptionEnglish}</TableCell>
                      <TableCell>{product?.packageDescriptionArabic}</TableCell>
                      <TableCell>{product?.barcode}</TableCell>
                      <TableCell>{product?.itemCode}</TableCell>
                      <TableCell>{product?.productDescriptionEnglish}</TableCell>
                      <TableCell>{product?.productDescriptionArabic}</TableCell>
                      <TableCell>{product?.inclusiveVAT}</TableCell>
                      <TableCell>
                        {product?.commission}
                      </TableCell>
                      <TableCell>{product?.createdOn}</TableCell>
                      <TableCell>{product?.createdBy}</TableCell>
                      <TableCell>{product?.modifiedOn}</TableCell>
                      <TableCell>{product?.modifiedBy}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={totalColumns} className="text-center py-10">
                    No Products Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )
    }
      {/* Modal for Image Preview */}
      <ImageModalDialog
        selectedImage={selectedImage}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}
