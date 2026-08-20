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
            'Authorized, rules-of-engagement red-team tradecraft under live pressure. Offensive, practical, and educational — not a crime toolkit.'
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
            'Mission-Ready blue-cell: contain, hunt, and brief leadership while a live intrusion unfolds. Paired counterpart to the Red Team Special Ops module.'
    }
];

const SPECIAL_OPS_MODULE_IDS = SPECIAL_OPS_MODULES.map((m) => m.id);

module.exports = {
    SPECIAL_OPS_MODULES,
    SPECIAL_OPS_MODULE_IDS
};
