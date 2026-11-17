// Central demo data: ranks, lessons, recipes, guides, achievements, quests.

export const RANKS = [
  { name: 'Beginner',   threshold: 0 },
  { name: 'Apprentice', threshold: 500 },
  { name: 'Warrior',    threshold: 1500 },
  { name: 'Expert',     threshold: 3500 },
  { name: 'Master',     threshold: 7000 },
  { name: 'Legend',     threshold: 12000 },
];

export const LESSONS = {
  controls: [
    { id: 'c1', title: 'Movement keys', difficulty: 'Beginner', minutes: 4, xp: 40, module: 'controls' },
    { id: 'c2', title: 'Hotbar & inventory', difficulty: 'Beginner', minutes: 5, xp: 40, module: 'controls' },
    { id: 'c3', title: 'Chest management', difficulty: 'Beginner', minutes: 4, xp: 40, module: 'controls' },
    { id: 'c4', title: 'Item transfer & sorting', difficulty: 'Apprentice', minutes: 5, xp: 50, module: 'controls' },
  ],
  movement: [
    { id: 'm1', title: 'Sprinting & jumping', difficulty: 'Beginner', minutes: 5, xp: 50, module: 'movement' },
    { id: 'm2', title: 'Parkour basics', difficulty: 'Apprentice', minutes: 6, xp: 60, module: 'movement' },
    { id: 'm3', title: 'Strafing & positioning', difficulty: 'Apprentice', minutes: 5, xp: 60, module: 'movement' },
    { id: 'm4', title: 'Combat timing (edition notes)', difficulty: 'Warrior', minutes: 7, xp: 70, module: 'movement' },
  ],
  crafting: [
    { id: 'cr1', title: 'Tools & weapons', difficulty: 'Beginner', minutes: 6, xp: 50, module: 'crafting' },
    { id: 'cr2', title: 'Armor basics', difficulty: 'Beginner', minutes: 5, xp: 50, module: 'crafting' },
    { id: 'cr3', title: 'Enchanting & lapis', difficulty: 'Apprentice', minutes: 6, xp: 60, module: 'crafting' },
    { id: 'cr4', title: 'Anvils & grindstones', difficulty: 'Warrior', minutes: 6, xp: 70, module: 'crafting' },
  ],
  secrets: [
    { id: 's1', title: 'Villager trading', difficulty: 'Apprentice', minutes: 6, xp: 60, module: 'secrets' },
    { id: 's2', title: 'Stronghold search', difficulty: 'Warrior', minutes: 7, xp: 70, module: 'secrets' },
    { id: 's3', title: 'Nether navigation', difficulty: 'Warrior', minutes: 7, xp: 70, module: 'secrets' },
    { id: 's4', title: 'End preparation', difficulty: 'Expert', minutes: 8, xp: 90, module: 'secrets' },
  ],
};

export const MODULES = [
  { key: 'controls', title: 'Controls & Inventory', href: 'controls.html', desc: 'Master keys, hotbar, chests.' },
  { key: 'movement', title: 'Movement & Combat',   href: 'movement-combat.html', desc: 'Sprint, parkour, positioning.' },
  { key: 'crafting', title: 'Crafting & Enchanting', href: 'crafting.html', desc: '3×3 grid, recipes, enchanting.' },
  { key: 'secrets',  title: 'Secrets & Survival',  href: 'secrets.html', desc: 'Mobs, farming, Nether, End.' },
];

export const KEYBOARD = [
  { key: 'W', category: 'movement', desc: 'Move forward.' },
  { key: 'A', category: 'movement', desc: 'Move left.' },
  { key: 'S', category: 'movement', desc: 'Move backward.' },
  { key: 'D', category: 'movement', desc: 'Move right.' },
  { key: 'Space', category: 'movement', desc: 'Jump. Hold to swim up in water.' },
  { key: 'Shift', category: 'movement', desc: 'Sneak / descend. Also used for dismounting.' },
  { key: 'Ctrl',  category: 'movement', desc: 'Sprint while moving forward.' },
  { key: 'E', category: 'inventory', desc: 'Open player inventory.' },
  { key: 'Q', category: 'inventory', desc: 'Drop the held item (single).' },
  { key: '1–9', category: 'inventory', desc: 'Select hotbar slot 1 through 9.' },
  { key: 'F', category: 'inventory', desc: 'Swap held item with offhand.' },
  { key: 'T', category: 'inventory', desc: 'Open chat.' },
  { key: 'Left Click', category: 'combat', desc: 'Attack / break block.' },
  { key: 'Right Click', category: 'combat', desc: 'Use item / place block / block with shield.' },
  { key: 'F3', category: 'utility', desc: 'Toggle debug screen (Java).' },
  { key: 'F5', category: 'utility', desc: 'Cycle camera perspective.' },
  { key: 'F11', category: 'utility', desc: 'Toggle fullscreen.' },
  { key: 'Esc', category: 'utility', desc: 'Pause game / close menus.' },
];

