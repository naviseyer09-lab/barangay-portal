import { useState } from "react";
import { mockResidents, User } from "../data/mockData";
import { Search, Plus, Edit, Trash2, Key, Filter, Download } from "lucide-react";
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

export default function ResidentManagement() {
  const [residents, setResidents] = useState<User[]>(mockResidents);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterVoter, setFilterVoter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch =
      resident.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.contactNumber.includes(searchQuery);
    const matchesStatus = filterStatus === "all" || resident.accountStatus === filterStatus;
    const matchesVoter = filterVoter === "all" || 
      (filterVoter === "registered" && resident.voterStatus === "Registered Voter") ||
      (filterVoter === "not-registered" && resident.voterStatus === "Not Registered");
    return matchesSearch && matchesStatus && matchesVoter;
  });

  const handleAddResident = () => {
    const newResident: User = {
      id: String(residents.length + 1),
      username: formData.username || "",
      fullName: formData.fullName || "",
      address: formData.address || "",
      contactNumber: formData.contactNumber || "",
      voterStatus: formData.voterStatus || "Not Registered",
      accountStatus: "Active",
      birthdate: formData.birthdate,
      gender: formData.gender,
      civilStatus: formData.civilStatus,
      email: formData.email,
    };
    setResidents([...residents, newResident]);
    setShowAddModal(false);
    setFormData({});
  };

  const handleEditResident = () => {
    if (!selectedResident) return;
    setResidents(
      residents.map((r) =>
        r.id === selectedResident.id ? { ...r, ...formData } : r
      )
    );
    setShowEditModal(false);
    setFormData({});
    setSelectedResident(null);
  };

  const handleDeleteResident = () => {
    if (!selectedResident) return;
    setResidents(residents.filter((r) => r.id !== selectedResident.id));
    setShowDeleteModal(false);
    setSelectedResident(null);
  };

  const handleResetPassword = () => {
    // Mock password reset
    setShowResetPasswordModal(false);
    setSelectedResident(null);
  };

  const openEditModal = (resident: User) => {
    setSelectedResident(resident);
    setFormData(resident);
    setShowEditModal(true);
  };

  const openDeleteModal = (resident: User) => {
    setSelectedResident(resident);
    setShowDeleteModal(true);
  };

  const openResetPasswordModal = (resident: User) => {
    setSelectedResident(resident);
    setShowResetPasswordModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resident Management</h1>
          <p className="text-gray-600 mt-1">Manage resident records and accounts</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Resident
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, address, or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Account Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={filterVoter} onValueChange={setFilterVoter}>
              <SelectTrigger>
                <SelectValue placeholder="Voter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Voters</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="not-registered">Not Registered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-600">Total Residents</p>
          <p className="text-2xl font-bold text-gray-900">{residents.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-600">Active Accounts</p>
          <p className="text-2xl font-bold text-green-600">
            {residents.filter((r) => r.accountStatus === "Active").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-600">Registered Voters</p>
          <p className="text-2xl font-bold text-blue-600">
            {residents.filter((r) => r.voterStatus === "Registered Voter").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-600">Search Results</p>
          <p className="text-2xl font-bold text-gray-900">{filteredResidents.length}</p>
        </div>
      </div>

      {/* Residents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voter Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResidents.map((resident) => (
                <tr key={resident.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{resident.fullName}</p>
                      <p className="text-xs text-gray-500">{resident.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{resident.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{resident.contactNumber}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        resident.voterStatus === "Registered Voter"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {resident.voterStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        resident.accountStatus === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {resident.accountStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(resident)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openResetPasswordModal(resident)}
                        className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                        title="Reset Password"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(resident)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Resident Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Resident</DialogTitle>
            <DialogDescription>Fill in the resident information below.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber || ""}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="+63 XXX XXX XXXX"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input
                id="birthdate"
                type="date"
                value={formData.birthdate || ""}
                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender || ""} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="civilStatus">Civil Status</Label>
              <Select value={formData.civilStatus || ""} onValueChange={(value) => setFormData({ ...formData, civilStatus: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select civil status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Widow">Widow</SelectItem>
                  <SelectItem value="Separated">Separated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="voterStatus">Voter Status</Label>
              <Select value={formData.voterStatus || ""} onValueChange={(value) => setFormData({ ...formData, voterStatus: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select voter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Registered Voter">Registered Voter</SelectItem>
                  <SelectItem value="Not Registered">Not Registered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResident} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              Add Resident
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Resident Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Resident</DialogTitle>
            <DialogDescription>Update resident information below.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullName">Full Name *</Label>
              <Input
                id="edit-fullName"
                value={formData.fullName || ""}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contactNumber">Contact Number *</Label>
              <Input
                id="edit-contactNumber"
                value={formData.contactNumber || ""}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-accountStatus">Account Status</Label>
              <Select value={formData.accountStatus || ""} onValueChange={(value) => setFormData({ ...formData, accountStatus: value as "Active" | "Inactive" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-address">Address *</Label>
              <Input
                id="edit-address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-voterStatus">Voter Status</Label>
              <Select value={formData.voterStatus || ""} onValueChange={(value) => setFormData({ ...formData, voterStatus: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Registered Voter">Registered Voter</SelectItem>
                  <SelectItem value="Not Registered">Not Registered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-civilStatus">Civil Status</Label>
              <Select value={formData.civilStatus || ""} onValueChange={(value) => setFormData({ ...formData, civilStatus: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Widow">Widow</SelectItem>
                  <SelectItem value="Separated">Separated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditResident} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resident</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedResident?.fullName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteResident} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={showResetPasswordModal} onOpenChange={setShowResetPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for {selectedResident?.fullName}? A temporary password will be sent to their email.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowResetPasswordModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              Reset Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
