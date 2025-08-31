import { useState, useMemo } from "react";
import UnifiedProjectView from "@/components/dashboard/UnifiedProjectView";
import ProjectFilters from "@/components/dashboard/ProjectFilters";
import { Button } from "@/components/ui/button";
import AddProjectForm from "@/components/forms/AddProjectForm";

// Import equipment images
import pressureVesselImg from "@/assets/pressure-vessel-1.jpg";
import heatExchangerImg from "@/assets/heat-exchanger-1.jpg";
import storageTankImg from "@/assets/storage-tank-1.jpg";
import reactorVesselImg from "@/assets/reactor-vessel-1.jpg";

// Mock data
const mockProjects = [
  {
    id: "1",
    name: "Hazira Plant Project",
    client: "Reliance Industries Ltd.",
    location: "Hazira Petrochemical Complex, Gujarat",
    equipmentCount: 24,
    activeEquipment: 18,
    progress: 75,
    status: "active" as const,
    manager: "Rajesh Kumar",
    deadline: "Dec 15, 2025",
    poNumber: "REL-2024-HE-001",
    equipmentBreakdown: {
      heatExchanger: 8,
      pressureVessel: 4,
      storageTank: 6,
      reactor: 6
    },
    servicesIncluded: ["Design & Engineering", "Manufacturing & Fabrication", "Quality Testing & Inspection", "Documentation & Certification", "Installation Support", "Commissioning Assistance"],
    scopeOfWork: "Complete engineering, procurement, and manufacturing of process equipment for the new petrochemical expansion unit. This includes design calculations, material procurement, fabrication as per ASME standards, hydrostatic testing, NDT inspection, and comprehensive documentation. The scope also includes on-site installation support and commissioning assistance.",
    // Additional detailed fields
    salesOrderDate: "2024-03-15",
    clientIndustry: "Petrochemical & Refining",
    projectDescription: "Design, manufacturing, and testing of critical process equipment for the new petrochemical expansion unit at Hazira. This comprehensive project includes 24 units of specialized equipment including heat exchangers, pressure vessels, storage tanks, and reactor systems designed to support increased production capacity of 500,000 MTPA. All equipment will be manufactured to ASME VIII standards with special consideration for corrosive service conditions.",
    consultant: "Technip Energies India Pvt. Ltd.",
    tpiAgency: "Bureau Veritas India",
    clientFocalPoint: "Mr. Amit Sharma - Project Director, Engineering Division",
    vdcrManager: "Quality Team Lead",
    unpricedPOFile: { name: "RIL_Unpriced_PO_2024_001.pdf", uploaded: true, type: "application/pdf" },
    designInputsPID: { name: "Process_Flow_Diagram_Rev_C.dwg", uploaded: true, type: "application/dwg" },
    clientReferenceDoc: { name: "Client_Technical_Specifications.pdf", uploaded: true, type: "application/pdf" },
    otherDocuments: [
      { name: "Safety_Requirements.pdf", uploaded: true, type: "application/pdf" },
      { name: "Environmental_Compliance.pdf", uploaded: true, type: "application/pdf" },
      { name: "Quality_Assurance_Plan.pdf", uploaded: true, type: "application/pdf" }
    ],
    kickoffMeetingNotes: `Key discussion points from project kickoff meeting held on March 20, 2024:

• Project timeline confirmed with delivery by December 15, 2025
• Client emphasized importance of ASME VIII Div 1 compliance for all pressure vessels
• Special coating requirements for corrosive service conditions in marine environment
• Weekly progress reviews scheduled every Tuesday at 2:00 PM IST
• Material sourcing approval required from client procurement team before ordering
• Factory acceptance testing mandatory before dispatch from manufacturing facility
• Installation support team to be available for 3 weeks on-site during commissioning
• Final inspection and documentation handover scheduled for November 2025`,
    specialProductionNotes: `Critical production requirements and specifications:

• All welding operations to be performed by ASME IX certified welders only
• 100% radiographic testing required for all pressure vessel shell seams and nozzle attachments
• Positive Material Identification (PMI) testing mandatory for all pressure-bearing components
• Stress relief heat treatment schedule as per ASME VIII Div 1 requirements
• Third-party inspection by Bureau Veritas at all designated hold points
• Hydrostatic testing at 1.5 times design pressure with witnessed testing
• Surface preparation: Sa 2.5 blast cleaning followed by specialized coating system
• Coating: Epoxy primer + Polyurethane topcoat (total DFT: 150 microns minimum)
• Complete documentation package including MTCs, test certificates, calibration reports, and warranty certificates`
  },
  {
    id: "2",
    name: "UPL Plant 5 Project",
    client: "UPL Limited",
    location: "Ankleshwar Industrial Estate, Gujarat",
    equipmentCount: 16,
    activeEquipment: 12,
    progress: 60,
    status: "delayed" as const,
    manager: "Priya Sharma",
    deadline: "Nov 20, 2025",
    poNumber: "UPL-2024-PV-003",
    equipmentBreakdown: {
      pressureVessel: 6,
      storageTank: 4,
      heatExchanger: 6
    },
    servicesIncluded: ["Manufacturing & Fabrication", "Quality Testing & Inspection", "Installation Support", "Commissioning Assistance"],
    scopeOfWork: "Manufacturing of specialized pressure vessels and storage equipment for UPL's agrochemical processing plant expansion. Equipment designed for handling corrosive agrochemical formulations with special corrosion-resistant liners and advanced safety systems.",
    // Additional detailed fields
    salesOrderDate: "2024-04-20",
    clientIndustry: "Agricultural Chemicals & Crop Protection",
    projectDescription: "Design and manufacturing of process equipment for UPL's new specialty agrochemicals production line. The project includes 16 units of equipment designed for handling various crop protection chemicals and fertilizer intermediates. Equipment features special corrosion-resistant materials and advanced process control systems to ensure safe handling of reactive chemicals.",
    consultant: "Chemtech Engineers Pvt. Ltd.",
    tpiAgency: "SGS India Pvt. Ltd.",
    clientFocalPoint: "Ms. Kavita Patel - Plant Engineering Manager",
    vdcrManager: "Sarah Johnson",
    unpricedPOFile: { name: "UPL_Purchase_Order_Draft_v2.pdf", uploaded: true, type: "application/pdf" },
    designInputsPID: null, // Not uploaded yet
    clientReferenceDoc: { name: "UPL_Technical_Requirements.pdf", uploaded: true, type: "application/pdf" },
    otherDocuments: [
      { name: "Safety_Data_Sheets.pdf", uploaded: true, type: "application/pdf" },
      { name: "Environmental_Impact_Assessment.pdf", uploaded: true, type: "application/pdf" }
    ],
    kickoffMeetingNotes: `Project kickoff meeting summary - April 25, 2024:

• Delivery timeline adjusted to November 20, 2025 due to regulatory approvals
• Special emphasis on chemical compatibility and corrosion resistance for agrochemicals
• Equipment designed for multi-product capability for different agrochemical formulations
• Bi-weekly progress meetings scheduled with client engineering team
• Client quality team to conduct interim inspections during critical fabrication stages
• Installation support required for 3 weeks during plant commissioning phase
• Comprehensive training sessions for plant operators scheduled post-installation
• Project currently delayed due to material procurement challenges for specialty alloys`,
    specialProductionNotes: `Specific requirements for agrochemical equipment manufacturing:

• Materials: Hastelloy C-276 for wetted parts due to highly corrosive nature of chemicals
• All gaskets and seals to be Viton FKM grade for superior chemical compatibility
• Internal surface finish: 32 RMS or better for easy cleaning between product batches
• Agitator systems with variable frequency drives for different viscosity products
• Precision temperature control systems with ±2°C accuracy for critical reactions
• Emergency pressure relief systems designed per NFPA 68 guidelines
• Specialized CIP (Clean-in-Place) systems for multi-product operations
• Complete material traceability documentation for regulatory compliance requirements`
  },
  {
    id: "3",
    name: "IOCL Refinery Expansion",
    client: "Indian Oil Corporation Limited",
    location: "Panipat Refinery Complex, Haryana",
    equipmentCount: 32,
    activeEquipment: 28,
    progress: 90,
    status: "on-track" as const,
    manager: "Amit Patel",
    deadline: "Apr 2026",
    poNumber: "IOCL-2024-RP-007",
    equipmentBreakdown: {
      reactor: 4,
      heatExchanger: 7,
      pressureVessel: 4,
      storageTank: 8,
      other: 9
    },
    servicesIncluded: ["Design & Engineering", "Manufacturing & Fabrication", "Quality Testing & Inspection", "Documentation & Certification", "Installation Support", "Commissioning & Startup"],
    scopeOfWork: "Comprehensive refinery expansion project for increased crude processing capacity. Includes design and manufacturing of critical equipment such as reactor vessels, heat exchangers, fractionation columns, and storage systems. Project encompasses full engineering services, fabrication, testing, installation support, and commissioning assistance.",
    // Additional detailed fields
    salesOrderDate: "2024-02-10",
    clientIndustry: "Oil Refining & Petrochemicals",
    projectDescription: "Major refinery expansion project at IOCL's Panipat facility to increase crude oil processing capacity from 15 MMTPA to 25 MMTPA. The project involves manufacturing 32 critical equipment units including distillation columns, reactors, heat exchangers, and storage tanks. All equipment designed to handle various crude oil grades and meet stringent environmental norms.",
    consultant: "Engineers India Limited (EIL)",
    tpiAgency: "Lloyd's Register EMEA",
    clientFocalPoint: "Mr. Suresh Gupta - General Manager (Projects), Panipat Refinery",
    vdcrManager: "Michael Chen",
    unpricedPOFile: { name: "IOCL_Framework_Agreement_2024.pdf", uploaded: true, type: "application/pdf" },
    designInputsPID: { name: "Refinery_Process_Flow_Diagrams_Rev_D.pdf", uploaded: true, type: "application/pdf" },
    clientReferenceDoc: { name: "IOCL_Design_Standards_Manual.pdf", uploaded: true, type: "application/pdf" },
    otherDocuments: [
      { name: "Environmental_Clearance_Certificate.pdf", uploaded: true, type: "application/pdf" },
      { name: "Fire_Safety_Requirements.pdf", uploaded: true, type: "application/pdf" },
      { name: "PESO_Approval_Documents.pdf", uploaded: true, type: "application/pdf" },
      { name: "Statutory_Compliance_Checklist.pdf", uploaded: true, type: "application/pdf" }
    ],
    kickoffMeetingNotes: `Project kickoff meeting - February 15, 2024:

• Large-scale refinery expansion with 32 major equipment units to be delivered
• Delivery schedule phased over 18 months with first equipment delivery by October 2024
• Strict adherence to IOCL design standards and Indian regulatory requirements
• All equipment to comply with IS 2825, ASME VIII, and API standards as applicable
• Monthly progress review meetings with IOCL project team and EIL consultants
• Factory inspection protocols established with IOCL QA team site visits
• Logistics planning critical due to oversized equipment transportation to Panipat
• Installation support spans 6 months during plant turnaround periods`,
    specialProductionNotes: `Critical specifications for refinery equipment:

• Materials selection per NACE MR0175 for sour service applications
• All pressure vessels designed for H2S/CO2 service with appropriate metallurgy
• Cladding and overlay welding for corrosion protection in critical areas
• Heat treatment requirements per ASME VIII and IOCL specifications
• 100% volumetric examination for all critical pressure-retaining welds
• Hydrostatic testing with demineralized water to avoid chloride contamination
• Nitrogen purging and preservation procedures for long-term storage
• Special transportation and lifting procedures for large reactor vessels (>200 MT)
• Integration with existing DCS and safety systems per IOCL standards`
  },
  {
    id: "4",
    name: "BPCL Petrochemical Plant",
    client: "BPCL",
    location: "Mumbai, Maharashtra",
    equipmentCount: 18,
    activeEquipment: 15,
    progress: 85,
    status: "active" as const,
    manager: "Vikram Singh",
    deadline: "June 2027",
    poNumber: "BPCL-2024-PP-012",
    equipmentBreakdown: {
      heatExchanger: 6,
      pressureVessel: 4,
      reactor: 3,
      storageTank: 5
    },
    servicesIncluded: ["Design & Engineering", "Manufacturing & Fabrication", "Quality Testing & Inspection", "Documentation & Certification", "Installation Support", "Commissioning & Startup"],
    scopeOfWork: "Comprehensive petrochemical plant equipment manufacturing project for BPCL's new specialty chemicals facility. Includes design and fabrication of heat exchangers, pressure vessels, reactor systems, and storage tanks for handling various petrochemical intermediates and specialty chemicals. Project encompasses full engineering services, fabrication, testing, and commissioning support.",
    // Additional detailed fields
    salesOrderDate: "2024-01-15",
    clientIndustry: "Petrochemicals & Specialty Chemicals",
    projectDescription: "Major petrochemical plant expansion project at BPCL's Mumbai facility for production of specialty chemicals and petrochemical intermediates. The project involves manufacturing 18 critical equipment units including reactors, heat exchangers, pressure vessels, and storage systems designed for handling corrosive and high-temperature petrochemical streams.",
    consultant: "L&T Engineering Services",
    tpiAgency: "TUV SUD South Asia",
    clientFocalPoint: "Mr. Rajesh Mehta - Senior Manager (Projects), BPCL Petrochemicals",
    vdcrManager: "Emily Thompson",
    unpricedPOFile: { name: "BPCL_Petrochem_Agreement_2024.pdf", uploaded: true, type: "application/pdf" },
    designInputsPID: { name: "Petrochemical_Process_Design_Rev_B.pdf", uploaded: true, type: "application/pdf" },
    clientReferenceDoc: { name: "BPCL_Technical_Specifications_Manual.pdf", uploaded: true, type: "application/pdf" },
    otherDocuments: [
      { name: "Safety_Assessment_Report.pdf", uploaded: true, type: "application/pdf" },
      { name: "Environmental_Compliance_Docs.pdf", uploaded: true, type: "application/pdf" },
      { name: "Quality_Management_Plan.pdf", uploaded: true, type: "application/pdf" }
    ],
    kickoffMeetingNotes: `Project kickoff meeting - January 20, 2024:

• Petrochemical plant expansion with 18 major equipment units to be delivered
• Delivery schedule phased over 24 months with first equipment delivery by August 2024
• Strict adherence to BPCL design standards and international petrochemical industry norms
• All equipment to comply with ASME VIII, API standards, and BPCL specifications
• Monthly progress review meetings with BPCL project team and L&T consultants
• Factory inspection protocols established with BPCL QA team site visits
• Special emphasis on corrosion resistance for petrochemical service conditions
• Installation support spans 4 months during plant turnaround periods`,
    specialProductionNotes: `Critical specifications for petrochemical equipment:

• Materials selection per NACE MR0175 for sour service and high-temperature applications
• All pressure vessels designed for H2S/CO2 service with appropriate metallurgy
• Cladding and overlay welding for corrosion protection in critical areas
• Heat treatment requirements per ASME VIII and BPCL specifications
• 100% volumetric examination for all critical pressure-retaining welds
• Hydrostatic testing with demineralized water to avoid chloride contamination
• Nitrogen purging and preservation procedures for long-term storage
• Special coating systems for marine environment and petrochemical service
• Integration with existing DCS and safety systems per BPCL standards`
  },
  {
    id: "5",
    name: "Adani Port Terminal",
    client: "Adani Ports",
    location: "Mundra, Gujarat",
    equipmentCount: 22,
    activeEquipment: 19,
    progress: 70,
    status: "on-track" as const,
    manager: "Neha Verma",
    deadline: "Apr 2025",
    poNumber: "ADANI-2024-PT-015",
    equipmentBreakdown: {
      storageTank: 8,
      heatExchanger: 5,
      pressureVessel: 6,
      other: 3
    },
    servicesIncluded: ["Design & Engineering", "Manufacturing & Fabrication", "Quality Testing & Inspection", "Documentation & Certification", "Installation Support", "Commissioning & Startup"],
    scopeOfWork: "Comprehensive port terminal equipment manufacturing project for Adani's Mundra facility. Includes design and fabrication of storage tanks, heat exchangers, pressure vessels, and specialized port handling equipment. Project encompasses full engineering services, fabrication, testing, and commissioning support for maritime applications.",
    // Additional detailed fields
    salesOrderDate: "2024-03-01",
    clientIndustry: "Port & Terminal Operations",
    projectDescription: "Major port terminal expansion project at Adani's Mundra facility for increased cargo handling capacity. The project involves manufacturing 22 critical equipment units including storage tanks, heat exchangers, pressure vessels, and specialized port handling systems designed for maritime environment and corrosive conditions.",
    consultant: "Adani Engineering Services",
    tpiAgency: "Bureau Veritas India",
    clientFocalPoint: "Mr. Ramesh Patel - Senior Manager (Infrastructure), Adani Ports",
    vdcrManager: "David Rodriguez",
    unpricedPOFile: { name: "Adani_Port_Agreement_2024.pdf", uploaded: true, type: "application/pdf" },
    designInputsPID: { name: "Port_Terminal_Design_Specs_Rev_A.pdf", uploaded: true, type: "application/pdf" },
    clientReferenceDoc: { name: "Adani_Technical_Requirements.pdf", uploaded: true, type: "application/pdf" },
    otherDocuments: [
      { name: "Maritime_Safety_Standards.pdf", uploaded: true, type: "application/pdf" },
      { name: "Environmental_Compliance_Port.pdf", uploaded: true, type: "application/pdf" },
      { name: "Quality_Assurance_Port.pdf", uploaded: true, type: "application/pdf" }
    ],
    kickoffMeetingNotes: `Project kickoff meeting - March 5, 2024:

• Port terminal expansion with 22 major equipment units to be delivered
• Delivery schedule phased over 12 months with first equipment delivery by July 2024
• Strict adherence to maritime standards and Adani port specifications
• All equipment to comply with maritime safety standards and port regulations
• Monthly progress review meetings with Adani project team and engineering services
• Factory inspection protocols established with Adani QA team site visits
• Special emphasis on corrosion resistance for marine environment
• Installation support spans 3 months during port operations`,
    specialProductionNotes: `Critical specifications for port terminal equipment:

• Materials selection per maritime standards for marine environment applications
• All equipment designed for salt spray and high humidity conditions
• Specialized coating systems for marine environment protection
• Heat treatment requirements per maritime and Adani specifications
• 100% volumetric examination for all critical pressure-retaining welds
• Hydrostatic testing with appropriate test media for port applications
• Nitrogen purging and preservation procedures for long-term storage
• Special transportation and lifting procedures for port equipment
• Integration with port DCS and safety systems per Adani standards`
  },
  {
    id: "6",
    name: "Tata Steel Plant",
    client: "Tata Steel",
    location: "Jamshedpur, Jharkhand",
    equipmentCount: 28,
    activeEquipment: 25,
    progress: 80,
    status: "active" as const,
    manager: "Arun Kumar",
    deadline: "Feb 2025",
    poNumber: "TATA-2024-SP-018",
    equipmentBreakdown: {
      pressureVessel: 8,
      heatExchanger: 7,
      reactor: 4,
      storageTank: 9
    },
    servicesIncluded: ["Design & Engineering", "Manufacturing & Fabrication", "Quality Testing & Inspection", "Documentation & Certification", "Installation Support", "Commissioning & Startup"],
    scopeOfWork: "Comprehensive steel plant equipment manufacturing project for Tata Steel's Jamshedpur facility. Includes design and fabrication of pressure vessels, heat exchangers, reactor systems, and storage tanks for steel manufacturing processes. Project encompasses full engineering services, fabrication, testing, and commissioning support for high-temperature steel applications.",
    // Additional detailed fields
    salesOrderDate: "2024-02-15",
    clientIndustry: "Steel Manufacturing & Processing",
    projectDescription: "Major steel plant expansion project at Tata Steel's Jamshedpur facility for increased steel production capacity. The project involves manufacturing 28 critical equipment units including pressure vessels, heat exchangers, reactors, and storage systems designed for high-temperature steel manufacturing processes and corrosive environments.",
    consultant: "Tata Consulting Engineers",
    tpiAgency: "Lloyd's Register India",
    clientFocalPoint: "Mr. Sanjay Verma - Deputy General Manager (Projects), Tata Steel",
    vdcrManager: "Sarah Johnson",
    unpricedPOFile: { name: "Tata_Steel_Agreement_2024.pdf", uploaded: true, type: "application/pdf" },
    designInputsPID: { name: "Steel_Plant_Process_Design_Rev_C.pdf", uploaded: true, type: "application/pdf" },
    clientReferenceDoc: { name: "Tata_Steel_Technical_Specs.pdf", uploaded: true, type: "application/pdf" },
    otherDocuments: [
      { name: "Steel_Industry_Standards.pdf", uploaded: true, type: "application/pdf" },
      { name: "Environmental_Compliance_Steel.pdf", uploaded: true, type: "application/pdf" },
      { name: "Quality_Management_Steel.pdf", uploaded: true, type: "application/pdf" }
    ],
    kickoffMeetingNotes: `Project kickoff meeting - February 20, 2024:

• Steel plant expansion with 28 major equipment units to be delivered
• Delivery schedule phased over 15 months with first equipment delivery by May 2024
• Strict adherence to steel industry standards and Tata Steel specifications
• All equipment to comply with steel manufacturing standards and high-temperature requirements
• Monthly progress review meetings with Tata Steel project team and consulting engineers
• Factory inspection protocols established with Tata Steel QA team site visits
• Special emphasis on high-temperature resistance and corrosion protection
• Installation support spans 4 months during plant operations`,
    specialProductionNotes: `Critical specifications for steel plant equipment:

• Materials selection per steel industry standards for high-temperature applications
• All equipment designed for temperatures up to 1200°C and corrosive steel environments
• Specialized refractory linings for high-temperature protection
• Heat treatment requirements per steel industry and Tata Steel specifications
• 100% volumetric examination for all critical pressure-retaining welds
• Hydrostatic testing with appropriate test media for steel applications
• Nitrogen purging and preservation procedures for long-term storage
• Special transportation and lifting procedures for large steel equipment
• Integration with steel plant DCS and safety systems per Tata Steel standards`
  },
  {
    id: "7",
    name: "ONGC Offshore Platform",
    client: "ONGC",
    location: "Mumbai High, Offshore",
    equipmentCount: 15,
    activeEquipment: 15,
    progress: 100,
    status: "completed" as const,
    manager: "Suresh Reddy",
    deadline: "Mar 2024",
    completedDate: "Mar 15, 2024",
    poNumber: "ONGC-2023-OP-022",
    equipmentBreakdown: {
      pressureVessel: 5,
      heatExchanger: 4,
      storageTank: 3,
      other: 3
    },
    servicesIncluded: ["Design", "Manufacturing", "Testing", "Installation", "Commissioning"],
    scopeOfWork: "Offshore platform equipment manufacturing and installation project completed successfully."
  },
  {
    id: "8",
    name: "Hindustan Petroleum Refinery",
    client: "HPCL",
    location: "Vishakhapatnam, AP",
    equipmentCount: 20,
    activeEquipment: 20,
    progress: 100,
    status: "completed" as const,
    manager: "Kavita Desai",
    deadline: "Jan 2024",
    completedDate: "Jan 20, 2024",
    poNumber: "HPCL-2023-RF-025",
    equipmentBreakdown: {
      reactor: 6,
      heatExchanger: 8,
      pressureVessel: 4,
      storageTank: 2
    },
    servicesIncluded: ["Design", "Manufacturing", "Testing", "Documentation", "Installation", "Commissioning"],
    scopeOfWork: "Refinery expansion project with complete equipment manufacturing and commissioning services."
  }
];

interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  equipmentCount: number;
  activeEquipment: number;
  progress: number;
  status: 'active' | 'delayed' | 'on-track' | 'completed';
  manager: string;
  deadline: string;
  completedDate?: string;
  poNumber: string;
  equipmentBreakdown: {
    heatExchanger?: number;
    pressureVessel?: number;
    storageTank?: number;
    reactor?: number;
    other?: number;
  };
  servicesIncluded?: string[];
  scopeOfWork?: string;
}


const mockEquipment = [
  {
    id: "eq1",
    type: "Pressure Vessel",
    tagNumber: "PV-001",
    jobNumber: "JOB-2024-001",
    manufacturingSerial: "PV-001-2024-REL",
    poCdd: "Dec 25, 2025",
    status: "on-track" as const,
    progress: 85,
    progressPhase: "testing" as const,
    location: "Shop Floor A",
    supervisor: "Manoj Singh",
    lastUpdate: "Yesterday 4:30 PM",
    images: [
      pressureVesselImg, // Shell ready - Base structure
      heatExchangerImg,  // Nozzles welded - Different equipment showing welding
      reactorVesselImg,  // Polishing done - Different equipment showing finish
      storageTankImg,    // Testing done - Different equipment showing inspection
      pressureVesselImg  // Ready to dispatch - Back to main equipment
    ],
    nextMilestone: "Final Inspection - Nov 25",
    priority: "high" as const,
    documents: [],
    isBasicInfo: false,
    // Technical specifications
    size: "3.2m x 2.1m",
    weight: "2,850 kg",
    designCode: "ASME VIII Div 1",
    material: "SS 316L",
    workingPressure: "25 bar",
    designTemp: "350°C",
    // Team assignments
    welder: "Rajesh Patel",
    qcInspector: "Priya Sharma",
    projectManager: "Amit Kumar"
  },
  {
    id: "eq2",
    type: "Heat Exchanger",
    tagNumber: "HE-002",
    jobNumber: "JOB-2024-002",
    manufacturingSerial: "HE-002-2024-REL",
    poCdd: "October 2025",
    status: "delayed" as const,
    progress: 45,
    progressPhase: "manufacturing" as const,
    location: "Shop Floor B",
    supervisor: "Sunita Rao",
    lastUpdate: "Today 10:15 AM",
    images: [
      heatExchangerImg,  // Shell ready - Base structure
      storageTankImg,    // Nozzles welded - Different equipment showing welding
      pressureVesselImg, // Polishing done - Different equipment showing finish
      reactorVesselImg,  // Testing done - Different equipment showing inspection
      heatExchangerImg   // Ready to dispatch - Back to main equipment
    ],
    nextMilestone: "Welding Complete - Dec 5",
    priority: "high" as const,
    documents: [],
    isBasicInfo: false,
    // Technical specifications
    size: "4.5m x 1.8m",
    weight: "1,950 kg",
    designCode: "TEMA Class R",
    material: "Carbon Steel",
    workingPressure: "18 bar",
    designTemp: "280°C",
    // Team assignments
    welder: "Vikram Singh",
    qcInspector: "Anita Desai",
    projectManager: "Rajesh Kumar"
  },
  {
    id: "eq3",
    type: "Storage Tank",
    tagNumber: "ST-003",
    jobNumber: "JOB-2024-003",
    manufacturingSerial: "ST-003-2024-REL",
    poCdd: "Aug 8, 2025",
    status: "on-track" as const,
    progress: 70,
    progressPhase: "manufacturing" as const,
    location: "Assembly Area",
    supervisor: "Vikram Joshi",
    lastUpdate: "Today 2:20 PM",
    images: [
      storageTankImg,    // Shell ready - Base structure
      pressureVesselImg, // Nozzles welded - Different equipment showing welding
      heatExchangerImg,  // Polishing done - Different equipment showing finish
      reactorVesselImg,  // Testing done - Different equipment showing inspection
      storageTankImg     // Ready to dispatch - Back to main equipment
    ],
    nextMilestone: "Quality Check - Nov 28",
    priority: "medium" as const,
    documents: [],
    isBasicInfo: false,
    // Technical specifications
    size: "6.0m x 3.5m",
    weight: "4,200 kg",
    designCode: "API 650",
    material: "SS 304",
    workingPressure: "12 bar",
    designTemp: "200°C",
    // Team assignments
    welder: "Suresh Kumar",
    qcInspector: "Meera Patel",
    projectManager: "Priya Sharma"
  },
  {
    id: "eq4",
    type: "Reactor",
    tagNumber: "RV-004",
    jobNumber: "JOB-2024-004",
    manufacturingSerial: "RV-004-2024-REL",
    poCdd: "Jan 10, 2025",
    status: "completed" as const,
    progress: 100,
    progressPhase: "dispatched" as const,
    location: "Completed Bay",
    supervisor: "Deepak Kumar",
    lastUpdate: "2 days ago",
    images: [
      reactorVesselImg,
      reactorVesselImg,
      reactorVesselImg,
      reactorVesselImg,
      reactorVesselImg
    ],
    nextMilestone: "Ready for Dispatch",
    priority: "low" as const,
    documents: [],
    isBasicInfo: false,
    // Technical specifications
    size: "5.2m x 2.8m",
    weight: "3,800 kg",
    designCode: "ASME VIII Div 2",
    material: "Alloy Steel",
    workingPressure: "45 bar",
    designTemp: "450°C",
    // Team assignments
    welder: "Arun Singh",
    qcInspector: "Rahul Verma",
    projectManager: "Vikram Singh"
  },
  // Basic equipment from project creation (only basic info available)
  {
    id: "eq5",
    type: "Heat Exchanger",
    tagNumber: "HE-005",
    jobNumber: "JOB-2024-005",
    manufacturingSerial: "HE-005-2024-REL",
    poCdd: "To be scheduled",
    status: "pending" as const,
    progress: 0,
    progressPhase: "documentation" as const,
    location: "Not Assigned",
    supervisor: "Not Assigned",
    lastUpdate: "Just Created",
    images: [],
    nextMilestone: "Complete Equipment Details",
    priority: "medium" as const,
    documents: [],
    isBasicInfo: true
  },
  {
    id: "eq6",
    type: "Pressure Vessel",
    tagNumber: "PV-006",
    jobNumber: "JOB-2024-006",
    manufacturingSerial: "PV-006-2024-REL",
    poCdd: "To be scheduled",
    status: "pending" as const,
    progress: 0,
    progressPhase: "documentation" as const,
    location: "Not Assigned",
    supervisor: "Not Assigned",
    lastUpdate: "Just Created",
    images: [],
    nextMilestone: "Complete Equipment Details",
    priority: "medium" as const,
    documents: [],
    isBasicInfo: true
  }
];

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedProjectTab, setSelectedProjectTab] = useState<string>("equipment");
  const [projects, setProjects] = useState(mockProjects);
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [equipmentCarouselIndex, setEquipmentCarouselIndex] = useState<Record<string, number>>({});
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  
  // Clean Tab System
  const [activeTab, setActiveTab] = useState<'all' | 'overdue' | 'active' | 'completed'>('all');
  
  // Separate filtered projects for each tab
  const allProjects = filteredProjects;
  const overdueProjects = useMemo(() => {
    return filteredProjects.filter(project => {
      try {
        const deadline = new Date(project.deadline);
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Only show as overdue if past deadline AND not completed
        return diffDays < 0 && project.status !== 'completed';
      } catch (error) {
        return false;
      }
    });
  }, [filteredProjects]);
  
  const activeProjects = useMemo(() => {
    return filteredProjects.filter(project => {
      try {
        const deadline = new Date(project.deadline);
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Active projects: not overdue, not completed, and have a future deadline
        return diffDays >= 0 && project.status !== 'completed';
      } catch (error) {
        return false;
      }
    });
  }, [filteredProjects]);
  
  const completedProjects = useMemo(() => {
    return filteredProjects.filter(project => project.status === 'completed');
  }, [filteredProjects]);
  
  // Current projects to display based on active tab
  const currentProjects = activeTab === 'overdue' ? overdueProjects : 
                         activeTab === 'active' ? activeProjects :
                         activeTab === 'completed' ? completedProjects : 
                         allProjects;
  
  // Mock VDCR data for ProjectDetails
  const mockVDCRData = [
    {
      id: "1",
      srNo: "001",
      equipmentTagNo: ["HE-UNIT-001"],
      mfgSerialNo: ["HE-001-2024-REL"],
      jobNo: ["JOB-2024-001"],
      clientDocNo: "REL-HE-001-GA-001",
      internalDocNo: "INT-GA-HE-001-2024",
      documentName: "General Assembly Drawing",
      revision: "Rev-02",
      codeStatus: "Code 2",
      status: "approved" as const,
      lastUpdate: "Jul 10, 2024",
      remarks: "General assembly drawing for heat exchanger unit",
      updatedBy: "John Doe",
      documentUrl: "/documents/vdcr/HE-001-GA-001.pdf"
    },
    {
      id: "2",
      srNo: "002",
      equipmentTagNo: ["HE-UNIT-001", "HE-UNIT-002", "HE-UNIT-003"],
      mfgSerialNo: ["HE-001-2024-REL", "HE-002-2024-REL", "HE-003-2024-REL"],
      jobNo: ["JOB-2024-001", "JOB-2024-002", "JOB-2024-003"],
      clientDocNo: "REL-HE-ALL-PQP-001",
      internalDocNo: "INT-PQP-HE-ALL-2024",
      documentName: "Project Quality Plan",
      revision: "Rev-01",
      codeStatus: "Code 3",
      status: "sent-for-approval" as const,
      lastUpdate: "Jul 12, 2024",
      remarks: "Quality plan covering all heat exchanger units",
      updatedBy: "Sarah Wilson",
      documentUrl: "/documents/vdcr/HE-ALL-PQP-001.docx"
    },
    {
      id: "3",
      srNo: "003",
      equipmentTagNo: ["HE-UNIT-001", "HE-UNIT-002", "HE-UNIT-003", "HE-UNIT-004", "HE-UNIT-005"],
      mfgSerialNo: ["HE-001-2024-REL", "HE-002-2024-REL", "HE-003-2024-REL", "HE-004-2024-REL", "HE-005-2024-REL"],
      jobNo: ["JOB-2024-001", "JOB-2024-002", "JOB-2024-003", "JOB-2024-004", "JOB-2024-005"],
      clientDocNo: "REL-HE-ALL-MTC-001",
      internalDocNo: "INT-MTC-HE-ALL-2024",
      documentName: "Material Test Certificate SS 316L Plates",
      revision: "Rev-01",
      codeStatus: "Code 1",
      status: "received-for-comment" as const,
      lastUpdate: "Jul 08, 2024",
      remarks: "Material test certificates for SS 316L plates",
      updatedBy: "Mike Johnson",
      documentUrl: "/documents/vdcr/HE-ALL-MTC-001.pdf"
    },
    {
      id: "4",
      srNo: "004",
      equipmentTagNo: ["HE-UNIT-001", "HE-UNIT-002"],
      mfgSerialNo: ["HE-001-2024-REL", "HE-002-2024-REF"],
      jobNo: ["JOB-2024-001", "JOB-2024-002"],
      clientDocNo: "REL-HE-GRP1-IOM-001",
      internalDocNo: "INT-IOM-HE-GRP1-2024",
      documentName: "Installation & Operation Manual - Group 1",
      revision: "Rev-00",
      codeStatus: "Code 4",
      status: "sent-for-approval" as const,
      lastUpdate: "Jul 14, 2024",
      remarks: "Installation manual for group 1 heat exchangers",
      updatedBy: "Lisa Chen",
      documentUrl: "/documents/vdcr/HE-GRP1-IOM-001.pdf"
    },
    {
      id: "5",
      srNo: "005",
      equipmentTagNo: ["HE-UNIT-001", "HE-UNIT-002", "HE-UNIT-003", "HE-UNIT-004"],
      mfgSerialNo: ["HE-001-2024-REL", "HE-002-2024-REL", "HE-003-2024-REL", "HE-004-2024-REL"],
      jobNo: ["JOB-2024-001", "JOB-2024-002", "JOB-2024-003", "JOB-2024-004"],
      clientDocNo: "REL-HE-ALL-WPS-001",
      internalDocNo: "INT-WPS-HE-ALL-2024",
      documentName: "Welding Procedure Specification - All Heat Exchanger",
      revision: "Rev-02",
      codeStatus: "Code 2",
      status: "approved" as const,
      lastUpdate: "Jul 09, 2024",
      remarks: "Welding procedure specification for all heat exchangers",
      updatedBy: "David Brown",
      documentUrl: "/documents/vdcr/HE-ALL-WPS-001.pdf"
    }
  ];
  
  const [activeFilters, setActiveFilters] = useState({
    client: 'All Clients',
    equipmentType: 'All Equipment',
    status: 'All Status',
    manager: 'All Managers',
    searchQuery: ''
  });

  const totalProjects = activeFilters.client === 'All Clients' && 
                       activeFilters.status === 'All Status' && 
                       activeFilters.manager === 'All Managers' && 
                       activeFilters.equipmentType === 'All Equipment' && 
                       !activeFilters.searchQuery ? projects.length : filteredProjects.length;
  const totalEquipment = (activeFilters.client === 'All Clients' && 
                          activeFilters.status === 'All Status' && 
                          activeFilters.manager === 'All Managers' && 
                          activeFilters.equipmentType === 'All Equipment' && 
                          !activeFilters.searchQuery ? projects : filteredProjects)
                          .reduce((sum, project) => sum + project.equipmentCount, 0);

  const handleSelectProject = (projectId: string, initialTab: string = "equipment") => {
    setSelectedProject(projectId);
    setSelectedProjectTab(initialTab);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setSelectedProjectTab("equipment");
  };

  const handleAddNewProject = (projectData: any) => {
    // Transform the form data to match the project structure
    const newProject = {
      id: projectData.id,
      name: projectData.projectTitle,
      client: projectData.clientName,
      location: projectData.plantLocation || 'TBD',
      equipmentCount: projectData.equipment?.length || 0,
      activeEquipment: projectData.equipment?.length || 0,
      progress: 0, // New projects start at 0%
      status: projectData.status || 'active',
      manager: projectData.projectManager,
      deadline: projectData.completionDate || 'TBD',
      poNumber: projectData.poNumber || 'TBD',
      salesOrderDate: projectData.salesOrderDate || '',
      clientIndustry: projectData.clientIndustry || '',
      scopeOfWork: projectData.scopeDescription || '',
      servicesIncluded: projectData.servicesIncluded ? Object.keys(projectData.servicesIncluded).filter(key => projectData.servicesIncluded[key]) : [],
      consultant: projectData.consultant || '',
      tpiAgency: projectData.tpiAgency || '',
      clientFocalPoint: projectData.clientFocalPoint || '',
      vdcrManager: projectData.vdcrManager || '',
      kickoffMeetingNotes: projectData.kickoffMeetingNotes || '',
      specialProductionNotes: projectData.specialProductionNotes || '',
      equipmentBreakdown: projectData.equipment?.reduce((acc: any, equip: any) => {
        acc[equip.type.toLowerCase().replace(/\s+/g, '')] = equip.count || 1;
        return acc;
      }, {}) || {}
    };

    // Add to projects list
    setProjects(prev => [newProject, ...prev]);
    setFilteredProjects(prev => [newProject, ...prev]);
    
    // Update totals
    const newTotalProjects = projects.length + 1;
    const newTotalEquipment = projects.reduce((sum, project) => sum + project.equipmentCount, 0) + newProject.equipmentCount;
    
    console.log('New project added:', newProject);
    console.log('Updated totals - Projects:', newTotalProjects, 'Equipment:', newTotalEquipment);
  };

  const handleEditProject = (projectId: string) => {
    const projectToEdit = projects.find(p => p.id === projectId);
    if (projectToEdit) {
      // Transform project data to form format
      const editFormData = {
        id: projectToEdit.id,
        projectTitle: projectToEdit.name,
        clientName: projectToEdit.client,
        plantLocation: projectToEdit.location,
        poNumber: projectToEdit.poNumber,
        salesOrderDate: new Date().toISOString().split('T')[0], // Default to today if not available
        completionDate: projectToEdit.deadline,
        clientIndustry: 'Petrochemical', // Default industry
        projectManager: projectToEdit.manager,
        consultant: 'ABC Consultants', // Default consultant
        tpiAgency: 'Bureau Veritas', // Default TPI agency
        clientFocalPoint: projectToEdit.manager, // Use manager as focal point
        vdcrManager: 'Quality Team Lead', // Default VDCR Manager
        servicesIncluded: {
          design: true, // Default services based on typical project
          manufacturing: true,
          testing: true,
          documentation: true,
          installationSupport: false,
          commissioning: false
        },
        unpricedPOFile: null,
        designInputsPID: null,
        clientReferenceDoc: null,
        otherDocuments: null,
        kickoffMeetingNotes: `Project: ${projectToEdit.name}\nClient: ${projectToEdit.client}\nLocation: ${projectToEdit.location}`,
        specialProductionNotes: ''
      };
      
      setEditingProject(editFormData);
      setShowAddProjectForm(true);
      setEditMode(true);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setFilteredProjects(prev => prev.filter(p => p.id !== projectId));
      console.log('Project deleted:', projectId);
    }
  };

  const handleCompleteProject = (projectId: string) => {
    const completionDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, status: 'completed' as const, completedDate: completionDate }
          : project
      )
    );
    
    setFilteredProjects(prevFilteredProjects => 
      prevFilteredProjects.map(project => 
        project.id === projectId 
          ? { ...project, status: 'completed' as const, completedDate: completionDate }
          : project
      )
    );
  };



  const applyFilters = (filters: any) => {
    setActiveFilters(filters);
    
    let filtered = projects.filter(project => {
      // Client filter
      if (filters.client !== 'All Clients' && project.client !== filters.client) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'All Status' && project.status !== filters.status) {
        return false;
      }
      
      // Manager filter
      if (filters.manager !== 'All Managers' && project.manager !== filters.manager) {
        return false;
      }
      
      // Equipment type filter
      if (filters.equipmentType !== 'All Equipment') {
        const hasEquipmentType = Object.entries(project.equipmentBreakdown).some(([type, count]) => {
          if (count > 0) {
            const normalizedType = type === 'heatExchanger' ? 'Heat Exchanger' :
                                 type === 'pressureVessel' ? 'Pressure Vessel' :
                                 type === 'storageTank' ? 'Storage Tank' :
                                 type === 'reactor' ? 'Reactor' : 'Other';
            return normalizedType === filters.equipmentType;
          }
          return false;
        });
        if (!hasEquipmentType) return false;
      }
      
      // Search query filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          project.name.toLowerCase().includes(searchLower) ||
          project.poNumber.toLowerCase().includes(searchLower) ||
          project.client.toLowerCase().includes(searchLower) ||
          project.location.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      return true;
    });
    
    setFilteredProjects(filtered);
    console.log('Filters applied:', filters, 'Results:', filtered.length);
  };

  const handleUpdateProject = (updatedProjectData: any) => {
    setProjects(prev => prev.map(p => 
      p.id === updatedProjectData.id ? updatedProjectData : p
    ));
    setFilteredProjects(prev => prev.map(p => 
      p.id === updatedProjectData.id ? updatedProjectData : p
    ));
    console.log('Project updated:', updatedProjectData);
    setShowAddProjectForm(false);
    setEditMode(false);
    setEditingProject(null);
  };


  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Project Management Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor project progress, equipment status, and key activities at a glance
          </p>
        </div>

        {!selectedProject ? (
          <>
            {/* Enhanced Summary Section */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Projects</p>
                      <p className="text-4xl font-bold text-white mt-2">{totalProjects}</p>
                      <p className="text-blue-200 text-sm mt-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Active engineering projects
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide">Total Equipment</p>
                      <p className="text-4xl font-bold text-white mt-2">{totalEquipment}</p>
                      <p className="text-emerald-200 text-sm mt-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Manufacturing equipment
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Project Filters */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-800">Project Filters & Actions</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={() => setShowAddProjectForm(true)} className="bg-blue-600 hover:bg-blue-700">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Project
                    </Button>
                    <svg 
                      className={`w-5 h-5 text-gray-600 transition-transform ${filtersExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {filtersExpanded && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <ProjectFilters 
                      onFilterChange={(filters) => console.log('Filters changed:', filters)}
                      onAddNewProject={handleAddNewProject}
                      onApplyFilters={applyFilters}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Project Overview */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Projects Overview</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Showing {currentProjects.length} of {totalProjects} projects</span>
                </div>
              </div>

              {/* Clean Tab System */}
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'all'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      All Projects ({allProjects.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('active')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'active'
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Active Projects ({activeProjects.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('overdue')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'overdue'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Overdue Projects ({overdueProjects.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('completed')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'completed'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      Completed Projects ({completedProjects.length})
                    </button>
                  </nav>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentProjects.map((project, index) => {
                  const deadline = new Date(project.deadline);
                  const today = new Date();
                  const diffTime = deadline.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  // Only consider overdue if not completed and past deadline
                  const isOverdue = diffDays < 0 && project.status !== 'completed';

                  return (
                    <div key={project.id} className={`bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] border transition-all duration-300 overflow-hidden group cursor-pointer ${
                      isOverdue 
                        ? 'border-red-200 hover:border-red-300 hover:shadow-[0_4px_16px_rgba(239,68,68,0.15),0_2px_8px_rgba(239,68,68,0.1)]' 
                        : 'border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_25px_rgba(0,0,0,0.12),0_4px_10px_rgba(0,0,0,0.08)]'
                    }`}>
                      {/* Premium White Header with Neumorphic Effect */}
                      <div className="h-24 bg-white p-4 text-gray-800 border-b border-gray-100 relative group-hover:shadow-inner transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),inset_0_-1px_0_0_rgba(0,0,0,0.05)]">
                        {/* Click Indicator */}
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        
                        <div className="flex items-start justify-between h-full">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{project.name}</h3>
                            <p className="text-xs text-blue-600 font-medium mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Click to view details →
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {project.client}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {project.location}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {/* Days Counter / Completion Status */}
                            <div className="text-right">
                              {project.status === 'completed' ? (
                                <>
                                  <div className="text-xs text-gray-500 mb-1">Completed on</div>
                                  <div className="text-lg font-bold text-green-600">
                                    {project.completedDate || new Date().toLocaleDateString()}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="text-xs text-gray-500 mb-1">Days to Completion Date</div>
                                  <div className={`text-lg font-bold ${
                                    isOverdue ? 'text-red-600' : 'text-blue-600'
                                  }`}>
                                    {(() => {
                                      if (diffDays < 0) {
                                        return <span className="text-red-600">{Math.abs(diffDays)} days overdue</span>;
                                      } else if (diffDays === 0) {
                                        return <span className="text-orange-600">Due today</span>;
                                      } else {
                                        return <span>{diffDays} days to go</span>;
                                      }
                                    })()}
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {/* Edit & Delete Buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditProject(project.id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit Project"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProject(project.id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete Project"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                              {project.status !== 'completed' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCompleteProject(project.id);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                  title="Mark as Completed"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Project Details Grid */}
                      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-blue-50">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
                            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">Project Manager</span>
                            <p className="font-semibold text-gray-800 mt-1">{project.manager}</p>
                          </div>
                          <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
                            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">PO Number</span>
                            <p className="font-semibold text-gray-800 mt-1">{project.poNumber}</p>
                          </div>
                          <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
                            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">Completion Date</span>
                            <p className="font-semibold text-gray-800 mt-1">{project.deadline}</p>
                          </div>
                          <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
                            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">Equipment</span>
                            <p className="font-semibold text-gray-800 mt-1">{project.equipmentCount} units</p>
                          </div>
                        </div>
                      </div>

                      {/* Equipment Breakdown Section */}
                      <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-l-4 border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Equipment Breakdown
                          </span>
                          <span className="text-sm font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                            {project.equipmentCount} units
                          </span>
                        </div>
                        
                        {/* Equipment Type Breakdown with Carousel */}
                        <div className="relative">
                          <div className="grid grid-cols-2 gap-3">
                            {(() => {
                              const equipmentTypes = [
                                { name: 'Pressure Vessels', count: 2, color: 'blue' },
                                { name: 'Heat Exchangers', count: 3, color: 'green' },
                                { name: 'Reactors', count: 1, color: 'purple' },
                                { name: 'Storage Tanks', count: 2, color: 'orange' },
                                { name: 'Pumps', count: 4, color: 'indigo' },
                                { name: 'Compressors', count: 2, color: 'pink' },
                                { name: 'Valves', count: 6, color: 'teal' },
                                { name: 'Piping', count: 3, color: 'amber' }
                              ];
                              
                              const currentIndex = equipmentCarouselIndex[project.id] || 0;
                              const visibleEquipment = equipmentTypes.slice(currentIndex, currentIndex + 4);
                              
                              return visibleEquipment.map((equipment, index) => (
                                <div key={index} className="bg-white/70 rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-600">{equipment.name}</span>
                                    <span className={`text-xs font-bold ${
                                      equipment.color === 'blue' ? 'text-blue-800' :
                                      equipment.color === 'green' ? 'text-green-800' :
                                      equipment.color === 'purple' ? 'text-purple-800' :
                                      equipment.color === 'orange' ? 'text-orange-800' :
                                      equipment.color === 'indigo' ? 'text-indigo-800' :
                                      equipment.color === 'pink' ? 'text-pink-800' :
                                      equipment.color === 'teal' ? 'text-teal-800' :
                                      'text-amber-800'
                                    }`}>{equipment.count}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {equipment.color === 'blue' && (
                                      <>
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                                      </>
                                    )}
                                    {equipment.color === 'green' && (
                                      <>
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-300"></div>
                                      </>
                                    )}
                                    {equipment.color === 'purple' && (
                                      <>
                                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-purple-300"></div>
                                      </>
                                    )}
                                    {equipment.color === 'orange' && (
                                      <>
                                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                                      </>
                                    )}
                                    {equipment.color === 'indigo' && (
                                      <>
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-indigo-300"></div>
                                      </>
                                    )}
                                    {equipment.color === 'pink' && (
                                      <>
                                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-pink-300"></div>
                                      </>
                                    )}
                                    {equipment.color === 'teal' && (
                                      <>
                                        <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-teal-300"></div>
                                      </>
                                    )}
                                    {equipment.color === 'amber' && (
                                      <>
                                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-amber-300"></div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                          
                          {/* Carousel Navigation */}
                          {(() => {
                            const totalEquipmentTypes = 8; // Total number of equipment types
                            const currentIndex = equipmentCarouselIndex[project.id] || 0;
                            const hasMorePages = totalEquipmentTypes > 4;
                            
                            if (!hasMorePages) return null;
                            
                            return (
                              <div className="flex items-center justify-center gap-2 mt-4">
                                <button
                                  onClick={() => setEquipmentCarouselIndex(prev => ({
                                    ...prev,
                                    [project.id]: Math.max(0, (prev[project.id] || 0) - 1)
                                  }))}
                                  disabled={currentIndex === 0}
                                  className={`p-1 rounded-full transition-colors ${
                                    currentIndex === 0 
                                      ? 'text-gray-300 cursor-not-allowed' 
                                      : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                                  }`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                
                                <div className="flex gap-1">
                                  {Array.from({ length: Math.ceil(totalEquipmentTypes / 4) }, (_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full transition-colors ${
                                        i === Math.floor(currentIndex / 4) 
                                          ? 'bg-blue-500' 
                                          : 'bg-gray-300'
                                      }`}
                                    ></div>
                                  ))}
                                </div>
                                
                                <button
                                  onClick={() => setEquipmentCarouselIndex(prev => ({
                                    ...prev,
                                    [project.id]: Math.min(
                                      Math.ceil(totalEquipmentTypes / 4) - 1,
                                      (prev[project.id] || 0) + 1
                                    )
                                  }))}
                                  disabled={currentIndex >= totalEquipmentTypes - 4}
                                  className={`p-1 rounded-full transition-colors ${
                                    currentIndex >= totalEquipmentTypes - 4 
                                      ? 'text-gray-300 cursor-not-allowed' 
                                      : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                                  }`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-6 border-t border-gray-100 bg-white">
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSelectProject(project.id, "equipment")}
                            className="flex-1 bg-white hover:bg-blue-50 border-gray-300 text-gray-700 hover:text-blue-700 hover:border-blue-300 font-medium transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            View Equipment
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSelectProject(project.id, "vdcr")}
                            className="flex-1 bg-white hover:bg-green-50 border-gray-300 text-gray-700 hover:text-green-700 hover:border-green-300 font-medium transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View VDCR
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSelectProject(project.id, "project-details")}
                            className="flex-1 bg-white hover:bg-purple-50 border-gray-300 text-gray-700 hover:text-purple-700 hover:border-purple-300 font-medium transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : selectedProject ? (
          <UnifiedProjectView
            projectId={selectedProject}
            projectName={selectedProjectData?.name || "Project"}
            onBack={handleBackToProjects}
            equipment={mockEquipment}
            vdcrData={mockVDCRData}
            projectData={projects.find(p => p.id === selectedProject) || mockProjects[0]}
            initialTab={selectedProjectTab}
          />
        ) : null}
      </div>
      
      {/* Add Project Form Modal */}
      {showAddProjectForm && (
        <AddProjectForm
          onClose={() => {
            setShowAddProjectForm(false);
            setEditMode(false);
            setEditingProject(null);
          }}
          onSubmit={editMode ? handleUpdateProject : handleAddNewProject}
          editData={editMode ? editingProject : null}
          isEditMode={editMode}
        />
      )}
    </div>
  );
};

export default Index;