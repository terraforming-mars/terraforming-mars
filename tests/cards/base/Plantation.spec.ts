import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {InventorsGuild} from '../../../src/server/cards/base/InventorsGuild';
import {Plantation} from '../../../src/server/cards/base/Plantation';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Plantation', function() {
  let card: Plantation;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Plantation();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new InventorsGuild(), new InventorsGuild());
    expect(card.canPlay(player)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(action.spaces[0]);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
