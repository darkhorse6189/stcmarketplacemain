import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import "./CategoryDataTable.css";
import { ActionLoader } from "../../ActionLoader/ActionLoader";

function CategoryDataTable({
  categoryList,
  selectedRows,
  handleSelectRow,
  loadingAction,
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
              Category Code
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
          {categoryList ? (
            categoryList?.map((category, index) => (
              <TableRow key={index} className="products-table-row">
                {isAdmin && (
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(category.categoryId)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(category.categoryId, checked)
                      }
                    />
                  </TableCell>
                )}
                <TableCell>{category?.categoryCode}</TableCell>
                <TableCell>{category?.englishName}</TableCell>
                <TableCell>{category?.arabicName}</TableCell>
                <TableCell>{category?.createdBy}</TableCell>
                <TableCell>{category?.createdOn}</TableCell>
                <TableCell>{category?.modifiedBy}</TableCell>
                <TableCell>{category?.modifiedOn}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                No Categories Found!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default CategoryDataTable;
