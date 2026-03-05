import { Users, FileText, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";
import { mockResidents, mockRequests, mockAnnouncements } from "../data/mockData";
import { Link } from "react-router";

export default function AdminDashboard() {
  const totalResidents = mockResidents.length;
  const activeResidents = mockResidents.filter(r => r.accountStatus === "Active").length;
  const totalRequests = mockRequests.length;
  const pendingRequests = mockRequests.filter(r => r.status === "Pending").length;
  const approvedRequests = mockRequests.filter(r => r.status === "Approved" || r.status === "Released").length;
  const rejectedRequests = mockRequests.filter(r => r.status === "Rejected").length;
  const publishedAnnouncements = mockAnnouncements.filter(a => a.status === "Published").length;

  const stats = [
    {
      name: "Total Residents",
      value: totalResidents,
      subtext: `${activeResidents} active`,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      link: "/admin/residents",
    },
    {
      name: "Total Requests",
      value: totalRequests,
      subtext: `${pendingRequests} pending`,
      icon: FileText,
      color: "from-green-500 to-green-600",
      link: "/admin/requests",
    },
    {
      name: "Approved/Released",
      value: approvedRequests,
      subtext: "Documents processed",
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-600",
      link: "/admin/requests",
    },
    {
      name: "Pending Review",
      value: pendingRequests,
      subtext: "Awaiting action",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      link: "/admin/requests",
    },
  ];

  const recentRequests = mockRequests.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Admin! Here's what's happening today.</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
              </div>
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Request Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <span className="font-bold text-gray-900">{pendingRequests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">Processing</span>
              </div>
              <span className="font-bold text-gray-900">
                {mockRequests.filter(r => r.status === "Processing").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Approved</span>
              </div>
              <span className="font-bold text-gray-900">
                {mockRequests.filter(r => r.status === "Approved").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-gray-700">Released</span>
              </div>
              <span className="font-bold text-gray-900">
                {mockRequests.filter(r => r.status === "Released").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-700">Rejected</span>
              </div>
              <span className="font-bold text-gray-900">{rejectedRequests}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/residents?action=add"
              className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Add New Resident</span>
            </Link>
            <Link
              to="/admin/requests"
              className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
            >
              <FileText className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Review Requests</span>
            </Link>
            <Link
              to="/admin/announcements?action=create"
              className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Create Announcement</span>
            </Link>
            <Link
              to="/admin/reports"
              className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              <FileText className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Generate Report</span>
            </Link>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">System Info</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Active Announcements</p>
              <p className="text-2xl font-bold text-gray-900">{publishedAnnouncements}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Registered Voters</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockResidents.filter(r => r.voterStatus === "Registered Voter").length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last System Update</p>
              <p className="text-sm text-gray-900">March 5, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Requests</h2>
            <Link to="/admin/requests" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resident</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{request.residentName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{request.serviceName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.purpose}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.dateRequested}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === "Released"
                          ? "bg-emerald-100 text-emerald-800"
                          : request.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : request.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : request.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
