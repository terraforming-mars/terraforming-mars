import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {whiteTrackCubes} from '@/server/automa/corps/corpHelpers';

export class TeractorMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.TERACTOR,
      description: 'Draft: Earth. Setup: +25 M€, white cubes on Earth track. Each Earth track advance earns 2 M€.',
      draftPriority: {type: 'tags', tags: [Tag.EARTH]},
      trackCubes: whiteTrackCubes(5),
      trackCubesTriggerEveryAdvance: true,
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.gainMc(25);
    marsBot.game.log('MarsBot (${0}): +25:r:mc:', (b) => b.cardName(this.name));
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, trackIndex: number, _position: number, cubeType: CubeType): void {
    if (cubeType === 'white' && trackIndex === 5) {
      marsBot.gainMc(2);
      marsBot.game.log('MarsBot (${0}): Earth track advance, +2:r:mc:', (b) => b.cardName(this.name));
    }
  }
}
