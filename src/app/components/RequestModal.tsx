import { useState } from "react";
import { X } from "lucide-react";
import { purposeOptions } from "../data/mockData";
import { useNavigate } from "react-router";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}

export default function RequestModal({ isOpen, onClose, serviceName }: RequestModalProps) {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  if (!isOpen) return null;

  const handleGetCode = () => {
    setOtpSent(true);
    // Simulate OTP sending
    alert("OTP sent to your registered contact number");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose) {
      alert("Please select a purpose");
      return;
    }
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    // Simulate request submission
    alert("Request submitted successfully!");
    onClose();
    navigate("/resident/status");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Request Process</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Name
            </label>
            <input
              type="text"
              value={serviceName}
              disabled
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
            />
          </div>

          {/* Date of Request */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Request
            </label>
            <input
              type="text"
              value={new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              disabled
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose of Request
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a purpose</option>
              {purposeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* OTP Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTP Verification
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={handleGetCode}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                Get Code
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {otpSent
                ? "OTP sent to your registered contact number"
                : "Enter the OTP sent to your registered contact number"}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
