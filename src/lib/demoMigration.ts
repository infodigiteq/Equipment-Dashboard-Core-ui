import { supabase } from './supabase'
import { DatabaseService } from './database'

// Comprehensive demo data migration for client presentations
export class DemoDataMigration {
  // Populate database with ONE complete working project for demo
  static async populateCompleteDemoProject() {
    try {
      console.log('🚀 Starting complete demo project migration...')

      // 1. Get or create demo firm
      let firm = await this.getOrCreateFirm()
      console.log('✅ Firm ready:', firm.name)

      // 2. Clear existing data to start fresh
      await this.clearExistingData(firm.id)

      // 3. Create ONE complete project
      const project = await this.createCompleteProject(firm.id)
      console.log(`✅ Created project: ${project.name}`)

      // 4. Create multiple equipment items for this project
      const equipment = await this.createProjectEquipment(project.id, firm.id)
      console.log(`✅ Created ${equipment.length} equipment items`)

      // 5. Create VDCR records for this project
      const vdcrRecords = await this.createProjectVDCR(project.id, firm.id)
      console.log(`✅ Created ${vdcrRecords.length} VDCR records`)

      // 6. Create progress entries for equipment
      const progressEntries = await this.createEquipmentProgress(equipment)
      console.log(`✅ Created ${progressEntries.length} progress entries`)

      // 7. Create team positions for equipment
      const teamPositions = await this.createEquipmentTeams(equipment)
      console.log(`✅ Created ${teamPositions.length} team positions`)

      // 8. Create sample images for equipment
      const sampleImages = await this.createEquipmentImages(equipment)
      console.log(`✅ Prepared ${sampleImages.length} sample images`)

      console.log('🎉 Complete demo project migration completed successfully!')
      console.log(`📊 Final Counts:`)
      console.log(`   - Firms: 1`)
      console.log(`   - Projects: 1`)
      console.log(`   - Equipment: ${equipment.length}`)
      console.log(`   - VDCR Records: ${vdcrRecords.length}`)
      console.log(`   - Progress Entries: ${progressEntries.length}`)
      console.log(`   - Team Positions: ${teamPositions.length}`)
      console.log(`   - Sample Images: ${sampleImages.length}`)
      
      return {
        firm,
        project,
        equipment,
        vdcrRecords,
        progressEntries,
        teamPositions,
        sampleImages
      }

    } catch (error) {
      console.error('❌ Demo migration failed:', error)
      throw error
    }
  }

  // Populate database with full demo dataset (8 projects - for reference)
  static async populateFullDemoData() {
    try {
      console.log('🚀 Starting comprehensive demo data migration...')

      // 1. Get or create demo firm
      let firm = await this.getOrCreateFirm()
      console.log('✅ Firm ready:', firm.name)

      // 2. Clear existing data (optional - comment out if you want to keep existing)
      // await this.clearExistingData(firm.id)

      // 3. Create all 8 projects with full data
      const projects = await this.createAllProjects(firm.id)
      console.log(`✅ Created ${projects.length} projects`)

      // 4. Create equipment for each project
      const equipment = await this.createAllEquipment(projects)
      console.log(`✅ Created ${equipment.length} equipment items`)

      // 5. Create VDCR records
      const vdcrRecords = await this.createAllVDCRRecords(projects)
      console.log(`✅ Created ${vdcrRecords.length} VDCR records`)

      // 6. Create progress entries
      const progressEntries = await this.createProgressEntries(equipment)
      console.log(`✅ Created ${progressEntries.length} progress entries`)

      // 7. Create team positions
      const teamPositions = await this.createTeamPositions(equipment)
      console.log(`✅ Created ${teamPositions.length} team positions`)

      console.log('🎉 Full demo data migration completed successfully!')
      console.log(`📊 Final Counts:`)
      console.log(`   - Firms: 1`)
      console.log(`   - Projects: ${projects.length}`)
      console.log(`   - Equipment: ${equipment.length}`)
      console.log(`   - VDCR Records: ${vdcrRecords.length}`)
      console.log(`   - Progress Entries: ${progressEntries.length}`)
      console.log(`   - Team Positions: ${teamPositions.length}`)
      
      return {
        firm,
        projects,
        equipment,
        vdcrRecords,
        progressEntries,
        teamPositions
      }

    } catch (error) {
      console.error('❌ Demo migration failed:', error)
      throw error
    }
  }

