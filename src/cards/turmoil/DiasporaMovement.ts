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

export class DiasporaMovement implements IProjectCard {
    public cost = 7;
    public tags = [Tags.JOVIAN];
    public name = CardName.DIASPORA_MOVEMENT;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        return game.turmoil.canPlay(player, PartyName.REDS);
      }
      return false;
    }

    public play(player: Player, game: Game) {
      const amount = game.getPlayers()
        .map((p) => p.getTagCount(Tags.JOVIAN, false, p.id === player.id ? true : false))
        .reduce((a, c) => a + c);
      player.setResource(Resources.MEGACREDITS, amount + 1);
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: 'TO4',
      requirements: CardRequirements.builder((b) => b.party(PartyName.REDS)),
      description: 'Requires that Reds are ruling or that you have 2 delegates there. Gain 1MC for each Jovian tag in play, including this.',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(1).slash().jovian().played.any;
      }),
      victoryPoints: 1,
    }
}
