import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Potatoes extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.POTATOES,
      tags: [Tag.PLANT],
      cost: 2,

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: 'X28',
        renderData: CardRenderer.builder((b) => {
          b.minus().plants(2).nbsp.production((pb) => pb.megacredits(2));
        }),
        description: 'Lose 2 plants. Increase your M€ production 2 steps.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    const viralEnhancers = player.getPlayedCard(CardName.VIRAL_ENHANCERS);
    const hasEnoughPlants = player.plants >= 2 || player.plants >= 1 && viralEnhancers !== undefined;

    return hasEnoughPlants;
  }

  public override bespokePlay(player: IPlayer) {
    player.plants -= 2;
    return undefined;
  }
}
