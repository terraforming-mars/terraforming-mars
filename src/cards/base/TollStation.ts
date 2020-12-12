import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class TollStation implements IProjectCard {
    public cost = 12;
    public tags = [Tags.SPACE];
    public name = CardName.TOLL_STATION;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      const amount = game.getPlayers()
        .filter((aPlayer) => aPlayer !== player)
        .map((opponent) => opponent.getTagCount(Tags.SPACE, false, false))
        .reduce((a, c) => a + c, 0);
      player.addProduction(Resources.MEGACREDITS, amount);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '099',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.megacredits(1).slash().space().played.any;
        });
      }),
      description: 'Increase your MC production 1 step for each space tag your OPPONENTS have.',
    }
}
