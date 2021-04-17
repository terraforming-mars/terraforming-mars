import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class RadChemFactory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RAD_CHEM_FACTORY,
      tags: [Tags.BUILDING],
      cost: 8,
      productionBox: Units.of({energy: -1}),

      metadata: {
        cardNumber: '205',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1)).br;
          b.tr(2);
        }),
        description: 'Decrease your Energy production 1 step. Raise your TR 2 steps.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    const hasEnergyProduction = player.getProduction(Resources.ENERGY) >= 1;
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * 2, {steel: true}) && hasEnergyProduction;
    }

    return hasEnergyProduction;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.increaseTerraformRatingSteps(2);
    return undefined;
  }
}
