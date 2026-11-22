import {CardName} from '@/common/cards/CardName';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class NirgalEnterprisesMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.NIRGAL_ENTERPRISES,
      description: 'Tags: Building, Power, Plant. Setup: remove Overachievement. +2 in every award. Generations 2-5 and 10+: claim milestone. Generations 6-9: fund award.',
      tags: [Tag.BUILDING, Tag.POWER, Tag.PLANT],
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.removeBonusCard(BonusCardName.OVERACHIEVEMENT);
    marsBot.game.log('MarsBot (${0}): ${1} removed from bonus deck', (b) => b.cardName(this.name).bonusCardName(BonusCardName.OVERACHIEVEMENT));
  }

  public override awardScoreBonus(): number {
    return 2;
  }

  // Gen 2-5 or 10+: claim milestone. Gen 6-9: fund award. Neither is a Failed Action when it can't.
  public override beforeActionPhase(marsBot: IMarsBot): void {
    const generation = marsBot.game.generation;
    if ((generation >= 2 && generation <= 5) || generation >= 10) {
      if (!marsBot.maybeClaimMilestone()) {
        marsBot.game.log('MarsBot (${0}): no milestone to claim', (b) => b.cardName(this.name));
      }
    } else if (generation >= 6 && generation <= 9) {
      if (!marsBot.maybeFundAward()) {
        marsBot.game.log('MarsBot (${0}): no award to fund', (b) => b.cardName(this.name));
      }
    }
  }
}
