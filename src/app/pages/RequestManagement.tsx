import { useState } from "react";
import { mockRequests, ServiceRequest } from "../data/mockData";
import { Search, CheckCircle, XCircle, Clock, FileText, Eye } from "lucide-react";
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

export default function RequestManagement() {
  const [requests, setRequests] = useState<ServiceRequest[]>(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | "process" | "release">("approve");
  const [remarks, setRemarks] = useState("");

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      pending: requests.filter(r => r.status === "Pending").length,
      processing: requests.filter(r => r.status === "Processing").length,
      approved: requests.filter(r => r.status === "Approved").length,
      released: requests.filter(r => r.status === "Released").length,
      rejected: requests.filter(r => r.status === "Rejected").length,
    };
  };

  const statusCounts = getStatusCounts();

  const openDetailsModal = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const openActionModal = (request: ServiceRequest, action: typeof actionType) => {
    setSelectedRequest(request);
    setActionType(action);
    setRemarks("");
    setShowActionModal(true);
  };

  const handleAction = () => {
    if (!selectedRequest) return;

    const updatedRequest: ServiceRequest = {
      ...selectedRequest,
      status: actionType === "approve" ? "Approved" 
        : actionType === "reject" ? "Rejected"
        : actionType === "process" ? "Processing"
        : "Released",
      processedBy: "Admin Maria Santos",
      processedDate: "March 5, 2026",
      remarks: remarks || undefined,
    };

    setRequests(requests.map(r => r.id === selectedRequest.id ? updatedRequest : r));
    setShowActionModal(false);
    setSelectedRequest(null);
    setRemarks("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Request Management</h1>
        <p className="text-gray-600 mt-1">Review and process document requests from residents</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-gray-600">Processing</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{statusCounts.processing}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-sm text-gray-600">Approved</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{statusCounts.approved}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <p className="text-sm text-gray-600">Released</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{statusCounts.released}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{statusCounts.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by resident name or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Released">Released</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resident</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Requested</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{request.id}</td>
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDetailsModal(request)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {request.status === "Pending" && (
                        <>
                          <button
                            onClick={() => openActionModal(request, "process")}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            title="Process"
                          >
                            Process
                          </button>
                          <button
                            onClick={() => openActionModal(request, "approve")}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                            title="Approve"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openActionModal(request, "reject")}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            title="Reject"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === "Processing" && (
                        <>
                          <button
                            onClick={() => openActionModal(request, "approve")}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                            title="Approve"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openActionModal(request, "reject")}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            title="Reject"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === "Approved" && (
                        <button
                          onClick={() => openActionModal(request, "release")}
                          className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
                          title="Mark as Released"
                        >
                          Release
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

      {/* Request Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>View complete information about this request</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Request ID</Label>
                  <p className="font-medium">#{selectedRequest.id}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Status</Label>
                  <p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        selectedRequest.status === "Released"
                          ? "bg-emerald-100 text-emerald-800"
                          : selectedRequest.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : selectedRequest.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : selectedRequest.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {selectedRequest.status}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Resident Name</Label>
                <p className="font-medium">{selectedRequest.residentName}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Service Requested</Label>
                <p className="font-medium">{selectedRequest.serviceName}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Purpose</Label>
                <p className="font-medium">{selectedRequest.purpose}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Date Requested</Label>
                  <p className="font-medium">{selectedRequest.dateRequested}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Est. Processing</Label>
                  <p className="font-medium">{selectedRequest.estimatedProcessing}</p>
                </div>
              </div>
              {selectedRequest.processedBy && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Processed By</Label>
                    <p className="font-medium">{selectedRequest.processedBy}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Processed Date</Label>
                    <p className="font-medium">{selectedRequest.processedDate}</p>
                  </div>
                </div>
              )}
              {selectedRequest.remarks && (
                <div>
                  <Label className="text-xs text-gray-500">Remarks</Label>
                  <p className="font-medium">{selectedRequest.remarks}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "Approve Request"}
              {actionType === "reject" && "Reject Request"}
              {actionType === "process" && "Process Request"}
              {actionType === "release" && "Release Document"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" && "Are you sure you want to approve this request?"}
              {actionType === "reject" && "Please provide a reason for rejecting this request."}
              {actionType === "process" && "Mark this request as being processed?"}
              {actionType === "release" && "Mark this document as released to the resident?"}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Resident</p>
                <p className="font-medium">{selectedRequest.residentName}</p>
                <p className="text-sm text-gray-600 mt-2">Service</p>
                <p className="font-medium">{selectedRequest.serviceName}</p>
              </div>
              {(actionType === "reject" || actionType === "approve" || actionType === "release") && (
                <div className="space-y-2">
                  <Label htmlFor="remarks">
                    {actionType === "reject" ? "Reason for Rejection *" : "Remarks (Optional)"}
                  </Label>
                  <Textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder={actionType === "reject" ? "Enter reason..." : "Enter any remarks..."}
                    rows={3}
                  />
                </div>
              )}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowActionModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAction}
                  className={
                    actionType === "reject"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  }
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
