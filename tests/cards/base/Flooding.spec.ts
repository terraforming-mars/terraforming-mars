import {expect} from 'chai';
import {Flooding} from '../../../src/server/cards/base/Flooding';
import {LandClaim} from '../../../src/server/cards/base/LandClaim';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {addGreenery, cast, maxOutOceans, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Flooding', () => {
  let card: Flooding;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Flooding();
    [game, player, player2] = testGame(2);
  });

  it('Should play', () => {
    const oceans = game.board.getAvailableSpacesForOcean(player);
    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace.cb(oceans[0])).is.undefined;
    const adjacentSpaces = game.board.getAdjacentSpaces(oceans[0]);
    oceans[0].tile = undefined;
    for (const adjacentSpace of adjacentSpaces) {
      if (adjacentSpace.spaceType === SpaceType.LAND) {
        game.addGreenery(player2, adjacentSpace);
        break;
      }
    }

    cast(selectSpace.cb(oceans[0]), undefined);
    runAllActions(game);
    const subAction = cast(player.popWaitingFor(), OrOptions);
    expect(subAction.options).has.lengthOf(2);
    expect(subAction.options[1].cb()).is.undefined;
    const subActionSelectPlayer = cast(subAction.options[0], SelectPlayer);
    expect(subActionSelectPlayer.players).has.lengthOf(1);
    expect(subActionSelectPlayer.players[0]).to.eq(player2);

    player2.megaCredits = 4;
    subActionSelectPlayer.cb(player2);
    expect(player2.megaCredits).to.eq(0);

    expect(card.getVictoryPoints(player)).to.eq(-1);
  });

  it('Does not suggest to remove money from yourself', () => {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    addGreenery(player, '03');
    addGreenery(player2, '05');

    cast(selectSpace.cb(oceanSpaces[0]), undefined);
    runAllActions(game);
    const subAction = cast(player.popWaitingFor(), OrOptions);
    expect(subAction.options).has.lengthOf(2);

    const subActionSelectPlayer = cast(subAction.options[0], SelectPlayer);
    expect(subActionSelectPlayer.players).has.lengthOf(1);
    expect(subActionSelectPlayer.players[0]).to.eq(player2);
  });

  it('Does not suggest player who played Land Claim', () => {
    const landClaim = new LandClaim();
    const landClaimAction = cast(landClaim.play(player2), SelectSpace);
    const adjacentSpace = game.board.getAvailableSpacesOnLand(player).filter((space) => space.id === '03')[0];

    landClaimAction.cb(adjacentSpace);
    expect(adjacentSpace.player).to.eq(player2);
    expect(adjacentSpace.tile).is.undefined;

    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    expect(selectSpace.cb(oceanSpaces[0])).is.undefined;
  });

  it('Does not suggest to remove money if oceans are already maxed', () => {
    maxOutOceans(player);
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
  });
});