  // Get or create demo firm
  static async getOrCreateFirm() {
    try {
      // Try to get existing firm
      const { data: existingFirms } = await supabase
        .from('firms')
        .select('*')
        .limit(1)

      if (existingFirms && existingFirms.length > 0) {
        return existingFirms[0]
      }

      // Create new firm if none exists
      return await DatabaseService.createFirm({
        name: 'Demo Engineering Co.',
        subscription_plan: 'premium'
      })
    } catch (error) {
      console.log('Creating new firm...')
      return await DatabaseService.createFirm({
        name: 'Demo Engineering Co.',
        subscription_plan: 'premium'
      })
    }
  }

  // Create ONE complete project
  static async createCompleteProject(firmId: string) {
    const projectData = {
      name: "Hazira Plant Project",
      client: "Reliance Industries",
      location: "Hazira, Gujarat",
      equipment_count: 24,
      active_equipment: 18,
      progress: 75,
      status: "active" as const,
      manager: "Rajesh Kumar",
      deadline: "2025-12-15",
      po_number: "REL-2024-HE-001",
      firm_id: firmId,
      scope_of_work: "Industrial equipment manufacturing project for chemical processing facility. Equipment includes various types of vessels and heat exchangers designed for high-pressure and high-temperature applications."
    }

    try {
      const project = await DatabaseService.createProject(projectData)
      console.log(`✅ Project created: ${project.name}`)
      return project
    } catch (error) {
      console.log(`⚠️ Project creation failed for ${projectData.name}:`, error)
      throw error
    }
  }

