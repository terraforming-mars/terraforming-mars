import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Bushes', () => {
  let card: Bushes;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Bushes();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setTemperature(game, -10);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(2);
    expect(player.plants).to.eq(2);
  });
});
