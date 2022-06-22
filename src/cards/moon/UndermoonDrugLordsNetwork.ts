import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../common/Resources';
import {Card} from '../Card';

export class UndermoonDrugLordsNetwork extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.UNDERMOON_DRUG_LORDS_NETWORK,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON],
      cost: 2,
      victoryPoints: -1,

      metadata: {
        description: 'Increase your M€ production 1 step per 2 steps of Colony Rate.',
        cardNumber: 'M81',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1);
          }).slash().moonColonyRate({amount: 2});
        }),
      },
    });
  }

  public play(player: Player) {
    const gain = Math.floor(MoonExpansion.moonData(player.game).colonyRate / 2);
    player.addProduction(Resources.MEGACREDITS, gain, {log: true});
    return undefined;
  }
}
