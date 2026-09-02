import {expect} from 'chai';
import {setOxygenLevel} from '../../TestingUtils';
import {MethaneFromTitan} from '../../../src/server/cards/base/MethaneFromTitan';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('MethaneFromTitan', () => {
  let card: MethaneFromTitan;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MethaneFromTitan();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setOxygenLevel(game, 2);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.production.heat).to.eq(2);
    expect(player.production.plants).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
