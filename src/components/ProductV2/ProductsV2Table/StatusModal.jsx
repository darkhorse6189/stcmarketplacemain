const ACTION_STYLES = {
  Update: "bg-blue-100 text-blue-700",
  Delete: "bg-red-100 text-red-700",
  Insert: "bg-green-100 text-green-700",
};

function formatDateTime(dt) {
  if (!dt) return "-";
  return dt.replace("T", " ").substring(0, 19);
}

function downloadLog(data) {
  if (!data?.data?.length) return;

  const rows = data.data;

  const headers = [
    "DateTime",
    "FileName",
    "ItemCode",
    "BarCode",
    "LogoPath_EN",
    "LogoPath_AR",
    "Action",
    "Stage",
    "Exception",
    "ActionTaken",
  ];

  const logContent = [
    headers.join("|"),
    ...rows.map((row) => headers.map((key) => row[key] ?? "").join("|")),
  ].join("\n");

  const blob = new Blob([logContent], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "marketplace-report.log");

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function StatusModal({ open, setOpen, data = [] }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg border border-gray-200 w-full max-w-7xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-amber-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>

            <div>
              <h2 className="text-xs font-medium text-gray-900">
                Marketplace data sync — status report
              </h2>

              <p className="text-[10px] text-gray-400">
                {data[0]?.fileName || "N/A"} · {data.length} records processed
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-0.5 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[70vh]">
          <table
            className="w-full border-collapse"
            style={{ fontSize: "11px" }}
          >
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr>
                {[
                  "Date time",
                  "File name",
                  "Item code",
                  "Barcode",
                  "Logo EN",
                  "Logo AR",
                  "Action",
                  "Stage",
                  "Exception",
                  "Action taken",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-2.5 py-1.5 text-gray-500 font-medium border-b border-gray-100 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-2.5 py-1.5 border-b text-gray-400 whitespace-nowrap">
                    {formatDateTime(row.DateTime)}
                  </td>

                  <td className="px-2.5 py-1.5 border-b text-gray-700">
                    {row.FileName}
                  </td>

                  <td className="px-2.5 py-1.5 border-b text-gray-700">
                    {row.ItemCode || "-"}
                  </td>

                  {/* FIXED */}
                  <td className="px-2.5 py-1.5 border-b text-gray-700">
                    {row.BarCode || "-"}
                  </td>

                  {/* FIXED */}
                  <td className="px-2.5 py-1.5 border-b text-gray-400 max-w-[120px] truncate">
                    {row.LogoPath_EN || "-"}
                  </td>

                  <td className="px-2.5 py-1.5 border-b text-gray-400 max-w-[120px] truncate">
                    {row.LogoPath_AR || "-"}
                  </td>

                  <td className="px-2.5 py-1.5 border-b">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        ACTION_STYLES[row.Action] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {row.Action || "-"}
                    </span>
                  </td>

                  <td className="px-2.5 py-1.5 border-b text-gray-600 max-w-[180px]">
                    {row.Stage || "-"}
                  </td>

                  <td className="px-2.5 py-1.5 border-b text-red-500 max-w-[240px]">
                    {row.Exception || "-"}
                  </td>

                  <td className="px-2.5 py-1.5 border-b text-gray-600 max-w-[240px]">
                    {row.ActionTaken || "-"}
                  </td>
                </tr>
              ))}

              {/* FIXED EMPTY CHECK */}
              {(!data.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-gray-400">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-4 py-2 border-t border-gray-100 bg-gray-50">
          {/* <div
            className="flex items-center gap-3"
            style={{ fontSize: "11px" }}
          >
            <span className="flex items-center gap-1 text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span>
              {skipped} skipped
            </span>

            <span className="flex items-center gap-1 text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
              {successful} successful
            </span>
          </div> */}

          <button
            onClick={() => downloadLog(data)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md font-medium text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            style={{ fontSize: "11px" }}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download report
          </button>
        </div>
      </div>
    </div>
  );
}
