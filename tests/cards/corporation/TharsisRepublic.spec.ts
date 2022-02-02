import {expect} from 'chai';
import {TharsisRepublic} from '../../../src/cards/corporation/TharsisRepublic';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('TharsisRepublic', function() {
  let card : TharsisRepublic; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new TharsisRepublic();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);

    player.corporationCard = card;
  });

  it('Should take initial action', function() {
    const action = card.initialAction(player);
    expect(action).is.not.undefined;
    action.cb(action.availableSpaces[0]);
    TestingUtils.runAllActions(game);

    expect(game.getCitiesOnMarsCount()).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.megaCredits).to.eq(3);
  });

  it('Gives 3 M€ and MC production for own city on Mars', function() {
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    TestingUtils.runAllActions(game);

    expect(player.megaCredits).to.eq(3);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });

  it('Gives MC production only for other player\'s city on Mars', function() {
    game.addCityTile(player2, game.board.getAvailableSpacesOnLand(player)[0].id);
    TestingUtils.runAllActions(game);

    expect(player.megaCredits).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });

  it('Does not give MC production for own city off Mars', function() {
    game.addTile(player, SpaceType.COLONY, game.board.spaces.find((space) => space.spaceType === SpaceType.COLONY)!, {
      tileType: TileType.CITY,
    });
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);
  });

  it('Gives 2 M€ production in solo mode', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
    card.play(player);
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
