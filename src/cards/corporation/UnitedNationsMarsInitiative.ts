import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../common/Resources';

export const ACTION_COST = 3;
export class UnitedNationsMarsInitiative extends Card implements IActionCard, CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.UNITED_NATIONS_MARS_INITIATIVE,
      tags: [Tags.EARTH],
      startingMegaCredits: 40,

      metadata: {
        cardNumber: 'R32',
        description: 'You start with 40 M€.',
        renderData: CardRenderer.builder((b) => {
          // TODO(chosta): find a not so hacky solutions to spacing
          b.br.br.br;
          b.empty().nbsp.nbsp.nbsp.nbsp.megacredits(40);
          b.corpBox('action', (ce) => {
            ce.action('If your Terraform Rating was raised this generation, you may pay 3 M€ to raise it 1 step more.', (eb) => {
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
    return player.hasIncreasedTerraformRatingThisGeneration && player.canAfford(ACTION_COST, {tr: {tr: 1}});
  }
  public action(player: Player) {
    player.deductResource(Resources.MEGACREDITS, 3);
    player.increaseTerraformRating();
    return undefined;
  }
}
