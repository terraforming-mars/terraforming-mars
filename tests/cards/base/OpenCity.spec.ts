import {expect} from 'chai';
import {OpenCity} from '../../../src/server/cards/base/OpenCity';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast, runAllActions, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('OpenCity', function() {
  let card: OpenCity;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new OpenCity();
    [game, player] = testGame(2);
  });

  it('Can not play without energy production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if oxygen level too low', function() {
    player.production.add(Resource.ENERGY, 1);
    setOxygenLevel(game, 11);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
    setOxygenLevel(game, 12);
    expect(card.canPlay(player)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    action.cb(action.spaces[0]);
    expect(game.board.getCitiesOnMars()).has.length(1);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(4);
    expect(player.plants).to.eq(2);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
