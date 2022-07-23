import test from 'ava';
import { dataPath, matchDoubleQuotedString, matchSingleQuotedString, splitDataPath } from '../../src/Badger/Utils/DataPath.js';

//console.log(matchDoubleQuotedString('"hello"'))
//console.log(matchDoubleQuotedString('"hello\\nworld"'))

//-----------------------------------------------------------------------------
// Double quoted strings
//-----------------------------------------------------------------------------
test(
  'matchDoubleQuotedString("hello")',
  t => t.is(matchDoubleQuotedString('"hello"'), 'hello')
);
test(
  'matchDoubleQuotedString("hello world")',
  t => t.is(matchDoubleQuotedString('"hello world"'), 'hello world')
);
test(
  'matchDoubleQuotedString("hello\\\\nobody")',
  t => t.is(matchDoubleQuotedString('"hello\\\\nobody"'), 'hello\\nobody')
);
test(
  'matchDoubleQuotedString("hello\\nworld")',
  t => t.is(matchDoubleQuotedString('"hello\\nworld"'), "hello\nworld")
);
test(
  'matchDoubleQuotedString("hello\\rworld")',
  t => t.is(matchDoubleQuotedString('"hello\\rworld"'), "hello\rworld")
);
test(
  'matchDoubleQuotedString("hello\\tworld")',
  t => t.is(matchDoubleQuotedString('"hello\\tworld"'), "hello\tworld")
);
test(
  'matchDoubleQuotedString("hello\\"world")',
  t => t.is(matchDoubleQuotedString('"hello\\"world"'), 'hello"world')
);
test(
  'matchDoubleQuotedString("hello\\world")',
  t => t.is(matchDoubleQuotedString('"hello\\world"'), 'hello\\world')
);


//-----------------------------------------------------------------------------
// Single quoted strings
//-----------------------------------------------------------------------------
test(
  "matchSingleQuotedString('hello')",
  t => t.is(matchSingleQuotedString("'hello'"), 'hello')
);
test(
  "matchSingleQuotedString('hello world')",
  t => t.is(matchSingleQuotedString("'hello world'"), 'hello world')
);
test(
  "matchSingleQuotedString('hello\\\\nobody')",
  t => t.is(matchSingleQuotedString("'hello\\\\nobody'"), 'hello\\nobody')
);
test(
  "matchSingleQuotedString('hello\\nworld')",
  t => t.is(matchSingleQuotedString("'hello\\nworld'"), 'hello\nworld')
);
test(
  "matchSingleQuotedString('hello\\rworld')",
  t => t.is(matchSingleQuotedString("'hello\\rworld'"), 'hello\rworld')
);
test(
  "matchSingleQuotedString('hello\\tworld')",
  t => t.is(matchSingleQuotedString("'hello\\tworld'"), 'hello\tworld')
);
test(
  "matchSingleQuotedString('hello\\'world')",
  t => t.is(matchSingleQuotedString("'hello\\'world'"), "hello'world")
);
test(
  "matchSingleQuotedString('hello\\world')",
  t => t.is(matchSingleQuotedString("'hello\\world'"), 'hello\\world')
);

//-----------------------------------------------------------------------------
// splitDataPath
//-----------------------------------------------------------------------------
test(
  "splitDataPath('') => []",
  t => t.deepEqual( splitDataPath(''), [] )
);
test(
  "splitDataPath('foo') => ['foo']",
  t => t.deepEqual( splitDataPath('foo'), ['foo'] )
);
test(
  "splitDataPath('/foo') => ['foo']",
  t => t.deepEqual( splitDataPath('/foo'), ['foo'] )
);
test(
  "splitDataPath('/foo/') => ['foo']",
  t => t.deepEqual( splitDataPath('/foo/'), ['foo'] )
);
test(
  "splitDataPath('//foo//') => ['foo']",
  t => t.deepEqual( splitDataPath('/foo/'), ['foo'] )
);

test(
  "splitDataPath('foo/bar') => ['foo', 'bar']",
  t => t.deepEqual( splitDataPath('foo/bar'), ['foo', 'bar'] )
);
test(
  "splitDataPath('/foo/bar') => ['foo', 'bar']",
  t => t.deepEqual( splitDataPath('/foo/bar'), ['foo', 'bar'] )
);
test(
  "splitDataPath('/foo/bar/') => ['foo', 'bar']",
  t => t.deepEqual( splitDataPath('/foo/bar/'), ['foo', 'bar'] )
);
test(
  "splitDataPath('//foo//bar//') => ['foo', 'bar']",
  t => t.deepEqual( splitDataPath('//foo/bar//'), ['foo', 'bar'] )
);

test(
  "splitDataPath('\"foo\"/\"bar\"') => ['foo', 'bar']",
  t => t.deepEqual( splitDataPath('"foo"/"bar"'), ['foo', 'bar'] )
);
test(
  "splitDataPath('/\"foo\"/\"bar\"') => ['foo', 'bar']",
  t => t.deepEqual( splitDataPath('/"foo"/"bar"'), ['foo', 'bar'] )
);
test(
  "splitDataPath('/\"foo\"/\"bar\"/') => ['foo', 'bar']",
  t => t.deepEqual( splitDataPath('/"foo"/"bar"/'), ['foo', 'bar'] )
);
test(
  "splitDataPath('//\"foo\"//\"bar\"//') => ['foo', 'bar']",
  t => t.deepEqual( splitDataPath('//"foo"/"bar"//'), ['foo', 'bar'] )
);

