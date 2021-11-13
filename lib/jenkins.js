/* eslint-disable no-magic-numbers */
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
/**
 * Jenkins hash implementation which yeilds 32-bit and 64-bit hashes.
 *
 * See https://github.com/vkandy/jenkins-hash-js
 */
class Jenkins {
  constructor() {
    /**
         * Default first initial seed.
         */
    this.pc = 0

    /**
         * Default second initial seed.
         */
    this.pb = 0
  }

  // --------------------------------------------------
  // Public access
  // --------------------------------------------------

  /**
     * Computes and returns 32-bit hash of given message.
     */
  hash32( msg ) {
    var h = lookup3( msg, this.pc, this.pb )
    return ( h.c ).toString( 16 )
  }

  /**
     * Computes and returns 32-bit hash of given message.
     */
  hash64( msg ) {
    var h = lookup3( msg, this.pc, this.pb )
    return ( h.b ).toString( 16 ) + ( h.c ).toString( 16 )
  }
}

// --------------------------------------------------
// Private methods
// --------------------------------------------------

/**
 * Implementation of lookup3 algorithm.
 */
function lookup3( k, pc, pb ) {
  var length = k.length
  var a, b, c
  var mixed

  a = b = c = 0xdeadbeef + length + pc
  c = c + pb

  var offset = 0
  while ( length > 12 ) {
    a = a + k.charCodeAt( offset + 0 )
    a = a + ( k.charCodeAt( offset + 1 ) << 8 )
    a = a + ( k.charCodeAt( offset + 2 ) << 16 )
    a = a + ( k.charCodeAt( offset + 3 ) << 24 )

    b = b + k.charCodeAt( offset + 4 )
    b = b + ( k.charCodeAt( offset + 5 ) << 8 )
    b = b + ( k.charCodeAt( offset + 6 ) << 16 )
    b = b + ( k.charCodeAt( offset + 7 ) << 24 )

    c = c + k.charCodeAt( offset + 8 )
    c = c + ( k.charCodeAt( offset + 9 ) << 8 )
    c = c + ( k.charCodeAt( offset + 10 ) << 16 )
    c = c + ( k.charCodeAt( offset + 11 ) << 24 )

    mixed = mix( a, b, c )
    a = mixed.a
    b = mixed.b
    c = mixed.c

    length = length - 12
    offset = offset + 12
  }

  switch ( length ) {
  case 12:
    c = c + ( k.charCodeAt( offset + 11 ) << 24 )
  case 11:
    c = c + ( k.charCodeAt( offset + 10 ) << 16 )
  case 10:
    c = c + ( k.charCodeAt( offset + 9 ) << 8 )
  case 9:
    c = c + k.charCodeAt( offset + 8 )

  case 8:
    b = b + ( k.charCodeAt( offset + 7 ) << 24 )
  case 7:
    b = b + ( k.charCodeAt( offset + 6 ) << 16 )
  case 6:
    b = b + ( k.charCodeAt( offset + 5 ) << 8 )
  case 5:
    b = b + k.charCodeAt( offset + 4 )

  case 4:
    a = a + ( k.charCodeAt( offset + 3 ) << 24 )
  case 3:
    a = a + ( k.charCodeAt( offset + 2 ) << 16 )
  case 2:
    a = a + ( k.charCodeAt( offset + 1 ) << 8 )
  case 1:
    a = a + k.charCodeAt( offset + 0 )
    break

  case 0:
    return { c: c >>> 0, b: b >>> 0 }
  }

  // Final mixing of three 32-bit values in to c
  mixed = finalMix( a, b, c )
  a = mixed.a
  b = mixed.b
  c = mixed.c

  return { c: c >>> 0, b: b >>> 0 }
}

/**
 * Mixes 3 32-bit integers reversibly but fast.
 */
function mix( a, b, c ) {
  a = a - c
  a = a ^ rot( c, 4 )
  c = c + b
  b = b - a
  b = b ^ rot( a, 6 )
  a = a + c
  c = c - b
  c = c ^ rot( b, 8 )
  b = b + a
  a = a - c
  a = a ^ rot( c, 16 )
  c = c + b
  b = b - a
  b = b ^ rot( a, 19 )
  a = a + c
  c = c - b
  c = c ^ rot( b, 4 )
  b = b + a
  return { a: a, b: b, c: c }
}

/**
 * Final mixing of 3 32-bit values (a,b,c) into c
 */
function finalMix( a, b, c ) {
  c = c ^ b
  c = c - rot( b, 14 )
  a = a ^ c
  a = a - rot( c, 11 )
  b = b ^ a
  b = b - rot( a, 25 )
  c = c ^ b
  c = c - rot( b, 16 )
  a = a ^ c
  a = a - rot( c, 4 )
  b = b ^ a
  b = b - rot( a, 14 )
  c = c ^ b
  c = c - rot( b, 24 )
  return { a: a, b: b, c: c }
}

/**
 * Rotate x by k distance.
 */
function rot( x, k ) {
  return ( ( ( x ) << ( k ) ) | ( ( x ) >> ( 32 - ( k ) ) ) )
}

module.exports = Jenkins
