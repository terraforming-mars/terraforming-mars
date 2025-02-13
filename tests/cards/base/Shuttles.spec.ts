import {expect} from 'chai';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {Shuttles} from '../../../src/server/cards/base/Shuttles';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Shuttles', () => {
  let card: Shuttles;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Shuttles();
    [game, player] = testGame(2);
  });

  it('Can not play without energy production', () => {
    setOxygenLevel(game, 5);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if oxygen level too low', () => {
    player.production.add(Resource.ENERGY, 1);
    setOxygenLevel(game, 4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setOxygenLevel(game, 5);
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(2);

    expect(card.getVictoryPoints(player)).to.eq(1);

    expect(card.getCardDiscount(player, new Bushes())).to.eq(0);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(2);
  });
});
