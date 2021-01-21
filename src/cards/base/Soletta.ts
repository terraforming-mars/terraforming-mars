import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Soletta extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SOLETTA,
      tags: [Tags.SPACE],
      cost: 35,

      metadata: {
        cardNumber: '203',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(7));
        }),
        description: 'Increase your heat production 7 steps.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.HEAT, 7);
    return undefined;
  }
}
