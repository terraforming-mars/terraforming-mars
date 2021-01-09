import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class Moss extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MOSS,
      tags: [Tags.PLANT],
      cost: 4,

      metadata: {
        cardNumber: '122',
        requirements: CardRequirements.builder((b) => b.oceans(3)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).nbsp.minus().plants(1);
        }),
        description: 'Requires 3 ocean tiles and that you lose 1 plant. Increase your plant production 1 step.',
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    const meetsOceanRequirements = game.checkMinRequirements(player, GlobalParameter.OCEANS, 3);
    const hasViralEnhancers = player.playedCards.find((card) => card.name === CardName.VIRAL_ENHANCERS);
    const hasEnoughPlants = player.plants >= 1 || hasViralEnhancers !== undefined || player.isCorporation(CardName.MANUTECH);

    return meetsOceanRequirements && hasEnoughPlants;
  }
  public play(player: Player) {
    player.plants--;
    player.addProduction(Resources.PLANTS);
    return undefined;
  }
}

