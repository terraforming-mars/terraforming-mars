import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {Card} from '../Card';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Potatoes extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.POTATOES,
      tags: [Tags.PLANT],
      cost: 2,

      metadata: {
        cardNumber: 'X28',
        renderData: CardRenderer.builder((b) => {
          b.minus().plants(2).nbsp.production((pb) => pb.megacredits(2));
        }),
        description: 'Lose 2 plants. Increase your M€ production 2 steps.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const viralEnhancers = player.playedCards.find((card) => card.name === CardName.VIRAL_ENHANCERS);
    const hasEnoughPlants = player.plants >= 2 || player.plants >= 1 && viralEnhancers !== undefined;

    return hasEnoughPlants;
  }

  public play(player: Player) {
    player.plants -= 2;
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
}
