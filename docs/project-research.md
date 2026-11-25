# Project-page evidence

Reviewed 26 November 2026. Read-only investigation of the four neighbouring repositories; no changes, migrations, application starts or external service calls in those projects. Local source establishes implemented workflows, not deployment, adoption, business results or individual authorship. Existing website artwork is reused; it is not a capture of client records.

## TriageFlow

Repository `triage-flow`, HEAD `4b00d45d`, clean at review.

- `backend/src/api/services/ai-triage.service.ts`: triage requests, structured recommendation prompt, published clinical-guidance retrieval and reviewer-feedback context.
- `backend/src/services/intake-rules/routing-decision.service.ts`: configured department appropriateness and regional service routing; disabled configuration returns no routing action.
- `backend/src/api/services/referral-feedback-finalization.service.ts`: validates feedback against departmental schema and logs finalisation actions.
- `frontend/src/components/pages/triage/conversation-boundary.ts`: distinguishes finalised, held and skipped drafts; rationale and quality checks govern the conversation boundary.
- `backend/src/api/routes/referrals.ts`, `backend/src/api/routes/documents.ts`: referral and document surfaces.

The page explains the workflow and review boundary. No clinical accuracy, certification, outcome or rollout claims.

## MySquare

Repository `rwa_square`, HEAD `65acf57`; existing local changes, including context updates, were present and left untouched. Active source is under `src/`, not legacy root scaffolding.

- `src/lib/pilot-features.ts`: automated payments, on-chain settlement, verified distributions and verified impact reporting are disabled.
- `src/app/api/releases/[releaseId]/reservations/route.ts`: multiple map-selection modes, availability rechecking, scoped eligibility and idempotent writes.
- `src/lib/billing/completion.ts`: checks reservation and verification state, prevents overlapping ownership and completes purchase/ownership records transactionally.
- `src/app/api/purchases/[id]/confirm/route.ts`: protected purchase confirmation and idempotency.
- `.context/project_overview.md` and `README.md`: operator/buyer/platform audiences, release operations, buyer allocation views and supported pilot boundaries, cross-checked against source above.

The page follows off-chain/operator-confirmed pilot scope; it does not describe unavailable financial capabilities as live.

## Workforce Management

Repository `PLP_BPO_WFM`, HEAD `cb55a86`; existing changes in dashboard tooling and export scripts were present and left untouched.

- `backend/app/routers/wfm_schedule.py`: Excel ingestion, employee matching, conflict detection and schedule notifications.
- `backend/app/services/schedule_change_detector.py`: added, cancelled, time-changed and day-off shift comparisons.
- `backend/app/services/leave_conflict_detector.py`: distinguishes approved-leave conflicts from pending-leave warnings.
- `backend/app/services/genesys_attendance_processor.py`: Genesys attendance export processing, identity matching and incomplete-session handling.
- `dashboard/src/app/reports/workforce-analytics/daily-adherence/page.tsx`: scheduled/actual hours and attendance reporting surface.
- `mobile/lib/screens/leave/`, `mobile/lib/services/schedule_service.dart`: employee leave and schedule surfaces.

The project is an integration layer. The page preserves the authority of upstream systems and claims no measured performance improvement.

## RFID Asset Management

Repository `MPlus_Asset_Management/MPlus_Asset_Platform`, HEAD `9ebdf4a`, clean at review.

- `apps/event-processor/src/pipeline.ts`: duplicate handling, reader/asset resolution, checkout and policy evaluation, movement recording and alarm intent.
- `apps/event-processor/src/index.ts`: deterministic movement decision categories and alarm rules.
- `apps/event-processor/src/alarm-outbox.ts`: retrying alarm commands with execution-acknowledgement tracking.
- `apps/portal/lib/checkout-status.ts`: active, exited and return-detected checkout distinctions.
- `packages/database/prisma/schema.prisma`: separate assignments, checkouts, movement events, policies and alarms.
- `docs/system/01-overview/system-context.md`: operational actors, hardware boundaries and dated evidence; distinguishes application implementation from physical commissioning.

The page explains implemented application flows without claiming a fully commissioned production hardware chain.

## Editorial choices

Problem statements and the grouping into product/engineering decisions are editorial interpretations of the workflows, not quotes from client interviews or historical accounts of the team’s deliberations. The pages do not claim sole authorship of every repository feature. They use company-neutral project descriptions, preserve previously requested absence of personal attribution, and avoid fabricated metrics and testimonials.

## Website implementation and checks

Four static pages under `work/`, shared `work.css`, updated homepage summaries/links and allowlisted project enquiry prefills in `page.js`. No project code was copied into the public pages. Kept existing site layout, hero and animation.

Local link existence check passed for the homepage and all four pages. Desktop browser review loaded all four project pages with images and no horizontal overflow. Reviewed shared mobile layout at 355 CSS px, single-column workflow and RFID-to-enquiry context. The enquiry settled below the fixed navigation at 110px. No form sent. JavaScript syntax and whitespace checks passed. Application test suites in the investigated repositories were not executed; this was source research, not validation of those applications.

## Approved clinical-capacity framing

26 November 2026, voice review. User approved reframing TriageFlow around demand exceeding clinical capacity, the time senior medical officers spend reviewing referrals, and AI-generated structured assessments with clinician oversight. Updated the local project title, introduction, problem statement, intended benefit and homepage summary. Potential time/cost savings remain unquantified pending evaluation. No deployment or application behaviour change. Copy-only whitespace check passed.

## Approved MySquare two-model framing

26 November 2026, voice review. User clarified and approved two propositions: conservation participation via custodial licences, and investment offerings linked to real-world assets including land/buildings. Updated the local MySquare title, introduction, problem, project focus, a dedicated two-model explanation, intended capabilities and homepage summary. Expanded the explicitly proposed AI section to marketing, project-launch coordination and buyer support across both models. User-supplied product framing is distinct from source-verified pilot features. Retained off-chain/operator-confirmed pilot scope and gated on-chain status. No claims of guaranteed returns, verified security backing, or implemented marketing agents. Copy/HTML whitespace check passed; no deployment this turn.

## Approved RFID movement-and-alert framing

26 November 2026, voice review. User approved the concrete asset movement story: tagged assets, readers at controlled exits, custody/checkout permissions, incident recording and alerts for rule breaches. Updated local page headline, introduction, problem, enabled workflow and homepage summary. Recorded presence does not imply continuous physical positioning. Preserved separate proposed AI investigation support and deterministic immediate alarm control. Copy-only whitespace check passed; no deployment this turn.
