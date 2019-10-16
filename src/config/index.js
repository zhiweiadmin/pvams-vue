import * as sit from './config.sit';
import * as prd from './config.prd';

let config;

if (window.location.hostname === '101.37.67.138') {
  config = prd;
} else {
  config = sit;
}
export default config;
