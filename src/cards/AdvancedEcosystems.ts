import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { CardName } from '../CardName';

export class AdvancedEcosystems implements IProjectCard {
    public cost = 11;
    public tags = [Tags.PLANT, Tags.MICROBES, Tags.ANIMAL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.ADVANCED_ECOSYSTEMS;
    public canPlay(player: Player): boolean {
      return player.checkMultipleTagPresence([Tags.PLANT, Tags.ANIMAL, Tags.MICROBES]);
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return 3;
    }
}