export const INGREDIENT_ITEMS = [
  { id: 'plank',  name: 'Oak Planks',  icon: '🟫', color: '#a07845' },
  { id: 'stick',  name: 'Stick',       icon: '🥢', color: '#8a6b3c' },
  { id: 'iron',   name: 'Iron Ingot',  icon: '⬜', color: '#c7c7c7' },
  { id: 'diamond',name: 'Diamond',     icon: '💎', color: '#4fc3f7' },
  { id: 'gold',   name: 'Gold Ingot',  icon: '🟨', color: '#ffc94d' },
  { id: 'cobble', name: 'Cobblestone', icon: '⬛', color: '#7a7a7a' },
  { id: 'string', name: 'String',      icon: '🧵', color: '#e6e6e6' },
  { id: 'leather',name: 'Leather',     icon: '🟫', color: '#a06a3a' },
  { id: 'wheat',  name: 'Wheat',       icon: '🌾', color: '#d9b45a' },
  { id: 'sugar',  name: 'Sugar',       icon: '🍬', color: '#ffffff' },
  { id: 'egg',    name: 'Egg',         icon: '🥚', color: '#f2e2c4' },
  { id: 'cocoa',  name: 'Cocoa Beans', icon: '🫘', color: '#5b3623' },
  { id: 'book',   name: 'Book',        icon: '📕', color: '#8a3a3a' },
  { id: 'paper',  name: 'Paper',       icon: '📄', color: '#f2f2f2' },
];

// Structured shaped recipes on a 3×3 grid. `pattern` uses null for empty cells.
export const RECIPES = [
  {
    id: 'crafting-table', name: 'Crafting Table', category: 'utility', difficulty: 'easy', xp: 20,
    shaped: true,
    pattern: [['plank', 'plank', null], ['plank', 'plank', null], [null, null, null]],
    output: { id: 'crafting-table', name: 'Crafting Table', icon: '🧰' },
  },
  {
    id: 'stick', name: 'Stick', category: 'utility', difficulty: 'easy', xp: 15,
    shaped: true,
    pattern: [[null, 'plank', null], [null, 'plank', null], [null, null, null]],
    output: { id: 'stick', name: 'Stick', icon: '🥢' },
  },
  {
    id: 'wooden-pickaxe', name: 'Wooden Pickaxe', category: 'tools', difficulty: 'easy', xp: 25,
    shaped: true,
    pattern: [['plank', 'plank', 'plank'], [null, 'stick', null], [null, 'stick', null]],
    output: { id: 'wooden-pickaxe', name: 'Wooden Pickaxe', icon: '⛏' },
  },
  {
    id: 'stone-pickaxe', name: 'Stone Pickaxe', category: 'tools', difficulty: 'easy', xp: 30,
    shaped: true,
    pattern: [['cobble', 'cobble', 'cobble'], [null, 'stick', null], [null, 'stick', null]],
    output: { id: 'stone-pickaxe', name: 'Stone Pickaxe', icon: '⛏' },
  },
  {
    id: 'iron-pickaxe', name: 'Iron Pickaxe', category: 'tools', difficulty: 'medium', xp: 40,
    shaped: true,
    pattern: [['iron', 'iron', 'iron'], [null, 'stick', null], [null, 'stick', null]],
    output: { id: 'iron-pickaxe', name: 'Iron Pickaxe', icon: '⛏' },
  },
  {
    id: 'iron-sword', name: 'Iron Sword', category: 'weapons', difficulty: 'medium', xp: 35,
    shaped: true,
    pattern: [[null, 'iron', null], [null, 'iron', null], [null, 'stick', null]],
    output: { id: 'iron-sword', name: 'Iron Sword', icon: '🗡' },
  },
  {
    id: 'diamond-sword', name: 'Diamond Sword', category: 'weapons', difficulty: 'hard', xp: 60,
    shaped: true,
    pattern: [[null, 'diamond', null], [null, 'diamond', null], [null, 'stick', null]],
    output: { id: 'diamond-sword', name: 'Diamond Sword', icon: '🗡' },
  },
  {
    id: 'iron-helmet', name: 'Iron Helmet', category: 'armor', difficulty: 'medium', xp: 35,
    shaped: true,
    pattern: [['iron', 'iron', 'iron'], ['iron', null, 'iron'], [null, null, null]],
    output: { id: 'iron-helmet', name: 'Iron Helmet', icon: '⛑' },
  },
  {
    id: 'bread', name: 'Bread', category: 'food', difficulty: 'easy', xp: 20,
    shaped: true,
    pattern: [['wheat', 'wheat', 'wheat'], [null, null, null], [null, null, null]],
    output: { id: 'bread', name: 'Bread', icon: '🍞' },
  },
  {
    id: 'cake', name: 'Cake', category: 'food', difficulty: 'hard', xp: 55,
    shaped: true,
    pattern: [['sugar', 'egg', 'sugar'], ['wheat', 'wheat', 'wheat'], [null, null, null]],
    output: { id: 'cake', name: 'Cake', icon: '🍰' },
  },
  {
    id: 'book', name: 'Book', category: 'utility', difficulty: 'easy', xp: 20,
    shaped: true,
    pattern: [['paper', 'paper', 'paper'], ['paper', 'leather', 'paper'], [null, null, null]],
    output: { id: 'book', name: 'Book', icon: '📕' },
  },
];

