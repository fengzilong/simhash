# simhash

## Installation

```bash
npm i @biu/simhash
```

## Usage

```js
const { simhash, similarity } = require( '@biu/simhash' )

const hash1 = simhash( [
  {
    text: '你',
    weight: 1,
  },
  {
    text: '好',
    weight: 1,
  },
  {
    text: '世界',
    weight: 2,
  }
] )

const hash2 = simhash( [
  {
    text: '你',
    weight: 1,
  },
  {
    text: '呀',
    weight: 1,
  },
  {
    text: '世界',
    weight: 1,
  }
] )

console.log( similarity( hash1, hash2 ) ) // -> 0.78125
```

## License

MIT