import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { X, Save, Upload, Users, FileText, Settings, Building2, Plus, CheckCircle, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { designSystem } from "@/lib/design-system";



interface AddProjectFormProps {
  onClose: () => void;
  onSubmit: (projectData: ProjectFormData) => void;
  editData?: ProjectFormData | null;
  isEditMode?: boolean;
}

interface ProjectFormData {
  // Basic Project Information
  projectTitle: string;
  clientName: string;
  plantLocation: string;
  poNumber: string;
  salesOrderDate: string;
  completionDate: string;
  clientIndustry: string;
  
  // Project Team & Management
  projectManager: string;
  vdcrManager: string;
  consultant: string;
  tpiAgency: string;
  clientFocalPoint: string;
  
  // Scope of Work
  servicesIncluded: {
    design: boolean;
    manufacturing: boolean;
    testing: boolean;
    documentation: boolean;
    installationSupport: boolean;
    commissioning: boolean;
  };
  scopeDescription: string;
  
  // Document Uploads
  unpricedPOFile: File | null;
  designInputsPID: File | null;
  clientReferenceDoc: File | null;
  otherDocuments: File[] | null;
  
  // Additional Information
  kickoffMeetingNotes: string;
  specialProductionNotes: string;
  
  // Equipment Details - will be populated from equipmentDetails state
}

const AddProjectForm = ({ onClose, onSubmit, editData, isEditMode }: AddProjectFormProps) => {
  const [formData, setFormData] = useState<ProjectFormData>(() => {
    if (isEditMode && editData) {
      return editData;
    }
    return {
      projectTitle: '',
      clientName: '',
      plantLocation: '',
      poNumber: '',
      salesOrderDate: '',
      completionDate: '',
      clientIndustry: '',
      projectManager: '',
      vdcrManager: '',
      consultant: '',
      tpiAgency: '',
      clientFocalPoint: '',
      servicesIncluded: {
        design: false,
        manufacturing: false,
        testing: false,
        documentation: false,
        installationSupport: false,
        commissioning: false
      },
      scopeDescription: '',
      unpricedPOFile: null,
      designInputsPID: null,
      clientReferenceDoc: null,
      otherDocuments: null,
      kickoffMeetingNotes: '',
      specialProductionNotes: ''
    };
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Accordion states for Step 1
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});
  const [showAddNew, setShowAddNew] = useState<Record<string, boolean>>({});
  const [newEntries, setNewEntries] = useState<Record<string, string>>({});
  const [editingEntries, setEditingEntries] = useState<Record<string, { index: number; value: string } | null>>({});
  
  // Special state for Project Manager edit form
  const [editingProjectManager, setEditingProjectManager] = useState<{
    index: number;
    name: string;
    email: string;
    phone: string;
  } | null>(null);
  
  // Special state for VDCR Manager edit form
  const [editingVdcrManager, setEditingVdcrManager] = useState<{
    index: number;
    name: string;
    email: string;
    phone: string;
  } | null>(null);
  
  // Store Project Manager contact details (name -> {email, phone})
  const [projectManagerContacts, setProjectManagerContacts] = useState<Record<string, { email: string; phone: string }>>({});
  
  // Store VDCR Manager contact details (name -> {email, phone})
  const [vdcrManagerContacts, setVdcrManagerContacts] = useState<Record<string, { email: string; phone: string }>>({});
  
  // Store dynamic options for each field
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, string[]>>({
    clientName: ['Reliance Industries', 'UPL Limited', 'Indian Oil Corporation', 'BPCL', 'Adani Ports', 'Tata Steel'],
    clientIndustry: ['Petrochemical', 'Steel', 'Refinery', 'Marine', 'Power', 'Pharmaceutical'],
    projectManager: ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Vikram Singh', 'Neha Verma', 'Arun Kumar'],
    vdcrManager: ['Sarah Johnson', 'Michael Chen', 'David Rodriguez', 'Emily Thompson', 'None'],
    consultant: ['ABC Consultants', 'XYZ Engineering', 'Tech Solutions', 'None'],
    tpiAgency: ['Bureau Veritas', 'SGS', 'TUV SUD', 'Lloyd\'s Register', 'None']
  });

  // Search queries for each field
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({
    clientName: '',
    clientIndustry: '',
    projectManager: '',
    vdcrManager: '',
    consultant: '',
    tpiAgency: ''
  });

  // Equipment state
  const [equipmentDetails, setEquipmentDetails] = useState<Record<string, Array<{
    id: string;
    tagNumber: string;
    jobNumber: string;
    manufacturingSerial: string;
    documents: File[];
  }>>>({});
  
  // Custom equipment types state
  const [customEquipmentTypes, setCustomEquipmentType] = useState<string[]>([]);
  const [showAddEquipmentType, setShowAddEquipmentType] = useState(false);
  const [newEquipmentType, setNewEquipmentType] = useState('');
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [createdProject, setCreatedProject] = useState<any>(null);

  const handleInputChange = (field: keyof ProjectFormData, value: string | File | File[] | null | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (service: keyof ProjectFormData['servicesIncluded'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      servicesIncluded: {
        ...prev.servicesIncluded,
        [service]: checked
      }
    }));
  };

  const handleFileUpload = (field: keyof ProjectFormData, file: File | File[] | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const toggleAccordion = (field: string) => {
    setExpandedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const showAddNewForm = (field: string) => {
    setShowAddNew(prev => ({ ...prev, [field]: true }));
    setNewEntries(prev => ({ ...prev, [field]: '' }));
  };

  const addNewEntry = (field: string) => {
    if (newEntries[field]?.trim()) {
      if (field === 'projectManager' || field === 'vdcrManager') {
        // Special handling for Project Manager and VDCR Manager with contact details
        const email = newEntries[`${field}_email`]?.trim() || '';
        const phone = newEntries[`${field}_phone`]?.trim() || '';
        const name = newEntries[field].trim();
        
        // Store the name in the visible options (for display)
        setDynamicOptions(prev => ({
          ...prev,
          [field]: [...(prev[field] || []), name]
        }));
        
        // Store contact details for future editing
        if (field === 'projectManager') {
          setProjectManagerContacts(prev => ({
            ...prev,
            [name]: { email, phone }
          }));
        } else if (field === 'vdcrManager') {
          setVdcrManagerContacts(prev => ({
            ...prev,
            [name]: { email, phone }
          }));
        }
        
        // Update the form data with just the name
        handleInputChange(field as keyof ProjectFormData, name);
        
        // Close the form and clear all fields
        setShowAddNew(prev => ({ ...prev, [field]: false }));
        setNewEntries(prev => ({ 
          ...prev, 
          [field]: '',
          [`${field}_email`]: '',
          [`${field}_phone`]: ''
        }));
      } else {
        // Standard handling for other fields
        // Add to dynamic options
        setDynamicOptions(prev => ({
          ...prev,
          [field]: [...(prev[field] || []), newEntries[field].trim()]
        }));
        
        // Update the form data with the new value
        handleInputChange(field as keyof ProjectFormData, newEntries[field].trim());
        
        // Close the form
        setShowAddNew(prev => ({ ...prev, [field]: false }));
        setNewEntries(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const startEditingEntry = (field: string, index: number, value: string) => {
    if (field === 'projectManager') {
      // For Project Manager, use the special state with all 3 fields
      const contacts = projectManagerContacts[value] || { email: '', phone: '' };
      setEditingProjectManager({
        index,
        name: value,
        email: contacts.email,
        phone: contacts.phone
      });
    } else if (field === 'vdcrManager') {
      // For VDCR Manager, use the special state with all 3 fields
      const contacts = vdcrManagerContacts[value] || { email: '', phone: '' };
      setEditingVdcrManager({
        index,
        name: value,
        email: contacts.email,
        phone: contacts.phone
      });
    } else {
      // For other fields, use the standard editing state
      setEditingEntries(prev => ({ ...prev, [field]: { index, value } }));
    }
  };

  const saveEditedEntry = (field: string) => {
    const editing = editingEntries[field];
    
    if (editing && editing.value.trim()) {
      setDynamicOptions(prev => {
        const updatedOptions = prev[field].map((option, i) => 
          i === editing.index ? editing.value.trim() : option
        );
        
        // If the edited value is currently selected, update the form data
        if (formData[field as keyof ProjectFormData] === prev[field][editing.index]) {
          handleInputChange(field as keyof ProjectFormData, editing.value.trim());
        }
        
        return {
          ...prev,
          [field]: updatedOptions
        };
      });
      
      setEditingEntries(prev => ({ ...prev, [field]: null }));
    }
  };

  const cancelEditingEntry = (field: string) => {
    setEditingEntries(prev => ({ ...prev, [field]: null }));
  };

  const saveProjectManagerEdit = () => {
    if (editingProjectManager && editingProjectManager.name.trim()) {
      const oldName = dynamicOptions.projectManager[editingProjectManager.index];
      const newName = editingProjectManager.name.trim();
      
      setDynamicOptions(prev => {
        const updatedOptions = prev.projectManager.map((option, i) => 
          i === editingProjectManager.index ? newName : option
        );
        
        // If the edited value is currently selected, update the form data
        if (formData.projectManager === oldName) {
          handleInputChange('projectManager', newName);
        }
        
        return {
          ...prev,
          projectManager: updatedOptions
        };
      });
      
      // Update stored contact details
      setProjectManagerContacts(prev => {
        const newContacts = { ...prev };
        // Remove old name entry and add new name entry
        if (oldName !== newName) {
          delete newContacts[oldName];
        }
        newContacts[newName] = {
          email: editingProjectManager.email,
          phone: editingProjectManager.phone
        };
        return newContacts;
      });
      
      setEditingProjectManager(null);
    }
  };

  const cancelProjectManagerEdit = () => {
    setEditingProjectManager(null);
  };

  const saveVdcrManagerEdit = () => {
    if (editingVdcrManager && editingVdcrManager.name.trim()) {
      const oldName = dynamicOptions.vdcrManager[editingVdcrManager.index];
      const newName = editingVdcrManager.name.trim();
      
      setDynamicOptions(prev => {
        const updatedOptions = prev.vdcrManager.map((option, i) => 
          i === editingVdcrManager.index ? newName : option
        );
        
        // If the edited value is currently selected, update the form data
        if (formData.vdcrManager === oldName) {
          handleInputChange('vdcrManager', newName);
        }
        
        return {
          ...prev,
          vdcrManager: updatedOptions
        };
      });
      
      // Update stored contact details
      setVdcrManagerContacts(prev => {
        const newContacts = { ...prev };
        // Remove old name entry and add new name entry
        if (oldName !== newName) {
          delete newContacts[oldName];
        }
        newContacts[newName] = {
          email: editingVdcrManager.email,
          phone: editingVdcrManager.phone
        };
        return newContacts;
      });
      
      setEditingVdcrManager(null);
    }
  };

  const cancelVdcrManagerEdit = () => {
    setEditingVdcrManager(null);
  };

  const deleteEntry = (field: string, index: number) => {
    const deletedValue = dynamicOptions[field][index];
    
    // Remove from dynamic options
    setDynamicOptions(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
    
    // If the deleted value is currently selected, clear the form field
    if (formData[field as keyof ProjectFormData] === deletedValue) {
      handleInputChange(field as keyof ProjectFormData, '');
    }
    
    // Remove contact details if it's a Project Manager
    if (field === 'projectManager') {
      setProjectManagerContacts(prev => {
        const newContacts = { ...prev };
        delete newContacts[deletedValue];
        return newContacts;
      });
    }
  };

  const handleEquipmentQuantityChange = (equipmentType: string, quantity: number) => {
    if (quantity > 0) {
      // Create array of equipment details for this type
      const details = Array.from({ length: quantity }, (_, index) => ({
        id: `${equipmentType}-${index + 1}`,
        tagNumber: '',
        jobNumber: '',
        manufacturingSerial: '',
        documents: []
      }));
      setEquipmentDetails(prev => ({ ...prev, [equipmentType]: details }));
    } else {
      // Remove equipment details if quantity is 0
      setEquipmentDetails(prev => {
        const newState = { ...prev };
        delete newState[equipmentType];
        return newState;
      });
    }
  };

  const updateEquipmentDetail = (equipmentType: string, index: number, field: string, value: string | File[]) => {
    setEquipmentDetails(prev => ({
      ...prev,
      [equipmentType]: prev[equipmentType].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addCustomEquipmentType = () => {
    if (newEquipmentType.trim()) {
      setCustomEquipmentType(prev => [...prev, newEquipmentType.trim()]);
      setNewEquipmentType('');
      setShowAddEquipmentType(false);
    }
  };



  const nextStep = async () => {
    if (currentStep < totalSteps) {
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentStep(currentStep + 1);
      setIsAnimating(false);
    }
  };

  const prevStep = async () => {
    if (currentStep > 1) {
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentStep(currentStep - 1);
      setIsAnimating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare equipment data for submission
    const equipmentData = Object.entries(equipmentDetails).flatMap(([type, equipments]) =>
      equipments.map(equipment => ({
        ...equipment,
        type
      }))
    );
    
    const projectData = {
      ...formData,
      equipment: equipmentData,
      id: Date.now().toString(), // Generate unique ID
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    console.log('Project Data:', projectData);
    
    // Store the created project and show success screen
    setCreatedProject(projectData);
    setShowSuccessScreen(true);
    
    // Don't close yet - wait for user to acknowledge success
  };

  const getStepProgress = () => {
    return (currentStep / totalSteps) * 100;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Project & Team Setup";
      case 2: return "Scope & Documents";
      case 3: return "Equipment Details";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Configure project details and team assignments";
      case 2: return "Define scope, upload documents, and add notes";
      case 3: return "Specify equipment breakdown and details";
      default: return "";
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{getStepTitle()}</h3>
        <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${getStepProgress()}%` }}
        />
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index + 1 <= currentStep 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-110' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      
      <p className="text-center text-gray-600 mt-2">{getStepDescription()}</p>
    </div>
  );

  const renderAccordionField = (field: string, label: string, placeholder: string, value: string, onChange: (value: string) => void) => {
    const searchQuery = searchQueries[field] || '';
    const options = dynamicOptions[field] || [];
    const filteredOptions = options.filter(option => 
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleAccordion(field)}
            className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <span className={value ? 'text-gray-900' : 'text-gray-500'}>
              {value || placeholder}
            </span>
            {expandedFields[field] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {expandedFields[field] && (
            <div className="border-t border-gray-200 bg-gray-50">
              {/* Search Bar */}
              <div className="p-3 border-b border-gray-200 bg-white">
                <Input
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(e) => setSearchQueries(prev => ({ ...prev, [field]: e.target.value }))}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              {/* Options List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => {
                    const originalIndex = options.indexOf(option);
                    const isEditing = editingEntries[field]?.index === originalIndex;
                    const isEditingProjectManager = field === 'projectManager' && editingProjectManager?.index === originalIndex;
                    const isEditingVdcrManager = field === 'vdcrManager' && editingVdcrManager?.index === originalIndex;
                    
                    return (
                      <div key={option} className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 transition-colors">
                        {isEditingProjectManager ? (
                          // Special 3-field edit form for Project Manager
                          field === 'projectManager' && editingProjectManager ? (
                            <div className="flex-1 space-y-3 p-3 bg-white border rounded-lg">
                              <Input
                                value={editingProjectManager.name}
                                onChange={(e) => setEditingProjectManager(prev => prev ? { ...prev, name: e.target.value } : null)}
                                placeholder="Enter project manager name"
                                className="w-full text-sm"
                                autoFocus
                              />
                              <Input
                                value={editingProjectManager.email}
                                onChange={(e) => setEditingProjectManager(prev => prev ? { ...prev, email: e.target.value } : null)}
                                placeholder="Enter email address"
                                type="email"
                                className="w-full text-sm"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address"
                              />
                              <Input
                                value={editingProjectManager.phone}
                                onChange={(e) => setEditingProjectManager(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                placeholder="Enter phone number (10 digits)"
                                type="tel"
                                className="w-full text-sm"
                                pattern="[0-9]{10}"
                                title="Please enter a 10-digit phone number"
                                maxLength={10}
                              />
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => saveProjectManagerEdit()}
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 flex-1"
                                  disabled={!editingProjectManager.name?.trim() || 
                                           (editingProjectManager.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingProjectManager.email)) ||
                                           (editingProjectManager.phone && !/^[0-9]{10}$/.test(editingProjectManager.phone))}
                                >
                                  <CheckCircle size={14} className="mr-1" />
                                  Save
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => cancelProjectManagerEdit()}
                                  className="px-2 py-1 flex-1"
                                >
                                  <X size={14} className="mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : field === 'vdcrManager' && editingVdcrManager ? (
                            // Special 3-field edit form for VDCR Manager
                            <div className="flex-1 space-y-3 p-3 bg-white border rounded-lg">
                              <Input
                                value={editingVdcrManager.name}
                                onChange={(e) => setEditingVdcrManager(prev => prev ? { ...prev, name: e.target.value } : null)}
                                placeholder="Enter VDCR manager name"
                                className="w-full text-sm"
                                autoFocus
                              />
                              <Input
                                value={editingVdcrManager.email}
                                onChange={(e) => setEditingVdcrManager(prev => prev ? { ...prev, email: e.target.value } : null)}
                                placeholder="Enter email address"
                                type="email"
                                className="w-full text-sm"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address"
                              />
                              <Input
                                value={editingVdcrManager.phone}
                                onChange={(e) => setEditingVdcrManager(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                placeholder="Enter phone number (10 digits)"
                                type="tel"
                                className="w-full text-sm"
                                pattern="[0-9]{10}"
                                title="Please enter a 10-digit phone number"
                                maxLength={10}
                              />
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => saveVdcrManagerEdit()}
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 flex-1"
                                  disabled={!editingVdcrManager.name?.trim() || 
                                           (editingVdcrManager.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingVdcrManager.email)) ||
                                           (editingVdcrManager.phone && !/^[0-9]{10}$/.test(editingVdcrManager.phone))}
                                >
                                  <CheckCircle size={14} className="mr-1" />
                                  Save
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => cancelVdcrManagerEdit()}
                                  className="px-2 py-1 flex-1"
                                >
                                  <X size={14} className="mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // Standard single-field edit form for other fields
                            <div className="flex items-center space-x-2 flex-1">
                              <Input
                                value={editingEntries[field]?.value || ''}
                                onChange={(e) => setEditingEntries(prev => ({ 
                                  ...prev, 
                                  [field]: { ...prev[field]!, value: e.target.value } 
                                }))}
                                className="flex-1 text-sm"
                                autoFocus
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => saveEditedEntry(field)}
                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1"
                              >
                                <CheckCircle size={14} />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => cancelEditingEntry(field)}
                                className="px-2 py-1"
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          )
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                onChange(option);
                                toggleAccordion(field);
                                setSearchQueries(prev => ({ ...prev, [field]: '' }));
                              }}
                              className="flex-1 text-left text-sm hover:text-blue-600 transition-colors"
                            >
                              {option}
                            </button>
                            <div className="flex items-center space-x-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditingEntry(field, originalIndex, option)}
                                className="h-6 w-6 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                title="Edit"
                              >
                                <Pencil size={12} />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteEntry(field, originalIndex)}
                                className="h-6 w-6 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                title="Delete"
                              >
                                <X size={12} />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No options found
                  </div>
                )}
              </div>
              
              {/* Add New Button - Always Visible */}
              <div className="border-t border-gray-200 p-3 bg-white">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => showAddNewForm(field)}
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Plus size={16} className="mr-2" />
                  Add New {label}
                </Button>
              </div>
              
              {/* Add New Form */}
              {showAddNew[field] && (
                <div className="border-t border-gray-200 p-4 bg-white">
                  {field === 'projectManager' || field === 'vdcrManager' ? (
                    // Special form for Project Manager and VDCR Manager with contact details
                    <div className="space-y-3">
                      <Input
                        value={newEntries[field] || ''}
                        onChange={(e) => setNewEntries(prev => ({ ...prev, [field]: e.target.value }))}
                        placeholder={field === 'projectManager' ? "Enter project manager name" : "Enter VDCR manager name"}
                        className="w-full"
                      />
                      <Input
                        value={newEntries[`${field}_email`] || ''}
                        onChange={(e) => setNewEntries(prev => ({ ...prev, [`${field}_email`]: e.target.value }))}
                        placeholder="Enter email address"
                        type="email"
                        className="w-full"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        title="Please enter a valid email address"
                      />
                      <Input
                        value={newEntries[`${field}_phone`] || ''}
                        onChange={(e) => setNewEntries(prev => ({ ...prev, [`${field}_phone`]: e.target.value }))}
                        placeholder="Enter phone number (10 digits)"
                        type="tel"
                        className="w-full"
                        pattern="[0-9]{10}"
                        title="Please enter a 10-digit phone number"
                        maxLength={10}
                      />
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => addNewEntry(field)}
                          className="bg-blue-600 hover:bg-blue-700 flex-1"
                          disabled={!newEntries[field]?.trim() || 
                                   (newEntries[`${field}_email`] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEntries[`${field}_email`])) ||
                                   (newEntries[`${field}_phone`] && !/^[0-9]{10}$/.test(newEntries[`${field}_phone`]))}
                        >
                          {field === 'projectManager' ? 'Add Project Manager' : 'Add VDCR Manager'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddNew(prev => ({ ...prev, [field]: false }))}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Standard form for other fields
                    <div className="flex space-x-2">
                      <Input
                        value={newEntries[field] || ''}
                        onChange={(e) => setNewEntries(prev => ({ ...prev, [field]: e.target.value }))}
                        placeholder={`Enter new ${label.toLowerCase()}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addNewEntry(field)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddNew(prev => ({ ...prev, [field]: false }))}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className={`space-y-6 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
      {/* Project Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h4 className="text-lg font-semibold text-gray-800">Project Information</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectTitle" className="text-sm font-medium text-gray-700">
              Project Title *
            </Label>
            <Input
              id="projectTitle"
              value={formData.projectTitle}
              onChange={(e) => handleInputChange('projectTitle', e.target.value)}
              placeholder="Enter project title"
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {renderAccordionField(
            'clientName',
            'Client Name *',
            'Select Client',
            formData.clientName,
            (value) => handleInputChange('clientName', value)
          )}

          <div className="space-y-2">
            <Label htmlFor="plantLocation" className="text-sm font-medium text-gray-700">
              Plant Location
            </Label>
            <Input
              id="plantLocation"
              value={formData.plantLocation}
              onChange={(e) => handleInputChange('plantLocation', e.target.value)}
              placeholder="e.g., Jamnagar, Gujarat"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="poNumber" className="text-sm font-medium text-gray-700">
              PO Number *
            </Label>
            <Input
              id="poNumber"
              value={formData.poNumber}
              onChange={(e) => handleInputChange('poNumber', e.target.value)}
              placeholder="Enter PO number"
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salesOrderDate" className="text-sm font-medium text-gray-700">
              Sales Order Date *
            </Label>
            <Input
              id="salesOrderDate"
              type="date"
              value={formData.salesOrderDate}
              onChange={(e) => handleInputChange('salesOrderDate', e.target.value)}
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="completionDate" className="text-sm font-medium text-gray-700">
              Completion Date *
            </Label>
            <Input
              id="completionDate"
              type="date"
              value={formData.completionDate}
              onChange={(e) => handleInputChange('completionDate', e.target.value)}
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {renderAccordionField(
            'clientIndustry',
            'Client Industry',
            'Select Industry',
            formData.clientIndustry,
            (value) => handleInputChange('clientIndustry', value)
          )}


        </div>
      </div>

      {/* Team Management */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-6 h-6 text-green-600" />
          <h4 className="text-lg font-semibold text-gray-800">Team Management</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderAccordionField(
            'projectManager',
            'Project Manager *',
            'Select Manager',
            formData.projectManager,
            (value) => handleInputChange('projectManager', value)
          )}

          {renderAccordionField(
            'vdcrManager',
            'VDCR Manager',
            'Select VDCR Manager',
            formData.vdcrManager,
            (value) => handleInputChange('vdcrManager', value)
          )}

          {renderAccordionField(
            'consultant',
            'Consultant',
            'Select Consultant',
            formData.consultant,
            (value) => handleInputChange('consultant', value)
          )}

          {renderAccordionField(
            'tpiAgency',
            'TPI Agency',
            'Select TPI Agency',
            formData.tpiAgency,
            (value) => handleInputChange('tpiAgency', value)
          )}

          <div className="space-y-2">
            <Label htmlFor="clientFocalPoint" className="text-sm font-medium text-gray-700">
              Client Focal Point
            </Label>
            <Input
              id="clientFocalPoint"
              value={formData.clientFocalPoint}
              onChange={(e) => handleInputChange('clientFocalPoint', e.target.value)}
              placeholder="Name and designation"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={`space-y-6 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
      {/* Scope of Work */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="w-6 h-6 text-purple-600" />
          <h4 className="text-lg font-semibold text-gray-800">Scope of Work</h4>
        </div>
        
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Select Services Included:</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(formData.servicesIncluded).map(([service, checked]) => (
              <div key={service} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer" onClick={() => handleServiceChange(service as keyof ProjectFormData['servicesIncluded'], !checked)}>
                <input
                  type="checkbox"
                  id={service}
                  checked={checked}
                  onChange={(e) => handleServiceChange(service as keyof ProjectFormData['servicesIncluded'], e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor={service} className="text-sm font-medium text-gray-700 capitalize cursor-pointer">
                  {service}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Scope Description */}
        <div className="space-y-3">
          <Label htmlFor="scopeDescription" className="text-sm font-medium text-gray-700">
            Scope Description
          </Label>
          <Textarea
            id="scopeDescription"
            value={formData.scopeDescription}
            onChange={(e) => handleInputChange('scopeDescription', e.target.value)}
            placeholder="Detailed description of the scope of services included in the project, objectives, and key deliverables"
            rows={4}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Document Uploads */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="w-6 h-6 text-orange-600" />
          <h4 className="text-lg font-semibold text-gray-800">Document Uploads</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unpricedPOFile" className="text-sm font-medium text-gray-700">
              Unpriced PO File
            </Label>
            <Input
              id="unpricedPOFile"
              type="file"
              onChange={(e) => handleFileUpload('unpricedPOFile', e.target.files?.[0] || null)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="designInputsPID" className="text-sm font-medium text-gray-700">
              Design Inputs/PID
            </Label>
            <Input
              id="designInputsPID"
              type="file"
              onChange={(e) => handleFileUpload('designInputsPID', e.target.files?.[0] || null)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientReferenceDoc" className="text-sm font-medium text-gray-700">
              Client's Reference Document
            </Label>
            <Input
              id="clientReferenceDoc"
              type="file"
              onChange={(e) => handleFileUpload('clientReferenceDoc', e.target.files?.[0] || null)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherDocuments" className="text-sm font-medium text-gray-700">
              Other Documents
            </Label>
            <Input
              id="otherDocuments"
              type="file"
              multiple
              onChange={(e) => handleFileUpload('otherDocuments', e.target.files ? Array.from(e.target.files) : null)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-6 h-6 text-indigo-600" />
          <h4 className="text-lg font-semibold text-gray-800">Additional Notes</h4>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kickoffMeetingNotes" className="text-sm font-medium text-gray-700">
              Kick-off Meeting Notes
            </Label>
            <Textarea
              id="kickoffMeetingNotes"
              value={formData.kickoffMeetingNotes}
              onChange={(e) => handleInputChange('kickoffMeetingNotes', e.target.value)}
              placeholder="Key discussion points from project kick-off meeting"
              rows={3}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialProductionNotes" className="text-sm font-medium text-gray-700">
              Special Notes for Production
            </Label>
            <Textarea
              id="specialProductionNotes"
              value={formData.specialProductionNotes}
              onChange={(e) => handleInputChange('specialProductionNotes', e.target.value)}
              placeholder="Special requirements, standards, or constraints for production"
              rows={3}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={`space-y-6 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-6 h-6 text-blue-600" />
        <h4 className="text-lg font-semibold text-gray-800">Equipment Information</h4>
      </div>

      {/* Equipment Types Selection */}
      <div className="space-y-4">
        <h5 className="text-lg font-semibold text-gray-800">Select Equipment Types & Quantities</h5>
        
        <div className="space-y-3">
          {[
            'Heat Exchanger', 
            'Pressure Vessel', 
            'Reactor', 
            'Storage Tank', 
            'Distillation Column',
            ...customEquipmentTypes
          ].map((equipmentType) => (
            <div key={equipmentType} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={equipmentType}
                    checked={equipmentDetails[equipmentType] && equipmentDetails[equipmentType].length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleEquipmentQuantityChange(equipmentType, 1);
                      } else {
                        handleEquipmentQuantityChange(equipmentType, 0);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor={equipmentType} className="text-sm font-medium text-gray-700">
                    {equipmentType}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label className="text-sm text-gray-600">Quantity:</Label>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={equipmentDetails[equipmentType]?.length || 0}
                    onChange={(e) => handleEquipmentQuantityChange(equipmentType, parseInt(e.target.value) || 0)}
                    className="w-16 text-center border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Dynamic Subforms */}
              {equipmentDetails[equipmentType] && equipmentDetails[equipmentType].length > 0 && (
                <div className="space-y-3 mt-4">
                  <p className="text-sm text-gray-600 font-medium">
                    Please provide Tag Number, Job Number, and Manufacturing Serial Number for each equipment:
                  </p>
                  
                  {equipmentDetails[equipmentType].map((equipment, index) => (
                    <Card key={equipment.id} className="p-4 bg-white border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="font-semibold text-gray-800">
                          {equipmentType} - Unit {index + 1}
                        </h6>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          Equipment {index + 1}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Tag Number *
                          </Label>
                          <Input
                            value={equipment.tagNumber}
                            onChange={(e) => updateEquipmentDetail(equipmentType, index, 'tagNumber', e.target.value)}
                            placeholder={`${equipmentType.toUpperCase().replace(' ', '-')}-UNIT-${String(index + 1).padStart(3, '0')}`}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Job Number *
                          </Label>
                          <Input
                            value={equipment.jobNumber}
                            onChange={(e) => updateEquipmentDetail(equipmentType, index, 'jobNumber', e.target.value)}
                            placeholder="JOB-2024-001"
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Manufacturing Serial *
                          </Label>
                          <Input
                            value={equipment.manufacturingSerial}
                            onChange={(e) => updateEquipmentDetail(equipmentType, index, 'manufacturingSerial', e.target.value)}
                            placeholder={`${equipmentType.toUpperCase().replace(' ', '-')}-${String(index + 1).padStart(3, '0')}-2024-[CLIENT]`}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Document Upload */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Equipment Documents
                        </Label>
                        <Input
                          type="file"
                          multiple
                          onChange={(e) => updateEquipmentDetail(equipmentType, index, 'documents', e.target.files ? Array.from(e.target.files) : [])}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {equipment.documents.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            {equipment.documents.length} file(s) selected
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add New Equipment Type */}
        <div className="text-center">
          {!showAddEquipmentType ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddEquipmentType(true)}
              className="border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-6 py-3"
            >
              <Plus size={16} className="mr-2" />
              Click here to add new equipment type
            </Button>
          ) : (
            <div className="inline-flex items-center space-x-2 p-4 bg-white border-2 border-blue-300 rounded-lg">
              <Input
                value={newEquipmentType}
                onChange={(e) => setNewEquipmentType(e.target.value)}
                placeholder="Enter equipment type name"
                className="w-64 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                type="button"
                onClick={addCustomEquipmentType}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddEquipmentType(false);
                  setNewEquipmentType('');
                }}
                className="border-gray-300 hover:border-gray-400"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Total Equipment Count */}
      <div className="text-center p-4 bg-blue-100 rounded-lg">
        <p className="text-blue-800 font-bold">
          Total Equipment: {Object.values(equipmentDetails).reduce((total, arr) => total + arr.length, 0)} units
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return renderStep1();
    }
  };

  const renderSuccessScreen = () => (
    <div className="text-center py-12">
      {/* Success Icon */}
      <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={48} className="text-white" />
      </div>
      
      {/* Success Message */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        🎉 Project Created Successfully!
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        Your new project "<span className="font-semibold text-blue-600">{createdProject?.projectTitle}</span>" has been added to the dashboard.
      </p>
      
      {/* Project Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
        <h3 className="font-semibold text-blue-800 mb-3">Project Summary</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <div className="flex justify-between">
            <span>Client:</span>
            <span className="font-medium">{createdProject?.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span>Equipment Count:</span>
            <span className="font-medium">{createdProject?.equipment?.length || 0} types</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-medium capitalize">{createdProject?.status}</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => {
            onSubmit(createdProject);
            onClose();
          }}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <CheckCircle size={20} className="mr-2" />
          Done
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShowSuccessScreen(false);
            setCurrentStep(1);
            // Reset form data
            setFormData({
              projectTitle: '',
              clientName: '',
              plantLocation: '',
              poNumber: '',
              salesOrderDate: '',
              completionDate: '',
              clientIndustry: '',

              projectManager: '',
              consultant: '',
              tpiAgency: '',
              clientFocalPoint: '',
              servicesIncluded: {
                design: false,
                manufacturing: false,
                testing: false,
                documentation: false,
                installationSupport: false,
                commissioning: false
              },
              scopeDescription: '',
              unpricedPOFile: null,
              designInputsPID: null,
              clientReferenceDoc: null,
              otherDocuments: null,
              kickoffMeetingNotes: '',
              specialProductionNotes: ''
            });
            setEquipmentDetails({});
            setCustomEquipmentType([]);
          }}
          className="px-6 py-3 border-gray-300 hover:border-gray-400"
        >
          Create Another Project
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-white">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={designSystem.components.sectionTitle}>
              {isEditMode ? 'Edit Project' : 'Add New Project'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X size={20} />
            </Button>
          </div>

          {/* Progress Section */}
          {renderProgressBar()}

          {showSuccessScreen ? (
            renderSuccessScreen()
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Step Content */}
              {renderCurrentStep()}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
              >
                <ChevronLeft size={16} className="mr-2" />
                Previous
              </Button>

              <div className="flex space-x-3">
                {currentStep < totalSteps ? (
                  <Button 
                    type="button" 
                    onClick={nextStep} 
                    className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Next Step
                    <ChevronRight size={16} className="mr-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    disabled={isAnimating}
                  >
                    {isEditMode ? 'Update Project' : 'Create Project'}
                  </Button>
                )}
              </div>
            </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AddProjectForm;
