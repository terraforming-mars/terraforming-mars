import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class RadSuits extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RAD_SUITS,
      cost: 6,

      requirements: CardRequirements.builder((b) => b.cities(2).any()),
      metadata: {
        cardNumber: '186',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Requires two cities in play. Increase your M€ production 1 step.',
        victoryPoints: 1,
      },
    });
  }
  public play(player: Player) {
    if (player.game.getCitiesInPlay() < 2) {
      throw 'Must have 2 cities in play';
    }
    player.addProduction(Resources.MEGACREDITS, 1);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
