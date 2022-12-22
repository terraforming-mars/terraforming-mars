import {expect} from "chai";
import {Ingrid} from "../../../src/server/cards/leaders/Ingrid";
import {Game} from "../../../src/server/Game";
import {Phase} from "../../../src/common/Phase";
import {forceGenerationEnd, addGreenery, addOcean, addCityTile} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';
import {SpaceName} from '../../../src/server/SpaceName';


describe('Ingrid', function() {
  let card: Ingrid;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Ingrid();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);

    player.playedCards.push(card);
  });

  it('Draws a card when taking action to place tile on Mars', function() {
    card.action();
    addGreenery(player, '35');
    expect(game.deferredActions).has.length(1);

    game.deferredActions.runNext(); // Draw card
    expect(player.cardsInHand).has.length(1);
  });

  it('Does not trigger ability when placing ocean during WGT', function() {
    card.action();
    game.phase = Phase.SOLAR;
    // game.addTile(player, SpaceType.OCEAN, game.board.spaces.find((space) => space.spaceType === SpaceType.OCEAN)!, {
    //   tileType: TileType.OCEAN,
    // });
    addOcean(player);

    expect(game.deferredActions).has.length(0);
  });

  it('Does not trigger ability when placing tile off Mars', function() {
    card.action();
    // game.addTile(player, SpaceType.COLONY, game.board.spaces.find((space) => space.spaceType === SpaceType.COLONY)!, {
    //   tileType: TileType.CITY,
    // });
    addCityTile(player, SpaceName.GANYMEDE_COLONY);
    expect(game.deferredActions).has.length(0);
  });

  it('Can only act once per game', function() {
    card.action();
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
