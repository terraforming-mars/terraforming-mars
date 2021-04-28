import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {Card} from '../Card';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRenderer} from '../render/CardRenderer';

export class JovianEmbassy extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.JOVIAN_EMBASSY,
      tags: [Tags.JOVIAN, Tags.BUILDING],
      cost: 14,

      metadata: {
        cardNumber: 'X23',
        renderData: CardRenderer.builder((b) => {
          b.tr(1);
        }),
        description: 'Raise your TR 1 step.',
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, {steel: true});
    }

    return true;
  }

  public play(player: Player) {
    player.increaseTerraformRating();
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
