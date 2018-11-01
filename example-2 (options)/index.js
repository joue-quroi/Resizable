/* globals Resizable */
'use strict';

[...document.querySelectorAll('table')].map(table => new Resizable(table, {
  'persist': true, // to save and restore,
  'width': 8, // width of the draggable
  'offset': 3, // offset for placing the draggable
  'min': 50, // minimum block size
  'background-color': 'rgba(0, 0, 0, 0.3)'
}));