  // Create multiple equipment items for a project
  static async createProjectEquipment(projectId: string, firmId: string) {
    const equipmentToCreate = [
      {
        project_id: projectId,
        type: "Pressure Vessel",
        tag_number: "PV-001",
        job_number: "JOB-2024-001",
        manufacturing_serial: "PV-001-2024-REL",
        po_cdd: "Dec 25, 2025",
        status: "on-track" as const,
        progress: 85,
        progress_phase: "testing" as const,
        location: "Shop Floor A",
        supervisor: "Manoj Singh",
        last_update: new Date().toISOString(),
        next_milestone: "Final Inspection - Nov 25",
        priority: "high" as const,
        is_basic_info: false,
        size: "3.2m x 2.1m",
        weight: "2,850 kg",
        design_code: "ASME VIII Div 1",
        material: "SS 316L",
        working_pressure: "25 bar",
        design_temp: "350°C",
        welder: "Rajesh Patel",
        qc_inspector: "Priya Sharma",
        project_manager: "Rajesh Kumar"
      },
      {
        project_id: projectId,
        type: "Heat Exchanger",
        tag_number: "HE-002",
        job_number: "JOB-2024-002",
        manufacturing_serial: "HE-002-2024-REL",
        po_cdd: "October 2025",
        status: "delayed" as const,
        progress: 45,
        progress_phase: "manufacturing" as const,
        location: "Shop Floor B",
        supervisor: "Sunita Rao",
        last_update: new Date().toISOString(),
        next_milestone: "Welding Complete - Dec 5",
        priority: "high" as const,
        is_basic_info: false,
        size: "4.5m x 1.8m",
        weight: "1,950 kg",
        design_code: "TEMA Class R",
        material: "Carbon Steel",
        working_pressure: "18 bar",
        design_temp: "280°C",
        welder: "Vikram Singh",
        qc_inspector: "Anita Desai",
        project_manager: "Rajesh Kumar"
      },
      {
        project_id: projectId,
        type: "Storage Tank",
        tag_number: "ST-003",
        job_number: "JOB-2024-003",
        manufacturing_serial: "ST-003-2024-REL",
        po_cdd: "Aug 8, 2025",
        status: "on-track" as const,
        progress: 70,
        progress_phase: "manufacturing" as const,
        location: "Assembly Area",
        supervisor: "Vikram Joshi",
        last_update: new Date().toISOString(),
        next_milestone: "Quality Check - Nov 28",
        priority: "medium" as const,
        is_basic_info: false,
        size: "6.0m x 3.5m",
        weight: "4,200 kg",
        design_code: "API 650",
        material: "SS 304",
        working_pressure: "12 bar",
        design_temp: "200°C",
        welder: "Suresh Kumar",
        qc_inspector: "Meera Patel",
        project_manager: "Priya Sharma"
      },
      {
        project_id: projectId,
        type: "Reactor Vessel",
        tag_number: "RV-004",
        job_number: "JOB-2024-004",
        manufacturing_serial: "RV-004-2024-REL",
        po_cdd: "Mar 15, 2026",
        status: "on-track" as const,
        progress: 90,
        progress_phase: "testing" as const,
        location: "Testing Bay",
        supervisor: "Anil Kumar",
        last_update: new Date().toISOString(),
        next_milestone: "Final Testing - Dec 10",
        priority: "high" as const,
        is_basic_info: false,
        size: "5.5m x 2.8m",
        weight: "6,800 kg",
        design_code: "ASME VIII Div 2",
        material: "SS 316L",
        working_pressure: "35 bar",
        design_temp: "450°C",
        welder: "Ramesh Kumar",
        qc_inspector: "Sunita Desai",
        project_manager: "Amit Kumar"
      }
    ]

    const createdEquipment = []
    for (const equipmentItem of equipmentToCreate) {
      try {
        const equipment = await DatabaseService.createEquipment(equipmentItem)
        createdEquipment.push(equipment)
        console.log(`✅ Equipment created: ${equipment.type} ${equipment.tag_number}`)
      } catch (error) {
        console.log(`⚠️ Equipment creation failed for ${equipmentItem.tag_number}:`, error)
      }
    }

    return createdEquipment
  }

  // Create VDCR records for a project
  static async createProjectVDCR(projectId: string, firmId: string) {
    const vdcrToCreate = [
      {
        project_id: projectId,
        sr_no: "VDCR-001",
        equipment_tag_no: ["PV-001", "HE-002"],
        mfg_serial_no: ["PV-001-2024-REL", "HE-002-2024-REL"],
        job_no: ["JOB-2024-001", "JOB-2024-002"],
        client_doc_no: "REL-DOC-001",
        internal_doc_no: "INT-DOC-001",
        document_name: "Pressure Vessel Design Review",
        revision: "Rev 1.0",
        code_status: "ASME VIII Div 1",
        status: "approved" as const,
        last_update: new Date().toISOString(),
        remarks: "Design approved with minor modifications",
        updated_by: "Rajesh Kumar",
        firm_id: firmId
      },
      {
        project_id: projectId,
        sr_no: "VDCR-002",
        equipment_tag_no: ["ST-003"],
        mfg_serial_no: ["ST-003-2024-REL"],
        job_no: ["JOB-2024-003"],
        client_doc_no: "UPL-DOC-002",
        internal_doc_no: "INT-DOC-002",
        document_name: "Storage Tank Specifications",
        revision: "Rev 2.0",
        code_status: "API 650",
        status: "sent-for-approval" as const,
        last_update: new Date().toISOString(),
        remarks: "Awaiting client approval",
        updated_by: "Priya Sharma",
        firm_id: firmId
      },
      {
        project_id: projectId,
        sr_no: "VDCR-003",
        equipment_tag_no: ["RV-004"],
        mfg_serial_no: ["RV-004-2024-IOCL"],
        job_no: ["JOB-2024-004"],
        client_doc_no: "IOCL-DOC-003",
        internal_doc_no: "INT-DOC-003",
        document_name: "Reactor Vessel Design",
        revision: "Rev 1.5",
        code_status: "ASME VIII Div 2",
        status: "approved" as const,
        last_update: new Date().toISOString(),
        remarks: "Design approved for manufacturing",
        updated_by: "Amit Patel",
        firm_id: firmId
      }
    ]

    const createdVDCR = []
    for (const vdcrItem of vdcrToCreate) {
      if (vdcrItem.project_id) {
        try {
          const vdcr = await DatabaseService.createVDCRRecord(vdcrItem)
          createdVDCR.push(vdcr)
          console.log(`✅ VDCR record created: ${vdcr.document_name}`)
        } catch (error) {
          console.log(`⚠️ VDCR creation failed for ${vdcrItem.document_name}:`, error)
        }
      }
    }

    return createdVDCR
  }

