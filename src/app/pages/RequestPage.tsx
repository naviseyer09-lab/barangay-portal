import { useState } from "react";
import { FileText, Home, Heart, Briefcase, Syringe } from "lucide-react";
import RequestModal from "../components/RequestModal";

const serviceIcons = {
  FileText,
  Home,
  Heart,
  Briefcase,
  Syringe,
};

export default function RequestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const services = [
    {
      id: "barangay-clearance",
      name: "Barangay Clearance",
      description: "Certificate of Residency for various purposes",
      icon: "FileText",
    },
    {
      id: "barangay-residency",
      name: "Barangay Residency",
      description: "Proof of residency certificate",
      icon: "Home",
    },
    {
      id: "barangay-indigency",
      name: "Barangay Indigency",
      description: "Certificate of Indigency for financial assistance",
      icon: "Heart",
    },
    {
      id: "barangay-business",
      name: "Barangay Business Clearance",
      description: "Business permit clearance",
      icon: "Briefcase",
    },
    {
      id: "vaccination",
      name: "Vaccination Certificate",
      description: "COVID-19 vaccination records",
      icon: "Syringe",
    },
  ];

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Services</h1>
        <p className="text-gray-600">Select a service to submit a request</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComponent = serviceIcons[service.icon as keyof typeof serviceIcons];
          return (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service.name)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all text-left group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-green-100 group-hover:from-blue-200 group-hover:to-green-200 rounded-xl flex items-center justify-center mb-4 transition-colors">
                <IconComponent className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">{service.name}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
              <div className="mt-4 text-blue-600 font-semibold text-sm group-hover:text-blue-700">
                Request Now →
              </div>
            </button>
          );
        })}
      </div>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName={selectedService}
      />
    </div>
  );
}
