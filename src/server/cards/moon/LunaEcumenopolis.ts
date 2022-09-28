import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Card} from '../Card';
import {TileType} from '../../../common/TileType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonHabitatTile} from '../../moon/PlaceMoonHabitatTile';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {ISpace} from '../../boards/ISpace';
import {IMoonData} from '../../moon/IMoonData';

export class LunaEcumenopolis extends Card {
  constructor() {
    super({
      name: CardName.LUNA_ECUMENOPOLIS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.CITY, Tag.CITY, Tag.MOON],
      cost: 35,
      reserveUnits: {titanium: 2},

      metadata: {
        description: 'Spend 2 Titanium. ' +
        'Place 2 habitat tiles adjacent to at least 2 other habitat tiles and raise Habitat Rate 2 steps. ' +
        'Increase your TR 1 step for each 2 steps of the Habitat Rate.',
        cardNumber: 'M84',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).nbsp;
          b.text('2').moonHabitat({secondaryTag: AltSecondaryTag.MOON_HABITAT_RATE}).asterix().br;
          b.tr(1).slash().moonHabitatRate().moonHabitatRate();
        }),
      },
      tilesBuilt: [TileType.MOON_HABITAT],
    });
  }

  private canAffordTRBump(player: Player) {
    // Note for someone paying close attention:
    //
    // In the real world, this card can be resolved in one of two orders:
    // 1. Raise the TR rate before raising the colony rate
    // 2. Raise the colony rate before the TR rate.
    // In the first case, the player will get fewer TR, but also is more likely to afford the costs.
    // In the second case, the player will get the most TR, but will have to pay up to 3 more MC, the cost
    // of that additional TR bump.
    //
    // This algorithm assumes the second case.
    //
    // If someone wants to optimize for this, they can change this algorithm to use the current colony rate instead
    // of the expected colony rate, but then they must also change the order in which the player gains those bonuses
    // in play().
    //
    const moonData = MoonExpansion.moonData(player.game);
    const expectedColonyRate = Math.min(moonData.colonyRate + 2, 8);
    const expectedTRBump = Math.floor(expectedColonyRate / 2);
    return player.canAfford(0, {tr: {moonHabitat: 2, tr: expectedTRBump}});
  }

  public override bespokeCanPlay(player: Player) {
    if (!this.canAffordTRBump(player)) {
      return false;
    }

    const moonData = MoonExpansion.moonData(player.game);
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    const len = spaces.length;

    let firstSpaceId = '';

    // This function returns true when this space is next to two colonies. Don't try to understand firstSpaceId yet.
    const nextToTwoColonies = function(space: ISpace): boolean {
      const adjacentSpaces = moonData.moon.getAdjacentSpaces(space).filter((adjacentSpace) => {
        return MoonExpansion.spaceHasType(adjacentSpace, TileType.MOON_HABITAT) || adjacentSpace.id === firstSpaceId;
      });
      return adjacentSpaces.length >= 2;
    };

    // Go through every available land space.
    for (let x = 0; x < len; x++) {
      const first = spaces[x];
      // If it's next to two colonies
      if (nextToTwoColonies(first) === true) {
        // Remember it.
        firstSpaceId = first.id;
        // Now go through all the land spaces again
        for (let y = 0; y < len; y++) {
          const second = spaces[y];
          if (second.id === firstSpaceId) continue;
          // Now if it's next to two colonies, it includes the first colony you placed. That's what firstSpaceId is for.
          if (nextToTwoColonies(second) === true) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public override bespokePlay(player: Player) {
    // These all have the same priority: Default.
    player.game.defer(new CustomPlaceMoonTile(player));
    player.game.defer(new CustomPlaceMoonTile(player));
    player.game.defer(new SimpleDeferredAction(player, () => {
      const colonyRate = MoonExpansion.moonData(player.game).colonyRate;
      player.increaseTerraformRatingSteps(Math.floor(colonyRate / 2));
      return undefined;
    }));
    return undefined;
  }
}

class CustomPlaceMoonTile extends PlaceMoonHabitatTile {
  protected override getSpaces(moonData: IMoonData) {
    const spaces = moonData.moon.getAvailableSpacesOnLand(this.player);
    const filtered = spaces.filter((space) => {
      const adjacentSpaces = moonData.moon.getAdjacentSpaces(space).filter((adjacentSpace) => {
        return MoonExpansion.spaceHasType(adjacentSpace, TileType.MOON_HABITAT);
      });
      return adjacentSpaces.length >= 2;
    });
    return filtered;
  }
}
