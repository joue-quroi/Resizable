## Resizable
Download the entire project and run example-1 and example-2.

![screen shot 2018-11-01 at 8 24 35 am](https://user-images.githubusercontent.com/34792435/47838405-696fc180-de03-11e8-8478-595c8fe8557c.png)

### Usage:
#### Basic call
```js
new Resizable(document.getElementById('my-table'));
```
#### Advanced call
```js
[...document.querySelectorAll('table')].map(table => new Resizable(table, {
  'persist': true, // to save and restore,
  'width': 8, // width of the draggable
  'offset': 3, // offset for placing the draggable
  'min': 50, // minimum block size
  'background-color': 'rgba(0, 0, 0, 0.3)'
}));
```

Pull requests are always welcome!

