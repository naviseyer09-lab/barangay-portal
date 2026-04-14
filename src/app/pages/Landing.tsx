import { FileText, Home, Heart, Briefcase, Syringe, Building2, User, Target } from "lucide-react";
import LandingHeader from "../components/LandingHeader";
import Footer from "../components/Footer";
import { mockAnnouncements } from "../data/mockData";
import { useBarangay } from "../components/BarangayContext";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const defaultBarangayInfo = {
  name: "Barangay Aduas Norte",
  captain: "Ivan Lloyd N. Reyes",
  address: "Nueva Ecija, Cabanatuan City, Aduas Norte, Philippines",
  contactNumber: "09918177027",
  email: "aduasnorte.barangay@gov.ph",
  mission:
    "To provide excellent public service and promote community development through transparent governance, active citizen participation, and sustainable programs that enhance the quality of life of all residents.",
  vision:
    "A progressive, peaceful, and united Barangay Aduas Norte where every resident lives in dignity, prosperity, and harmony.",
};

const serviceIcons = {
  FileText,
  Home,
  Heart,
  Briefcase,
  Syringe,
};

export default function Landing() {
  const navigate = useNavigate();
  const { barangayInfo, loading: barangayLoading } = useBarangay();
  const info = barangayInfo ?? defaultBarangayInfo;

  const services = [
    { icon: "FileText", name: "Barangay Clearance", description: "Certificate of Residency for various purposes" },
    { icon: "Home", name: "Barangay Residency", description: "Proof of residency certificate" },
    { icon: "Heart", name: "Barangay Indigency", description: "Certificate of Indigency for financial assistance" },
    { icon: "Briefcase", name: "Barangay Business Clearance", description: "Business permit clearance" },
    { icon: "Syringe", name: "Vaccination Certificate", description: "COVID-19 vaccination records" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader />

      {/* Hero Section */}
      <section id="home" className="pt-16 relative">
        <div className="relative h-[600px] bg-gradient-to-r from-blue-900/90 to-green-800/90">
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1737907208040-d13a8ba97baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGlsaXBwaW5lJTIwYmFyYW5nYXklMjBoYWxsJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzcyMjA2NzAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Barangay Hall"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
              <Building2 className="w-14 h-14" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Welcome to {barangayLoading ? 'Loading...' : info.name}
            </h1>
            <p className="text-xl text-center mb-8 text-white/90">Official Portal</p>
            <button
              onClick={() => navigate("/resident")}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Resident Login
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">About Our Barangay</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Barangay Details */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Barangay Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Barangay Name</div>
                  <div className="font-semibold text-gray-900">{barangayLoading ? 'Loading...' : info.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Barangay Captain</div>
                  <div className="font-semibold text-gray-900">{barangayLoading ? 'Loading...' : info.captain}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Address</div>
                  <div className="font-semibold text-gray-900">{barangayLoading ? 'Loading...' : info.address}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Contact Number</div>
                  <div className="font-semibold text-gray-900">{barangayLoading ? 'Loading...' : info.contactNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-semibold text-gray-900">{barangayLoading ? 'Loading...' : info.email}</div>
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Mission</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{barangayLoading ? 'Loading...' : info.mission}</p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Vision</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{barangayLoading ? 'Loading...' : info.vision}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Our Services</h2>
          <p className="text-center text-gray-600 mb-12">Apply for barangay certificates and clearances online</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const IconComponent = serviceIcons[service.icon as keyof typeof serviceIcons];
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section id="announcements" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Latest Announcements</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAnnouncements
              .filter((announcement) => announcement.status === "Published")
              .map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="text-sm text-blue-600 font-semibold mb-2">{announcement.date}</div>
                  <h3 className="font-semibold text-gray-900 mb-3">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{announcement.description}</p>
                  <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
                    Read More →
                  </button>
                </div>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
