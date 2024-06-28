import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {CoLeadership} from '../../../src/server/cards/ceos/CoLeadership';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {ICeoCard} from '../../../src/server/cards/ceos/ICeoCard';
import {cast, runAllActions} from '../../TestingUtils';

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

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard<ICeoCard>);
    selectCard.cb([selectCard.cards[0]]);
    game.deferredActions.runAll(() => {});

    expect(player.ceoCardsInHand.length).eq(1);
    expect(game.ceoDeck.discardPile.length).eq(2);
  });
});
