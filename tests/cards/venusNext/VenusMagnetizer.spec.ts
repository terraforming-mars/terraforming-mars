import {expect} from 'chai';
import {VenusMagnetizer} from '../../../src/server/cards/venusNext/VenusMagnetizer';
import {IGame} from '../../../src/server/IGame';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {cast, setVenusScaleLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('VenusMagnetizer', () => {
  let card: VenusMagnetizer;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new VenusMagnetizer();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    setVenusScaleLevel(game, 8);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setVenusScaleLevel(game, 10);
    expect(card.canPlay(player)).is.true;
    cast(card.play(player), undefined);
  });

  it('Should act', () => {
    player.production.add(Resource.ENERGY, 2);
    player.playedCards.push(card);

    card.action(player);
    expect(player.production.energy).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
