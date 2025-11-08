import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {NoctisFarming} from '../../../src/server/cards/base/NoctisFarming';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('NoctisFarming', () => {
  let card: NoctisFarming;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new NoctisFarming();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setTemperature(game, -20);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.megacredits).to.eq(1);
    expect(player.plants).to.eq(2);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
