export interface User {
  id: string;
  username: string;
  fullName: string;
  address: string;
  contactNumber: string;
  voterStatus: string;
  accountStatus: "Active" | "Inactive";
  profilePicture?: string;
  birthdate?: string;
  gender?: string;
  civilStatus?: string;
  email?: string;
}

export interface ServiceRequest {
  id: string;
  residentId: string;
  residentName: string;
  serviceName: string;
  dateRequested: string;
  purpose: string;
  status: "Pending" | "Processing" | "Approved" | "Released" | "Rejected";
  otp?: string;
  estimatedProcessing: string;
  processedBy?: string;
  processedDate?: string;
  remarks?: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  description: string;
  fullContent: string;
  status: "Draft" | "Published";
  createdBy?: string;
}

export interface Admin {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "Super Admin" | "Admin";
  lastLogin?: string;
}

export const mockUser: User = {
  id: "1",
  username: "juan.delacruz",
  fullName: "Juan Dela Cruz",
  address: "123 Mabini Street, Zone 1, Barangay San Isidro",
  contactNumber: "+63 912 345 6789",
  voterStatus: "Registered Voter",
  accountStatus: "Active",
  birthdate: "1985-06-15",
  gender: "Male",
  civilStatus: "Married",
  email: "juan.delacruz@email.com",
};

export const mockResidents: User[] = [
  {
    id: "1",
    username: "juan.delacruz",
    fullName: "Juan Dela Cruz",
    address: "123 Mabini Street, Zone 1",
    contactNumber: "+63 912 345 6789",
    voterStatus: "Registered Voter",
    accountStatus: "Active",
    birthdate: "1985-06-15",
    gender: "Male",
    civilStatus: "Married",
    email: "juan.delacruz@email.com",
  },
  {
    id: "2",
    username: "maria.santos",
    fullName: "Maria Santos",
    address: "456 Rizal Avenue, Zone 2",
    contactNumber: "+63 917 234 5678",
    voterStatus: "Registered Voter",
    accountStatus: "Active",
    birthdate: "1990-03-22",
    gender: "Female",
    civilStatus: "Single",
    email: "maria.santos@email.com",
  },
  {
    id: "3",
    username: "pedro.garcia",
    fullName: "Pedro Garcia",
    address: "789 Luna Street, Zone 1",
    contactNumber: "+63 918 345 6789",
    voterStatus: "Not Registered",
    accountStatus: "Active",
    birthdate: "2000-11-08",
    gender: "Male",
    civilStatus: "Single",
    email: "pedro.garcia@email.com",
  },
  {
    id: "4",
    username: "ana.reyes",
    fullName: "Ana Reyes",
    address: "321 Bonifacio Street, Zone 3",
    contactNumber: "+63 919 456 7890",
    voterStatus: "Registered Voter",
    accountStatus: "Active",
    birthdate: "1978-09-14",
    gender: "Female",
    civilStatus: "Widow",
    email: "ana.reyes@email.com",
  },
  {
    id: "5",
    username: "carlos.torres",
    fullName: "Carlos Torres",
    address: "654 Del Pilar Street, Zone 2",
    contactNumber: "+63 920 567 8901",
    voterStatus: "Registered Voter",
    accountStatus: "Inactive",
    birthdate: "1995-12-30",
    gender: "Male",
    civilStatus: "Married",
    email: "carlos.torres@email.com",
  },
  {
    id: "6",
    username: "elena.cruz",
    fullName: "Elena Cruz",
    address: "987 Aguinaldo Avenue, Zone 4",
    contactNumber: "+63 921 678 9012",
    voterStatus: "Registered Voter",
    accountStatus: "Active",
    birthdate: "1988-04-25",
    gender: "Female",
    civilStatus: "Married",
    email: "elena.cruz@email.com",
  },
  {
    id: "7",
    username: "ramon.lopez",
    fullName: "Ramon Lopez",
    address: "147 Quezon Street, Zone 3",
    contactNumber: "+63 922 789 0123",
    voterStatus: "Not Registered",
    accountStatus: "Active",
    birthdate: "2002-07-19",
    gender: "Male",
    civilStatus: "Single",
    email: "ramon.lopez@email.com",
  },
  {
    id: "8",
    username: "sofia.ramos",
    fullName: "Sofia Ramos",
    address: "258 Lapu-Lapu Street, Zone 1",
    contactNumber: "+63 923 890 1234",
    voterStatus: "Registered Voter",
    accountStatus: "Active",
    birthdate: "1982-01-11",
    gender: "Female",
    civilStatus: "Married",
    email: "sofia.ramos@email.com",
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Community Clean-Up Drive",
    date: "February 25, 2026",
    description: "Join us in our monthly community clean-up drive this Saturday at 7:00 AM.",
    fullContent: "Join us in our monthly community clean-up drive this Saturday at 7:00 AM. Meeting point is at the Barangay Hall. Please bring your own cleaning materials.",
    status: "Published",
    createdBy: "Admin",
  },
  {
    id: "2",
    title: "Free Medical Mission",
    date: "February 20, 2026",
    description: "Free check-up and medicines available for senior citizens and PWDs.",
    fullContent: "Free check-up and medicines available for senior citizens and PWDs. Bring your valid ID and medical records. First come, first served.",
    status: "Published",
    createdBy: "Admin",
  },
  {
    id: "3",
    title: "Barangay Assembly Meeting",
    date: "February 15, 2026",
    description: "All residents are invited to attend the monthly barangay assembly.",
    fullContent: "All residents are invited to attend the monthly barangay assembly. Important matters regarding the community will be discussed. Your presence matters.",
    status: "Published",
    createdBy: "Admin",
  },
  {
    id: "4",
    title: "COVID-19 Vaccination Drive",
    date: "March 10, 2026",
    description: "Free COVID-19 booster shots for all residents.",
    fullContent: "Free COVID-19 booster shots for all residents. Please bring your vaccination card and valid ID. Available at the Barangay Health Center from 8:00 AM to 5:00 PM.",
    status: "Draft",
    createdBy: "Admin",
  },
];

