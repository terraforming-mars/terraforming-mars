import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { Player } from '../../Player';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';

import {digit} from '../Options';
import { Resources } from '../../../common/Resources';

// import {digit} from '../Options';


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
          // b.minus().text('EACH').production((pb) => pb.wild(1)).nbsp.colon().wild(4).digit.asterix();
          b.minus().text('EACH').production((pb) => pb.wild(1)).nbsp.colon().wild(4, {digit}).asterix();
          b.br;
        }),
        description: 'Once per game, decrease each of your productions 1 step to gain 4 of that resource.',
      },
    });
  }

  public isDisabled = false;

  // public play() {
  //   return undefined;
  // }

  public canAct(): boolean {
    return this.isDisabled === false;
  }
  
  public action(player: Player): PlayerInput | undefined {
    // I should probably be using 'player.production.canHaveProductionReduced()', but that may cause issues with 'protected' steel/titanium
    // I'm pretty sure HAL isnt protected against itself
    // const decreasableProductions = [];
    // if (player.production.megacredits > -5) decreasableProductions.push(Resources.MEGACREDITS);
    // if (player.production.steel > 0) decreasableProductions.push(Resources.STEEL);
    // if (player.production.titanium > 0) decreasableProductions.push(Resources.TITANIUM);
    // if (player.production.plants > 0) decreasableProductions.push(Resources.PLANTS);
    // if (player.production.energy > 0) decreasableProductions.push(Resources.ENERGY);
    // if (player.production.heat > 0) decreasableProductions.push(Resources.HEAT);
    if (player.production.megacredits > -5) {
      player.addResource(Resources.MEGACREDITS, 4, {log: true});
      // player.production.adjust(Resources.MEGACREDITS, -1)
    } 
    // if (player.production.steel > 0) decreasableProductions.push(Resources.STEEL);
    // if (player.production.titanium > 0) decreasableProductions.push(Resources.TITANIUM);
    // if (player.production.plants > 0) decreasableProductions.push(Resources.PLANTS);
    // if (player.production.energy > 0) decreasableProductions.push(Resources.ENERGY);
    // if (player.production.heat > 0) decreasableProductions.push(Resources.HEAT);

    // decreasableProductions.forEach((production) => {
    //   player.production
    //   player.adjust(production, -1, {log: true});
      
    // });

    this.isDisabled = true;
    return undefined;
  }
}



