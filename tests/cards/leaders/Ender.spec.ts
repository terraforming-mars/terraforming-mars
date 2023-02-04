import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {Ender} from '../../../src/server/cards/ceos/Ender';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {Research} from '../../../src/server/cards/base/Research';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Ender', function() {
  let card: Ender;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Ender();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
  });

  it('Cannot act without cards', function() {
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    player.cardsInHand.push(new Research(), new MicroMills());
    expect(card.canAct(player)).is.true;

    const selectAmount = cast(card.action(player), SelectAmount);
    selectAmount.cb(2);
    runAllActions(game);
    expect(player.cardsInHand).has.length(2);
  });

  it('Can only act once per game', function() {
    player.cardsInHand.push(new Research(), new MicroMills());
    cast(card.action(player), SelectAmount).cb(2);

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
