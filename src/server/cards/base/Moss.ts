import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Moss extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MOSS,
      tags: [Tag.PLANT],
      cost: 4,

      behavior: {
        production: {plants: 1},
      },

      requirements: CardRequirements.builder((b) => b.oceans(3)),
      metadata: {
        cardNumber: '122',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).nbsp.minus().plants(1);
        }),
        description: 'Requires 3 ocean tiles and that you lose 1 plant. Increase your plant production 1 step.',
      },
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    const hasViralEnhancers = player.playedCards.find((card) => card.name === CardName.VIRAL_ENHANCERS);
    const hasEnoughPlants = player.plants >= 1 || hasViralEnhancers !== undefined || player.isCorporation(CardName.MANUTECH);

    return hasEnoughPlants;
  }
  public override bespokePlay(player: Player) {
    player.plants--;
    return undefined;
  }
}

