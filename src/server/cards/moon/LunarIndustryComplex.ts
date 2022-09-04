import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Card} from '../Card';
import {TileType} from '../../../common/TileType';

export class LunarIndustryComplex extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_INDUSTRY_COMPLEX,
      cardType: CardType.AUTOMATED,
      tags: [Tag.ENERGY, Tag.BUILDING],
      cost: 28,
      productionBox: {steel: 1, titanium: 1, energy: 2, heat: 1},
      reserveUnits: {titanium: 2},
      tr: {moonMining: 1},

      metadata: {
        description: 'Spend 2 Titanium. Place a mine tile on the Moon and raise the Mining Rate 1 step. ' +
          'Increase your Steel, Titanium, and Heat production 1 step each. Increase your Energy production 2 steps.',
        cardNumber: 'M74',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).moonMine().br;
          b.production((pb) => pb.steel(1).titanium(1).heat(1).energy(2));
        }),
      },
      tilesBuilt: [TileType.MOON_MINE],
    });
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceMoonMineTile(player));
    return undefined;
  }
}
