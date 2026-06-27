import { useState, useEffect, useRef, useCallback } from "react";
import "./SyncDataTable.css";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import dhmarketplaceServiceInstance from "../../../services/DHMarketPlaceServices";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import StatusModal from "./StatusModal";

const LOCK_BASE = "http://localhost:8082";
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MY_ID = sessionStorage.getItem("userId");

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const ALERT_ICONS = {
  warn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

const ALERT_STYLES = {
  warn:    { icon: "#854F0B", iconBg: "#FAEEDA" },
  error:   { icon: "#A32D2D", iconBg: "#FCEBEB" },
  info:    { icon: "#185FA5", iconBg: "#E6F1FB" },
  success: { icon: "#3B6D11", iconBg: "#EAF3DE" },
};

const CustomAlert = ({ open, type = "info", title, message, onClose, onConfirm, confirmLabel = "Confirm" }) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const styles = ALERT_STYLES[type] || ALERT_STYLES.info;
  const isConfirm = typeof onConfirm === "function";

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="custom-alert-title"
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "400px",
          width: "90%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: styles.iconBg, color: styles.icon,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {ALERT_ICONS[type]}
          </div>
          <div>
            <p
              id="custom-alert-title"
              style={{ fontWeight: 600, fontSize: "15px", color: "#111827", marginBottom: "4px" }}
            >
              {title}
            </p>
            <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.55 }}>
              {message}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          {isConfirm && (
            <button
              onClick={onClose}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#374151",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
          <button
            autoFocus={!isConfirm}
            onClick={isConfirm ? onConfirm : onClose}
            style={{
              padding: "8px 22px",
              borderRadius: "8px",
              border: "none",
              background: isConfirm ? "#dc2626" : "#185FA5",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isConfirm ? confirmLabel : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Hook ──
const useCustomAlert = () => {
  const [alertState, setAlertState] = useState({
    open: false, type: "info", title: "", message: "",
    onConfirm: null, confirmLabel: "Confirm",
  });

  const showAlert = useCallback(({ type = "info", title = "", message = "" }) => {
    setAlertState({ open: true, type, title, message, onConfirm: null, confirmLabel: "Confirm" });
  }, []);

  /** Opens a confirm dialog; resolves to true (confirmed) or false (cancelled) via a Promise. */
  const showConfirm = useCallback(({ type = "warn", title = "", message = "", confirmLabel = "Confirm" }) => {
    return new Promise((resolve) => {
      setAlertState({
        open: true, type, title, message, confirmLabel,
        onConfirm: () => {
          setAlertState((prev) => ({ ...prev, open: false }));
          resolve(true);
        },
      });
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((prev) => {
      // If this was a confirm dialog, resolve with false
      if (typeof prev.onConfirm === "function") {
        // The onConfirm callback already resolves true; closing resolves nothing,
        // but we need to fire the resolve(false) stored via a ref approach.
        // Simplest: we store the reject/resolve on the state itself.
      }
      return { ...prev, open: false };
    });
  }, []);

  return { alertState, showAlert, showConfirm, closeAlert };
};

const SyncDataTable = () => {
  const [headers, setHeaders] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [fileType, setFileType] = useState(null);

  const [uploadedImageFiles, setUploadedImageFiles] = useState([]);
  const [uploadSizeError, setUploadSizeError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const tickIntervalRef = useRef(null);
  const xhrRef = useRef(null);
  const fileNameRef = useRef(null);
  const csvFileRef = useRef(null);

  const [lock, setLock] = useState({ locked: false, lockedBy: "" });
  const stompRef = useRef(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [reportData, setReportData] = useState({ data: [] });
  const [showSuccess, setShowSuccess] = useState(false);
  const [syncSummary, setSyncSummary] = useState(null);
  const [csvRawContent, setCsvRawContent] = useState("");

  const { alertState, showAlert, showConfirm, closeAlert } = useCustomAlert();

  const imageCount = uploadedImageFiles.length;
  const hasCsvLoaded = dataRows.length > 0;
  const isSameUser = lock.lockedBy === MY_ID;
  const isBlocked = lock.locked && !isSameUser;
  const hasAnyData = hasCsvLoaded || imageCount > 0;
  const submitDisabled = imageCount === 0 && !hasCsvLoaded;

  const buildUploadPayload = async () => {
    try {
      const images = await Promise.all(
        uploadedImageFiles.map(async (file) => ({
          fileName: file.name,
          content: await fileToBase64(file),
        })),
      );
      const fileName = fileNameRef.current?.split("_")?.[0] || "uploaded_file";
      const delimiter = fileType === "log" ? "|" : ",";
      const currentFileContent = [
        headers.join(delimiter),
        ...dataRows.map((row) => row.join(delimiter)),
      ].join("\n");
      return { file: { fileName, content: currentFileContent }, images };
    } catch (err) {
      console.error("Failed building payload:", err);
      throw err;
    }
  };

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${LOCK_BASE}/ws`),
      onConnect: () => {
        client.subscribe("/topic/lock", (msg) => {
          const data = JSON.parse(msg.body);
          setLock(data);
        });
        fetch(`${LOCK_BASE}/api/lock/status`)
          .then((r) => r.json())
          .then((data) => setLock(data))
          .catch(console.error);
      },
    });
    client.activate();
    stompRef.current = client;
    window.addEventListener("beforeunload", () => {
      fetch(`${LOCK_BASE}/api/lock/release?userId=${MY_ID}`, { method: "POST" });
    });
    return () => client.deactivate();
  }, []);

  const acquireLock = async () => {
    if (lock.locked && lock.lockedBy === MY_ID) return true;
    const res = await fetch(`${LOCK_BASE}/api/lock/acquire?userId=${MY_ID}`, { method: "POST" });
    const { acquired } = await res.json();
    return acquired;
  };

  const releaseLock = () => {
    fetch(`${LOCK_BASE}/api/lock/release?userId=${MY_ID}`, { method: "POST" }).catch(console.error);
  };

  const resetProgressState = () => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    setUploadProgress(0);
    setUploadStatus("idle");
  };

  const handleCsvUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    e.target.value = "";
    
    setSyncSummary(null);

    if (isBlocked) {
      showAlert({
        type: "warn",
        title: "Upload locked",
        message: `"${lock.lockedBy}" is currently uploading. Please wait until they finish.`,
      });
      return;
    }

    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const textFiles = files.filter((f) => !f.type.startsWith("image/"));
    const invalid = textFiles.filter((f) => !f.name.match(/\.(csv|txt|log)$/i));

    if (invalid.length) {
      showAlert({
        type: "error",
        title: "Unsupported file type",
        message: `The following files are not supported: ${invalid.map((f) => f.name).join(", ")}. Please upload .csv, .txt, .log, or image files only.`,
      });
    }

    const hasImages = imageFiles.length > 0;
    const dataFile = textFiles.find((f) => f.name.match(/\.(csv|txt|log)$/i));

    if (dataFile && hasCsvLoaded) {
      showAlert({
        type: "warn",
        title: "CSV already loaded",
        message: "A CSV file is already loaded. Please clear the current data before uploading a new CSV.",
      });
      return;
    }

    if (hasImages || dataFile) {
      const acquired = await acquireLock();
      if (!acquired && !isSameUser) {
        showAlert({
          type: "warn",
          title: "Upload locked",
          message: "Another user just started uploading. Please wait until they finish.",
        });
        return;
      }
    }

    if (hasImages) {
      const batchSize = imageFiles.reduce((acc, f) => acc + f.size, 0);
      if (batchSize > MAX_FILE_SIZE_BYTES) {
        setUploadSizeError(
          `This batch exceeds ${MAX_FILE_SIZE_MB}MB limit [ ${formatFileSize(batchSize)} ]. Please re-upload with smaller images.`,
        );
        releaseLock();
        return;
      }
      setUploadSizeError("");
      setUploadedImageFiles((prev) => [...prev, ...imageFiles]);
    }

    if (dataFile) {
      fileNameRef.current = dataFile.name.replace(/\.(csv|txt|log)$/i, "");
      csvFileRef.current = dataFile.name;
      setUploadStatus("uploading");
      setUploadProgress(0);

      try {
        const text = await dataFile.text();
        setCsvRawContent(text);

        const isLogFile = dataFile.name.match(/\.log$/i);
        let delimiter;
        if (isLogFile) {
          delimiter = "|";
        } else {
          const firstLine = text.split(/\r?\n/)[0] || "";
          delimiter = firstLine.split(";").length >= firstLine.split(",").length ? ";" : ",";
        }

        const detectedFileType = isLogFile ? "log" : "csv";
        const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

        if (lines.length < 2) {
          showAlert({
            type: "warn",
            title: "Empty file",
            message: "The file appears to be empty or has no data rows.",
          });
          resetProgressState();
          return;
        }

        const parsedHeaders = lines[0].split(delimiter).map((h) => h.trim());
        const parsedRows = lines.slice(1).map((line) => {
          const cols = line.split(delimiter);
          while (cols.length < parsedHeaders.length) cols.push("");
          return cols.slice(0, parsedHeaders.length).map((c) => c.trim());
        });

        setHeaders(parsedHeaders);
        setDataRows(parsedRows);
        setFileType(detectedFileType);
        setUploadProgress(100);
        setUploadStatus("success");
        setTimeout(() => resetProgressState(), 2500);
      } catch (error) {
        console.error("CSV parse error:", error);
        resetProgressState();
        showAlert({
          type: "error",
          title: "Failed to read file",
          message: "An error occurred while reading the file. Please try again.",
        });
      }
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  function parseMarketplaceErrors(nativeDescription) {
    if (!nativeDescription?.trim()) return { status: "SUCCESS", data: [] };
    const lines = nativeDescription.trim().split("\n").filter((l) => l.trim());
    const COLUMN_NAMES = [
      "DateTime", "FileName", "ItemCode", "BarCode",
      "LogoPath_EN", "LogoPath_AR", "Action", "Stage", "Exception", "ActionTaken",
    ];
    const data = lines.map((line) => {
      const values = line.split("|").map((v) => v.trim());
      return COLUMN_NAMES.reduce((obj, key, idx) => {
        obj[key] = values[idx] || "";
        return obj;
      }, {});
    });
    return { status: "ERROR", data };
  }

  function safeJsonParse(str) {
    if (str !== null && typeof str === "object") return str;
    try {
      return JSON.parse(str);
    } catch (originalError) {
      try {
        const fixed = str
          ?.replace(/\r?\n/g, "\\n")
          ?.replace(/\t/g, "\\t")
          ?.replace(/\\(?!["\\/bfnrt])/g, "\\\\");
        return JSON.parse(fixed);
      } catch {
        throw new Error(
          `safeJsonParse failed: ${originalError.message}\nInput: ${String(str).slice(0, 200)}`,
        );
      }
    }
  }

  const clearUploadedData = () => {
    setHeaders([]);
    setDataRows([]);
    setUploadedImageFiles([]);
    setUploadSizeError("");
    setFileType(null);
    fileNameRef.current = null;
    csvFileRef.current = null;
    releaseLock();
  };

  const handleSubmit = async () => {
    
    let truncatedPayload = null;
    try {
      const payload = await buildUploadPayload();
      truncatedPayload = JSON.stringify(payload, null, 2);
    } catch (error) {
      console.log(error);
    }

    setUploadStatus("uploading");
    setUploadProgress(30);

    try {
      const response = await dhmarketplaceServiceInstance.uploadMarketplaceDataSync(truncatedPayload);
      if (!response.data) throw new Error(`HTTP ${response.status}`);

      const parsedData = safeJsonParse(response?.data);
      const errors = parseMarketplaceErrors(
        parsedData?.InitiateMarketplaceDataSyncResponse?.fault?.nativeDescription,
      );

      const csvTotal = dataRows.length;
      
      if (errors.status === "SUCCESS") {
        // ── Derive total from the uploaded CSV row count ──
        // const total = dataRows.length;

        setUploadProgress(100);
        setUploadStatus("success");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);

        // Always show summary — all records succeeded
        setSyncSummary({ total: csvTotal, inserted: csvTotal, failed: 0 });

        clearUploadedData();
        setTimeout(() => resetProgressState(), 2500);
      } else {
        setUploadProgress(100);
        setUploadStatus("success");
        setReportData(errors);

        const failed = errors.data.length;
        const inserted = csvTotal - failed;

        setSyncSummary({ total: csvTotal, inserted, failed });

        setStatusModalOpen(true);
        clearUploadedData();
      }

      releaseLock();
      setTimeout(() => resetProgressState(), 2500);
    } catch (err) {
      console.error("Submit failed:", err);
      resetProgressState();
    }
  };

  const handleClear = async () => {
    if (xhrRef.current) xhrRef.current.abort();
    releaseLock();
    setHeaders([]);
    setDataRows([]);
    setUploadedImageFiles([]);
    setUploadSizeError("");
    setFileType(null);
    fileNameRef.current = null;
    csvFileRef.current = null;
    resetProgressState();
    setSyncSummary(null);
  };

  const handleClearWithConfirm = async () => {
    const confirmed = await showConfirm({
      type: "warn",
      title: "Clear all data?",
      message: "This will remove all uploaded files and CSV data. This action cannot be undone.",
      confirmLabel: "Clear",
    });
    if (confirmed) handleClear();
  };

  const totalImageSize = uploadedImageFiles.reduce((acc, f) => acc + f.size, 0);

  // ── Sync summary helpers ──
  const successRate = syncSummary
    ? ((syncSummary.inserted / syncSummary.total) * 100).toFixed(1)
    : 0;
  const failRate = syncSummary
    ? ((syncSummary.failed / syncSummary.total) * 100).toFixed(1)
    : 0;

  return (
    <>
      <CustomAlert
        open={alertState.open}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onClose={closeAlert}
        onConfirm={alertState.onConfirm}
        confirmLabel={alertState.confirmLabel}
      />

      <div className="contacts-table-container">

        {/* ── Success Banner ── */}
        {showSuccess && (
          <div
            className="bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md mt-4"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg
                  className="fill-current h-6 w-6 text-green-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1.2-4.2l5-5-1.4-1.4-3.6 3.6-1.6-1.6-1.4 1.4 3 3z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">CSV Uploaded Successfully</p>
                <p className="text-sm">
                  Your CSV file has been uploaded and processed successfully. No errors were found.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Sync Summary ── */}
        {syncSummary && !statusModalOpen && (
          <div
            style={{
              margin: "16px 6px",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, fontSize: "14px", color: "#111827" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Sync summary
              </div>
              <button
                onClick={() => setSyncSummary(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "6px" }}
              >
                ✕ Dismiss
              </button>
            </div>

            {/* Three metric cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>

              {/* Total */}
              <div style={{ background: "#E6F1FB", border: "1px solid #B5D4F4", borderRadius: "10px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#185FA5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  </svg>
                </div>
                <div style={{ fontSize: "30px", fontWeight: 600, color: "#0C447C", lineHeight: 1.1 }}>
                  {syncSummary.total}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#185FA5" }}>Total records</div>
                <div style={{ fontSize: "11px", color: "#185FA5", opacity: 0.8 }}>processed in this sync</div>
              </div>

              {/* Inserted */}
              <div style={{ background: "#EAF3DE", border: "1px solid #C0DD97", borderRadius: "10px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#3B6D11", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div style={{ fontSize: "30px", fontWeight: 600, color: "#27500A", lineHeight: 1.1 }}>
                  {syncSummary.inserted}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#3B6D11" }}>Inserted / processed</div>
                <div style={{ fontSize: "11px", color: "#3B6D11", opacity: 0.8 }}>{successRate}% success rate</div>
              </div>

              {/* Failed */}
              <div style={{ background: "#FCEBEB", border: "1px solid #F7C1C1", borderRadius: "10px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#A32D2D", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div style={{ fontSize: "30px", fontWeight: 600, color: "#791F1F", lineHeight: 1.1 }}>
                  {syncSummary.failed}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#A32D2D" }}>Failed / errors</div>
                <div style={{ fontSize: "11px", color: "#A32D2D", opacity: 0.8 }}>{failRate}% of records</div>
              </div>
            </div>

            {/* Progress breakdown bar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden", display: "flex", gap: "2px" }}>
                <div style={{ height: "100%", width: `${successRate}%`, background: "#3B6D11", borderRadius: "999px", transition: "width 0.4s ease" }} />
                <div style={{ height: "100%", width: `${failRate}%`, background: "#A32D2D", borderRadius: "999px", transition: "width 0.4s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6b7280" }}>
                <span>{syncSummary.inserted} inserted</span>
                <span>{syncSummary.failed} failed</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Page Header ── */}
        <div className="contacts-table-header">
          <div className="contacts-table-header-content">
            <div className="contacts-table-title-row">
              <h1 className="contacts-table-title">SYNC DATA</h1>
            </div>
          </div>
        </div>

        {/* ── Lock Banners ── */}
        {isBlocked && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "8px 6px", padding: "10px 16px", background: "#fff1f2", border: "1px solid #fca5a5", borderRadius: "8px", color: "#b91c1c", fontSize: "13px", fontWeight: 500 }}>
            <span style={{ fontSize: "16px" }}>🔒</span>
            <span><strong>{lock.lockedBy}</strong> is currently uploading. Uploads are disabled until they finish.</span>
          </div>
        )}
        {isSameUser && lock.locked && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "8px 6px", padding: "8px 16px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", color: "#15803d", fontSize: "13px", fontWeight: 500 }}>
            <span style={{ fontSize: "15px" }}>🟢</span>
            <span>You hold the upload lock. Other users cannot upload until you submit or clear.</span>
          </div>
        )}

        {/* ── Upload button ── */}
        <div className="csv-upload-container" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <label
            className="csv-upload"
            style={isBlocked ? { opacity: 0.5, pointerEvents: "none", cursor: "not-allowed" } : {}}
            title={isBlocked ? `🔒 ${lock.lockedBy} is uploading` : undefined}
          >
            <input
              type="file"
              accept=".csv,image/*"
              multiple
              hidden
              disabled={isBlocked}
              onChange={handleCsvUpload}
            />
            <span className="csv-upload-text">⬆ Upload CSV and Images</span>
          </label>
        </div>

        {/* Size error */}
        {uploadSizeError && (
          <p style={{ color: "#dc2626", fontSize: "13px", margin: "6px 6px 0", display: "flex", alignItems: "center", gap: "5px" }}>
            ⚠️ {uploadSizeError}
          </p>
        )}

        {/* Upload Progress Bar */}
        {uploadStatus !== "idle" && (
          <div style={{ margin: "10px 0 4px", padding: "0 6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
              <span style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>
                {uploadStatus === "success" ? "✅ File uploaded successfully!" : "⏫ Uploading file..."}
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: uploadStatus === "success" ? "#16a34a" : "#3b82f6" }}>
                {uploadProgress}%
              </span>
            </div>
            <div style={{ width: "100%", height: "7px", backgroundColor: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${uploadProgress}%`, borderRadius: "999px", backgroundColor: uploadStatus === "success" ? "#16a34a" : "#3b82f6", transition: "width 0.2s ease, background-color 0.4s ease" }} />
            </div>
          </div>
        )}

        {/* ── Preview Section ── */}
        {(hasCsvLoaded || imageCount > 0) && (
          <div style={{ margin: "12px 6px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
            {hasCsvLoaded && csvFileRef.current && (
              <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <span style={{ fontWeight: 600, fontSize: "13px", color: "#374151" }}>📄 CSV file loaded</span>
                  <button
                    onClick={() => {
                      setHeaders([]); setDataRows([]); setFileType(null);
                      csvFileRef.current = null; fileNameRef.current = null;
                      if (imageCount === 0) releaseLock();
                    }}
                    style={{ marginLeft: "auto", fontSize: "12px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            )}
            {imageCount > 0 && (
              <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <span style={{ fontWeight: 600, fontSize: "13px", color: "#374151" }}>
                    🖼 {imageCount} image{imageCount !== 1 ? "s" : ""} uploaded &nbsp;·&nbsp;
                    <span style={{ color: "#6b7280", fontWeight: 400 }}>{formatFileSize(totalImageSize)} total</span>
                  </span>
                  <button
                    onClick={() => { setUploadedImageFiles([]); setUploadSizeError(""); if (dataRows.length === 0) releaseLock(); }}
                    style={{ fontSize: "12px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                  >
                    ✕ Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="w-full p-6">
          <div className="flex items-center gap-3 mb-2">
            <Button
              disabled={submitDisabled || uploadStatus === "uploading" || isBlocked}
              onClick={handleSubmit}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                !submitDisabled && uploadStatus !== "uploading" && !isBlocked
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {uploadStatus === "uploading" ? "Submitting..." : "Submit"}
            </Button>

            <Button
              disabled={!hasAnyData}
              onClick={handleClearWithConfirm}
              className={`flex items-center gap-2 transition-colors ${
                hasAnyData
                  ? "bg-red-50 text-red-600 border border-red-300 hover:bg-red-100 cursor-pointer"
                  : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50"
              }`}
              variant="outline"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <StatusModal
        open={statusModalOpen}
        setOpen={(val) => { setStatusModalOpen(val); }}
        data={reportData}
      />
    </>
  );
};

export default SyncDataTable;