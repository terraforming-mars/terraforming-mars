// import {Card} from '../Card';
// import {LeaderCard} from './LeaderCard';
// import {Player} from '../../Player';
// import {CardName} from '../../../common/cards/CardName';
// import {CardType} from '../../../common/cards/CardType';
// import {CardRenderer} from '../render/CardRenderer';
// import {PlayerInput} from '../../PlayerInput';
// import {Resources} from '../../Resources';

// export class HAL9000 extends Card implements LeaderCard {
//   constructor() {
//     super({
//       name: CardName.HAL9000,
//       cardType: CardType.LEADER,
//       metadata: {
//         cardNumber: 'L08',
//         renderData: CardRenderer.builder((b) => {
//           b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
//           b.br.br;
//           b.minus().text('EACH').production((pb) => pb.wild(1)).nbsp().colon().wild(4).digit.asterix();
//           b.br;
//         }),
//         description: 'Once per game, decrease each of your productions 1 step to gain 4 of that resource.',
//       },
//     });
//   }

//   public isDisabled = false;

//   public play() {
//     return undefined;
//   }

//   public canAct(): boolean {
//     return this.isDisabled === false;
//   }
  
//   public action(player: Player): PlayerInput | undefined {
//     const decreasableProductions = [];
//     if (player.getProduction(Resources.MEGACREDITS) > -5) decreasableProductions.push(Resources.MEGACREDITS);
//     [Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT].forEach((resource) => {
//       if (player.getProduction(resource) > 0) decreasableProductions.push(resource);
//     });

//     decreasableProductions.forEach((production) => {
//       player.addProduction(production, -1, {log: true});
//       player.addResource(production, 4, {log: true});
//     });

//     this.isDisabled = true;
//     return undefined;
//   }
// }









import {MAX_OCEAN_TILES} from '../../../common/constants'; 
import {LeaderCard} from './LeaderCard';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Resources} from '../../../common/Resources';

export class HAL9000 extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.ULRICH,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L21',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().oceans(1).colon().megacredits(4).multiplierWhite().slash().megacredits(15).asterix();
        }),
        description: 'Once per game, gain 4 M€ for each ocean placed. If all oceans are aleady placed, gain only 15 M€.',
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
    const game = player.game;
    const oceansPlaced = game.board.getOceanCount()
    if (oceansPlaced < MAX_OCEAN_TILES) {
      const oceansPlaced = game.board.getOceanCount();
      player.addResource(Resources.MEGACREDITS, oceansPlaced * 4, {log: true});
    } else {
      player.addResource(Resources.MEGACREDITS, 15, {log: true});
    }

    this.isDisabled = true;
    return undefined;
  }
}
