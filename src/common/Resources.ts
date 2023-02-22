export enum Resources {
    MEGACREDITS = 'megacredits',
    STEEL = 'steel',
    TITANIUM = 'titanium',
    PLANTS = 'plants',
    ENERGY = 'energy',
    HEAT = 'heat'
}

export const ALL_RESOURCES = [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT] as const;
