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

export class SinusIridiumRoadNetwork extends MoonCard {
  constructor() {
    super({
      name: CardName.SINUS_IRIDIUM_ROAD_NETWORK,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON],
      cost: 15,
      productionBox: Units.of({energy: -1, megacredits: 3}),
      reserveUnits: Units.of({steel: 1}),
      tr: {moonLogistics: 1},

      metadata: {
        description: 'Decrease your energy production 1 step and increase your M€ production 3 steps. ' +
          'Spend 1 steel. ' +
          'Place a road tile on the Moon and raise the Logistics Rate 1 step.',
        cardNumber: 'M11',
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(1).br;
          b.production((pb) => {
            pb.minus().energy(1).nbsp.megacredits(3);
          }).br;
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
