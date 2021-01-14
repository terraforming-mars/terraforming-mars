import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class SupportedResearch implements IProjectCard {
    public cost = 3;
    public tags = [Tags.SCIENCE];
    public name = CardName.SUPPORTED_RESEARCH;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        return game.turmoil.canPlay(player, PartyName.SCIENTISTS);
      }
      return false;
    }

    public play(player: Player) {
      player.drawCard(2);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'T14',
      requirements: CardRequirements.builder((b) => b.party(PartyName.SCIENTISTS)),
      renderData: CardRenderer.builder((b) => {
        b.cards(2);
      }),
      description: 'Requires that Scientists are ruling or that you have 2 delegates there. Draw 2 cards.',
    };
}
