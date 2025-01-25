// This is written based on
// https://discordjs.guide/oauth2

// DO NOT make any changes as part of a regular refactoring or anything.
// Security is more important than convenience.

export function startOauth() {
  const fragment = new URLSearchParams(window.location.hash.slice(1));

  if (fragment.has('access_token')) {
    const urlState = fragment.get('state');
    if (urlState !== null) {
      const stateParameter = localStorage.getItem('stateParameter');
      if (stateParameter !== atob(decodeURIComponent(urlState))) {
        return console.log('You may have been clickjacked!');
      }
    }

    const accessToken = fragment.get('access_token');
    const tokenType = fragment.get('token_type');

    fetch('https://discord.com/api/users/@me', {headers: {authorization: `${tokenType} ${accessToken}`}})
      .then((res) => res.json())
      .then((response) => {
        const {username, discriminator} = response;
        const info = document.getElementById('info');
        if (info) {
          info.innerText += ` ${username}#${discriminator}`;
        }
      })
      .catch(console.error);
  } else {
    const login = document.getElementById('login');
    if (login) {
      login.style.display = 'block';
    }
  }
}

function generateRandomString() {
  const rand = Math.floor(Math.random() * 10);
  let randStr = '';

  for (let i = 0; i < 20 + rand; i++) {
    randStr += String.fromCharCode(33 + Math.floor(Math.random() * 94));
  }

  return randStr;
}

// ...

// generate and store the string
const randStr = generateRandomString();
localStorage.setItem('stateParameter', randStr);

const login = document.getElementById('login');
if (login) {
  const anchorElement = login as HTMLAnchorElement;
  anchorElement.href += `&state=${btoa(randStr)}`;
}
