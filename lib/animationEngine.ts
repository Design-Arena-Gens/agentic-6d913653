import { SignGloss, Animation } from "./types";

export function getSignAnimation(gloss: SignGloss): Animation[] {
  const animations: Animation[] = [];

  const baseAnimation: Animation = {
    head: { tilt: 0, nod: false, shake: false },
    eyebrows: "neutral",
    mouth: "closed",
    leftArm: {
      position: { x: -0.5, y: 0.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0.3 },
    },
    rightArm: {
      position: { x: 0.5, y: 0.5, z: 0 },
      rotation: { x: 0, y: 0, z: -0.3 },
    },
    duration: 0.5,
  };

  if (gloss.structure === "question") {
    baseAnimation.head = { tilt: 0, nod: false, shake: false };
    baseAnimation.eyebrows = "raised";
  } else if (gloss.structure === "negation") {
    baseAnimation.head = { tilt: 0, nod: false, shake: true };
  }

  if (gloss.nonManualMarkers) {
    for (const marker of gloss.nonManualMarkers) {
      if (marker === "brows-raised" || marker === "eyebrows-raised") {
        baseAnimation.eyebrows = "raised";
      } else if (marker === "brows-furrowed") {
        baseAnimation.eyebrows = "furrowed";
      } else if (marker === "head-shake") {
        baseAnimation.head!.shake = true;
      } else if (marker === "head-nod") {
        baseAnimation.head!.nod = true;
      } else if (marker === "head-tilt-right") {
        baseAnimation.head!.tilt = 1;
      } else if (marker === "head-tilt-left") {
        baseAnimation.head!.tilt = -1;
      } else if (marker === "mouth-open") {
        baseAnimation.mouth = "open";
      }
    }
  }

  for (let i = 0; i < gloss.signs.length; i++) {
    const sign = gloss.signs[i];
    const anim = { ...baseAnimation };

    const signAnimations: Record<string, Partial<Animation>> = {
      HELLO: {
        rightArm: {
          position: { x: 0.5, y: 1.2, z: 0.3 },
          rotation: { x: 0, y: 0, z: -0.5 },
        },
        head: { tilt: 0.3, nod: false, shake: false },
      },
      GOODBYE: {
        rightArm: {
          position: { x: 0.5, y: 1.2, z: 0.3 },
          rotation: { x: 0, y: 0.2, z: -0.8 },
        },
      },
      "THANK-YOU": {
        rightArm: {
          position: { x: 0.3, y: 1.0, z: 0.4 },
          rotation: { x: -0.5, y: 0, z: -0.5 },
        },
        head: { tilt: 0.5, nod: true, shake: false },
      },
      YES: {
        head: { tilt: 0, nod: true, shake: false },
        rightArm: {
          position: { x: 0.5, y: 0.8, z: 0.2 },
          rotation: { x: 0, y: 0, z: -0.3 },
        },
      },
      NO: {
        head: { tilt: 0, nod: false, shake: true },
        rightArm: {
          position: { x: 0.5, y: 1.0, z: 0.3 },
          rotation: { x: 0, y: 0, z: -0.5 },
        },
      },
      WHAT: {
        eyebrows: "raised",
        rightArm: {
          position: { x: 0.3, y: 1.2, z: 0.3 },
          rotation: { x: 0, y: -0.3, z: -0.8 },
        },
        leftArm: {
          position: { x: -0.3, y: 1.2, z: 0.3 },
          rotation: { x: 0, y: 0.3, z: 0.8 },
        },
      },
      HELP: {
        leftArm: {
          position: { x: -0.3, y: 1.0, z: 0.3 },
          rotation: { x: -0.3, y: 0, z: 0.5 },
        },
        rightArm: {
          position: { x: -0.2, y: 1.1, z: 0.3 },
          rotation: { x: -0.3, y: 0, z: 0 },
        },
      },
      SORRY: {
        rightArm: {
          position: { x: 0.2, y: 1.0, z: 0.4 },
          rotation: { x: -0.8, y: 0, z: -0.2 },
        },
        head: { tilt: -0.5, nod: false, shake: false },
      },
      HAPPY: {
        eyebrows: "raised",
        mouth: "open",
        rightArm: {
          position: { x: 0.5, y: 1.1, z: 0.4 },
          rotation: { x: -0.3, y: 0, z: -0.5 },
        },
      },
      SAD: {
        eyebrows: "furrowed",
        head: { tilt: -0.5, nod: false, shake: false },
        rightArm: {
          position: { x: 0.3, y: 1.0, z: 0.4 },
          rotation: { x: -0.5, y: 0, z: -0.3 },
        },
      },
      LOVE: {
        leftArm: {
          position: { x: -0.2, y: 1.0, z: 0.4 },
          rotation: { x: -0.8, y: 0, z: 0.3 },
        },
        rightArm: {
          position: { x: 0.2, y: 1.0, z: 0.4 },
          rotation: { x: -0.8, y: 0, z: -0.3 },
        },
      },
      UNDERSTAND: {
        rightArm: {
          position: { x: 0.3, y: 1.3, z: 0.3 },
          rotation: { x: -0.3, y: 0, z: -0.5 },
        },
        head: { tilt: 0, nod: true, shake: false },
      },
      KNOW: {
        rightArm: {
          position: { x: 0.3, y: 1.3, z: 0.3 },
          rotation: { x: -0.3, y: 0, z: -0.5 },
        },
      },
    };

    if (signAnimations[sign.sign]) {
      Object.assign(anim, signAnimations[sign.sign]);
    } else {
      anim.rightArm = {
        position: { x: 0.3, y: 0.9 + Math.random() * 0.3, z: 0.3 },
        rotation: { x: -0.3 + Math.random() * 0.2, y: 0, z: -0.5 },
      };
      anim.leftArm = {
        position: { x: -0.5, y: 0.5 + Math.random() * 0.2, z: 0 },
        rotation: { x: Math.random() * 0.3, y: 0, z: 0.3 },
      };
    }

    animations.push(anim);
  }

  return animations.length > 0 ? animations : [baseAnimation];
}
