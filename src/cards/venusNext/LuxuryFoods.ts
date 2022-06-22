import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class LuxuryFoods extends Card {
  constructor() {
    super({
      name: CardName.LUXURY_FOODS,
      cardType: CardType.AUTOMATED,
      cost: 8,

      victoryPoints: 2,

      requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS).tag(Tags.EARTH).tag(Tags.JOVIAN)),
      metadata: {
        description: 'Requires that you have a Venus tag, an Earth tag and a Jovian tag.',
        cardNumber: 'T10',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    return player.checkMultipleTagPresence([Tags.VENUS, Tags.EARTH, Tags.JOVIAN]);
  }

  public play() {
    return undefined;
  }
}
