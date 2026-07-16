import {expect} from 'chai';
import {GreatEscarpmentConsortium} from '../../../src/server/cards/base/GreatEscarpmentConsortium';
import {IGame} from '../../../src/server/IGame';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {runAllActions, cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('GreatEscarpmentConsortium', () => {
  let card: GreatEscarpmentConsortium;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new GreatEscarpmentConsortium();
    [game, player, player2] = testGame(2);
  });

  it('Cannot play without steel production', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play if player has steel production', () => {
    player.production.add(Resource.STEEL, 1);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play - auto select if single target', () => {
    player2.production.add(Resource.STEEL, 1);

    card.play(player);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(player.production.steel).to.eq(1);
    expect(player2.production.steel).to.eq(0);
  });

  it('Should play - multiple targets', () => {
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

  it('Can play in solo - will not reduce own production', () => {
    [game, player] = testGame(1);
    player.production.add(Resource.STEEL, 1);
    expect(player.production.steel).to.eq(1);

    card.play(player);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(player.production.steel).to.eq(2); // should increase
  });
});
