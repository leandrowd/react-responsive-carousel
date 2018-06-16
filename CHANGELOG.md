# React Responsive Carousel


## 3.1.40 - Sat Jun 16 2018
 * add autoPlay to state and update upon props change
 * assign new autoPlay props when received

to work with up-to-date values in setup/destroy autoplay


## 3.1.39 - Tue May 22 2018
 * Fix typeof comparison
 * Fix itemsList ref


## 3.1.38 - Mon May 21 2018
 * Updating react-easy-swipe
 * Fix wrapperSize init


## 3.1.37 - Wed Apr 25 2018
 * Updating react-easy-swipe
 * Fix broken test from merge
 * Add defensive checks for before items are initialized


## 3.1.36 - Mon Apr 09 2018
 * Minor changes based on code review
 * Updated tests
 * Updated to refs callback


## 3.1.35 - Sat Mar 31 2018


## 3.1.34 - Fri Mar 30 2018
 * remove .idea/ directory; remove package-lock.json
 * Refactor thumbs state to reduce flicker on thumbs by calculating arrows immediately and using setState to increase change of rerendering in same react render cycle
Add updateSizes call on carousel trigger same process on thumbs
Fix thumbs not updating when images change by checking for new images during update and updating accordingly
Fix firstItem not updating correctly when removing and adding arrows so we neither lose thumbs nor lose the selected item
 * Include index.html to storybook url
 * import Children from React, other minor changes
 * make carousel work with only 1 child passed in
 * Replacing codepen with codesandbox
 * Updating readme
 * Fix story for swipeable
 * feat: add story for swipeable
 * test: add snapshot for swipeable false


## 3.1.33 - Mon Jan 29 2018
 * Updating example with external controls
 * fix: indentation in scss
 * refactor: move style rules to not be applied to everying inside slide
 * chore: add build /lib
 * refactor: finding DOMNode of swiper with ReactDom method
 * refactor: remove unused ref on ul tag
 * fix: setting transform properties on swipe
 * Update index.d.ts
 * Update index.d.ts

Add `centerMode` and `centerSlidePercentage`


## 3.1.30 - Sat Dec 02 2017
 * Updates per requests from PR
 * BUGFIX - updates to arrow key navigation handler to work in IE/Edge. Changed match from e.key => e.keyCode. Updated Carousel tests to account for new methods. There are two tests that fail, but they were failing in the existing repo as well.


## 3.1.29 - Fri Dec 01 2017
 * feat: add verticalSwipe property to deal with mobile vertical swipping.

This commit aims to fix [issue 198](https://github.com/leandrowd/react-responsive-carousel/issues/198).
 * issue #191: Add alternative to codepen
 * refactor: using ref as a callback instead of string to fix react ref error
 * refactor: using if else statement instead of ternary to avoid multiple elements with same ref in render
 * fix: typos in README and Carousel.js
 * feat: add property to enable and disable swiping
 * Revert "Automating gh-pages publishing"

This reverts commit 3dfb04ff2f69200c7f68ae060e5945d7fc3deaf9.
 * Automating gh-pages publishing


## 3.1.28 - Sat Oct 21 2017
 * Add centerSlidePercentage
 * Fix last centered slide position calculation
 * Add centerMode prop
- Update README
- Add tests
- Add stories to Storybook
 * Create CODE_OF_CONDUCT.md
 * Add license scan report and status


## 3.1.27 - Tue Sep 26 2017
 * #151: Autoplay keeps trying to transition after the component has been unmounted


## 3.1.26 - Fri Sep 22 2017


## 3.1.25 - Sat Aug 26 2017


## 3.1.24 - Wed Jul 05 2017


## 3.1.23 - Tue Jul 04 2017


## 3.1.22 - Mon Jul 03 2017


## 3.1.21 - Sun Jun 25 2017


## 3.1.20 - Sat Jun 24 2017


## 3.1.19 - Mon May 29 2017


## 3.1.18 - Mon May 29 2017


## 3.1.17 - Mon May 22 2017


## 3.1.16 - Thu May 11 2017


## 3.1.15 - Sun Apr 30 2017


## 3.1.14 - Sat Apr 29 2017


## 3.1.13 - Sat Apr 29 2017


## 3.1.12 - Sat Apr 29 2017


## 3.1.11 - Wed Apr 26 2017


## 3.1.10 - Tue Apr 25 2017


## 3.1.9 - Mon Apr 24 2017


## 3.1.8 - Mon Apr 24 2017


## 3.1.7 - Mon Apr 24 2017


## 3.1.6 - Wed Apr 19 2017


## 3.1.5 - Sun Mar 26 2017


## 3.1.4 - Sun Mar 26 2017


## 3.1.3 - Sat Mar 11 2017


## 3.1.2 - Sun Feb 26 2017


## 3.1.1 - Sun Feb 26 2017


## 3.1.0 - Fri Feb 10 2017


## 3.0.23 - Fri Feb 10 2017


## 3.0.22 - Sun Jan 29 2017


## 3.0.21 - Mon Sep 26 2016


## 3.0.20 - Sun Sep 25 2016


## 3.0.19 - Sat Sep 24 2016


## 3.0.18 - Fri Sep 16 2016


## 3.0.17 - Wed Sep 14 2016


## 3.0.16 - Sat Sep 10 2016


## 3.0.15 - Wed Sep 07 2016


## 3.0.14 - Wed Sep 07 2016


## 3.0.13 - Sun Aug 28 2016


## 3.0.12 - Sun Jun 05 2016


## 3.0.11 - Fri Apr 15 2016


## 3.0.10 - Thu Mar 17 2016


## 3.0.9 - Tue Jan 19 2016


## 3.0.8 - Sat Jan 16 2016


## 3.0.7 - Sat Jan 16 2016


## 3.0.6 - Thu Jan 14 2016


## 3.0.5 - Wed Jan 13 2016


## 3.0.4 - Fri Jan 08 2016


## 3.0.3 - Fri Jan 08 2016


## 3.0.2 - Thu Jan 07 2016


## 3.0.1 - Thu Jan 07 2016


## 3.0.0 - Thu Jan 07 2016


## 2.0.2 - Thu Nov 26 2015


## 2.0.1 - Sat Nov 21 2015


## 2.0.0 - Sat Nov 21 2015


## 0.1.6 - Sat Aug 08 2015


## 0.1.5 - Sat Aug 08 2015


## 0.1.4 - Tue Jun 30 2015


## 0.1.3 - Tue May 19 2015


## 0.1.2 - Tue May 19 2015


## 0.1.1 - Sun May 17 2015


## 0.1.0 - Wed Mar 11 2015


## 0.0.11 - Wed Feb 11 2015


## 0.0.10 - Mon Feb 09 2015


## 0.0.9 - Mon Feb 09 2015


## 0.0.8 - Mon Feb 09 2015


## 0.0.7 - Mon Feb 09 2015


## 0.0.6 - Mon Feb 09 2015


## 0.0.5 - Mon Feb 09 2015


## 0.0.4 - Mon Feb 09 2015


## 0.0.3 - Mon Feb 09 2015


## 0.0.2 - Mon Feb 09 2015


## 0.0.1 - Mon Feb 09 2015