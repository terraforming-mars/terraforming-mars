import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {GeneRepair} from '../../../src/server/cards/base/GeneRepair';
import {InterstellarColonyShip} from '../../../src/server/cards/base/InterstellarColonyShip';
import {Research} from '../../../src/server/cards/base/Research';
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
  });

  it('Should play', () => {
    player.playedCards.push(new Research(), new Research(), new GeneRepair());
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(4);
  });
});
