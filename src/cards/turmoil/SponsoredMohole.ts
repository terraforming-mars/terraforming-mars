import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';


export class SponsoredMohole implements IProjectCard {
    public cost = 5;
    public tags = [Tags.BUILDING];
    public name = CardName.SPONSORED_MOHOLE;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        return game.turmoil.canPlay(player, PartyName.KELVINISTS);
      }
      return false;
    }

    public play(player: Player) {
      player.addProduction(Resources.HEAT, 2);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'T13',
      requirements: CardRequirements.builder((b) => b.party(PartyName.KELVINISTS)),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.heat(2));
      }),
      description: 'Requires that Kelvinists are ruling or that you have 2 delegates there. Increase your heat production 2 steps.',
    };
}
