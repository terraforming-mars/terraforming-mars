import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../../common/TileType';
import {Card} from '../Card';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class SinusIridiumRoadNetwork extends Card {
  constructor() {
    super({
      name: CardName.SINUS_IRIDIUM_ROAD_NETWORK,
      cardType: CardType.AUTOMATED,
      tags: [Tag.MOON],
      cost: 15,
      productionBox: {energy: -1, megacredits: 3},
      reserveUnits: {steel: 1},
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
      tilesBuilt: [TileType.MOON_ROAD],
    });
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceMoonRoadTile(player));
    return undefined;
  }
}
