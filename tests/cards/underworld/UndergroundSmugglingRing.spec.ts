import {expect} from 'chai';
import {UndergroundSmugglingRing} from '../../../src/server/cards/underworld/UndergroundSmugglingRing';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';
import {SelectResource} from '../../../src/server/inputs/SelectResource';
import {Units} from '../../../src/common/Units';

describe('UndergroundSmugglingRing', () => {
  it('canPlay', () => {
    const card = new UndergroundSmugglingRing();
    const [/* game */, player] = testGame(1, {underworldExpansion: true});

    expect(card.canPlay(player)).is.false;

    UnderworldExpansion.excavatableSpaces(player)[0].excavator = player;

    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const card = new UndergroundSmugglingRing();
    const [game, player] = testGame(1, {underworldExpansion: true});

    player.underworldData.corruption = 0;

    cast(card.play(player), undefined);

    expect(player.underworldData.corruption).to.eq(1);

    runAllActions(game);
    const selectResource = cast(player.popWaitingFor(), SelectResource);
    expect(selectResource.include).to.have.members(Units.keys);
    selectResource.options[0].cb(0);
    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });
});
