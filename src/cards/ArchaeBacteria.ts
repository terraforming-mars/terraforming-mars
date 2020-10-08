import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class ArchaeBacteria implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: CardName = CardName.ARCHAEBACTERIA;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() <= -18 + (
        player.getRequirementsBonus(game) * 2
      );
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      return undefined;
    }
}
