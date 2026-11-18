import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {SILVER_CUBE_MC} from '@/server/automa/corps/BaseGameCorps';

export class CheungShingMARSMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.CHEUNG_SHING_MARS,
      description: 'Tag: Building. Draft: Building. Silver resource cubes on building track from position 4; each earns 5 M€.',
      tags: [Tag.BUILDING],
      draftPriority: {type: 'tags', tags: [Tag.BUILDING]},
      // Silver resource cubes at positions 4-18 on the building track
      trackCubes: Array.from({length: 15}, (_, i) => ({trackIndex: 0, position: i + 4, cubeType: 'credit' as const})),
    });
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, _trackIndex: number, _position: number, cubeType: CubeType): void {
    if (cubeType === 'credit') {
      marsBot.gainMc(SILVER_CUBE_MC);
      marsBot.game.log('MarsBot (Cheung Shing): silver resource cube reached, +5 M€');
    }
  }
}
