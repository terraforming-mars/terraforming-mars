export enum Resource {
    MEGACREDITS = 'megacredits',
    STEEL = 'steel',
    TITANIUM = 'titanium',
    PLANTS = 'plants',
    ENERGY = 'energy',
    HEAT = 'heat'
}

export const ALL_RESOURCES = [Resource.MEGACREDITS, Resource.STEEL, Resource.TITANIUM, Resource.PLANTS, Resource.ENERGY, Resource.HEAT] as const;
