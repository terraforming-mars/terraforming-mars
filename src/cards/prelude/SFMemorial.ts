import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {DrawCards} from '../../deferredActions/DrawCards';
import {CardRenderer} from '../render/CardRenderer';

export class SFMemorial extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SF_MEMORIAL,
      tags: [Tags.BUILDING],
      cost: 7,

      metadata: {
        cardNumber: 'P41',
        renderData: CardRenderer.builder((b) => b.cards(1)),
        description: 'Draw 1 card.',
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player, game: Game) {
    game.defer(new DrawCards(player, game, 1));
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
