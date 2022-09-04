import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class BlackPolarDust extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BLACK_POLAR_DUST,
      cost: 15,
      tr: {oceans: 1},
      productionBox: {megacredits: -2, heat: 3},

      metadata: {
        cardNumber: '022',
        description: 'Place an ocean tile. Decrease your M€ production 2 steps and increase your heat production 3 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(2).br;
            pb.plus().heat(3);
          }).oceans(1);
        }),
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceOceanTile(player));
    return undefined;
  }
}
