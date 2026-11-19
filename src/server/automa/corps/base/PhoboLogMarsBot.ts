import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class PhoboLogMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.PHOBOLOG,
      description: 'Tag: Space. Setup: draw 2 space cards to bonus deck. White cubes on space track: resolve 1 bonus card each.',
      tags: [Tag.SPACE],
      trackCubes: [
        {trackIndex: 1, position: 7, cubeType: 'white'},
        {trackIndex: 1, position: 10, cubeType: 'white'},
        {trackIndex: 1, position: 13, cubeType: 'white'},
        {trackIndex: 1, position: 15, cubeType: 'white'},
      ],
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.addProjectCardsToBonusDeck(Tag.SPACE, 2);
    marsBot.game.log('MarsBot (${0}): 2 space cards drawn and added to bonus deck', (b) => b.cardName(this.name));
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, _trackIndex: number, _position: number, cubeType: CubeType): void {
    if (cubeType === 'white') {
      marsBot.maybeDrawAndResolveBonusCard();
      marsBot.game.log('MarsBot (${0}): white cube: resolved 1 bonus card', (b) => b.cardName(this.name));
    }
  }
}
