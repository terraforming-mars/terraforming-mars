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

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, Math.floor((player.getTagCount(Tags.BUILDING) + 1) / 2));
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