  // Create progress entries for equipment
  static async createEquipmentProgress(equipment: any[]) {
    const progressToCreate = [
      { 
        text: "Material cutting completed - Shell plates ready for welding", 
        date: "Nov 20, 2024", 
        type: "material",
        image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center",
        description: "Steel plates cut to required dimensions"
      },
      { 
        text: "Welding started on main shell - Longitudinal seams in progress", 
        date: "Nov 22, 2024", 
        type: "welding",
        image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center",
        description: "Main shell welding operations"
      },
      { 
        text: "Quality inspection passed - NDT testing completed", 
        date: "Nov 23, 2024", 
        type: "inspection",
        image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center",
        description: "Non-destructive testing results"
      },
      { 
        text: "Assembly in progress - Nozzles and supports being fitted", 
        date: "Nov 24, 2024", 
        type: "assembly",
        image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center",
        description: "Final assembly stage"
      },
      { 
        text: "Testing phase initiated - Hydrostatic test preparation", 
        date: "Nov 25, 2024", 
        type: "testing",
        image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center",
        description: "Pressure testing setup"
      }
    ]

    const createdProgress = []
    for (const equipmentItem of equipment) {
      for (const progressItem of progressToCreate) {
        try {
          const progress = await DatabaseService.createProgressEntry({
            equipment_id: equipmentItem.id,
            text: progressItem.text,
            date: progressItem.date,
            type: progressItem.type
          })
          createdProgress.push(progress)
        } catch (error) {
          console.log(`⚠️ Progress entry creation failed:`, error)
        }
      }
    }

    return createdProgress
  }

  // Create team positions for equipment
  static async createEquipmentTeams(equipment: any[]) {
    const teamToCreate = [
      { position: "Welder", name: "Rajesh Patel" },
      { position: "QC Inspector", name: "Priya Sharma" },
      { position: "Fabricator", name: "Vikram Singh" },
      { position: "Engineer", name: "Amit Kumar" },
      { position: "Supervisor", name: "Manoj Singh" }
    ]

    const createdTeams = []
    for (const equipmentItem of equipment) {
      for (const teamItem of teamToCreate) {
        try {
          const team = await DatabaseService.createTeamPosition({
            equipment_id: equipmentItem.id,
            ...teamItem
          })
          createdTeams.push(team)
        } catch (error) {
          console.log(`⚠️ Team position creation failed:`, error)
        }
      }
    }

    return createdTeams
  }

