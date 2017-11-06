import { configure, setAddon } from '@storybook/react'
import infoAddon from '@storybook/addon-info'

function loadStories() {
  require('../stories/index.js');
  // You can require as many stories as you need.
}

setAddon(infoAddon);
configure(loadStories, module);
