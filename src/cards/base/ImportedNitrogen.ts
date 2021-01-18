import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRenderer} from '../render/CardRenderer';

export class ImportedNitrogen extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.IMPORTED_NITROGEN,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 23,

      metadata: {
        cardNumber: '163',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).br;
          b.plants(4).digit;
          b.microbes(3).digit.asterix().nbsp;
          b.animals(2).digit.asterix();
        }),
        description: 'Raise your TR 1 step and gain 4 Plants. Add 3 Microbes to ANOTHER card and 2 Animals to ANOTHER card.',
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, true);
    }

    return true;
  }

  public play(player: Player, game: Game) {
    player.plants += 4;
    player.increaseTerraformRating(game);
    game.defer(new AddResourcesToCard(player, ResourceType.MICROBE, {count: 3}));
    game.defer(new AddResourcesToCard(player, ResourceType.ANIMAL, {count: 2}));
    return undefined;
  }
}
