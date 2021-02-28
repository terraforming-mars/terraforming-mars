import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../Resources';
import {Card} from '../Card';

export class UndermoonDrugLordsNetwork extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.UNDERMOON_DRUG_LORDS_NETWORK,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON],
      cost: 2,

      metadata: {
        description: 'Increase your MC production 1 step per each 2 Colony Rate.',
        cardNumber: 'M81',
        victoryPoints: -1,
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1);
          }).slash().moonColonyRate({amount: 2});
        }),
      },
    });
  };

  public canPlay(): boolean {
    return true;
  }

  public play(player: Player) {
    const gain = Math.floor(MoonExpansion.moonData(player.game).colonyRate / 2);
    player.addProduction(Resources.MEGACREDITS, gain);
    return undefined;
  }

  public getVictoryPoints() {
    return -1;
  }
}
