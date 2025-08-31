import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Building, 
  FileText, 
  MapPin, 
  Calendar, 
  Users, 
  Target,
  BarChart3,
  FileSpreadsheet,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Settings,
  PieChart,
  Activity,
  Eye,
  Pencil,
  Save,
  X
} from "lucide-react";
import { designSystem } from "@/lib/design-system";

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
  poNumber: string;
  salesOrderDate?: string;
  clientIndustry?: string;
  consultant?: string;
  tpiAgency?: string;
  clientFocalPoint?: string;
  vdcrManager?: string;
  equipmentBreakdown: {
    heatExchanger?: number;
    pressureVessel?: number;
    storageTank?: number;
    reactor?: number;
    other?: number;
  };
  servicesIncluded?: string[];
  scopeOfWork?: string;
  unpricedPOFile?: { name: string; uploaded: boolean; type: string } | null;
  designInputsPID?: { name: string; uploaded: boolean; type: string } | null;
  clientReferenceDoc?: { name: string; uploaded: boolean; type: string } | null;
  otherDocuments?: { name: string; uploaded: boolean; type: string }[] | null;
  kickoffMeetingNotes?: string;
  specialProductionNotes?: string;
  documents?: Array<{
    id?: string;
    name: string;
    type: string;
    description?: string;
    fileUrl?: string;
    uploadedAt?: string;
  }>;
}

interface VDCRRecord {
  id: string;
  srNo: string;
  equipmentTagNo: string[];
  mfgSerialNo: string[];
  jobNo: string[];
  clientDocNo: string;
  internalDocNo: string;
  documentName: string;
  revision: string;
  codeStatus: string;
  status: 'approved' | 'sent-for-approval' | 'received-for-comment' | 'pending' | 'rejected';
  lastUpdate: string;
  remarks?: string;
  updatedBy?: string;
  documentFile?: any;
  documentUrl?: string;
}

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
  onViewEquipment: () => void;
  onViewVDCR: () => void;
  vdcrData?: VDCRRecord[]; // Add VDCR data prop
}

