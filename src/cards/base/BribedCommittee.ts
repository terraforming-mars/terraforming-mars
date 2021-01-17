import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRenderer} from '../render/CardRenderer';

export class BribedCommittee extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.BRIBED_COMMITTEE,
      tags: [Tags.EARTH],
      cost: 7,

      metadata: {
        cardNumber: '112',
        description: 'Raise your TR 2 steps.',
        renderData: CardRenderer.builder((b) => b.tr(2)),
        victoryPoints: -2,
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * 2);
    }

    return true;
  }

  public play(player: Player, game: Game) {
    player.increaseTerraformRatingSteps(2, game);
    return undefined;
  }

  public getVictoryPoints() {
    return -2;
  }
}
