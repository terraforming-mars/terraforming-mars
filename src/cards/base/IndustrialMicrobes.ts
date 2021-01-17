import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class IndustrialMicrobes extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.INDUSTRIAL_MICROBES,
      tags: [Tags.MICROBE, Tags.BUILDING],
      cost: 12,
      productionDelta: Units.of({energy: 1, steel: 1}),

      metadata: {
        cardNumber: '158',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).steel(1));
        }),
        description: 'Increase your Energy production and your steel production 1 step each.',
      },
    });
  }
  public play(player: Player, _game: Game) {
    player.addProduction(Resources.ENERGY);
    player.addProduction(Resources.STEEL);
    return undefined;
  }
}

