import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';

export class Advertising extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ADVERTISING,
      tags: [Tags.EARTH],
      cost: 4,

      metadata: {
        cardNumber: 'X13',
        renderData: CardRenderer.builder((b) => b.effect('When you play a card with a basic cost of 20 M€ or more, increase your M€ production 1 step.', (be) => {
          be.megacredits(20).asterix().startEffect.production((pb) => pb.megacredits(1));
        })),
      },
    });
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.cost >= 20) {
      player.addProduction(Resources.MEGACREDITS, 1);
    }
  }

  public play() {
    return undefined;
  }
}
