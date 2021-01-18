import {ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class HydrogenToVenus implements IProjectCard {
    public cost = 11;
    public tags = [Tags.SPACE];
    public name = CardName.HYDROGEN_TO_VENUS;
    public cardType = CardType.EVENT;
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

    public canPlay(player: Player, game: Game): boolean {
      const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      const jovianTags: number = player.getTagCount(Tags.JOVIAN);
      const floatersCards = player.getResourceCards(ResourceType.FLOATER).filter((card) => {
        return HydrogenToVenus.venusCardsWithFloaters.has(card.name);
      });
      if (jovianTags > 0) {
        if (floatersCards.length === 1) {
          player.addResourceTo(floatersCards[0], jovianTags);
          LogHelper.logAddResource(player, floatersCards[0], jovianTags);
        }
        if (floatersCards.length > 1) {
          return new SelectCard(
            'Select card to add ' + jovianTags + ' floater(s)',
            'Add floater(s)',
            floatersCards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], jovianTags);
              LogHelper.logAddResource(player, foundCards[0], jovianTags);
              game.increaseVenusScaleLevel(player, 1);
              return undefined;
            },
          );
        }
      }
      game.increaseVenusScaleLevel(player, 1);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '231',
      renderData: CardRenderer.builder((b) => {
        b.venus(1).br.br; // double br is intentional for visual appeal
        b.floaters(1).secondaryTag(Tags.VENUS).slash().jovian().played;
      }),
      description: 'Raise Venus 1 step. Add 1 Floater to A Venus CARD for each Jovian tag you have.',
    };
}
