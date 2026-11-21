import {ColonyName} from '@/common/colonies/ColonyName';
import {Tag} from '@/common/cards/Tag';
import type {IMarsBot} from '@/server/automa/IMarsBot';

/**
 * The tag of the MarsBot track that each colony tile's storage area advances when it fills (C-12).
 *
 * The tags are the ones printed on each storage area of the Shipping Board. The track a tag
 * advances depends on the board (on Vastitas Borealis, microbes advance the Science track).
 * Titan has no entry, its floaters never advance a track (C-23), and neither has Europa, which has
 * no storage area (C-24d).
 */
export const COLONY_STORAGE_TAG: Partial<Record<ColonyName, Tag>> = {
  [ColonyName.CERES]: Tag.BUILDING,   // Steel
  [ColonyName.LUNA]: Tag.EVENT,       // Megacredits
  [ColonyName.IO]: Tag.EARTH,         // Heat
  [ColonyName.ENCELADUS]: Tag.MICROBE,
  [ColonyName.GANYMEDE]: Tag.PLANT,
  [ColonyName.CALLISTO]: Tag.POWER,   // Energy
  [ColonyName.MIRANDA]: Tag.ANIMAL,
  [ColonyName.TRITON]: Tag.SPACE,     // Titanium
  [ColonyName.PLUTO]: Tag.SCIENCE,    // Cards (C-26)
};

/**
 * MarsBot's Shipping Board, with a storage area for each colony tile (C-18).
 *
 * A storage area that reaches 5 resources gives back 5 and advances its track (C-12).
 */
export class MarsBotShippingBoard {
  public storage: Map<ColonyName, number> = new Map();

  constructor(private readonly marsBot: IMarsBot) {}

  /**
   * Adds `amount` resources to a colony tile's storage area, then advances its track once for every
   * 5 there (C-12).
   *
   * Europa's resources are dropped (C-24d). Titan keeps any number, and advances no track (C-23).
   */
  public add(colonyName: ColonyName, amount: number): void {
    if (colonyName === ColonyName.EUROPA) {
      return;
    }

    const current = this.storage.get(colonyName) ?? 0;
    this.storage.set(colonyName, current + amount);

    if (colonyName === ColonyName.TITAN) {
      return;
    }

    this.checkOverflow(colonyName);
  }

  /** Trades each 5 resources in a storage area for a track advance (C-12), until the game is decided. */
  private checkOverflow(colonyName: ColonyName): void {
    const tag = COLONY_STORAGE_TAG[colonyName];
    if (tag === undefined || this.marsBot.game.isDoneWithFinalProduction()) {
      return;
    }

    while ((this.storage.get(colonyName) ?? 0) >= 5) {
      const current = this.storage.get(colonyName) ?? 0;
      this.storage.set(colonyName, current - 5);
      // Not "resolving a tag" for MarsBot's corp (BGG thread 3535330), but a microbe advance
      // still resolves the player's Pharmacy Union or Splice (rulebook B, p.4 FAQ)
      this.marsBot.advanceTrackOfTag(tag);
    }
  }

  /** The resources in a colony tile's storage area. */
  public get(colonyName: ColonyName): number {
    return this.storage.get(colonyName) ?? 0;
  }
}
