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

export class ParliamentHall extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PARLIAMENT_HALL,
      tags: [Tag.BUILDING],
      cost: 8,
      requirements: CardRequirements.builder((b) => b.party(PartyName.MARS)),
      victoryPoints: 1,

      metadata: {
        cardNumber: 'T08',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().building(3, {played});
          });
        }),
        description: 'Requires that Mars First are ruling or that you have 2 delegates there. Increase your M€ production 1 step for every 3 Building tags you have, including this.',
      },
    });
  }

  public produce(player: Player) {
    // Include this when the card is first played, and not when it is called by Robotic Workforce.
    const includeThis = !player.cardIsInEffect(this.name);
    const tagCount = player.tags.count(Tag.BUILDING) + (includeThis ? 1 : 0);
    const amount = Math.floor(tagCount / 3);
    player.production.add(Resources.MEGACREDITS, amount, {log: true});
  }

  public override bespokePlay(player: Player) {
    this.produce(player);
    return undefined;
  }
}