const ProjectDetails = ({ project, onBack, onViewEquipment, onViewVDCR, vdcrData = [] }: ProjectDetailsProps) => {
  const [activeTab, setActiveTab] = useState("team-details");
  const [documentPreview, setDocumentPreview] = useState<{url: string; name: string; type: string; description: string} | null>(null);
  const [selectedVDCR, setSelectedVDCR] = useState<string | null>(null);
  const [selectedVDCRStatus, setSelectedVDCRStatus] = useState<'approved' | 'sent-for-approval' | 'received-for-comment' | 'rejected'>('approved');
  const [showEditForm, setShowEditForm] = useState(false);
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: project.name,
    client: project.client,
    location: project.location,
    equipmentCount: project.equipmentCount,
    activeEquipment: project.activeEquipment,
    status: project.status,
    manager: project.manager,
    deadline: project.deadline,
    poNumber: project.poNumber,
    salesOrderDate: project.salesOrderDate || '',
    clientIndustry: project.clientIndustry || '',
    consultant: project.consultant || '',
    tpiAgency: project.tpiAgency || '',
    clientFocalPoint: project.clientFocalPoint || '',
    vdcrManager: project.vdcrManager || '',
    scopeOfWork: project.scopeOfWork || '',
    servicesIncluded: project.servicesIncluded || [],
    equipmentBreakdown: project.equipmentBreakdown || {},
    kickoffMeetingNotes: project.kickoffMeetingNotes || '',
    specialProductionNotes: project.specialProductionNotes || ''
  });

  // Document management state
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [newDocument, setNewDocument] = useState({
    type: 'unpricedPOFile',
    name: '',
    description: ''
  });





  const handleDocumentClick = (title: string, type: string, description: string) => {
    setDocumentPreview({
      url: '', // Placeholder, actual URL would be fetched
      name: title,
      type: type,
      description: description
    });
  };

  // Edit mode functions
  const toggleEditMode = () => {
    if (isEditMode) {
      // Save changes - we're exiting edit mode
      console.log('Saving changes:', editData);
    } else {
      // Entering edit mode - initialize with current project values
      console.log('Project servicesIncluded:', project.servicesIncluded);
      console.log('Project data:', project);
      setEditData({
        name: project.name || '',
        client: project.client || '',
        location: project.location || '',
        equipmentCount: project.equipmentCount,
        activeEquipment: project.activeEquipment,
        status: project.status,
        poNumber: project.poNumber || '',
        salesOrderDate: project.salesOrderDate || '',
        deadline: project.deadline || '',
        clientIndustry: project.clientIndustry || '',
        manager: project.manager || '',
        consultant: project.consultant || '',
        tpiAgency: project.tpiAgency || '',
        clientFocalPoint: project.clientFocalPoint || '',
        vdcrManager: project.vdcrManager || '',
        scopeOfWork: project.scopeOfWork || '',
        servicesIncluded: project.servicesIncluded || [],
        equipmentBreakdown: project.equipmentBreakdown || {},
        kickoffMeetingNotes: project.kickoffMeetingNotes || '',
        specialProductionNotes: project.specialProductionNotes || ''
      });
    }
    setIsEditMode(!isEditMode);
  };

  const handleEditFieldChange = (field: string, value: string | string[]) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEquipmentBreakdownChange = (equipmentType: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setEditData(prev => ({
      ...prev,
      equipmentBreakdown: {
        ...prev.equipmentBreakdown,
        [equipmentType]: numValue
      }
    }));
  };

  const handleSaveChanges = () => {
    // Here you would typically save to your backend
    console.log('Saving changes:', editData);
    setIsEditMode(false);
    // You could also call a prop function to update the parent component
  };

  const handleMarkAsComplete = () => {
    // Here you would typically update the project status in your backend
    console.log('Marking project as complete:', project.id);
    // You could also call a prop function to update the parent component
    alert('Project marked as complete!');
  };



  const handleCancelEdit = () => {
    setEditData({
      name: project.name || '',
      client: project.client || '',
      location: project.location || '',
      equipmentCount: project.equipmentCount,
      activeEquipment: project.activeEquipment,
      status: project.status,
      poNumber: project.poNumber || '',
      salesOrderDate: project.salesOrderDate || '',
      deadline: project.deadline || '',
      clientIndustry: project.clientIndustry || '',
      manager: project.manager || '',
      consultant: project.consultant || '',
      tpiAgency: project.tpiAgency || '',
      clientFocalPoint: project.clientFocalPoint || '',
      vdcrManager: project.vdcrManager || '',
      scopeOfWork: project.scopeOfWork || '',
      servicesIncluded: project.servicesIncluded || [],
      equipmentBreakdown: project.equipmentBreakdown || {},
      kickoffMeetingNotes: project.kickoffMeetingNotes || '',
      specialProductionNotes: project.specialProductionNotes || ''
    });
    setIsEditMode(false);
  };

  // Document management functions
  const handleAddDocument = () => {
    setShowDocumentUpload(true);
  };

  const handleDocumentUpload = () => {
    // Here you would typically upload the document to your backend
    console.log('Uploading document:', newDocument);
    
    // For now, we'll just close the modal
    setShowDocumentUpload(false);
    setNewDocument({
      type: 'unpricedPOFile',
      name: '',
      description: ''
    });
  };

  const handleRemoveDocument = (documentType: string) => {
    if (confirm('Are you sure you want to remove this document?')) {
      console.log('Removing document:', documentType);
      // Here you would typically remove the document from your backend
    }
  };

  const handleEditProject = () => {
    // TODO: Implement edit project functionality
    console.log('Edit project:', project.id);
    alert('Edit project functionality will be implemented here');
  };

  const handleMarkComplete = () => {
    const confirmed = window.confirm(`Are you sure you want to mark the project "${project.name}" as complete?`);
    if (confirmed) {
      // Here you would typically update the project status in your backend
      console.log('Marking project as complete:', project.id);
      // You could also call a prop function to update the parent component
      alert('Project marked as complete successfully!');
    }
  };

  const handleDeleteProject = () => {
    if (confirm(`Are you sure you want to delete project "${project.name}"? This action cannot be undone.`)) {
      // TODO: Implement delete project functionality
      console.log('Delete project:', project.id);
      alert('Delete project functionality will be implemented here');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'on-track':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'delayed':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'on-track':
        return <TrendingUp size={16} className="text-blue-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };



  // VDCR Overview calculation functions
  const calculateVDCRStats = () => {
    if (!vdcrData || vdcrData.length === 0) {
      return {
        approved: 0,
        underReview: 0,
        sentForApproval: 0,
        rejected: 0,
        total: 0
      };
    }

    return {
      approved: vdcrData.filter(v => v.status === 'approved').length,
      underReview: vdcrData.filter(v => v.status === 'received-for-comment' || v.status === 'pending').length,
      sentForApproval: vdcrData.filter(v => v.status === 'sent-for-approval').length,
      rejected: vdcrData.filter(v => v.status === 'rejected').length,
      total: vdcrData.length
    };
  };

  const calculateTimeline = (lastUpdate: string) => {
    const lastDate = new Date(lastUpdate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays/7)} weeks ago`;
    return `${Math.ceil(diffDays/30)} months ago`;
  };

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'approved': return { color: 'green', icon: '✓', label: 'Complete' };
      case 'sent-for-approval': return { color: 'blue', icon: '📤', label: 'Sent' };
      case 'received-for-comment': return { color: 'yellow', icon: '⏱️', label: 'In Progress' };
      case 'pending': return { color: 'yellow', icon: '⏱️', label: 'Pending' };
      case 'rejected': return { color: 'red', icon: '✗', label: 'Needs Revision' };
      default: return { color: 'gray', icon: '❓', label: 'Unknown' };
    }
  };

  const getDocumentTypeStats = () => {
    if (!vdcrData || vdcrData.length === 0) return [];

    const typeStats = vdcrData.reduce((acc, v) => {
      const type = v.documentName.split(' ')[0] + ' ' + v.documentName.split(' ')[1]; // First two words as type
      if (!acc[type]) {
        acc[type] = { approved: 0, pending: 0, rejected: 0, total: 0 };
      }
      
      if (v.status === 'approved') acc[type].approved++;
      else if (v.status === 'rejected') acc[type].rejected++;
      else acc[type].pending++;
      
      acc[type].total++;
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(typeStats).map(([type, stats]) => ({
      type,
      ...stats
    }));
  };

  const getRecentUpdates = () => {
    if (!vdcrData || vdcrData.length === 0) return [];
    
    return vdcrData.slice(0, 5).map(v => ({
      documentName: v.documentName,
      status: v.status,
      timeline: calculateTimeline(v.lastUpdate),
      statusInfo: getStatusInfo(v.status)
    }));
  };

  const getVDCRDocumentsByStatus = (status: 'approved' | 'sent-for-approval' | 'received-for-comment' | 'rejected') => {
    if (!vdcrData || vdcrData.length === 0) return [];

    const filteredDocs = vdcrData.filter(doc => doc.status === status);

    return filteredDocs.map(doc => {
      const updateDate = new Date(doc.lastUpdate);
      const today = new Date();
      const diffTime = today.getTime() - updateDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let daysAgo = '';
      if (diffDays === 0) {
        daysAgo = 'Today';
      } else if (diffDays === 1) {
        daysAgo = '1 day ago';
      } else {
        daysAgo = `${diffDays} days ago`;
      }

      return {
        ...doc,
        daysAgo,
        latestUpdate: doc.lastUpdate,
        updateDate: updateDate
      };
    }).sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()); // Sort by most recent first
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Team Details Tab */}
          <TabsContent value="team-details" className="space-y-6">
              <div className="space-y-6">
                
              {/* Project Header with Action Buttons */}
                <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Building size={32} className="text-white" />
                          </div>
                        <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {project.name}
                      </h2>
                      <p className="text-lg text-gray-600 mt-1">Team & Project Information</p>
                          </div>
                        </div>
                    
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={toggleEditMode}
                      variant={isEditMode ? "default" : "outline"}
                      className={`flex items-center gap-2 px-4 py-2 ${
                        isEditMode 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800'
                      }`}
                    >
                      {isEditMode ? (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Pencil size={16} />
                          Edit Project
                        </>
                      )}
                    </Button>
                    
                    {isEditMode && (
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-800"
                      >
                        <X size={16} />
                        Cancel
                      </Button>
                    )}
                    
                    {project.status !== 'completed' && (
                      <Button
                        onClick={handleMarkComplete}
                        variant="outline"
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800"
                      >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                        Mark Complete
                      </Button>
                    )}
                    
                    <Button
                      onClick={handleDeleteProject}
                      variant="outline"
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800"
                    >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                      Delete Project
                    </Button>
                      </div>
                    </div>
              </Card>

                            {/* Basic Project Information */}
              <Card className="p-6 bg-gray-50 border-0 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Building size={20} className="mr-2 text-blue-600" />
                  Project Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Project Information */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Project Information</h4>
                    <div className="space-y-0">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Project Name</span>
                        <span className="text-sm font-semibold text-gray-800">{project.name}</span>
                  </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Client</span>
                        <span className="text-sm font-semibold text-gray-800">{project.client}</span>
                  </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Location</span>
                        <span className="text-sm font-semibold text-gray-800">{project.location}</span>
                  </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">PO Number</span>
                        <span className="text-sm font-semibold text-gray-800">{project.poNumber}</span>
                  </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">PO Date</span>
                        <span className="text-sm font-semibold text-gray-800">{project.salesOrderDate || 'Not specified'}</span>
                  </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-sm font-medium text-gray-600">Deadline</span>
                        <span className="text-sm font-semibold text-gray-800">{project.deadline}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Project Status */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Project Status</h4>
                    <div className="space-y-0">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Status</span>
                        <Badge className={`${
                          project.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                          project.status === 'delayed' ? 'bg-red-100 text-red-800 border-red-200' :
                          project.status === 'on-track' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Equipment Count</span>
                        <span className="text-sm font-semibold text-gray-800">{project.equipmentCount}</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-sm font-medium text-gray-600">Active Equipment</span>
                        <span className="text-sm font-semibold text-gray-800">{project.activeEquipment}</span>
                      </div>
                    </div>
                  </div>
                  </div>
                </Card>

              {/* Project Team & Management */}
              <Card className="p-6 bg-gray-50 border-0 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Users size={20} className="mr-2 text-green-600" />
                  Project Team & Management
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Team Members */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Team Members</h4>
                    <div className="space-y-0">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Project Manager</span>
                        <span className="text-sm font-semibold text-gray-800">{project.manager}</span>
                  </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Client Focal Point</span>
                        <span className="text-sm font-semibold text-gray-800">{project.clientFocalPoint || 'Not specified'}</span>
                  </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-sm font-medium text-gray-600">VDCR Manager</span>
                        <span className="text-sm font-semibold text-gray-800">{project.vdcrManager || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - External Partners */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">External Partners</h4>
                    <div className="space-y-0">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Consultant</span>
                        <span className="text-sm font-semibold text-gray-800">{project.consultant || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">TPI Agency</span>
                        <span className="text-sm font-semibold text-gray-800">{project.tpiAgency || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-sm font-medium text-gray-600">Client Industry</span>
                        <span className="text-sm font-semibold text-gray-800">{project.clientIndustry || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

                    {/* Equipment Breakdown */}
              <Card className="p-6 bg-gray-50 border-0 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Target size={20} className="mr-2 text-purple-600" />
                  Equipment Breakdown
                </h3>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {isEditMode ? (
                    <>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
                        <input
                          type="number"
                          value={editData.equipmentBreakdown.heatExchanger || 0}
                          onChange={(e) => handleEquipmentBreakdownChange('heatExchanger', e.target.value)}
                          className="w-16 text-center text-2xl font-bold text-blue-800 bg-transparent border-none focus:outline-none"
                          min="0"
                        />
                        <div className="text-sm text-blue-600 font-medium">Heat Exchangers</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center">
                        <input
                          type="number"
                          value={editData.equipmentBreakdown.pressureVessel || 0}
                          onChange={(e) => handleEquipmentBreakdownChange('pressureVessel', e.target.value)}
                          className="w-16 text-center text-2xl font-bold text-green-800 bg-transparent border-none focus:outline-none"
                          min="0"
                        />
                        <div className="text-sm text-green-600 font-medium">Pressure Vessels</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 text-center">
                        <input
                          type="number"
                          value={editData.equipmentBreakdown.storageTank || 0}
                          onChange={(e) => handleEquipmentBreakdownChange('storageTank', e.target.value)}
                          className="w-16 text-center text-2xl font-bold text-yellow-800 bg-transparent border-none focus:outline-none"
                          min="0"
                        />
                        <div className="text-sm text-yellow-600 font-medium">Storage Tanks</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center">
                        <input
                          type="number"
                          value={editData.equipmentBreakdown.reactor || 0}
                          onChange={(e) => handleEquipmentBreakdownChange('reactor', e.target.value)}
                          className="w-16 text-center text-2xl font-bold text-purple-800 bg-transparent border-none focus:outline-none"
                          min="0"
                        />
                        <div className="text-sm text-purple-600 font-medium">Reactors</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                        <input
                          type="number"
                          value={editData.equipmentBreakdown.other || 0}
                          onChange={(e) => handleEquipmentBreakdownChange('other', e.target.value)}
                          className="w-16 text-center text-2xl font-bold text-gray-800 bg-transparent border-none focus:outline-none"
                          min="0"
                        />
                        <div className="text-sm text-gray-600 font-medium">Other Equipment</div>
                      </div>
                    </>
                  ) : (
                    <>
                      {project.equipmentBreakdown.heatExchanger && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-800">{project.equipmentBreakdown.heatExchanger}</div>
                          <div className="text-sm text-blue-600 font-medium">Heat Exchangers</div>
                        </div>
                      )}
                      
                      {project.equipmentBreakdown.pressureVessel && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-800">{project.equipmentBreakdown.pressureVessel}</div>
                          <div className="text-sm text-green-600 font-medium">Pressure Vessels</div>
                        </div>
                      )}
                      
                      {project.equipmentBreakdown.storageTank && (
                          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-green-200 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-800">{project.equipmentBreakdown.storageTank}</div>
                          <div className="text-sm text-yellow-600 font-medium">Storage Tanks</div>
                        </div>
                      )}
                      
                      {project.equipmentBreakdown.reactor && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-purple-800">{project.equipmentBreakdown.reactor}</div>
                          <div className="text-sm text-purple-600 font-medium">Reactors</div>
                        </div>
                      )}
                      
                      {project.equipmentBreakdown.other && (
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-gray-800">{project.equipmentBreakdown.other}</div>
                          <div className="text-sm text-gray-600 font-medium">Other Equipment</div>
                        </div>
                      )}
                    </>
                  )}
                  </div>
                </div>
                </Card>
                
                            {/* Scope of Work */}
              <Card className="p-6 bg-gray-50 border-0 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Target size={20} className="mr-2 text-indigo-600" />
                  Project Specifications
                </h3>
                  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Services Included */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Services Included</h4>
                    {isEditMode ? (
                      <div className="space-y-3">
                        {['Design & Engineering', 'Manufacturing & Fabrication', 'Quality Testing & Inspection', 'Documentation & Certification', 'Installation Support', 'Commissioning & Startup'].map((service) => (
                          <label key={service} className="flex items-center p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-gray-100">
                            <input
                              type="checkbox"
                              checked={editData.servicesIncluded.includes(service)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleEditFieldChange('servicesIncluded', [...editData.servicesIncluded, service]);
                                } else {
                                  handleEditFieldChange('servicesIncluded', editData.servicesIncluded.filter(s => s !== service));
                                }
                              }}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">{service}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {project.servicesIncluded && project.servicesIncluded.length > 0 ? (
                          project.servicesIncluded.map((service, index) => (
                            <div key={index} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="text-sm text-gray-700">{service}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No services specified</p>
                        )}
                      </div>
                    )}
                  </div>
                        
                  {/* Right Column - Scope Description */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Scope Description</h4>
                    {isEditMode ? (
                      <textarea
                        value={editData.scopeOfWork || ''}
                        onChange={(e) => handleEditFieldChange('scopeOfWork', e.target.value)}
                        placeholder="Enter detailed scope description..."
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {project.scopeOfWork || 'No scope description provided. Please add detailed scope information for this project.'}
                      </p>
                      </div>
                    )}
                  </div>
                        </div>
              </Card>

              {/* Documents Uploaded */}
              <Card className="p-6 bg-gray-50 border-0 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <FileText size={20} className="mr-2 text-amber-600" />
                    Documents Uploaded
                  </h3>
                  {isEditMode && (
                    <Button
                      onClick={handleAddDocument}
                      variant="outline"
                      size="sm"
                      className="bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 hover:text-emerald-800"
                    >
                      <FileText size={16} className="mr-2" />
                      Add Document
                    </Button>
                  )}
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Core Documents */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">Core Documents</h4>
                      
                  {/* Unpriced PO File */}
                  <div 
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      project.unpricedPOFile?.uploaded 
                        ? 'border-emerald-200 bg-emerald-25 hover:bg-emerald-50 shadow-sm' 
                        : 'border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                    onClick={() => project.unpricedPOFile?.uploaded && handleDocumentClick('Unpriced PO File', 'PDF', 'Purchase order file for the project')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        project.unpricedPOFile?.uploaded ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        {project.unpricedPOFile?.uploaded ? (
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                          </div>
                          <div className="flex-1">
                        <h4 className="font-medium text-gray-800">Unpriced PO File</h4>
                        <p className={`text-sm ${
                          project.unpricedPOFile?.uploaded ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          {project.unpricedPOFile?.uploaded ? 'File uploaded • Click to view' : 'No file uploaded'}
                        </p>
                          </div>
                      <div className="flex items-center gap-2">
                        {project.unpricedPOFile?.uploaded && (
                          <Eye size={16} className="text-emerald-500" />
                        )}
                        {isEditMode && project.unpricedPOFile?.uploaded && (
                          <button
                            onClick={() => handleRemoveDocument('unpricedPOFile')}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Remove document"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                        </div>
                        </div>
                        
                  {/* Design Inputs PID */}
                  <div 
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      project.designInputsPID?.uploaded 
                        ? 'border-emerald-200 bg-emerald-25 hover:bg-emerald-50 shadow-sm' 
                        : 'border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                    onClick={() => project.designInputsPID?.uploaded && handleDocumentClick('Design Inputs PID', 'PDF', 'Process and instrumentation diagram')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        project.designInputsPID?.uploaded ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        {project.designInputsPID?.uploaded ? (
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                          </div>
                          <div className="flex-1">
                        <h4 className="font-medium text-gray-800">Design Inputs PID</h4>
                        <p className={`text-sm ${
                          project.designInputsPID?.uploaded ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          {project.designInputsPID?.uploaded ? 'File uploaded • Click to view' : 'No file uploaded'}
                        </p>
                          </div>
                      <div className="flex items-center gap-2">
                        {project.designInputsPID?.uploaded && (
                          <Eye size={16} className="text-emerald-500" />
                        )}
                        {isEditMode && project.designInputsPID?.uploaded && (
                          <button
                            onClick={() => handleRemoveDocument('designInputsPID')}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Remove document"
                          >
                            <X size={14} />
                          </button>
                        )}
                          </div>
                      </div>
                      </div>
                    </div>

                    {/* Right Column - Additional Documents */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">Additional Documents</h4>

                  {/* Client Reference Doc */}
                                    <div 
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      project.clientReferenceDoc?.uploaded 
                        ? 'border-emerald-200 bg-emerald-25 hover:bg-emerald-50 shadow-sm' 
                        : 'border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                    onClick={() => project.clientReferenceDoc?.uploaded && handleDocumentClick('Client Reference Doc', 'PDF', 'Client reference documentation')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        project.clientReferenceDoc?.uploaded ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        {project.clientReferenceDoc?.uploaded ? (
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </div>
                            <div className="flex-1">
                        <h4 className="font-medium text-gray-800">Client Reference Doc</h4>
                        <p className={`text-sm ${
                          project.clientReferenceDoc?.uploaded ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          {project.clientReferenceDoc?.uploaded ? 'File uploaded • Click to view' : 'No file uploaded'}
                        </p>
                              </div>
                      <div className="flex items-center gap-2">
                        {project.clientReferenceDoc?.uploaded && (
                          <Eye size={16} className="text-emerald-500" />
                        )}
                        {isEditMode && project.clientReferenceDoc?.uploaded && (
                          <button
                            onClick={() => handleRemoveDocument('clientReferenceDoc')}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Remove document"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      </div>
                    </div>

                  {/* Other Documents */}
                                    <div 
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      project.otherDocuments && project.otherDocuments.some(doc => doc.uploaded)
                        ? 'border-emerald-200 bg-emerald-25 hover:bg-emerald-50 shadow-sm' 
                        : 'border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                    onClick={() => project.otherDocuments && project.otherDocuments.some(doc => doc.uploaded) && handleDocumentClick('Other Documents', 'Multiple', 'Additional project documents')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        project.otherDocuments && project.otherDocuments.some(doc => doc.uploaded) ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        {project.otherDocuments && project.otherDocuments.some(doc => doc.uploaded) ? (
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </div>
                            <div className="flex-1">
                        <h4 className="font-medium text-gray-800">Other Documents</h4>
                        <p className={`text-sm ${
                          project.otherDocuments && project.otherDocuments.some(doc => doc.uploaded) ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          {project.otherDocuments && project.otherDocuments.some(doc => doc.uploaded)
                            ? `${project.otherDocuments.filter(doc => doc.uploaded).length} file(s) uploaded • Click to view` 
                            : 'No files uploaded'
                          }
                        </p>
                              </div>
                      <div className="flex items-center gap-2">
                        {project.otherDocuments && project.otherDocuments.some(doc => doc.uploaded) && (
                          <Eye size={16} className="text-emerald-500" />
                        )}
                        {isEditMode && project.otherDocuments && project.otherDocuments.some(doc => doc.uploaded) && (
                          <button
                            onClick={() => handleRemoveDocument('otherDocuments')}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Remove documents"
                          >
                            <X size={14} />
                          </button>
                        )}
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                    </div>
              </Card>

              {/* Notes & Additional Information */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FileText size={20} className="mr-2 text-teal-600" />
                  Notes & Additional Information
                </h3>
                    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Kickoff Meeting Notes */}
                    <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Kickoff Meeting Notes</h4>
                    {isEditMode ? (
                      <textarea
                        value={editData.kickoffMeetingNotes || ''}
                        onChange={(e) => handleEditFieldChange('kickoffMeetingNotes', e.target.value)}
                        placeholder="Enter kickoff meeting notes..."
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {project.kickoffMeetingNotes || 'No kickoff meeting notes provided. Please add meeting notes and key discussion points.'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Column - Special Production Notes */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Special Production Notes</h4>
                    {isEditMode ? (
                      <textarea
                        value={editData.specialProductionNotes || ''}
                        onChange={(e) => handleEditFieldChange('specialProductionNotes', e.target.value)}
                        placeholder="Enter special production notes..."
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {project.specialProductionNotes || 'No special production notes provided. Please add critical production requirements and specifications.'}
                        </p>
                      </div>
                    )}
                  </div>
                  </div>
                </Card>


            </div>
          </TabsContent>

        </Tabs>
      </div>

      {/* Document Preview Modal */}
      {documentPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <FileText size={20} className="mr-2 text-blue-600" />
                  {documentPreview.name}
                </h3>
                <button
                  onClick={() => setDocumentPreview(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  {documentPreview.type}
                </Badge>
                <span className="text-sm text-gray-600">Description: {documentPreview.description}</span>
              </div>
            </div>
            
            {/* Document Content */}
            <div className="p-6">
              {documentPreview.url ? (
                <div className="w-full">
                  {documentPreview.type === 'PDF' && (
                    <iframe
                      src={documentPreview.url}
                      className="w-full h-96 border border-gray-200 rounded-lg"
                      title={documentPreview.name}
                    />
                  )}
                  {(documentPreview.type === 'JPG' || documentPreview.type === 'PNG' || documentPreview.type === 'GIF') && (
                    <img
                      src={documentPreview.url}
                      alt={documentPreview.name}
                      className="w-full h-auto max-h-96 object-contain border border-gray-200 rounded-lg"
                    />
                  )}
                  {(documentPreview.type === 'DOCX' || documentPreview.type === 'DOC') && (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-600 mb-2">Document Preview</p>
                      <p className="text-sm text-gray-500 mb-4">This document type requires download to view</p>
                      <a
                        href={documentPreview.url}
                        download
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Document
                      </a>
                    </div>
                  )}
                  {!['PDF', 'JPG', 'PNG', 'GIF', 'DOCX', 'DOC'].includes(documentPreview.type) && (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-600 mb-2">Document Preview</p>
                      <p className="text-sm text-gray-500 mb-4">This document type requires download to view</p>
                      <a
                        href={documentPreview.url}
                        download
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Document
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-600 mb-2">No Document Available</p>
                  <p className="text-sm text-gray-500">This document hasn't been uploaded yet</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t p-6">
              <button
                onClick={() => setDocumentPreview(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showDocumentUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Add New Document</h3>
                <button
                  onClick={() => setShowDocumentUpload(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                  <select
                    value={newDocument.type}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="unpricedPOFile">Unpriced PO File</option>
                    <option value="designInputsPID">Design Inputs PID</option>
                    <option value="clientReferenceDoc">Client Reference Doc</option>
                    <option value="otherDocuments">Other Documents</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
                  <input
                    type="text"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter document name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    value={newDocument.description}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter document description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    onClick={handleDocumentUpload}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Upload Document
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDocumentUpload(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
