-- Clients table: Stores diaspora users
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL, -- Qatar phone number, e.g., +97412345678
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contractors table: Stores local contractors/overseers
CREATE TABLE contractors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL, -- Kenyan phone, e.g., +254712345678
    license_number VARCHAR(50), -- Optional for vetting
    rating DECIMAL(2,1) DEFAULT 0.0, -- 0.0 to 5.0
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table: Stores construction projects
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g., Mama’s Home
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    contractor_id INTEGER REFERENCES contractors(id) ON DELETE SET NULL,
    location VARCHAR(100), -- e.g., Mombasa
    total_budget DECIMAL(10,2) NOT NULL, -- e.g., 45000.00 USD
    status VARCHAR(20) DEFAULT 'active', -- active, completed, paused
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table: Stores milestone-based budgets
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    milestone_name VARCHAR(100) NOT NULL, -- e.g., Foundation
    allocated_amount DECIMAL(10,2) NOT NULL, -- e.g., 8000.00 USD
    spent_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Receipts table: Stores purchase receipts
CREATE TABLE receipts (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE SET NULL,
    contractor_id INTEGER REFERENCES contractors(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL, -- e.g., 37500.00 KES
    item_description TEXT, -- e.g., 25 bags of cement
    supplier_name VARCHAR(100), -- e.g., Rafiki Hardware
    photo_id VARCHAR(50), -- Links to WhatsApp photo upload
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Milestones table: Tracks project phases
CREATE TABLE milestones (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL, -- e.g., Foundation
    due_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    photo_ids TEXT[], -- Array of WhatsApp photo IDs
    funds_released DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table: Logs SMS/USSD/Voice interactions
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    recipient_phone VARCHAR(15) NOT NULL, -- Client or contractor phone
    message_type VARCHAR(20) NOT NULL, -- sms, ussd, voice
    message_content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'sent', -- sent, delivered, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Authentication Tokens table: Stores OTPs for verification
CREATE TABLE auth_tokens (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contractors table roles: Tracks roles of contractors in projects
CREATE TABLE project_contractors (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    contractor_id INTEGER REFERENCES contractors(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'general_contractor', -- foreman, supplier, engineer
    added_by_client BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Receipt Approvals table: For client’s receipt approval tracking
CREATE TABLE receipt_approvals (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER REFERENCES receipts(id) ON DELETE CASCADE,
    approved_by INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    method VARCHAR(10) NOT NULL, -- sms, ussd, web
    approved BOOLEAN,
    approved_at TIMESTAMP
);

-- Voice Logs table: Tracks voice interaction logs for verification or approval
CREATE TABLE voice_logs (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    recipient_phone VARCHAR(15),
    voice_action VARCHAR(50), -- approve_fund_release, verify_milestone
    call_status VARCHAR(20), -- initiated, answered, failed
    duration_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs table: Keeps track of all actions performed in the system
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL, -- fund_release, receipt_submitted, milestone_verified
    performed_by VARCHAR(100), -- can be 'client:<id>', 'contractor:<id>', or 'system'
    project_id INTEGER,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
