// Base constants
export const CARD_COST = 3;
export const MILESTONE_COST = 8;
export const MAX_MILESTONES = 3;
export const AWARD_COSTS = [8, 14, 20];
export const MAX_AWARDS = 3;
export const DEFAULT_STEEL_VALUE = 2;
export const DEFAULT_TITANIUM_VALUE = 3;
export const FLOATERS_VALUE = 3;
export const MICROBES_VALUE = 2;
export const OCEAN_BONUS = 2;

// Global parameters
export const HEAT_FOR_TEMPERATURE = 8;
export const MAX_OCEAN_TILES = 9;
export const MAX_TEMPERATURE = 8;
export const MAX_OXYGEN_LEVEL = 14;
export const MIN_TEMPERATURE = -30;
export const MIN_OXYGEN_LEVEL = 0;
export const MIN_VENUS_SCALE = 0;
export const MAX_VENUS_SCALE = 30;

// Colonies
export const MAX_COLONY_TRACK_POSITION = 6;
export const MAX_COLONIES_PER_TILE = 3;
export const MAX_FLEET_SIZE = 4;
export const MC_TRADE_COST = 9;
export const ENERGY_TRADE_COST = 3;
export const TITANIUM_TRADE_COST = 3;

// Turmoil
export const DELEGATES_PER_PLAYER = 7;
export const DELEGATES_FOR_NEUTRAL_PLAYER = 14;
export const REDS_RULING_POLICY_COST = 3;
export const POLITICAL_AGENDAS_MAX_ACTION_USES = 3;

// Promo

export const GRAPHENE_VALUE = 4;

// Map specific
export const HELLAS_BONUS_OCEAN_COST = 6;
export const VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST = 3;

// Moon
export const MAXIMUM_HABITAT_RATE = 8;
export const MAXIMUM_MINING_RATE = 8;
export const MAXIMUM_LOGISTICS_RATE = 8;

// Pathfinders
export const SEED_VALUE = 5;
export const DATA_VALUE = 3;

// Escape Velocity
export const DEFAULT_ESCAPE_VELOCITY_THRESHOLD = 30;
export const DEFAULT_ESCAPE_VELOCITY_BONUS_SECONDS = 2;
export const DEFAULT_ESCAPE_VELOCITY_PERIOD = 2;
export const DEFAULT_ESCAPE_VELOCITY_PENALTY = 1;

// Leaders/CEOs
export const ASIMOV_AWARD_BONUS = 2;

export const ALL_LANGUAGES = ['en', 'de', 'fr', 'ru', 'cn', 'pl', 'es', 'br', 'it', 'ko', 'nl', 'hu'] as const;

export const LANGUAGES: Record<typeof ALL_LANGUAGES[number], string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  ru: 'Русский',
  cn: '华语',
  pl: 'Polski',
  es: 'Español',
  br: 'Português Brasileiro',
  it: 'Italiano',
  ko: '한국어',
  nl: 'Nederlands',
  hu: 'Magyar',
};

export const APP_NAME = 'Terraforming Mars';
export const DISCORD_INVITE = 'https://discord.gg/afeyggbN6Y';
export const PRELUDE_CARDS_DEALT_PER_PLAYER = 4;
