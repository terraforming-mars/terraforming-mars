import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Purifier} from '../../src/server/milestones/Purifier';
import {Eris} from '../../src/server/cards/community/Eris';
import {cast} from '../TestingUtils';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';

describe('Purifier', () => {
  it('On hazard', () => {
    const purifier = new Purifier();
    const [game, player] = testGame(3, {aresExtension: true, aresHazards: true});
    const hazards = game.board.getHazards();
    expect(hazards).has.length(3);

    // Needed for placing on top of mild hazards
    player.megaCredits = 24;

    expect(purifier.getScore(player)).eq(0);

    game.addGreenery(player, hazards[0]);

    expect(purifier.getScore(player)).eq(1);

    game.addGreenery(player, hazards[1]);

    expect(purifier.getScore(player)).eq(2);
    expect(purifier.canClaim(player)).is.false;

    game.addGreenery(player, hazards[2]);

    expect(purifier.getScore(player)).eq(3);
    expect(purifier.canClaim(player)).is.true;
  });

  it('Applies to Eris', () => {
    const purifier = new Purifier();
    const [/* game */, player] = testGame(3, {aresExtension: true, aresHazards: true});

    const eris = new Eris();
    const action = cast(eris.action(player), OrOptions);

    expect(purifier.getScore(player)).eq(0);

    // Remove a hazard tile to gain 1 TR
    const removeHazard = cast(action.options[1].cb(), SelectSpace);
    removeHazard.cb(removeHazard.spaces[0]);
    expect(removeHazard.spaces[0].tile).is.undefined;

    expect(purifier.getScore(player)).eq(1);
  });
});
