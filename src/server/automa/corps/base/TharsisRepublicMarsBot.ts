import {TileType} from '@/common/TileType';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class TharsisRepublicMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.THARSIS_REPUBLIC,
      description: 'Draft: City. Setup: place 1 city. When you place a city, MarsBot gains 2 M€. When MarsBot places a city (setup included), advance its event track.',
      draftPriority: {type: 'tags', tags: [Tag.CITY]},
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.placeCity();
    marsBot.game.log('MarsBot (Tharsis Republic): placed 1 city tile');
  }

  public override onTilePlaced(marsBot: IMarsBot, placedByMarsBot: boolean, tileType: TileType): void {
    if (tileType === TileType.CITY || tileType === TileType.CAPITAL) {
      if (placedByMarsBot) {
        marsBot.advanceTrack(2); // Event track = index 2
        marsBot.game.log('MarsBot (Tharsis Republic): MarsBot city, advance event track');
      } else {
        marsBot.gainMc(2);
        marsBot.game.log('MarsBot (Tharsis Republic): player city placed, +2 M€');
      }
    }
  }
}
