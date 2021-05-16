import {expect} from 'chai';
import {OceanSanctuary} from '../../../src/cards/ares/OceanSanctuary';
import {CuriosityII} from '../../../src/cards/community/CuriosityII';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {TileType} from '../../../src/TileType';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('CuriosityII', function() {
  let card : CuriosityII; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new CuriosityII();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player, TestingUtils.setCustomGameOptions({aresExtension: true, aresHazards: false}));
    game.phase = Phase.ACTION;

    player.corporationCard = card;
    player.megaCredits = 2;
  });

  it('Can pay 2 M€ to draw card when placing a tile on a non-empty space', function() {
    const nonEmptySpace = game.board.getAvailableSpacesOnLand(player).find((space) => space.bonus.length > 0)!;
    game.addCityTile(player, nonEmptySpace.id);
    player.cardsInHand = [];

    expect(game.deferredActions.length).to.eq(1);
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;

    orOptions.options[1].cb(); // Do nothing
    expect(player.cardsInHand).is.empty;
    expect(player.megaCredits).to.eq(2);

    orOptions.options[0].cb(); // Pay 2 M€ to draw a card
    TestingUtils.runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(0);
  });

  it('Does not trigger when placing a tile on an empty space', function() {
    const emptySpace = game.board.getAvailableSpacesOnLand(player).find((space) => space.bonus.length === 0)!;
    game.addCityTile(player, emptySpace.id);
    TestingUtils.runAllActions(game);

    expect(player.cardsInHand).is.empty;
    expect(player.megaCredits).to.eq(2);
  });

  it('Does not trigger when opponent places a tile', function() {
    const nonEmptySpace = game.board.getAvailableSpacesOnLand(player2).find((space) => space.bonus.length > 0)!;
    game.addCityTile(player2, nonEmptySpace.id);
    TestingUtils.runAllActions(game);

    expect(player.cardsInHand).is.empty;
    expect(player.megaCredits).to.eq(2);
  });

  it('Placing a tile on top of another one triggers the bonus', () => {
    // particularly when the space bonus is empty.
    const oceanSpace = game.board.getAvailableSpacesForOcean(player2).find((space) => space.bonus.length === 0)!;
    game.board.getSpace(oceanSpace.id).tile = {tileType: TileType.OCEAN};

    const oceanCity = new OceanSanctuary();
    const action = oceanCity.play(player);
    action.cb(oceanSpace);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[0].cb(); // Pay 2 M€ to draw a card
    TestingUtils.runAllActions(game);

    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(0);
  });
});
