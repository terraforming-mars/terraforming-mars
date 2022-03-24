import {expect} from 'chai';
import {Flooding} from '../../../src/cards/base/Flooding';
import {LandClaim} from '../../../src/cards/base/LandClaim';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Flooding', function() {
  let card : Flooding; let player : TestPlayer; let player2 : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new Flooding();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    const oceans = game.board.getAvailableSpacesForOcean(player);
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    expect(action!.cb(oceans[0])).is.undefined;
    const adjacentSpaces = game.board.getAdjacentSpaces(oceans[0]);
    oceans[0].tile = undefined;
    for (let i = 0; i < adjacentSpaces.length; i++) {
      if (adjacentSpaces[i].spaceType === SpaceType.LAND) {
        game.addGreenery(player2, adjacentSpaces[i].id);
        break;
      }
    }

    const subAction: OrOptions = action!.cb(oceans[0]) as OrOptions;
    expect(subAction instanceof OrOptions).is.true;
    expect(subAction!.options).has.lengthOf(2);
    expect(subAction!.options[1].cb()).is.undefined;
    const subActionSelectPlayer: SelectPlayer = subAction!.options[0] as SelectPlayer;
    expect(subActionSelectPlayer.players).has.lengthOf(1);
    expect(subActionSelectPlayer.players[0]).to.eq(player2);

    player2.megaCredits = 4;
    subActionSelectPlayer.cb(player2);
    expect(player2.megaCredits).to.eq(0);

    expect(card.getVictoryPoints()).to.eq(-1);
  });

  it('Does not suggest to remove money from yourself', function() {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    const action = card.play(player);

    game.addGreenery(player, '03');
    game.addGreenery(player2, '05');

    expect(action).instanceOf(SelectSpace);
    const subActions: OrOptions = action!.cb(oceanSpaces[0]) as OrOptions;
    expect(subActions.options).has.lengthOf(2);

    const subActionSelectPlayer: SelectPlayer = subActions.options[0] as SelectPlayer;
    expect(subActionSelectPlayer.players).has.lengthOf(1);
    expect(subActionSelectPlayer.players[0]).to.eq(player2);
  });

  it('Does not suggest player who played Land Claim', function() {
    const landClaim = new LandClaim();
    const landClaimAction = landClaim.play(player2);
    const adjacentSpace = game.board.getAvailableSpacesOnLand(player).filter((space) => space.id === '03')[0];

    landClaimAction.cb(adjacentSpace);
    expect(adjacentSpace.player).to.eq(player2);
    expect(adjacentSpace.tile).is.undefined;

    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    const action = card.play(player) as SelectSpace;
    expect(action.cb(oceanSpaces[0])).is.undefined;
  });

  it('Does not suggest to remove money if oceans are already maxed', function() {
    TestingUtils.maxOutOceans(player);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
  });
});
