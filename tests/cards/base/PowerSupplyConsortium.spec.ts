import {expect} from 'chai';
import {PowerSupplyConsortium} from '../../../src/server/cards/base/PowerSupplyConsortium';
import {Game} from '../../../src/server/Game';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {runAllActions, cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('PowerSupplyConsortium', function() {
  let card: PowerSupplyConsortium;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new PowerSupplyConsortium();
    [game, player, player2] = testGame(2);
  });

  it('Cannot play without power tags', function() {
    player.production.add(Resource.ENERGY, 3);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Can play - no targets', function() {
    player.playedCards.push(card, card);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(player.production.energy).to.eq(1);
  });

  it('Can play - single target', function() {
    player2.production.override({energy: 1});
    player.playedCards.push(card, card);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(player.production.energy).to.eq(1);
    expect(player2.production.energy).to.eq(0);
  });

  it('Can play - multiple targets', function() {
    player.production.add(Resource.ENERGY, 1);
    player2.production.add(Resource.ENERGY, 3);

    card.play(player);

    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);
    runAllActions(game);
    expect(player.production.energy).to.eq(2);
    expect(player2.production.energy).to.eq(2);
  });

  it('Can play in solo mode if have enough power tags', function() {
    const [soloGame, soloPlayer] = testGame(1);
    soloPlayer.playedCards.push(card, card);
    expect(card.canPlay(soloPlayer)).is.true;

    card.play(soloPlayer);
    runAllActions(soloGame);
    expect(soloPlayer.production.energy).to.eq(1); // incremented
  });
});
