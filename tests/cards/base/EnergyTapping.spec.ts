import {expect} from 'chai';
import {EnergyTapping} from '../../../src/server/cards/base/EnergyTapping';
import {Game} from '../../../src/server/Game';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {runAllActions, cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('EnergyTapping', function() {
  let card: EnergyTapping;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new EnergyTapping();
    [game, player, player2] = testGame(2);
  });

  it('play - no targets', function() {
    player.playedCards.push(card, card);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);

    expect(player.production.energy).to.eq(1);

    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    expect(selectPlayer.players).deep.eq([player]);
    selectPlayer.cb(player);
    runAllActions(game);
    expect(player.production.energy).to.eq(0);
    expect(player2.production.energy).to.eq(0);
  });

  it('play - auto select if single target', function() {
    player2.production.override({energy: 1});

    card.play(player);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(player.production.energy).to.eq(1);
    expect(player2.production.energy).to.eq(0);
  });

  it('play - multiple targets', function() {
    player.production.add(Resource.ENERGY, 2);
    player2.production.add(Resource.ENERGY, 3);

    card.play(player);

    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);

    runAllActions(game);

    expect(player.production.energy).to.eq(3);
    expect(player2.production.energy).to.eq(2);
  });

  it('Playable in solo mode', function() {
    [game, player] = testGame(1);
    card.play(player);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(player.production.energy).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(-1);
  });
});
