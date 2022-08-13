import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {MarsUniversity} from '../../../src/server/cards/base/MarsUniversity';
import {Pets} from '../../../src/server/cards/base/Pets';
import {Research} from '../../../src/server/cards/base/Research';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';

describe('MarsUniversity', function() {
  let card: MarsUniversity;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new MarsUniversity();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;

    expect(card.onCardPlayed(player, new Pets())).is.undefined;
    expect(game.deferredActions).has.lengthOf(0);

    player.cardsInHand.push(card);
    card.onCardPlayed(player, card);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    game.deferredActions.pop();
    orOptions.options[0].cb([card]);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0]).not.to.eq(card);
    expect(game.dealer.discarded).has.lengthOf(1);
    expect(game.dealer.discarded[0]).to.eq(card);
    expect(game.deferredActions).has.lengthOf(0);
  });

  it('Gives victory point', function() {
    card.play();
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Runs twice for multiple science tags', function() {
    player.cardsInHand.push(card, card);
    card.onCardPlayed(player, new Research());
    expect(game.deferredActions).has.lengthOf(2);

    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    game.deferredActions.pop();
    orOptions.options[1].cb();

    const orOptions2 = cast(game.deferredActions.peek()!.execute(), OrOptions);
    game.deferredActions.pop();
    orOptions2.options[1].cb();

    expect(game.deferredActions).has.lengthOf(0);
  });
});
