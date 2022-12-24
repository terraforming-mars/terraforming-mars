
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SelectCard} from '../../inputs/SelectCard';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {LogHelper} from '../../LogHelper';
import {LeaderDeck} from '../Deck';
import {ILeaderCard} from './ILeaderCard';

export class JointVenture extends PreludeCard {
  constructor() {
    super({
      name: CardName.JOINT_VENTURE,

      metadata: {
        cardNumber: 'LP01',
        renderData: CardRenderer.builder((b) => {
          b.text('CEO').asterix();
        }),
        description: 'Draw 3 CEO cards. Choose one and discard the others. The chosen CEO will be played in addition to your existing CEO.',
        victoryPoints: -1,
      },
    });
  }


  public override bespokePlay(player: Player) {
    const game = player.game;
    const dealtLeaders = JointVenture.dealLeaders(player, game.leaderDeck);

    game.defer(new SimpleDeferredAction(player, () => {
      return new SelectCard('Choose CEO card to play', 'Play', dealtLeaders, ([card]) => {
        player.leaderCardsInHand.push(card);
        return undefined;
      });
    }));
    return undefined;
  }

  private static dealLeaders(player: Player, leaderDeck: LeaderDeck) {
    const cards: Array<ILeaderCard> = [];
    try {
      while (cards.length < 3) {
        cards.push(leaderDeck.draw(player.game));
      }
    } catch (err) {
      // Error will only occur if the deck is empty.  This may happen in very large player games
      player.game.log('Not enough CEOs while resolving ${0}', (b) => b.cardName(CardName.JOINT_VENTURE));
    }
    LogHelper.logDrawnCards(player, cards, /* privateMessage= */true);
    return cards;
  }
}
