
import {expect} from 'chai';
import {Diversifier} from '../../src/milestones/Diversifier';
import {ResearchNetwork} from '../../src/cards/prelude/ResearchNetwork';
import {TestPlayers} from '../TestPlayers';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {Leavitt} from '../../src/cards/community/Leavitt';
import {setCustomGameOptions} from '../TestingUtils';
import {AntiGravityTechnology} from '../../src/cards/base/AntiGravityTechnology';

describe('Diversifier', function() {
  let milestone : Diversifier;
  let player : Player;

  beforeEach(() => {
    milestone = new Diversifier();
    player = TestPlayers.BLUE.newPlayer();
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
    const gameOptions = setCustomGameOptions({coloniesExtension: true});
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
