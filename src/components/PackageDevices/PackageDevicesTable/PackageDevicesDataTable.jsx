import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import "./PackageDevicesTable.css";
export function PackageDevicesDataTable({
  packageDevices,
  selectedRows,
  onSelectRow,
  isAdmin,
}) {
  return (
    <Table>
      <TableHeader className="border-b-2">
        <TableRow className="contacts-table-header-row">
          {isAdmin && (
            <TableHead className="contacts-table-cell-checkbox"></TableHead>
          )}
          <TableHead className="contacts-table-header-cell">
            Package Devices Code
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
        {packageDevices ? (
          packageDevices?.map((packageDevice, index) => (
            <TableRow key={index} className="products-table-row">
              {isAdmin && (
                <TableCell>
                  <Checkbox
                    checked={selectedRows?.has(packageDevice.packagesDevicesId)}
                    onCheckedChange={(checked) =>
                      onSelectRow(packageDevice.packagesDevicesId, checked)
                    }
                  />
                </TableCell>
              )}
              <TableCell>{packageDevice?.packagesDevicesCode}</TableCell>
              <TableCell>{packageDevice?.englishName}</TableCell>
              <TableCell>{packageDevice?.arabicName}</TableCell>
              <TableCell>{packageDevice?.createdBy}</TableCell>
              <TableCell>{packageDevice?.createdOn}</TableCell>
              <TableCell>{packageDevice?.modifiedBy}</TableCell>
              <TableCell>{packageDevice?.modifiedOn}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-10">
              No Package Device Found!
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
