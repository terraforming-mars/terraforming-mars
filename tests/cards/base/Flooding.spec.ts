import {expect} from 'chai';
import {Flooding} from '../../../src/server/cards/base/Flooding';
import {LandClaim} from '../../../src/server/cards/base/LandClaim';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {cast, maxOutOceans} from '../../TestingUtils';

describe('Flooding', function() {
  let card: Flooding;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Flooding();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Should play', function() {
    const oceans = game.board.getAvailableSpacesForOcean(player);
    const action = cast(card.play(player), SelectSpace);

    expect(action.cb(oceans[0])).is.undefined;
    const adjacentSpaces = game.board.getAdjacentSpaces(oceans[0]);
    oceans[0].tile = undefined;
    for (const adjacentSpace of adjacentSpaces) {
      if (adjacentSpace.spaceType === SpaceType.LAND) {
        game.addGreenery(player2, adjacentSpace.id);
        break;
      }
    }

    const subAction = cast(action.cb(oceans[0]), OrOptions);
    expect(subAction.options).has.lengthOf(2);
    expect(subAction.options[1].cb()).is.undefined;
    const subActionSelectPlayer = cast(subAction.options[0], SelectPlayer);
    expect(subActionSelectPlayer.players).has.lengthOf(1);
    expect(subActionSelectPlayer.players[0]).to.eq(player2);

    player2.megaCredits = 4;
    subActionSelectPlayer.cb(player2);
    expect(player2.megaCredits).to.eq(0);

    expect(card.getVictoryPoints()).to.eq(-1);
  });

  it('Does not suggest to remove money from yourself', function() {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    const action = cast(card.play(player), SelectSpace);

    game.addGreenery(player, '03');
    game.addGreenery(player2, '05');

    const subAction = cast(action.cb(oceanSpaces[0]), OrOptions);
    expect(subAction.options).has.lengthOf(2);

    const subActionSelectPlayer = cast(subAction.options[0], SelectPlayer);
    expect(subActionSelectPlayer.players).has.lengthOf(1);
    expect(subActionSelectPlayer.players[0]).to.eq(player2);
  });

  it('Does not suggest player who played Land Claim', function() {
    const landClaim = new LandClaim();
    const landClaimAction = cast(landClaim.play(player2), SelectSpace);
    const adjacentSpace = game.board.getAvailableSpacesOnLand(player).filter((space) => space.id === '03')[0];

    landClaimAction.cb(adjacentSpace);
    expect(adjacentSpace.player).to.eq(player2);
    expect(adjacentSpace.tile).is.undefined;

    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    const action = cast(card.play(player), SelectSpace);
    expect(action.cb(oceanSpaces[0])).is.undefined;
  });

  it('Does not suggest to remove money if oceans are already maxed', function() {
    maxOutOceans(player);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
  });
});
