import {expect} from 'chai';
import {Banker} from '../../src/server/awards/Banker';
import {IAward} from '../../src/server/awards/IAward';
import {IGame} from '../../src/server/IGame';
import {Mayor} from '../../src/server/milestones/Mayor';
import {Resource} from '../../src/common/Resource';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {Server} from '../../src/server/models/ServerModel';
import {GlobalParameter} from '../../src/common/GlobalParameter';
import {Phase} from '../../src/common/Phase';

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

  it('Should include globalParameterSteps at game end', () => {
    createTestGame(false);
    // Simulate players contributing to global parameters
    player.globalParameterSteps[GlobalParameter.TEMPERATURE] = 5;
    player.globalParameterSteps[GlobalParameter.OXYGEN] = 3;
    player.globalParameterSteps[GlobalParameter.OCEANS] = 2;
    
    player2.globalParameterSteps[GlobalParameter.TEMPERATURE] = 2;
    player2.globalParameterSteps[GlobalParameter.OXYGEN] = 6;
    
    game.phase = Phase.END;
    
    const response = Server.getPlayerModel(player);
    
    // Current player should always see their globalParameterSteps
    expect(response.thisPlayer.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(5);
    expect(response.thisPlayer.globalParameterSteps[GlobalParameter.OXYGEN]).eq(3);
    expect(response.thisPlayer.globalParameterSteps[GlobalParameter.OCEANS]).eq(2);
    
    // Other players' globalParameterSteps should be visible at game end
    const otherPlayer = response.players.find(p => p.id === player2.id);
    expect(otherPlayer).is.not.undefined;
    expect(otherPlayer!.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(2);
    expect(otherPlayer!.globalParameterSteps[GlobalParameter.OXYGEN]).eq(6);
  });

  it('Should not include globalParameterSteps during game', () => {
    createTestGame(false);
    player.globalParameterSteps[GlobalParameter.TEMPERATURE] = 5;
    player2.globalParameterSteps[GlobalParameter.OXYGEN] = 3;
    
    game.phase = Phase.ACTION;
    
    const response = Server.getPlayerModel(player);
    
    // Current player should see their own steps
    expect(response.thisPlayer.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(5);
    
    // Other players' steps should be empty during game (player id is undefined during game)
    const otherPlayer = response.players.find(p => p.color === player2.color && p.name === player2.name);
    expect(otherPlayer).is.not.undefined;
    expect(Object.keys(otherPlayer!.globalParameterSteps).length).eq(0);
  });

  it('Should include globalParameterSteps when showOtherPlayersVP is true', () => {
    createTestGame(true);
    player.globalParameterSteps[GlobalParameter.TEMPERATURE] = 4;
    player2.globalParameterSteps[GlobalParameter.OXYGEN] = 7;
    
    game.phase = Phase.ACTION;
    
    const response = Server.getPlayerModel(player);
    
    // With showOtherPlayersVP, all players' steps should be visible
    expect(response.thisPlayer.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(4);
    
    const otherPlayer = response.players.find(p => p.color === player2.color && p.name === player2.name);
    expect(otherPlayer).is.not.undefined;
    expect(otherPlayer!.globalParameterSteps[GlobalParameter.OXYGEN]).eq(7);
  });
});
