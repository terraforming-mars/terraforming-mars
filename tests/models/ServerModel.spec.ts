import {expect} from 'chai';
import {Banker} from '../../src/server/awards/Banker';
import {IAward} from '../../src/server/awards/IAward';
import {IGame} from '../../src/server/IGame';
import {Mayor} from '../../src/server/milestones/Mayor';
import {Resource} from '../../src/common/Resource';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {Server} from '../../src/server/models/ServerModel';

describe('ServerModel', () => {
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  function createTestGame(showOtherPlayersVP: boolean) {
    [game, player, player2] = testGame(2, {showOtherPlayersVP});
    // Claim milestone
    const milestone = new Mayor();

    game.claimedMilestones.push({
      player: player,
      milestone: milestone,
    });

    // Fund awards
    const award: IAward = new Banker();
    game.fundAward(player, award);

    // Set second player to win Banker award
    player2.production.add(Resource.MEGACREDITS, 10);

    // Our testing player will be 2nd Banker in the game
    player.production.add(Resource.MEGACREDITS, 7);
  }

  it('Should always return current player\'s VP', () => {
    createTestGame(false);
    const response = Server.getPlayerModel(player);
    expect(response.thisPlayer.victoryPointsBreakdown.total).eq(25);
    expect(response.thisPlayer.victoryPointsBreakdown.milestones).eq(5);
    expect(response.players[0].victoryPointsBreakdown.total).eq(25);
    expect(response.players[1].victoryPointsBreakdown.total).eq(0);
  });

  it('Should return all players\' VP', () => {
    createTestGame(true);
    const response = Server.getPlayerModel(player);
    expect(response.thisPlayer.victoryPointsBreakdown.total).eq(25);
    expect(response.players[0].victoryPointsBreakdown.total).eq(25);
    expect(response.players[0].victoryPointsBreakdown.milestones).eq(5);
    expect(response.players[1].victoryPointsBreakdown.total).eq(25);
    expect(response.players[1].victoryPointsBreakdown.awards).eq(5);
  });

  it('Should hide all players\' VP when spectator', () => {
    createTestGame(false);
    const response = Server.getSpectatorModel(game);
    expect(response.players[0].victoryPointsBreakdown.total).eq(0);
    expect(response.players[1].victoryPointsBreakdown.total).eq(0);
  });
});
