// Every piece of text a person reads (CONVENTIONS.md §6). Components reference
// these rather than holding prose, which also makes it impossible to key
// behaviour off a label — see §8.
//
// Only prose lives here. Domain tags ("FL", "front"), identifiers (storage
// keys, routes, .glb paths) and Tailwind classes are not text and belong with
// the code that uses them.

export const STRINGS = {
  brand: {
    name: "Miata Fitment",
    logoAlt: "Miata Fitment Logo",
    exampleAlt: "MIATA FITMENT",
  },

  common: {
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    loading: "Loading",
    account: "Account",
  },

  visualizer: {
    goBack: "Go back",
    copyShareLink: "Copy share link",
    copied: "Copied!",
    openSettings: "Open settings",
  },

  settings: {
    title: "Settings",
    tabs: {
      alignment: "Alignment",
      wheels: "Wheels",
      tires: "Tires",
      car: "Car",
      account: "Account",
    },
  },

  units: {
    inches: "in",
    millimetres: "mm",
    percent: "%",
    millimetreValue: "{value} mm",
    inchValue: "{value}″",
    degreeValue: "{value}°",
  },

  alignment: {
    frontTitle: "Front Suspension",
    rearTitle: "Rear Suspension",
    rideHeight: "Ride Height",
    camber: "Camber",
    caster: "Caster",
    toe: "Toe",
    stockValue: "Stock ({value})",
    simulateBounce: "Simulate Bounce",
    moreUnderCarTab: "Additional suspension settings under the “Car” tab.",
  },

  wheels: {
    frontTitle: "Front",
    rearTitle: "Rear",
    matchFront: "Match front",
    width: "Width",
    diameter: "Diameter",
    offset: "Offset",
    spacer: "Spacer",
  },

  tires: {
    frontTitle: "Front Tires",
    rearTitle: "Rear Tires",
    width: "Width",
    sidewall: "Sidewall",
  },

  car: {
    selectionTitle: "Car Selection",
    generation: "Miata Generation",
    generationPlaceholder: "Select a generation",
    locked: "Locked",
    editable: "Editable",
    generationBlurb:
      "Select your Miata generation to view and customize its fitment settings. Each generation has unique wheel wells and suspension geometry.",
    generations: {
      na: "NA Miata (1989–1997)",
      nb: "NB Miata (1998–2005)",
      nc: "NC Miata (2006–2015)",
      nd: "ND Miata (2016–Present) (IN TEST)",
    },

    suspensionTitle: "Suspension",
    springRate: "Spring Rate",
    springPresets: {
      floaty: "Floaty",
      stockish: "Stock-ish",
      coilover: "Coilover",
      stancy: "Stancy",
    },
    springRateBlurb:
      "Higher rates feel stiffer and settle faster; lower rates bounce more.",
    springRateWip: "NOTE",
    springRateWipRest: " this is very WIP and very simplified",

    customizationTitle: "Car Customization",
    color: "Paint Color",
    colorBrightness: "Brightness",
    colorMetallic: "Metallic flake",
    wheelDesign: "Wheel Design",
    wheelDesignPlaceholder: "Select a wheel design",
    colors: {
      classicRed: "Classic Red",
      marinerBlue: "Mariner Blue",
      britishRacingGreen: "British Racing Green",
      sunburstYellow: "Sunburst Yellow",
      crystalWhite: "Crystal White",
      brilliantBlack: "Brilliant Black",
      silverStone: "Silver Stone",
    },
    bodyPartNames: {
      WingsWest: "Wings West W-Type Inspired",
      "stock": "Stock",
      "FrontBarAK": "AK Style",
      "FrontBarBN": "BN Style",
      "FrontBarHY": "HY Style",
      "FrontBarLip1": "Lip 1",
      "FrontBarLip2": "Lip 2",
      "FrontBarLip3": "Lip 3",
      "FrontBarPitcrew": "Pitcrew",
      "RearBarBN": "BN Style",
      "RearBarCut": "Cut Bumper",
      "RearBarPitcrew": "Pitcrew",
      "RearBarPitcrew2": "Pitcrew 2",
      "GuardAK": "AK Style",
      "GuardLipped": "Lipped",
      "FrontFlare": "Overfenders",
      "FrontFlareAK": "AK Style",
      "RearFlare": "Overfenders",
      "RearFlareAK": "AK Style",
      "RearFlareBL": "BL Style",
      "SideskirtsAK": "AK Style",
      "SideskirtsBN": "BN Style",
      "SideskirtsFW": "FW Style",
      "RoofOEM": "OEM Hardtop",
      "RoofPC": "PC Hardtop",
      "RoofFastback": "Fastback",
      "SpoilerDuck": "Ducktail",
      "SpoilerLip1": "Lip Spoiler",
      "HeadlightsPitcrew": "Pitcrew",
      "Rack": "Luggage Rack"
},
    bodySlots: {
      bumperFront: "Front Bumper",
      bumperRear: "Rear Bumper",
      fendersFront: "Front Guards",
      flaresFront: "Front Flares",
      flaresRear: "Rear Flares",
      skirts: "Side Skirts",
      roof: "Roof",
      wing: "Spoiler",
      headlights: "Headlights",
      rack: "Boot Rack",
    },
    customizationBlurb:
      "Paint, wheel design and body parts only change how the car is drawn — sizing and fitment are unaffected.",

    loginToChangeSelection: "change car selection",
    loginToChangeSuspension: "change suspension settings",
    loginPrompt: "Please {link} to {action}.",
    loginPromptLink: "log in",
  },

  account: {
    title: "Account",
    notSignedIn: "You’re not signed in.",
    signInBlurb: "Sign in to access your garage and account settings.",
    signIn: "Sign in",
    welcome: "Welcome, {name}",
    fallbackName: "User",
    tabs: {
      garage: "Garage",
      account: "Account",
    },
    settingsTitle: "Account Settings",
    metricUnits: "Metric units",
    metricBlurb: "Switch between imperial and metric",
    logout: "Logout",
    login: "Login",
  },

  garage: {
    title: "Garage",
    blurb: "Save up to {maxSaves} configurations. Load them anytime.",
    usage: "{count}/{maxSaves} used",
    empty: "No saved configs yet. Save one above and it’ll show up here.",
    nameLabel: "Name this config",
    namePlaceholder: 'e.g. "Track 15x8 +25 205/50"',
    save: "Save",
    overwriteAction: "Overwrite…",
    overwrite: "Overwrite",
    load: "Load",
    delete: "Delete",
    overwriteTitle: "Overwrite existing config?",
    overwriteBlurb:
      "This will replace the saved config named {name} with your current settings.",
  },

  auth: {
    headings: {
      login: "Welcome back",
      signup: "Create your account",
      reset: "Reset password",
    },
    subheadings: {
      login: "Sign in to access your saved setups and the visualizer.",
      signup:
        "Create an account to save wheel/tire setups and come back anytime.",
      reset: "We’ll send you a reset link to get back in.",
    },
    submit: {
      login: "Sign In",
      signup: "Create Account",
      reset: "Send Reset Email",
    },
    email: "Email Address",
    password: "Password",
    displayName: "Display name",
    forgotPassword: "Forgot password?",
    needAccount: "Need an account? Sign up",
    haveAccount: "Have an account? Sign in",
    backToSignIn: "Back to sign in",
    accountCreated: "Success! Account created. You can now sign in.",
    resetEmailSent: "Password reset email sent! Check your inbox.",
    loggedInAs: "Logged in as: {name}",
    errorDetail: "Error: {message}",
  },

  resetPassword: {
    title: "Set New Password",
    blurb: "Enter your new password below.",
    verifying: "Verifying reset link...",
    invalidLinkTitle: "Invalid Link",
    invalidLink: "This password reset link is invalid or has expired.",
    expiredLink: "Invalid or expired reset link. Please request a new one.",
    invalidSession: "This reset link is invalid. Please request a new one.",
    mismatch: "Passwords do not match.",
    mismatchInline: "Passwords do not match",
    tooShort: "Password must be at least 6 characters.",
    updated: "Password updated successfully! Redirecting to login...",
    updating: "Updating...",
    update: "Update Password",
    newPasswordPlaceholder: "At least 6 characters",
    confirmPlaceholder: "Re-enter your password",
  },

  landing: {
    simulatorTitle: "Fitment Simulator",
    simulatorBlurb:
      "Dial in your Miata’s fitment with our simulator. Select your Miata’s generation from the header and start customizing wheels, suspension, and more.",
    enterSimulator: "Enter Simulator",
    supportTitle: "Support",
    supportAlt: "Support Miata Fitment",
    supportBlurb:
      "This is a solo project with no outside funding. If you’d like to support the project and see it grow, please consider buying a sticker or buying me a coffee.",
    stickersSoldOut: "STICKERS SOLD OUT",
    buyCoffee: "Buy Me a Coffee",
    copyright: "© {year} Miata Fitment. All Rights Reserved.",
    madeWithLove: "Designed with 💙 for Miata enthusiasts.",
  },

  shop: {
    wheels: "Shop Matching Wheels",
    tires: "Shop Matching Tires",
    suspension: "Shop Coilovers",
  },
} as const;

/**
 * Fills `{name}` placeholders in a string from STRINGS.
 *
 * Placeholders with no matching value are left alone rather than blanked, so a
 * missing one shows up in the UI instead of silently disappearing.
 */
export function t(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    key in values ? String(values[key]) : placeholder,
  );
}
