import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {IceCapMelting} from '../../../src/server/cards/base/IceCapMelting';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('IceCapMelting', () => {
  let card: IceCapMelting;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new IceCapMelting();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setTemperature(game, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);
  });
});
