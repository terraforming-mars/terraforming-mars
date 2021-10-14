import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class ImportedNitrogen extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.IMPORTED_NITROGEN,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 23,
      tr: {tr: 1},

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

  public play(player: Player) {
    player.plants += 4;
    player.increaseTerraformRating();
    player.game.defer(new AddResourcesToCard(player, ResourceType.MICROBE, {count: 3}));
    player.game.defer(new AddResourcesToCard(player, ResourceType.ANIMAL, {count: 2}));
    return undefined;
  }
}
