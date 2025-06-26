import {expect} from 'chai';
import {GreatDam} from '../../../src/server/cards/base/GreatDam';
import {TestPlayer} from '../../TestPlayer';
import {maxOutOceans} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('GreatDam', () => {
  let card: GreatDam;
  let player: TestPlayer;

  beforeEach(() => {
    card = new GreatDam();
    [/* game */, player] = testGame(2);
  });

  it('Can play', () => {
    maxOutOceans(player, 3);
    expect(card.canPlay(player)).is.not.true;
    maxOutOceans(player, 4);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    maxOutOceans(player, 4);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.production.energy).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
