import {expect} from 'chai';
import {SubterraneanSea} from '../../../src/server/cards/underworld/SubterraneanSea';
import {testGame} from '../../TestGame';
import {cast, maxOutOceans} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('SubterraneanSea', () => {
  it('canPlay', () => {
    const card = new SubterraneanSea();
    const [game, player] = testGame(2, {underworldExpansion: true});

    expect(card.canPlay(player)).is.false;

    const spaces = game.board.getAvailableSpacesOnLand(player);
    spaces[0].excavator = player;
    expect(card.canPlay(player)).is.true;

    spaces[0].tile = {tileType: TileType.BIOFERTILIZER_FACILITY};
    expect(card.canPlay(player)).is.false;

    game.board.getAvailableSpacesForOcean(player)[0].excavator = player;
    expect(card.canPlay(player)).is.false;

    spaces[1].excavator = player;
    expect(card.canPlay(player)).is.true;

    maxOutOceans(player);
    expect(card.canPlay(player)).is.false;
  });

  it('play', () => {
    const card = new SubterraneanSea();
    const [game, player] = testGame(2, {underworldExpansion: true});

    const spaces = game.board.getAvailableSpacesOnLand(player);
    spaces[0].excavator = player;
    spaces[1].excavator = player;

    const selectSpace = cast(card.play(player), SelectSpace);
    expect(selectSpace.spaces).deep.eq([spaces[0], spaces[1]]);
    const selectedSpace = spaces[1];
    selectSpace.cb(selectedSpace);

    expect(selectedSpace.tile?.tileType).eq(TileType.OCEAN);
  });
});
