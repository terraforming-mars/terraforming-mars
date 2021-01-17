import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRenderer} from '../render/CardRenderer';

export class ReleaseOfInertGases extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.RELEASE_OF_INERT_GASES,
      cost: 14,

      metadata: {
        cardNumber: '036',
        renderData: CardRenderer.builder((b) => {
          b.tr(2);
        }),
        description: 'Raise your terraforming rating 2 steps.',
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
}
