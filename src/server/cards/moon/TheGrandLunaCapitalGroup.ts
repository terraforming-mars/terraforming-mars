import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../../common/TileType';
import {PlaceMoonHabitatTile} from '../../moon/PlaceMoonHabitatTile';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {ISpace} from '../../boards/ISpace';
import {SpaceId} from '../../../common/Types';
import {Resources} from '../../../common/Resources';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Size} from '../../../common/cards/render/Size';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Card} from '../Card';
import {all} from '../Options';

export class TheGrandLunaCapitalGroup extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.THE_GRAND_LUNA_CAPITAL_GROUP,
      tags: [Tag.CITY, Tag.MOON],
      startingMegaCredits: 32,
      initialActionText: 'Place a colony tile',
      victoryPoints: 'special',

      behavior: {
        stock: {titanium: 1},
      },

      metadata: {
        description: {
          text: 'You start with 32 M€ and 1 titanium. As your first action, place a habitat tile on The Moon and raise the Habitat Rate 1 step.',
          align: 'left',
        },
        cardNumber: 'MC7',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(32).titanium(1).moonHabitat({secondaryTag: AltSecondaryTag.MOON_HABITAT_RATE}).br;
          b.effect('When you place a colony tile, gain 2 M€ for each adjacent colony tile.', (eb) => {
            eb.moonHabitat({size: Size.SMALL, all}).moonHabitat({size: Size.SMALL}).asterix()
              .startEffect
              .megacredits(2).slash().moonHabitat({size: Size.SMALL, all});
          }).br,
          b.vpText('1 VP for each habitat tile adjacent to your habitat tiles.').br;
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.moonHabitatTile(1),
      },
    });
  }

  public initialAction(player: Player) {
    player.game.defer(new PlaceMoonHabitatTile(player));
    return undefined;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (cardOwner.id !== activePlayer.id) {
      return;
    }
    if (!MoonExpansion.spaceHasType(space, TileType.MOON_HABITAT)) {
      return;
    }
    const adjacentSpaces = MoonExpansion.moonData(cardOwner.game).moon.getAdjacentSpaces(space);
    const filtered = adjacentSpaces.filter((space) => MoonExpansion.spaceHasType(space, TileType.MOON_HABITAT));
    cardOwner.addResource(Resources.MEGACREDITS, filtered.length * 2, {log: true});
  }

  public override getVictoryPoints(player: Player) {
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
