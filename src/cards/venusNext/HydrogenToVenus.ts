import {ICard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class HydrogenToVenus extends Card {
  constructor() {
    super({
      name: CardName.HYDROGEN_TO_VENUS,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE],
      cost: 11,

      metadata: {
        cardNumber: '231',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br.br; // double br is intentional for visual appeal
          b.floaters(1).secondaryTag(Tags.VENUS).slash().jovian().played;
        }),
        description: 'Raise Venus 1 step. Add 1 Floater to A Venus CARD for each Jovian tag you have.',
      },
    });
  };

  private static readonly venusCardsWithFloaters: Set<CardName> = new Set<CardName>([
    CardName.AERIAL_MAPPERS,
    CardName.CELESTIC,
    CardName.DEUTERIUM_EXPORT,
    CardName.DIRIGIBLES,
    CardName.EXTRACTOR_BALLOONS,
    CardName.FLOATING_HABS,
    CardName.FORCED_PRECIPITATION,
    CardName.JET_STREAM_MICROSCRAPPERS,
    CardName.LOCAL_SHADING,
    CardName.STRATOPOLIS,
  ]);

  public canPlay(player: Player): boolean {
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !venusMaxed) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, {titanium: true});
    }

    return true;
  }

  public play(player: Player) {
    const jovianTags: number = player.getTagCount(Tags.JOVIAN);
    const floatersCards = player.getResourceCards(ResourceType.FLOATER).filter((card) => {
      return HydrogenToVenus.venusCardsWithFloaters.has(card.name);
    });
    if (jovianTags > 0) {
      if (floatersCards.length === 1) {
        player.addResourceTo(floatersCards[0], {qty: jovianTags, log: true});
      }
      if (floatersCards.length > 1) {
        return new SelectCard(
          'Select card to add ' + jovianTags + ' floater(s)',
          'Add floater(s)',
          floatersCards,
          (foundCards: Array<ICard>) => {
            player.addResourceTo(foundCards[0], {qty: jovianTags, log: true});
            player.game.increaseVenusScaleLevel(player, 1);
            return undefined;
          },
        );
      }
    }
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}
