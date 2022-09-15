
import {expect} from 'chai';
import {Diversifier} from '../../src/server/milestones/Diversifier';
import {ResearchNetwork} from '../../src/server/cards/prelude/ResearchNetwork';
import {TestPlayer} from '../TestPlayer';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {Leavitt} from '../../src/server/cards/community/Leavitt';
import {testGameOptions} from '../TestingUtils';
import {AntiGravityTechnology} from '../../src/server/cards/base/AntiGravityTechnology';

describe('Diversifier', function() {
  let milestone: Diversifier;
  let player: Player;

  beforeEach(() => {
    milestone = new Diversifier();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('Counts wild tags tags as unique tags', function() {
    const milestone = new Diversifier();
    expect(milestone.canClaim(player)).is.not.true;
    for (let i = 0; i < 8; i++) {
      player.playedCards.push(new ResearchNetwork());
    }
    expect(milestone.canClaim(player)).is.true;
  });

  it('Counts Leavitt science tag placement bonus', function() {
    const gameOptions = testGameOptions({coloniesExtension: true});
    const game = Game.newInstance('gameid', [player], player, gameOptions);
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
