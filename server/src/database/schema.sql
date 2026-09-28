-- =========================================================================
-- COALINTELLIGENCE AI — Production Enterprise PostgreSQL + pgvector Schema
-- Target: CMPDI / Coal India Limited (CIL) / Ministry of Coal Repository
-- =========================================================================

-- Enable pgvector and uuid extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- CREATE EXTENSION IF NOT EXISTS "vector"; -- Uncomment when pgvector is installed

-- 1. USERS & ROLES
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'ANALYST', 'OFFICER', 'AUDITOR');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'ANALYST',
    department VARCHAR(255) NOT NULL,
    subsidiary VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. SUBSIDIARIES & MINES (Hierarchical Knowledge Structure)
CREATE TABLE IF NOT EXISTS subsidiaries (
    code VARCHAR(20) PRIMARY KEY, -- ECL, BCCL, CCL, WCL, SECL, MCL, NCL, CMPDI, NEC
    name VARCHAR(255) NOT NULL,
    headquarters VARCHAR(255) NOT NULL,
    operational_state VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS coalfields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsidiary_code VARCHAR(20) REFERENCES subsidiaries(code),
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS mines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsidiary_code VARCHAR(20) REFERENCES subsidiaries(code),
    coalfield_id UUID REFERENCES coalfields(id),
    name VARCHAR(255) NOT NULL,
    mine_type VARCHAR(50) NOT NULL, -- Opencast, Underground, Mixed
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    environmental_clearance_capacity_mt DECIMAL(8, 2),
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- 3. DOCUMENTS & INGESTION
CREATE TYPE ingestion_status AS ENUM (
    'UPLOADED', 'CLASSIFYING', 'OCR_PROCESSING', 'TEXT_EXTRACTION', 
    'TABLE_DETECTION', 'ENTITY_EXTRACTION', 'VALIDATION', 'INDEXED', 'FAILED'
);

CREATE TYPE validation_status AS ENUM (
    'VERIFIED', 'CONFLICT_DETECTED', 'PENDING_REVIEW', 'FLAGGED'
);

CREATE TYPE confidentiality_level AS ENUM (
    'PUBLIC', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET'
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(500) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_format VARCHAR(20) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    subsidiary_code VARCHAR(20) REFERENCES subsidiaries(code),
    mine_id UUID REFERENCES mines(id),
    financial_year VARCHAR(20) NOT NULL,
    confidentiality confidentiality_level DEFAULT 'RESTRICTED',
    tags TEXT[] DEFAULT '{}',
    uploaded_by UUID REFERENCES users(id),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status ingestion_status DEFAULT 'UPLOADED',
    processing_progress INTEGER DEFAULT 0,
    page_count INTEGER DEFAULT 0,
    extracted_entities_count INTEGER DEFAULT 0,
    validation_status validation_status DEFAULT 'PENDING_REVIEW',
    summary TEXT
);

CREATE TABLE IF NOT EXISTS document_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    raw_text TEXT,
    ocr_confidence DECIMAL(5, 4),
    image_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    page_id UUID REFERENCES document_pages(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    -- embedding vector(1536), -- Vector representation for hybrid semantic search
    bounding_box JSONB, -- { x, y, width, height }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. STRUCTURED DATA & METRICS
CREATE TABLE IF NOT EXISTS production_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL, -- Coal Production, Dispatch, Overburden Removal
    value DECIMAL(12, 3) NOT NULL,
    target DECIMAL(12, 3),
    unit VARCHAR(50) NOT NULL, -- MT, M.Cu.M, Lakh Tonnes
    financial_year VARCHAR(20) NOT NULL,
    subsidiary_code VARCHAR(20) REFERENCES subsidiaries(code),
    mine_id UUID REFERENCES mines(id),
    source_document_id UUID REFERENCES documents(id),
    source_page_number INTEGER,
    confidence DECIMAL(5, 4) NOT NULL,
    validation_status VARCHAR(50) DEFAULT 'VERIFIED',
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. DATA VALIDATION CONFLICTS & SOURCE RELIABILITY
CREATE TABLE IF NOT EXISTS source_reliability_hierarchy (
    id SERIAL PRIMARY KEY,
    document_type VARCHAR(100) UNIQUE NOT NULL,
    reliability_rank INTEGER NOT NULL,
    reliability_score INTEGER NOT NULL, -- 0 to 100
    description TEXT
);

CREATE TABLE IF NOT EXISTS validation_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    financial_year VARCHAR(20) NOT NULL,
    subsidiary_code VARCHAR(20) REFERENCES subsidiaries(code),
    mine_id UUID REFERENCES mines(id),
    severity VARCHAR(20) NOT NULL DEFAULT 'WARNING',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    conflict_description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS validation_issue_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES validation_issues(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id),
    page_number INTEGER NOT NULL,
    reported_value DECIMAL(12, 3) NOT NULL,
    reported_unit VARCHAR(50),
    snippet TEXT,
    is_authoritative BOOLEAN DEFAULT FALSE
);

-- 6. AI QUERIES & EVIDENCE TRACEABILITY
CREATE TABLE IF NOT EXISTS ai_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    query_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    response_time_ms INTEGER,
    confidence DECIMAL(5, 4),
    data_status VARCHAR(50) DEFAULT 'VERIFIED',
    chart_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_query_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ai_query_id UUID REFERENCES ai_queries(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id),
    page_number INTEGER NOT NULL,
    section_name VARCHAR(255),
    raw_text TEXT NOT NULL,
    bounding_box JSONB,
    confidence DECIMAL(5, 4)
);

-- 7. AUTOMATED REPORTS & APPROVAL PIPELINE
CREATE TYPE report_status AS ENUM (
    'DRAFT', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'ARCHIVED'
);

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    status report_status DEFAULT 'DRAFT',
    time_period VARCHAR(100),
    subsidiary_code VARCHAR(20) REFERENCES subsidiaries(code),
    mine_id UUID REFERENCES mines(id),
    generated_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    evidence_coverage DECIMAL(5, 2),
    verified_records_percentage DECIMAL(5, 2),
    sources_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS report_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    section_order INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    charts_json JSONB,
    tables_json JSONB
);

CREATE TABLE IF NOT EXISTS report_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. AUDIT LOGS (IMMUTABLE LOGGING)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(255) NOT NULL,
    user_role user_role NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(255) NOT NULL,
    document_name VARCHAR(500),
    previous_value TEXT,
    new_value TEXT,
    rationale TEXT,
    ip_address VARCHAR(50),
    session_token VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_documents_sub_mine ON documents(subsidiary_code, mine_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_production_records_year ON production_records(financial_year, subsidiary_code);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at DESC);
