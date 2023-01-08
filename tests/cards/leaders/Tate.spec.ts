import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

import {ICard} from '../../../src/server/cards/ICard';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

import {Tate} from '../../../src/server/cards/leaders/Tate';

describe('Tate', function() {
  let card: Tate;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Tate();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, player2], player);
    player.megaCredits = 6;
  });

  it('Takes OPG action', function() {
    card.action(player);
    expect(game.deferredActions).has.length(1);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    const action = orOptions.options[0].cb()! as SelectCard<ICard>;
    expect(action).instanceOf(SelectCard);

    action.cb([action.cards[0], action.cards[3]]);
    game.deferredActions.runAll(() => {});
    expect(player.cardsInHand).has.length(2);
    expect(player.megaCredits).eq(0);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
