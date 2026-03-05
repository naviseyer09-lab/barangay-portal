import { useState, useEffect } from "react";
import { Check, X, UserCheck, Clock, UserX, Mail, Phone, Briefcase, IdCard } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

interface StaffRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  employeeId: string;
  username: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function StaffApproval() {
  const [registrations, setRegistrations] = useState<StaffRegistration[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = () => {
    const adminsStr = localStorage.getItem('barangay_admin_accounts');
    const admins = adminsStr ? JSON.parse(adminsStr) : [];
    setRegistrations(admins);
  };

  const handleApprove = (id: string) => {
    const adminsStr = localStorage.getItem('barangay_admin_accounts');
    const admins = adminsStr ? JSON.parse(adminsStr) : [];

    const updatedAdmins = admins.map((admin: any) => {
      if (admin.id === id) {
        return { ...admin, status: 'approved' };
      }
      return admin;
    });

    localStorage.setItem('barangay_admin_accounts', JSON.stringify(updatedAdmins));
    loadRegistrations();

    const approvedAdmin = admins.find((a: any) => a.id === id);
    toast.success("Staff account approved", {
      description: `${approvedAdmin.firstName} ${approvedAdmin.lastName} can now access the system.`,
    });
  };

  const handleReject = (id: string) => {
    const adminsStr = localStorage.getItem('barangay_admin_accounts');
    const admins = adminsStr ? JSON.parse(adminsStr) : [];

    const updatedAdmins = admins.map((admin: any) => {
      if (admin.id === id) {
        return { ...admin, status: 'rejected' };
      }
      return admin;
    });

    localStorage.setItem('barangay_admin_accounts', JSON.stringify(updatedAdmins));
    loadRegistrations();

    const rejectedAdmin = admins.find((a: any) => a.id === id);
    toast.info("Staff account rejected", {
      description: `${rejectedAdmin.firstName} ${rejectedAdmin.lastName}'s registration has been rejected.`,
    });
  };

  const filteredRegistrations = registrations.filter(reg => {
    if (filter === 'all') return true;
    return reg.status === filter;
  });

  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Staff Approvals</h1>
        <p className="text-gray-600 mt-1">Review and approve staff registration requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 inline-flex">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'approved'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'rejected'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Rejected ({rejectedCount})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({registrations.length})
        </button>
      </div>

      {/* Registrations List */}
      <div className="space-y-4">
        {filteredRegistrations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No {filter !== 'all' ? filter : ''} registrations found</p>
          </div>
        ) : (
          filteredRegistrations.map((reg) => (
            <div
              key={reg.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {reg.firstName[0]}{reg.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {reg.firstName} {reg.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">@{reg.username}</p>
                    </div>
                    <div className="ml-auto">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reg.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : reg.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {reg.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {reg.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      {reg.position}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IdCard className="w-4 h-4" />
                      Employee ID: {reg.employeeId}
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Registered on {new Date(reg.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {reg.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(reg.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(reg.id)}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
