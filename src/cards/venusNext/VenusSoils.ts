import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {Game} from '../../Game';
import {ICard} from '../ICard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class VenusSoils implements IProjectCard {
    public cost = 20;
    public tags = [Tags.VENUS, Tags.PLANT];
    public name = CardName.VENUS_SOILS;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, false, true, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.addProduction(Resources.PLANTS);
      game.increaseVenusScaleLevel(player, 1);

      const microbeCards = player.getResourceCards(ResourceType.MICROBE);

      if (microbeCards.length === 0) return undefined;

      if (microbeCards.length === 1) {
        player.addResourceTo(microbeCards[0], 2);
        LogHelper.logAddResource(player, microbeCards[0], 2);
        return undefined;
      }

      return new SelectCard(
        'Select card to add 2 microbes',
        'Add microbe(s)',
        microbeCards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 2);
          LogHelper.logAddResource(player, foundCards[0], 2);
          return undefined;
        },
      );
    }
    public metadata: CardMetadata = {
      cardNumber: '257',
      renderData: CardRenderer.builder((b) => {
        b.venus(1).br;
        b.production((pb) => pb.plants(1)).microbes(2).asterix();
      }),
      description: 'Raise Venus 1 step. Increase your Plant production 1 step. Add 2 Microbes to ANOTHER card',
    }
}
