import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {CoLeadership} from '../../../src/server/cards/ceos/CoLeadership';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {ICeoCard} from '../../../src/server/cards/ceos/ICeoCard';
import {cast, runAllActions} from '../../TestingUtils';
import {Phase} from '../../../src/common/Phase';

describe('Co Leadership', () => {
  it('Should play', () => {
    const card = new CoLeadership();
    const [game, player] = testGame(1, {ceoExtension: true});
    expect(player.ceoCardsInHand).is.empty;
    expect(game.ceoDeck.discardPile).is.empty;

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard<ICeoCard>);
    selectCard.cb([selectCard.cards[0]]);
    runAllActions(game);

    expect(player.ceoCardsInHand).has.length(1);
    expect(game.ceoDeck.discardPile).has.length(2);
  });

  it('Playable during the action phase', () => {
    const card = new CoLeadership();
    const [game, player] = testGame(1, {ceoExtension: true, preludeExtension: true});

    expect(game.ceoDeck.discardPile).is.empty;

    game.phase = Phase.ACTION;
    cast(card.play(player), undefined);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard<ICeoCard>);
    const ceo = selectCard.cards[0];
    selectCard.cb([ceo]);
    runAllActions(game);
    game.phase = Phase.ACTION;

    expect(player.ceoCardsInHand).is.empty;
    expect(player.playedCards.get(ceo.name)).deep.eq(ceo);
    expect(game.ceoDeck.discardPile).has.length(2);
  });
});
