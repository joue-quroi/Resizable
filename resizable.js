'use strict';

var Resizable = function(e, opts = {}) {
  this.element = e;
  this.opts = e;
  e.style.position = 'relative';

  opts = Object.assign({
    'width': 6, // width of the draggable
    'offset': 6, // offset for placing the draggable
    'min': 50, // minimum block size
    'background-color': 'rgba(0, 0, 0, 0.1)'
  }, opts);
  //
  const storage = [...e.querySelectorAll('tr:first-child td')].map(td => ({
    td
  }));
  this.storage = storage;
  // add col elements to the storage; create more if needed
  {
    const parent = e.querySelector('colgroup') || e;
    const cols = [...e.querySelectorAll('col')].slice(0, storage.length);
    for (let i = 0; i < cols.length; i += 1) {
      storage[i].col = cols[i];
    }
    for (let i = cols.length; i < storage.length; i += 1) { // we need equal number of col elements
      const col = document.createElement('col');
      storage[i].col = col;
      parent.appendChild(col);
    }
  }
  // restore
  if (opts.persist) {
    this.restore();
  }
  //
  storage.forEach(o => {
    o.width = o.td.getBoundingClientRect().width;
  });
  // save table width
  const width = storage.reduce((p, c) => p + c.width, 0);
  // set width for each col element
  [...e.querySelectorAll('col')].slice(0, storage.length).forEach((col, i) => {
    col.width = (storage[i].width / width * 100) + '%';
  });
  // draggables
  storage.slice(0, -1).forEach((o, i) => {
    const div = document.createElement('div');
    div.classList.add('draggable');
    Object.assign(div.style, {
      'position': 'absolute',
      'width': opts.width + 'px',
      'height': '100%',
      'top': 0,
      'cursor': 'col-resize',
      'background-color': opts['background-color']
    });
    let index = 0; // active storage for movement
    const move = e => {
      const delta = e.movementX;
      if (storage[index].width + delta < opts.min || storage[index + 1].width - delta < opts.min) {
        return;
      }
      storage[index].width += delta;
      storage[index + 1].width -= delta;
      // apply changes
      storage[index].col.width = (storage[index].width / width * 100) + '%';
      place();
    };

    div.addEventListener('mousedown', e => {
      for (const o of storage) {
        if (o.div === e.target) {
          index = storage.indexOf(o);
          break;
        }
      }
      storage[index + 1].col.removeAttribute('width');
      window.addEventListener('mousemove', move, true);
      window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', move, true);
        storage[index + 1].width = storage[index + 1].td.getBoundingClientRect().width;
        storage[index + 1].col.width = (storage[index + 1].width / width * 100) + '%';
        if (opts.persist) {
          this.save();
        }
      });
    });
    e.appendChild(div);
    storage[i].div = div;
  });

  // positioning
  const place = () => storage.slice(0, -1).forEach(o => {
    o.div.style.left = o.td.getBoundingClientRect().right - opts.width - opts.offset + 'px';
  });
  place();
};
Resizable.prototype.id = function(id) {
  const sid = id || this.opts.id || this.element.id || this.element.name;
  return sid ? 'resizable-' + sid : '';
};
Resizable.prototype.save = function(id) {
  const sid = this.id(id);
  if (sid) {
    localStorage.setItem(sid, JSON.stringify(this.storage.map(o => {
      return o.td.getBoundingClientRect().width;
    })));
  }
  else {
    throw Error('to save state, storage id is required');
  }
};
Resizable.prototype.restore = function(id) {
  const sid = this.id(id);
  if (sid) {
    const data = localStorage.getItem(sid);
    if (data) {
      JSON.parse(data).forEach((width, i) => {
        this.storage[i].col.width = width + 'px';
      });
    }
  }
  else {
    console.warn('to restore state, storage id is required');
  }
};