import {expect} from 'chai';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('JovianLanterns', function() {
  let card: JovianLanterns;
  let player: TestPlayer;

  beforeEach(function() {
    card = new JovianLanterns();
    [/* game */, player] = testGame(2);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Can not act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.titanium = 3;
    expect(card.canAct(player)).is.true;

    const action = card.action(player);
    cast(action, undefined);
    expect(card.resourceCount).to.eq(2);
    expect(player.titanium).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
