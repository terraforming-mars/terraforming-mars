import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SulphurExports implements IProjectCard {
    public cost = 21;
    public tags = [Tags.VENUS, Tags.SPACE];
    public name = CardName.SULPHUR_EXPORTS;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, true, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.VENUS) + 1 );
      game.increaseVenusScaleLevel(player, 1);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '250',
      renderData: CardRenderer.builder((b) => {
        b.venus(1).br;
        b.production((pb) => pb.megacredits(1).slash().venus(1).played);
      }),
      description: 'Increase Venus 1 step. Increase your MC production 1 step for each Venus tag you have, including this.',
    };
}
