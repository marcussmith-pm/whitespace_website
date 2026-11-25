# AI within the project solutions

26 November 2026. Follow-up to the request to explain runtime agentic AI rather than AI-assisted development.

## Verified implementation

TriageFlow contains model-backed pathway selection and structured triage generation. `backend/src/services/intake-rules/intake-orchestrator.service.ts` invokes `aiPathwaySelectionService.selectPathway` when deterministic/existing pathway hints do not resolve selection. `ai-pathway-selection.service.ts` supplies configured candidates and operational rules to the generation provider, accepts only a configured candidate and returns unresolved on invalid output or failure. `backend/src/api/services/ai-triage.service.ts` retrieves clinical guidance, builds generation inputs and invokes the provider for assessment. Existing clinician-feedback finalisation and deterministic routing remain separate.

This supports describing bounded AI tasks embedded in a workflow. It does not establish a general autonomous, tool-choosing agent loop or autonomous clinical decision-making. Added a corresponding solution-AI section to the local TriageFlow page.

## Not verified in the other repositories

Searched active application trees and dependency/config surfaces for model providers, LLM calls, agent frameworks and agentic orchestration in MySquare, PLP_BPO_WFM and MPlus_Asset_Platform. No comparable runtime model/agent implementation found. Earlier reviewed integration workers, scheduled jobs, payment gates and RFID movement rules provide automation, not evidence of agentic AI. This is scoped source research, not proof that no external service exists.

## Potential extensions — proposals only, not implemented claims

- MySquare: an operations assistant could assemble project-scoped verification and purchase context, identify missing information and prepare an operator follow-up. Verification decisions, payment confirmation and ownership changes would retain explicit operator authority.
- WFM: an exception assistant could assemble roster, attendance and leave discrepancies and draft a supervisor briefing or follow-up. Existing source systems would remain authoritative; this is not evidence of autonomous rostering or staff decisions.
- RFID: an incident assistant could combine an asset’s custody, movement history and applied policy into an explanation and proposed investigation steps. Existing deterministic movement/alarm decisions would remain in charge of immediate event response.

User confirmed: show proposed agentic capabilities clearly. Added explicitly labelled proposed-extension sections to the local MySquare, WFM and RFID pages, with inputs, proposed work, review boundaries and a four-step illustrative workflow. TriageFlow describes verified model-backed tasks without claiming general autonomous clinical decision-making. No deployment requested or performed.
