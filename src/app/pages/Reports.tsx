import { useState } from "react";
import { mockResidents, mockRequests } from "../data/mockData";
import { FileText, Download, Printer, Calendar, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

type ReportType = "residents" | "requests" | "approved" | "released" | "monthly";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("residents");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const generateResidentReport = () => {
    const data = mockResidents.map((r) => ({
      Name: r.fullName,
      Address: r.address,
      Contact: r.contactNumber,
      "Voter Status": r.voterStatus,
      "Account Status": r.accountStatus,
    }));
    return data;
  };

  const generateRequestReport = () => {
    let data = mockRequests;
    if (filterStatus !== "all") {
      data = data.filter((r) => r.status === filterStatus);
    }
    return data.map((r) => ({
      ID: r.id,
      Resident: r.residentName,
      Service: r.serviceName,
      Purpose: r.purpose,
      Date: r.dateRequested,
      Status: r.status,
    }));
  };

  const generateApprovedReport = () => {
    const approved = mockRequests.filter((r) => r.status === "Approved" || r.status === "Released");
    return approved.map((r) => ({
      ID: r.id,
      Resident: r.residentName,
      Service: r.serviceName,
      "Date Requested": r.dateRequested,
      "Processed By": r.processedBy || "N/A",
      Status: r.status,
    }));
  };

  const generateReleasedReport = () => {
    const released = mockRequests.filter((r) => r.status === "Released");
    return released.map((r) => ({
      ID: r.id,
      Resident: r.residentName,
      Service: r.serviceName,
      "Date Requested": r.dateRequested,
      "Date Released": r.processedDate || "N/A",
      "Processed By": r.processedBy || "N/A",
    }));
  };

  const getCurrentReportData = () => {
    switch (selectedReport) {
      case "residents":
        return generateResidentReport();
      case "requests":
        return generateRequestReport();
      case "approved":
        return generateApprovedReport();
      case "released":
        return generateReleasedReport();
      default:
        return [];
    }
  };

  const reportData = getCurrentReportData();

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Mock export functionality
    alert("Report exported successfully!");
  };

  const reportTypes = [
    { value: "residents", label: "Resident List", description: "Complete list of all registered residents" },
    { value: "requests", label: "Request Summary", description: "All document requests with status" },
    { value: "approved", label: "Approved Documents", description: "List of approved and released documents" },
    { value: "released", label: "Released Documents", description: "Documents that have been released to residents" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and export various reports</p>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <button
            key={report.value}
            onClick={() => setSelectedReport(report.value as ReportType)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedReport === report.value
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <FileText className={`w-5 h-5 mt-1 ${selectedReport === report.value ? "text-blue-600" : "text-gray-400"}`} />
              <div>
                <h3 className={`font-medium ${selectedReport === report.value ? "text-blue-900" : "text-gray-900"}`}>
                  {report.label}
                </h3>
                <p className="text-xs text-gray-600 mt-1">{report.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {selectedReport === "requests" && (
              <div className="w-48">
                <Label className="text-sm mb-2">Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
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
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button onClick={handleExport} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-600">Total Records</p>
          <p className="text-2xl font-bold text-gray-900">{reportData.length}</p>
        </div>
        {selectedReport === "residents" && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-gray-600">Active Residents</p>
              <p className="text-2xl font-bold text-green-600">
                {mockResidents.filter((r) => r.accountStatus === "Active").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-gray-600">Registered Voters</p>
              <p className="text-2xl font-bold text-blue-600">
                {mockResidents.filter((r) => r.voterStatus === "Registered Voter").length}
              </p>
            </div>
          </>
        )}
        {selectedReport === "requests" && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                {mockRequests.filter((r) => r.status === "Pending").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-gray-600">Approved/Released</p>
              <p className="text-2xl font-bold text-green-600">
                {mockRequests.filter((r) => r.status === "Approved" || r.status === "Released").length}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            {reportTypes.find((r) => r.value === selectedReport)?.label}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="overflow-x-auto">
          {reportData.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(reportData[0]).map((key) => (
                    <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-6 py-4 text-sm text-gray-900">
                        {typeof value === "string" && (value === "Active" || value === "Approved" || value === "Released") ? (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            {value}
                          </span>
                        ) : typeof value === "string" && (value === "Inactive" || value === "Rejected") ? (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            {value}
                          </span>
                        ) : typeof value === "string" && (value === "Pending" || value === "Processing") ? (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                            {value}
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No data available for this report</p>
            </div>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .bg-white, .bg-white * {
            visibility: visible;
          }
          .bg-white {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
