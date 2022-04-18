import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {CardResource} from '../../common/CardResource';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class FloaterLeasing extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 3,
      name: CardName.FLOATER_LEASING,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C10',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().floaters(3, {digit});
        }),
        description: 'Increase your M€ production 1 step PER 3 floaters you have.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, Math.floor(player.getResourceCount(CardResource.FLOATER) / 3), {log: true});
    return undefined;
  }
}

