import {IActionCard, ICard} from './../ICard';
import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {AndOptions} from '../../inputs/AndOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Meltworks implements IActionCard, IProjectCard {
    public cost = 4;
    public tags = [Tags.STEEL];
    public name = CardName.MELTWORKS;
    public cardType = CardType.ACTIVE;

    public play(_player: Player, _game: Game) {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.heat >= 5 || (player.isCorporation(CardName.STORMCRAFT_INCORPORATED) && (player.getResourcesOnCorporation() * 2) + player.heat >= 5 );
    }
    public action(player: Player) {
      if (player.isCorporation(CardName.STORMCRAFT_INCORPORATED) && player.getResourcesOnCorporation() > 0) {
        let heatAmount: number;
        let floaterAmount: number;

        return new AndOptions(
          () => {
            if (heatAmount + (floaterAmount * 2) < 5) {
              throw new Error('Need to pay 5 heat');
            }
            player.removeResourceFrom(player.corporationCard as ICard, floaterAmount);
            player.heat -= heatAmount;
            player.steel += 3;
            return undefined;
          },
          new SelectAmount('Select amount of heat to spend', 'Spend heat', (amount: number) => {
            heatAmount = amount;
            return undefined;
          }, 0, player.heat),
          new SelectAmount('Select amount of floaters on corporation to spend', 'Spend floaters', (amount: number) => {
            floaterAmount = amount;
            return undefined;
          }, 0, player.getResourcesOnCorporation()),
        );
      }

      player.heat -= 5;
      player.steel += 3;
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'X21',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.heat(5).digit.startAction.steel(3);
          eb.description('Action: Spend 5 heat to gain 3 steel.');
        });
      }),
    }
}
