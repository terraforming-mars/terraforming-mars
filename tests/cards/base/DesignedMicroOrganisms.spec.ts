import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {DesignedMicroOrganisms} from '../../../src/server/cards/base/DesignedMicroOrganisms';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('DesignedMicroOrganisms', () => {
  let card: DesignedMicroOrganisms;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new DesignedMicroOrganisms();
    [game, player] = testGame(2);
  });

  it('Cannot play', () => {
    setTemperature(game, -12);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    setTemperature(game, -14);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    setTemperature(game, -14);
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.plants).to.eq(2);
  });
});
