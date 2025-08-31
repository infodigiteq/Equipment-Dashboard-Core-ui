import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building, FileText, PieChart, Target, BarChart3, Calendar, ClipboardList, AlertTriangle, TrendingUp, Users, Download, Settings } from "lucide-react";
import EquipmentGrid from "./EquipmentGrid";
import ProjectsVDCR from "./ProjectsVDCR";
import ProjectDetails from "./ProjectDetails";

interface UnifiedProjectViewProps {
  projectId: string;
  projectName: string;
  onBack: () => void;
  equipment: any[];
  vdcrData: any[];
  projectData: any;
  initialTab?: string;
}

const UnifiedProjectView = ({ 
  projectId, 
  projectName, 
  onBack, 
  equipment, 
  vdcrData, 
  projectData,
  initialTab = "equipment"
}: UnifiedProjectViewProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Search states
  const [vdcrSearchQuery, setVdcrSearchQuery] = useState("");
  const [equipmentSearchQuery, setEquipmentSearchQuery] = useState("");

  // VDCR Overview states
  const [selectedVDCRStatus, setSelectedVDCRStatus] = useState('approved');

  // Team Management states
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@company.com",
      role: "Project Manager",
      permissions: ["view", "edit", "delete", "manage_team", "approve_vdcr", "manage_equipment"],
      status: "active",
      avatar: "RK",
      lastActive: "2 hours ago",
      equipmentAssignments: ["All Equipment"],
      dataAccess: ["Full Project Access", "Can Edit All Data", "Cannot Edit VDCR"],
      accessLevel: "project_manager"
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@company.com",
      role: "VDCR Manager",
      permissions: ["view", "edit", "approve_vdcr", "manage_vdcr"],
      status: "active",
      avatar: "PS",
      lastActive: "1 day ago",
      equipmentAssignments: ["All Equipment"],
      dataAccess: ["VDCR Tab Access", "Can Edit VDCR", "VDCR Birdview", "VDCR Logs"],
      accessLevel: "vdcr_manager"
    },
    {
      id: 3,
      name: "Amit Patel",
      email: "amit.patel@company.com",
      role: "Design Engineer",
      permissions: ["view", "edit", "manage_equipment"],
      status: "active",
      avatar: "AP",
      lastActive: "3 hours ago",
      equipmentAssignments: ["Heat Exchanger HE-001", "Pressure Vessel PV-003"],
      dataAccess: ["Assigned Equipment Only", "Can Add Progress Images", "Can Add Progress Entries", "Access to VDCR & Other Tabs", "No Access to Settings & Project Details"],
      accessLevel: "editor"
    },
    {
      id: 4,
      name: "Neha Verma",
      email: "neha.verma@company.com",
      role: "Quality Inspector",
      permissions: ["view", "comment"],
      status: "active",
      avatar: "NV",
      lastActive: "5 days ago",
      equipmentAssignments: ["Storage Tank ST-002", "Reactor Vessel RV-001"],
      dataAccess: ["Assigned Equipment Only", "Read-Only Access", "Cannot Edit Data", "Access to VDCR & Other Tabs", "No Access to Settings & Project Details"],
      accessLevel: "viewer"
    }
  ]);

  const [roles, setRoles] = useState([
    {
      name: "Project Manager",
      permissions: ["view", "edit", "delete", "manage_team", "approve_vdcr", "manage_equipment"],
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "Quality Engineer",
      permissions: ["view", "edit", "approve_vdcr", "manage_equipment"],
      color: "bg-green-100 text-green-800"
    },
    {
      name: "Design Engineer",
      permissions: ["view", "edit", "manage_equipment"],
      color: "bg-purple-100 text-purple-800"
    },
    {
      name: "Client Representative",
      permissions: ["view", "comment"],
      color: "bg-orange-100 text-orange-800"
    }
  ]);

  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    role: "",
    permissions: [],
    equipmentAssignments: [],
    dataAccess: [],
    accessLevel: "viewer"
  });

  // Available permissions list
  const availablePermissions = [
    { key: "view", label: "View" },
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
    { key: "manage_team", label: "Manage Team" },
    { key: "approve_vdcr", label: "Approve VDCR" },
    { key: "manage_equipment", label: "Manage Equipment" },
    { key: "comment", label: "Comment" }
  ];

  // Function to handle permission toggle
  const togglePermission = (permissionKey) => {
    setNewMember(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }));
  };

  // VDCR Overview functions
  const calculateVDCRStats = () => {
    return {
      approved: 2,
      underReview: 1,
      sentForApproval: 2,
      rejected: 0
    };
  };

  const getVDCRDocumentsByStatus = (status: string) => {
    if (status === 'approved') {
      return [
        {
          documentName: "General Assembly Drawing Rev Rev-02",
          revision: "Rev-02",
          remarks: "General assembly drawing for heat exchanger unit",
          lastUpdate: "Jul 10, 2024",
          updatedBy: "John Doe",
          daysAgo: "416 days ago",
          documentUrl: "#",
          equipmentTags: ["EQ-013"]
        },
        {
          documentName: "Welding Procedure Specification - All Heat Exchanger Rev Rev-02",
          revision: "Rev-02",
          remarks: "Welding procedure specification for all heat exchangers",
          lastUpdate: "Jul 09, 2024",
          updatedBy: "David Brown",
          daysAgo: "417 days ago",
          documentUrl: "#",
          equipmentTags: ["EQ-011", "EQ-017", "EQ-015"]
        }
      ];
    } else if (status === 'received-for-comment') {
      return [
        {
          documentName: "Quality Control Plan Rev Rev-01",
          revision: "Rev-01",
          remarks: "Quality control procedures and inspection criteria",
          lastUpdate: "Jul 08, 2024",
          updatedBy: "Sarah Wilson",
          daysAgo: "418 days ago",
          documentUrl: "#",
          equipmentTags: ["EQ-008", "EQ-012"]
        }
      ];
    } else if (status === 'sent-for-approval') {
      return [
        {
          documentName: "Material Test Certificate - SS 316L Plates",
          revision: "Rev-00",
          remarks: "Material test certificates for stainless steel plates",
          lastUpdate: "Jul 07, 2024",
          updatedBy: "Michael Chen",
          daysAgo: "419 days ago",
          documentUrl: "#",
          equipmentTags: ["EQ-005", "EQ-009", "EQ-014"]
        },
        {
          documentName: "Installation & Operation Manual - Group 1",
          revision: "Rev-01",
          remarks: "Installation and operation procedures for equipment group 1",
          lastUpdate: "Jul 06, 2024",
          updatedBy: "Lisa Rodriguez",
          daysAgo: "420 days ago",
          documentUrl: "#",
          equipmentTags: ["EQ-001", "EQ-003", "EQ-007"]
        }
      ];
    } else if (status === 'rejected') {
      return []; // No rejected documents
    }
    return [];
  };

  // Export functions
  const exportVDCRLogsToExcel = () => {
    const vdcrData = [
      {
        'Status': 'Approved',
        'Document': 'Project Specification - Technical requirements document',
        'Updated': 'Dec 15, 2024',
        'Time Ago': '2 hours ago',
        'Updated By': 'Quality Manager - Rajesh Kumar'
      },
      {
        'Status': 'Rejected',
        'Document': 'Quality Plan - Quality assurance procedures',
        'Updated': 'Dec 14, 2024',
        'Time Ago': '1 day ago',
        'Updated By': 'Client Engineer - Amit Sharma'
      },
      {
        'Status': 'Received for Comments',
        'Document': 'Unpriced PO - Purchase order details',
        'Updated': 'Dec 12, 2024',
        'Time Ago': '3 days ago',
        'Updated By': 'Project Manager - Priya Sharma'
      },
      {
        'Status': 'Pending',
        'Document': 'Material Test Certificate - SS 316L Plates',
        'Updated': 'Dec 11, 2024',
        'Time Ago': '4 days ago',
        'Updated By': 'Quality Inspector - Vikram Singh'
      },
      {
        'Status': 'Approved',
        'Document': 'Welding Procedure Specification - All Heat Exchangers',
        'Updated': 'Dec 10, 2024',
        'Time Ago': '5 days ago',
        'Updated By': 'Technical Lead - Neha Verma'
      },
      {
        'Status': 'In Progress',
        'Document': 'Installation & Operation Manual - Group 1',
        'Updated': 'Dec 9, 2024',
        'Time Ago': '6 days ago',
        'Updated By': 'Documentation Team - Arun Kumar'
      }
    ];

    exportToExcel(vdcrData, 'VDCR_Logs');
  };

  const exportEquipmentLogsToExcel = () => {
    const equipmentData = [
      {
        'Status': 'In Progress',
        'Equipment': 'Heat Exchanger Manufacturing Started',
        'Unit': 'HE-001 - Production phase initiated',
        'Updated': 'Dec 15, 2024',
        'Time Ago': '4 hours ago',
        'Updated By': 'Production Supervisor - Rajesh Kumar'
      },
      {
        'Status': 'Completed',
        'Equipment': 'Pressure Vessel Testing Completed',
        'Unit': 'PV-003 - All tests passed successfully',
        'Updated': 'Dec 14, 2024',
        'Time Ago': '1 day ago',
        'Updated By': 'Testing Engineer - Priya Sharma'
      },
      {
        'Status': 'Ready',
        'Equipment': 'Storage Tank Ready for Dispatch',
        'Unit': 'ST-002 - Packaged and ready for shipping',
        'Updated': 'Dec 13, 2024',
        'Time Ago': '2 days ago',
        'Updated By': 'Logistics Coordinator - Vikram Singh'
      },
      {
        'Status': 'Complete',
        'Equipment': 'Reactor Vessel Assembly Complete',
        'Unit': 'RV-001 - All components assembled',
        'Updated': 'Dec 12, 2024',
        'Time Ago': '3 days ago',
        'Updated By': 'Assembly Team Lead - Neha Verma'
      },
      {
        'Status': 'Inspection',
        'Equipment': 'Storage Tank Quality Check',
        'Unit': 'ST-003 - Under quality inspection',
        'Updated': 'Dec 11, 2024',
        'Time Ago': '4 days ago',
        'Updated By': 'Quality Inspector - Arun Kumar'
      },
      {
        'Status': 'Testing',
        'Equipment': 'Heat Exchanger Pressure Testing',
        'Unit': 'HE-002 - Pressure test in progress',
        'Updated': 'Dec 10, 2024',
        'Time Ago': '5 days ago',
        'Updated By': 'Testing Engineer - Amit Patel'
      }
    ];

    exportToExcel(equipmentData, 'Equipment_Logs');
  };

  const exportToExcel = (data: any[], filename: string) => {
    // Convert data to CSV format
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Team Management functions
  const addTeamMember = () => {
    if (newMember.name && newMember.email && newMember.position && newMember.role && newMember.equipmentAssignments?.length) {
      const role = roles.find(r => r.name === newMember.role);
      const member = {
        id: Date.now(),
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone || "",
        position: newMember.position,
        role: newMember.role,
        permissions: role ? role.permissions : [],
        status: "active",
        avatar: newMember.name.split(' ').map(n => n[0]).join(''),
        lastActive: "Just now",
        equipmentAssignments: newMember.equipmentAssignments || [],
        dataAccess: newMember.dataAccess || [],
        accessLevel: newMember.accessLevel || "viewer"
      };
      setTeamMembers([...teamMembers, member]);
      setNewMember({ name: "", email: "", phone: "", position: "", role: "", permissions: [], equipmentAssignments: [], dataAccess: [], accessLevel: "viewer" });
      setShowAddMember(false);
    }
  };

  const editTeamMember = (member) => {
    setSelectedMember(member);
    setNewMember({
      name: member.name,
      email: member.email,
      role: member.role,
      permissions: member.permissions,
      equipmentAssignments: member.equipmentAssignments || [],
      dataAccess: member.dataAccess || [],
      accessLevel: member.accessLevel || "viewer"
    });
    setShowEditMember(true);
  };

  const updateTeamMember = () => {
    if (selectedMember && newMember.name && newMember.email && newMember.role) {
      const role = roles.find(r => r.name === newMember.role);
      const updatedMembers = teamMembers.map(member =>
        member.id === selectedMember.id
          ? {
              ...member,
              name: newMember.name,
              email: newMember.email,
              role: newMember.role,
              permissions: role ? role.permissions : member.permissions,
              avatar: newMember.name.split(' ').map(n => n[0]).join(''),
              equipmentAssignments: newMember.equipmentAssignments || member.equipmentAssignments || [],
              dataAccess: newMember.dataAccess || member.dataAccess || [],
              accessLevel: newMember.accessLevel || member.accessLevel || "viewer"
            }
          : member
      );
      setTeamMembers(updatedMembers);
      setShowEditMember(false);
      setSelectedMember(null);
      setNewMember({ name: "", email: "", role: "", permissions: [], equipmentAssignments: [], dataAccess: [], accessLevel: "viewer" });
    }
  };

  const removeTeamMember = (memberId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    }
  };

  const toggleMemberStatus = (memberId) => {
    setTeamMembers(teamMembers.map(member =>
      member.id === memberId
        ? { ...member, status: member.status === "active" ? "inactive" : "active" }
        : member
    ));
  };

  const getPermissionLabel = (permission) => {
    const labels = {
      view: "View",
      edit: "Edit",
      delete: "Delete",
      manage_team: "Manage Team",
      approve_vdcr: "Approve VDCR",
      manage_equipment: "Manage Equipment",
      comment: "Comment"
    };
    return labels[permission] || permission;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-3 px-6 py-3 text-base font-semibold text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border-2 border-gray-300 hover:border-blue-600 transition-all duration-300 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Button>
        </div>

        {/* Main Overview Card - Common for All Tabs */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {projectName}
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Project Management & Equipment Tracking
              </p>
            </div>
          </div>
          
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Project Status</p>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-blue-800">Active</div>
                  </div>
                </div>
                <Target size={24} className="text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Equipment Progress</p>
                  <div className="text-2xl font-bold text-green-800">18 / 24</div>
                  <p className="text-sm text-green-600">Active / Total</p>
                </div>
                <BarChart3 size={24} className="text-green-500" />
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">VDCR Documents</p>
                  <div className="text-2xl font-bold text-purple-800">24</div>
                  <p className="text-sm text-purple-600">Total Records</p>
                </div>
                <FileText size={24} className="text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Deadline</p>
                  <div className="text-2xl font-bold text-orange-800">Dec 15, 2025</div>
                  <p className="text-sm text-orange-600">Target Date</p>
                </div>
                <Calendar size={24} className="text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Unified Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-16 bg-transparent rounded-2xl p-2">
            <TabsTrigger 
              value="equipment" 
              className="flex items-center gap-3 px-4 py-4 text-sm font-semibold bg-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl hover:bg-gray-200 data-[state=active]:hover:from-blue-600 data-[state=active]:hover:to-blue-700"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Building size={20} className="text-blue-600 data-[state=active]:text-white" />
              </div>
              <span>Equipment</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="vdcr" 
              className="flex items-center gap-3 px-4 py-4 text-sm font-semibold bg-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl hover:bg-gray-200 data-[state=active]:hover:from-green-600 data-[state=active]:hover:to-green-700"
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <FileText size={20} className="text-green-600 data-[state=active]:text-white" />
              </div>
              <span>VDCR</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="vdcr-overview" 
              className="flex items-center gap-3 px-4 py-4 text-sm font-semibold bg-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl hover:bg-gray-200 data-[state=active]:hover:from-teal-600 data-[state=active]:hover:to-teal-700"
            >
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <BarChart3 size={20} className="text-teal-600 data-[state=active]:text-white" />
              </div>
              <span>VDCR Birdview</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="progress-logs" 
              className="flex items-center gap-3 px-4 py-4 text-sm font-semibold bg-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl hover:bg-gray-200 data-[state=active]:hover:from-purple-600 data-[state=active]:hover:to-purple-700"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <TrendingUp size={20} className="text-purple-600 data-[state=active]:text-white" />
              </div>
              <span>Project Chronology</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="project-details" 
              className="flex items-center gap-3 px-4 py-4 text-sm font-semibold bg-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl hover:bg-gray-200 data-[state=active]:hover:from-orange-600 data-[state=active]:hover:to-orange-700"
            >
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Users size={20} className="text-orange-600 data-[state=active]:text-white" />
              </div>
              <span>Project Details</span>
            </TabsTrigger>

            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-3 px-4 py-4 text-sm font-semibold bg-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl hover:bg-gray-200 data-[state=active]:hover:from-gray-600 data-[state=active]:hover:to-gray-700"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Settings size={20} className="text-gray-600 data-[state=active]:text-white" />
              </div>
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                  <Building size={24} className="text-blue-600" />
                  Equipment Management
                </h2>
                <p className="text-blue-600 text-sm mt-1">Manage and track all project equipment</p>
              </div>
              <div className="p-6">
                <EquipmentGrid
                  equipment={equipment}
                  projectName={projectName}
                  onBack={onBack}
                  onViewDetails={() => setActiveTab("project-details")}
                  onViewVDCR={() => setActiveTab("vdcr")}
                />
              </div>
            </div>
          </TabsContent>

          {/* VDCR Tab */}
          <TabsContent value="vdcr" className="space-y-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
                <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                  <FileText size={24} className="text-green-600" />
                  VDCR Management
                </h2>
                <p className="text-green-600 text-sm mt-1">Handle all VDCR records and approvals</p>
              </div>
              <div className="p-6">
                <ProjectsVDCR
                  projectName={projectName}
                  onBack={onBack}
                  onViewDetails={() => setActiveTab("project-details")}
                  onViewEquipment={() => setActiveTab("equipment")}
                />
              </div>
            </div>
          </TabsContent>

          {/* VDCR Overview Tab */}
          <TabsContent value="vdcr-overview" className="space-y-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 px-6 py-4 border-b border-teal-200">
                <h2 className="text-xl font-semibold text-teal-800 flex items-center gap-2">
                  <BarChart3 size={24} className="text-teal-600" />
                  VDCR Overview
                </h2>
                <p className="text-teal-600 text-sm mt-1">Summary and key metrics for VDCR documents</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* VDCR Status Overview with Tabs */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <FileText size={24} className="mr-3 text-blue-600" />
                      VDCR Status Overview
                    </h2>
                    
                    {/* VDCR Status Tabs */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="VDCR Status Tabs">
                          <button
                            onClick={() => setSelectedVDCRStatus('approved')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                              selectedVDCRStatus === 'approved'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            Approved Documents
                            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {calculateVDCRStats().approved}
                            </span>
                          </button>
                          
                          <button
                            onClick={() => setSelectedVDCRStatus('received-for-comment')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                              selectedVDCRStatus === 'received-for-comment'
                                ? 'border-yellow-500 text-yellow-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            Received for Comments
                            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {calculateVDCRStats().underReview}
                            </span>
                          </button>
                          
                          <button
                            onClick={() => setSelectedVDCRStatus('sent-for-approval')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                              selectedVDCRStatus === 'sent-for-approval'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            Sent for Approval
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {calculateVDCRStats().sentForApproval}
                            </span>
                          </button>
                          
                          <button
                            onClick={() => setSelectedVDCRStatus('rejected')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                              selectedVDCRStatus === 'rejected'
                                ? 'border-red-500 text-red-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            Rejected Documents
                            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {calculateVDCRStats().rejected}
                            </span>
                          </button>
                        </nav>
                      </div>
                      
                      {/* Tab Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-700">
                            {selectedVDCRStatus === 'approved' && 'Approved Documents'}
                            {selectedVDCRStatus === 'received-for-comment' && 'Documents Received for Comments'}
                            {selectedVDCRStatus === 'sent-for-approval' && 'Documents Sent for Approval'}
                            {selectedVDCRStatus === 'rejected' && 'Rejected Documents'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {getVDCRDocumentsByStatus(selectedVDCRStatus).length} document{getVDCRDocumentsByStatus(selectedVDCRStatus).length !== 1 ? 's' : ''} found
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          {getVDCRDocumentsByStatus(selectedVDCRStatus).map((doc, index) => (
                            <div key={index} className="relative p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                              {/* Days Ago Counter - Absolute Top Right */}
                              <div className="absolute top-2 right-2">
                                <div className="flex flex-col items-end gap-2">
                                  <span className="inline-flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {doc.daysAgo}
                                  </span>
                                  
                                  {/* Preview Button - Under Days Counter */}
                                  {doc.documentUrl && (
                                    <button
                                      className="flex items-center gap-2 px-2.5 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors border border-blue-200 hover:border-blue-300 text-sm font-medium shadow-sm hover:shadow-md"
                                      title="Click to preview document"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      Preview
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <div className={`w-3 h-3 rounded-full mt-1 ${
                                  selectedVDCRStatus === 'approved' ? 'bg-green-500' :
                                  selectedVDCRStatus === 'received-for-comment' ? 'bg-yellow-500' :
                                  selectedVDCRStatus === 'sent-for-approval' ? 'bg-blue-500' :
                                  'bg-red-500'
                                }`}></div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-medium text-gray-800">{doc.documentName}</p>
                                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Rev {doc.revision}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-2">{doc.remarks}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      {doc.lastUpdate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      {doc.updatedBy}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Action Buttons - Bottom Section */}
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                                {/* Equipment Tag - Bottom Left */}
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span className="text-xs text-gray-500 font-medium">Equipment:</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {doc.equipmentTags.map((tag, tagIndex) => (
                                      <span 
                                        key={tagIndex} 
                                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-300"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Action Buttons - Bottom Right */}
                                <div className="flex items-center gap-2">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    selectedVDCRStatus === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                                    selectedVDCRStatus === 'received-for-comment' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                    selectedVDCRStatus === 'sent-for-approval' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                    'bg-red-100 text-red-800 border border-red-200'
                                  }`}>
                                    {selectedVDCRStatus === 'approved' ? 'Approved' :
                                     selectedVDCRStatus === 'received-for-comment' ? 'Received for Comments' :
                                     selectedVDCRStatus === 'sent-for-approval' ? 'Sent for Approval' :
                                     'Rejected'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {getVDCRDocumentsByStatus(selectedVDCRStatus).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <p className="text-sm">No documents found in this category</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Progress Logs Tab */}
          <TabsContent value="progress-logs" className="space-y-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                <h2 className="text-xl font-semibold text-purple-800 flex items-center gap-2">
                  <TrendingUp size={24} className="text-purple-600" />
                  Progress Logs
                </h2>
                <p className="text-purple-600 text-sm mt-1">Track project progress updates and milestones</p>
              </div>
              <div className="p-6">
                {/* Progress Logs Subtabs */}
                <Tabs defaultValue="vdcr-logs" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent rounded-xl p-2">
                    <TabsTrigger 
                      value="vdcr-logs" 
                      className="flex items-center gap-3 px-6 py-3 text-sm font-semibold bg-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl hover:bg-gray-200 data-[state=active]:hover:from-purple-600 data-[state=active]:hover:to-purple-700 group"
                    >
                      <FileText size={18} className="text-purple-600 group-data-[state=active]:text-white transition-colors duration-200" />
                      VDCR Logs
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="equipment-logs" 
                      className="flex items-center gap-3 px-6 py-3 text-sm font-semibold bg-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl hover:bg-gray-200 data-[state=active]:hover:from-purple-600 data-[state=active]:hover:to-purple-700 group"
                    >
                      <Building size={18} className="text-purple-600 group-data-[state=active]:text-white transition-colors duration-200" />
                      Equipment Logs
                    </TabsTrigger>
                  </TabsList>

                  {/* VDCR Logs Subtab */}
                  <TabsContent value="vdcr-logs" className="space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                          <FileText size={20} className="text-purple-600" />
                          VDCR Activity Log
                        </h3>
                        <Button
                          onClick={exportVDCRLogsToExcel}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800 hover:border-purple-300 transition-all duration-200"
                        >
                          <Download size={16} />
                          Export to Excel
                        </Button>
                      </div>

                      {/* Search Bar */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search VDCR logs by document, status, or user..."
                          value={vdcrSearchQuery}
                          onChange={(e) => setVdcrSearchQuery(e.target.value)}
                          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        {vdcrSearchQuery && (
                          <button
                            onClick={() => setVdcrSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                    <div className="space-y-4">
                        {/* Filtered VDCR Logs */}
                        {(() => {
                          const vdcrLogs = [
                            {
                              id: 1,
                              status: 'Approved',
                              document: 'Project Specification - Technical requirements document',
                              updated: 'Dec 15, 2024',
                              timeAgo: '2 hours ago',
                              updatedBy: 'Quality Manager - Rajesh Kumar'
                            },
                            {
                              id: 2,
                              status: 'Rejected',
                              document: 'Quality Plan - Quality assurance procedures',
                              updated: 'Dec 14, 2024',
                              timeAgo: '1 day ago',
                              updatedBy: 'Client Engineer - Amit Sharma'
                            },
                            {
                              id: 3,
                              status: 'Received for Comments',
                              document: 'Unpriced PO - Purchase order details',
                              updated: 'Dec 12, 2024',
                              timeAgo: '3 days ago',
                              updatedBy: 'Project Manager - Priya Sharma'
                            },
                            {
                              id: 4,
                              status: 'Pending',
                              document: 'Material Test Certificate - SS 316L Plates',
                              updated: 'Dec 11, 2024',
                              timeAgo: '4 days ago',
                              updatedBy: 'Quality Inspector - Vikram Singh'
                            },
                            {
                              id: 5,
                              status: 'Approved',
                              document: 'Welding Procedure Specification - All Heat Exchangers',
                              updated: 'Dec 10, 2024',
                              timeAgo: '5 days ago',
                              updatedBy: 'Technical Lead - Neha Verma'
                            },
                            {
                              id: 6,
                              status: 'In Progress',
                              document: 'Installation & Operation Manual - Group 1',
                              updated: 'Dec 9, 2024',
                              timeAgo: '6 days ago',
                              updatedBy: 'Documentation Team - Arun Kumar'
                            }
                          ];

                          const filteredLogs = vdcrSearchQuery
                            ? vdcrLogs.filter(log =>
                                log.document.toLowerCase().includes(vdcrSearchQuery.toLowerCase()) ||
                                log.status.toLowerCase().includes(vdcrSearchQuery.toLowerCase()) ||
                                log.updatedBy.toLowerCase().includes(vdcrSearchQuery.toLowerCase()) ||
                                log.updated.toLowerCase().includes(vdcrSearchQuery.toLowerCase())
                              )
                            : vdcrLogs;

                          if (filteredLogs.length === 0) {
                            return (
                              <div className="text-center py-8 text-gray-500">
                                <FileText size={32} className="mx-auto mb-2 text-gray-300" />
                                <p>No VDCR logs match the search criteria.</p>
                                <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms.</p>
                              </div>
                            );
                          }

                          return (
                            <div className="max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                              {filteredLogs.map((log) => (
                                <div key={log.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                  <div className={`w-3 h-3 rounded-full ${
                                    log.status === 'Approved' ? 'bg-green-500' :
                                    log.status === 'Rejected' ? 'bg-red-500' :
                                    log.status === 'Received for Comments' ? 'bg-yellow-500' :
                                    log.status === 'Pending' ? 'bg-blue-500' :
                                    log.status === 'In Progress' ? 'bg-purple-500' : 'bg-gray-500'
                                  }`}></div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">VDCR Document {log.status}</p>
                                    <p className="text-xs text-gray-500">{log.document}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                      <p className="text-xs text-gray-400">Updated: {log.updated} | {log.timeAgo}</p>
                                      <p className="text-xs text-blue-600 font-medium">Updated by: {log.updatedBy}</p>
                                    </div>
                                  </div>
                                  <div className={`text-xs font-medium px-3 py-1 rounded-full border ${
                                    log.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                    log.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                    log.status === 'Received for Comments' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                    log.status === 'Pending' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                    log.status === 'In Progress' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                                  }`}>
                                    {log.status}
                        </div>
                        </div>
                              ))}
                        </div>
                          );
                        })()}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Equipment Logs Subtab */}
                  <TabsContent value="equipment-logs" className="space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                          <Building size={20} className="text-purple-600" />
                          Equipment Activity Log
                        </h3>
                        <Button
                          onClick={exportEquipmentLogsToExcel}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800 hover:border-purple-300 transition-all duration-200"
                        >
                          <Download size={16} />
                          Export to Excel
                        </Button>
                      </div>

                      {/* Search Bar */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search equipment logs by unit, status, or user..."
                          value={equipmentSearchQuery}
                          onChange={(e) => setEquipmentSearchQuery(e.target.value)}
                          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        {equipmentSearchQuery && (
                          <button
                            onClick={() => setEquipmentSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                    </div>
                    
                    <div className="space-y-4">
                        {/* Filtered Equipment Logs */}
                        {(() => {
                          const equipmentLogs = [
                            {
                              id: 1,
                              status: 'In Progress',
                              equipment: 'Heat Exchanger Manufacturing Started',
                              unit: 'HE-001 - Production phase initiated',
                              updated: 'Dec 15, 2024',
                              timeAgo: '4 hours ago',
                              updatedBy: 'Production Supervisor - Rajesh Kumar'
                            },
                            {
                              id: 2,
                              status: 'Completed',
                              equipment: 'Pressure Vessel Testing Completed',
                              unit: 'PV-003 - All tests passed successfully',
                              updated: 'Dec 14, 2024',
                              timeAgo: '1 day ago',
                              updatedBy: 'Testing Engineer - Priya Sharma'
                            },
                            {
                              id: 3,
                              status: 'Ready',
                              equipment: 'Storage Tank Ready for Dispatch',
                              unit: 'ST-002 - Packaged and ready for shipping',
                              updated: 'Dec 13, 2024',
                              timeAgo: '2 days ago',
                              updatedBy: 'Logistics Coordinator - Vikram Singh'
                            },
                            {
                              id: 4,
                              status: 'Complete',
                              equipment: 'Reactor Vessel Assembly Complete',
                              unit: 'RV-001 - All components assembled',
                              updated: 'Dec 12, 2024',
                              timeAgo: '3 days ago',
                              updatedBy: 'Assembly Team Lead - Neha Verma'
                            },
                            {
                              id: 5,
                              status: 'Inspection',
                              equipment: 'Storage Tank Quality Check',
                              unit: 'ST-003 - Under quality inspection',
                              updated: 'Dec 11, 2024',
                              timeAgo: '4 days ago',
                              updatedBy: 'Quality Inspector - Arun Kumar'
                            },
                            {
                              id: 6,
                              status: 'Testing',
                              equipment: 'Heat Exchanger Pressure Testing',
                              unit: 'HE-002 - Pressure test in progress',
                              updated: 'Dec 10, 2024',
                              timeAgo: '5 days ago',
                              updatedBy: 'Testing Engineer - Amit Patel'
                            }
                          ];

                          const filteredLogs = equipmentSearchQuery
                            ? equipmentLogs.filter(log =>
                                log.equipment.toLowerCase().includes(equipmentSearchQuery.toLowerCase()) ||
                                log.unit.toLowerCase().includes(equipmentSearchQuery.toLowerCase()) ||
                                log.status.toLowerCase().includes(equipmentSearchQuery.toLowerCase()) ||
                                log.updatedBy.toLowerCase().includes(equipmentSearchQuery.toLowerCase()) ||
                                log.updated.toLowerCase().includes(equipmentSearchQuery.toLowerCase())
                              )
                            : equipmentLogs;

                          if (filteredLogs.length === 0) {
                            return (
                              <div className="text-center py-8 text-gray-500">
                                <Building size={32} className="mx-auto mb-2 text-gray-300" />
                                <p>No equipment logs match the search criteria.</p>
                                <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms.</p>
                              </div>
                            );
                          }

                          return (
                            <div className="max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                              {filteredLogs.map((log) => (
                                <div key={log.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                  <div className={`w-3 h-3 rounded-full ${
                                    log.status === 'In Progress' ? 'bg-blue-500' :
                                    log.status === 'Completed' ? 'bg-purple-500' :
                                    log.status === 'Ready' ? 'bg-orange-500' :
                                    log.status === 'Complete' ? 'bg-green-500' :
                                    log.status === 'Inspection' ? 'bg-yellow-500' :
                                    log.status === 'Testing' ? 'bg-indigo-500' : 'bg-gray-500'
                                  }`}></div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{log.equipment}</p>
                                    <p className="text-xs text-gray-500">{log.unit}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                      <p className="text-xs text-gray-400">Updated: {log.updated} | {log.timeAgo}</p>
                                      <p className="text-xs text-blue-600 font-medium">Updated by: {log.updatedBy}</p>
                                    </div>
                                  </div>
                                  <div className={`text-xs font-medium px-3 py-1 rounded-full border ${
                                    log.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                    log.status === 'Completed' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                    log.status === 'Ready' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                    log.status === 'Complete' ? 'bg-green-100 text-green-800 border-green-200' :
                                    log.status === 'Inspection' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                    log.status === 'Testing' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                                  }`}>
                                    {log.status}
                        </div>
                        </div>
                              ))}
                        </div>
                          );
                        })()}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                  </div>
                </div>
          </TabsContent>

          {/* Project Details Tab */}
          <TabsContent value="project-details" className="space-y-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
                <h2 className="text-xl font-semibold text-orange-800 flex items-center gap-2">
                  <Users size={24} className="text-orange-600" />
                  Project Details
                </h2>
                <p className="text-orange-600 text-sm mt-1">Complete project information and team details</p>
              </div>
              <div className="p-6">
                <ProjectDetails
                  project={projectData}
                  onBack={onBack}
                  onViewEquipment={() => setActiveTab("equipment")}
                  onViewVDCR={() => setActiveTab("vdcr")}
                  vdcrData={vdcrData}
                />
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Settings size={24} className="text-gray-600" />
                  Team & Permissions Settings
                </h2>
                <p className="text-gray-600 text-sm mt-1">Manage team members and control access permissions</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Team Management Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
                      <p className="text-sm text-gray-500">Manage who has access to this project and their permissions</p>
                    </div>
                    <button
                      onClick={() => setShowAddMember(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Users size={16} />
                      Add Member
                    </button>
                  </div>

                                    {/* Team Members List */}
                    <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-lg">{member.avatar}</span>
                        </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{member.name}</h4>
                              <p className="text-sm text-gray-600">{member.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  roles.find(r => r.name === member.role)?.color || 'bg-gray-100 text-gray-800'
                                }`}>
                                  {member.role}
                                </span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {member.status}
                                </span>
                        </div>
                        </div>
                      </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Last active: {member.lastActive}</span>
                            <button
                              onClick={() => editTeamMember(member)}
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleMemberStatus(member.id)}
                              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                member.status === 'active' 
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {member.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => removeTeamMember(member.id)}
                              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                            >
                              Remove
                            </button>
                      </div>
                    </div>
                    
                        {/* Equipment Assignments */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Equipment Assignments:</h5>
                          <div className="flex flex-wrap gap-2">
                            {member.equipmentAssignments.map((equipment, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                              >
                                {equipment}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Data Access Levels */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Data Access:</h5>
                          <div className="space-y-2">
                            {member.dataAccess.map((access, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-xs text-gray-600">{access}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Access Level Badge */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Access Level:</h5>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            member.accessLevel === 'project_manager' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            member.accessLevel === 'vdcr_manager' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                            member.accessLevel === 'editor' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {member.accessLevel === 'project_manager' ? 'Project Manager' :
                             member.accessLevel === 'vdcr_manager' ? 'VDCR Manager' :
                             member.accessLevel === 'editor' ? 'Editor' : 'Viewer'}
                          </span>
                        </div>

                        {/* Permissions Display */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h5>
                          <div className="flex flex-wrap gap-2">
                            {member.permissions.map((permission, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                              >
                                {getPermissionLabel(permission)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>


                </div>
              </div>
            </div>

            {/* Add Member Modal */}
            {showAddMember && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Add New Team Member</h3>
                        <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new team member</p>
                      </div>
                      <button
                        onClick={() => setShowAddMember(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-8">
                    {/* Basic Information Section */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Basic Information</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                          <input
                            type="text"
                            value={newMember.name}
                            onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                          <input
                            type="email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="Enter email address"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={newMember.phone || ''}
                            onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="Enter phone number"
                            pattern="[0-9]{10}"
                            title="Please enter a 10-digit phone number"
                            maxLength={10}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Position/Title *</label>
                          <input
                            type="text"
                            value={newMember.position || ''}
                            onChange={(e) => setNewMember({...newMember, position: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="e.g., Engineer, Inspector, Manager"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Equipment Assignment Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Equipment Assignment</h4>
                        </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-green-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                          <input
                            type="checkbox"
                            checked={newMember.equipmentAssignments?.includes("All Equipment") || false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Auto-select all equipment when "All Equipment" is checked
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: [
                                    "All Equipment",
                                    "Heat Exchanger HE-001",
                                    "Pressure Vessel PV-003",
                                    "Storage Tank ST-002"
                                  ]
                                });
                              } else {
                                // Deselect all equipment when "All Equipment" is unchecked
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: []
                                });
                              }
                            }}
                            className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 transition-all duration-200"
                          />
                          <span className="text-sm font-medium text-gray-700">All Equipment</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-green-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                          <input
                            type="checkbox"
                            checked={newMember.equipmentAssignments?.includes("Heat Exchanger HE-001") || false}
                            onChange={(e) => {
                              const currentAssignments = newMember.equipmentAssignments || [];
                              if (e.target.checked) {
                                const newAssignments = [...currentAssignments, "Heat Exchanger HE-001"];
                                // Auto-check "All Equipment" if all individual equipment is selected
                                if (newAssignments.includes("Pressure Vessel PV-003") && 
                                    newAssignments.includes("Storage Tank ST-002")) {
                                  newAssignments.push("All Equipment");
                                }
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: newAssignments
                                });
                              } else {
                                const newAssignments = currentAssignments.filter(item => item !== "Heat Exchanger HE-001");
                                // Auto-uncheck "All Equipment" if any individual equipment is deselected
                                if (newAssignments.includes("All Equipment")) {
                                  newAssignments.splice(newAssignments.indexOf("All Equipment"), 1);
                                }
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: newAssignments
                                });
                              }
                            }}
                            className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 transition-all duration-200"
                          />
                          <span className="text-sm font-medium text-gray-700">Heat Exchanger HE-001</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-green-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                          <input
                            type="checkbox"
                            checked={newMember.equipmentAssignments?.includes("Pressure Vessel PV-003") || false}
                            onChange={(e) => {
                              const currentAssignments = newMember.equipmentAssignments || [];
                              if (e.target.checked) {
                                const newAssignments = [...currentAssignments, "Pressure Vessel PV-003"];
                                // Auto-check "All Equipment" if all individual equipment is selected
                                if (newAssignments.includes("Heat Exchanger HE-001") && 
                                    newAssignments.includes("Storage Tank ST-002")) {
                                  newAssignments.push("All Equipment");
                                }
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: newAssignments
                                });
                              } else {
                                const newAssignments = currentAssignments.filter(item => item !== "Pressure Vessel PV-003");
                                // Auto-uncheck "All Equipment" if any individual equipment is deselected
                                if (newAssignments.includes("All Equipment")) {
                                  newAssignments.splice(newAssignments.indexOf("All Equipment"), 1);
                                }
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: newAssignments
                                });
                              }
                            }}
                            className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                          />
                          <span className="text-sm font-medium text-gray-700">Pressure Vessel PV-003</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-green-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                          <input
                            type="checkbox"
                            checked={newMember.equipmentAssignments?.includes("Storage Tank ST-002") || false}
                            onChange={(e) => {
                              const currentAssignments = newMember.equipmentAssignments || [];
                              if (e.target.checked) {
                                const newAssignments = [...currentAssignments, "Storage Tank ST-002"];
                                // Auto-check "All Equipment" if all individual equipment is selected
                                if (newAssignments.includes("Heat Exchanger HE-001") && 
                                    newAssignments.includes("Pressure Vessel PV-003")) {
                                  newAssignments.push("All Equipment");
                                }
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: newAssignments
                                });
                              } else {
                                const newAssignments = currentAssignments.filter(item => item !== "Storage Tank ST-002");
                                // Auto-uncheck "All Equipment" if any individual equipment is deselected
                                if (newAssignments.includes("All Equipment")) {
                                  newAssignments.splice(newAssignments.indexOf("All Equipment"), 1);
                                }
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: newAssignments
                                });
                              }
                            }}
                            className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 transition-all duration-200"
                          />
                          <span className="text-sm font-medium text-gray-700">Storage Tank ST-002</span>
                        </label>
                        </div>
                      

                        </div>

                    {/* Role & Access Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Role & Access Level</h4>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Role *</label>
                        <select
                          value={newMember.role}
                          onChange={(e) => {
                            const role = e.target.value;
                            setNewMember({
                              ...newMember, 
                              role: role,
                              accessLevel: role === 'Project Manager' ? 'project_manager' : 
                                          role === 'VDCR Manager' ? 'vdcr_manager' : 
                                          role === 'Editor' ? 'editor' : 'viewer',
                              permissions: role === 'Project Manager' ? ['view', 'edit', 'delete', 'manage_team', 'approve_vdcr', 'manage_equipment'] :
                                         role === 'VDCR Manager' ? ['view', 'edit', 'approve_vdcr', 'manage_vdcr'] :
                                         role === 'Editor' ? ['view', 'edit', 'manage_equipment'] : ['view', 'comment']
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                          required
                        >
                          <option value="">Choose a role...</option>
                          <option value="Project Manager">Project Manager (Full Access)</option>
                          <option value="VDCR Manager">VDCR Manager (VDCR Management)</option>
                          <option value="Editor">Editor (Can Add Progress)</option>
                          <option value="Viewer">Viewer (Read Only)</option>
                        </select>
                        
                        {/* Role Description with Data Access */}
                        {newMember.role && (
                          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-xs text-purple-700 font-medium mb-3">Default Data Access for Selected Role:</p>
                            <div className="text-xs text-purple-700 space-y-2">
                              {newMember.role === 'Project Manager' && (
                                <div className="space-y-1">
                                  <div className="font-medium">Full Project Access</div>
                                  <div>• Can Edit All Data</div>
                                  <div>• Cannot Edit VDCR</div>
                                  <div>• Add, Remove team members</div>
                    </div>
                              )}
                              {newMember.role === 'VDCR Manager' && (
                                <div className="space-y-1">
                                  <div className="font-medium">VDCR Tab Access</div>
                                  <div>• Can Edit VDCR</div>
                                  <div>• VDCR Birdview</div>
                                  <div>• VDCR Logs</div>
                  </div>
                              )}
                              {newMember.role === 'Editor' && (
                                <div className="space-y-1">
                                  <div className="font-medium">Assigned Equipment Only</div>
                                  <div>• Can Add Progress Images</div>
                                  <div>• Can Add Progress Entries</div>
                                  <div>• Access to VDCR & Other Tabs</div>
                                  <div>• No Access to Settings & Project Details</div>
                </div>
                              )}
                              {newMember.role === 'Viewer' && (
                                <div className="space-y-1">
                                  <div className="font-medium">Assigned Equipment Only</div>
                                  <div>• Can Add Progress Images</div>
                                  <div>• Cannot Edit Data</div>
                                  <div>• Access to VDCR & Other Tabs</div>
                                  <div>• No Access to Settings & Project Details</div>
              </div>
                              )}
            </div>
                          </div>
                        )}
                      </div>
                    </div>


                </div>

                  {/* Action Buttons */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-xl">
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowAddMember(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addTeamMember}
                        disabled={!newMember.name || !newMember.email || !newMember.position || !newMember.role || !newMember.equipmentAssignments?.length}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                      >
                        Add Team Member
                      </button>
              </div>
            </div>
                </div>
              </div>
            )}

            {/* Edit Member Modal */}
            {showEditMember && selectedMember && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Edit Team Member</h3>
                        <p className="text-sm text-gray-500 mt-1">Update the team member's information and permissions</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowEditMember(false);
                          setSelectedMember(null);
                          setNewMember({ name: "", email: "", phone: "", position: "", role: "", permissions: [], equipmentAssignments: [], dataAccess: [], accessLevel: "viewer" });
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-8">
                    {/* Basic Information Section */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Basic Information</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                          <input
                            type="text"
                            value={newMember.name}
                            onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                          <input
                            type="email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="Enter email address"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={newMember.phone || ''}
                            onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="Enter phone number"
                            pattern="[0-9]{10}"
                            title="Please enter a 10-digit phone number"
                            maxLength={10}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Position/Title *</label>
                          <input
                            type="text"
                            value={newMember.position || ''}
                            onChange={(e) => setNewMember({...newMember, position: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="e.g., Engineer, Inspector, Manager"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Equipment Assignment Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Equipment Assignment</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-green-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                          <input
                            type="checkbox"
                            checked={newMember.equipmentAssignments?.includes("All Equipment") || false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: [
                                    "All Equipment",
                                    "Heat Exchanger HE-001",
                                    "Pressure Vessel PV-003",
                                    "Storage Tank ST-002"
                                  ]
                                });
                              } else {
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: []
                                });
                              }
                            }}
                            className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 transition-all duration-200"
                          />
                          <span className="text-sm font-medium text-gray-700">All Equipment</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-green-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                          <input
                            type="checkbox"
                            checked={newMember.equipmentAssignments?.includes("Heat Exchanger HE-001") || false}
                            onChange={(e) => {
                              const currentAssignments = newMember.equipmentAssignments || [];
                              if (e.target.checked) {
                                const newAssignments = [...currentAssignments, "Heat Exchanger HE-001"];
                                if (newAssignments.includes("Pressure Vessel PV-003") && 
                                    newAssignments.includes("Storage Tank ST-002")) {
                                  newAssignments.push("All Equipment");
                                }
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: newAssignments
                                });
                              } else {
                                const newAssignments = currentAssignments.filter(item => item !== "Heat Exchanger HE-001");
                                if (newAssignments.includes("All Equipment")) {
                                  newAssignments.splice(newAssignments.indexOf("All Equipment"), 1);
                                }
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: newAssignments
                                });
                              }
                            }}
                            className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 transition-all duration-200"
                          />
                          <span className="text-sm font-medium text-gray-700">Heat Exchanger HE-001</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-green-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                          <input
                            type="checkbox"
                            checked={newMember.equipmentAssignments?.includes("Pressure Vessel PV-003") || false}
                            onChange={(e) => {
                              const currentAssignments = newMember.equipmentAssignments || [];
                              if (e.target.checked) {
                                const newAssignments = [...currentAssignments, "Pressure Vessel PV-003"];
                                if (newAssignments.includes("Heat Exchanger HE-001") && 
                                    newAssignments.includes("Storage Tank ST-002")) {
                                  newAssignments.push("All Equipment");
                                }
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: newAssignments
                                });
                              } else {
                                const newAssignments = currentAssignments.filter(item => item !== "Pressure Vessel PV-003");
                                if (newAssignments.includes("All Equipment")) {
                                  newAssignments.splice(newAssignments.indexOf("All Equipment"), 1);
                                }
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: newAssignments
                                });
                              }
                            }}
                            className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 transition-all duration-200"
                          />
                          <span className="text-sm font-medium text-gray-700">Pressure Vessel PV-003</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-green-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                          <input
                            type="checkbox"
                            checked={newMember.equipmentAssignments?.includes("Storage Tank ST-002") || false}
                            onChange={(e) => {
                              const currentAssignments = newMember.equipmentAssignments || [];
                              if (e.target.checked) {
                                const newAssignments = [...currentAssignments, "Storage Tank ST-002"];
                                if (newAssignments.includes("Heat Exchanger HE-001") && 
                                    newAssignments.includes("Pressure Vessel PV-003")) {
                                  newAssignments.push("All Equipment");
                                }
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: newAssignments
                                });
                              } else {
                                const newAssignments = currentAssignments.filter(item => item !== "Storage Tank ST-002");
                                if (newAssignments.includes("All Equipment")) {
                                  newAssignments.splice(newAssignments.indexOf("All Equipment"), 1);
                                }
                                setNewMember({
                                  ...newMember,
                                  equipmentAssignments: newAssignments
                                });
                              }
                            }}
                            className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 transition-all duration-200"
                          />
                          <span className="text-sm font-medium text-gray-700">Storage Tank ST-002</span>
                        </label>
                      </div>
                    </div>

                    {/* Role & Access Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Role & Access Level</h4>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Role *</label>
                        <select
                          value={newMember.role}
                          onChange={(e) => {
                            const role = e.target.value;
                            setNewMember({
                              ...newMember, 
                              role: role,
                              accessLevel: role === 'Project Manager' ? 'project_manager' : 
                                          role === 'VDCR Manager' ? 'vdcr_manager' : 
                                          role === 'Editor' ? 'editor' : 'viewer',
                              permissions: role === 'Project Manager' ? ['view', 'edit', 'delete', 'manage_team', 'approve_vdcr', 'manage_equipment'] :
                                         role === 'VDCR Manager' ? ['view', 'edit', 'approve_vdcr', 'manage_vdcr'] :
                                         role === 'Editor' ? ['view', 'edit', 'manage_equipment'] : ['view', 'comment']
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                          required
                        >
                          <option value="">Choose a role...</option>
                          <option value="Project Manager">Project Manager (Full Access)</option>
                          <option value="VDCR Manager">VDCR Manager (VDCR Management)</option>
                          <option value="Editor">Editor (Can Add Progress)</option>
                          <option value="Viewer">Viewer (Read Only)</option>
                        </select>
                        
                        {/* Role Description with Data Access */}
                        {newMember.role && (
                          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-xs text-purple-700 font-medium mb-3">Default Data Access for Selected Role:</p>
                            <div className="text-xs text-purple-700 space-y-2">
                              {newMember.role === 'Project Manager' && (
                                <div className="space-y-1">
                                  <div className="font-medium">Full Project Access</div>
                                  <div>• Can Edit All Data</div>
                                  <div>• Cannot Edit VDCR</div>
                                  <div>• Add, Remove team members</div>
                                </div>
                              )}
                              {newMember.role === 'VDCR Manager' && (
                                <div className="space-y-1">
                                  <div className="font-medium">VDCR Tab Access</div>
                                  <div>• Can Edit VDCR</div>
                                  <div>• VDCR Birdview</div>
                                  <div>• VDCR Logs</div>
                                </div>
                              )}
                              {newMember.role === 'Editor' && (
                                <div className="space-y-1">
                                  <div className="font-medium">Assigned Equipment Only</div>
                                  <div>• Can Add Progress Images</div>
                                  <div>• Can Add Progress Entries</div>
                                  <div>• Access to VDCR & Other Tabs</div>
                                  <div>• No Access to Settings & Project Details</div>
                                </div>
                              )}
                              {newMember.role === 'Viewer' && (
                                <div className="space-y-1">
                                  <div className="font-medium">Assigned Equipment Only</div>
                                  <div>• Read-Only Access</div>
                                  <div>• Cannot Edit Data</div>
                                  <div>• Access to VDCR & Other Tabs</div>
                                  <div>• No Access to Settings & Project Details</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-xl">
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setShowEditMember(false);
                          setSelectedMember(null);
                          setNewMember({ name: "", email: "", phone: "", position: "", role: "", permissions: [], equipmentAssignments: [], dataAccess: [], accessLevel: "viewer" });
                        }}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updateTeamMember}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                      >
                        Update Member
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedProjectView;
