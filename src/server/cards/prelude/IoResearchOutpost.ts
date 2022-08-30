import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard2} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class IoResearchOutpost extends PreludeCard2 {
  constructor() {
    super({
      name: CardName.IO_RESEARCH_OUTPOST,
      tags: [Tag.JOVIAN, Tag.SCIENCE],
      productionBox: {titanium: 1},

      metadata: {
        cardNumber: 'P16',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).br;
          b.cards(1);
        }),
        description: 'Increase your titanium production 1 step. Draw a card.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.drawCard();
    return undefined;
  }
}
