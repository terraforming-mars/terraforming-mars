
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {ISpace} from '../ISpace';
import {SelectSpace} from '../inputs/SelectSpace';

export class ConvoyFromEuropa implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = 'Convoy From Europa';
    public canPlay(): boolean {
      return true;
    }
    public play(player: Player, game: Game) {

      if (game.noOceansAvailabe()) return undefined;

      return new SelectSpace(
          'Select space for ocean tile',
          game.getAvailableSpacesForOcean(player),
          (space: ISpace) => {
            game.addOceanTile(player, space.id);
            player.cardsInHand.push(game.dealer.dealCard());
            return undefined;
          }
      );
    }
}
