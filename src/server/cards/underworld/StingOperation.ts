import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {any} from '../render/DynamicVictoryPoints';

export class StingOperation extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.STING_OPERATION,
      tags: [Tag.EARTH],
      cost: 14,
      victoryPoints: 'special',

      behavior: {
        drawCard: 2,
      },

      metadata: {
        cardNumber: 'U094',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
          b.text('Target a player that has at least 4 corruption. Draw 2 cards.');
          b.br;
          b.text('Place this card face-down in that player\'s project card file.');
        }),
        victoryPoints: any(-2),
      },
    });
  }

  private targets(player: IPlayer) {
    return player.game.players.filter((player) => player.underworldData.corruption >= 4);
  }

  public override bespokeCanPlay(player: IPlayer) {
    const targets = this.targets(player);
    if (targets.length === 1 && targets[0] === player) {
      this.warnings.add('selfTarget');
    }
    return targets.length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectPlayer(this.targets(player), 'Select player to face a sting operation.')
      .andThen((target) => {
        if (target !== player) {
          player.playedCards.remove(this);
          target.playedCards.push(this);
        }
        return undefined;
      });
  }

  public override getVictoryPoints() {
    return -2;
  }
}

