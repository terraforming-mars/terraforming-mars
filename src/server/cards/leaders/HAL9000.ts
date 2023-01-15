import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from './LeaderCard';

import {digit} from '../Options';
import {Resources} from '../../../common/Resources';

export class HAL9000 extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.HAL9000,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L08',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.minus().text('EACH').production((pb) => pb.wild(1)).nbsp.colon().wild(4, {digit}).asterix();
          b.br;
        }),
        description: 'Once per game, decrease each of your productions 1 step to gain 4 of that resource.',
      },
    });
  }

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const prd = player.production;
    const resources = [
      {productionName: prd.megacredits, resource: Resources.MEGACREDITS},
      {productionName: prd.steel, resource: Resources.STEEL},
      {productionName: prd.titanium, resource: Resources.TITANIUM},
      {productionName: prd.plants, resource: Resources.PLANTS},
      {productionName: prd.energy, resource: Resources.ENERGY},
      {productionName: prd.heat, resource: Resources.HEAT},
    ];

    for (const resource of resources) {
      let minValue = 0;
      if (resource.productionName === prd.megacredits) minValue = -5;
      if (resource.productionName > minValue) {
        player.production.add(resource.resource, -1, {log: true});
        player.addResource(resource.resource, 4, {log: true});
      }
    }

    this.isDisabled = true;
    return undefined;
  }
}


