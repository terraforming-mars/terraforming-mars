import {expect} from 'chai';
import {TharsisRepublic} from '../../../src/server/cards/corporation/TharsisRepublic';
import {Game} from '../../../src/server/Game';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('TharsisRepublic', function() {
  let card: TharsisRepublic;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new TharsisRepublic();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);

    player.setCorporationForTest(card);
  });

  it('Should take initial action', function() {
    const action = card.initialAction(player);
    expect(action).is.not.undefined;
    action.cb(action.availableSpaces[0]);
    runAllActions(game);

    expect(game.getCitiesOnMarsCount()).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(3);
  });

  it('Gives 3 M€ and MC production for own city on Mars', function() {
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    runAllActions(game);

    expect(player.megaCredits).to.eq(3);
    expect(player.production.megacredits).to.eq(1);
  });

  it('Gives MC production only for other player\'s city on Mars', function() {
    game.addCityTile(player2, game.board.getAvailableSpacesOnLand(player)[0].id);
    runAllActions(game);

    expect(player.megaCredits).to.eq(0);
    expect(player.production.megacredits).to.eq(1);
  });

  it('Does not give MC production for own city off Mars', function() {
    game.addTile(player, SpaceType.COLONY, game.board.spaces.find((space) => space.spaceType === SpaceType.COLONY)!, {
      tileType: TileType.CITY,
    });
    runAllActions(game);
    expect(player.production.megacredits).to.eq(0);
  });

  it('Gives 2 M€ production in solo mode', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player);
    card.play(player);
    runAllActions(game);
    expect(player.production.megacredits).to.eq(2);
  });
});
