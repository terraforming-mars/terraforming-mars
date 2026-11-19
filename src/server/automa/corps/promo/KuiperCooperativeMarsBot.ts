import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class KuiperCooperativeMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.KUIPER_COOPERATIVE,
      description: 'Tag: Space. Draft: Space. White and black cubes on space track. White: temperature +1. Black: place ocean.',
      tags: [Tag.SPACE],
      draftPriority: {type: 'tags', tags: [Tag.SPACE]},
      trackCubes: [
        {trackIndex: 1, position: 4, cubeType: 'white'},
        {trackIndex: 1, position: 8, cubeType: 'white'},
        {trackIndex: 1, position: 12, cubeType: 'white'},
        {trackIndex: 1, position: 7, cubeType: 'black'},
        {trackIndex: 1, position: 10, cubeType: 'black'},
        {trackIndex: 1, position: 14, cubeType: 'black'},
      ],
    });
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, _trackIndex: number, _position: number, cubeType: CubeType): void {
    if (cubeType === 'white') {
      marsBot.raiseTemperature(1);
      marsBot.game.log('MarsBot (${0}): white cube: temperature +1', (b) => b.cardName(this.name));
    } else if (cubeType === 'black') {
      marsBot.placeOcean();
      marsBot.game.log('MarsBot (${0}): black cube: place ocean', (b) => b.cardName(this.name));
    }
  }
}
