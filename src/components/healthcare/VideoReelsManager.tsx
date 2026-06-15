"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Eye,
  EyeOff,
  Play,
  ExternalLink,
} from "lucide-react";
import { useReelsStore, type Reel } from "@/store/reels-store";
import { Button } from "@/components/ui/button";

export default function VideoReelsManager() {
  const { reels, addReel, updateReel, deleteReel } = useReelsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ url: "", title: "" });

  const resetForm = () => {
    setForm({ url: "", title: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (r: Reel) => {
    setForm({ url: r.url, title: r.title });
    setEditingId(r.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.url.trim() || !form.title.trim()) return;
    if (editingId) {
      updateReel(editingId, form);
    } else {
      addReel({ ...form, isActive: true });
    }
    resetForm();
  };

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Video Reels Manager</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add YouTube video URLs to display as testimonial reels on the website
          </p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 h-10 text-sm font-semibold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Reel
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{editingId ? "Edit Reel" : "New Video Reel"}</h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-5">
                {/* Preview */}
                {form.url && (
                  <div className="w-[120px] aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 shrink-0 shadow-md">
                    <iframe
                      src={form.url.includes("embed") ? form.url : `https://www.youtube.com/embed/${extractVideoId(form.url) || ""}`}
                      className="w-full h-full"
                      title="Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                )}

                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">YouTube Video URL</label>
                    <input
                      type="url"
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      placeholder="https://www.youtube.com/embed/... or https://youtu.be/..."
                      className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Patient Testimonial - John D."
                      className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={!form.url.trim() || !form.title.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-10 text-sm font-semibold"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  {editingId ? "Update" : "Save"}
                </Button>
                <Button onClick={resetForm} variant="outline" className="rounded-xl px-6 h-10 text-sm font-semibold border-gray-200">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reels.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
          >
            {/* Reel Preview */}
            <div className="relative aspect-[9/16] bg-gray-900">
              {r.url ? (
                <iframe
                  src={r.url}
                  title={r.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Play className="w-10 h-10 text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  r.isActive ? "bg-green-500/80 text-white" : "bg-gray-500/80 text-white"
                }`}>
                  {r.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-900 truncate">{r.title}</h4>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{r.url}</p>
              <div className="flex items-center gap-1.5 mt-3">
                <button
                  onClick={() => updateReel(r.id, { isActive: !r.isActive })}
                  className={`flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                    r.isActive
                      ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  {r.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {r.isActive ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => handleEdit(r)}
                  className="flex-1 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => deleteReel(r.id)}
                  className="flex-1 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {reels.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Play className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium text-gray-500">No video reels yet</p>
          <p className="text-sm mt-1">Click "Add Reel" to add your first testimonial video</p>
        </div>
      )}
    </div>
  );
}
