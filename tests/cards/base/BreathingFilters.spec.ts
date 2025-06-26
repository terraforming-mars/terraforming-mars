import {expect} from 'chai';
import {setOxygenLevel} from '../../TestingUtils';
import {BreathingFilters} from '../../../src/server/cards/base/BreathingFilters';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('BreathingFilters', () => {
  let card: BreathingFilters;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new BreathingFilters();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setOxygenLevel(game, 7);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
