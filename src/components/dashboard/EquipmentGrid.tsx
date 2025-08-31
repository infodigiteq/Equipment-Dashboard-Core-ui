import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Calendar, User, MapPin, ChevronLeft, ChevronRight, FileText, Users, Settings, TrendingUp, AlertTriangle, ClipboardCheck, Shield, Plus, Edit, Check, X, Camera, Upload, Clock } from "lucide-react";
import AddEquipmentForm from "@/components/forms/AddEquipmentForm";

interface Equipment {
  id: string;
  name?: string;
  type: string;
  tagNumber: string;
  jobNumber: string;
  manufacturingSerial: string;
  poCdd: string;
  status: 'on-track' | 'delayed' | 'nearing-completion' | 'completed' | 'pending';
  progress: number;
  progressPhase: 'documentation' | 'manufacturing' | 'testing' | 'dispatched';
  location: string;
  supervisor: string;
  lastUpdate: string;
  images: string[];
  nextMilestone: string;
  priority: 'high' | 'medium' | 'low';
  documents: File[];
  isBasicInfo: boolean;
  // Additional technical specifications
  size?: string;
  weight?: string;
  designCode?: string;
  material?: string;
  workingPressure?: string;
  designTemp?: string;
  welder?: string;
  welderEmail?: string;
  welderPhone?: string;
  qcInspector?: string;
  qcInspectorEmail?: string;
  qcInspectorPhone?: string;
  projectManager?: string;
  projectManagerEmail?: string;
  projectManagerPhone?: string;
  supervisorEmail?: string;
  supervisorPhone?: string;
  supervisorRole?: 'editor' | 'viewer';
  welderRole?: 'editor' | 'viewer';
  qcInspectorRole?: 'editor' | 'viewer';
  projectManagerRole?: 'editor' | 'viewer';
}

interface EquipmentGridProps {
  equipment: Equipment[];
  projectName: string;
  onBack?: () => void;
  onViewDetails?: () => void;
  onViewVDCR?: () => void;
}

