import { supabase } from './supabase'
import type { Tables, InsertTables, UpdateTables } from './supabase'

// Database service class for all CRUD operations
export class DatabaseService {
  // FIRM OPERATIONS
  static async createFirm(firm: InsertTables<'firms'>) {
    const { data, error } = await supabase
      .from('firms')
      .insert(firm)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getFirm(firmId: string) {
    const { data, error } = await supabase
      .from('firms')
      .select('*')
      .eq('id', firmId)
      .single()
    
    if (error) throw error
    return data
  }

  // PROJECT OPERATIONS
  static async createProject(project: InsertTables<'projects'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getProjects(firmId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('firm_id', firmId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getProject(projectId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()
    
    if (error) throw error
    return data
  }

  static async updateProject(projectId: string, updates: UpdateTables<'projects'>) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteProject(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
    
    if (error) throw error
    return true
  }

  static async completeProject(projectId: string, completedDate: string) {
    return this.updateProject(projectId, {
      status: 'completed',
      completed_date: completedDate,
      progress: 100
    })
  }

  // EQUIPMENT OPERATIONS
  static async createEquipment(equipment: InsertTables<'equipment'>) {
    const { data, error } = await supabase
      .from('equipment')
      .insert(equipment)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getAllEquipment() {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getEquipment(projectId: string) {
    if (projectId === 'all') {
      // Get all equipment from all projects
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
    
    // Get equipment for specific project
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getEquipmentByPhase(projectId: string, phase: string) {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('project_id', projectId)
      .eq('progress_phase', phase)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateEquipment(equipmentId: string, updates: UpdateTables<'equipment'>) {
    const { data, error } = await supabase
      .from('equipment')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', equipmentId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteEquipment(equipmentId: string) {
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', equipmentId)
    
    if (error) throw error
    return true
  }

  static async markEquipmentComplete(equipmentId: string) {
    return this.updateEquipment(equipmentId, {
      status: 'completed',
      progress_phase: 'dispatched',
      progress: 100
    })
  }

  static async updateEquipmentPhase(equipmentId: string, phase: string, progress: number) {
    return this.updateEquipment(equipmentId, {
      progress_phase: phase as any,
      progress: progress
    })
  }

  // VDCR RECORDS OPERATIONS
  static async createVDCRRecord(vdcr: InsertTables<'vdcr_records'>) {
    const { data, error } = await supabase
      .from('vdcr_records')
      .insert(vdcr)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getVDCRRecords(projectId: string) {
    const { data, error } = await supabase
      .from('vdcr_records')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getVDCRRecordsByStatus(projectId: string, status: string) {
    const { data, error } = await supabase
      .from('vdcr_records')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateVDCRRecord(vdcrId: string, updates: UpdateTables<'vdcr_records'>) {
    const { data, error } = await supabase
      .from('vdcr_records')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', vdcrId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // PROGRESS ENTRIES OPERATIONS
  static async createProgressEntry(entry: InsertTables<'progress_entries'>) {
    const { data, error } = await supabase
      .from('progress_entries')
      .insert(entry)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getProgressEntries(equipmentId: string) {
    const { data, error } = await supabase
      .from('progress_entries')
      .select('*')
      .eq('equipment_id', equipmentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // TEAM POSITIONS OPERATIONS
  static async createTeamPosition(position: InsertTables<'team_positions'>) {
    const { data, error } = await supabase
      .from('team_positions')
      .insert(position)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getTeamPositions(equipmentId: string) {
    const { data, error } = await supabase
      .from('team_positions')
      .select('*')
      .eq('equipment_id', equipmentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // UTILITY FUNCTIONS
  static async getProjectSummary(firmId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        status,
        progress,
        equipment_count,
        active_equipment,
        deadline,
        created_at
      `)
      .eq('firm_id', firmId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getFirstFirmId() {
    const { data, error } = await supabase
      .from('firms')
      .select('id')
      .limit(1)
      .single()
    
    if (error) throw error
    return data?.id
  }

  static async getEquipmentSummary(projectId: string) {
    const { data, error } = await supabase
      .from('equipment')
      .select(`
        id,
        type,
        tag_number,
        progress_phase,
        progress,
        status,
        priority
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // REAL-TIME SUBSCRIPTIONS
  static subscribeToProjects(firmId: string, callback: (payload: any) => void) {
    return supabase
      .channel('projects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `firm_id=eq.${firmId}`
        },
        callback
      )
      .subscribe()
  }

  static subscribeToEquipment(projectId: string, callback: (payload: any) => void) {
    return supabase
      .channel('equipment')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment',
          filter: `project_id=eq.${projectId}`
        },
        callback
      )
      .subscribe()
  }

  static subscribeToVDCRRecords(projectId: string, callback: (payload: any) => void) {
    return supabase
      .channel('vdcr_records')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vdcr_records',
          filter: `project_id=eq.${projectId}`
        },
        callback
      )
      .subscribe()
  }
}

// Export individual functions for easier imports
export const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  completeProject,
  createEquipment,
  getAllEquipment,
  getEquipment,
  getEquipmentByPhase,
  updateEquipment,
  deleteEquipment,
  markEquipmentComplete,
  updateEquipmentPhase,
  createVDCRRecord,
  getVDCRRecords,
  getVDCRRecordsByStatus,
  updateVDCRRecord,
  createProgressEntry,
  getProgressEntries,
  createTeamPosition,
  getTeamPositions,
  getProjectSummary,
  getEquipmentSummary,
  getFirstFirmId,
  subscribeToProjects,
  subscribeToEquipment,
  subscribeToVDCRRecords
} = DatabaseService
