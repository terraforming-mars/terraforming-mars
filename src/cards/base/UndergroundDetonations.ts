import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class UndergroundDetonations implements IActionCard, IProjectCard {
    public cost = 6;
    public tags = [Tags.BUILDING];
    public name = CardName.UNDERGROUND_DETONATIONS;
    public cardType = CardType.ACTIVE;

    public canAct(player: Player): boolean {
      return player.canAfford(10);
    }
    public action(player: Player, game: Game) {
      game.defer(new SelectHowToPayDeferred(player, 10, {title: 'Select how to pay for action'}));
      player.addProduction(Resources.HEAT, 2);
      return undefined;
    }
    public play() {
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '202',
      renderData: CardRenderer.builder((b) => {
        b.action('Spend 10MC to increase your heat production 2 steps.', (eb) => {
          eb.megacredits(10).startAction.productionBox((pb)=>pb.heat(2));
        });
      }),
    }
}
