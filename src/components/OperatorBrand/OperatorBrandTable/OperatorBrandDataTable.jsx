import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import "./OperatorBrandDataTable.css";

function OperatorBrandDataTable({
  operatorsBrandsList,
  selectedRows,
  handleSelectRow,
  isAdmin,
}) {
  return (
    <div className="contacts-table-body">
      <Table>
        <TableHeader className="border-b-2">
          <TableRow className="contacts-table-header-row">
            {isAdmin && (
              <TableHead className="contacts-table-cell-checkbox"></TableHead>
            )}
            <TableHead className="contacts-table-header-cell">
              Operators Brands Code
            </TableHead>
            <TableHead className="contacts-table-header-cell">
              Description (EN)
            </TableHead>
            <TableHead className="contacts-table-header-cell">
              Description (AR)
            </TableHead>
            <TableHead className="contacts-table-header-cell">
              Created By
            </TableHead>
            <TableHead className="contacts-table-header-cell">
              Created On
            </TableHead>
            <TableHead className="contacts-table-header-cell">
              Modified By
            </TableHead>
            <TableHead className="contacts-table-header-cell">
              Modified On
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operatorsBrandsList ? (
            operatorsBrandsList?.map(
              (
                operatorsBrand,
                index // Render operator brand rows
              ) => (
                <TableRow key={index} className="products-table-row">
                  {isAdmin && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(
                          operatorsBrand?.operatorsBrandsId
                        )} // Bind checkbox to selection state
                        onCheckedChange={(checked) =>
                          handleSelectRow(
                            operatorsBrand?.operatorsBrandsId,
                            checked
                          )
                        }
                      />
                    </TableCell>
                  )}
                  <TableCell>{operatorsBrand?.operatorsBrandsCode}</TableCell>
                  <TableCell>{operatorsBrand?.englishName}</TableCell>
                  <TableCell>{operatorsBrand?.arabicName}</TableCell>
                  <TableCell>{operatorsBrand?.createdBy}</TableCell>
                  <TableCell>{operatorsBrand?.createdOn}</TableCell>
                  <TableCell>{operatorsBrand?.modifiedBy}</TableCell>
                  <TableCell>{operatorsBrand?.modifiedOn}</TableCell>
                </TableRow>
              )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                No Operator Brands Found!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default OperatorBrandDataTable;
