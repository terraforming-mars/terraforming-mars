import {CardName} from '../../common/cards/CardName';

export class MoonCards {
  public static scienceCardsWithLessThan2VP: Set<CardName> = new Set([
    CardName.OLYMPUS_CONFERENCE,
    CardName.COPERNICUS_TOWER,
    CardName.LUNA_ARCHIVES,
    CardName.PRIDE_OF_THE_EARTH_ARKSHIP,
    CardName.NANOTECH_INDUSTRIES,
  ]);
  otherScienceCards: Set<CardName> = new Set([
    CardName.PHYSICS_COMPLEX,
    CardName.SEARCH_FOR_LIFE,
  ]);
}
