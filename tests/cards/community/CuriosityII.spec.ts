import {expect} from 'chai';
import {CuriosityII} from '../../../src/cards/community/CuriosityII';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('CuriosityII', function() {
  let card : CuriosityII; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new CuriosityII();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);

    player.corporationCard = card;
    player.megaCredits = 3;
  });

  it('Can pay 3 MC to draw card when placing a tile on a non-empty space', function() {
    const nonEmptySpace = game.board.getAvailableSpacesOnLand(player).find((space) => space.bonus.length > 0)!;
    game.addCityTile(player, nonEmptySpace.id);
    player.cardsInHand = [];

    expect(game.deferredActions.length).to.eq(1);
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;

    orOptions.options[1].cb(); // Do nothing
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(3);

    orOptions.options[0].cb(); // Pay 3 MC to draw a card
    TestingUtils.runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(0);
  });

  it('Does not trigger when placing a tile on an empty space', function() {
    const emptySpace = game.board.getAvailableSpacesOnLand(player).find((space) => space.bonus.length === 0)!;
    game.addCityTile(player, emptySpace.id);
    TestingUtils.runAllActions(game);

    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(3);
  });

  it('Does not trigger when opponent places a tile', function() {
    const nonEmptySpace = game.board.getAvailableSpacesOnLand(player2).find((space) => space.bonus.length > 0)!;
    game.addCityTile(player2, nonEmptySpace.id);
    TestingUtils.runAllActions(game);

    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(3);
  });
});
