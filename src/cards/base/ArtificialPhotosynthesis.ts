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
import {Size} from '../render/Size';

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
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.plants(1).or(Size.SMALL).energy(2))),
      },
    });
  }
  public play(player: Player) {
    return new OrOptions(
      new SelectOption('Increase your energy production 2 steps', 'Increase', () => {
        player.addProduction(Resources.ENERGY, 2, {log: true});
        return undefined;
      }),
      new SelectOption('Increase your plant production 1 step', 'Increase', () => {
        player.addProduction(Resources.PLANTS, 1, {log: true});
        return undefined;
      }),
    );
  }
}
