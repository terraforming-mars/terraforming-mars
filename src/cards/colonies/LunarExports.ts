import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

export class LunarExports extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 19,
      tags: [Tags.EARTH, Tags.SPACE],
      name: CardName.LUNAR_EXPORTS,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C21',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.plants(2).or(Size.SMALL).megacredits(5);
          });
        }),
        description: 'Increase your plant production 2 steps, or your M€ production 5 steps.',
      },
    });
  }

  public play(player: Player) {
    return new OrOptions(
      new SelectOption('Increase your M€ production by 5', 'Increase +MC', () => {
        player.addProduction(Resources.MEGACREDITS, 5, {log: true});
        return undefined;
      }),
      new SelectOption('Increase your plant production by 2', 'Increase +plants', () => {
        player.addProduction(Resources.PLANTS, 2, {log: true});
        return undefined;
      }),
    );
  }
}
