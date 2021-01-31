import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class FloaterLeasing extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 3,
      name: CardName.FLOATER_LEASING,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C10',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().floaters(3).digit;
        }),
        description: 'Increase your MC production 1 step PER 3 floaters you have.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, Math.floor(player.getResourceCount(ResourceType.FLOATER) / 3));
    return undefined;
  }
}

