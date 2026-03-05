import { Building2, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";
import { barangayInfo } from "../data/mockData";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 to-green-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Barangay Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="font-semibold text-lg">{barangayInfo.name}</div>
                <div className="text-sm text-white/80">Official Portal</div>
              </div>
            </div>
            <p className="text-white/70 text-sm">
              Serving the community with transparency, integrity, and dedication.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-white/80">{barangayInfo.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-white/80">{barangayInfo.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-white/80">{barangayInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} {barangayInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
