import { SpaceBonus } from "../SpaceBonus";

export class AdjacencyBonus {
  units: number;
  spaceBonus?: SpaceBonus;
  aresSpaceBonus?: AresSpaceBonus;

  constructor (units: number, spaceBonus?: SpaceBonus, aresSpaceBonus?: AresSpaceBonus) {
    this.units = units;
    this.spaceBonus = spaceBonus;
    this.aresSpaceBonus = aresSpaceBonus;
  }
  static ofSpaceBonus(units: number, spaceBonus: SpaceBonus) {
    return new AdjacencyBonus(units, spaceBonus, undefined);
  }

  static ofAresSpaceBonus(units: number, aresSpaceBonus: AresSpaceBonus) {
    return new AdjacencyBonus(units, undefined, aresSpaceBonus);
  }
}

export enum AresSpaceBonus {
  MC,
  ANIMAL,
}