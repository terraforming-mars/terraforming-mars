
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { Game } from '../Game';

export class EquatorialMagnetizer implements IActionCard, IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.EQUATORIAL_MAGNETIZER;
    public cardType: CardType = CardType.ACTIVE;

    public play() {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.getProduction(Resources.ENERGY) >= 1;
    }
    public action(player: Player, game: Game) {
      player.setProduction(Resources.ENERGY,-1);
      player.increaseTerraformRating(game);
      return undefined;
    }
}

