import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class StripMine extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.STRIP_MINE,
      tags: [Tags.BUILDING],
      cost: 25,
      productionBox: Units.of({energy: -2, steel: 2, titanium: 1}),
      tr: {oxygen: 2},

      metadata: {
        cardNumber: '138',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(2).br;
            pb.plus().steel(2).titanium(1);
          }).br;
          b.oxygen(2);
        }),
        description: 'Decrease your Energy production 2 steps. Increase your steel production 2 steps and your titanium production 1 step. Raise oxygen 2 steps.',
      },
    });
  }
  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 2;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -2);
    player.addProduction(Resources.STEEL, 2);
    player.addProduction(Resources.TITANIUM, 1);
    return player.game.increaseOxygenLevel(player, 2);
  }
}
