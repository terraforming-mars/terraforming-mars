import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class HelionMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.HELION,
      description: 'White cubes: draw and resolve a card instead of raising temperature. Black cubes: temperature +1.',
      trackCubes: [
        {trackIndex: 0, position: 6, cubeType: 'white'},
        {trackIndex: 1, position: 9, cubeType: 'white'},
        {trackIndex: 3, position: 10, cubeType: 'white'},
        {trackIndex: 4, position: 5, cubeType: 'white'},
        {trackIndex: 4, position: 9, cubeType: 'white'},
        {trackIndex: 6, position: 11, cubeType: 'white'},
        {trackIndex: 5, position: 3, cubeType: 'black'},
        {trackIndex: 5, position: 6, cubeType: 'black'},
        {trackIndex: 5, position: 9, cubeType: 'black'},
        {trackIndex: 5, position: 12, cubeType: 'black'},
        {trackIndex: 5, position: 13, cubeType: 'black'},
        {trackIndex: 5, position: 14, cubeType: 'black'},
      ],
    });
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, trackIndex: number, position: number, cubeType: CubeType): boolean {
    if (cubeType === 'white') {
      marsBot.maybeDrawAndResolveProjectCard();
      marsBot.game.log('MarsBot (Helion): white cube: drew and resolved card instead of temp raise');
      // A white cube on another icon (the Nova boards' cities) replaces nothing, so that icon resolves too.
      return marsBot.marsBotBoard.tracks[trackIndex].definition.layout[position] === 'temperature';
    }
    if (cubeType === 'black') {
      marsBot.raiseTemperature(1);
      marsBot.game.log('MarsBot (Helion): black cube: temperature +1');
    }
    return false;
  }
}
