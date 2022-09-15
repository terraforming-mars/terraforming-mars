import {expect} from 'chai';
import {OceanSanctuary} from '../../../src/server/cards/ares/OceanSanctuary';
import {CuriosityII} from '../../../src/server/cards/community/CuriosityII';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Phase} from '../../../src/common/Phase';
import {TileType} from '../../../src/common/TileType';
import {testGameOptions, runAllActions, cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('CuriosityII', function() {
  let card: CuriosityII;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CuriosityII();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player, testGameOptions({aresExtension: true, aresHazards: false}));
    game.phase = Phase.ACTION;

    player.setCorporationForTest(card);
    player.megaCredits = 2;
  });

  it('Can pay 2 M€ to draw card when placing a tile on a non-empty space', function() {
    const nonEmptySpace = game.board.getAvailableSpacesOnLand(player).find((space) => space.bonus.length > 0)!;
    game.addCityTile(player, nonEmptySpace.id);
    player.cardsInHand = [];

    expect(game.deferredActions.length).to.eq(1);
    const orOptions = cast(game.deferredActions.pop()!.execute(), OrOptions);

    orOptions.options[1].cb(); // Do nothing
    expect(player.cardsInHand).is.empty;
    expect(player.megaCredits).to.eq(2);

    orOptions.options[0].cb(); // Pay 2 M€ to draw a card
    runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(0);
  });

  it('Does not trigger when placing a tile on an empty space', function() {
    const emptySpace = game.board.getAvailableSpacesOnLand(player).find((space) => space.bonus.length === 0)!;
    game.addCityTile(player, emptySpace.id);
    runAllActions(game);

    expect(player.cardsInHand).is.empty;
    expect(player.megaCredits).to.eq(2);
  });

  it('Does not trigger when opponent places a tile', function() {
    const nonEmptySpace = game.board.getAvailableSpacesOnLand(player2).find((space) => space.bonus.length > 0)!;
    game.addCityTile(player2, nonEmptySpace.id);
    runAllActions(game);

    expect(player.cardsInHand).is.empty;
    expect(player.megaCredits).to.eq(2);
  });

  it('Placing a tile on top of another one triggers the bonus', () => {
    // particularly when the space bonus is empty.
    const oceanSpace = game.board.getAvailableSpacesForOcean(player2).find((space) => space.bonus.length === 0)!;
    game.board.getSpace(oceanSpace.id).tile = {tileType: TileType.OCEAN};

    const oceanCity = new OceanSanctuary();
    const action = cast(oceanCity.play(player), SelectSpace);
    action.cb(oceanSpace);

    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb(); // Pay 2 M€ to draw a card

    runAllActions(game);

    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(0);
  });
});
