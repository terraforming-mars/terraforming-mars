import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class ImportedNitrogen extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.IMPORTED_NITROGEN,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 23,
      tr: {tr: 1},

      behavior: {
        stock: {plants: 4},
      },

      metadata: {
        cardNumber: '163',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).br;
          b.plants(4, {digit});
          b.microbes(3, {digit}).asterix().nbsp;
          b.animals(2, {digit}).asterix();
        }),
        description: 'Raise your TR 1 step and gain 4 Plants. Add 3 Microbes to ANOTHER card and 2 Animals to ANOTHER card.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.increaseTerraformRating();
    player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 3}));
    player.game.defer(new AddResourcesToCard(player, CardResource.ANIMAL, {count: 2}));
    return undefined;
  }
}
