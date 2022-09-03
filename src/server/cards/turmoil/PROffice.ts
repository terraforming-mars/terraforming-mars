import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resources} from '../../../common/Resources';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class PROffice extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PR_OFFICE,
      tags: [Tag.EARTH],
      cost: 7,
      tr: {tr: 1},

      requirements: CardRequirements.builder((b) => b.party(PartyName.UNITY)),
      metadata: {
        cardNumber: 'T09',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).br;
          b.megacredits(1).slash().earth(1, {played});
        }),
        description: 'Requires that Unity are ruling or that you have 2 delegates there. Gain 1 TR. Gain 1 M€ for each Earth tag you have, including this.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.increaseTerraformRating();
    const amount = player.tags.count(Tag.EARTH) + 1;
    player.addResource(Resources.MEGACREDITS, amount);
    return undefined;
  }
}
