/**
 * Special Ops Elite modules — Mission-Ready + Special Ops subscription only.
 * Priced above Pro+. Educational adversary emulation and live blue-cell crisis.
 * IDs 96–97 sit above PRO_MAX (95) and require the special_ops tier.
 */

'use strict';

const SPECIAL_OPS_MODULES = [
    {
        id: 96,
        name: 'Special Ops: Live Red Team Emulation',
        icon_key: 'redteam',
        category: 'offensive-tools',
        difficulty: 'expert',
        access_tier: 'special_ops',
        requires_rank: 'advanced',
        special_ops: true,
        badge_label: 'Special Ops Elite',
        description:
            'Authorized red-cell judgment: ATT&CK language, operator workflow, hunt artifacts, and written ROE. Evidence Workbench and drills — not a pentest gym or live exploit range.'
    },
    {
        id: 97,
        name: 'Special Ops: Live Blue Team Crisis Cell',
        icon_key: 'blueteam',
        category: 'forensics',
        difficulty: 'expert',
        access_tier: 'special_ops',
        requires_rank: 'advanced',
        special_ops: true,
        badge_label: 'Special Ops Elite',
        description:
            'Mission-Ready blue cell: contain, hunt universal footprints, prove detections, and brief leadership. Same four pillars as Red — defender desk, not a SIEM appliance to install.'
    }
];

const SPECIAL_OPS_MODULE_IDS = SPECIAL_OPS_MODULES.map((m) => m.id);

module.exports = {
    SPECIAL_OPS_MODULES,
    SPECIAL_OPS_MODULE_IDS
};
