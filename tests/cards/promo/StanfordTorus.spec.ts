import {expect} from 'chai';
import {StanfordTorus} from '../../../src/server/cards/promo/StanfordTorus';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('StanfordTorus', function() {
  let card: StanfordTorus;
  let player: TestPlayer;

  beforeEach(function() {
    card = new StanfordTorus();
    [/* skipped */, player] = testGame(2);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.game.getCitiesCount()).to.eq(1);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
