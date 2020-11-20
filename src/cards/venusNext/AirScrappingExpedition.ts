import {ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST, MAX_VENUS_SCALE} from '../../constants';

export class AirScrappingExpedition implements IProjectCard {
  public cost = 13;
  public tags = [Tags.VENUS];
  public name = CardName.AIR_SCRAPPING_EXPEDITION;
  public cardType = CardType.EVENT;
  public hasRequirements = false;

  public canPlay(player: Player, game: Game): boolean {
    const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, false, true);
    }

    return true;
  }

  public play(player: Player, game: Game) {
    game.increaseVenusScaleLevel(player, 1);
    let floaterCards = player.getResourceCards(ResourceType.FLOATER);
    floaterCards = floaterCards.filter((card) => card.tags.filter((cardTag) => cardTag === Tags.VENUS).length > 0);
    if (floaterCards.length === 0) {
      return undefined;
    }

    return new SelectCard('Select card to add 3 floaters', 'Add floaters', floaterCards, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0], 3);
      return undefined;
    });
  }
}
