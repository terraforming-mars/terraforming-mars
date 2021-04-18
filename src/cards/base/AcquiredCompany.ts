import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AcquiredCompany extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ACQUIRED_COMPANY,
      tags: [Tags.EARTH],
      cost: 10,

      metadata: {
        description: 'Increase your M€ production 3 steps.',
        cardNumber: '106',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.megacredits(3))),
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 3);
    return undefined;
  }
}