const EquipmentGrid = ({ equipment, projectName, onBack, onViewDetails, onViewVDCR }: EquipmentGridProps) => {
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const [showAddEquipmentForm, setShowAddEquipmentForm] = useState(false);
  const [newEquipmentType, setNewEquipmentType] = useState('');
  const [newEquipmentTagNumber, setNewEquipmentTagNumber] = useState('');
  const [newEquipmentMSN, setNewEquipmentMSN] = useState('');
  const [newEquipmentJobNumber, setNewEquipmentJobNumber] = useState('');
  const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Equipment>>({});
  const [showImagePreview, setShowImagePreview] = useState<{url: string, equipmentId: string, currentIndex: number} | null>(null);
  const [newProgressImage, setNewProgressImage] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'documentation' | 'manufacturing' | 'testing' | 'dispatched'>('all');
  const [progressEntries, setProgressEntries] = useState<Record<string, Array<{id: string, text: string, date: string, type: string}>>>({
    // Sample progress entries for equipment
    "eq1": [
      { id: "p1", text: "Material cutting completed", date: "Nov 20, 2024", type: "material" },
      { id: "p2", text: "Welding started on main shell", date: "Nov 22, 2024", type: "welding" },
      { id: "p3", text: "Quality inspection passed", date: "Nov 23, 2024", type: "inspection" },
      { id: "p4", text: "Assembly phase initiated", date: "Nov 24, 2024", type: "assembly" },
      { id: "p5", text: "Testing procedures started", date: "Nov 25, 2024", type: "testing" },
      { id: "p6", text: "Final quality check", date: "Nov 26, 2024", type: "inspection" }
    ],
    "eq2": [
      { id: "p7", text: "Raw material requested", date: "Nov 18, 2024", type: "material" },
      { id: "p8", text: "Assembly in progress", date: "Nov 21, 2024", type: "assembly" },
      { id: "p9", text: "Welding preparation", date: "Nov 22, 2024", type: "welding" },
      { id: "p10", text: "Quality inspection", date: "Nov 23, 2024", type: "inspection" }
    ],
    "eq3": [
      { id: "p11", text: "Fabrication started", date: "Nov 19, 2024", type: "general" },
      { id: "p12", text: "Testing phase initiated", date: "Nov 24, 2024", type: "testing" },
      { id: "p13", text: "Material verification", date: "Nov 25, 2024", type: "material" },
      { id: "p14", text: "Assembly completion", date: "Nov 26, 2024", type: "assembly" }
    ],
    "eq4": [
      { id: "p15", text: "Final assembly completed", date: "Nov 15, 2024", type: "assembly" },
      { id: "p16", text: "Quality certification received", date: "Nov 17, 2024", type: "inspection" },
      { id: "p17", text: "Ready for dispatch", date: "Nov 18, 2024", type: "general" }
    ]
  });
  const [newProgressEntry, setNewProgressEntry] = useState('');
  const [newProgressType, setNewProgressType] = useState('general');
  const [addEquipmentExpanded, setAddEquipmentExpanded] = useState(false);
  const [teamPositions, setTeamPositions] = useState<Record<string, Array<{id: string, position: string, name: string, email: string, phone: string, role: 'editor' | 'viewer'}>>>({
    // Sample custom team positions - only a few additional members
    "eq1": [
      { id: "t1", position: "Fabricator", name: "Sanjay Kumar", email: "sanjay.kumar@company.com", phone: "9876543210", role: "editor" },
      { id: "t2", position: "Engineer", name: "Neha Patel", email: "neha.patel@company.com", phone: "9876543211", role: "viewer" }
    ],
          "eq2": [
        { id: "t3", position: "Technician", name: "Ramesh Singh", email: "ramesh.singh@company.com", phone: "9876543212", role: "viewer" }
      ],
      "eq3": [
        { id: "t4", position: "Fabricator", name: "Ajay Verma", email: "ajay.verma@company.com", phone: "9876543213", role: "editor" }
      ]
  });
    const [newTeamPosition, setNewTeamPosition] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [newTeamPhone, setNewTeamPhone] = useState('');
  const [newTeamRole, setNewTeamRole] = useState<'editor' | 'viewer'>('viewer');
  const [defaultTeamContacts, setDefaultTeamContacts] = useState<Record<string, { email: string, phone: string }>>({});
  const [localEquipment, setLocalEquipment] = useState<Equipment[]>(equipment);
  const [imageMetadata, setImageMetadata] = useState<Record<string, Array<{id: string, description: string, uploadedBy: string, uploadDate: string}>>>({});
  const [documents, setDocuments] = useState<Record<string, Array<{id: string, file: File, name: string, uploadedBy: string, uploadDate: string}>>>({});
  const [newDocumentName, setNewDocumentName] = useState('');
  const [documentPreview, setDocumentPreview] = useState<{file: File, name: string} | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'on-track':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'nearing-completion':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getDisplayStatus = (equipment: Equipment) => {
    if (equipment.status === 'completed') return 'completed';
    if (equipment.status === 'delayed') return 'delayed';
    if (equipment.status === 'pending') return 'pending';
    
    if (equipment.poCdd !== 'To be scheduled') {
      try {
        const poCddDate = new Date(equipment.poCdd);
        const today = new Date();
        const timeDiff = poCddDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff <= 21 && daysDiff > 0) {
          return 'nearing-completion';
        }
      } catch (error) {
        console.log('Error parsing PO-CDD date:', error);
      }
    }
    
    return 'on-track';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'delayed':
        return 'Delayed';
      case 'on-track':
        return 'On Track';
      case 'nearing-completion':
        return 'Nearing Completion';
      case 'pending':
        return 'Pending';
      default:
        return 'On Track';
    }
  };

  const getRemainingDays = (poCdd: string) => {
    if (!poCdd || poCdd === 'To be scheduled') {
      return null;
    }
    
    try {
      const poCddDate = new Date(poCdd);
      const today = new Date();
      const timeDiff = poCddDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff < 0) {
        return `${Math.abs(daysDiff)} days overdue`;
      } else if (daysDiff === 0) {
        return 'Due today';
      } else if (daysDiff === 1) {
        return 'Due tomorrow';
      } else {
        return `${daysDiff} days remaining`;
      }
    } catch (error) {
      console.log('Error parsing PO-CDD date:', error);
      return null;
    }
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipmentId(equipment.id);
    setEditFormData({
      location: equipment.location || '',
      supervisor: equipment.supervisor || '',
      nextMilestone: equipment.nextMilestone || '',
      size: equipment.size || '',
      weight: equipment.weight || '',
      designCode: equipment.designCode || '',
      material: equipment.material || '',
      workingPressure: equipment.workingPressure || '',
      designTemp: equipment.designTemp || '',
      welder: equipment.welder || '',
      qcInspector: equipment.qcInspector || '',
      projectManager: equipment.projectManager || '',
      poCdd: equipment.poCdd || '',
      status: equipment.status || 'on-track'
    });
  };

  const handleMarkComplete = (equipment: Equipment) => {
    if (window.confirm(`Mark ${equipment.type} ${equipment.tagNumber} as completed and dispatched?`)) {
      // Update the equipment status to completed and progress phase to dispatched
      setLocalEquipment(prev => prev.map(eq => 
        eq.id === equipment.id 
          ? { 
              ...eq, 
              status: 'completed' as const,
              progressPhase: 'dispatched' as const,
              progress: 100
            }
          : eq
      ));
      
      console.log(`Equipment ${equipment.id} marked as completed and dispatched`);
      alert(`${equipment.type} ${equipment.tagNumber} marked as completed and dispatched!`);
    }
  };

  const handleProgressPhaseChange = (equipmentId: string, newPhase: 'documentation' | 'manufacturing' | 'testing' | 'dispatched') => {
    setLocalEquipment(prev => prev.map(eq => 
      eq.id === equipmentId 
        ? { ...eq, progressPhase: newPhase }
        : eq
    ));
    
    // Update progress based on phase
    let newProgress = 0;
    switch (newPhase) {
      case 'documentation':
        newProgress = 25;
        break;
      case 'manufacturing':
        newProgress = 50;
        break;
      case 'testing':
        newProgress = 75;
        break;
      case 'dispatched':
        newProgress = 100;
        break;
    }
    
    setLocalEquipment(prev => prev.map(eq => 
      eq.id === equipmentId 
        ? { ...eq, progress: newProgress }
        : eq
    ));
    
    console.log(`Equipment ${equipmentId} moved to ${newPhase} phase with ${newProgress}% progress`);
  };

  const handleDeleteEquipment = (equipment: Equipment) => {
    if (window.confirm(`Are you sure you want to delete ${equipment.type} ${equipment.tagNumber}? This action cannot be undone.`)) {
      // Remove the equipment from the local array
      setLocalEquipment(prev => prev.filter(eq => eq.id !== equipment.id));
      
      // Also remove any associated metadata
      setImageMetadata(prev => {
        const newMetadata = { ...prev };
        delete newMetadata[equipment.id];
        return newMetadata;
      });
      
      setProgressEntries(prev => {
        const newProgress = { ...prev };
        delete newProgress[equipment.id];
        return newProgress;
      });
      
      setTeamPositions(prev => {
        const newTeam = { ...prev };
        delete newTeam[equipment.id];
        return newTeam;
      });
      
      setDocuments(prev => {
        const newDocs = { ...prev };
        delete newDocs[equipment.id];
        return newDocs;
      });
      
      console.log(`Equipment ${equipment.id} deleted`);
      alert(`${equipment.type} ${equipment.tagNumber} deleted successfully!`);
    }
  };

  const handleSaveEquipment = () => {
    if (!editingEquipmentId) return;
    
    // TODO: Save to backend
    console.log('Equipment updated:', editFormData);
    
    // Update the local equipment data
    setLocalEquipment(prev => prev.map(eq => 
      eq.id === editingEquipmentId 
        ? { ...eq, ...editFormData, isBasicInfo: false }
        : eq
    ));
    
    // Call the update function to persist changes
    updateEquipmentData(editingEquipmentId, editFormData);
    
    // Reset edit mode
    setEditingEquipmentId(null);
    setEditFormData({});
    
    alert('Equipment updated successfully!');
  };

  // Add this function to actually update the equipment array
  const updateEquipmentData = (equipmentId: string, updates: Partial<Equipment>) => {
    // This would typically update the parent state
    // For now, we'll just log the update
    console.log(`Updating equipment ${equipmentId}:`, updates);
    
    // In a real implementation, you would call a prop function like:
    // onEquipmentUpdate(equipmentId, updates);
  };

  const handleAddNewEquipment = () => {
    // Validate required fields
    if (!newEquipmentType.trim() || !newEquipmentTagNumber.trim() || !newEquipmentMSN.trim() || !newEquipmentJobNumber.trim()) {
      alert('Please fill in all required fields: Equipment Type, Tag Number, MSN, and Job Number');
      return;
    }

    const newId = `eq${Date.now()}`;
    const newEquipmentItem: Equipment = {
      id: newId,
      type: newEquipmentType.trim(),
      tagNumber: newEquipmentTagNumber.trim(),
      jobNumber: newEquipmentJobNumber.trim(),
      manufacturingSerial: newEquipmentMSN.trim(),
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
    };
    
    setLocalEquipment(prev => [...prev, newEquipmentItem]);
    
    // Automatically put the new equipment into edit mode
    setEditingEquipmentId(newId);
    setEditFormData({
      type: newEquipmentType.trim(),
      tagNumber: newEquipmentTagNumber.trim(),
      jobNumber: newEquipmentJobNumber.trim(),
      manufacturingSerial: newEquipmentMSN.trim(),
      poCdd: "To be scheduled",
      status: "pending",
      location: "Not Assigned",
      supervisor: "Not Assigned"
    });
    
    // Reset form fields
    setNewEquipmentType('');
    setNewEquipmentTagNumber('');
    setNewEquipmentMSN('');
    setNewEquipmentJobNumber('');
    
    console.log('New equipment added and put into edit mode:', newEquipmentItem);
  };

  const addProgressEntry = (equipmentId: string) => {
    if (!newProgressEntry.trim()) return;
    
    const entry = {
      id: `progress-${Date.now()}`,
      text: newProgressEntry,
      date: new Date().toLocaleDateString(),
      type: newProgressType
    };
    
    setProgressEntries(prev => ({
      ...prev,
      [equipmentId]: [...(prev[equipmentId] || []), entry]
    }));
    
    // Reset form
    setNewProgressEntry('');
    setNewProgressType('general');
  };

  const removeProgressEntry = (equipmentId: string, entryId: string) => {
    setProgressEntries(prev => ({
      ...prev,
      [equipmentId]: prev[equipmentId]?.filter(entry => entry.id !== entryId) || []
    }));
  };

  const addTeamPosition = (equipmentId: string) => {
    if (!newTeamPosition.trim() || !newTeamName.trim()) return;
    
    const position = {
      id: `team-${Date.now()}`,
      position: newTeamPosition,
      name: newTeamName,
      email: newTeamEmail.trim(),
      phone: newTeamPhone.trim(),
      role: newTeamRole
    };
    
    setTeamPositions(prev => ({
      ...prev,
      [equipmentId]: [...(prev[equipmentId] || []), position]
    }));
    
    // Reset form
    setNewTeamPosition('');
    setNewTeamName('');
    setNewTeamEmail('');
    setNewTeamPhone('');
    setNewTeamRole('viewer');
  };

  const removeTeamPosition = (equipmentId: string, positionId: string) => {
    setTeamPositions(prev => ({
      ...prev,
      [equipmentId]: prev[equipmentId]?.filter(pos => pos.id !== positionId) || []
    }));
  };

  const handleCancelEdit = () => {
    setEditingEquipmentId(null);
    setEditFormData({});
  };

  const handleImageUpload = (file: File) => {
    setNewProgressImage(file);
  };

  const handleSaveProgressImage = () => {
    if (!newProgressImage || !imageDescription || !editingEquipmentId) return;
    
    // Create a URL for the uploaded image
    const imageUrl = URL.createObjectURL(newProgressImage);
    
    // Add the new image to the equipment's images array
    setLocalEquipment(prev => prev.map(eq => 
      eq.id === editingEquipmentId 
        ? { ...eq, images: [...eq.images, imageUrl] }
        : eq
    ));
    
    // Store the image metadata
    const newImageMetadata = {
      id: `img-${Date.now()}`,
      description: imageDescription,
      uploadedBy: 'Current User',
      uploadDate: new Date().toISOString()
    };
    
    setImageMetadata(prev => ({
      ...prev,
      [editingEquipmentId]: [...(prev[editingEquipmentId] || []), newImageMetadata]
    }));
    
    console.log('Progress image saved:', {
      file: newProgressImage,
      description: imageDescription,
      uploadedBy: 'Current User',
      uploadDate: new Date().toISOString(),
      equipmentId: editingEquipmentId
    });
    
    // Reset form
    setNewProgressImage(null);
    setImageDescription('');
    
    alert('Progress image uploaded successfully!');
  };

  const handleDocumentUpload = (equipmentId: string, files: File[]) => {
    const newDocuments = files.map(file => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      file: file,
      name: file.name, // Default to original filename
      uploadedBy: 'Current User',
      uploadDate: new Date().toISOString()
    }));
    
    setDocuments(prev => ({
      ...prev,
      [equipmentId]: [...(prev[equipmentId] || []), ...newDocuments]
    }));
    
    console.log('Documents uploaded:', newDocuments);
  };

  const handleDocumentNameChange = (equipmentId: string, documentId: string, newName: string) => {
    setDocuments(prev => ({
      ...prev,
      [equipmentId]: prev[equipmentId]?.map(doc => 
        doc.id === documentId ? { ...doc, name: newName } : doc
      ) || []
    }));
  };

  const handleDeleteDocument = (equipmentId: string, documentId: string) => {
    setDocuments(prev => ({
      ...prev,
      [equipmentId]: prev[equipmentId]?.filter(doc => doc.id !== documentId) || []
    }));
  };

  const handleOpenDocument = (document: {file: File, name: string}) => {
    setDocumentPreview(document);
  };

  const handleAddEquipment = (newEquipment: any) => {
    console.log('New equipment added:', newEquipment);
    setShowAddEquipmentForm(false);
  };

  const totalEquipment = localEquipment.length;
  
  // Categorize equipment based on completion level
  const categorizeEquipment = (equipment: Equipment) => {
    // Check if equipment has substantial data beyond basic info
    const hasPO = equipment.poCdd && equipment.poCdd !== 'To be scheduled';
    const hasTechnical = equipment.size || equipment.weight || equipment.designCode || equipment.material || equipment.workingPressure || equipment.designTemp;
    const hasTeam = equipment.supervisor || equipment.welder || equipment.qcInspector || equipment.projectManager;
    const hasProgress = equipment.images && equipment.images.length > 0;
    const hasDocuments = equipment.documents && equipment.documents.length > 0;
    
    // Debug logging
    console.log(`Equipment ${equipment.id} categorization:`, {
      hasPO,
      hasTechnical,
      hasTeam,
      hasProgress,
      hasDocuments,
      poCdd: equipment.poCdd,
      size: equipment.size,
      supervisor: equipment.supervisor,
      imageCount: equipment.images?.length || 0,
      documentCount: equipment.documents?.length || 0
    });
    
    // Complete: Has PO-CDD, technical specs, team assignments, and progress
    if (hasPO && hasTechnical && hasTeam && (hasProgress || hasDocuments)) {
      console.log(`Equipment ${equipment.id} categorized as: COMPLETE`);
      return 'complete';
    }
    
    // Partial: Has some data but not complete
    if (hasPO || hasTechnical || hasTeam || hasProgress || hasDocuments) {
      console.log(`Equipment ${equipment.id} categorized as: PARTIAL`);
      return 'partial';
    }
    
    // Basic: Only basic identification info
    console.log(`Equipment ${equipment.id} categorized as: BASIC`);
    return 'basic';
  };
  
  const completeEquipment = localEquipment.filter(eq => categorizeEquipment(eq) === 'complete').length;
  const partialEquipment = localEquipment.filter(eq => categorizeEquipment(eq) === 'partial').length;
  const basicInfoEquipment = localEquipment.filter(eq => categorizeEquipment(eq) === 'basic').length;

  return (
    <div className="space-y-6">





      {/* Expandable Add New Equipment Form */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setAddEquipmentExpanded(!addEquipmentExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Add New Equipment</h3>
              <p className="text-sm text-gray-500">Click here to add new equipment to the project</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform ${addEquipmentExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {addEquipmentExpanded && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Equipment Type *</Label>
                <Input
                  placeholder="e.g., Pressure Vessel"
                  value={newEquipmentType}
                  onChange={(e) => setNewEquipmentType(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Tag Number *</Label>
                <Input
                  placeholder="e.g., PV-001"
                  value={newEquipmentTagNumber}
                  onChange={(e) => setNewEquipmentTagNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">MSN *</Label>
                <Input
                  placeholder="e.g., PV-001-2024-REL"
                  value={newEquipmentMSN}
                  onChange={(e) => setNewEquipmentMSN(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Job Number *</Label>
                <Input
                  placeholder="e.g., JOB-2024-001"
                  value={newEquipmentJobNumber}
                  onChange={(e) => setNewEquipmentJobNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleAddNewEquipment} className="bg-blue-600 hover:bg-blue-700">
                <Plus size={16} className="mr-2" />
                Add Equipment
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Phase Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Equipment Phase Tabs">
                        <button
              onClick={() => setSelectedPhase('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedPhase === 'all'
                  ? 'border-gray-500 text-gray-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Show All
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {localEquipment.length}
              </span>
                        </button>
                        <button
              onClick={() => setSelectedPhase('documentation')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedPhase === 'documentation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documentation
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {localEquipment.filter(eq => eq.progressPhase === 'documentation').length}
              </span>
                        </button>
            <button
              onClick={() => setSelectedPhase('manufacturing')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedPhase === 'manufacturing'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manufacturing
              <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {localEquipment.filter(eq => eq.progressPhase === 'manufacturing').length}
              </span>
            </button>
            <button
              onClick={() => setSelectedPhase('testing')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedPhase === 'testing'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Testing
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {localEquipment.filter(eq => eq.progressPhase === 'testing').length}
              </span>
            </button>
            <button
              onClick={() => setSelectedPhase('dispatched')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedPhase === 'dispatched'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dispatched
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {localEquipment.filter(eq => eq.progressPhase === 'dispatched').length}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localEquipment
          .filter(eq => selectedPhase === 'all' ? true : eq.progressPhase === selectedPhase)
          .sort((a, b) => {
            // Sort by lastUpdate date (descending - latest first)
            if (a.lastUpdate && b.lastUpdate) {
              const dateA = new Date(a.lastUpdate);
              const dateB = new Date(b.lastUpdate);
              return dateB.getTime() - dateA.getTime();
            }
            // If no lastUpdate, sort by ID (newer IDs first)
            return b.id.localeCompare(a.id);
          })
          .map((item) => (
                          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow relative bg-gray-50 border border-gray-200 min-h-[280px] sm:min-h-[300px]">
                  <div className="p-3 sm:p-4">
                              {/* PO-CDD Timer Section */}
                <div className="mb-3 sm:mb-4 p-2 bg-gray-50 border border-gray-200 rounded-md">
                {editingEquipmentId === item.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">PO-CDD</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600">PO-CDD Date</Label>
                        <Input 
                          type="date"
                          value={editFormData.poCdd || item.poCdd}
                          onChange={(e) => setEditFormData({...editFormData, poCdd: e.target.value})}
                          className="text-xs h-8"
                        />
                        </div>
                      <div>
                        <Label className="text-xs text-gray-600">Status</Label>
                        <Select 
                          value={editFormData.status || item.status}
                          onValueChange={(value) => setEditFormData({...editFormData, status: value as any})}
                        >
                          <SelectTrigger className="text-xs h-8">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="on-track">On Track</SelectItem>
                            <SelectItem value="delayed">Delayed</SelectItem>
                            <SelectItem value="nearing-completion">Nearing Completion</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">PO-CDD</span>
                    </div>
                    <div className="text-sm font-medium text-gray-800 ml-4">
                      {item.poCdd}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Image Section */}
              <div className="mb-4">
                {editingEquipmentId === item.id ? (
                  // Edit Mode - Upload new progress image
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">Progress Image</div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                        id={`image-upload-${item.id}`}
                      />
                      <label htmlFor={`image-upload-${item.id}`} className="cursor-pointer">
                        <Camera size={24} className="mx-auto text-gray-400 mb-2" />
                        <div className="text-sm text-gray-600">
                          {newProgressImage ? newProgressImage.name : 'Click to upload image'}
                        </div>
                      </label>
                    </div>
                    <Input
                      placeholder="Describe what this image shows..."
                      value={imageDescription}
                      onChange={(e) => setImageDescription(e.target.value)}
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveProgressImage}
                      disabled={!newProgressImage || !imageDescription}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload size={14} className="mr-2" />
                      Save Progress Image
                    </Button>
                  </div>
                ) : (
                  // View Mode - Show progress image
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Progress Image</div>
                    {item.images && item.images.length > 0 ? (
                                              <div 
                          className="relative cursor-pointer group"
                          onClick={() => {
                            const latestIndex = item.images.length - 1;
                            setShowImagePreview({url: item.images[latestIndex], equipmentId: item.id, currentIndex: latestIndex});
                          }}
                        >
                        <img
                          src={item.images[item.images.length - 1]}
                          alt="Progress"
                          className="w-full h-64 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                          <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Camera size={24} className="mx-auto mb-2" />
                          <div className="text-sm">No progress image</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">
                      {item.name || `${item.type} ${item.tagNumber}`}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.type}</p>
                    <div className="flex flex-col gap-1 mt-1 text-xs text-gray-500">
                      <span className="truncate">MSN: {item.manufacturingSerial || '—'}</span>
                      <span className="truncate">Job: {item.jobNumber || '—'}</span>
                  </div>
                </div>
                  
                  {/* Phase Status Dropdown */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Select 
                      value={item.progressPhase}
                      onValueChange={(value) => handleProgressPhaseChange(item.id, value as 'documentation' | 'manufacturing' | 'testing' | 'dispatched')}
                    >
                      <SelectTrigger className="w-28 sm:w-32 md:w-36 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="documentation">Documentation</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="dispatched">Dispatched</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                                {/* Days Counter - Responsive positioning for all screen sizes */}
                <div className="absolute top-4 sm:top-5 md:top-6 right-4 sm:right-5 md:right-6 text-right max-w-[120px] sm:max-w-[140px] md:max-w-[160px]">
                  {item.progressPhase === 'dispatched' ? (
                    // Dispatched - show dispatch date
                    <div className="text-right">
                      <div className="text-xs text-gray-500 font-medium truncate">Dispatched on</div>
                      <div className="text-sm font-bold text-green-700 truncate">{item.poCdd}</div>
                    </div>
                  ) : item.poCdd && item.poCdd !== 'To be scheduled' ? (
                    // Equipment with deadline - show days
                    (() => {
                      try {
                        const poCddDate = new Date(item.poCdd);
                        const today = new Date();
                        const timeDiff = poCddDate.getTime() - today.getTime();
                        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        
                        if (daysDiff < 0) {
                          // Overdue - Red
                          return (
                            <div className="text-right">
                              <div className="text-xs text-gray-500 font-medium truncate">Days to Completion Date</div>
                              <div className="text-sm font-bold text-red-700 truncate">{Math.abs(daysDiff)} days overdue</div>
                            </div>
                          );
                        } else {
                          // On track - Blue
                          return (
                            <div className="text-right">
                              <div className="text-xs text-gray-500 font-medium truncate">Days to Completion Date</div>
                              <div className="text-sm font-bold text-blue-700 truncate">{daysDiff} days to go</div>
                            </div>
                          );
                        }
                      } catch (error) {
                        return (
                          <div className="text-right">
                            <div className="text-xs text-gray-500 font-medium truncate">Days to Completion Date</div>
                            <div className="text-sm font-bold text-gray-600 truncate">No deadline set</div>
                          </div>
                        );
                      }
                    })()
                  ) : (
                    // No deadline set - Gray
                    <div className="text-right">
                      <div className="text-xs text-gray-500 font-medium truncate">Days to Completion Date</div>
                      <div className="text-sm font-bold text-gray-600 truncate">No deadline set</div>
                    </div>
                  )}
                </div>





                <Tabs defaultValue="technical" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 h-8 sm:h-9">
                    <TabsTrigger value="technical" className="text-xs px-2 sm:px-3">Technical</TabsTrigger>
                    <TabsTrigger value="team" className="text-xs px-2 sm:px-3">Team</TabsTrigger>
                    <TabsTrigger value="progress" className="text-xs px-2 sm:px-3">Progress</TabsTrigger>
                    <TabsTrigger value="documents" className="text-xs px-2 sm:px-3">Docs</TabsTrigger>
                  </TabsList>

                <TabsContent value="technical" className="mt-3 sm:mt-4 space-y-2">
                  <div className="space-y-2 text-xs sm:text-sm">
                    {editingEquipmentId === item.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                      <div>
                            <Label className="text-xs text-gray-600">Size</Label>
                            <Input 
                              placeholder="e.g., 2.5m x 1.2m"
                              value={editFormData.size || ''}
                              onChange={(e) => setEditFormData({...editFormData, size: e.target.value})}
                              className="text-xs h-8"
                            />
                      </div>
                      <div>
                            <Label className="text-xs text-gray-600">Weight (kg)</Label>
                            <Input 
                              placeholder="e.g., 850"
                              value={editFormData.weight || ''}
                              onChange={(e) => setEditFormData({...editFormData, weight: e.target.value})}
                              className="text-xs h-8"
                            />
                      </div>
                      <div>
                            <Label className="text-xs text-gray-600">Design Code</Label>
                            <Input 
                              placeholder="e.g., ASME VIII"
                              value={editFormData.designCode || ''}
                              onChange={(e) => setEditFormData({...editFormData, designCode: e.target.value})}
                              className="text-xs h-8"
                            />
                      </div>
                      <div>
                            <Label className="text-xs text-gray-600">Material</Label>
                            <Input 
                              placeholder="e.g., SS 316L"
                              value={editFormData.material || ''}
                              onChange={(e) => setEditFormData({...editFormData, material: e.target.value})}
                              className="text-xs h-8"
                            />
                      </div>
                          <div>
                            <Label className="text-xs text-gray-600">Working Pressure</Label>
                            <Input 
                              placeholder="e.g., 16 bar"
                              value={editFormData.workingPressure || ''}
                              onChange={(e) => setEditFormData({...editFormData, workingPressure: e.target.value})}
                              className="text-xs h-8"
                            />
                    </div>
                          <div>
                            <Label className="text-xs text-gray-600">Design Temp</Label>
                            <Input 
                              placeholder="e.g., 200°C"
                              value={editFormData.designTemp || ''}
                              onChange={(e) => setEditFormData({...editFormData, designTemp: e.target.value})}
                              className="text-xs h-8"
                            />
                    </div>
                      </div>
                      </div>
                    ) : (
                      // View Mode - Use same grid layout
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                          <span className="text-gray-600 text-xs">Size</span>
                          <span className="text-xs text-gray-500 italic">{item.size || '—'}</span>
                      </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                          <span className="text-gray-600 text-xs">Weight</span>
                          <span className="text-xs text-gray-500 italic">{item.weight || '—'}</span>
                      </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                          <span className="text-gray-600 text-xs">Design Code</span>
                          <span className="text-xs text-gray-500 italic">{item.designCode || '—'}</span>
                    </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                          <span className="text-gray-600 text-xs">Material</span>
                          <span className="text-xs text-gray-500 italic">{item.material || '—'}</span>
                      </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                          <span className="text-gray-600 text-xs">Working Pressure</span>
                          <span className="text-xs text-gray-500 italic">{item.workingPressure || '—'}</span>
                      </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                          <span className="text-gray-600 text-xs">Design Temp</span>
                          <span className="text-xs text-gray-500 italic">{item.designTemp || '—'}</span>
                      </div>
                      </div>
                    )}
                    </div>
                  </TabsContent>

                <TabsContent value="team" className="mt-4 space-y-2">
                    <div className="space-y-2 text-sm">
                    {editingEquipmentId === item.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        {/* Standard Team Positions */}
                        <div className="space-y-4">
                          {/* Supervisor */}
                          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <Label className="text-xs text-gray-600 font-medium">Supervisor</Label>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              <Input 
                                placeholder="Assign supervisor"
                                value={editFormData.supervisor || ''}
                                onChange={(e) => setEditFormData({...editFormData, supervisor: e.target.value})}
                                className="text-xs h-8"
                              />
                              <Input 
                                placeholder="Email"
                                type="email"
                                value={editFormData.supervisorEmail || ''}
                                onChange={(e) => setEditFormData({...editFormData, supervisorEmail: e.target.value})}
                                className="text-xs h-8"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address"
                              />
                              <Input 
                                placeholder="Phone"
                                type="tel"
                                value={editFormData.supervisorPhone || ''}
                                onChange={(e) => setEditFormData({...editFormData, supervisorPhone: e.target.value})}
                                className="text-xs h-8"
                                pattern="[0-9]{10}"
                                title="Please enter a 10-digit phone number"
                                maxLength={10}
                              />
                              <Select 
                                value={editFormData.supervisorRole || 'viewer'}
                                onValueChange={(value: 'editor' | 'viewer') => setEditFormData({...editFormData, supervisorRole: value})}
                              >
                                <SelectTrigger className="text-xs h-8">
                                  <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                  <SelectItem value="editor">Editor</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Welder */}
                          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <Label className="text-xs text-gray-600 font-medium">Welder</Label>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              <Input 
                                placeholder="Assign welder"
                                value={editFormData.welder || ''}
                                onChange={(e) => setEditFormData({...editFormData, welder: e.target.value})}
                                className="text-xs h-8"
                              />
                              <Input 
                                placeholder="Email"
                                type="email"
                                value={editFormData.welderEmail || ''}
                                onChange={(e) => setEditFormData({...editFormData, welderEmail: e.target.value})}
                                className="text-xs h-8"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address"
                              />
                              <Input 
                                placeholder="Phone"
                                type="tel"
                                value={editFormData.welderPhone || ''}
                                onChange={(e) => setEditFormData({...editFormData, welderPhone: e.target.value})}
                                className="text-xs h-8"
                                pattern="[0-9]{10}"
                                title="Please enter a 10-digit phone number"
                                maxLength={10}
                              />
                              <Select 
                                value={editFormData.welderRole || 'viewer'}
                                onValueChange={(value: 'editor' | 'viewer') => setEditFormData({...editFormData, welderRole: value})}
                              >
                                <SelectTrigger className="text-xs h-8">
                                  <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                  <SelectItem value="editor">Editor</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* QC Inspector */}
                          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <Label className="text-xs text-gray-600 font-medium">QC Inspector</Label>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              <Input 
                                placeholder="Assign inspector"
                                value={editFormData.qcInspector || ''}
                                onChange={(e) => setEditFormData({...editFormData, qcInspector: e.target.value})}
                                className="text-xs h-8"
                              />
                              <Input 
                                placeholder="Email"
                                type="email"
                                value={editFormData.qcInspectorEmail || ''}
                                onChange={(e) => setEditFormData({...editFormData, qcInspectorEmail: e.target.value})}
                                className="text-xs h-8"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address"
                              />
                              <Input 
                                placeholder="Phone"
                                type="tel"
                                value={editFormData.qcInspectorPhone || ''}
                                onChange={(e) => setEditFormData({...editFormData, qcInspectorPhone: e.target.value})}
                                className="text-xs h-8"
                                pattern="[0-9]{10}"
                                title="Please enter a 10-digit phone number"
                                maxLength={10}
                              />
                              <Select 
                                value={editFormData.qcInspectorRole || 'viewer'}
                                onValueChange={(value: 'editor' | 'viewer') => setEditFormData({...editFormData, qcInspectorRole: value})}
                              >
                                <SelectTrigger className="text-xs h-8">
                                  <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                  <SelectItem value="editor">Editor</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Project Manager */}
                          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <Label className="text-xs text-gray-600 font-medium">Project Manager</Label>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              <Input 
                                placeholder="Assign PM"
                                value={editFormData.projectManager || ''}
                                onChange={(e) => setEditFormData({...editFormData, projectManager: e.target.value})}
                                className="text-xs h-8"
                              />
                              <Input 
                                placeholder="Email"
                                type="email"
                                value={editFormData.projectManagerEmail || ''}
                                onChange={(e) => setEditFormData({...editFormData, projectManagerEmail: e.target.value})}
                                className="text-xs h-8"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address"
                              />
                              <Input 
                                placeholder="Phone"
                                type="tel"
                                value={editFormData.projectManagerPhone || ''}
                                onChange={(e) => setEditFormData({...editFormData, projectManagerPhone: e.target.value})}
                                className="text-xs h-8"
                                pattern="[0-9]{10}"
                                title="Please enter a 10-digit phone number"
                                maxLength={10}
                              />
                              <Select 
                                value={editFormData.projectManagerRole || 'viewer'}
                                onValueChange={(value: 'editor' | 'viewer') => setEditFormData({...editFormData, projectManagerRole: value})}
                              >
                                <SelectTrigger className="text-xs h-8">
                                  <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                  <SelectItem value="editor">Editor</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Add New Team Position */}
                        <div className="border-t pt-3">
                          <div className="text-xs font-medium text-gray-700 mb-2">Add New Team Position:</div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-gray-600">Position</Label>
                              <Input 
                                placeholder="e.g., Fabricator, Engineer"
                                value={newTeamPosition}
                                onChange={(e) => setNewTeamPosition(e.target.value)}
                                className="text-xs h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Name</Label>
                              <Input 
                                placeholder="Assign person name"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                className="text-xs h-8"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 mt-3">
                            <div>
                              <Label className="text-xs text-gray-600">Email</Label>
                              <Input 
                                placeholder="Enter email address"
                                type="email"
                                value={newTeamEmail}
                                onChange={(e) => setNewTeamEmail(e.target.value)}
                                className="text-xs h-8"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Phone</Label>
                              <Input 
                                placeholder="Enter phone number"
                                type="tel"
                                value={newTeamPhone}
                                onChange={(e) => setNewTeamPhone(e.target.value)}
                                className="text-xs h-8"
                                pattern="[0-9]{10}"
                                title="Please enter a 10-digit phone number"
                                maxLength={10}
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Role</Label>
                              <Select 
                                value={newTeamRole}
                                onValueChange={(value: 'editor' | 'viewer') => setNewTeamRole(value)}
                              >
                                <SelectTrigger className="text-xs h-8">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                  <SelectItem value="editor">Editor</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addTeamPosition(item.id)}
                            disabled={!newTeamPosition.trim() || !newTeamName.trim()}
                            className="w-full mt-2 bg-green-600 hover:bg-green-700 text-xs"
                          >
                            <Plus size={14} className="mr-2" />
                            Add Team Position
                          </Button>
                        </div>

                        {/* Custom Team Positions List */}
                        {teamPositions[item.id] && teamPositions[item.id].length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-gray-700">Custom Team Positions:</div>
                            {teamPositions[item.id].map((pos) => (
                              <div key={pos.id} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="text-xs font-medium text-green-800">{pos.position}</div>
                                    <Badge variant={pos.role === 'editor' ? 'default' : 'secondary'} className="text-xs">
                                      {pos.role}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-green-700">{pos.name}</div>
                                  {pos.email && (
                                    <div className="text-xs text-green-600">{pos.email}</div>
                                  )}
                                  {pos.phone && (
                                    <div className="text-xs text-green-600">{pos.phone}</div>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeTeamPosition(item.id, pos.id)}
                                  className="text-red-600 hover:text-red-700 p-1 h-6 w-6"
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // View Mode - Show all team positions
                      <div className="space-y-2">
                        {/* Standard Team Positions */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2 bg-gray-50 rounded border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-600 text-xs">Supervisor</span>
                              <span className="text-xs text-gray-500 italic">{item.supervisor || '—'}</span>
                            </div>
                            {item.supervisorEmail && (
                              <div className="text-xs text-gray-500 truncate">{item.supervisorEmail}</div>
                            )}
                            {item.supervisorPhone && (
                              <div className="text-xs text-gray-500">{item.supervisorPhone}</div>
                            )}
                          </div>
                          <div className="p-2 bg-gray-50 rounded border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-600 text-xs">Welder</span>
                              <span className="text-xs text-gray-500 italic">{item.welder || '—'}</span>
                            </div>
                            {item.welderEmail && (
                              <div className="text-xs text-gray-500 truncate">{item.welderEmail}</div>
                            )}
                            {item.welderPhone && (
                              <div className="text-xs text-gray-500">{item.welderPhone}</div>
                            )}
                          </div>
                          <div className="p-2 bg-gray-50 rounded border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-600 text-xs">QC Inspector</span>
                              <span className="text-xs text-gray-500 italic">{item.qcInspector || '—'}</span>
                            </div>
                            {item.qcInspectorEmail && (
                              <div className="text-xs text-gray-500 truncate">{item.qcInspectorEmail}</div>
                            )}
                            {item.qcInspectorPhone && (
                              <div className="text-xs text-gray-500">{item.qcInspectorPhone}</div>
                            )}
                          </div>
                          <div className="p-2 bg-gray-50 rounded border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-600 text-xs">Project Manager</span>
                              <span className="text-xs text-gray-500 italic">{item.projectManager || '—'}</span>
                            </div>
                            {item.projectManagerEmail && (
                              <div className="text-xs text-gray-500 truncate">{item.projectManagerEmail}</div>
                            )}
                            {item.projectManagerPhone && (
                              <div className="text-xs text-gray-500">{item.projectManagerPhone}</div>
                            )}
                          </div>
                        </div>

                        {/* Custom Team Positions - Only show if more than 4 default members */}
                        {teamPositions[item.id] && teamPositions[item.id].length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs font-medium text-gray-700 mb-2">Additional Team Members:</div>
                            <div className="h-28 overflow-y-auto border border-gray-200 rounded bg-gray-50 p-2">
                              <div className="grid grid-cols-2 gap-2">
                                {teamPositions[item.id].map((pos) => (
                                  <div key={pos.id} className="flex items-center justify-between p-1 bg-gray-50 rounded border border-gray-200">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-600 text-xs">{pos.position}</span>
                                        <span className="text-xs text-gray-500 italic">{pos.name}</span>
                                        <Badge variant={pos.role === 'editor' ? 'default' : 'secondary'} className="text-xs">
                                          {pos.role}
                                        </Badge>
                                      </div>
                                      {pos.email && (
                                        <div className="text-xs text-gray-500 truncate">{pos.email}</div>
                                      )}
                                      {pos.phone && (
                                        <div className="text-xs text-gray-500 truncate">{pos.phone}</div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    </div>
                  </TabsContent>

                <TabsContent value="progress" className="mt-4 space-y-2">
                    <div className="space-y-2 text-sm">
                    {editingEquipmentId === item.id ? (
                      // Edit Mode - Add Progress Entries
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-gray-600">Progress Type</Label>
                            <Select 
                              value={newProgressType}
                              onValueChange={setNewProgressType}
                            >
                              <SelectTrigger className="text-xs h-8">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="welding">Welding</SelectItem>
                                <SelectItem value="material">Material</SelectItem>
                                <SelectItem value="inspection">Inspection</SelectItem>
                                <SelectItem value="assembly">Assembly</SelectItem>
                                <SelectItem value="testing">Testing</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                              </SelectContent>
                            </Select>
                        </div>
                          <div>
                            <Label className="text-xs text-gray-600">Progress Entry</Label>
                            <Input 
                              placeholder="e.g., Welding started, Raw material requested"
                              value={newProgressEntry}
                              onChange={(e) => setNewProgressEntry(e.target.value)}
                              className="text-xs h-8"
                            />
                      </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addProgressEntry(item.id)}
                          disabled={!newProgressEntry.trim()}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                        >
                          <Plus size={14} className="mr-2" />
                          Add Progress Entry
                        </Button>
                        
                                                {/* Progress Entries List */}
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-gray-700">Recent Progress:</div>
                          <div className="h-36 overflow-y-auto border border-gray-200 rounded bg-gray-50 p-2">
                            {progressEntries[item.id]?.map((entry) => (
                              <div key={entry.id} className="flex items-center justify-between p-1 bg-blue-50 rounded border border-blue-200 mb-1 last:mb-0">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-blue-800">{entry.type}</span>
                                    <span className="text-xs text-blue-600">{entry.date}</span>
                      </div>
                                  <div className="text-xs text-blue-700 truncate">{entry.text}</div>
                      </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeProgressEntry(item.id, entry.id)}
                                  className="text-red-600 hover:text-red-700 p-1 h-6 w-6 flex-shrink-0"
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            ))}
                      </div>
                        </div>
                      </div>
                    ) : (
                      // View Mode - Show Progress Entries
                      <div className="space-y-2">
                        {progressEntries[item.id] && progressEntries[item.id].length > 0 ? (
                          <div className="h-36 overflow-y-auto border border-gray-200 rounded bg-gray-50 p-2">
                            {progressEntries[item.id].map((entry) => (
                              <div key={entry.id} className="flex items-center justify-between p-1 bg-gray-50 rounded border border-gray-200 mb-1 last:mb-0">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-800">{entry.type}</span>
                                    <span className="text-xs text-gray-600">{entry.date}</span>
                                  </div>
                                  <div className="text-xs text-gray-700 truncate">{entry.text}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                            <span className="text-gray-600 text-xs">Progress</span>
                            <span className="text-xs text-gray-500 italic">No progress entries yet</span>
                          </div>
                        )}
                      </div>
                    )}
                    </div>
                  </TabsContent>

                <TabsContent value="documents" className="mt-4 space-y-2">
                  <div className="space-y-2 text-sm">
                    {editingEquipmentId === item.id ? (
                      // Edit Mode - Upload Documents
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.dxf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              handleDocumentUpload(item.id, files);
                            }}
                            className="hidden"
                            id={`docs-upload-${item.id}`}
                          />
                          <label htmlFor={`docs-upload-${item.id}`} className="cursor-pointer">
                            <FileText size={24} className="mx-auto text-gray-400 mb-2" />
                            <div className="text-sm text-gray-600">
                              Click to upload documents
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              PDF, DOC, XLS, DWG, Images supported
                          </div>
                          </label>
                        </div>
                        
                                                {/* Uploaded Documents List */}
                      <div className="space-y-2">
                          <div className="text-xs font-medium text-gray-700">Uploaded Documents:</div>
                          <div className="h-36 overflow-y-auto border border-gray-200 rounded bg-gray-50 p-2">
                            {documents[item.id] && documents[item.id].length > 0 ? (
                              documents[item.id].map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-1 bg-blue-50 rounded border border-blue-200 mb-1 last:mb-0">
                                  <div className="flex-1 cursor-pointer" onClick={() => handleOpenDocument(doc)}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <FileText size={14} className="text-blue-600" />
                                      <span className="text-xs font-medium text-blue-800 hover:text-blue-900">{doc.name}</span>
                          </div>
                                    <div className="text-xs text-blue-600">
                                      {new Date(doc.uploadDate).toLocaleDateString()} • {doc.uploadedBy}
                        </div>
                          </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        const newName = prompt('Enter document name:', doc.name);
                                        if (newName && newName.trim()) {
                                          handleDocumentNameChange(item.id, doc.id, newName.trim());
                                        }
                                      }}
                                      className="text-blue-600 hover:text-blue-700 p-1 h-6 w-6"
                                    >
                                      <Edit size={12} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteDocument(item.id, doc.id)}
                                      className="text-red-600 hover:text-red-700 p-1 h-6 w-6"
                                    >
                                      <X size={12} />
                                    </Button>
                        </div>
                      </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-500 italic">No documents uploaded yet</div>
                            )}
                        </div>
                        </div>
                      </div>
                    ) : (
                                              // View Mode - Show Documents
                        <div className="space-y-2">
                          <div className="h-36 overflow-y-auto border border-gray-200 rounded bg-gray-50 p-2">
                            {documents[item.id] && documents[item.id].length > 0 ? (
                              documents[item.id].map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-1 bg-gray-50 rounded border border-gray-200 mb-1 last:mb-0">
                                  <div className="flex-1 cursor-pointer" onClick={() => handleOpenDocument(doc)}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <FileText size={14} className="text-gray-500" />
                                      <span className="text-xs font-medium text-gray-800 hover:text-gray-900">{doc.name}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(doc.uploadDate).toLocaleDateString()} • {doc.uploadedBy}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                                <span className="text-gray-600 text-xs">Documents</span>
                                <span className="text-xs text-gray-500 italic">No documents uploaded</span>
                      </div>
                    )}
                          </div>
                      </div>
                    )}
                  </div>
                  </TabsContent>
                </Tabs>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                {editingEquipmentId === item.id ? (
                  // Edit Mode - Show Save/Cancel
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700"
                      onClick={handleCancelEdit}
                    >
                      <X size={14} className="mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={handleSaveEquipment}
                    >
                      <Check size={14} className="mr-1" />
                      Save
                    </Button>
                  </>
                ) : (
                  // View Mode - Show Edit/Complete/Delete
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700"
                      onClick={() => handleEditEquipment(item)}
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-white hover:bg-green-50 border-green-200 hover:border-green-300 text-green-700"
                      onClick={() => handleMarkComplete(item)}
                    >
                      <Check size={14} className="mr-1" />
                      Complete
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-white hover:bg-red-50 border-red-200 hover:border-red-300 text-red-700"
                      onClick={() => handleDeleteEquipment(item)}
                    >
                      <X size={14} className="mr-1" />
                      Delete
                    </Button>
                  </>
                )}
                  </div>
                  </div>
          </Card>
        ))}
                </div>

            {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Progress Image</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImagePreview(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
                </Button>
              </div>
            <div className="relative">
              {/* Image with Navigation Overlay */}
              <div className="relative">
                <img
                  src={showImagePreview.url}
                  alt="Progress"
                  className="w-full h-auto rounded-lg border border-gray-200"
                />
                
                {/* Image Navigation - Left/Right Sides like Carousel */}
                {(() => {
                  const currentEquipment = localEquipment.find(eq => eq.id === showImagePreview.equipmentId);
                  const images = currentEquipment?.images || [];
                  
                  if (images.length > 1) {
                    return (
                      <>
                        {/* Left Navigation Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const prevIndex = showImagePreview.currentIndex > 0 ? showImagePreview.currentIndex - 1 : images.length - 1;
                            setShowImagePreview({url: images[prevIndex], equipmentId: showImagePreview.equipmentId, currentIndex: prevIndex});
                          }}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-gray-300 shadow-lg"
                        >
                          <ChevronLeft size={20} />
                        </Button>
                        
                        {/* Right Navigation Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const nextIndex = showImagePreview.currentIndex < images.length - 1 ? showImagePreview.currentIndex + 1 : 0;
                            setShowImagePreview({url: images[nextIndex], equipmentId: showImagePreview.equipmentId, currentIndex: nextIndex});
                          }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-gray-300 shadow-lg"
                        >
                          <ChevronRight size={20} />
                        </Button>
                        
                        {/* Image Counter - Top Center */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          {showImagePreview.currentIndex + 1} of {images.length}
                        </div>
                      </>
                    );
                  }
                  return null;
                })()}
      </div>
              
              <div className="space-y-2 mt-4">
                <div className="text-sm text-gray-600">
                  <strong>Description:</strong> {(() => {
                    const currentEquipment = localEquipment.find(eq => eq.id === showImagePreview.equipmentId);
                    const metadata = imageMetadata[showImagePreview.equipmentId] || [];
                    const currentMetadata = metadata[showImagePreview.currentIndex];
                    
                    return currentMetadata?.description || "Progress image";
                  })()}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Uploaded by:</strong> {(() => {
                    const currentEquipment = localEquipment.find(eq => eq.id === showImagePreview.equipmentId);
                    const metadata = imageMetadata[showImagePreview.equipmentId] || [];
                    const currentMetadata = metadata[showImagePreview.currentIndex];
                    
                    return currentMetadata?.uploadedBy || "Team Member";
                  })()}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Date:</strong> {(() => {
                    const currentEquipment = localEquipment.find(eq => eq.id === showImagePreview.equipmentId);
                    const metadata = imageMetadata[showImagePreview.equipmentId] || [];
                    const currentMetadata = metadata[showImagePreview.currentIndex];
                    
                    if (currentMetadata?.uploadDate) {
                      return new Date(currentMetadata.uploadDate).toLocaleDateString();
                    }
                    return new Date().toLocaleDateString();
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {documentPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Document: {documentPreview.name}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Create a download link for the file
                    const url = URL.createObjectURL(documentPreview.file);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = documentPreview.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <FileText size={16} className="mr-2" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDocumentPreview(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* File Type Preview */}
              {documentPreview.file.type.startsWith('image/') ? (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(documentPreview.file)}
                    alt={documentPreview.name}
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                  />
                </div>
              ) : documentPreview.file.type === 'application/pdf' ? (
                <div className="text-center">
                  <iframe
                    src={URL.createObjectURL(documentPreview.file)}
                    className="w-full h-96 border border-gray-200 rounded-lg"
                    title={documentPreview.name}
                  />
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded border border-gray-200">
                  <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                  <div className="text-lg font-medium text-gray-600 mb-2">{documentPreview.name}</div>
                  <div className="text-sm text-gray-500 mb-4">
                    File type: {documentPreview.file.type || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Size: {(documentPreview.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              )}
              
              {/* File Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">File Name:</span>
                    <div className="text-gray-600">{documentPreview.name}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">File Type:</span>
                    <div className="text-gray-600">{documentPreview.file.type || 'Unknown'}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">File Size:</span>
                    <div className="text-gray-600">{(documentPreview.file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Upload Date:</span>
                    <div className="text-gray-600">{new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      )}

      {/* Add Equipment Form Modal */}
      {showAddEquipmentForm && (
        <AddEquipmentForm
          onClose={() => setShowAddEquipmentForm(false)}
          onSubmit={handleAddEquipment}
          projectId={projectName}
        />
      )}
    </div>
  );
};

export default EquipmentGrid;
