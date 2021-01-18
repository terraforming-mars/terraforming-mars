import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class ExtractorBalloons implements IActionCard, IProjectCard, IResourceCard {
  public cost = 21;
  public tags = [Tags.VENUS];
  public name = CardName.EXTRACTOR_BALLOONS;
  public cardType = CardType.ACTIVE;
  public resourceType = ResourceType.FLOATER;
  public resourceCount: number = 0;

  public play() {
    this.resourceCount += 3;
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player, game: Game) {
    const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    const cannotAffordRed = PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !player.canAfford(REDS_RULING_POLICY_COST);
    if (this.resourceCount < 2 || venusMaxed || cannotAffordRed) {
      player.addResourceTo(this);
      LogHelper.logAddResource(player, this);
      return undefined;
    }
    return new OrOptions(
      new SelectOption('Remove 2 floaters to raise Venus scale 1 step',
        'Remove floaters', () => {
          this.resourceCount -= 2;
          game.increaseVenusScaleLevel(player, 1);
          LogHelper.logVenusIncrease( player, 1);
          return undefined;
        }),
      new SelectOption('Add 1 floater to this card', 'Add floater', () => {
        player.addResourceTo(this);
        LogHelper.logAddResource(player, this);
        return undefined;
      }),
    );
  }
  public metadata: CardMetadata = {
    cardNumber: '223',
    description: 'Add 3 Floaters to this card',
    renderData: CardRenderer.builder((b) => {
      b.action('Add 1 Floater to this card.', (eb) => {
        eb.empty().startAction.floaters(1);
      }).br;
      b.action('Remove 2 Floaters here to raise Venus 1 step.', (eb) => {
        eb.or(CardRenderItemSize.SMALL).floaters(2).startAction.venus(1);
      }).br.floaters(3);
    }),
  }
}