export const mockRequests: ServiceRequest[] = [
  {
    id: "1",
    residentId: "1",
    residentName: "Juan Dela Cruz",
    serviceName: "Barangay Clearance",
    dateRequested: "February 20, 2026",
    purpose: "Employment",
    status: "Released",
    estimatedProcessing: "3-5 business days",
    processedBy: "Admin Maria Santos",
    processedDate: "February 22, 2026",
  },
  {
    id: "2",
    residentId: "1",
    residentName: "Juan Dela Cruz",
    serviceName: "Barangay Indigency",
    dateRequested: "February 22, 2026",
    purpose: "Medical Assistance",
    status: "Pending",
    estimatedProcessing: "3-5 business days",
  },
  {
    id: "3",
    residentId: "2",
    residentName: "Maria Santos",
    serviceName: "Barangay Residency",
    dateRequested: "February 18, 2026",
    purpose: "School Requirement",
    status: "Approved",
    estimatedProcessing: "3-5 business days",
    processedBy: "Admin Maria Santos",
    processedDate: "February 19, 2026",
  },
  {
    id: "4",
    residentId: "3",
    residentName: "Pedro Garcia",
    serviceName: "Barangay Business Clearance",
    dateRequested: "February 15, 2026",
    purpose: "Business Requirement",
    status: "Processing",
    estimatedProcessing: "5-7 business days",
    processedBy: "Admin Maria Santos",
    processedDate: "February 16, 2026",
  },
  {
    id: "5",
    residentId: "4",
    residentName: "Ana Reyes",
    serviceName: "Barangay Clearance",
    dateRequested: "February 23, 2026",
    purpose: "Personal Use",
    status: "Pending",
    estimatedProcessing: "3-5 business days",
  },
  {
    id: "6",
    residentId: "6",
    residentName: "Elena Cruz",
    serviceName: "Vaccination Certificate",
    dateRequested: "February 21, 2026",
    purpose: "School Requirement",
    status: "Released",
    estimatedProcessing: "2-3 business days",
    processedBy: "Admin Maria Santos",
    processedDate: "February 23, 2026",
  },
  {
    id: "7",
    residentId: "7",
    residentName: "Ramon Lopez",
    serviceName: "Barangay Indigency",
    dateRequested: "February 24, 2026",
    purpose: "Financial Assistance",
    status: "Rejected",
    estimatedProcessing: "3-5 business days",
    processedBy: "Admin Maria Santos",
    processedDate: "February 25, 2026",
    remarks: "Incomplete documents submitted",
  },
  {
    id: "8",
    residentId: "8",
    residentName: "Sofia Ramos",
    serviceName: "Barangay Clearance",
    dateRequested: "February 19, 2026",
    purpose: "Employment",
    status: "Approved",
    estimatedProcessing: "3-5 business days",
    processedBy: "Admin Maria Santos",
    processedDate: "February 20, 2026",
  },
];

export const mockAdmins: Admin[] = [
  {
    id: "1",
    username: "admin",
    fullName: "Maria Santos",
    email: "admin@sanisidro.gov.ph",
    role: "Super Admin",
    lastLogin: "March 5, 2026 - 9:30 AM",
  },
  {
    id: "2",
    username: "admin.staff",
    fullName: "Roberto Cruz",
    email: "staff@sanisidro.gov.ph",
    role: "Admin",
    lastLogin: "March 4, 2026 - 2:15 PM",
  },
];

export const barangayInfo = {
  name: "Barangay Aduas Norte",
  captain: "Ivan Lloyd N. Reyes",
  address: "Nueva Ecija, Cabanatuan City, Aduas Norte, Philippines",
  contactNumber: "09918177027",
  email: "aduasnorte.barangay@gov.ph",
  mission: "To provide excellent public service and promote community development through transparent governance, active citizen participation, and sustainable programs that enhance the quality of life of all residents.",
  vision: "A progressive, peaceful, and united Barangay Aduas Norte where every resident lives in dignity, prosperity, and harmony.",
  barangayHours: "Monday - Friday: 8:00 AM - 5:00 PM",
  establishedYear: "1975",
  population: "12,450",
  totalArea: "2.5 sq km",
};

export const services = [
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

export const purposeOptions = [
  "Employment",
  "School Requirement",
  "Business Requirement",
  "Medical Assistance",
  "Financial Assistance",
  "Personal Use",
  "Others",
];
