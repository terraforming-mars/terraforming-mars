import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Zeppelins extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ZEPPELINS,
      cost: 13,

      requirements: CardRequirements.builder((b) => b.oxygen(5)),
      metadata: {
        cardNumber: '129',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash();
            pb.city(CardRenderItemSize.SMALL).any.asterix();
          });
        }),
        description: 'Requires 5% oxygen. Increase your MC production 1 step for each City tile ON MARS.',
        victoryPoints: 1,
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, player.game.getCitiesInPlayOnMars());
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}

