import {IncomingMessage} from 'http';

export function getHerokuIpAddress(req: IncomingMessage): string | undefined {
  // https://stackoverflow.com/questions/53646354/how-can-i-get-the-ip-address-of-users-opening-my-heroku-app
  const address = req.headers['HTTP_X_FORWARDED_FOR'];
  if (Math.random() < .05) {
    console.log('Testing :', address);
  }
  if (Array.isArray(address)) {
    return address[0];
  }
  return address;
}
