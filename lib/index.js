/* eslint-disable no-magic-numbers */
const Jenkins = require( './jenkins' )
const toBinary = require( './to-binary' )

function simhash( tokens = [] ) {
  const jenkins = new Jenkins()
  return tokens
    .map( token => {
      const { text, weight } = token

      // 转 hash
      const hash = toBinary( jenkins.hash64( text ) )

      // 加权
      let array = []
      for ( let i = 0, len = hash.length; i < len; i++ ) {
        const char = parseInt( hash[ i ], 10 )
        let sign = -1

        if ( char > 0 ) {
          sign = 1
        }

        array.push( sign * weight )
      }

      return array
    } )
    // 合并
    .reduce( ( memo, current ) => {
      if ( !memo ) {
        return [ ...current ]
      }

      return memo.map( ( m, i ) => {
        return m + current[ i ]
      } )
    }, null )
    // 降维
    .map( v => {
      if ( v > 0 ) {
        return 1
      }

      return 0
    } )
    .join( '' )
}

function similarity( a, b ) {
  let count = 0

  for ( var i = 0; i < a.length; i++ ) {
    if ( a[ i ] === b[ i ] ) {
      count++
    }
  }

  return count / a.length
}

exports.simhash = simhash
exports.similarity = similarity