export const GUIDES = [
  {
    id: 'g-farming', title: 'Wheat Farming Basics', category: 'farming',
    difficulty: 'Beginner', version: 'Java 1.20+',
    description: 'Plant seeds on hydrated farmland and harvest fully grown wheat.',
    steps: [
      'Craft a hoe and till grass or dirt next to water to make farmland.',
      'Plant wheat seeds on farmland.',
      'Water within 4 blocks hydrates the soil for faster growth.',
      'Harvest when fully golden — replant seeds to continue.',
    ],
    related: ['g-trading'], requiredItems: ['Hoe', 'Wheat Seeds', 'Water source'],
  },
  {
    id: 'g-trading', title: 'Villager Trading Essentials', category: 'trading',
    difficulty: 'Apprentice', version: 'Java 1.20+',
    description: 'Librarians offer enchanted books; farmers offer food. Protect your villagers.',
    steps: [
      'Find a village or cure a zombie villager.',
      'Place a lectern to make a Librarian.',
      'Break and replace the lectern to reroll trades (not on Bedrock).',
      'Trade emeralds for enchanted books.',
    ],
    related: ['g-farming'], requiredItems: ['Emeralds', 'Lectern'],
  },
  {
    id: 'g-nether', title: 'Entering the Nether Safely', category: 'nether',
    difficulty: 'Warrior', version: 'Java 1.20+',
    description: 'Build an obsidian portal (10 obsidian minimum) and light it with flint and steel.',
    steps: [
      'Mine at least 10 obsidian with a diamond pickaxe.',
      'Build a 4×5 frame with corners optional.',
      'Light the inside with flint and steel.',
      'Bring fire resistance potions and a bed only if careful — beds explode in the Nether.',
    ],
    related: ['g-stronghold'], requiredItems: ['10 Obsidian', 'Flint and Steel', 'Diamond Pickaxe'],
  },
  {
    id: 'g-stronghold', title: 'Finding the Stronghold', category: 'stronghold',
    difficulty: 'Warrior', version: 'Java 1.20+',
    description: 'Throw Eyes of Ender to locate the stronghold, then travel underground.',
    steps: [
      'Craft Eyes of Ender using Ender Pearls + Blaze Powder.',
      'Throw one and follow its direction.',
      'Repeat until the eye goes down into the ground.',
      'Dig down carefully, then explore for the End Portal room.',
    ],
    related: ['g-end'], requiredItems: ['Eyes of Ender', 'Pickaxe'],
  },
  {
    id: 'g-end', title: 'Preparing for the End', category: 'end',
    difficulty: 'Expert', version: 'Java 1.20+',
    description: 'Bring a bow, arrows, slow-falling potions, and blocks to survive the dragon fight.',
    steps: [
      'Activate the End Portal with 12 Eyes of Ender.',
      'Bring blocks to climb obsidian pillars.',
      'Destroy End Crystals with a bow first.',
      'Attack the dragon only when it dives toward the portal.',
    ],
    related: ['g-stronghold'], requiredItems: ['Bow', 'Arrows', 'Blocks', 'Slow Falling Potion'],
  },
  {
    id: 'g-redstone', title: 'Redstone Starter: Lever + Lamp', category: 'redstone',
    difficulty: 'Apprentice', version: 'Java 1.20+',
    description: 'Power a redstone lamp with a lever and a line of redstone dust.',
    steps: [
      'Place a redstone lamp.',
      'Place a lever two blocks away.',
      'Connect them with redstone dust.',
      'Flip the lever to power the lamp.',
    ],
    related: [], requiredItems: ['Redstone Lamp', 'Lever', 'Redstone Dust'],
  },
  {
    id: 'g-mobs', title: 'Hostile Mob Overview', category: 'mobs',
    difficulty: 'Beginner', version: 'Java 1.20+',
    description: 'Zombies, skeletons, creepers, and spiders are common hostile mobs at night.',
    steps: [
      'Light up your base with torches to prevent spawns.',
      'Build walls at least 2 blocks tall for zombies.',
      'Skeletons need cover — approach with a shield.',
      'Creepers: keep distance and use a bow or a shield.',
    ],
    related: [], requiredItems: ['Torches', 'Sword', 'Shield'],
  },
  {
    id: 'g-survival', title: 'First Night Survival', category: 'survival',
    difficulty: 'Beginner', version: 'Java 1.20+',
    description: 'Punch wood, craft tools, and build a shelter before nightfall.',
    steps: [
      'Punch trees for logs.',
      'Craft a crafting table and wooden pickaxe.',
      'Mine stone, craft stone tools.',
      'Build a small shelter and place torches.',
    ],
    related: ['g-mobs'], requiredItems: ['Wood', 'Stone', 'Torches'],
  },
  {
    id: 'g-structures', title: 'Common Overworld Structures', category: 'structures',
    difficulty: 'Apprentice', version: 'Java 1.20+',
    description: 'Villages, desert temples, shipwrecks, and ruined portals contain valuable loot.',
    steps: [
      'Explore surface for village or shipwreck.',
      'Watch for traps in desert temples (pressure plate under TNT).',
      'Loot chests in ruined portals.',
      'Mark locations with a map.',
    ],
    related: ['g-trading'], requiredItems: ['Map', 'Sword'],
  },
];

