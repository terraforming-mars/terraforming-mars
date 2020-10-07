import { GameEnd } from "./GameEnd";
import { CreateGameForm } from "./CreateGameForm";
import { GameHome } from "./GameHome";
import { GamesOverview } from "./GamesOverview";
import { PlayerHome } from "./PlayerHome";
import { StartScreen } from "./StartScreen";
import { LoadGameForm } from "./LoadGameForm";
import { DebugUI } from "./DebugUI";

export const mainAppSettings = {
    "el": "#app",
    "data": {
        screen: "empty",
        playerkey: 0,
        isServerSideRequestInProgress: false,
        componentsVisibility: {
            "millestones_list": true,
            "awards_list": true,
            "tags_concise": false,
            "pinned_player_0": false,
            "pinned_player_1": false,
            "pinned_player_2": false,
            "pinned_player_3": false,
            "pinned_player_4": false,
            "turmoil_parties": false,
        },
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
        "debug-ui": DebugUI,
    },
    "methods": {
        setVisibilityState: function (targetVar: string, isVisible: boolean) {
            if (isVisible === this.getVisibilityState(targetVar)) return;
            (this as any).componentsVisibility[targetVar] = isVisible;
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
        } else if (currentPathname === "/debug-ui") {
            app.screen = "debug-ui";
        } else {
            app.screen = "start-screen";
        }
    },
};
