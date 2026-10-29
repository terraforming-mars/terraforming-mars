import {expect} from 'chai';
import {Tag} from '../../src/common/cards/Tag';
import {CardName} from '../../src/common/cards/CardName';
import {IMarsBotCorp, corpTrackCubes} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';

describe('MarsBotCorpTypes', () => {
  it('corpTrackCubes puts tag-named cubes on the track that carries the tag and drops cubes on missing tracks', () => {
    const corp: IMarsBotCorp = {
      name: CardName.ARIDOR,
      description: '',
      tags: [],
      trackCubes: [
        {trackIndex: 1, position: 3, cubeType: 'white'},
        {trackTag: Tag.JOVIAN, position: 6, cubeType: 'white'},
        {trackTag: Tag.CITY, position: 6, cubeType: 'black'},
        {trackTag: Tag.VENUS, position: 6, cubeType: 'black'},
        {trackIndex: 7, position: 3, cubeType: 'black'},
      ],
    };

    expect(corpTrackCubes(corp, new MarsBotBoard(THARSIS_MARSBOT_BOARD))).deep.eq([
      {trackIndex: 1, position: 3, cubeType: 'white'},
      {trackIndex: 4, position: 6, cubeType: 'white'},
      {trackIndex: 5, position: 6, cubeType: 'black'},
    ]);
  });
});
