# COALINTELLIGENCE AI
### AI-Powered Geological, Mining & Reporting Intelligence Platform
**Designed for CMPDI / Coal India Limited (CIL) Subsidiaries / Ministry of Coal Workflows**

---

## 1. Executive Summary & Core Principle

**COALINTELLIGENCE AI** transforms large volumes of historical and contemporary geological, mining, production, administrative, and parliamentary records into structured, searchable, and auditable intelligence.

### The Core Operational Principle:
$$\mathbf{ANSWER} + \mathbf{EVIDENCE} + \mathbf{SOURCE} + \mathbf{CONFIDENCE} + \mathbf{TRACEABILITY}$$

* **Never Fabricates:** The system strictly adheres to Safety Rule 1: No hallucinations. When evidence is missing or ambiguous, it explicitly returns:
  > *"Insufficient verified information found in the available records."*
* **Numerical Integrity:** Queries asking for production sums, decadal trends, and target variances execute against structured database tables rather than relying on LLM arithmetic.
* **Pixel-to-Report Traceability:** Every factual statement, chart node, and generated report links directly to its source document, page number, spatial bounding box, and physical archive location.

---

## 2. Key Architecture & Feature Matrix

| Module | Route | Key Capabilities |
| :--- | :--- | :--- |
| **Command Center Dashboard** | `/` | 6 executive KPI cards, 10-year production curves, target vs actual achievement, data quality progress bars, recent reports stream, recent AI queries, and operational alerts. |
| **Document Intelligence Center** | `/documents` | Faceted repository search (subsidiary, mine, category, year), 7-step automated digitization & ingestion pipeline with simulated OCR, table detection, and entity extraction. |
| **Document Detail & Split Viewer** | `/documents/:id` | Left: Document canvas with zoom, page navigation, and bounding box overlays. Right: Extracted geological, mining, production, and administrative entities with "View Evidence" modal. |
| **Ask CoalIntelligence (AI Center)** | `/ai` | Hybrid query engine (Intent Detection $\rightarrow$ Structured SQL + Semantic Vector Search $\rightarrow$ Citation Generator). Includes rendered inline charts, confidence badges, and follow-up prompts. |
| **Automated Report Builder** | `/reports/create` | 5-step interactive wizard configuring report type, geographic/temporal scope, metrics checklist, and statutory evidence thresholds. |
| **Official Report & Governance** | `/reports/:id` | Official CMPDI/CIL layout, executive summary, production variance tables, reviewer sign-off workflow (`DRAFT` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `APPROVED`), and PDF/DOCX/XLSX export. |
| **Historical Analytics & Anomalies** | `/analytics` | 10-year decadal curves, overburden removal (OBR) scaling, mine-level benchmarking (Gevra, Kusmunda, Jayant, etc.), and Anomaly Investigation dossiers. |
| **Topics & Trends** | `/topics` | Interactive TF-IDF mining word cloud, topic distribution pie chart, and decadal evolution timeline (2010–2015 vs 2016–2020 vs 2021–2026). |
| **Data Validation & Conflicts** | `/validation` | Cross-document conflict detector (e.g., Annual Report vs Form IV discrepancy), side-by-side source evaluation, authoritative designation, and configurable statutory reliability hierarchy. |
| **Knowledge Base & Lineage** | `/knowledge` | Multi-tier SVG knowledge graph (CIL $\rightarrow$ Subsidiaries $\rightarrow$ Coalfields $\rightarrow$ Mines) and 7-stage pixel-to-report data lineage tracer. |
| **Audit Trail** | `/audit` | Immutable cryptographically-chained event log recording user, action, target entity, previous value, new value, auditor rationale, and session metadata with CSV export. |
| **Administration & RBAC** | `/administration` | Authorized personnel directory with role badges (`SUPER_ADMIN`, `ADMIN`, `ANALYST`, `OFFICER`, `AUDITOR`) and background queue diagnostics. |
| **Settings & AI Configuration** | `/settings` | Toggle between `AI_MODE=mock` and `production`, LLM provider selector (Gemini 2.0, Claude 3.5, GPT-4o, Ollama), temperature slider, and OCR thresholds. |
| **Global Search** | `Ctrl+K` | Real-time cross-category search modal spanning documents, reports, mines, production records, and topics. |

---

## 3. Technology Stack

### Frontend (`client/`)
* **Framework:** React 18+ with TypeScript & Vite
* **Styling:** Tailwind CSS with custom industrial dark palette (charcoal `#0D1117`, graphite `#161B22`, coal `#1E2530`, gold accents `#F59E0B`, emerald `#10B981`, ruby `#EF4444`)
* **Icons:** `lucide-react`
* **Charts:** `recharts` for production trajectories, target vs actual bars, and decadal evolution curves
* **Routing:** `react-router-dom` v6

### Backend (`server/`)
* **Runtime:** Node.js v22+ with TypeScript (`tsx`)
* **Framework:** Express.js with modular REST routing
* **File Uploads:** `multer` with 7-stage pipeline simulation
* **Data Storage:** High-performance embedded store with rich CMPDI/CIL seed data (20+ documents, 15 mines, 10 financial years, 10 conflict cases, reports, and topics)
* **Production Database:** Complete PostgreSQL + `pgvector` DDL schema script included in `server/src/database/schema.sql`

### AI Architecture: Pluggable Provider Abstraction
The system provides clean interfaces in `server/src/services/ai/providers.ts`:
* `LLMProvider`
* `OCRProvider`
* `EmbeddingProvider`
* `VectorSearchProvider`
* `DocumentParser`
* `ReportGenerator`

