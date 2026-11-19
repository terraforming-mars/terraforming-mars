import {TileType} from '@/common/TileType';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {addBonusCardBeforeActionPhase} from '@/server/automa/corps/corpHelpers';
import {Space} from '@/server/boards/Space';

export class ArcadianCommunitiesMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.ARCADIAN_COMMUNITIES,
      description: 'Tag: Building. Setup: resolve Settlers immediately. Each generation: add Settlers to action deck. ' +
        'Spaces with its player markers are reserved for it. Each tile it places on one of them earns 3 M€.',
      tags: [Tag.BUILDING],
      actionDeckBonusCard: BonusCardId.B22_SETTLERS,
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.resolveBonusCard(BonusCardId.B22_SETTLERS);
  }

  public override onTilePlaced(marsBot: IMarsBot, placedByMarsBot: boolean, _tileType: TileType, space: Space): void {
    if (placedByMarsBot && marsBot.removeMarker(space)) {
      marsBot.gainMc(3);
      marsBot.game.log('MarsBot (${0}): tile on its player marker, +3:r:mc:', (b) => b.cardName(this.name));
    }
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    addBonusCardBeforeActionPhase(marsBot, BonusCardId.B22_SETTLERS, this.name);
  }
}
