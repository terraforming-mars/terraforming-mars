import {expect} from 'chai';
import {CupolaCity} from '../../../src/server/cards/base/CupolaCity';
import {IGame} from '../../../src/server/IGame';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {assertPlaceCity} from '../../assertions';

describe('CupolaCity', () => {
  let card: CupolaCity;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new CupolaCity();
    [game, player] = testGame(2);
  });

  it('Can not play without energy production', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if oxygen level too high', () => {
    player.production.add(Resource.ENERGY, 1);
    setOxygenLevel(game, 10);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    runAllActions(player.game);

    assertPlaceCity(player, player.popWaitingFor());

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);
  });
});
