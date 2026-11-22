import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class ValleyTrustMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.VALLEY_TRUST,
      description: 'Draft: Science. Setup: draw 1 card. White cubes on science track: draw and resolve a card each.',
      requiredExpansions: ['prelude'],
      draftPriority: {type: 'tags', tags: [Tag.SCIENCE]},
      trackCubes: [
        {trackIndex: 3, position: 8, cubeType: 'white'},
        {trackIndex: 3, position: 16, cubeType: 'white'},
      ],
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.drawProjectCardsToActionDeck(1);
    marsBot.game.log('MarsBot (${0}): drew 1 card', (b) => b.cardName(this.name));
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, _trackIndex: number, _position: number, cubeType: CubeType): void {
    if (cubeType === 'white') {
      marsBot.maybeDrawAndResolveProjectCard();
      marsBot.game.log('MarsBot (${0}): white cube: drew and resolved 1 card', (b) => b.cardName(this.name));
    }
  }
}