export const ACHIEVEMENTS = [
  { id: 'first-steps',    name: 'First Steps',           xp: 50,  desc: 'Complete your first lesson.',            icon: '⚑' },
  { id: 'first-craft',    name: 'First Craft',           xp: 75,  desc: 'Craft a valid recipe.',                   icon: '⛏' },
  { id: 'inv-ninja',      name: 'Inventory Ninja',       xp: 150, desc: 'Pass the inventory challenge.',           icon: '🎒' },
  { id: 'parkour-app',    name: 'Parkour Apprentice',    xp: 200, desc: 'Complete the parkour course.',            icon: '🏃' },
  { id: 'enchant-exp',    name: 'Enchantment Expert',    xp: 250, desc: 'Pass the enchanting quiz.',               icon: '✨' },
  { id: 'secret-hunter',  name: 'Secret Hunter',         xp: 300, desc: 'Read 3 guides in Secrets.',               icon: '🗝' },
  { id: 'survival-strat', name: 'Survival Strategist',   xp: 350, desc: 'Pass a Secrets quiz.',                    icon: '🧭' },
  { id: 'legend-trial',   name: 'Legend Trial Complete', xp: 500, desc: 'Reach Legend rank.',                      icon: '👑' },
];

export const DAILY_QUESTS = [
  { id: 'q1', label: 'Complete 1 lesson',      reward: 50 },
  { id: 'q2', label: 'Craft 3 recipes',        reward: 75 },
  { id: 'q3', label: 'Pass 1 quiz',            reward: 100 },
];

export const SAMPLE_LEADERBOARD = [
  { name: 'CraftQueen',    xp: 14200, weeklyXP: 620 },
  { name: 'BlockKnight',   xp: 11850, weeklyXP: 540 },
  { name: 'EnderPro',      xp: 9600, weeklyXP: 490 },
  { name: 'RedstoneRita',  xp: 8100, weeklyXP: 420 },
  { name: 'DiamondDoug',   xp: 6300, weeklyXP: 360 },
  { name: 'PixelPiper',    xp: 4900, weeklyXP: 310 },
  { name: 'NetherNate',    xp: 3400, weeklyXP: 250 },
  { name: 'ParkourPia',    xp: 2200, weeklyXP: 180 },
];