Default mode is **`AI_MODE=mock`** which runs instantly and deterministically without external cloud dependencies. Switching to **`AI_MODE=production`** connects to Gemini, OpenAI, Claude, or local Ollama endpoints without changing any frontend code.

---

## 4. Installation & Getting Started

### Prerequisites
* Node.js v18+ (tested on v22.17.1)
* npm v9+

### Quick Start (Single Command)
```powershell
# 1. Clone or navigate to the repository
cd "v:\SIH\Mining Solution"

# 2. Install all dependencies for root, server, and client
npm run install:all

# 3. Start both backend and frontend concurrently
npm run dev
```

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 5. End-to-End Evaluation Journey (Section 57)

To verify the platform for a **Ministry of Coal / CIL Technical Evaluation Committee**, perform the following demonstration:

1. **Login & RBAC:**
   * Open [http://localhost:3000/login](http://localhost:3000/login).
   * Click **"Super Admin"** (Dr. Rajeshwar Sharma) for one-click access.
2. **Command Center Dashboard:**
   * Review the 6 KPI cards (128,452 documents, 2.4M pages, 4.8M records, 97.8% verified).
   * Inspect the 10-year production target vs actual trajectory bar chart and operational alerts.
3. **Document Ingestion & Split Viewer:**
   * Navigate to `/documents`. Click **"Upload & Ingest Document"**.
   * Select a sample file or use defaults. Watch the 7-stage live pipeline (`Uploaded` $\rightarrow$ `Classifying` $\rightarrow$ `OCR` $\rightarrow$ `Text` $\rightarrow$ `Tables` $\rightarrow$ `Entities` $\rightarrow$ `Indexed`).
   * Open `CIL_Annual_Report_Accounts_FY2023_24.pdf` (`/documents/doc-01`).
   * Inspect extracted entities, tables, and click **"View Evidence"** to see spatial bounding box coordinates.
4. **Ask CoalIntelligence:**
   * Navigate to `/ai`.
   * Click the prompt: *"Compare production from 2015 to 2025"*.
   * Observe the rendered line chart, statistical highlights (+53.2% growth), and citations.
   * Ask follow-up: *"Which years were below production targets?"*. Observe the target deficit breakdown.
   * Test Safety Rule 1 by asking: *"What is the coal production in Mars Olympus Mons mine?"*. Verify the system returns: *"Insufficient verified information found in the available records."*
5. **Automated Report Builder & Approval:**
   * Navigate to `/reports/create`. Complete the 5-step wizard to synthesize a new Parliamentary Response.
   * Open the generated report, review the evidence coverage score (98.2%), and click **"Approve & Sign Report"**.
   * Export to PDF / DOCX / XLSX.
6. **Data Validation & Conflict Resolution:**
   * Navigate to `/validation`.
   * Open Case #val-101 (Kusmunda 0.40 MT discrepancy between Annual Report and Form IV).
   * Inspect the side-by-side sources, select the authoritative source, enter reviewer rationale, and click **"Confirm & Designate Authoritative Value"**.
7. **Audit Trail Verification:**
   * Navigate to `/audit`.
   * Verify that the conflict resolution and report approvals were immediately committed to the immutable event log.
8. **Knowledge Graph & Lineage:**
   * Navigate to `/knowledge`. Explore the hierarchical entity graph (CIL $\rightarrow$ SECL $\rightarrow$ Korba $\rightarrow$ Gevra) and inspect the 7-stage data lineage tracer.

---

## 6. API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System diagnostics, queue counts, uptime, and AI mode status. |
| `GET` | `/api/documents` | Faceted search across statutory documents with filters. |
| `GET` | `/api/documents/:id` | Full document detail, pages, extracted entities, and tables. |
| `POST` | `/api/documents/upload` | Multipart file upload triggering the 7-stage ingestion worker. |
| `POST` | `/api/ai/query` | Hybrid query engine executing SQL calculations + vector retrieval. |
| `GET` | `/api/ai/history` | Historical AI conversations with citations and confidence metrics. |
| `GET` | `/api/reports` | List of generated statutory reports and approval states. |
| `POST` | `/api/reports/generate` | Synthesize new multi-section report draft with citations. |
| `POST` | `/api/reports/:id/status` | Update approval stage (`UNDER_REVIEW`, `APPROVED`, etc.) with comments. |
| `GET` | `/api/validation/issues` | Active data conflicts between multi-source documents. |
| `POST` | `/api/validation/resolve` | Resolve conflict with authoritative source and audit rationale. |
| `GET` | `/api/analytics/production-trends` | 10-year production, target, dispatch, and OBR records. |
| `GET` | `/api/analytics/anomalies` | Detected operational deviations and corroborating documents. |
| `GET` | `/api/topics` | TF-IDF word cloud topics and decadal temporal evolution. |
| `GET` | `/api/knowledge/graph` | Multi-tier knowledge graph nodes and edges. |
| `GET` | `/api/knowledge/lineage/:id?` | Seven-stage pixel-to-report provenance lineage. |
| `GET` | `/api/audit` | Immutable audit log with user, target, previous/new values, and IP. |
| `GET` | `/api/search?q=:query` | Global search across documents, reports, mines, queries, and topics. |

---

## 7. License & Compliance

Developed for official technical evaluation under **CMPDI / Coal India Limited (CIL) / Ministry of Coal** operational standards.
*All data provided in default demonstration mode is realistically modeled and clearly watermarked as **DEMO DATA** in accordance with Section 34.*
# Mining-Goal
# Mining-Goal
# Mining-Goal
