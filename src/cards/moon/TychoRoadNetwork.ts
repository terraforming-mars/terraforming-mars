import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {TileType} from '../../TileType';
import {MoonCard} from './MoonCard';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class TychoRoadNetwork extends MoonCard {
  constructor() {
    super({
      name: CardName.TYCHO_ROAD_NETWORK,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON],
      cost: 15,
      productionBox: Units.of({megacredits: 1}),
      reserveUnits: Units.of({steel: 1}),
      tr: {moonLogistics: 1},

      metadata: {
        description: 'Spend 1 steel. Increase your M€ production 1 step. ' +
        'Place a road tile on the Moon and raise the Logistics Rate 1 step.',
        cardNumber: 'M09',
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(1).br;
          b.production((eb) => eb.megacredits(1)).br;
          b.moonRoad({secondaryTag: AltSecondaryTag.MOON_LOGISTICS_RATE});
        }),
      },
    }, {
      tilesBuilt: [TileType.MOON_ROAD],
    });
  }

  public override play(player: Player) {
    super.play(player);
    player.game.defer(new PlaceMoonRoadTile(player));
    return undefined;
  }
}
