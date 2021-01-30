import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class UnitedNationsMarsInitiative extends Card implements IActionCard, CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.UNITED_NATIONS_MARS_INITIATIVE,
      tags: [Tags.EARTH],
      startingMegaCredits: 40,

      metadata: {
        cardNumber: 'R32',
        description: 'You start with 40 MC.',
        renderData: CardRenderer.builder((b) => {
          // TODO(chosta): find a not so hacky solutions to spacing
          b.br.br.br;
          b.empty().nbsp.nbsp.nbsp.nbsp.megacredits(40);
          b.corpBox('action', (ce) => {
            ce.action('If your Terraform Rating was raised this generation, you may pay 3 MC to raise it 1 step more.', (eb) => {
              eb.megacredits(3).startAction.tr(1).asterix();
            });
          });
        }),
      },
    });
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    const hasIncreasedTR = player.hasIncreasedTerraformRatingThisGeneration;
    const actionCost = 3;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return hasIncreasedTR && player.canAfford(REDS_RULING_POLICY_COST + actionCost);
    }

    return hasIncreasedTR && player.canAfford(actionCost);
  }
  public action(player: Player) {
    player.megaCredits -= 3;
    player.increaseTerraformRating();
    return undefined;
  }
}
