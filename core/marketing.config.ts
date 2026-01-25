
import { PRICING_CONFIG } from './pricing.config';
import { PORTFOLIO_IMAGES, UI_TEXTURES } from '../assets/images/registry';

export const MARKETING_CONFIG = {
  HERO: {
    TITLE_MVP: "Deterministic",
    TITLE_SCALE: "Build Protocols",
    SUBHEADLINE: "High-Fidelity Design & Development Orchestration. Unified via Google UCP & Coinbase A2A rails."
  },

  BOOKING: {
    CONFIRMATION_TITLE: "Protocol Handshake Required",
    CONFIRMATION_SUMMARY: "You are about to initiate a Strategic Node Sync. Finality is governed by deterministic execution schedules and milestone-linked USDC draws.",
    CONF_LABEL: "CONFIRM_&_INITIALIZE_UPLINK",
    CANCEL_LABEL: "ABORT_SEQUENCE"
  },

  PRICING: {
    USDC_LABEL: "USDC",
    STABLECOIN_TOOLTIP: "Settlement optimized via Multi-Protocol Handshake (Google UCP + Coinbase A2A).",
    NETWORK_SIGNAL: "ACTIVE_MAINNET // SOL_BASE_UCP",
    SETTLEMENT_DESC: "Valuations in USDC. Sub-second finality via Agentic Settlement rails.",
    USDC_DETAILS: [
      { label: "Protocol", value: "Google UCP v1.4" },
      { label: "Sync Mode", value: "Coinbase A2A" },
      { label: "Rail", value: "USDC Stablecoin" },
      { label: "Status", value: "Deterministic" }
    ]
  },

  SERVICE_TIERS: {
    BRANDING: [
      { id: 'b_startup', name: 'Talent Node | Identity', summary: 'Foundational brand protocols for early-stage ventures. UCP ready.', features: ['Identity Systems', 'Social Strategy', 'UCP Sync'], tier: 'Identity' },
      { id: 'b_growing', name: 'Deployment Bundle | Presence', summary: 'High-fidelity creative orchestration. Verified via A2A handshake.', features: ['Content Engine', 'Video Protocol', 'Presence Node'], tier: 'Presence' },
      { id: 'b_established', name: 'Enterprise Advisory | Brand', summary: 'Global brand strategy led by Principal Nodes. Full UCP automation.', features: ['Advanced Strategy', 'Global SEO Node', 'Compliance Ops'], tier: 'Enterprise' }
    ],
    WEB3: [
      { id: 'w_startup', name: 'Protocol Node | Core', summary: 'Smart contract engineering. Native support for Coinbase A2A.', features: ['Solidity Engineering', 'Hardened Audit', 'A2A Logic'], tier: 'Foundational' },
      { id: 'w_growing', name: 'Treasury Bundle | Draw', summary: 'Advanced settlement infra via Google UCP rails.', features: ['UCP Bridge', 'Liquidity Nodes', 'Compliance Layer'], tier: 'Institutional' },
      { id: 'w_established', name: 'Ecosystem Node | Mesh', summary: 'Full-scale L1/L2 orchestration featuring dual-protocol reconciliation.', features: ['Mesh Architecture', 'Staking Hubs', 'Audit Parity'], tier: 'Enterprise' }
    ],
    FULLSTACK: [
      { id: 'f_scale', name: 'Execution Node | Core', summary: 'Next.js architecture with integrated Google UCP commerce nodes.', features: ['Next.js Architecture', 'Cloud Native', 'UCP Native'], tier: 'Scale' },
      { id: 'f_velocity', name: 'Performance Bundle | Pro', summary: 'Enterprise development with Coinbase A2A agentic workflow support.', features: ['A2A Agent Mesh', 'CI/CD Pipelines', 'Velocity Monitoring'], tier: 'Velocity' },
      { id: 'f_enterprise', name: 'Optimization Node | Mastery', summary: 'Systemic optimization for institutional-scale UCP/A2A settlements.', features: ['Latency Compression', 'Zero-Downtime', 'Audit Readiness'], tier: 'Mastery' }
    ]
  },

  PORTFOLIO: [
    { id: 'dc-01', name: 'PROTOCOL_V4', systemType: 'FINTECH • L2 • USDC', clientStage: 'Enterprise', year: '2024', month: 'MARCH', clientPartner: 'FRIZDA_CORP', longDescription: 'HIGH-FIDELITY SETTLEMENT RAILS FEATURING SUB-SECOND FINALITY VIA GOOGLE UCP v1.4 INTEGRATION.', bgTexture: PORTFOLIO_IMAGES.QUANTUM_LEDGER, caseStudyUrl: '#', techStack: ['UI/UX', 'UCP', 'FINTECH'] },
    { id: 'dc-02', name: 'VOX_NODE', systemType: 'AI • AGENTIC • UCP', clientStage: 'Growth', year: '2024', month: 'FEBRUARY', clientPartner: 'FUNDIO_VC', longDescription: 'AUTONOMOUS ORCHESTRATION ENGINE SYNCHRONIZING AGENTIC LLM NODES WITH INSTITUTIONAL CAPITAL.', bgTexture: PORTFOLIO_IMAGES.VOX_ORCHESTRATOR, caseStudyUrl: '#', techStack: ['AI', 'AGENTIC', 'SAAS'] },
    { id: 'dc-03', name: 'BOTANICAL_GRID', systemType: 'ASSET • WEB3 • MESH', clientStage: 'Internal', year: '2023', month: 'NOVEMBER', clientPartner: 'CREATIVE_NODE_V', longDescription: 'SOVEREIGN ASSET MANAGEMENT SYSTEM GOVERNED BY SRT REPUTATION VECTORS.', bgTexture: PORTFOLIO_IMAGES.BOTANICAL_CMS, caseStudyUrl: '#', techStack: ['WEB3', 'GRAPHQL', 'SRT'] }
  ],

  L2L: {
    PHASES: [
      { id: 0, title: 'Inception Protocol', desc: 'Age 17–18. Exposure to institutional build patterns and technical logic.' },
      { id: 1, title: 'Core Handshake', desc: 'Age 19–22. Initiation of verified delivery sequences and velocity tracking.' },
      { id: 2, title: 'Execution Layer', desc: 'Age 19–22. Completion of specialized node projects with SRT recording.' },
      { id: 3, title: 'Verification Gate', desc: 'Age 22+. Protocol attestation of professional capability and SRT audit.' },
      { id: 4, title: 'Marketplace Sync', desc: 'Age 23–30. Deployment into the active Juice Node execution marketplace.' }
    ],
    ROLES: [
      { id: 'CORE_CODER', label: 'Core Coder', desc: 'Logic & Protocol Engineering' },
      { id: 'BUILDER_PLUS', label: 'Builder+', desc: 'Full-Stack Execution' },
      { id: 'PROTOCOL_ENG', label: 'Blockchain', desc: 'Smart Contracts & L2' },
      { id: 'SIGNAL_OPS', label: 'Distribution', desc: 'Audience & Network' },
      { id: 'ARCH_LEAD', label: 'Project Lead', desc: 'Strategy & Triage' },
      { id: 'INNOV_NODE', label: 'Innovator', desc: 'Rapid Synthesis' }
    ]
  }
} as const;
