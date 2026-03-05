import { useState } from "react";
import { mockAnnouncements, Announcement } from "../data/mockData";
import { Plus, Edit, Trash2, Eye, Globe, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<Partial<Announcement>>({});

  const handleCreateAnnouncement = () => {
    const newAnnouncement: Announcement = {
      id: String(announcements.length + 1),
      title: formData.title || "",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      description: formData.description || "",
      fullContent: formData.fullContent || "",
      status: formData.status || "Draft",
      createdBy: "Admin",
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setShowCreateModal(false);
    setFormData({});
  };

  const handleEditAnnouncement = () => {
    if (!selectedAnnouncement) return;
    setAnnouncements(
      announcements.map((a) =>
        a.id === selectedAnnouncement.id ? { ...a, ...formData } : a
      )
    );
    setShowEditModal(false);
    setFormData({});
    setSelectedAnnouncement(null);
  };

  const handleDeleteAnnouncement = () => {
    if (!selectedAnnouncement) return;
    setAnnouncements(announcements.filter((a) => a.id !== selectedAnnouncement.id));
    setShowDeleteModal(false);
    setSelectedAnnouncement(null);
  };

  const handleToggleStatus = (announcement: Announcement) => {
    setAnnouncements(
      announcements.map((a) =>
        a.id === announcement.id
          ? { ...a, status: a.status === "Published" ? "Draft" : "Published" }
          : a
      )
    );
  };

  const openEditModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData(announcement);
    setShowEditModal(true);
  };

  const openDeleteModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteModal(true);
  };

  const openViewModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
  };

  const publishedCount = announcements.filter(a => a.status === "Published").length;
  const draftCount = announcements.filter(a => a.status === "Draft").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcement Management</h1>
          <p className="text-gray-600 mt-1">Create and manage announcements for residents</p>
        </div>
        <Button
          onClick={() => {
            setFormData({});
            setShowCreateModal(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <p className="text-sm text-gray-600">Total Announcements</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Published</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-gray-600">Drafts</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">{draftCount}</p>
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    announcement.status === "Published"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {announcement.status}
                </span>
                <p className="text-xs text-gray-500">{announcement.date}</p>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{announcement.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{announcement.description}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openViewModal(announcement)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => openEditModal(announcement)}
                  className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(announcement)}
                  className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => handleToggleStatus(announcement)}
                className={`mt-3 w-full px-3 py-2 text-sm rounded-lg font-medium ${
                  announcement.status === "Published"
                    ? "bg-amber-100 hover:bg-amber-200 text-amber-700"
                    : "bg-green-100 hover:bg-green-200 text-green-700"
                }`}
              >
                {announcement.status === "Published" ? "Unpublish" : "Publish"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
            <DialogDescription>Fill in the announcement details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter announcement title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter a brief description"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullContent">Full Content *</Label>
              <Textarea
                id="fullContent"
                value={formData.fullContent || ""}
                onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
                placeholder="Enter the complete announcement content"
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status || "Draft"} onValueChange={(value) => setFormData({ ...formData, status: value as "Draft" | "Published" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              Create Announcement
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>Update announcement details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Short Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fullContent">Full Content *</Label>
              <Textarea
                id="edit-fullContent"
                value={formData.fullContent || ""}
                onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status || "Draft"} onValueChange={(value) => setFormData({ ...formData, status: value as "Draft" | "Published" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAnnouncement} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Announcement Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Announcement Details</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedAnnouncement.status === "Published"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedAnnouncement.status}
                </span>
                <p className="text-sm text-gray-500">{selectedAnnouncement.date}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedAnnouncement.title}</h2>
                <p className="text-gray-700">{selectedAnnouncement.fullContent}</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">Created by {selectedAnnouncement.createdBy}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedAnnouncement?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteAnnouncement} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
