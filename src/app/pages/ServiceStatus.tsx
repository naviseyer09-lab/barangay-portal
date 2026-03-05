import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { mockRequests } from "../data/mockData";

export default function ServiceStatus() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Pending":
        return "text-yellow-600";
      case "Rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return CheckCircle;
      case "Pending":
        return Clock;
      case "Rejected":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Status</h1>
        <p className="text-gray-600">Track the status of your service requests</p>
      </div>

      {mockRequests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Requests Yet</h3>
          <p className="text-gray-600 mb-6">You haven't submitted any service requests.</p>
          <a
            href="/resident/requests"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Request a Service
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {mockRequests.map((request) => {
            const StatusIcon = getStatusIcon(request.status);
            return (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {request.serviceName}
                      </h3>
                      <div className="text-sm text-gray-600">
                        Date Requested: {request.dateRequested}
                      </div>
                      <div className="text-sm text-gray-600">
                        Estimated Processing: {request.estimatedProcessing}
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  {/* Timeline Progress Tracker */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      {/* Step 1: Requested */}
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            request.status === "Approved" ||
                            request.status === "Pending" ||
                            request.status === "Rejected"
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                        >
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="mt-2 text-sm font-semibold text-gray-900">Requested</div>
                        <div className="text-xs text-gray-500">{request.dateRequested}</div>
                      </div>

                      {/* Connector Line 1 */}
                      <div
                        className={`flex-1 h-1 ${
                          request.status === "Approved" ||
                          request.status === "Pending" ||
                          request.status === "Rejected"
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                        style={{ marginBottom: "50px" }}
                      ></div>

                      {/* Step 2: Under Review */}
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            request.status === "Approved" || request.status === "Rejected"
                              ? "bg-blue-600"
                              : request.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-gray-300"
                          }`}
                        >
                          {request.status === "Pending" ? (
                            <Clock className="w-5 h-5 text-white animate-pulse" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="mt-2 text-sm font-semibold text-gray-900">
                          Under Review
                        </div>
                        <div className="text-xs text-gray-500">
                          {request.status === "Pending" ? "In Progress" : "Completed"}
                        </div>
                      </div>

                      {/* Connector Line 2 */}
                      <div
                        className={`flex-1 h-1 ${
                          request.status === "Approved" || request.status === "Rejected"
                            ? request.status === "Approved"
                              ? "bg-green-600"
                              : "bg-red-600"
                            : "bg-gray-300"
                        }`}
                        style={{ marginBottom: "50px" }}
                      ></div>

                      {/* Step 3: Final Status */}
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            request.status === "Approved"
                              ? "bg-green-600"
                              : request.status === "Rejected"
                              ? "bg-red-600"
                              : "bg-gray-300"
                          }`}
                        >
                          <StatusIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="mt-2 text-sm font-semibold text-gray-900">
                          {request.status === "Approved"
                            ? "Approved"
                            : request.status === "Rejected"
                            ? "Rejected"
                            : "Awaiting"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {request.status === "Approved" || request.status === "Rejected"
                            ? "Final"
                            : "Pending"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {request.status === "Approved" && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-green-900 mb-1">
                            Request Approved
                          </div>
                          <div className="text-sm text-green-700">
                            Your certificate is ready for pickup at the Barangay Hall during office
                            hours.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {request.status === "Rejected" && (
                    <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-red-900 mb-1">Request Rejected</div>
                          <div className="text-sm text-red-700">
                            Your request was rejected. Please contact the Barangay Hall for more
                            information.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {request.status === "Pending" && (
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-yellow-900 mb-1">
                            Request Under Review
                          </div>
                          <div className="text-sm text-yellow-700">
                            Your request is currently being processed. Estimated time:{" "}
                            {request.estimatedProcessing}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
