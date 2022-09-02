import {expect} from 'chai';
import {GreatEscarpmentConsortium} from '../../../src/server/cards/base/GreatEscarpmentConsortium';
import {Game} from '../../../src/server/Game';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {runAllActions, cast} from '../../TestingUtils';

describe('GreatEscarpmentConsortium', function() {
  let card: GreatEscarpmentConsortium;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new GreatEscarpmentConsortium();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    player.popWaitingFor(); // Remove SelectInitialCards
  });

  it('Cannot play without steel production', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play if player has steel production', function() {
    player.production.add(Resources.STEEL, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play - auto select if single target', function() {
    player2.production.add(Resources.STEEL, 1);

    card.play(player);
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(player.production.steel).to.eq(1);
    expect(player2.production.steel).to.eq(0);
  });

  it('Should play - multiple targets', function() {
    player.production.add(Resources.STEEL, 1);
    player2.production.add(Resources.STEEL, 1);
    card.play(player);

    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);
    runAllActions(game);

    expect(player.production.steel).to.eq(2);
    expect(player2.production.steel).to.eq(0);
  });

  it('Can play in solo - will not reduce own production', function() {
    const game = Game.newInstance('gameid', [player], player);
    player.popWaitingFor(); // Remove SelectInitialCards
    player.production.add(Resources.STEEL, 1);
    expect(player.production.steel).to.eq(1);

    card.play(player);
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(player.production.steel).to.eq(2); // should increase
  });
});
