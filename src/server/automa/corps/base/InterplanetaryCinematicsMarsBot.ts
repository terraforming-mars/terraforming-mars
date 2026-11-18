import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {whiteTrackCubes} from '@/server/automa/corps/BaseGameCorps';

export class InterplanetaryCinematicsMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.INTERPLANETARY_CINEMATICS,
      description: 'Tags: 2 Events. White cubes on building and event tracks. Each advance on those tracks, starting tags included, earns 2 M€.',
      tags: [Tag.EVENT, Tag.EVENT],
      trackCubes: [...whiteTrackCubes(0), ...whiteTrackCubes(2)],
      trackCubesTriggerEveryAdvance: true,
    });
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, trackIndex: number, _position: number, cubeType: CubeType): void {
    if (cubeType === 'white' && (trackIndex === 0 || trackIndex === 2)) {
      marsBot.gainMc(2);
      marsBot.game.log('MarsBot (IC): advance on building/event track, +2 M€');
    }
  }
}
