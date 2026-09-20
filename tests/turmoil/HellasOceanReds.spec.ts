import {expect} from 'chai';
import {testGame} from '../TestGame';
import {runAllActions, setRulingParty} from '../TestingUtils';
import {BoardName} from '../../src/common/boards/BoardName';
import {SpaceName} from '../../src/common/boards/SpaceName';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {cast} from '../../src/common/utils/utils';
import * as constants from '../../src/common/constants';

// Regression coverage for https://github.com/terraforming-mars/terraforming-mars/issues/6195
describe('Hellas ocean bonus tile placement while Reds rule', () => {
  it('collects the Hellas fee before placing the bonus ocean tile', () => {
    const [game, player] = testGame(2, {boardName: BoardName.HELLAS, turmoilExtension: true});
    setRulingParty(game, PartyName.REDS);

    const hellasSpace = game.board.getSpaceOrThrow(SpaceName.HELLAS_OCEAN_TILE);

    // Enough for everything this placement actually costs: 3 M€ Reds tax for the oxygen
    // increase, 6 M€ Hellas ocean fee, and 3 M€ Reds tax for the ocean's own TR increase.
    player.megaCredits = constants.REDS_RULING_POLICY_COST + constants.HELLAS_BONUS_OCEAN_COST + constants.REDS_RULING_POLICY_COST;

    game.addGreenery(player, hellasSpace);
    runAllActions(game);

    // Oxygen-tax (3) and the Hellas fee (6) are both auto-charged before the player is
    // ever asked where to place the bonus ocean tile.
    expect(player.megaCredits).to.eq(constants.REDS_RULING_POLICY_COST);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const destination = selectSpace.spaces[0];
    expect(destination.tile, 'fee must be paid before a destination is offered').is.undefined;

    selectSpace.cb(destination);
    runAllActions(game);

    expect(destination.tile).is.not.undefined;
    expect(player.megaCredits).to.eq(0);
  });

  it('blocks the ocean placement instead of corrupting state when funds run out', () => {
    const [game, player] = testGame(2, {boardName: BoardName.HELLAS, turmoilExtension: true});
    setRulingParty(game, PartyName.REDS);

    const hellasSpace = game.board.getSpaceOrThrow(SpaceName.HELLAS_OCEAN_TILE);

    // One short of the Hellas fee once the oxygen-increase Reds tax (3) is auto-charged
    // first: the pre-filter for this space doesn't budget for that tax at all, only for
    // the fee itself and the ocean's own TR tax, so a player can arrive here already short.
    player.megaCredits = constants.REDS_RULING_POLICY_COST + constants.HELLAS_BONUS_OCEAN_COST - 1;

    game.addGreenery(player, hellasSpace);

    let thrown: Error | undefined;
    try {
      runAllActions(game);
    } catch (e) {
      thrown = e as Error;
    }

    // The fee payment fails before any ocean space is ever offered or placed, so the
    // board is left untouched instead of holding a tile nobody paid for.
    expect(thrown?.message).to.eq(`Player does not have ${constants.HELLAS_BONUS_OCEAN_COST} M€`);
    cast(player.getWaitingFor(), undefined);
    expect(game.board.getOceanSpaces().length).to.eq(0);
  });
});
