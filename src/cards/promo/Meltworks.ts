import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Meltworks implements IActionCard, IProjectCard {
    public cost = 4;
    public tags = [Tags.BUILDING];
    public name = CardName.MELTWORKS;
    public cardType = CardType.ACTIVE;

    public play(_player: Player, _game: Game) {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.availableHeat >= 5;
    }
    public action(player: Player) {
      return player.spendHeat(5, () => {
        player.steel += 3;
        return undefined;
      });
    }

    public metadata: CardMetadata = {
      cardNumber: 'X21',
      renderData: CardRenderer.builder((b) => {
        b.action('Spend 5 heat to gain 3 steel.', (eb) => {
          eb.heat(5).digit.startAction.steel(3);
        });
      }),
    }
}
