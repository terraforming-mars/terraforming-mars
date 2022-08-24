import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class IoResearchOutpost extends PreludeCard {
  constructor() {
    super({
      name: CardName.IO_RESEARCH_OUTPOST,
      tags: [Tag.JOVIAN, Tag.SCIENCE],

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
  public play(player: Player) {
    player.production.add(Resources.TITANIUM, 1);
    player.drawCard();
    return undefined;
  }
}
