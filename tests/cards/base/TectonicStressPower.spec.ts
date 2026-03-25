import {expect} from 'chai';
import {TectonicStressPower} from '../../../src/server/cards/base/TectonicStressPower';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('TectonicStressPower', () => {
  let card: TectonicStressPower;
  let player: TestPlayer;

  beforeEach(() => {
    card = new TectonicStressPower();
    [/* game */, player] = testGame(1);
  });

  it('canPlay', () => {
    expect(card.canPlay(player)).is.not.true;
    player.tagsForTest = {science: 1};
    expect(card.canPlay(player)).is.not.true;
    player.tagsForTest = {science: 2};
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    card.play(player);

    expect(player.production.energy).to.eq(3);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
