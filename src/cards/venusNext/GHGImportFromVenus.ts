import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class GHGImportFromVenus implements IProjectCard {
    public cost = 23;
    public tags = [Tags.SPACE, Tags.VENUS];
    public name = CardName.GHG_IMPORT_FROM_VENUS;
    public cardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
      const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, true, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.addProduction(Resources.HEAT, 3);
      game.increaseVenusScaleLevel(player, 1);
      return undefined;
    }
    public metadata: CardMetadata = {
      description: 'Raise Venus 1 step. Increase your heat production 3 steps.',
      cardNumber: '228',
      renderData: CardRenderer.builder((b) => {
        b.venus(1).production((pb) => {
          pb.heat(3);
        });
      }),
    };
}
