import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {CoLeadership} from '../../../src/server/cards/ceos/CoLeadership';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {ICard} from '../../../src/server/cards/ICard';

describe('Co Leadership', function() {
  let card: CoLeadership;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new CoLeadership();
    [game, player] = testGame(1, {ceoExtension: true});
  });

  it('Should play', function() {
    expect(player.ceoCardsInHand).is.empty;
    expect(game.ceoDeck.discardPile).is.empty;
    const selectCard = card.play(player) as SelectCard<ICard>;
    selectCard.cb([selectCard.cards[0]]);
    game.deferredActions.runAll(() => {});
    expect(player.ceoCardsInHand.length).eq(1);
    expect(game.ceoDeck.discardPile.length).eq(2);
  });
});
