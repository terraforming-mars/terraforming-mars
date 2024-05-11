import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {MiningExpedition} from '../../../src/server/cards/base/MiningExpedition';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('MiningExpedition', function() {
  let card: MiningExpedition;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new MiningExpedition();
    [game, player, player2] = testGame(2);
  });

  it('Should play', function() {
    player2.plants = 8;
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb();
    expect(player2.plants).to.eq(6);

    expect(player.steel).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
