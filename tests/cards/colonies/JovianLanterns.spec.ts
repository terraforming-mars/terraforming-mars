import {expect} from 'chai';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('JovianLanterns', () => {
  let card: JovianLanterns;
  let player: TestPlayer;

  beforeEach(() => {
    card = new JovianLanterns();
    [/* game */, player] = testGame(2);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Can not act', () => {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.titanium = 3;
    expect(card.canAct(player)).is.true;

    const action = card.action(player);
    cast(action, undefined);
    expect(card.resourceCount).to.eq(2);
    expect(player.titanium).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
