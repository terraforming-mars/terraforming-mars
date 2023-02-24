import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {cast, forceGenerationEnd} from '../../TestingUtils';

import {SelectCard} from '../../../src/server/inputs/SelectCard';

import {Buck} from '../../../src/server/cards/ceos/Buck';

import {AdvancedAlloys} from '../../../src/server/cards/base/AdvancedAlloys';
import {Comet} from '../../../src/server/cards/base/Comet';
import {ProtectedValley} from '../../../src/server/cards/base/ProtectedValley';
import {TerraformingGanymede} from '../../../src/server/cards/base/TerraformingGanymede';


describe('Buck', function() {
  let card: Buck;
  let player: TestPlayer;
  let game: Game;


  beforeEach(() => {
    card = new Buck();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Cannot act', function() {
    expect(card.canAct(player)).is.false;

    // an Active and an Event:
    player.playedCards.push(new AdvancedAlloys(), new Comet());
    expect(card.canAct(player)).is.false;

    // Protected Valley overrides an Ocean, cannot be returned
    const playedCard = new ProtectedValley();
    player.playedCards.push(playedCard);
    expect(card.canAct(player)).is.false;
  });

  it('Takes OPG action', function() {
    const playedCard = new TerraformingGanymede();
    player.playedCards.push(playedCard);
    expect(card.canAct(player)).is.true;

    expect(player.playedCards).has.length(1);
    expect(player.cardsInHand).has.length(0);

    const selectCard = cast(card.action(player), SelectCard);
    selectCard.cb([playedCard]);

    expect(player.playedCards).has.length(0);
    expect(player.cardsInHand).has.length(1);
  });

  it('Can only act once per game', function() {
    const playedCard = new TerraformingGanymede();
    player.cardsInHand.push(playedCard);

    const selectCard = cast(card.action(player), SelectCard);
    selectCard.cb([playedCard]);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
