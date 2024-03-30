import {expect} from 'chai';
import {GreatEscarpmentConsortium} from '../../../src/server/cards/base/GreatEscarpmentConsortium';
import {Game} from '../../../src/server/Game';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {runAllActions, cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('GreatEscarpmentConsortium', function() {
  let card: GreatEscarpmentConsortium;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new GreatEscarpmentConsortium();
    [game, player, player2] = testGame(2);
  });

  it('Cannot play without steel production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play if player has steel production', function() {
    player.production.add(Resource.STEEL, 1);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play - auto select if single target', function() {
    player2.production.add(Resource.STEEL, 1);

    card.play(player);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(player.production.steel).to.eq(1);
    expect(player2.production.steel).to.eq(0);
  });

  it('Should play - multiple targets', function() {
    player.production.add(Resource.STEEL, 1);
    player2.production.add(Resource.STEEL, 1);
    card.play(player);

    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);
    runAllActions(game);

    expect(player.production.steel).to.eq(2);
    expect(player2.production.steel).to.eq(0);
  });

  it('Can play in solo - will not reduce own production', function() {
    [game, player] = testGame(1);
    player.production.add(Resource.STEEL, 1);
    expect(player.production.steel).to.eq(1);

    card.play(player);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(player.production.steel).to.eq(2); // should increase
  });
});
