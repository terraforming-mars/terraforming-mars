import {CardName} from '../../common/cards/CardName';

export class MoonCards {
  public static scienceCardsWithLessThan2VP: ReadonlySet<CardName> = new Set([
    CardName.OLYMPUS_CONFERENCE,
    CardName.COPERNICUS_TOWER,
    CardName.LUNA_ARCHIVES,
    CardName.PRIDE_OF_THE_EARTH_ARKSHIP,
    CardName.NANOTECH_INDUSTRIES,
    CardName.APPLIED_SCIENCE,
    CardName.SPIRE,
  ]);
}
