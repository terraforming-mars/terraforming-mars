import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class ParliamentHall implements IProjectCard {
    public cost = 8;
    public tags = [Tags.BUILDING];
    public name = CardName.PARLIAMENT_HALL;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        return game.turmoil.canPlay(player, PartyName.MARS);
      }
      return false;
    }

    public play(player: Player) {
      const amount = Math.floor((player.getTagCount(Tags.BUILDING) + 1) / 3);
      player.addProduction(Resources.MEGACREDITS, amount);
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: 'T08',
      requirements: CardRequirements.builder((b) => b.party(PartyName.MARS)),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.megacredits(1).slash().building(3).played;
        });
      }),
      description: 'Requires that Mars First are ruling or that you have 2 delegates there. Increase your MC production 1 step for every 3 Building tags you have, including this.',
      victoryPoints: 1,
    }
}
