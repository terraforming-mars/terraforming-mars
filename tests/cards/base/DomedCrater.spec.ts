import {expect} from 'chai';
import {DomedCrater} from '../../../src/server/cards/base/DomedCrater';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {runAllActions, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('DomedCrater', function() {
  let card: DomedCrater;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new DomedCrater();
    [game, player] = testGame(2);
  });

  it('Can not play without energy production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if oxygen level too high', function() {
    player.production.add(Resource.ENERGY, 1);
    setOxygenLevel(game, 8);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);

    UnderworldTestHelper.assertPlaceCity(player, player.popWaitingFor());

    expect(player.plants).to.eq(3);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});

