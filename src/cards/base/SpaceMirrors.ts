import {Player} from '../../Player';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class SpaceMirrors implements IActionCard, IProjectCard {
    public cost = 3;
    public tags = [Tags.ENERGY, Tags.SPACE];
    public name = CardName.SPACE_MIRRORS;
    public cardType = CardType.ACTIVE;

    public play() {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.canAfford(7);
    }
    public action(player: Player, game: Game) {
      game.defer(new SelectHowToPayDeferred(player, 7, false, false, 'Select how to pay for action'));
      player.addProduction(Resources.ENERGY);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '076',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 5)),
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.megacredits(7).startAction.productionBox((pb) => pb.energy(1));
          eb.description('Action: Spend 7 MC to increase your energy production 1 step.');
        });
      }),
    };
}
