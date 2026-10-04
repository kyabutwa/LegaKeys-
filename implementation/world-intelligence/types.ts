export type UUID = string;

export type TruthState =
  | "VERIFIED" | "DECLARED" | "OBSERVED" | "INFERRED"
  | "PROPOSED" | "UNKNOWN" | "CONFLICTING" | "STALE";

export type DataQuality =
  | "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN" | "CONFLICTING";

export type SourceKind =
  | "GNSS" | "WIFI" | "CELLULAR" | "BLUETOOTH" | "DEVICE"
  | "USER_INPUT" | "MAP_PROVIDER" | "WEATHER_PROVIDER"
  | "EARTH_OBSERVATION" | "CLIMATE_DATASET" | "SENSOR"
  | "HUMAN_MESSAGE" | "SYSTEM";

export interface Provenance {
  sourceId: UUID;
  sourceKind: SourceKind;
  acquiredAt: string;
  receivedAt: string;
  sourceVersion?: string;
  evidenceRefs: UUID[];
}

export interface Position {
  subjectId: UUID;
  latitude: number;
  longitude: number;
  altitudeMeters?: number | null;
  accuracyMeters?: number | null;
  speedMetersPerSecond?: number | null;
  headingDegrees?: number | null;
  observedAt: string;
  freshnessSeconds: number;
  source: SourceKind;
  truthState: TruthState;
  quality: DataQuality;
  provenance: Provenance;
  privacyScope: string;
}

export interface MapFeature {
  featureId: UUID;
  geometryType: "POINT" | "LINE" | "POLYGON" | "MULTI";
  geometry: unknown;
  coordinateReferenceSystem: string;
  semanticType: string;
  validFrom?: string;
  validTo?: string;
  truthState: TruthState;
  provenance: Provenance;
}

export interface WeatherObservation {
  areaRef: string;
  variable: string;
  value: number;
  unit: string;
  observedAt: string;
  issuedAt: string;
  forecastHorizonSeconds?: number | null;
  uncertainty?: number | null;
  source: SourceKind;
  truthState: TruthState;
  provenance: Provenance;
}

export interface EarthSystemObservation {
  sphere: "ATMOSPHERE" | "HYDROSPHERE" | "BIOSPHERE" | "CRYOSPHERE" | "GEOSPHERE";
  variable: string;
  value: number;
  unit: string;
  regionRef: string;
  observedAt: string;
  source: SourceKind;
  uncertainty?: number | null;
  truthState: TruthState;
  provenance: Provenance;
}

export interface ClimateIndicator {
  regionRef: string;
  variable: string;
  baselinePeriod: string;
  analysisPeriod: string;
  statistic: "MEAN" | "MEDIAN" | "ANOMALY" | "TREND" | "VARIANCE" | "EXTREME";
  value: number;
  unit: string;
  uncertainty?: number | null;
  methodRef: string;
  source: SourceKind;
  truthState: TruthState;
  provenance: Provenance;
}

export interface HumanUnderstanding {
  actorId: UUID;
  conversationId?: UUID;
  explicitContent: string;
  language?: string;
  intent?: string;
  needs?: string[];
  referencedEntities?: UUID[];
  inferredInterpretations?: Array<{ label: string; confidence: number }>;
  ambiguity: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  contextRefs: UUID[];
  truthState: TruthState;
  provenance: Provenance;
}

export interface ContextualUnderstanding {
  contextId: UUID;
  actorId?: UUID;
  subjectRefs: UUID[];
  placeRefs: UUID[];
  timeWindow: { start: string; end?: string };
  relationshipRefs: UUID[];
  capabilityRefs: UUID[];
  authorityRefs: UUID[];
  environmentalRefs: UUID[];
  humanUnderstandingRefs: UUID[];
  relevantFacts: string[];
  assumptions: string[];
  uncertainties: string[];
  truthState: TruthState;
  generatedAt: string;
}

export interface FibonacciPolicy {
  seedIntervals: number[];
  minimumInterval: number;
  maximumInterval: number;
  resetCondition: string;
  purpose: "SAMPLING" | "REVIEW" | "ZOOM" | "PRIORITIZATION";
}

export interface BlackHoleEnvelope {
  state: "QUARANTINED" | "RESTRICTED" | "UNAVAILABLE" | "INVALID" | "CONFLICTING";
  reason: string;
  sourceRefs: UUID[];
  enteredAt: string;
}

export interface WhiteHoleRelease {
  sourceRefs: UUID[];
  validationRefs: UUID[];
  releasedAt: string;
  releasedTruthState: TruthState;
}

export interface WorldIntelligenceRuntime {
  ingest(input: unknown): Promise<{ id: UUID; truthState: TruthState }>;
  resolvePosition(subjectId: UUID): Promise<Position | null>;
  understandHuman(input: string, contextRefs: UUID[]): Promise<HumanUnderstanding>;
  buildContext(input: ContextualUnderstanding): Promise<ContextualUnderstanding>;
  validateAndRelease(inputId: UUID): Promise<WhiteHoleRelease>;
}
