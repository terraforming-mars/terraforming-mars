import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class MedicalLab extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MEDICAL_LAB,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 13,
      victoryPoints: 1,

      metadata: {
        cardNumber: '207',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().building(2, {played});
          });
        }),
        description: 'Increase your M€ production 1 step for every 2 Building tags you have, including this.',
      },
    });
  }

  public produce(player: Player) {
    // Include this when the card is first played, and not when it is called by Robotic Workforce.
    const includeThis = !player.cardIsInEffect(this.name);
    const tagCount = player.tags.count(Tag.BUILDING) + (includeThis ? 1 : 0);
    player.production.add(Resources.MEGACREDITS, Math.floor(tagCount / 2), {log: true});
  }
  public override bespokePlay(player: Player) {
    this.produce(player);
    return undefined;
  }
}
