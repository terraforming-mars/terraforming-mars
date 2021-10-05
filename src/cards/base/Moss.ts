import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Moss extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MOSS,
      tags: [Tags.PLANT],
      cost: 4,

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

  public canPlay(player: Player): boolean {
    const hasViralEnhancers = player.playedCards.find((card) => card.name === CardName.VIRAL_ENHANCERS);
    const hasEnoughPlants = player.plants >= 1 || hasViralEnhancers !== undefined || player.isCorporation(CardName.MANUTECH);

    return hasEnoughPlants;
  }
  public play(player: Player) {
    player.plants--;
    player.addProduction(Resources.PLANTS, 1);
    return undefined;
  }
}

