import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {InterstellarColonyShip} from '../../../src/server/cards/base/InterstellarColonyShip';
import {TestPlayer} from '../../TestPlayer';

describe('InterstellarColonyShip', () => {
  let card: InterstellarColonyShip;
  let player: TestPlayer;

  beforeEach(() => {
    card = new InterstellarColonyShip();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
    player.tagsForTest = {science: 4};
    expect(card.canPlay(player)).is.not.true;
    player.tagsForTest = {science: 5};
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(4);
  });
});
