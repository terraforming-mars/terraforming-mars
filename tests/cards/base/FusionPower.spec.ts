import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {FusionPower} from '../../../src/server/cards/base/FusionPower';
import {TestPlayer} from '../../TestPlayer';

describe('FusionPower', () => {
  let card: FusionPower;
  let player: TestPlayer;

  beforeEach(() => {
    card = new FusionPower();
    [/* game */, player] = testGame(1);
  });

  it('Can not play', () => {
    player.tagsForTest = {power: 1};
    expect(card.canPlay(player)).is.not.true;
    player.tagsForTest = {power: 2};
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    card.play(player);
    expect(player.production.energy).to.eq(3);
  });
});
