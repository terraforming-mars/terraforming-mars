import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class MedicalLab extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MEDICAL_LAB,
      tags: [Tags.SCIENCE, Tags.BUILDING],
      cost: 13,

      metadata: {
        cardNumber: '207',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().building(2).played;
          });
        }),
        description: 'Increase your M€ production 1 step for every 2 Building tags you have, including this.',
        victoryPoints: 1,
      },
    });
  }

  public produce(player: Player) {
    // Include this when the card is first played, and not when it is called by Robotic Workforce.
    const includeThis = !player.cardIsInEffect(this.name);
    const tagCount = player.getTagCount(Tags.BUILDING) + (includeThis ? 1 : 0);
    player.addProduction(Resources.MEGACREDITS, Math.floor(tagCount / 2));
  }
  public play(player: Player) {
    this.produce(player);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
