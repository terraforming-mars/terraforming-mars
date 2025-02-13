import {expect} from 'chai';
import {Diversifier} from '../../src/server/milestones/Diversifier';
import {ResearchNetwork} from '../../src/server/cards/prelude/ResearchNetwork';
import {TestPlayer} from '../TestPlayer';
import {Leavitt} from '../../src/server/cards/community/Leavitt';
import {AntiGravityTechnology} from '../../src/server/cards/base/AntiGravityTechnology';
import {testGame} from '../TestGame';

describe('Diversifier', () => {
  let milestone: Diversifier;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Diversifier();
    [/* game */, player] = testGame(2);
  });

  it('Counts wild tags tags as unique tags', () => {
    const milestone = new Diversifier();
    expect(milestone.canClaim(player)).is.not.true;
    for (let i = 0; i < 8; i++) {
      player.playedCards.push(new ResearchNetwork());
    }
    expect(milestone.canClaim(player)).is.true;
  });

  it('Counts Leavitt science tag placement bonus', () => {
    const [game, player] = testGame(1, {coloniesExtension: true});
    const leavitt = new Leavitt();
    game.colonies = [leavitt];

    leavitt.addColony(player);
    expect(milestone.getScore(player)).eq(1);

    // Adding a second colony doesn't change things
    leavitt.addColony(player);
    expect(milestone.getScore(player)).eq(1);

    // Or another science card.
    player.playedCards.push(new AntiGravityTechnology());
    expect(milestone.getScore(player)).eq(1);

    expect(milestone.canClaim(player)).is.false;
    for (let i = 0; i < 7; i++) {
      player.playedCards.push(new ResearchNetwork());
    }
    expect(milestone.canClaim(player)).is.true;
  });

  it('Counts Leavitt science tag placement bonus', () => {
    const [game, player] = testGame(1, {coloniesExtension: true});
    const leavitt = new Leavitt();
    game.colonies = [leavitt];

    leavitt.addColony(player);
    expect(milestone.getScore(player)).eq(1);

    // Adding a second colony doesn't change things
    leavitt.addColony(player);
    expect(milestone.getScore(player)).eq(1);

    // Or another science card.
    player.playedCards.push(new AntiGravityTechnology());
    expect(milestone.getScore(player)).eq(1);

    expect(milestone.canClaim(player)).is.false;
    for (let i = 0; i < 7; i++) {
      player.playedCards.push(new ResearchNetwork());
    }
    expect(milestone.canClaim(player)).is.true;
  });
});
