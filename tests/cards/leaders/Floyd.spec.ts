import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {forceGenerationEnd} from '../../TestingUtils';

import {Floyd} from '../../../src/server/cards/leaders/Floyd';

import {AsteroidMining} from '../../../src/server/cards/base/AsteroidMining';


describe('Floyd', function() {
  let card: Floyd;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Floyd();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Cannot act without cards', function() {
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    player.cardsInHand.push(new AsteroidMining());
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(game.deferredActions).has.length(2);
    player.getActionsThisGeneration().add(card.name);
    expect(card.getCardDiscount(player)).eq(15);

    game.deferredActions.runAll(() => {});
    expect(card.getCardDiscount(player)).eq(0);
  });

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => {});

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
