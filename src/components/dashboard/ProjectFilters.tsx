import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import AddProjectForm from "@/components/forms/AddProjectForm";

interface ProjectFiltersProps {
  onFilterChange?: (filters: ProjectFilters) => void;
  onAddNewProject?: (projectData: any) => void;
  onApplyFilters?: (filters: ProjectFilters) => void;
}

interface ProjectFilters {
  client: string;
  equipmentType: string;
  status: string;
  manager: string;
  searchQuery: string;
}

const ProjectFilters = ({ onFilterChange, onAddNewProject, onApplyFilters }: ProjectFiltersProps) => {
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [filters, setFilters] = useState<ProjectFilters>({
    client: 'All Clients',
    equipmentType: 'All Equipment',
    status: 'All Status',
    manager: 'All Managers',
    searchQuery: ''
  });

  const handleFilterChange = (key: keyof ProjectFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
    onApplyFilters?.(newFilters);
  };

  const handleAddProject = (projectData: any) => {
    console.log('New Project Data:', projectData);
    // Send to parent component to add to dashboard
    onAddNewProject?.(projectData);
    setShowAddProjectForm(false);
  };

  return (
    <>
      <div className={designSystem.components.sectionContainer}>
        <div className={designSystem.components.sectionHeader}>
          <h2 className={designSystem.components.sectionTitle}>Project Filters</h2>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          {/* Sort by Client */}
          <div className="space-y-2 min-w-[180px]">
            <label className={designSystem.form.label}>Sort by Client</label>
            <Select onValueChange={(value) => handleFilterChange('client', value)}>
              <SelectTrigger className={designSystem.form.select}>
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Clients">All Clients</SelectItem>
                <SelectItem value="Reliance Industries">Reliance Industries</SelectItem>
                <SelectItem value="UPL Limited">UPL Limited</SelectItem>
                <SelectItem value="Indian Oil Corporation">Indian Oil Corporation</SelectItem>
                <SelectItem value="BPCL">BPCL</SelectItem>
                <SelectItem value="Adani Ports">Adani Ports</SelectItem>
                <SelectItem value="Tata Steel">Tata Steel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Equipment Type */}
          <div className="space-y-2 min-w-[180px]">
            <label className={designSystem.form.label}>Equipment Type</label>
            <Select onValueChange={(value) => handleFilterChange('equipmentType', value)}>
              <SelectTrigger className={designSystem.form.select}>
                <SelectValue placeholder="All Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Equipment">All Equipment</SelectItem>
                <SelectItem value="Heat Exchanger">Heat Exchanger</SelectItem>
                <SelectItem value="Pressure Vessel">Pressure Vessel</SelectItem>
                <SelectItem value="Storage Tank">Storage Tank</SelectItem>
                <SelectItem value="Reactor">Reactor</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2 min-w-[180px]">
            <label className={designSystem.form.label}>Status</label>
            <Select onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className={designSystem.form.select}>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned Manager */}
          <div className="space-y-2 min-w-[180px]">
            <label className={designSystem.form.label}>Assigned Manager</label>
            <Select onValueChange={(value) => handleFilterChange('manager', value)}>
              <SelectTrigger className={designSystem.form.select}>
                <SelectValue placeholder="All Managers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Managers">All Managers</SelectItem>
                <SelectItem value="Rajesh Kumar">Rajesh Kumar</SelectItem>
                <SelectItem value="Priya Sharma">Priya Sharma</SelectItem>
                <SelectItem value="Amit Patel">Amit Patel</SelectItem>
                <SelectItem value="Vikram Singh">Vikram Singh</SelectItem>
                <SelectItem value="Neha Verma">Neha Verma</SelectItem>
                <SelectItem value="Arun Kumar">Arun Kumar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Projects */}
          <div className="space-y-2 min-w-[280px] flex-1">
            <label className={designSystem.form.label}>Search Projects</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by project name, PO number, or client..."
                className={`${designSystem.form.input} pr-10`}
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              />
              <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => {
              const clearedFilters = {
                client: 'All Clients',
                equipmentType: 'All Equipment',
                status: 'All Status',
                manager: 'All Managers',
                searchQuery: ''
              };
              setFilters(clearedFilters);
              onFilterChange?.(clearedFilters);
              onApplyFilters?.(clearedFilters);
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear All Filters
          </Button>
        </div>
      </div>

      {/* Add Project Form Modal */}
      {showAddProjectForm && (
        <AddProjectForm
          onClose={() => setShowAddProjectForm(false)}
          onSubmit={handleAddProject}
        />
      )}
    </>
  );
};

export default ProjectFilters;
