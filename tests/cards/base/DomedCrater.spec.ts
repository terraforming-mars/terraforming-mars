import {expect} from 'chai';
import {DomedCrater} from '../../../src/server/cards/base/DomedCrater';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {cast, runAllActions, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {assertPlaceCity} from '../../assertions';

describe('DomedCrater', () => {
  let card: DomedCrater;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new DomedCrater();
    [game, player] = testGame(2);
  });

  it('Can not play without energy production', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if oxygen level too high', () => {
    player.production.add(Resource.ENERGY, 1);
    setOxygenLevel(game, 8);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    runAllActions(player.game);

    assertPlaceCity(player, player.popWaitingFor());

    expect(player.plants).to.eq(3);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});

