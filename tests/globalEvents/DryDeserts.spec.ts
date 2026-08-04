import {expect} from 'chai';
import {DryDeserts} from '../../src/server/turmoil/globalEvents/DryDeserts';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {addOcean, maxOutOceans, runAllActions, testGame} from '../TestingUtils';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {GainResources} from '../../src/server/inputs/GainResources';
import {IGame} from '../../src/server/IGame';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';
import {cast} from '../../src/common/utils/utils';

describe('DryDeserts', () => {
  let card: DryDeserts;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new DryDeserts();
    [game, player, player2] = testGame(2, {turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('first player removes an ocean', () => {
    const space = addOcean(player2);
    const space2 = addOcean(player2);

    card.resolve(game);
    runAllActions(game);

    // The first player chooses, even though the opponent placed the ocean.
    expect(game.first).eq(player);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    selectSpace.cb(space);
    expect(space.tile).is.undefined;
    expect(player.popWaitingFor()).is.undefined;
    expect(player2.popWaitingFor()).is.undefined;
    expect(game.board.getOceanSpaces()).deep.eq([space2]);
  });

  it('does nothing when there are no oceans', () => {
    card.resolve(game);
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(player2.popWaitingFor()).is.undefined;
  });

  it('does nothing when oceans are maxed out', () => {
    maxOutOceans(player);

    card.resolve(game);
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(player2.popWaitingFor()).is.undefined;
  });

  it('gain one standard resource per influence', () => {
    const space = addOcean(player);
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    expect(turmoil.getInfluence(player)).eq(0);
    expect(turmoil.getInfluence(player2)).eq(3);

    card.resolve(game);
    runAllActions(game);

    // Player has no influence, so is only asked to remove the ocean.
    const [selectSpace, cb] = player.popWaitingFor2();
    cast(selectSpace, SelectSpace).cb(space);
    cb?.();

    const gainResources = cast(player2.popWaitingFor(), GainResources);
    gainResources.options[0].cb(3);
    gainResources.cb(undefined);

    expect(player2.megaCredits).eq(3);
    expect(player.megaCredits).eq(0);
  });
});
