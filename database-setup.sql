-- Engineering Project Management Database Setup
-- Run this script in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FIRMS TABLE (Multi-tenancy foundation)
CREATE TABLE IF NOT EXISTS firms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    subscription_plan VARCHAR(50) DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- 2. USERS TABLE (Authentication and role management)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('super_admin', 'firm_admin', 'project_manager', 'engineer', 'viewer')),
    firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- 3. PROJECTS TABLE (Main project information)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    equipment_count INTEGER DEFAULT 0,
    active_equipment INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'delayed', 'on-track', 'completed')),
    manager VARCHAR(255) NOT NULL,
    deadline DATE NOT NULL,
    po_number VARCHAR(255) NOT NULL,
    firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_date DATE,
    scope_of_work TEXT
);

-- 4. EQUIPMENT TABLE (Equipment details and progress)
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    tag_number VARCHAR(255) NOT NULL,
    job_number VARCHAR(255) NOT NULL,
    manufacturing_serial VARCHAR(255) NOT NULL,
    po_cdd VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('on-track', 'delayed', 'nearing-completion', 'completed', 'pending')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    progress_phase VARCHAR(50) DEFAULT 'documentation' CHECK (progress_phase IN ('documentation', 'manufacturing', 'testing', 'dispatched')),
    location VARCHAR(255) NOT NULL,
    supervisor VARCHAR(255) NOT NULL,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_milestone VARCHAR(255),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    is_basic_info BOOLEAN DEFAULT true,
    -- Technical specifications
    size VARCHAR(255),
    weight VARCHAR(255),
    design_code VARCHAR(255),
    material VARCHAR(255),
    working_pressure VARCHAR(255),
    design_temp VARCHAR(255),
    -- Team assignments
    welder VARCHAR(255),
    qc_inspector VARCHAR(255),
    project_manager VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. VDCR RECORDS TABLE (Document management)
CREATE TABLE IF NOT EXISTS vdcr_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sr_no VARCHAR(255) NOT NULL,
    equipment_tag_no TEXT[] NOT NULL,
    mfg_serial_no TEXT[] NOT NULL,
    job_no TEXT[] NOT NULL,
    client_doc_no VARCHAR(255) NOT NULL,
    internal_doc_no VARCHAR(255) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    revision VARCHAR(50) NOT NULL,
    code_status VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('approved', 'sent-for-approval', 'received-for-comment', 'pending', 'rejected')),
    last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    remarks TEXT,
    updated_by VARCHAR(255) NOT NULL,
    document_url TEXT,
    firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PROGRESS ENTRIES TABLE (Equipment progress tracking)
