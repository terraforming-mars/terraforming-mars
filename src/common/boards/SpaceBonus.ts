// There might be a temptation to rename or reorder these, but SpaceBonus is stored in the database
// as its number. Would have been better if this was stored as a string, but that ship has sailed,
// for now.

export enum SpaceBonus {
    TITANIUM, // 0
    STEEL, // 1
    PLANT, // 2
    DRAW_CARD, // 3
    HEAT, // 4
    OCEAN, // 5

    // Ares-specific
    MEGACREDITS, // 6
    ANIMAL, // 7
    MICROBE, // 8 (Also used in Arabia Terra)
    ENERGY, // 9

    // Arabia Terra-specific
    DATA, // 10
    SCIENCE, // 11
    ENERGY_PRODUCTION, // 12

    // Vastitas Borealis-specific
    TEMPERATURE, // 13
}

const TO_STRING_MAP: Map<SpaceBonus, string> = new Map([
  [SpaceBonus.TITANIUM, 'Titanium'],
  [SpaceBonus.STEEL, 'Steel'],
  [SpaceBonus.PLANT, 'Plant'],
  [SpaceBonus.DRAW_CARD, 'Card'],
  [SpaceBonus.HEAT, 'Heat'],
  [SpaceBonus.OCEAN, 'Ocean'],
  [SpaceBonus.MEGACREDITS, 'M€'],
  [SpaceBonus.ANIMAL, 'Animal'],
  [SpaceBonus.MICROBE, 'Microbe'],
  [SpaceBonus.ENERGY, 'Energy'],
  [SpaceBonus.DATA, 'Data'],
  [SpaceBonus.SCIENCE, 'Science'],
  [SpaceBonus.ENERGY_PRODUCTION, 'Energy Production'],
  [SpaceBonus.TEMPERATURE, 'Temperature'],
]);

export namespace SpaceBonus {
  export function toString(spaceBonus: SpaceBonus): string {
    return TO_STRING_MAP.get(spaceBonus) || `(unnamed space bonus, id ${spaceBonus})`;
  }
}
