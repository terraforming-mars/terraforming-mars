import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Resources} from '../../Resources';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class GMOContract implements IProjectCard {
  public cost = 3;
  public tags = [Tags.MICROBE, Tags.SCIENCE];
  public name = CardName.GMO_CONTRACT;
  public cardType = CardType.ACTIVE;

  public canPlay(player: Player, game: Game): boolean {
    if (game.turmoil !== undefined) {
      return game.turmoil.canPlay(player, PartyName.GREENS);
    }
    return false;
  }

  public onCardPlayed(player: Player, game: Game, card: IProjectCard): void {
    const amount = card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBE).length;
    if (amount > 0) {
      game.defer(
        new DeferredAction(player, () => {
          player.setResource(Resources.MEGACREDITS, amount * 2);
          return undefined;
        }),
      );
    }
  }

  public play() {
    return undefined;
  }

  public metadata: CardMetadata = {
    description: 'Requires that Greens are ruling or that you have 2 delegates there.',
    cardNumber: 'T06',
    requirements: CardRequirements.builder((b) => b.party(PartyName.GREENS)),
    renderData: CardRenderer.builder((b) => {
      b.effect('Each time you play a plant, animal or microbe tag, including this, gain 2MC.', (be) => {
        be.animals(1).played.slash().plants(1).played.slash().microbes(1).played;
        be.startEffect.megacredits(2);
      });
    }),
  };
}