CREATE TABLE IF NOT EXISTS progress_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    date VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TEAM POSITIONS TABLE (Equipment team assignments)
CREATE TABLE IF NOT EXISTS team_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    position VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_firm_id ON projects(firm_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_equipment_project_id ON equipment(project_id);
CREATE INDEX IF NOT EXISTS idx_equipment_progress_phase ON equipment(progress_phase);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_vdcr_records_project_id ON vdcr_records(project_id);
CREATE INDEX IF NOT EXISTS idx_vdcr_records_status ON vdcr_records(status);
CREATE INDEX IF NOT EXISTS idx_vdcr_records_firm_id ON vdcr_records(firm_id);
CREATE INDEX IF NOT EXISTS idx_users_firm_id ON users(firm_id);
CREATE INDEX IF NOT EXISTS idx_progress_entries_equipment_id ON progress_entries(equipment_id);
CREATE INDEX IF NOT EXISTS idx_team_positions_equipment_id ON team_positions(equipment_id);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_equipment_tag_number ON equipment(tag_number);
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_po_number ON projects(po_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_firms_updated_at BEFORE UPDATE ON firms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vdcr_records_updated_at BEFORE UPDATE ON vdcr_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
-- 1. Insert a sample firm
INSERT INTO firms (name, subscription_plan) VALUES 
('Demo Engineering Co.', 'premium')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert a sample user
INSERT INTO users (email, full_name, role, firm_id) VALUES 
('admin@demoengineering.com', 'Demo Admin', 'firm_admin', (SELECT id FROM firms WHERE name = 'Demo Engineering Co.'))
ON CONFLICT (email) DO NOTHING;

-- 3. Insert sample projects
INSERT INTO projects (name, client, location, equipment_count, active_equipment, progress, status, manager, deadline, po_number, firm_id) VALUES 
('Hazira Plant Project', 'Reliance Industries', 'Hazira, Gujarat', 24, 18, 75, 'active', 'Rajesh Kumar', '2025-12-15', 'REL-2024-HE-001', (SELECT id FROM firms WHERE name = 'Demo Engineering Co.')),
('UPL Plant 5 Project', 'UPL Limited', 'Ankleshwar, Gujarat', 16, 12, 60, 'delayed', 'Priya Sharma', '2025-11-20', 'UPL-2024-PV-003', (SELECT id FROM firms WHERE name = 'Demo Engineering Co.'))
ON CONFLICT (po_number) DO NOTHING;

-- 4. Insert sample equipment
INSERT INTO equipment (project_id, type, tag_number, job_number, manufacturing_serial, po_cdd, status, progress, progress_phase, location, supervisor, next_milestone, priority, is_basic_info) VALUES 
((SELECT id FROM projects WHERE po_number = 'REL-2024-HE-001'), 'Pressure Vessel', 'PV-001', 'JOB-2024-001', 'PV-001-2024-REL', 'Dec 25, 2025', 'on-track', 85, 'testing', 'Shop Floor A', 'Manoj Singh', 'Final Inspection - Nov 25', 'high', false),
((SELECT id FROM projects WHERE po_number = 'REL-2024-HE-001'), 'Heat Exchanger', 'HE-002', 'JOB-2024-002', 'HE-002-2024-REL', 'October 2025', 'delayed', 45, 'manufacturing', 'Shop Floor B', 'Sunita Rao', 'Welding Complete - Dec 5', 'high', false),
((SELECT id FROM projects WHERE po_number = 'UPL-2024-PV-003'), 'Storage Tank', 'ST-003', 'JOB-2024-003', 'ST-003-2024-REL', 'Aug 8, 2025', 'on-track', 70, 'manufacturing', 'Assembly Area', 'Vikram Joshi', 'Quality Check - Nov 28', 'medium', false)
ON CONFLICT (tag_number) DO NOTHING;

-- 5. Insert sample progress entries
INSERT INTO progress_entries (equipment_id, text, date, type) VALUES 
((SELECT id FROM equipment WHERE tag_number = 'PV-001'), 'Material cutting completed', 'Nov 20, 2024', 'material'),
((SELECT id FROM equipment WHERE tag_number = 'PV-001'), 'Welding started on main shell', 'Nov 22, 2024', 'welding'),
((SELECT id FROM equipment WHERE tag_number = 'HE-002'), 'Raw material requested', 'Nov 18, 2024', 'material'),
((SELECT id FROM equipment WHERE tag_number = 'ST-003'), 'Fabrication started', 'Nov 19, 2024', 'general');

-- 6. Insert sample team positions
INSERT INTO team_positions (equipment_id, position, name) VALUES 
((SELECT id FROM equipment WHERE tag_number = 'PV-001'), 'Welder', 'Rajesh Patel'),
((SELECT id FROM equipment WHERE tag_number = 'PV-001'), 'QC Inspector', 'Priya Sharma'),
((SELECT id FROM equipment WHERE tag_number = 'HE-002'), 'Welder', 'Vikram Singh'),
((SELECT id FROM equipment WHERE tag_number = 'ST-003'), 'Fabricator', 'Suresh Kumar');

-- 7. Insert sample VDCR records
INSERT INTO vdcr_records (project_id, sr_no, equipment_tag_no, mfg_serial_no, job_no, client_doc_no, internal_doc_no, document_name, revision, code_status, status, updated_by, firm_id) VALUES 
((SELECT id FROM projects WHERE po_number = 'REL-2024-HE-001'), 'VDCR-001', ARRAY['PV-001'], ARRAY['PV-001-2024-REL'], ARRAY['JOB-2024-001'], 'REL-DOC-001', 'INT-DOC-001', 'Pressure Vessel Design Review', 'Rev 1.0', 'ASME VIII Div 1', 'approved', 'Rajesh Kumar', (SELECT id FROM firms WHERE name = 'Demo Engineering Co.')),
((SELECT id FROM projects WHERE po_number = 'REL-2024-HE-001'), 'VDCR-002', ARRAY['HE-002'], ARRAY['HE-002-2024-REL'], ARRAY['JOB-2024-002'], 'REL-DOC-002', 'INT-DOC-002', 'Heat Exchanger Specifications', 'Rev 2.0', 'TEMA Class R', 'sent-for-approval', 'Sunita Rao', (SELECT id FROM firms WHERE name = 'Demo Engineering Co.'));

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Enable Row Level Security (RLS) for multi-tenancy
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE vdcr_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_positions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic - can be enhanced later)
CREATE POLICY "Users can view their own firm data" ON users FOR SELECT USING (firm_id IN (SELECT firm_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view their firm's projects" ON projects FOR SELECT USING (firm_id IN (SELECT firm_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view their firm's equipment" ON equipment FOR SELECT USING (project_id IN (SELECT id FROM projects WHERE firm_id IN (SELECT firm_id FROM users WHERE id = auth.uid())));
CREATE POLICY "Users can view their firm's VDCR records" ON vdcr_records FOR SELECT USING (firm_id IN (SELECT firm_id FROM users WHERE id = auth.uid()));

-- Success message
SELECT 'Database setup completed successfully! 🎉' as status;
