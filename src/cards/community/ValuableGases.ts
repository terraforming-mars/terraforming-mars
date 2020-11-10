import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {SelectHowToPayForCard} from '../../inputs/SelectHowToPayForCard';

export class ValuableGases extends PreludeCard implements IProjectCard {
    public tags = [Tags.JOVIAN, Tags.VENUS];
    public name = CardName.VALUABLE_GASES;

    public play(player: Player, game: Game) {
      player.megaCredits += 6;

      const playableCards = player.getPlayableCards(game).filter((card) => card.tags.indexOf(Tags.VENUS) !== -1);

      if (playableCards.length > 0) {
        return new SelectHowToPayForCard(
            playableCards,
            player.getMicrobesCanSpend(),
            player.getFloatersCanSpend(),
            player.canUseHeatAsMegaCredits,
            (selectedCard, howToPay) => {
              const result = player.checkHowToPayAndPlayCard(selectedCard, howToPay, game);
              if (selectedCard.resourceType === ResourceType.FLOATER) {
                player.addResourceTo(selectedCard, 4);
              }
              return result;
            },
        );
      }

      return undefined;
    }
}

