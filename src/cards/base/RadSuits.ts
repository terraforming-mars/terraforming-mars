import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
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

      metadata: {
        cardNumber: '186',
        requirements: CardRequirements.builder((b) => b.cities(2).any()),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Requires two cities in play. Increase your MC up 1 step.',
        victoryPoints: 1,
      },
    });
  }
  public canPlay(_player: Player, game: Game): boolean {
    return game.getCitiesInPlay() >= 2;
  }
  public play(player: Player, game: Game) {
    if (game.getCitiesInPlay() < 2) {
      throw 'Must have 2 cities in play';
    }
    player.addProduction(Resources.MEGACREDITS);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
