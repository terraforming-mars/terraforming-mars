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

export class NitrophilicMoss extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.NITROPHILIC_MOSS,
      tags: [Tags.PLANT],
      cost: 8,

      metadata: {
        cardNumber: '146',
        requirements: CardRequirements.builder((b) => b.oceans(3)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.plants(2);
          }).nbsp.minus().plants(2);
        }),
        description: 'Requires 3 ocean tiles and that you lose 2 plants. Increase your plant production 2 steps.',
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    const meetsOceanRequirements = game.checkMinRequirements(player, GlobalParameter.OCEANS, 3);
    const hasViralEnhancers = player.playedCards.find((card) => card.name === CardName.VIRAL_ENHANCERS);
    const hasEnoughPlants = player.plants >= 2 || player.isCorporation(CardName.MANUTECH) || player.plants >= 1 && hasViralEnhancers !== undefined;

    return meetsOceanRequirements && hasEnoughPlants;
  }
  public play(player: Player) {
    player.plants -= 2;
    player.addProduction(Resources.PLANTS, 2);
    return undefined;
  }
}
