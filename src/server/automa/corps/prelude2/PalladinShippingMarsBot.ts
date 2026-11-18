import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class PalladinShippingMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.PALLADIN_SHIPPING,
      description: 'Tags: Space, Event. Draft: Space > Event. Setup: +5 M€. Cubes on space and event tracks are collected; when a white and black pair is collected, temperature +1.',
      tags: [Tag.SPACE, Tag.EVENT],
      draftPriority: {type: 'tags', tags: [Tag.SPACE, Tag.EVENT]},
      trackCubes: [
        {trackIndex: 1, position: 3, cubeType: 'white'},
        {trackIndex: 1, position: 4, cubeType: 'white'},
        {trackIndex: 1, position: 6, cubeType: 'white'},
        {trackIndex: 1, position: 8, cubeType: 'white'},
        {trackIndex: 1, position: 10, cubeType: 'white'},
        {trackIndex: 1, position: 11, cubeType: 'white'},
        {trackIndex: 2, position: 3, cubeType: 'black'},
        {trackIndex: 2, position: 4, cubeType: 'black'},
        {trackIndex: 2, position: 6, cubeType: 'black'},
        {trackIndex: 2, position: 8, cubeType: 'black'},
        {trackIndex: 2, position: 10, cubeType: 'black'},
        {trackIndex: 2, position: 11, cubeType: 'black'},
      ],
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.gainMc(5);
    marsBot.game.log('MarsBot (Palladin): +5 M€');
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, _trackIndex: number, _position: number, cubeType: CubeType): void {
    // Collect cube onto card. If 2 colors present, remove pair + temp +1
    const key = cubeType === 'white' ? 'whiteCubesOnCard' : 'blackCubesOnCard';
    marsBot.setCorpState(key, marsBot.getCorpState(key) + 1);
    const white = marsBot.getCorpState('whiteCubesOnCard');
    const black = marsBot.getCorpState('blackCubesOnCard');
    if (white > 0 && black > 0) {
      marsBot.setCorpState('whiteCubesOnCard', white - 1);
      marsBot.setCorpState('blackCubesOnCard', black - 1);
      marsBot.raiseTemperature(1);
      marsBot.game.log('MarsBot (Palladin): paired cubes: temperature +1');
    } else {
      marsBot.game.log(`MarsBot (Palladin): ${cubeType} cube collected (W:${marsBot.getCorpState('whiteCubesOnCard')}, B:${marsBot.getCorpState('blackCubesOnCard')})`);
    }
  }
}
