// ==========================================
// LAB TASK MANAGER CONFIGURATION
// ==========================================

export const STANDARD_TEAM = [
    "Divya",
    "Seeddhartha",
    "Malavika",
    "Ankita",
    "Shahina",
    "Sruthilaya",
    "Devanshee",
    "Aafra",
    "Tanzeel",
    "Devanshi G", // Added as requested
    "Sneha"       // Added as requested
];

// Flattened list of people for tip filling
export const TIP_FILLING_TEAM = [
    "Malavika", "Seeddhartha",
    "Ankita", "Shahina",
    "Sruthilaya", "Devanshee",
    "Aafra", "Tanzeel",
    "Devanshi G", "Sneha" // Updated J back to G for consistency
];

export const CLEANING_TEAM = [
    "Divya",
    "Malavika",
    "Shahina",
    "Sruthilaya",
    "Devanshee",
    "Aafra",
    "Tanzeel"
];

export const TASKS = [
    { name: "BCA standards (5, 2, 1, 0.5, 0.1, 0.05)", roster: STANDARD_TEAM },
    { name: "10X TBS (1L)", roster: STANDARD_TEAM },
    { name: "10X Transfer buffer (1L)", roster: STANDARD_TEAM },
    { name: "10X Running buffer (1L)", roster: STANDARD_TEAM },
    { name: "2M KCl (1L)", roster: STANDARD_TEAM },
    { name: "1M HEPES (1L)", roster: STANDARD_TEAM },
    { name: "Protein loading dye (10mL)", roster: STANDARD_TEAM },
    { name: "SDS Staining solution (300mL)", roster: STANDARD_TEAM },
    { name: "SDS Destaining solution (1L)", roster: STANDARD_TEAM },
    { name: "pH 6.8 buffer (1L)", roster: STANDARD_TEAM },
    { name: "pH 8.8 buffer (1L)", roster: STANDARD_TEAM },
    { name: "10% APS (10mL)", roster: STANDARD_TEAM },
    { name: "Kanamycin solution (20mL)", roster: STANDARD_TEAM },
    { name: "Ampicillin solution (20mL)", roster: STANDARD_TEAM },
    { name: "1M IPTG (20mL)", roster: STANDARD_TEAM },
    { name: "DNases (10mL)", roster: STANDARD_TEAM },
    { name: "1ml tip filling", roster: STANDARD_TEAM },
    { name: "200ul tip filling", roster: TIP_FILLING_TEAM },
    { name: "10ul tip filling", roster: TIP_FILLING_TEAM },
    { name: "Kan LB plates (250mL LBA)", roster: STANDARD_TEAM },
    { name: "Amp LB plates (250mL LBA)", roster: STANDARD_TEAM },
    { name: "70% glycerol autoclaved (50mL)", roster: STANDARD_TEAM },
    { name: "70% alcohol (3L) wash bottles + 500ml bottle(1)", roster: STANDARD_TEAM },
    { name: "5M Imidazole (20mL)", roster: STANDARD_TEAM },
    { name: "25% Triton-100 (40mL)", roster: STANDARD_TEAM },
    { name: "10X TAE (1L)", roster: STANDARD_TEAM },
    { name: "Comp cells BL21 (100mL starter)", roster: STANDARD_TEAM },
    { name: "Thrombin", roster: CLEANING_TEAM },
    { name: "BLOT discard", roster: STANDARD_TEAM },
    { name: "FPLC column wash with 0.5M NaOH (once/month)", roster: CLEANING_TEAM },
    { name: "Computer area cleaning", roster: CLEANING_TEAM }
];

// Initial State Configuration
export const INITIAL_STATE_CONFIG = {
    0: { current: "Sruthilaya", skips: [] },
    1: { current: "Ankita", skips: [] },
    2: { current: "Devanshee", skips: ["Ankita"] },
    3: { current: "Sruthilaya", skips: [] },
    4: { current: "Devanshee", skips: ["Seeddhartha", "Sruthilaya"] },
    5: { current: "Sruthilaya", skips: [] },
    6: { current: "Ankita", skips: [] },
    7: { current: "Ankita", skips: [] },
    8: { current: "Aafra", skips: ["Devanshee"] },
    9: { current: "Sruthilaya", skips: [] },
    10: { current: "Ankita", skips: [] },
    11: { current: "Aafra", skips: ["Seeddhartha", "Malavika", "Ankita", "Devanshee", "Tanzeel"] },
    12: { current: "Seeddhartha", skips: [] },
    13: { current: "Devanshee", skips: [] },
    14: { current: "Malavika", skips: [] },
    15: { current: "Devanshee", skips: ["Malavika"] },
    16: { current: "Sruthilaya", skips: [] },
    17: { current: "Ankita", skips: ["Malavika"] },
    18: { current: "Ankita", skips: ["Malavika"] },
    19: { current: "Devanshee", skips: ["Divya", "Sruthilaya"] },
    20: { current: "Devanshee", skips: [] },
    21: { current: "Ankita", skips: ["Divya"] },
    22: { current: "Sruthilaya", skips: [] },
    23: { current: "Divya", skips: [] },
    24: { current: "Devanshee", skips: ["Sruthilaya"] },
    25: { current: "Ankita", skips: [] },
    26: { current: "Seeddhartha", skips: [] },
    27: { current: "Shahina", skips: [] },
    28: { current: "Ankita", skips: [] },
    29: { current: "Shahina", skips: [] },
    30: { current: "Devanshee", skips: [] }
};
