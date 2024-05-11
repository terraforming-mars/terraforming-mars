import {expect} from 'chai';
import {ExpeditionToTheSurfaceVenus} from '../../../src/server/cards/pathfinders/ExpeditionToTheSurfaceVenus';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('ExpeditiontotheSurfaceVenus', function() {
  let card: ExpeditionToTheSurfaceVenus;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new ExpeditionToTheSurfaceVenus();
    [game, player] = testGame(1);
  });

  it('play', function() {
    player.cardsInHand = [];
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.cardsInHand).has.lengthOf(2);
    player.production.override({energy: 1});
    expect(player.getTerraformRating()).eq(15);
    expect(game.getVenusScaleLevel()).eq(2);
    expect(player.megaCredits).eq(1);

    player.megaCredits = 0;
    player.tagsForTest = {venus: 1};
    card.play(player);
    expect(player.megaCredits).eq(2);

    player.megaCredits = 0;
    player.tagsForTest = {venus: 5};
    card.play(player);
    expect(player.megaCredits).eq(6);

    player.megaCredits = 0;
    player.tagsForTest = {venus: 1, wild: 2};
    card.play(player);
    expect(player.megaCredits).eq(4);
  });
});
