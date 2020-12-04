import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ImportedNitrogen implements IProjectCard {
    public cost = 23;
    public tags = [Tags.EARTH, Tags.SPACE];
    public name = CardName.IMPORTED_NITROGEN;
    public cardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.plants += 4;
      player.increaseTerraformRating(game);
      game.defer(new AddResourcesToCard(player, game, ResourceType.MICROBE, 3));
      game.defer(new AddResourcesToCard(player, game, ResourceType.ANIMAL, 2));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '163',
      renderData: CardRenderer.builder((b) => {
        b.tr(1).br;
        b.plants(4).br;
        b.microbes(3).digit.asterix().nbsp.or().nbsp;
        b.animals(2).digit.asterix().br;
      }),
      description: 'Raise your TR 1 step and gain 4 Plants. Add 3 Microbes to ANOTHER card and 2 Animals to ANOTHER card.',
    }
}
