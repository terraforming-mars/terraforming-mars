import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {GeneRepair} from '../../../src/server/cards/base/GeneRepair';
import {TestPlayer} from '../../TestPlayer';

describe('GeneRepair', function() {
  let card: GeneRepair;
  let player: TestPlayer;

  beforeEach(function() {
    card = new GeneRepair();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', function() {
    player.tagsForTest = {science: 2};
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', function() {
    player.tagsForTest = {science: 3};
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    card.play(player);

    expect(player.production.megacredits).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
