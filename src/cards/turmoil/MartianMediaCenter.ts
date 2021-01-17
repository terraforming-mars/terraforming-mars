import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Resources} from '../../Resources';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class MartianMediaCenter implements IProjectCard {
    public cost = 7;
    public tags = [Tags.BUILDING];
    public name = CardName.MARTIAN_MEDIA_CENTER;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        return game.turmoil.canPlay(player, PartyName.MARS);
      }
      return false;
    }

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }

    public canAct(player: Player, game: Game): boolean {
      return player.canAfford(3) && game.turmoil!.hasAvailableDelegates(player.id);
    }

    public action(player: Player, game: Game) {
      game.defer(new SelectHowToPayDeferred(player, 3, {title: 'Select how to pay for Martian Media Center action'}));
      game.defer(new SendDelegateToArea(player, 'Select where to send a delegate', 1, undefined, undefined, false));
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'T07',
      requirements: CardRequirements.builder((b) => b.party(PartyName.MARS)),
      renderData: CardRenderer.builder((b) => {
        b.action('Pay 3 MC to add a delegate to any party.', (eb) => {
          eb.megacredits(3).startAction.delegates(1);
        }).br;
        b.production((pb) => {
          pb.megacredits(2);
        });
      }),
      description: 'Requires that Mars First is ruling or that you have 2 delegates there.Increase your MC production 2 steps.',
    }
}
