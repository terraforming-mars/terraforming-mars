import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {CardName} from '../CardName';
import {CardMetadata} from '../cards/CardMetadata';
import {CardRequirements} from '../cards/CardRequirements';

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

    public metadata: CardMetadata = {
      description: 'Requires a Plant tag, a Microbe tag, and an Animal tag.',
      cardNumber: '135',
      requirements: CardRequirements.builder((b) =>
        b.tag(Tags.PLANT).tag(Tags.ANIMAL).tag(Tags.MICROBES),
      ),
      victoryPoints: 3,
    };
}
