export interface Sign {
  sign: string;
  fingerspell?: boolean;
  uncertain?: boolean;
}

export interface SignGloss {
  signs: Sign[];
  nonManualMarkers?: string[];
  structure: "topic-comment" | "standard" | "question" | "negation";
}

export interface SafetyResult {
  allowed: boolean;
  message?: string;
  resources?: string[];
}

export interface ProcessingResult {
  gloss: SignGloss;
  caption: string;
  safety?: SafetyResult;
}

export interface Animation {
  head?: {
    tilt?: number;
    nod?: boolean;
    shake?: boolean;
  };
  eyebrows?: "raised" | "furrowed" | "neutral";
  mouth?: "open" | "closed" | "morpheme";
  leftArm?: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  };
  rightArm?: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  };
  duration: number;
}
