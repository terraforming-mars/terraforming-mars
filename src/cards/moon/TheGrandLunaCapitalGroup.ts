import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../TileType';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {ISpace, SpaceId} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Size} from '../render/Size';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {Card} from '../Card';

export class TheGrandLunaCapitalGroup extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.THE_GRAND_LUNA_CAPITAL_GROUP,
      tags: [Tags.CITY, Tags.MOON],
      startingMegaCredits: 32,
      initialActionText: 'Place a colony tile',

      metadata: {
        description: {
          text: 'You start with 32 M€ and 1 titanium. As your first action, place a colony tile on the Moon and raise the Colony Rate 1 step.',
          align: 'left',
        },
        cardNumber: 'MC7',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(32).titanium(1).moonColony().secondaryTag(AltSecondaryTag.MOON_COLONY_RATE).br;
          b.effect('When you place a colony tile, gain 2 M€ for each adjacent colony tile.', (eb) => {
            eb.moonColony({size: Size.SMALL}).any.moonColony({size: Size.SMALL}).asterix()
              .startEffect
              .megacredits(2).slash().moonColony({size: Size.SMALL}).any;
          }).br,
          b.vpText('1 VP for each colony tile adjacent to your colony tiles.').br;
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.moonColonyTile(1),
      },
    });
  }

  public play(player: Player) {
    player.titanium++;
    return undefined;
  }

  public initialAction(player: Player) {
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (cardOwner.id !== activePlayer.id) {
      return;
    }
    if (!MoonExpansion.spaceHasType(space, TileType.MOON_COLONY)) {
      return;
    }
    const adjacentSpaces = MoonExpansion.moonData(cardOwner.game).moon.getAdjacentSpaces(space);
    const filtered = adjacentSpaces.filter((space) => MoonExpansion.spaceHasType(space, TileType.MOON_COLONY));
    cardOwner.addResource(Resources.MEGACREDITS, filtered.length * 2, {log: true});
  }

  public getVictoryPoints(player: Player) {
    const moon = MoonExpansion.moonData(player.game).moon;
    const neighboringColonyTiles: Set<SpaceId> = new Set();
    const colonyTiles = MoonExpansion.tiles(player.game, TileType.MOON_COLONY, {ownedBy: player});
    colonyTiles.forEach((tile) =>
      moon.getAdjacentSpaces(tile).forEach((neighbor) => {
        if (MoonExpansion.spaceHasType(neighbor, TileType.MOON_COLONY)) {
          neighboringColonyTiles.add(neighbor.id);
        }
      }),
    );

    return neighboringColonyTiles.size;
  }
}