test(
  "splitDataPath('\"foo\\\"bar\"') => ['foo\"bar']",
  t => t.deepEqual( splitDataPath('"foo\\"bar"'), ['foo"bar'] )
);
test(
  'splitDataPath("\'foo\\\'bar\'") => ["foo\'bar"]',
  t => t.deepEqual( splitDataPath("'foo\\'bar'"), ["foo'bar"] )
);

test(
  'splitDataPath("hello world!") => ["hello world!"]',
  t => t.deepEqual( splitDataPath("hello world!"), ["hello world!"] )
);

test(
  'splitDataPath("99") => ["99"]',
  t => t.deepEqual( splitDataPath("99"), ["99"] )
);

test(
  'splitDataPath("foo?") => [["foo", { optional: true}]]',
  t => t.deepEqual( splitDataPath("foo?"), [["foo", { optional: true }]] )
);
test(
  'splitDataPath("foo?bar") => [[foo", { optional: true}]]',
  t => t.deepEqual( splitDataPath("foo?bar"), [["foo", { optional: true }], "bar"] )
);


//-----------------------------------------------------------------------------
// dataPath
//-----------------------------------------------------------------------------
const testData = {
  foo: 'The foo item',
  bar: {
    baz: 'The bar/baz item',
    boz: 'The bar/boz item',
    buz: {
      wig: 'The bar/buz/wig item',
      wam: 'The bar/buz/wam item',
      bam: 'The bar/buz/bam item',
    }
  },
  animal: [
    "aardvark",
    "badger",
    ["colin", "cat"],
    {
      name: "Derek",
      type: "Dog",
    }
  ]
}

test(
  'dataPath foo',
  t => t.is( dataPath(testData, 'foo'), 'The foo item' )
)
test(
  'dataPath bar/baz',
  t => t.is( dataPath(testData, 'bar/baz'), 'The bar/baz item' )
)
test(
  'dataPath bar/boz',
  t => t.is( dataPath(testData, 'bar/boz'), 'The bar/boz item' )
)
test(
  'dataPath bar/buz/wig',
  t => t.is( dataPath(testData, 'bar/buz/wig'), 'The bar/buz/wig item' )
)
test(
  'dataPath bar/buz/wam',
  t => t.is( dataPath(testData, 'bar/buz/wam'), 'The bar/buz/wam item' )
)
test(
  'dataPath animal/0',
  t => t.is( dataPath(testData, 'animal/0'), 'aardvark' )
)
test(
  'dataPath animal/1',
  t => t.is( dataPath(testData, 'animal/1'), 'badger' )
)
test(
  'dataPath animal/2/0',
  t => t.is( dataPath(testData, 'animal/2/0'), 'colin' )
)
test(
  'dataPath animal/2/1',
  t => t.is( dataPath(testData, 'animal/2/1'), 'cat' )
)
test(
  'dataPath animal/3/name',
  t => t.is( dataPath(testData, 'animal/3/name'), 'Derek' )
)
test(
  'dataPath animal/3/type',
  t => t.is( dataPath(testData, 'animal/3/type'), 'Dog' )
)

//-----------------------------------------------------------------------------
// Missing data
//-----------------------------------------------------------------------------
test(
  'dataPath missing is missing',
  t => {
    const error = t.throws( () => dataPath(testData, 'missing') );
    t.is(error.message, "No value for data at path: missing");
  }
)
test(
  'dataPath missing/thing is missing',
  t => {
    const error = t.throws( () => dataPath(testData, 'missing/thing') );
    t.is(error.message, "No value for data at path: missing");
  }
)
test(
  'dataPath foo/wibble is missing',
  t => {
    const error = t.throws( () => dataPath(testData, 'foo/wibble') );
    t.is(error.message, "No value for data at path: foo/wibble");
  }
)

//-----------------------------------------------------------------------------
// Missing data is allowed
//-----------------------------------------------------------------------------
test(
  'dataPath missing? is undefined',
  t => t.is( dataPath(testData, 'missing?'), undefined )
)
test(
  'dataPath missing?/thing is undefined',
  t => t.is( dataPath(testData, 'missing?/thing'), undefined )
)
test(
  'dataPath bar/wibble? is undefined',
  t => t.is( dataPath(testData, 'bar/wibble?'), undefined )
)
test(
  'dataPath foo/bar? is undefined',
  t => t.is( dataPath(testData, 'foo/bar?'), undefined )
)
test(
  'dataPath food/wibble? throws an error',
  t => {
    const error = t.throws( () => dataPath(testData, 'food/wibble?') );
    t.is(error.message, "No value for data at path: food");
  }
)
test(
  'dataPath foo?d/wibble throws an error',
  t => {
    const error = t.throws( () => dataPath(testData, 'foo?d/wibble') );
    t.is(error.message, "No value for data at path: foo/d");
  }
)
