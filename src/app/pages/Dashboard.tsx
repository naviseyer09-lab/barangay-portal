import { CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import { mockUser, mockRequests } from "../data/mockData";

export default function Dashboard() {
  const activeRequests = mockRequests.length;
  const approved = mockRequests.filter((r) => r.status === "Approved").length;
  const pending = mockRequests.filter((r) => r.status === "Pending").length;
  const rejected = mockRequests.filter((r) => r.status === "Rejected").length;

  const summaryCards = [
    { label: "Active Requests", value: activeRequests, icon: FileText, color: "blue" },
    { label: "Approved", value: approved, icon: CheckCircle, color: "green" },
    { label: "Pending", value: pending, icon: Clock, color: "yellow" },
    { label: "Rejected", value: rejected, icon: XCircle, color: "red" },
  ];

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {mockUser.fullName}!
        </h1>
        <p className="text-gray-600">Here's an overview of your requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${colorClasses[card.color as keyof typeof colorClasses]}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[card.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{card.value}</div>
                </div>
                <div className="text-sm text-gray-600">{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Requests</h2>
        </div>
        <div className="p-6">
          {mockRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{request.serviceName}</div>
                    <div className="text-sm text-gray-600">{request.dateRequested}</div>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        request.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : request.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
