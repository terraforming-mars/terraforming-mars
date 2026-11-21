import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {addRandomColonyTile} from '@/server/automa/colonies/MarsBotColonyPlacer';

export class AridorMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.ARIDOR,
      description: 'Draft: tags on the least-advanced track, each counting alike. Setup: add 1 colony tile to the game. White and black cubes across multiple tracks; each cube advances event track.',
      requiredExpansions: ['colonies'],
      draftPriority: {type: 'leastAdvancedTrack'},
      // The card names the Jovian and city tracks, which sit on different rows from board to board
      trackCubes: [
        {trackIndex: 0, position: 3, cubeType: 'white'},
        {trackIndex: 1, position: 3, cubeType: 'white'},
        {trackIndex: 3, position: 3, cubeType: 'white'},
        {trackIndex: 4, position: 3, cubeType: 'white'},
        {trackTag: Tag.JOVIAN, position: 6, cubeType: 'white'},
        {trackIndex: 5, position: 3, cubeType: 'black'},
        {trackTag: Tag.CITY, position: 6, cubeType: 'black'},
        {trackIndex: 6, position: 3, cubeType: 'black'},
        {trackIndex: 6, position: 6, cubeType: 'black'},
      ],
    });
  }

  public override setup(marsBot: IMarsBot): void {
    if (addRandomColonyTile(marsBot.game) === undefined) {
      marsBot.game.log('MarsBot (${0}): no colony tile left to add', (b) => b.cardName(this.name));
    }
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot): void {
    marsBot.advanceTrack(2); // Event track = index 2
    marsBot.game.log('MarsBot (${0}): cube reached: advance event track', (b) => b.cardName(this.name));
  }
}
