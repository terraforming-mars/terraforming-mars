import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../common/Resources';

export class SmallOpenPitMine extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SMALL_OPEN_PIT_MINE,
      cost: 10,
      tags: [Tags.BUILDING],

      metadata: {
        cardNumber: 'Pf31',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(2)).or().production((pb) => pb.titanium(1));
        }),
        description: 'Increase your steel production 2 steps OR increase your titanium production 1 step.',
      },
    });
  }

  public produce(player: Player) {
    player.game.defer(new SimpleDeferredAction(player, () => {
      return new OrOptions(
        new SelectOption('Increase your steel production 2 steps', 'Increase', () => {
          player.addProduction(Resources.STEEL, 2, {log: true});
          return undefined;
        }),
        new SelectOption('Increase your titanium production 1 step', 'Increase', () => {
          player.addProduction(Resources.TITANIUM, 1, {log: true});
          return undefined;
        }));
    }));
  }

  public play(player: Player) {
    this.produce(player);
    return undefined;
  }
}

