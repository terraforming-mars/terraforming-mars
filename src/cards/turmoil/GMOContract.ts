import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Resources} from '../../Resources';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class GMOContract implements IProjectCard {
    public cost = 3;
    public tags = [Tags.MICROBES, Tags.SCIENCE];
    public name = CardName.GMO_CONTRACT;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        return game.turmoil.canPlay(player, PartyName.GREENS);
      }
      return false;
    }

    public onCardPlayed(player: Player, game: Game, card: IProjectCard): void {
      const amount = card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBES).length;
      if (amount > 0) {
        game.defer(new DeferredAction(
            player,
            () => {
              player.setResource(Resources.MEGACREDITS, amount * 2);
              return undefined;
            },
        ));
      }
    }

    public play() {
      return undefined;
    }
}
