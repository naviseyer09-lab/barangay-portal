import { useState } from "react";
import { mockAdmins, Admin } from "../data/mockData";
import { User, Key, Shield, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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

export default function AccountManagement() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [showDeleteAdminModal, setShowDeleteAdminModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState<Partial<Admin>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    // Mock password change
    alert("Password changed successfully!");
    setShowChangePasswordModal(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleAddAdmin = () => {
    const newAdmin: Admin = {
      id: String(admins.length + 1),
      username: formData.username || "",
      fullName: formData.fullName || "",
      email: formData.email || "",
      role: formData.role || "Admin",
      lastLogin: "Never",
    };
    setAdmins([...admins, newAdmin]);
    setShowAddAdminModal(false);
    setFormData({});
  };

  const handleEditAdmin = () => {
    if (!selectedAdmin) return;
    setAdmins(admins.map((a) => (a.id === selectedAdmin.id ? { ...a, ...formData } : a)));
    setShowEditAdminModal(false);
    setFormData({});
    setSelectedAdmin(null);
  };

  const handleDeleteAdmin = () => {
    if (!selectedAdmin) return;
    setAdmins(admins.filter((a) => a.id !== selectedAdmin.id));
    setShowDeleteAdminModal(false);
    setSelectedAdmin(null);
  };

  const openEditModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData(admin);
    setShowEditAdminModal(true);
  };

  const openDeleteModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowDeleteAdminModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
        <p className="text-gray-600 mt-1">Manage your account and admin users</p>
      </div>

      {/* Current User Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">MS</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Maria Santos</h2>
            <p className="text-gray-600">admin@sanisidro.gov.ph</p>
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mt-1">
              Super Admin
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm text-gray-600">Username</Label>
            <p className="font-medium">admin</p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Last Login</Label>
            <p className="font-medium">March 5, 2026 - 9:30 AM</p>
          </div>
        </div>
        <div className="mt-6">
          <Button
            onClick={() => setShowChangePasswordModal(true)}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            <Key className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </div>
      </div>

      {/* Admin Users Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin Users</h2>
              <p className="text-sm text-gray-600 mt-1">Manage administrator accounts</p>
            </div>
            <Button
              onClick={() => {
                setFormData({});
                setShowAddAdminModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {admin.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{admin.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        admin.role === "Super Admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(admin)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {admin.role !== "Super Admin" && (
                        <button
                          onClick={() => openDeleteModal(admin)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Password Modal */}
      <Dialog open={showChangePasswordModal} onOpenChange={setShowChangePasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password *</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password *</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowChangePasswordModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Admin Modal */}
      <Dialog open={showAddAdminModal} onOpenChange={setShowAddAdminModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>Create a new administrator account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName || ""}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username || ""}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role || "Admin"} onValueChange={(value) => setFormData({ ...formData, role: value as "Super Admin" | "Admin" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAddAdminModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAdmin} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              Add Admin
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Modal */}
      <Dialog open={showEditAdminModal} onOpenChange={setShowEditAdminModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>Update administrator information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullName">Full Name *</Label>
              <Input
                id="edit-fullName"
                value={formData.fullName || ""}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role || "Admin"} onValueChange={(value) => setFormData({ ...formData, role: value as "Super Admin" | "Admin" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowEditAdminModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAdmin} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Admin Modal */}
      <Dialog open={showDeleteAdminModal} onOpenChange={setShowDeleteAdminModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedAdmin?.fullName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowDeleteAdminModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteAdmin} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
