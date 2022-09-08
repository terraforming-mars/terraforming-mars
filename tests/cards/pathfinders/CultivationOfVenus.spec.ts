import {expect} from 'chai';
import {CultivationOfVenus} from '../../../src/server/cards/pathfinders/CultivationOfVenus';
import {TestPlayer} from '../../TestPlayer';
import {newTestGame, TestGame} from '../../TestGame';

describe('CultivationOfVenus', function() {
  let card: CultivationOfVenus;
  let player: TestPlayer;
  let game: TestGame;

  beforeEach(function() {
    card = new CultivationOfVenus();
    game = newTestGame(1);
    player = game.testPlayers[0];
  });

  it('Can act', function() {
    player.plants = 2;
    expect(card.canAct(player)).is.false;
    player.plants = 3;
    expect(card.canAct(player)).is.true;
  });

  it('act', function() {
    player.plants = 5;
    expect(player.getTerraformRating()).eq(14);

    card.action(player);

    expect(player.plants).eq(2);
    expect(game.getVenusScaleLevel()).to.eq(2);
    expect(player.getTerraformRating()).eq(15);
  });

  it('victoryPoints', function() {
    expect(card.getVictoryPoints(player)).eq(0);
    player.tagsForTest = {venus: 1};
    expect(card.getVictoryPoints(player)).eq(0);
    player.tagsForTest = {venus: 2};
    expect(card.getVictoryPoints(player)).eq(1);
    player.tagsForTest = {venus: 3};
    expect(card.getVictoryPoints(player)).eq(1);
    player.tagsForTest = {venus: 4};
    expect(card.getVictoryPoints(player)).eq(2);
  });
});
