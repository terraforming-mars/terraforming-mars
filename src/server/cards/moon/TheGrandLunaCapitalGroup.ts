import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../../common/TileType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Space} from '../../boards/Space';
import {SpaceId} from '../../../common/Types';
import {Resource} from '../../../common/Resource';
import {moonHabitatTile} from '../render/DynamicVictoryPoints';
import {Size} from '../../../common/cards/render/Size';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {all} from '../Options';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class TheGrandLunaCapitalGroup extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.THE_GRAND_LUNA_CAPITAL_GROUP,
      tags: [Tag.CITY, Tag.MOON],
      startingMegaCredits: 32,
      victoryPoints: 'special',

      behavior: {
        stock: {titanium: 1},
      },

      firstAction: {
        text: 'Place a habitat tile',
        moon: {habitatTile: {}},
      },

      metadata: {
        description: {
          text: 'You start with 32 M€ and 1 titanium. As your first action, place a habitat tile on The Moon and raise the habitat rate 1 step.',
          align: 'left',
        },
        cardNumber: 'MC7',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(32).titanium(1).moonHabitat({secondaryTag: AltSecondaryTag.MOON_HABITAT_RATE}).br;
          b.effect('When you place a habitat tile, gain 2 M€ for each adjacent habitat tile.', (eb) => {
            eb.moonHabitat({size: Size.SMALL, all}).moonHabitat({size: Size.SMALL}).asterix()
              .startEffect
              .megacredits(2).slash().moonHabitat({size: Size.SMALL, all});
          }).br,
          b.vpText('1 VP for each habitat tile adjacent to your habitat tiles.').br;
        }),
        victoryPoints: moonHabitatTile(1),
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
    if (cardOwner.id !== activePlayer.id) {
      return;
    }
    if (!MoonExpansion.spaceHasType(space, TileType.MOON_HABITAT)) {
      return;
    }
    const adjacentSpaces = MoonExpansion.moonData(cardOwner.game).moon.getAdjacentSpaces(space);
    const filtered = adjacentSpaces.filter((space) => MoonExpansion.spaceHasType(space, TileType.MOON_HABITAT));
    cardOwner.stock.add(Resource.MEGACREDITS, filtered.length * 2, {log: true});
  }

  public override getVictoryPoints(player: IPlayer) {
    const moon = MoonExpansion.moonData(player.game).moon;
    const neighboringColonyTiles: Set<SpaceId> = new Set();
    const colonyTiles = MoonExpansion.spaces(player.game, TileType.MOON_HABITAT, {ownedBy: player});
    colonyTiles.forEach((tile) =>
      moon.getAdjacentSpaces(tile).forEach((neighbor) => {
        if (MoonExpansion.spaceHasType(neighbor, TileType.MOON_HABITAT)) {
          neighboringColonyTiles.add(neighbor.id);
        }
      }),
    );

    return neighboringColonyTiles.size;
  }
}
