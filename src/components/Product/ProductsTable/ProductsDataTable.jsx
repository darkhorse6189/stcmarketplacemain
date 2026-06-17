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
import "./ProductsDataTable.css";

export function ProductsDataTable({
  products,
  selectedRows,
  onSelectRow,
  images,
  getCategoryCodeById,
  getOperatorsBrandsCode,
  getPackageDevicesCode,
  productsFault,
  isAdmin
}) {
  // Convert images into a lookup map for quick access
  const imageMap = Array.isArray(images)
    ? Object.fromEntries(images.map((img) => [img.productId, img.image]))
    : {};

  const [selectedImage, setSelectedImage] = useState(null);

  // Blob to Image URL conversion
  const base64ToImageUrl = (base64, mime = "image/png") => {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);

    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }

    const blob = new Blob([new Uint8Array(byteNumbers)], { type: mime });
    return URL.createObjectURL(blob);
  };

  // Fetch and convert image for a given productId
  const fetchProductImage = async (productId) => {
    const base64 = imageMap[productId];
    return base64ToImageUrl(base64);
  };

  const handleOpenImage = async (productId) => {
    try {
      const imageUrl = await fetchProductImage(productId);
      setSelectedImage(imageUrl);
    } catch (e) {
      console.error(e);
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
                <TableHead className="contacts-table-header-cell">Image</TableHead>
                <TableHead className="contacts-table-header-cell">
                  Category
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Operators Brands
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Package Devices
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Item Code
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Barcode / Sku
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Description (EN)
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Description (AR)
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Price (Inclusive VAT)
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Face Value
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Gross Price
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Discount
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Percentage
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Exclusive Vat
                </TableHead>
                <TableHead className="contacts-table-header-cell">
                  Inclusive VAT
                </TableHead>
                <TableHead className="contacts-table-header-cell">Vat</TableHead>
                <TableHead className="contacts-table-header-cell">Status</TableHead>
                <TableHead className="contacts-table-header-cell">
                  Storage
                </TableHead>
                <TableHead className="contacts-table-header-cell">Color</TableHead>
                <TableHead className="contacts-table-header-cell">Weight</TableHead>
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
              {products ? (
                products?.map((product, index) => {
                  const imageUrl = imageMap[product?.productId];
                  return (
                    <TableRow key={index} className="products-table-row">
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
                      
                      {/* Image Link */}
                      <TableCell>
                        {imageUrl ? (
                          <button
                            onClick={() => handleOpenImage(product.productId)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View Image
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">No Image</span>
                        )}
                      </TableCell>

                      <TableCell>
                        {getCategoryCodeById(product?.categoryId)}
                      </TableCell>
                      <TableCell>
                        {getOperatorsBrandsCode(product?.operatorsBrandsId)}
                      </TableCell>
                      <TableCell>
                        {getPackageDevicesCode(product?.packagesDevicesId)}
                      </TableCell>
                      <TableCell>{product?.itemCode}</TableCell>
                      <TableCell>{product?.barcode}</TableCell>
                      <TableCell>{product?.englishDescription}</TableCell>
                      <TableCell>{product?.arabicDescription}</TableCell>
                      <TableCell>{product?.inclusiveVAT}</TableCell>
                      <TableCell>{product?.faceValue}</TableCell>
                      <TableCell>{product?.grossPrice}</TableCell>
                      <TableCell>{product?.discount}</TableCell>
                      <TableCell>{product?.percentage}</TableCell>
                      <TableCell>{product?.exclusiveVAT}</TableCell>
                      <TableCell>{product?.inclusiveVAT}</TableCell>
                      <TableCell>{product?.VAT}</TableCell>
                      <TableCell>{product?.status}</TableCell>
                      <TableCell>{product?.storage}</TableCell>
                      <TableCell>{product?.color}</TableCell>
                      <TableCell>{product?.typeId}</TableCell>
                      <TableCell>{product?.weight}</TableCell>
                      <TableCell>{product?.createdOn}</TableCell>
                      <TableCell>{product?.createdBy}</TableCell>
                      <TableCell>{product?.modifiedOn}</TableCell>
                      <TableCell>{product?.modifiedBy}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    No Products Found!!
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
