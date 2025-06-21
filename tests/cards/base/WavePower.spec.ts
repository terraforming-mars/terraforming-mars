import {expect} from 'chai';
import {WavePower} from '../../../src/server/cards/base/WavePower';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {maxOutOceans} from '../../TestingUtils';

describe('WavePower', () => {
  let card: WavePower;
  let player: TestPlayer;

  beforeEach(() => {
    card = new WavePower();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', () => {
    maxOutOceans(player, 2);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    maxOutOceans(player, 3);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
