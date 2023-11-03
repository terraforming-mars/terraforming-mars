import {expect} from 'chai';
import {CaveCity} from '../../../src/server/cards/underworld/CaveCity';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('CaveCity', () => {
  it('canPlay', () => {
    const card = new CaveCity();
    const [/* game */, player, player2] = testGame(2);

    expect(card.canPlay(player)).is.false;

    const space = player.game.board.getAvailableSpacesForCity(player)[0];
    space.excavator = player;

    expect(card.canPlay(player)).is.true;

    space.excavator = player2;

    expect(card.canPlay(player)).is.false;
    expect(card.canPlay(player2)).is.true;

    space.tile = {tileType: TileType.GREAT_DAM};

    expect(card.canPlay(player2)).is.false;
  });

  it('play', () => {
    const card = new CaveCity();
    const [/* game */, player] = testGame(2);

    const [space1, space2] = player.game.board.getAvailableSpacesForCity(player);
    space1.excavator = player;
    space2.excavator = player;

    const selectSpace = cast(card.play(player), SelectSpace);

    expect(selectSpace.spaces).to.have.members([space1, space2]);

    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);

    expect(player.production.megacredits).eq(1);
  });
});