  // Create sample images for equipment
  static async createEquipmentImages(equipment: any[]) {
    const sampleImages = [
      {
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
        description: "Pressure Vessel Shell Assembly - Main cylinder ready for welding",
        uploadedBy: "Rajesh Patel",
        uploadDate: new Date().toISOString()
      },
      {
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
        description: "Heat Exchanger Tube Bundle - Tubes being inserted into shell",
        uploadedBy: "Vikram Singh",
        uploadDate: new Date().toISOString()
      },
      {
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
        description: "Storage Tank Assembly - Bottom head being welded",
        uploadedBy: "Priya Sharma",
        uploadDate: new Date().toISOString()
      },
      {
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
        description: "Reactor Vessel - Internal baffles installation",
        uploadedBy: "Amit Kumar",
        uploadDate: new Date().toISOString()
      },
      {
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
        description: "Welding Operations - Longitudinal seam welding in progress",
        uploadedBy: "Manoj Singh",
        uploadDate: new Date().toISOString()
      },
      {
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
        description: "Quality Inspection - NDT testing and visual examination",
        uploadedBy: "Sunita Rao",
        uploadDate: new Date().toISOString()
      },
      {
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
        description: "Material Cutting - Steel plates being cut to size",
        uploadedBy: "Suresh Kumar",
        uploadDate: new Date().toISOString()
      },
      {
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
        description: "Assembly Line - Equipment components being assembled",
        uploadedBy: "Neha Verma",
        uploadDate: new Date().toISOString()
      },
      {
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
        description: "Testing Setup - Hydrostatic test preparation",
        uploadedBy: "Anil Kumar",
        uploadDate: new Date().toISOString()
      },
      {
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
        description: "Final Inspection - Completed equipment ready for dispatch",
        uploadedBy: "Kavita Desai",
        uploadDate: new Date().toISOString()
      }
    ];

    // For now, we'll just log that images would be created
    // In a real implementation, you'd save these to a file storage service
    console.log(`📸 Sample images prepared for ${equipment.length} equipment items`);
    console.log('📸 Image URLs:', sampleImages.map(img => img.url));
    
    return sampleImages;
  }

  // Create all 8 projects
  static async createAllProjects(firmId: string) {
    const projectsToCreate = [
      {
        name: "Hazira Plant Project",
        client: "Reliance Industries",
        location: "Hazira, Gujarat",
        equipment_count: 24,
        active_equipment: 18,
        progress: 75,
        status: "active" as const,
        manager: "Rajesh Kumar",
        deadline: "2025-12-15",
        po_number: "REL-2024-HE-001",
        firm_id: firmId,
        scope_of_work: "Industrial equipment manufacturing project for chemical processing facility. Equipment includes various types of vessels and heat exchangers designed for high-pressure and high-temperature applications."
      },
      {
        name: "UPL Plant 5 Project",
        client: "UPL Limited",
        location: "Ankleshwar, Gujarat",
        equipment_count: 16,
        active_equipment: 12,
        progress: 60,
        status: "delayed" as const,
        manager: "Priya Sharma",
        deadline: "2025-11-20",
        po_number: "UPL-2024-PV-003",
        firm_id: firmId,
        scope_of_work: "Pressure vessel manufacturing and installation project for chemical processing plant expansion."
      },
      {
        name: "IOCL Refinery Expansion",
        client: "Indian Oil Corporation",
        location: "Panipat, Haryana",
        equipment_count: 32,
        active_equipment: 28,
        progress: 90,
        status: "on-track" as const,
        manager: "Amit Patel",
        deadline: "2026-04-01",
        po_number: "IOCL-2024-RP-007",
        firm_id: firmId,
        scope_of_work: "Comprehensive refinery expansion project including reactor vessels, heat exchangers, and storage systems with full commissioning services."
      },
      {
        name: "BPCL Petrochemical Plant",
        client: "BPCL",
        location: "Mumbai, Maharashtra",
        equipment_count: 18,
        active_equipment: 15,
        progress: 85,
        status: "active" as const,
        manager: "Vikram Singh",
        deadline: "2027-06-01",
        po_number: "BPCL-2024-PP-012",
        firm_id: firmId,
        scope_of_work: "Petrochemical plant expansion with advanced equipment manufacturing and installation services."
      },
      {
        name: "Adani Port Terminal",
        client: "Adani Ports",
        location: "Mundra, Gujarat",
        equipment_count: 22,
        active_equipment: 19,
        progress: 70,
        status: "on-track" as const,
        manager: "Neha Verma",
        deadline: "2025-04-15",
        po_number: "ADANI-2024-PT-015",
        firm_id: firmId,
        scope_of_work: "Port terminal equipment manufacturing and installation project for enhanced cargo handling capabilities."
      },
      {
        name: "Tata Steel Plant",
        client: "Tata Steel",
        location: "Jamshedpur, Jharkhand",
        equipment_count: 28,
        active_equipment: 25,
        progress: 80,
        status: "active" as const,
        manager: "Arun Kumar",
        deadline: "2025-02-28",
        po_number: "TATA-2024-SP-018",
        firm_id: firmId,
        scope_of_work: "Steel plant modernization project with comprehensive equipment manufacturing and commissioning services."
      },
      {
        name: "ONGC Offshore Platform",
        client: "ONGC",
        location: "Mumbai High, Offshore",
        equipment_count: 15,
        active_equipment: 15,
        progress: 100,
        status: "completed" as const,
        manager: "Suresh Reddy",
        deadline: "2024-03-15",
        po_number: "ONGC-2023-OP-022",
        firm_id: firmId,
        scope_of_work: "Offshore platform equipment manufacturing and installation project completed successfully."
      },
      {
        name: "Hindustan Petroleum Refinery",
        client: "HPCL",
        location: "Vishakhapatnam, AP",
        equipment_count: 20,
        active_equipment: 20,
        progress: 100,
        status: "completed" as const,
        manager: "Kavita Desai",
        deadline: "2024-01-20",
        po_number: "HPCL-2023-RF-025",
        firm_id: firmId,
        scope_of_work: "Refinery expansion project with complete equipment manufacturing and commissioning services."
      }
    ]

    const createdProjects = []
    for (const projectData of projectsToCreate) {
      try {
        const project = await DatabaseService.createProject(projectData)
        createdProjects.push(project)
        console.log(`✅ Project created: ${project.name}`)
      } catch (error) {
        console.log(`⚠️ Project creation failed for ${projectData.name}:`, error)
      }
    }

    return createdProjects
  }

