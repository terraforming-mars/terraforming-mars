import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class ThorgateMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.THORGATE,
      description: 'Tag: Power. Draft: Power. Setup: +10 M€, white cubes on energy track. White cube: draw a project card and resolve only its first tag, then raise temperature 1 step.',
      tags: [Tag.POWER],
      draftPriority: {type: 'tags', tags: [Tag.POWER]},
      trackCubes: [
        {trackIndex: 4, position: 4, cubeType: 'white'},
        {trackIndex: 4, position: 6, cubeType: 'white'},
        {trackIndex: 4, position: 8, cubeType: 'white'},
        {trackIndex: 4, position: 10, cubeType: 'white'},
      ],
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.gainMc(10);
    marsBot.game.log('MarsBot (${0}): +10:r:mc:', (b) => b.cardName(this.name));
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, _trackIndex: number, _position: number, cubeType: CubeType): void {
    if (cubeType === 'white') {
      marsBot.maybeDrawAndResolveProjectCardFirstTagOnly();
      marsBot.raiseTemperature(1);
      marsBot.game.log('MarsBot (${0}): white cube: resolved card (first tag only) + temp +1', (b) => b.cardName(this.name));
    }
  }
}
