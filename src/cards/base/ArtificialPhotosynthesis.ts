import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class ArtificialPhotosynthesis extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ARTIFICIAL_PHOTOSYNTHESIS,
      tags: [Tags.SCIENCE],
      cost: 12,

      metadata: {
        description: 'Increase your plant production 1 step or your energy production 2 steps.',
        cardNumber: '115',
        renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.plants(1).or(CardRenderItemSize.SMALL).energy(2))),
      },
    });
  }
  public play(player: Player) {
    return new OrOptions(
      new SelectOption('Increase your energy production 2 steps', 'Increase', () => {
        player.addProduction(Resources.ENERGY, 2);
        return undefined;
      }),
      new SelectOption('Increase your plant production 1 step', 'Increase', () => {
        player.addProduction(Resources.PLANTS);
        return undefined;
      }),
    );
  }
}