  // Create equipment for all projects
  static async createAllEquipment(projects: any[]) {
    const equipmentToCreate = [
      // Hazira Plant Project Equipment
      {
        project_id: projects[0]?.id,
        type: "Pressure Vessel",
        tag_number: "PV-001",
        job_number: "JOB-2024-001",
        manufacturing_serial: "PV-001-2024-REL",
        po_cdd: "Dec 25, 2025",
        status: "on-track" as const,
        progress: 85,
        progress_phase: "testing" as const,
        location: "Shop Floor A",
        supervisor: "Manoj Singh",
        last_update: new Date().toISOString(),
        next_milestone: "Final Inspection - Nov 25",
        priority: "high" as const,
        is_basic_info: false,
        size: "3.2m x 2.1m",
        weight: "2,850 kg",
        design_code: "ASME VIII Div 1",
        material: "SS 316L",
        working_pressure: "25 bar",
        design_temp: "350°C",
        welder: "Rajesh Patel",
        qc_inspector: "Priya Sharma",
        project_manager: "Rajesh Kumar"
      },
      {
        project_id: projects[0]?.id,
        type: "Heat Exchanger",
        tag_number: "HE-002",
        job_number: "JOB-2024-002",
        manufacturing_serial: "HE-002-2024-REL",
        po_cdd: "October 2025",
        status: "delayed" as const,
        progress: 45,
        progress_phase: "manufacturing" as const,
        location: "Shop Floor B",
        supervisor: "Sunita Rao",
        last_update: new Date().toISOString(),
        next_milestone: "Welding Complete - Dec 5",
        priority: "high" as const,
        is_basic_info: false,
        size: "4.5m x 1.8m",
        weight: "1,950 kg",
        design_code: "TEMA Class R",
        material: "Carbon Steel",
        working_pressure: "18 bar",
        design_temp: "280°C",
        welder: "Vikram Singh",
        qc_inspector: "Anita Desai",
        project_manager: "Rajesh Kumar"
      },
      // UPL Plant 5 Project Equipment
      {
        project_id: projects[1]?.id,
        type: "Storage Tank",
        tag_number: "ST-003",
        job_number: "JOB-2024-003",
        manufacturing_serial: "ST-003-2024-REL",
        po_cdd: "Aug 8, 2025",
        status: "on-track" as const,
        progress: 70,
        progress_phase: "manufacturing" as const,
        location: "Assembly Area",
        supervisor: "Vikram Joshi",
        last_update: new Date().toISOString(),
        next_milestone: "Quality Check - Nov 28",
        priority: "medium" as const,
        is_basic_info: false,
        size: "6.0m x 3.5m",
        weight: "4,200 kg",
        design_code: "API 650",
        material: "SS 304",
        working_pressure: "12 bar",
        design_temp: "200°C",
        welder: "Suresh Kumar",
        qc_inspector: "Meera Patel",
        project_manager: "Priya Sharma"
      },
      // IOCL Refinery Equipment
      {
        project_id: projects[2]?.id,
        type: "Reactor Vessel",
        tag_number: "RV-004",
        job_number: "JOB-2024-004",
        manufacturing_serial: "RV-004-2024-IOCL",
        po_cdd: "Mar 15, 2026",
        status: "on-track" as const,
        progress: 90,
        progress_phase: "testing" as const,
        location: "Testing Bay",
        supervisor: "Anil Kumar",
        last_update: new Date().toISOString(),
        next_milestone: "Final Testing - Dec 10",
        priority: "high" as const,
        is_basic_info: false,
        size: "5.5m x 2.8m",
        weight: "6,800 kg",
        design_code: "ASME VIII Div 2",
        material: "SS 316L",
        working_pressure: "35 bar",
        design_temp: "450°C",
        welder: "Ramesh Kumar",
        qc_inspector: "Sunita Desai",
        project_manager: "Amit Patel"
      },
      // BPCL Petrochemical Equipment
      {
        project_id: projects[3]?.id,
        type: "Heat Exchanger",
        tag_number: "HE-005",
        job_number: "JOB-2024-005",
        manufacturing_serial: "HE-005-2024-BPCL",
        po_cdd: "May 15, 2027",
        status: "on-track" as const,
        progress: 85,
        progress_phase: "manufacturing" as const,
        location: "Shop Floor C",
        supervisor: "Rajesh Verma",
        last_update: new Date().toISOString(),
        next_milestone: "Assembly Complete - Dec 20",
        priority: "medium" as const,
        is_basic_info: false,
        size: "3.8m x 2.2m",
        weight: "2,400 kg",
        design_code: "TEMA Class R",
        material: "Carbon Steel",
        working_pressure: "22 bar",
        design_temp: "320°C",
        welder: "Prakash Singh",
        qc_inspector: "Rajesh Kumar",
        project_manager: "Vikram Singh"
      }
    ]

    const createdEquipment = []
    for (const equipmentItem of equipmentToCreate) {
      if (equipmentItem.project_id) {
        try {
          const equipment = await DatabaseService.createEquipment(equipmentItem)
          createdEquipment.push(equipment)
          console.log(`✅ Equipment created: ${equipment.type} ${equipment.tag_number}`)
        } catch (error) {
          console.log(`⚠️ Equipment creation failed for ${equipmentItem.tag_number}:`, error)
        }
      }
    }

    return createdEquipment
  }

