import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {Lichen} from '../../../src/server/cards/base/Lichen';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Lichen', () => {
  let card: Lichen;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Lichen();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setTemperature(game, -24);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(1);
  });
});
