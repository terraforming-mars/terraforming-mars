import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class ParliamentHall extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PARLIAMENT_HALL,
      tags: [Tags.BUILDING],
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
    const tagCount = player.getTagCount(Tags.BUILDING) + (includeThis ? 1 : 0);
    const amount = Math.floor(tagCount / 3);
    player.addProduction(Resources.MEGACREDITS, amount, {log: true});
  }

  public play(player: Player) {
    this.produce(player);
    return undefined;
  }
}
