import { GameEnd } from "./GameEnd";
import { CreateGameForm } from "./CreateGameForm";
import { GameHome } from "./GameHome";
import { GamesOverview } from "./GamesOverview";
import { PlayerHome } from "./PlayerHome";
import { StartScreen } from "./StartScreen";
import { LoadGameForm } from "./LoadGameForm";

export const mainAppSettings = {
    "el": "#app",
    "data": {
        screen: "empty",
        playerkey: 0,
        componentsVisibility: {},
        game: {
            players: [],
        },
    },
    "components": {
        "start-screen": StartScreen,
        "create-game-form": CreateGameForm,
        "load-game-form": LoadGameForm,
        "game-home": GameHome,
        "player-home": PlayerHome,
        "player-end": GameEnd,
        "games-overview": GamesOverview,
    },
    "methods": {
        setVisibilityState: function (targetVar: string, isVisible: boolean) {
            if (isVisible === this.getVisibilityState(targetVar)) return;
            (this as any).componentsVisibility[targetVar] = isVisible;
            (this as any).playerkey++;
        },
        getVisibilityState: function (targetVar: string): boolean {
            return (this as any).componentsVisibility[targetVar] ? true : false;
        },
        updatePlayer: function () {
            const currentPathname: string = window.location.pathname;
            const xhr = new XMLHttpRequest();
            let app = this as any;
            xhr.open(
                "GET",
                "/api/player" +
                    window.location.search.replace("&noredirect", "")
            );
            xhr.onerror = function () {
                alert("Error getting game data");
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    app.player = xhr.response;
                    app.playerkey++;
                    if (
                        app.player.phase === "end" &&
                        window.location.search.indexOf("&noredirect") === -1
                    ) {
                        app.screen = "the-end";
                        if (currentPathname !== "/the-end") {
                            window.history.replaceState(
                                xhr.response,
                                "Teraforming Mars - Player",
                                "/the-end?id=" + xhr.response.id
                            );
                        }
                    } else {
                        app.screen = "player-home";
                        if (currentPathname !== "/player") {
                            window.history.replaceState(
                                xhr.response,
                                "Teraforming Mars - Game",
                                "/player?id=" + xhr.response.id
                            );
                        }
                    }
                } else {
                    alert("Unexpected server response");
                }
            };
            xhr.responseType = "json";
            xhr.send();
        },
    },
    "mounted": function () {
        const currentPathname: string = window.location.pathname;
        let app = this as any;
        if (currentPathname === "/player" || currentPathname === "/the-end") {
            app.updatePlayer();
        } else if (currentPathname === "/game") {
            app.screen = "game-home";
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "/api/game" + window.location.search);
            xhr.onerror = function () {
                alert("Error getting game data");
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    window.history.replaceState(
                        xhr.response,
                        "Teraforming Mars - Game",
                        "/game?id=" + xhr.response.id
                    );
                    app.game = xhr.response;
                } else {
                    alert("Unexpected server response");
                }
            };
            xhr.responseType = "json";
            xhr.send();
        } else if (currentPathname === "/games-overview") {
            app.screen = "games-overview";
        } else if (
            currentPathname === "/new-game" ||
            currentPathname === "/solo"
        ) {
            app.screen = "create-game-form";
        } else if (currentPathname === "/load") {
            app.screen = "load";
        } else {
            app.screen = "start-screen";
        }
    },
};
