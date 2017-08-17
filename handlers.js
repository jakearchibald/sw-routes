import fromCache from './lib/handlers/fromcache';
import fromNetwork from './lib/handlers/fromnetwork';
import fromPreload from './lib/handlers/frompreload';
import ifMethod from './lib/handlers/ifmethod';
import ifNavigation from './lib/handlers/ifnavigation';
import ifUrl from './lib/handlers/ifurl';
import race from './lib/handlers/race';
import sequence from './lib/handlers/sequence';
import toCache from './lib/handlers/tocache';
import updateCache from './lib/handlers/updatecache';
import wait from './lib/handlers/wait';

export {
  fromCache, fromNetwork, fromPreload, ifMethod,
  ifNavigation, ifUrl, race, sequence, toCache, updateCache,
  wait
};
