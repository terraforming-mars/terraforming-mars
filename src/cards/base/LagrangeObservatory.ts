import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class LagrangeObservatory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LAGRANGE_OBSERVATORY,
      tags: [Tags.SCIENCE, Tags.SPACE],
      cost: 9,

      metadata: {
        cardNumber: '196',
        renderData: CardRenderer.builder((b) => b.cards(1)),
        description: 'Draw 1 card.',
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player, game: Game) {
    return player.drawCard(game);
  }
  public getVictoryPoints() {
    return 1;
  }
}