  // Create VDCR records for all projects
  static async createAllVDCRRecords(projects: any[]) {
    const vdcrToCreate = [
      {
        project_id: projects[0]?.id,
        sr_no: "VDCR-001",
        equipment_tag_no: ["PV-001", "HE-002"],
        mfg_serial_no: ["PV-001-2024-REL", "HE-002-2024-REL"],
        job_no: ["JOB-2024-001", "JOB-2024-002"],
        client_doc_no: "REL-DOC-001",
        internal_doc_no: "INT-DOC-001",
        document_name: "Pressure Vessel Design Review",
        revision: "Rev 1.0",
        code_status: "ASME VIII Div 1",
        status: "approved" as const,
        last_update: new Date().toISOString(),
        remarks: "Design approved with minor modifications",
        updated_by: "Rajesh Kumar",
        firm_id: projects[0]?.firm_id
      },
      {
        project_id: projects[1]?.id,
        sr_no: "VDCR-002",
        equipment_tag_no: ["ST-003"],
        mfg_serial_no: ["ST-003-2024-REL"],
        job_no: ["JOB-2024-003"],
        client_doc_no: "UPL-DOC-002",
        internal_doc_no: "INT-DOC-002",
        document_name: "Storage Tank Specifications",
        revision: "Rev 2.0",
        code_status: "API 650",
        status: "sent-for-approval" as const,
        last_update: new Date().toISOString(),
        remarks: "Awaiting client approval",
        updated_by: "Priya Sharma",
        firm_id: projects[1]?.firm_id
      },
      {
        project_id: projects[2]?.id,
        sr_no: "VDCR-003",
        equipment_tag_no: ["RV-004"],
        mfg_serial_no: ["RV-004-2024-IOCL"],
        job_no: ["JOB-2024-004"],
        client_doc_no: "IOCL-DOC-003",
        internal_doc_no: "INT-DOC-003",
        document_name: "Reactor Vessel Design",
        revision: "Rev 1.5",
        code_status: "ASME VIII Div 2",
        status: "approved" as const,
        last_update: new Date().toISOString(),
        remarks: "Design approved for manufacturing",
        updated_by: "Amit Patel",
        firm_id: projects[2]?.firm_id
      }
    ]

    const createdVDCR = []
    for (const vdcrItem of vdcrToCreate) {
      if (vdcrItem.project_id) {
        try {
          const vdcr = await DatabaseService.createVDCRRecord(vdcrItem)
          createdVDCR.push(vdcr)
          console.log(`✅ VDCR record created: ${vdcr.document_name}`)
        } catch (error) {
          console.log(`⚠️ VDCR creation failed for ${vdcrItem.document_name}:`, error)
        }
      }
    }

    return createdVDCR
  }

