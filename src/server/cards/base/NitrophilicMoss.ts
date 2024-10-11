import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class NitrophilicMoss extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.NITROPHILIC_MOSS,
      tags: [Tag.PLANT],
      cost: 8,

      behavior: {
        production: {plants: 2},
      },

      requirements: {oceans: 3},
      metadata: {
        cardNumber: '146',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.plants(2);
          }).nbsp.minus().plants(2);
        }),
        description: 'Requires 3 ocean tiles and that you lose 2 plants. Increase your plant production 2 steps.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    const viralEnhancers = player.getPlayedCard(CardName.VIRAL_ENHANCERS);
    const hasEnoughPlants = player.plants >= 2 || player.isCorporation(CardName.MANUTECH) || player.plants >= 1 && viralEnhancers !== undefined;

    return hasEnoughPlants;
  }
  public override bespokePlay(player: IPlayer) {
    player.plants -= 2;
    return undefined;
  }
}
