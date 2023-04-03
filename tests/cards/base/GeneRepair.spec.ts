import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {GeneRepair} from '../../../src/server/cards/base/GeneRepair';
import {TestPlayer} from '../../TestPlayer';

describe('GeneRepair', function() {
  let card: GeneRepair;
  let player: TestPlayer;

  beforeEach(function() {
    card = new GeneRepair();
    [/* skipped */, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card);
    expect(player.simpleCanPlay(card)).is.true;
    card.play(player);

    expect(player.production.megacredits).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
