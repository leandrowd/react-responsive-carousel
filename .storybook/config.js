import { configure, setAddon } from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';

function loadStories() {
  require('../stories/index.js');
  // You can require as many stories as you need.
}

setAddon(infoAddon);
configure(loadStories, module);