  // Create progress entries for equipment
  static async createProgressEntries(equipment: any[]) {
    const progressToCreate = [
      { text: "Material cutting completed", date: "Nov 20, 2024", type: "material" },
      { text: "Welding started on main shell", date: "Nov 22, 2024", type: "welding" },
      { text: "Quality inspection passed", date: "Nov 23, 2024", type: "inspection" },
      { text: "Assembly in progress", date: "Nov 24, 2024", type: "assembly" },
      { text: "Testing phase initiated", date: "Nov 25, 2024", type: "testing" }
    ]

    const createdProgress = []
    for (const equipmentItem of equipment) {
      for (const progressItem of progressToCreate) {
        try {
          const progress = await DatabaseService.createProgressEntry({
            equipment_id: equipmentItem.id,
            ...progressItem
          })
          createdProgress.push(progress)
        } catch (error) {
          console.log(`⚠️ Progress entry creation failed:`, error)
        }
      }
    }

    return createdProgress
  }

  // Create team positions for equipment
  static async createTeamPositions(equipment: any[]) {
    const teamToCreate = [
      { position: "Welder", name: "Rajesh Patel" },
      { position: "QC Inspector", name: "Priya Sharma" },
      { position: "Fabricator", name: "Vikram Singh" },
      { position: "Engineer", name: "Amit Kumar" },
      { position: "Supervisor", name: "Manoj Singh" }
    ]

    const createdTeams = []
    for (const equipmentItem of equipment) {
      for (const teamItem of teamToCreate) {
        try {
          const team = await DatabaseService.createTeamPosition({
            equipment_id: equipmentItem.id,
            ...teamItem
          })
          createdTeams.push(team)
        } catch (error) {
          console.log(`⚠️ Team position creation failed:`, error)
        }
      }
    }

    return createdTeams
  }

  // Clear existing data (optional)
  static async clearExistingData(firmId: string) {
    try {
      console.log('🧹 Clearing existing data...')
      
      // Delete in reverse order of dependencies
      await supabase.from('team_positions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('progress_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('vdcr_records').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('equipment').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      console.log('✅ Existing data cleared')
    } catch (error) {
      console.log('⚠️ Error clearing data:', error)
    }
  }
}

export default DemoDataMigration
