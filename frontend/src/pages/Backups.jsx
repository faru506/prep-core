import { useState, useEffect } from "react";
import { fetchBackups, createBackup, deleteBackup, restoreFromBackup, restoreFromUpload } from "../apis/backups";
import { Trash2, Download, RotateCcw, Plus, Upload, Database } from "lucide-react";

const Backups = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreType, setRestoreType] = useState("existing");
  const [selectedBackup, setSelectedBackup] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [confirmation, setConfirmation] = useState("");

  const loadBackups = async () => {
    setLoading(true);
    try {
      const res = await fetchBackups();
      const data = await res.json();
      setBackups(data.backups || []);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to load backups" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  const handleCreateBackup = async () => {
    setCreating(true);
    setMessage(null);
    try {
      const res = await createBackup();
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message || "Backup created successfully" });
        loadBackups();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create backup" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to create backup" });
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = (filename) => {
    window.open(`http://localhost:3000/api/v1/admin/backups/${filename}/download`, "_blank");
  };

  const handleDelete = async (filename) => {
    if (!confirm(`Delete backup ${filename}?`)) return;
    try {
      const res = await deleteBackup(filename);
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        loadBackups();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to delete backup" });
    }
  };

  const openRestoreModal = (filename = "") => {
    setSelectedBackup(filename);
    setRestoreType(filename ? "existing" : "upload");
    setConfirmation("");
    setUploadFile(null);
    setShowRestoreModal(true);
    setMessage(null);
  };

  const handleRestore = async () => {
    if (confirmation !== "RESTORE") {
      setMessage({ type: "error", text: "Please type RESTORE to confirm" });
      return;
    }
    setRestoring(true);
    try {
      let res;
      if (restoreType === "existing" && selectedBackup) {
        res = await restoreFromBackup(selectedBackup, confirmation);
      } else if (restoreType === "upload" && uploadFile) {
        res = await restoreFromUpload(uploadFile, confirmation);
      } else {
        setMessage({ type: "error", text: "Please select a backup or upload a file" });
        setRestoring(false);
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `${data.message}. Pre-restore snapshot: ${data.pre_restore}` });
        setShowRestoreModal(false);
        loadBackups();
      } else {
        setMessage({ type: "error", text: data.error || "Restore failed" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Restore failed" });
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Database Backups</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreateBackup}
              disabled={creating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {creating ? "Creating..." : "Create Backup Now"}
            </button>
            <button
              onClick={() => openRestoreModal()}
              disabled={restoring}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              Restore
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
            {message.text}
          </div>
        )}

        <div className="bg-[#1e293b] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#334155]">
              <tr>
                <th className="px-6 py-3 text-left">Filename</th>
                <th className="px-6 py-3 text-left">Size</th>
                <th className="px-6 py-3 text-left">Created At</th>
                <th className="px-6 py-3 text-left">Created By</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">Loading...</td>
                </tr>
              ) : backups.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">No backups found</td>
                </tr>
              ) : (
                backups.map((backup) => (
                  <tr key={backup.filename} className="border-t border-[#334155] hover:bg-[#334155]/50">
                    <td className="px-6 py-4 font-mono text-sm">{backup.filename}</td>
                    <td className="px-6 py-4">{backup.size_human}</td>
                    <td className="px-6 py-4">{new Date(backup.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4">{backup.created_by || "-"}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleDownload(backup.filename)} className="p-2 hover:bg-blue-600/20 text-blue-400 rounded" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => openRestoreModal(backup.filename)} className="p-2 hover:bg-orange-600/20 text-orange-400 rounded" title="Restore">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(backup.filename)} className="p-2 hover:bg-red-600/20 text-red-400 rounded" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-orange-400">⚠️ Restore Database</h2>
            <p className="text-gray-300 mb-4">
              This will <strong>OVERWRITE ALL CURRENT DATA</strong> in the database. A pre-restore snapshot will be created automatically.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm mb-2">Restore from:</label>
              <select
                value={restoreType}
                onChange={(e) => setRestoreType(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f172a] rounded border border-[#334155]"
              >
                <option value="existing">Existing backup</option>
                <option value="upload">Upload backup file</option>
              </select>
            </div>

            {restoreType === "existing" && (
              <div className="mb-4">
                <label className="block text-sm mb-2">Select backup:</label>
                <select
                  value={selectedBackup}
                  onChange={(e) => setSelectedBackup(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f172a] rounded border border-[#334155]"
                >
                  <option value="">-- Select --</option>
                  {backups.map((b) => (
                    <option key={b.filename} value={b.filename}>{b.filename}</option>
                  ))}
                </select>
              </div>
            )}

            {restoreType === "upload" && (
              <div className="mb-4">
                <label className="block text-sm mb-2">Upload .gz file:</label>
                <input
                  type="file"
                  accept=".gz"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full px-3 py-2 bg-[#0f172a] rounded border border-[#334155]"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm mb-2">Type <strong>RESTORE</strong> to confirm:</label>
              <input
                type="text"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f172a] rounded border border-[#334155]"
                placeholder="RESTORE"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRestore}
                disabled={restoring || confirmation !== "RESTORE"}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
              >
                {restoring ? "Restoring..." : "Restore Database"}
              </button>
              <button
                onClick={() => setShowRestoreModal(false)}
                disabled={restoring}
                className="flex-1 px-4 py-2 bg-[#334155] hover:bg-[#475569] rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backups;
