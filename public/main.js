var Example = (function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var defineProperty = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $map = arrayIteration.map;



	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
	// FF49- issue
	var USES_TO_LENGTH = arrayMethodUsesToLength('map');

	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (typeof call === "object" || typeof call === "function")) {
	    return call;
	  }

	  return _assertThisInitialized(self);
	}

	function _createSuper(Derived) {
	  var hasNativeReflectConstruct = _isNativeReflectConstruct();

	  return function _createSuperInternal() {
	    var Super = _getPrototypeOf(Derived),
	        result;

	    if (hasNativeReflectConstruct) {
	      var NewTarget = _getPrototypeOf(this).constructor;

	      result = Reflect.construct(Super, arguments, NewTarget);
	    } else {
	      result = Super.apply(this, arguments);
	    }

	    return _possibleConstructorReturn(this, result);
	  };
	}

	class EventTarget {    
	    constructor() {
	        this.listeners = {};
	    }
	    addEventListener(type, callback) {
	        if(!(type in this.listeners)) {
	            this.listeners[type] = [];
	        }
	        this.listeners[type].push(callback);
	    }
	    on(type, callback) {
	        this.addEventListener(type, callback);
	        return this;
	    }
	    removeEventListener (type, callback) {
	        if(!(type in this.listeners)) {
	            return;
	        }
	        let stack = this.listeners[type];
	        for(let i = 0, l = stack.length; i < l; i++) {
	            if(stack[i] === callback){
	                stack.splice(i, 1);
	                return this.removeEventListener(type, callback);
	            }
	        }
	    }
	    off(type, callback) {
	        this.removeEventListener(type, callback);
	        return this;
	    }
	    dispatchEvent(event) {
	        if(!(event.type in this.listeners)) {
	            return;
	        }
	        let stack = this.listeners[event.type];
		    Object.defineProperty(event, 'target', {
	            enumerable: false,
	            configurable: false,
	            writable: false,
	            value: this
	        });
	        for(let i = 0, l = stack.length; i < l; i++) {
	            stack[i].call(this, event);
	        }
	    }
	    
	}

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return nativeGetOwnPropertyNames(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$5 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$5
	};

	var f$6 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$6
	};

	var defineProperty$1 = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!has(Symbol, NAME)) defineProperty$1(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	var defineProperty$2 = objectDefineProperty.f;



	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
	    defineProperty$2(it, TO_STRING_TAG, { configurable: true, value: TAG });
	  }
	};

	var $forEach = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(SYMBOL);
	var ObjectPrototype = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty$1 = objectDefineProperty.f;
	var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore$1 = shared('wks');
	var QObject = global_1.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
	  nativeDefineProperty$1(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
	    nativeDefineProperty$1(ObjectPrototype, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return Object(it) instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPrimitive(P, true);
	  anObject(Attributes);
	  if (has(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty$1(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPrimitive(V, true);
	  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
	  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPrimitive(P, true);
	  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
	  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
	      result.push(AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.github.io/ecma262/#sec-symbol-constructor
	if (!nativeSymbol) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState(this).tag;
	  });

	  redefine($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid(description), description);
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
	  objectDefineProperty.f = $defineProperty;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  wellKnownSymbolWrapped.f = function (name) {
	    return wrap(wellKnownSymbol(name), name);
	  };

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState(this).description;
	      }
	    });
	    {
	      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
	    }
	  }
	}

	_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
	  defineWellKnownSymbol(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
	  // `Symbol.for` method
	  // https://tc39.github.io/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = String(key);
	    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
	    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  },
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.github.io/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return objectGetOwnPropertySymbols.f(toObject(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.github.io/ecma262/#sec-json.stringify
	if ($stringify) {
	  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
	    var symbol = $Symbol();
	    // MS Edge converts symbol values to JSON as {}
	    return $stringify([symbol]) != '[null]'
	      // WebKit converts symbol values to JSON as null
	      || $stringify({ a: symbol }) != '{}'
	      // V8 throws on boxed symbols
	      || $stringify(Object(symbol)) != '{}';
	  });

	  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
	    // eslint-disable-next-line no-unused-vars
	    stringify: function stringify(it, replacer, space) {
	      var args = [it];
	      var index = 1;
	      var $replacer;
	      while (arguments.length > index) args.push(arguments[index++]);
	      $replacer = replacer;
	      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	      if (!isArray(replacer)) replacer = function (key, value) {
	        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	        if (!isSymbol(value)) return value;
	      };
	      args[1] = replacer;
	      return $stringify.apply(null, args);
	    }
	  });
	}

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
	  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
	}
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;

	var defineProperty$3 = objectDefineProperty.f;


	var NativeSymbol = global_1.Symbol;

	if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var result = this instanceof SymbolWrapper
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };
	  copyConstructorProperties(SymbolWrapper, NativeSymbol);
	  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
	  symbolPrototype.constructor = SymbolWrapper;

	  var symbolToString = symbolPrototype.toString;
	  var native = String(NativeSymbol('test')) == 'Symbol(test)';
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  defineProperty$3(symbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = isObject(this) ? this.valueOf() : this;
	      var string = symbolToString.call(symbol);
	      if (has(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  _export({ global: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var $forEach$1 = arrayIteration.forEach;



	var STRICT_METHOD = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH$1) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod$2 = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aFunction$1(callbackfn);
	    var O = toObject(that);
	    var self = indexedObject(O);
	    var length = toLength(O.length);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError('Reduce of empty array with no initial value');
	      }
	    }
	    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	  left: createMethod$2(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$2(true)
	};

	var $reduce = arrayReduce.left;



	var STRICT_METHOD$1 = arrayMethodIsStrict('reduce');
	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('reduce', { 1: 0 });

	// `Array.prototype.reduce` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$1 || !USES_TO_LENGTH$2 }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	//     var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	//         var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	//          return v.toString(16);
	//     });
	//     return guid;
	// }

	var Layer = /*#__PURE__*/function (_EventTarget) {
	  _inherits(Layer, _EventTarget);

	  var _super = _createSuper(Layer);

	  function Layer(container, _ref) {
	    var _this;

	    var properties = _ref.properties,
	        geometry = _ref.geometry;

	    _classCallCheck(this, Layer);

	    _this = _super.call(this);
	    _this._container = container;

	    _this.render(_this._container);

	    _this._properties = properties;
	    _this._geometry = geometry;

	    _this._init();

	    _this._type.addEventListener('click', _this._onClick.bind(_assertThisInitialized(_this)));

	    _this._title.addEventListener('click', _this._onClick.bind(_assertThisInitialized(_this)));

	    return _this;
	  }

	  _createClass(Layer, [{
	    key: "_onClick",
	    value: function _onClick(e) {
	      e.stopPropagation();
	      var event = document.createEvent('Event');
	      event.initEvent('node:click', false, false);
	      event.detail = this;
	      this.dispatchEvent(event);
	    }
	  }, {
	    key: "enumerate",
	    value: function enumerate(start) {
	      this._order = start;
	      return this._order;
	    }
	  }, {
	    key: "redraw",
	    value: function redraw(filter) {
	      if (this.visible && (typeof filter !== 'function' || filter(this))) {
	        var event = document.createEvent('Event');
	        event.initEvent('node:redraw', false, false);
	        event.detail = this;
	        this.dispatchEvent(event);
	      }
	    }
	  }, {
	    key: "_init",
	    value: function _init() {
	      if (this._properties.visible) {
	        this._visibility.classList.remove('square');

	        this._visibility.classList.add('check-square');
	      } else {
	        this._visibility.classList.remove('check-square');

	        this._visibility.classList.add('square');
	      }

	      this._visibility.addEventListener('click', this._toggleVisibility.bind(this));

	      switch (this._properties.type) {
	        case 'Vector':
	          if (this.temporal) {
	            this._type.classList.add('clock');
	          } else {
	            this._type.classList.add('block');
	          }

	          break;

	        case 'Raster':
	          this._type.classList.add('picture');

	          break;

	        case 'Virtual':
	          if (this.temporal) {
	            this._type.classList.add('clock');
	          } else {
	            this._type.classList.add('cloud');
	          }

	          break;
	      }

	      this._title.innerText = this.title;
	    }
	  }, {
	    key: "_toggleVisibility",
	    value: function _toggleVisibility(e) {
	      e.stopPropagation();
	      this.visible = !this.visible;
	    }
	  }, {
	    key: "render",
	    value: function render(container) {
	      this._element = document.createElement('div');

	      this._element.classList.add('scanex-layer-tree-layer');

	      this._header = document.createElement('div');

	      this._header.classList.add('scanex-layer-tree-header');

	      this._element.appendChild(this._header);

	      this._visibility = document.createElement('i');

	      this._visibility.classList.add('scanex-layer-tree-visibility');

	      this._visibility.classList.add('scanex-layer-tree-icon');

	      this._header.appendChild(this._visibility);

	      this._type = document.createElement('i');

	      this._type.classList.add('scanex-layer-tree-type');

	      this._type.classList.add('scanex-layer-tree-icon');

	      this._header.appendChild(this._type);

	      this._title = document.createElement('label');

	      this._title.classList.add('scanex-layer-tree-title');

	      this._header.appendChild(this._title);

	      container.appendChild(this._element);
	    }
	  }, {
	    key: "order",
	    get: function get() {
	      return this._order;
	    }
	  }, {
	    key: "temporal",
	    get: function get() {
	      return !!this._properties.Temporal;
	    }
	  }, {
	    key: "geometry",
	    get: function get() {
	      return this._geometry;
	    }
	  }, {
	    key: "properties",
	    get: function get() {
	      return this._properties;
	    },
	    set: function set(properties) {
	      this._properties = properties;
	      this._title.innerText = this._properties.title;
	    }
	  }, {
	    key: "title",
	    get: function get() {
	      return this._properties.title;
	    },
	    set: function set(title) {
	      this._properties.title = title;
	      this._title.innerText = this._properties.title;
	    }
	  }, {
	    key: "description",
	    get: function get() {
	      return this._properties.description;
	    },
	    set: function set(description) {
	      this._properties.description = description;
	    }
	  }, {
	    key: "visible",
	    get: function get() {
	      return typeof this._properties.visible === 'boolean' ? this._properties.visible : false;
	    },
	    set: function set(value) {
	      if (this.visible !== value) {
	        if (value) {
	          this._visibility.classList.remove('square');

	          this._visibility.classList.add('check-square');

	          this._properties.visible = true;
	        } else {
	          this._visibility.classList.remove('check-square');

	          this._visibility.classList.add('square');

	          this._properties.visible = false;
	        }

	        var visibilityEvent = document.createEvent('Event');
	        visibilityEvent.initEvent('change:visible', false, false);
	        this.dispatchEvent(visibilityEvent);
	        var stateEvent = document.createEvent('Event');
	        stateEvent.initEvent('change:state', false, false);
	        stateEvent.detail = this;
	        this.dispatchEvent(stateEvent);
	      }
	    }
	  }, {
	    key: "type",
	    get: function get() {
	      return this._properties.type;
	    }
	  }]);

	  return Layer;
	}(EventTarget);

	var Group = /*#__PURE__*/function (_EventTarget) {
	  _inherits(Group, _EventTarget);

	  var _super = _createSuper(Group);

	  function Group(container, expand) {
	    var _this;

	    _classCallCheck(this, Group);

	    _this = _super.call(this);
	    _this._container = container;
	    _this._items = [];
	    _this.expand = expand;
	    return _this;
	  }

	  _createClass(Group, [{
	    key: "_forwardEvent",
	    value: function _forwardEvent(e) {
	      e.stopPropagation();
	      var event = document.createEvent('Event');
	      event.initEvent(e.type, false, false);
	      event.detail = e.detail;
	      this.dispatchEvent(event);
	    }
	  }, {
	    key: "getLayers",
	    value: function getLayers(filter) {
	      return this._items.length > 0 ? this._items.reduce(function (a, item) {
	        if (item instanceof Group) {
	          return a.concat(item.getLayers(filter));
	        } else if (typeof filter !== 'function' || filter(item)) {
	          return a.concat(item);
	        } else {
	          return a;
	        }
	      }, []) : [];
	    }
	  }, {
	    key: "enumerate",
	    value: function enumerate(start, select) {
	      return this._items.length > 0 ? this._items.reduce(function (a, item) {
	        if (typeof select === 'function') {
	          return select(item) ? item.enumerate(a + 1, select) : a;
	        } else {
	          return item.enumerate(a + 1);
	        }
	      }, start) : start;
	    }
	  }, {
	    key: "redraw",
	    value: function redraw(filter) {
	      this._items.forEach(function (item) {
	        if (!(typeof item.visible === 'boolean' && !item.visible)) {
	          item.redraw(filter);
	        }
	      });
	    }
	  }, {
	    key: "update",
	    value: function update(_ref) {
	      var properties = _ref.properties,
	          children = _ref.children;
	      this.destroy();
	      this.render(this._container);
	      this._properties = properties;

	      this._init(children);
	    }
	  }, {
	    key: "_init",
	    value: function _init(children) {
	      this._expanded = false;

	      this._folder.classList.add('folder-filled');

	      this._children.classList.add('scanex-layer-tree-hidden');

	      this._folder.addEventListener('click', this._toggleChildren.bind(this));

	      this._title.innerText = this.title;

	      this._visibility.addEventListener('click', this._toggleVisibility.bind(this));

	      this._initChildren(children);

	      this.expanded = !!this._properties.expanded;
	    }
	  }, {
	    key: "destroy",
	    value: function destroy() {
	      if (this._element) {
	        this._element.remove();
	      }
	    }
	  }, {
	    key: "_initChildren",
	    value: function _initChildren(children) {
	      var _this2 = this;

	      this._items = (Array.isArray(children) && children || []).map(function (_ref2) {
	        var content = _ref2.content,
	            type = _ref2.type;
	        var item;

	        if (type === 'group') {
	          item = new Group(_this2._children, _this2.expand);
	          item.update(content);
	        } else if (type === 'layer') {
	          item = new Layer(_this2._children, content);
	        }

	        item.addEventListener('change:visible', _this2._onChangeVisible.bind(_this2));
	        item.addEventListener('change:state', _this2._forwardEvent.bind(_this2));
	        item.addEventListener('node:redraw', _this2._forwardEvent.bind(_this2));
	        item.addEventListener('node:expanded', _this2._forwardEvent.bind(_this2));
	        item.addEventListener('node:click', _this2._forwardEvent.bind(_this2));
	        return item;
	      });
	      this._visible = this.childrenVisibility;

	      if (typeof this.visible === 'boolean') {
	        if (this.visible) {
	          this._visibility.classList.add('check-square');
	        } else {
	          this._visibility.classList.add('square');
	        }
	      } else {
	        this._visibility.classList.add('minus-square');
	      }
	    }
	  }, {
	    key: "_toggleChildren",
	    value: function _toggleChildren(e) {
	      e.stopPropagation();
	      this.expanded = !this.expanded;
	    }
	  }, {
	    key: "_toggleVisibility",
	    value: function _toggleVisibility(e) {
	      e.stopPropagation();
	      this.childrenVisibility = !this.visible;
	    }
	  }, {
	    key: "_onRedraw",
	    value: function _onRedraw(e) {
	      var event = document.createEvent('Event');
	      event.initEvent('node:redraw', false, false);
	      event.detail = e.detail;
	      this.dispatchEvent(event);
	    }
	  }, {
	    key: "_onExpanded",
	    value: function _onExpanded() {
	      var event = document.createEvent('Event');
	      event.initEvent('node:expanded', false, false);
	      this.dispatchEvent(event);
	    }
	  }, {
	    key: "_onChangeVisible",
	    value: function _onChangeVisible(e) {
	      e.stopPropagation();
	      this.visible = this.childrenVisibility;
	    }
	  }, {
	    key: "_handleExpand",
	    value: function _handleExpand(expanded) {
	      if (expanded) {
	        this._folder.classList.remove('folder-filled');

	        this._folder.classList.add('folder-open-filled');

	        this._children.classList.remove('scanex-layer-tree-hidden');

	        this._expanded = true;
	      } else {
	        this._folder.classList.remove('folder-open-filled');

	        this._folder.classList.add('folder-filled');

	        this._children.classList.add('scanex-layer-tree-hidden');

	        this._expanded = false;
	      }
	    }
	  }, {
	    key: "render",
	    value: function render(container) {
	      this._element = document.createElement('div');

	      this._element.classList.add('scanex-layer-tree-group');

	      this._header = document.createElement('div');

	      this._header.classList.add('scanex-layer-tree-header');

	      this._element.appendChild(this._header);

	      this._visibility = document.createElement('i');

	      this._visibility.classList.add('scanex-layer-tree-visibility');

	      this._visibility.classList.add('scanex-layer-tree-icon');

	      this._header.appendChild(this._visibility);

	      this._folder = document.createElement('i');

	      this._folder.classList.add('scanex-layer-tree-folder');

	      this._folder.classList.add('scanex-layer-tree-icon');

	      this._header.appendChild(this._folder);

	      this._title = document.createElement('label');

	      this._title.classList.add('scanex-layer-tree-title');

	      this._header.appendChild(this._title);

	      this._children = document.createElement('div');

	      this._children.classList.add('scanex-layer-tree-children');

	      this._element.appendChild(this._children);

	      container.appendChild(this._element);
	    }
	  }, {
	    key: "temporal",
	    get: function get() {
	      for (var i = 0; i < this._items.length; ++i) {
	        if (this._items[i].temporal) {
	          return true;
	        }
	      }

	      return false;
	    }
	  }, {
	    key: "items",
	    get: function get() {
	      return this._items;
	    }
	  }, {
	    key: "childrenVisibility",
	    get: function get() {
	      if (this._items.length === 0) {
	        return false;
	      }

	      var state = this._items.map(function (item) {
	        return item.visible;
	      });

	      var isTrue = true;

	      for (var i = 0; i < state.length; ++i) {
	        isTrue = isTrue && typeof state[i] === 'boolean' && state[i];
	      }

	      if (isTrue) {
	        return true;
	      }

	      var isFalse = true;

	      for (var _i = 0; _i < state.length; ++_i) {
	        isFalse = isFalse && typeof state[_i] === 'boolean' && !state[_i];
	      }

	      if (isFalse) {
	        return false;
	      }

	      return undefined;
	    },
	    set: function set(visible) {
	      var _this3 = this;

	      if (this._items.length === 0 && typeof this.expand === 'function') {
	        this.expand(this._properties).then(function (children) {
	          _this3._initChildren(children);

	          _this3._items.forEach(function (item) {
	            return item.visible = visible;
	          });

	          _this3._onExpanded();
	        }).catch(function (e) {
	          return console.log(e);
	        });
	      } else {
	        this._items.forEach(function (item) {
	          return item.visible = visible;
	        });
	      }
	    }
	  }, {
	    key: "properties",
	    get: function get() {
	      return this._properties;
	    },
	    set: function set(properties) {
	      this._properties = properties;
	    }
	  }, {
	    key: "title",
	    get: function get() {
	      return this._properties.title;
	    }
	  }, {
	    key: "description",
	    get: function get() {
	      return this._properties.description;
	    }
	  }, {
	    key: "visible",
	    get: function get() {
	      return this._visible;
	    },
	    set: function set(value) {
	      if (this.visible !== value) {
	        if (typeof value === 'boolean') {
	          if (value) {
	            this._visibility.classList.remove('square');

	            this._visibility.classList.remove('minus-square');

	            this._visibility.classList.add('check-square');

	            this._visible = true;
	            this.childrenVisibility = true;
	          } else {
	            this._visibility.classList.remove('check-square');

	            this._visibility.classList.remove('minus-square');

	            this._visibility.classList.add('square');

	            this._visible = false;
	            this.childrenVisibility = false;
	          }
	        } else {
	          this._visibility.classList.remove('check-square');

	          this._visibility.classList.remove('square');

	          this._visibility.classList.add('minus-square');

	          this._visible = undefined;
	        }

	        var event = document.createEvent('Event');
	        event.initEvent('change:visible', false, false);
	        this.dispatchEvent(event);
	      }
	    }
	  }, {
	    key: "expanded",
	    get: function get() {
	      return this._expanded;
	    },
	    set: function set(expanded) {
	      var _this4 = this;

	      if (this._items.length === 0 && typeof this.expand === 'function') {
	        this.expand(this._properties).then(function (children) {
	          _this4._initChildren(children);

	          _this4._handleExpand(expanded);

	          _this4._onExpanded();
	        }).catch(function (e) {
	          return console.log(e);
	        });
	      } else {
	        this._handleExpand(expanded);
	      }
	    }
	  }]);

	  return Group;
	}(EventTarget);

	var Tree = /*#__PURE__*/function (_EventTarget) {
	  _inherits(Tree, _EventTarget);

	  var _super = _createSuper(Tree);

	  function Tree(container, expand) {
	    var _this;

	    _classCallCheck(this, Tree);

	    _this = _super.call(this);
	    _this._vectorFirst = false;
	    _this._root = new Group(container);
	    _this._root.expand = expand;
	    _this._temporal = false;

	    _this._root.on('change:state', _this._forwardEvent.bind(_assertThisInitialized(_this)));

	    _this._root.on('node:expanded', function () {
	      _this._root.enumerate(0);

	      _this._root.redraw();

	      var event = document.createEvent('Event');
	      event.initEvent('expanded', false, false);

	      _this.dispatchEvent(event);
	    });

	    _this._root.on('node:redraw', _this._forwardEvent.bind(_assertThisInitialized(_this)));

	    _this._root.on('node:click', _this._forwardEvent.bind(_assertThisInitialized(_this)));

	    return _this;
	  }

	  _createClass(Tree, [{
	    key: "getLayers",
	    value: function getLayers(filter) {
	      return this._root.getLayers(filter);
	    }
	  }, {
	    key: "redraw",
	    value: function redraw(filter) {
	      this._root.redraw(filter);
	    }
	  }, {
	    key: "_forwardEvent",
	    value: function _forwardEvent(e) {
	      e.stopPropagation();
	      var event = document.createEvent('Event');
	      event.initEvent(e.type, false, false);
	      event.detail = e.detail;
	      this.dispatchEvent(event);
	    }
	  }, {
	    key: "update",
	    value: function update(data) {
	      this._temporal = false;

	      this._root.update(data);

	      if (this._vectorFirst) {
	        var count = this._root.enumerate(0, function (item) {
	          return item.type === 'Group' || item.type === 'Vector';
	        });

	        this._root.enumerate(count, function (item) {
	          return item.type === 'Group' || item.type !== 'Vector';
	        });
	      } else {
	        this._root.enumerate(0);
	      }

	      this._root.redraw();
	    }
	  }, {
	    key: "temporal",
	    get: function get() {
	      return this._root.temporal;
	    }
	  }, {
	    key: "vectorFirst",
	    get: function get() {
	      return this._vectorFirst;
	    },
	    set: function set(vectorFirst) {
	      if (this._vectorFirst !== vectorFirst) {
	        this._vectorFirst = vectorFirst;

	        if (this._vectorFirst) {
	          var count = this._root.enumerate(0, function (item) {
	            return item instanceof Group || item.type === 'Vector';
	          });

	          this._root.enumerate(count, function (item) {
	            return item instanceof Group || item.type !== 'Vector';
	          });
	        } else {
	          this._root.enumerate(0);
	        }

	        this._root.redraw();
	      }
	    }
	  }]);

	  return Tree;
	}(EventTarget);

	var Result = {
		children: [
			{
				content: {
					properties: {
						Access: "edit",
						name: "49862B52242E45159871AC7DA147C6B1",
						title: "agronti_download",
						description: "",
						Copyright: "",
						Owner: "eperminovascanex",
						MetaProperties: {
						},
						LayerVersion: 15,
						LayerID: "49862B52242E45159871AC7DA147C6B1",
						type: "Vector",
						date: "26.03.2019",
						Legend: null,
						EncodeSource: "utf-8",
						VtMinZoom: 1,
						VtMaxZoom: 1,
						MinZoom: 1,
						MaxZoom: 1,
						identityField: "gmx_id",
						NameObject: "",
						GeometryType: "polygon",
						attributes: [
							"text"
						],
						attrTypes: [
							"string"
						],
						visible: false,
						MapStructureID: "7DD2315228FD4ED7A18EAA52C00D66A5",
						isGeneralized: true,
						styles: [
							{
								MinZoom: 1,
								MaxZoom: 21,
								BalloonEnable: true,
								DisableBalloonOnClick: false,
								DisableBalloonOnMouseMove: true,
								Balloon: "<p><strong>text:</strong> [text]<br /> <br /> [SUMMARY]</p>",
								RenderStyle: {
									outline: {
										color: 16711680,
										thickness: 1
									},
									fill: {
										color: 16777215,
										opacity: 20
									}
								}
							}
						]
					},
					geometry: {
						type: "POLYGON",
						coordinates: [
							[
								[
									4015542.84,
									5443080.78
								],
								[
									4015542.84,
									8296551.56
								],
								[
									14675909.51,
									8296551.56
								],
								[
									14675909.51,
									5443080.78
								],
								[
									4015542.84,
									5443080.78
								]
							]
						]
					}
				},
				type: "layer"
			},
			{
				content: {
					children: [
						{
							content: {
								children: [
									{
										content: {
											properties: {
												Access: "edit",
												name: "AF83E5828ADB43B093D2CC05FF10DB59",
												title: "L1C_T37TEL_A006010_20180501T081735_Fmask",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 0,
												LayerID: "AF83E5828ADB43B093D2CC05FF10DB59",
												type: "Raster",
												date: "05.04.2019",
												Legend: "",
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3857,
												RasterPath: "x:\\kosmosnimki\\projects\\FMASK-4.0\\s2\\L1C_T37TEL_A006010_20180501T081735_Fmask.tiles",
												visible: false,
												MapStructureID: "955A03626A1B4530BB6F34DA8AE6DA63",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															4339177.22,
															5625765.28
														],
														[
															4339177.22,
															5792092.26
														],
														[
															4500612.23,
															5792092.26
														],
														[
															4500612.23,
															5625765.28
														],
														[
															4339177.22,
															5625765.28
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "EBB9D8343C9842128A0AB2BE4A6A8D37",
												title: "L1C_T37TEL_A005867_20180421T082223_Fmask",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 0,
												LayerID: "EBB9D8343C9842128A0AB2BE4A6A8D37",
												type: "Raster",
												date: "05.04.2019",
												Legend: "",
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3857,
												RasterPath: "x:\\kosmosnimki\\projects\\FMASK-4.0\\s2\\L1C_T37TEL_A005867_20180421T082223_Fmask.tiles",
												visible: false,
												MapStructureID: "D23A20FA517D4625AC2178B25BDAA25F",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															4339177.22,
															5625765.28
														],
														[
															4339177.22,
															5792092.26
														],
														[
															4500612.23,
															5792092.26
														],
														[
															4500612.23,
															5625765.28
														],
														[
															4339177.22,
															5625765.28
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "80E38C3E76E24B7288D9626604EFA67F",
												title: "L1C_T37TEL_A005724_20180411T081600_Fmask",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 0,
												LayerID: "80E38C3E76E24B7288D9626604EFA67F",
												type: "Raster",
												date: "05.04.2019",
												Legend: "",
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3857,
												RasterPath: "x:\\kosmosnimki\\projects\\FMASK-4.0\\s2\\L1C_T37TEL_A005724_20180411T081600_Fmask.tiles",
												visible: false,
												MapStructureID: "3C4AC1C1A5374170A5C55017E76784F9",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															4339177.22,
															5625765.28
														],
														[
															4339177.22,
															5792092.26
														],
														[
															4500612.23,
															5792092.26
														],
														[
															4500612.23,
															5625765.28
														],
														[
															4339177.22,
															5625765.28
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "3F7457E338664177AB4B96731A10E93F",
												title: "L1C_T37TEL_A002578_20170903T082037_Fmask",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 0,
												LayerID: "3F7457E338664177AB4B96731A10E93F",
												type: "Raster",
												date: "05.04.2019",
												Legend: "",
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3857,
												RasterPath: "x:\\kosmosnimki\\projects\\FMASK-4.0\\s2\\L1C_T37TEL_A002578_20170903T082037_Fmask.tiles",
												visible: false,
												MapStructureID: "464056F5FC5C4A949B583ED206C49BA7",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															4339177.22,
															5625765.28
														],
														[
															4339177.22,
															5792092.26
														],
														[
															4500612.23,
															5792092.26
														],
														[
															4500612.23,
															5625765.28
														],
														[
															4339177.22,
															5625765.28
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "D62A228804E14BB181274DF7AFA8F996",
												title: "L1C_T37TEL_A002435_20170824T082406_Fmask",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 0,
												LayerID: "D62A228804E14BB181274DF7AFA8F996",
												type: "Raster",
												date: "05.04.2019",
												Legend: "",
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3857,
												RasterPath: "x:\\kosmosnimki\\projects\\FMASK-4.0\\s2\\L1C_T37TEL_A002435_20170824T082406_Fmask.tiles",
												visible: false,
												MapStructureID: "31A895835FFA4F1799A3408FB6D0A32D",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															4339177.22,
															5625765.28
														],
														[
															4339177.22,
															5792092.26
														],
														[
															4500612.23,
															5792092.26
														],
														[
															4500612.23,
															5625765.28
														],
														[
															4339177.22,
															5625765.28
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "2DD28564A2B34E769F77FF0A65032CBB",
												title: "L1C_T37TEL_A002292_20170814T082005_Fmask",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 0,
												LayerID: "2DD28564A2B34E769F77FF0A65032CBB",
												type: "Raster",
												date: "05.04.2019",
												Legend: "",
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3857,
												RasterPath: "x:\\kosmosnimki\\projects\\FMASK-4.0\\s2\\L1C_T37TEL_A002292_20170814T082005_Fmask.tiles",
												visible: false,
												MapStructureID: "54498C9CB37D4FFCA3E3406B44B770CD",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															4339177.22,
															5625765.28
														],
														[
															4339177.22,
															5792092.26
														],
														[
															4500612.23,
															5792092.26
														],
														[
															4500612.23,
															5625765.28
														],
														[
															4339177.22,
															5625765.28
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "9282B9F7164D4E52B82E4D4F613466B0",
												title: "L1C_T37TEL_A002149_20170804T082409_Fmask",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 0,
												LayerID: "9282B9F7164D4E52B82E4D4F613466B0",
												type: "Raster",
												date: "05.04.2019",
												Legend: "",
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3857,
												RasterPath: "x:\\kosmosnimki\\projects\\FMASK-4.0\\s2\\L1C_T37TEL_A002149_20170804T082409_Fmask.tiles",
												visible: false,
												MapStructureID: "980BFA24DCFF45519B489672ABD875BA",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															4339177.22,
															5625765.28
														],
														[
															4339177.22,
															5792092.26
														],
														[
															4500612.23,
															5792092.26
														],
														[
															4500612.23,
															5625765.28
														],
														[
															4339177.22,
															5625765.28
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "F1BB8FFE36F64B0D86C34347C974BE2D",
												title: "L1C_T37TEL_A002006_20170725T082007_Fmask",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 0,
												LayerID: "F1BB8FFE36F64B0D86C34347C974BE2D",
												type: "Raster",
												date: "05.04.2019",
												Legend: "",
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3857,
												RasterPath: "x:\\kosmosnimki\\projects\\FMASK-4.0\\s2\\L1C_T37TEL_A002006_20170725T082007_Fmask.tiles",
												visible: false,
												MapStructureID: "EF17A715E9F946618EAA2D44DB3AA407",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															4339177.22,
															5625765.28
														],
														[
															4339177.22,
															5792092.26
														],
														[
															4500612.23,
															5792092.26
														],
														[
															4500612.23,
															5625765.28
														],
														[
															4339177.22,
															5625765.28
														]
													]
												]
											}
										},
										type: "layer"
									}
								],
								properties: {
									visible: false,
									title: "S2",
									GroupID: "bb2TGvLMis4mexvT",
									expanded: false,
									list: false,
									ShowCheckbox: true
								}
							},
							type: "group"
						}
					],
					properties: {
						visible: false,
						title: "FMASK",
						GroupID: "7hq4xyHDysiHudno",
						expanded: false,
						list: false,
						ShowCheckbox: true
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								properties: {
									Access: "edit",
									name: "78CCE25577704EB192DD35415B3EFA6C",
									title: "Технопарки по регионам",
									description: "",
									Copyright: "",
									Owner: "romchik93",
									MetaProperties: {
									},
									LayerVersion: 45,
									LayerID: "78CCE25577704EB192DD35415B3EFA6C",
									type: "Vector",
									date: "25.02.2019",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 2,
									VtMaxZoom: 2,
									MinZoom: 2,
									MaxZoom: 2,
									identityField: "gmx_id",
									NameObject: "",
									GeometryType: "polygon",
									attributes: [
										"NAME",
										"OKTMO_NAME",
										"ADM3_NAME",
										"Technoparks",
										"URL"
									],
									attrTypes: [
										"string",
										"string",
										"string",
										"string",
										"string"
									],
									visible: false,
									MapStructureID: "7D9F9C6444544D93A442D05E056526FA",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>NAME:</strong> [NAME]<br /> <strong>OKTMO_NAME:</strong> [OKTMO_NAME]<br /> <strong>ADM3_NAME:</strong> [ADM3_NAME]<br /> <strong>Technoparks:</strong> [Technoparks]<br /> <strong>URL:</strong> [URL]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 12287,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 20
												}
											},
											_MinZoom: 1,
											disabled: true
										},
										{
											Name: "Technoparks",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"Technoparks\"<> \"\"",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>NAME:</strong> [NAME]<br /> <strong>OKTMO_NAME:</strong> [OKTMO_NAME]<br /> <strong>ADM3_NAME:</strong> [ADM3_NAME]<br /> <strong>Technoparks:</strong> [Technoparks]<br /> <strong>URL:</strong> [URL]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												fill: {
													color: 16777215,
													opacity: 20
												},
												outline: {
													color: 2809449,
													thickness: 1
												},
												common: true,
												type: "",
												maxSize: 0
											},
											_MinZoom: 1,
											disabled: true
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												5039796.34
											],
											[
												-20037508.34,
												16855625.72
											],
											[
												20037508.34,
												16855625.72
											],
											[
												20037508.34,
												5039796.34
											],
											[
												-20037508.34,
												5039796.34
											]
										]
									]
								}
							},
							type: "layer"
						}
					],
					properties: {
						visible: false,
						title: "Технопарки",
						GroupID: "OfKh9SAtuM5Ohk1S",
						expanded: false,
						list: false,
						ShowCheckbox: true
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								properties: {
									Access: "edit",
									name: "E34E29805A294051B20997A0223DAD42",
									title: "ls8_download_AOI",
									description: "граница скачивания и тайлинга данных LS8",
									Copyright: "",
									Owner: "altyntsev",
									MetaProperties: {
									},
									LayerVersion: 282,
									LayerID: "E34E29805A294051B20997A0223DAD42",
									type: "Vector",
									date: "09.01.2019",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 1,
									MaxZoom: 1,
									identityField: "gmx_id",
									NameObject: "",
									GeometryType: "polygon",
									attributes: [
										"region_id",
										"comment",
										"date_start",
										"date_end",
										"clouds_max",
										"products",
										"disable"
									],
									attrTypes: [
										"string",
										"string",
										"date",
										"date",
										"integer",
										"string",
										"boolean"
									],
									visible: true,
									MapStructureID: "C253E8B26A4D429BB73F1FEA47703527",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											labelMinZoom: 1,
											labelMaxZoom: 21,
											Name: "Агро",
											Filter: "[region_id]<>'forest2' AND [region_id]<>'forest' AND [region_id]<>'aoi' AND [region_id] <> 'Финский-залив'",
											Balloon: "",
											DisableBalloonOnMouseMove: true,
											DisableBalloonOnClick: false,
											RenderStyle: {
												fill: {
													color: 16777215,
													opacity: 20
												},
												outline: {
													color: 255,
													opacity: 100,
													thickness: 1
												},
												label: {
													color: 0,
													haloColor: 16777215,
													size: 10
												},
												labelTemplate: ""
											}
										},
										{
											MinZoom: 1,
											MaxZoom: 21,
											labelMinZoom: 1,
											labelMaxZoom: 21,
											Name: "Лесной мониторинг",
											Filter: "[region_id]='forest2' OR [region_id]='forest'",
											Balloon: "",
											DisableBalloonOnMouseMove: true,
											DisableBalloonOnClick: false,
											RenderStyle: {
												fill: {
													color: 16777215,
													opacity: 0
												},
												outline: {
													color: 384571,
													opacity: 100,
													thickness: 2
												},
												label: {
													color: 0,
													haloColor: 16777215,
													size: 10
												},
												labelTemplate: ""
											}
										},
										{
											MinZoom: 1,
											MaxZoom: 21,
											labelMinZoom: 1,
											labelMaxZoom: 21,
											Name: "Кадеты",
											Filter: "[region_id] = 'Финский-залив'",
											Balloon: "",
											DisableBalloonOnMouseMove: true,
											DisableBalloonOnClick: false,
											RenderStyle: {
												outline: {
													color: 6948615,
													opacity: 100,
													thickness: 3
												},
												label: {
													color: 0,
													haloColor: 16777215,
													size: 10
												},
												labelTemplate: ""
											}
										},
										{
											MinZoom: 1,
											MaxZoom: 21,
											labelMinZoom: 1,
											labelMaxZoom: 21,
											Name: "Метаданные",
											Filter: "[region_id] = 'aoi'",
											Balloon: "",
											DisableBalloonOnMouseMove: true,
											DisableBalloonOnClick: false,
											RenderStyle: {
												fill: {
													color: 16777215,
													opacity: 10
												},
												outline: {
													color: 7303023,
													opacity: 98,
													dashes: [
														10,
														10
													],
													thickness: 3
												},
												label: {
													color: 0,
													haloColor: 16777215,
													size: 10
												},
												labelTemplate: ""
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												4439462.68
											],
											[
												-20037508.34,
												16280475.68
											],
											[
												20037508.34,
												16280475.68
											],
											[
												20037508.34,
												4439462.68
											],
											[
												-20037508.34,
												4439462.68
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "E341475A341B47F3A7ABC3616BA48F27",
									title: "[mailru].[operative].[landsat_8_ql_aoi]",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 10,
									LayerID: "E341475A341B47F3A7ABC3616BA48F27",
									type: "Vector",
									date: "24.08.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 1,
									MaxZoom: 1,
									identityField: "gmx_id",
									NameObject: "",
									GeometryType: "polygon",
									attributes: [
									],
									attrTypes: [
									],
									visible: false,
									MapStructureID: "CA83EA4AAE75432FA30E61DF8BE99F93",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 20
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												-2086425.12
											],
											[
												-20037508.34,
												16280475.68
											],
											[
												20037508.34,
												16280475.68
											],
											[
												20037508.34,
												-2086425.12
											],
											[
												-20037508.34,
												-2086425.12
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "D8CFA7D3A7AA4549B728B37010C051A2",
									title: "Landsat-8 Метаданные съемки",
									description: "квиклуки и метаданные по территории РФ",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 774,
									LayerID: "D8CFA7D3A7AA4549B728B37010C051A2",
									type: "Vector",
									date: "24.08.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 6,
									MinZoom: 1,
									MaxZoom: 6,
									identityField: "id",
									Quicklook: "{\"template\":\"//search.kosmosnimki.ru/QuickLookImage.ashx?id=[sceneid]\",\"minZoom\":5,\"X1\":\"ulx\",\"Y1\":\"uly\",\"X2\":\"lrx\",\"Y2\":\"uly\",\"X3\":\"lrx\",\"Y3\":\"lry\",\"X4\":\"ulx\",\"Y4\":\"lry\"}",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "10.03.2013",
									DateEnd: "15.04.2019",
									DateBeginUTC: 1362873600,
									DateEndUTC: 1555286400,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"acqtime",
										"clouds",
										"path",
										"row",
										"sunelev",
										"sunazim",
										"ulx",
										"uly",
										"lrx",
										"lry"
									],
									attrTypes: [
										"string",
										"date",
										"time",
										"integer",
										"integer",
										"integer",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float"
									],
									visible: false,
									MapStructureID: "0317BAC0CBE0407885E69ABA9A645C59",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>clouds:</strong> [clouds]<br /> <strong>lrx:</strong> [lrx]<br /> <strong>lry:</strong> [lry]<br /> <strong>path:</strong> [path]<br /> <strong>row:</strong> [row]<br /> <strong>sceneid:</strong> [sceneid]<br /> <strong>sunazim:</strong> [sunazim]<br /> <strong>sunelev:</strong> [sunelev]<br /> <strong>ulx:</strong> [ulx]<br /> <strong>uly:</strong> [uly]<br /> <br /> <a onclick=\"javascript:window.open(serverBase + 'plugins/download/source?sceneid=[sceneid]&amp;layer=D8CFA7D3A7AA4549B728B37010C051A2', '_blank')\" href=\"#\">Загрузить исходные данные</a> <br />[SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 0
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												-2239779.45
											],
											[
												-20037508.34,
												17519532.75
											],
											[
												20037508.34,
												17519532.75
											],
											[
												20037508.34,
												-2239779.45
											],
											[
												-20037508.34,
												-2239779.45
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "041C9593C7F44CAA9323C4F83A128CDA",
									title: "RC_Landsat-8_753_fires",
									description: "Снимки по пересечению с пожарами (RGB синтез каналов 7-5-3)",
									Copyright: "© USGS",
									Owner: "slipatov",
									MetaProperties: {
										desc_eng: {
											Type: "String",
											Value: "Images intersected with hotspots. 7-5-3 RGB"
										},
										z_index: {
											Type: "String",
											Value: "999999"
										},
										quicklookX1: {
											Type: "String",
											Value: "upperLeftCornerLongitude"
										},
										quicklookY1: {
											Type: "String",
											Value: "upperLeftCornerLatitude"
										},
										quicklookX2: {
											Type: "String",
											Value: "upperRightCornerLongitude"
										},
										quicklookY2: {
											Type: "String",
											Value: "upperRightCornerLatitude"
										},
										quicklookX3: {
											Type: "String",
											Value: "lowerRightCornerLongitude"
										},
										quicklookY3: {
											Type: "String",
											Value: "lowerRightCornerLatitude"
										},
										quicklookX4: {
											Type: "String",
											Value: "lowerLeftCornerLongitude"
										},
										quicklookY4: {
											Type: "String",
											Value: "lowerLeftCornerLatitude"
										},
										quicklookPlatform: {
											Type: "String",
											Value: "image"
										},
										gmxProxy: {
											Type: "String",
											Value: "True"
										}
									},
									LayerVersion: 258832,
									LayerID: "041C9593C7F44CAA9323C4F83A128CDA",
									type: "Vector",
									date: "07.11.2013",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 5,
									MinZoom: 0,
									MaxZoom: 12,
									RasterSRS: 3395,
									identityField: "ogc_fid",
									Quicklook: "{\"template\":\"[browseURL]\"}",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "sceneStartTime",
									DateBegin: "15.10.2013",
									DateEnd: "13.05.2018",
									DateBeginUTC: 1381795200,
									DateEndUTC: 1526169600,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 6,
									GeometryType: "polygon",
									attributes: [
										"browseAvailable",
										"browseURL",
										"sceneID",
										"sensor",
										"acquisitionDate",
										"dateUpdated",
										"path",
										"row",
										"upperLeftCornerLatitude",
										"upperLeftCornerLongitude",
										"upperRightCornerLatitude",
										"upperRightCornerLongitude",
										"lowerLeftCornerLatitude",
										"lowerLeftCornerLongitude",
										"lowerRightCornerLatitude",
										"lowerRightCornerLongitude",
										"sceneCenterLatitude",
										"sceneCenterLongitude",
										"cloudCover",
										"cloudCoverFull",
										"dayOrNight",
										"sunElevation",
										"sunAzimuth",
										"sceneStartTime",
										"sceneStopTime",
										"imageQuality1",
										"DATA_TYPE_L1",
										"cartURL",
										"Tiles",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"string",
										"string",
										"string",
										"date",
										"date",
										"integer",
										"integer",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"string",
										"float",
										"float",
										"datetime",
										"datetime",
										"integer",
										"string",
										"string",
										"string",
										"string"
									],
									visible: false,
									MapStructureID: "F0596EACC5E141F0AB1954F0650A8BBE",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneID:</strong> [sceneID]<br /> <strong>sensor:</strong> [sensor]<br /> <strong>acquisitionDate:</strong> [acquisitionDate]<br /> <strong>dateUpdated:</strong> [dateUpdated]<br /> <strong>path:</strong> [path]<br /> <strong>row:</strong> [row]<br /> <strong>cloudCover:</strong> [cloudCover]<br /> <strong>cloudCoverFull:</strong> [cloudCoverFull]<br /> <strong>dayOrNight:</strong> [dayOrNight]<br /> <strong>sunElevation:</strong> [sunElevation]<br /> <strong>sunAzimuth:</strong> [sunAzimuth]<br /> <strong>sceneStartTime:</strong> [sceneStartTime]<br /> <strong>sceneStopTime:</strong> [sceneStopTime]<br /> <strong>imageQuality1:</strong> [imageQuality1]<br /> <strong>DATA_TYPE_L1:</strong> [DATA_TYPE_L1]<br /><a onclick=\"javascript:window.open(serverBase + 'plugins/download/source?sceneid=[sceneID]&amp;layer=041C9593C7F44CAA9323C4F83A128CDA', '_blank')\" href=\"#\">Скачать исходные данные</a></p>",
											RenderStyle: {
												outline: {
													color: 15597823,
													thickness: 6
												},
												fill: {
													color: 16777215,
													opacity: 12
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												-6402625.7
											],
											[
												-20037508.34,
												11742412.89
											],
											[
												20037508.34,
												11742412.89
											],
											[
												20037508.34,
												-6402625.7
											],
											[
												-20037508.34,
												-6402625.7
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "47A9D4E5E5AE497A8A1A7EA49C7FC336",
									title: "Landsat-8 Отдельные сцены 4-3-2",
									description: "",
									Copyright: "",
									Owner: "altyntsev",
									MetaProperties: {
										type: {
											Type: "String",
											Value: "оптическая"
										},
										system: {
											Type: "String",
											Value: "Landsat-8"
										},
										resolution: {
											Type: "String",
											Value: "15"
										}
									},
									LayerVersion: 143489,
									LayerID: "47A9D4E5E5AE497A8A1A7EA49C7FC336",
									type: "Vector",
									date: "30.05.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 3,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "21.03.2013",
									DateEnd: "13.04.2019",
									DateBeginUTC: 1363824000,
									DateEndUTC: 1555113600,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"clouds",
										"acqdate",
										"acqtime",
										"path",
										"row",
										"sunelev",
										"sunazim",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"float",
										"date",
										"time",
										"integer",
										"integer",
										"float",
										"float",
										"string"
									],
									visible: false,
									MapStructureID: "6055759C027C48A594E0496AF7DFB85D",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>ACQDATE:</strong> [acqdate]<br /> <strong>ACQTIME:</strong> [acqtime]<br /> <strong>BANDS:</strong> [bands]<br /> <strong>CLOUDS:</strong> [clouds]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>PATH:</strong> [path]<br /> <strong>PLATFORM:</strong> LANDSAT-8<br /> <strong>ROW:</strong> [row]<br /> <strong>SCENEID:</strong> [sceneid]<br /> <strong>SUNAZIM:</strong> [sunazim]<br /> <strong>SUNELEV:</strong> [sunelev]<br /> <br /><a onclick=\"javascript:window.open(serverBase + 'plugins/download/source?sceneid=[sceneid]&amp;layer=D8CFA7D3A7AA4549B728B37010C051A2', '_blank')\" href=\"#\">Скачать исходные данные</a></p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												4732117.07
											],
											[
												-20037508.34,
												10844624.31
											],
											[
												20037508.34,
												10844624.31
											],
											[
												20037508.34,
												4732117.07
											],
											[
												-20037508.34,
												4732117.07
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "7E81339914D54801A50DD986FD4333AC",
									title: "Landsat-8 Отдельные сцены 7-5-3",
									description: "",
									Copyright: "",
									Owner: "altyntsev",
									MetaProperties: {
										quicklookPlatform: {
											Type: "String",
											Value: "LANDSAT8"
										}
									},
									LayerVersion: 214301,
									LayerID: "7E81339914D54801A50DD986FD4333AC",
									type: "Vector",
									date: "30.05.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 5,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									identityField: "gmx_id",
									Quicklook: "{\"template\":\"http://search.kosmosnimki.ru/QuickLookImage.ashx?id=[sceneid]\",\"minZoom\":8}",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "11.04.2013",
									DateEnd: "27.01.2019",
									DateBeginUTC: 1365638400,
									DateEndUTC: 1548547200,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"clouds",
										"acqdate",
										"acqtime",
										"path",
										"row",
										"sunelev",
										"sunazim",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"float",
										"date",
										"time",
										"integer",
										"integer",
										"float",
										"float",
										"string"
									],
									visible: false,
									MapStructureID: "3CA38DAD1E074E58B047DEABCF132285",
									isGeneralized: true,
									styles: [
										{
											Name: "тайлы",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"GMX_RasterCatalogID\"<>''\n",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>ACQDATE:</strong> [acqdate]<br /> <strong>ACQTIME:</strong> [acqtime]<br /> <strong>CLOUDS:</strong> [clouds]<br /><strong>PATH:</strong> [path]<br /> <strong>ROW:</strong> [row]<br /> <strong>SCENEID:</strong> [sceneid]<br /> <strong>SUNAZIM:</strong> [sunazim]<br /> <strong>SUNELEV:</strong> [sunelev]</p>\n<p><br /> <a onclick=\"javascript:window.open(serverBase + 'plugins/download/source?sceneid=[sceneid]&amp;layer=D8CFA7D3A7AA4549B728B37010C051A2', '_blank')\" href=\"#\">Скачать исходные данные</a></p>",
											RenderStyle: {
												outline: {
													thickness: 1,
													color: 329215,
													opacity: 100
												}
											}
										},
										{
											Name: "квиклуки временные",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"GMX_RasterCatalogID\"='' AND \"CLOUDS\"<=30",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>ACQDATE:</strong>&nbsp;[acqdate]<br /><strong>ACQTIME:</strong>&nbsp;[acqtime]<br /><strong>CLOUDS:</strong>&nbsp;[clouds]<br /><strong>PATH:</strong>&nbsp;[path]<br /><strong>ROW:</strong>&nbsp;[row]<br /><strong>SCENEID:</strong>&nbsp;[sceneid]<br /><strong>SUNAZIM:</strong>&nbsp;[sunazim]<br /><strong>SUNELEV:</strong>&nbsp;[sunelev]</p>\n<p><a onclick=\"javascript:window.open(serverBase + 'plugins/download/source?sceneid=[sceneid]&amp;layer=D8CFA7D3A7AA4549B728B37010C051A2', '_blank')\" href=\"#\">Скачать исходные данные</a></p>",
											RenderStyle: {
												outline: {
													thickness: 1,
													color: 16384000
												}
											}
										},
										{
											Name: "квиклуки",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"GMX_RasterCatalogID\"='' AND \"CLOUDS\">30",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>ACQDATE:</strong>&nbsp;[acqdate]<br /><strong>ACQTIME:</strong>&nbsp;[acqtime]<br /><strong>CLOUDS:</strong>&nbsp;[clouds]<br /><strong>PATH:</strong>&nbsp;[path]<br /><strong>ROW:</strong>&nbsp;[row]<br /><strong>SCENEID:</strong>&nbsp;[sceneid]<br /><strong>SUNAZIM:</strong>&nbsp;[sunazim]<br /><strong>SUNELEV:</strong>&nbsp;[sunelev]</p>\n<p><a onclick=\"javascript:window.open(serverBase + 'plugins/download/source?sceneid=[sceneid]&amp;layer=D8CFA7D3A7AA4549B728B37010C051A2', '_blank')\" href=\"#\">Скачать исходные данные</a></p>",
											RenderStyle: {
												outline: {
													thickness: 1,
													color: 824890
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												-6161751.88
											],
											[
												-20037508.34,
												17527945.45
											],
											[
												20037508.34,
												17527945.45
											],
											[
												20037508.34,
												-6161751.88
											],
											[
												-20037508.34,
												-6161751.88
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								children: [
									{
										content: {
											properties: {
												Access: "edit",
												name: "75D7B7F27AE946748C3064E3F064CC47",
												title: "msavi_ndvi10m_area",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 8,
												LayerID: "75D7B7F27AE946748C3064E3F064CC47",
												type: "Vector",
												date: "10.09.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 1,
												MaxZoom: 1,
												identityField: "gmx_id",
												NameObject: "",
												GeometryType: "polygon",
												attributes: [
													"text"
												],
												attrTypes: [
													"string"
												],
												visible: false,
												MapStructureID: "2FCE3B049E9149B1A02EE7D998521B06",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															fill: {
																color: 16777215,
																opacity: 20
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															2436201.04,
															5437424.44
														],
														[
															2436201.04,
															7599675.1
														],
														[
															9979618.49,
															7599675.1
														],
														[
															9979618.49,
															5437424.44
														],
														[
															2436201.04,
															5437424.44
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "8288D69C7C0040EFBB7B7EE6671052E3",
												title: "Landsat-8 Индекс NDVI",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 6406,
												LayerID: "8288D69C7C0040EFBB7B7EE6671052E3",
												type: "Vector",
												date: "08.11.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 0,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "21.03.2013",
												DateEnd: "13.04.2019",
												DateBeginUTC: 1363824000,
												DateEndUTC: 1555113600,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"acqdate",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"string"
												],
												visible: false,
												MapStructureID: "570F8BAE09B1490D951EE91199F036D1",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1,
																opacity: 0
															},
															fill: {
																color: 16777215,
																opacity: 0
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															5148742.32
														],
														[
															-20037508.34,
															8014822.29
														],
														[
															20037508.34,
															8014822.29
														],
														[
															20037508.34,
															5148742.32
														],
														[
															-20037508.34,
															5148742.32
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "A05BB0207AEE4CFD93C045BF71576FDE",
												title: "Landsat-8 Маска облачности FMASK",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 6911,
												LayerID: "A05BB0207AEE4CFD93C045BF71576FDE",
												type: "Vector",
												date: "08.11.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 0,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "21.03.2013",
												DateEnd: "13.04.2019",
												DateBeginUTC: 1363824000,
												DateEndUTC: 1555113600,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"acqdate",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"string"
												],
												visible: false,
												MapStructureID: "1475B35516F1421AADDDC745C5719713",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															fill: {
																color: 16777215,
																opacity: 20
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															5148806.66
														],
														[
															-20037508.34,
															10843768.2
														],
														[
															20037508.34,
															10843768.2
														],
														[
															20037508.34,
															5148806.66
														],
														[
															-20037508.34,
															5148806.66
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "B4E9E98E0D19443FAB1C8AF8B7018A8E",
												title: "agro_area_border",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 105,
												LayerID: "B4E9E98E0D19443FAB1C8AF8B7018A8E",
												type: "Vector",
												date: "15.06.2016",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 1,
												MaxZoom: 1,
												identityField: "gmx_id",
												NameObject: "",
												GeometryType: "polygon",
												attributes: [
													"text"
												],
												attrTypes: [
													"string"
												],
												visible: false,
												MapStructureID: "7D7C530CDAA649E8BFE39158A39680AE",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															fill: {
																color: 16777215,
																opacity: 20
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-6102732.26,
															-2086425.12
														],
														[
															-6102732.26,
															10099471.75
														],
														[
															15615167.56,
															10099471.75
														],
														[
															15615167.56,
															-2086425.12
														],
														[
															-6102732.26,
															-2086425.12
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "04DDB23F49F84B9A9122CBA6BC26D3ED",
												title: "Landsat-8 Отдельные сцены 6-5-4",
												description: "",
												Copyright: "",
												Owner: "altyntsev",
												MetaProperties: {
													quicklookPlatform: {
														Type: "String",
														Value: "LANDSAT8"
													},
													desc_long: {
														Type: "String",
														Value: "<table class=\"vectorInfoParams\"><tbody><tr><td style=\"width: 30%;\"><span>Источник данных</span></td><td style=\"width: 70%;\"><div><a href=\"https://ers.cr.usgs.gov/\" target=\"_blank\">U.S. Geological Survey</a></div></td></tr><tr><td style=\"width: 30%;\"><span>Авторство</span></td><td style=\"width: 70%;\"><div>NASA / U.S. Geological Survey / Scanex</div></td></tr><tr><td style=\"width: 30%;\"><span>Лицензия</span></td><td style=\"width: 70%;\"><div><a href=\"https://landsat.usgs.gov/documents/Landsat_Data_Policy.pdf\" target=\"_blank\">https://landsat.usgs.gov/documents/Landsat_Data_Policy.pdf</a></div></td></tr><tr><td style=\"width: 30%;\"><span>Методика</span></td><td style=\"width: 70%;\"><div>RGB синтез (каналы 6-5-4)</div></td></tr></tbody></table>"
													}
												},
												LayerVersion: 92158,
												LayerID: "04DDB23F49F84B9A9122CBA6BC26D3ED",
												type: "Vector",
												date: "30.05.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 3,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 0,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "21.03.2013",
												DateEnd: "13.04.2019",
												DateBeginUTC: 1363824000,
												DateEndUTC: 1555113600,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"clouds",
													"acqdate",
													"acqtime",
													"path",
													"row",
													"sunelev",
													"sunazim",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"float",
													"date",
													"time",
													"integer",
													"integer",
													"float",
													"float",
													"string"
												],
												visible: false,
												MapStructureID: "8B26D436F9494F27B8CB2E11077009B8",
												AllowSearch: false,
												isGeneralized: true,
												styles: [
													{
														Name: "тайлы",
														MinZoom: 1,
														MaxZoom: 21,
														Filter: "\"GMX_RasterCatalogID\"<>''\n",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [acqdate]<br /> <strong>ACQTIME:</strong> [acqtime]<br /> <strong>BANDS:</strong> 6-5-4<br /> <strong>CLOUDS:</strong> [clouds]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>PATH:</strong> [path]<br /> <strong>PLATFORM:</strong> LANDSAT-8<br /> <strong>ROW:</strong> [row]<br /> <strong>SCENEID:</strong> [sceneid]<br /> <strong>SUNAZIM:</strong> [sunazim]<br /> <strong>SUNELEV:</strong> [sunelev]<br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																thickness: 1,
																color: 329215
															}
														}
													},
													{
														Name: "квиклуки временные",
														MinZoom: 1,
														MaxZoom: 21,
														Filter: "\"GMX_RasterCatalogID\"='' AND \"CLOUDS\"<=30",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>IsDay:</strong> [IsDay]<br /> <strong>PATH:</strong> [PATH]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>ROW:</strong> [ROW]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>tiles:</strong> [tiles]<br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																thickness: 1,
																color: 16384000
															}
														}
													},
													{
														Name: "квиклуки",
														MinZoom: 1,
														MaxZoom: 21,
														Filter: "\"GMX_RasterCatalogID\"='' AND \"CLOUDS\">30",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>IsDay:</strong> [IsDay]<br /> <strong>PATH:</strong> [PATH]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>ROW:</strong> [ROW]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>tiles:</strong> [tiles]<br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																thickness: 1,
																color: 824890
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															-2239334.26
														],
														[
															-20037508.34,
															10844006.77
														],
														[
															20037508.34,
															10844006.77
														],
														[
															20037508.34,
															-2239334.26
														],
														[
															-20037508.34,
															-2239334.26
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "E5450B8BDDE44E9A903BCF850327766E",
												title: "Landsat-8 Индекс MSAVI",
												description: "",
												Copyright: "",
												Owner: "altyntsev",
												MetaProperties: {
												},
												LayerVersion: 26904,
												LayerID: "E5450B8BDDE44E9A903BCF850327766E",
												type: "Vector",
												date: "19.12.2017",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3857,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 0,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "21.03.2013",
												DateEnd: "13.04.2019",
												DateBeginUTC: 1363824000,
												DateEndUTC: 1555113600,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"acqdate",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"string"
												],
												visible: false,
												MapStructureID: "03B09E87A5F245E19FBF3B110300C877",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															fill: {
																color: 16777215,
																opacity: 20
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															5148853.84
														],
														[
															-20037508.34,
															8014822.29
														],
														[
															20037508.34,
															8014822.29
														],
														[
															20037508.34,
															5148853.84
														],
														[
															-20037508.34,
															5148853.84
														]
													]
												]
											}
										},
										type: "layer"
									}
								],
								properties: {
									visible: false,
									title: "agro",
									GroupID: "9MvWM6ZpyKKfHy13",
									expanded: false,
									list: false,
									ShowCheckbox: true
								}
							},
							type: "group"
						}
					],
					properties: {
						visible: true,
						title: "Landsat 8",
						GroupID: "IPCByT94sAUJQTCn",
						expanded: false,
						list: false,
						ShowCheckbox: true
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								properties: {
									Access: "edit",
									name: "579E4AEE477F4C8595B4E21DAF505631",
									title: "Sentinel-1 План съемки",
									description: "",
									Copyright: "",
									Owner: "altyntsev",
									MetaProperties: {
									},
									LayerVersion: 331501,
									LayerID: "579E4AEE477F4C8595B4E21DAF505631",
									type: "Vector",
									date: "29.05.2017",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 1,
									MaxZoom: 1,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 1,
									TemporalPeriods: [
										1
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdatetime",
									DateBegin: "09.05.2017",
									DateEnd: "30.04.2019",
									DateBeginUTC: 1494288000,
									DateEndUTC: 1556582400,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"platform",
										"acqdatetime",
										"mode",
										"polar"
									],
									attrTypes: [
										"string",
										"string",
										"datetime",
										"string",
										"string"
									],
									visible: false,
									MapStructureID: "7E7AD0FE980E482697FF255BF7182F40",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 20
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												-723350.92
											],
											[
												-20037508.34,
												18754675.33
											],
											[
												20037508.34,
												18754675.33
											],
											[
												20037508.34,
												-723350.92
											],
											[
												-20037508.34,
												-723350.92
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "AF64ECA6B32F437CB6AC72B5E6F85B97",
									title: "Sentinel-1 Отдельные сцены",
									description: "GRD, HH-VV",
									Copyright: "",
									Owner: "alt_proc",
									MetaProperties: {
									},
									LayerVersion: 491442,
									LayerID: "AF64ECA6B32F437CB6AC72B5E6F85B97",
									type: "Vector",
									date: "26.10.2016",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 5,
									MinZoom: 0,
									MaxZoom: 15,
									RasterSRS: 3395,
									identityField: "gmx_id",
									NameObject: "",
									ZIndexField: "acqdatetime",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdatetime",
									DateBegin: "03.10.2014",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1412294400,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 1,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"platform",
										"acqdate",
										"acqtime",
										"mode",
										"resolution",
										"polar",
										"esa_product_id",
										"GMX_RasterCatalogID",
										"acqdatetime"
									],
									attrTypes: [
										"string",
										"string",
										"date",
										"time",
										"string",
										"integer",
										"string",
										"string",
										"string",
										"datetime"
									],
									visible: false,
									MapStructureID: "F54FD4924E4B44DDA2240942AF0EED18",
									AllowSearch: false,
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>platform:</strong> [platform]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>mode:</strong> [mode]<br /> <strong>resolution:</strong> [resolution]<br /> <strong>polar:</strong> [polar]<br /> <strong>esa_product_id:</strong> [esa_product_id]</p>\n<p><a onclick=\"javascript:window.open(serverBase + 'plugins/download/source?sceneid=[sceneid]&amp;layer=9132DB4583944CC2836D2C416B4DC093', '_blank')\" href=\"#\">Скачать исходные данные</a></p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												-14453941
											],
											[
												-20037508.34,
												18745749.66
											],
											[
												20037508.34,
												18745749.66
											],
											[
												20037508.34,
												-14453941
											],
											[
												-20037508.34,
												-14453941
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "CA58DDA46FCD4DF09B16E0275ACE1F1F",
									title: "s1_download_AOI",
									description: "граница скачивания и тайлинга данных S1-a/b",
									Copyright: "",
									Owner: "alt_proc",
									MetaProperties: {
									},
									LayerVersion: 195,
									LayerID: "CA58DDA46FCD4DF09B16E0275ACE1F1F",
									type: "Vector",
									date: "10.06.2016",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 1,
									MaxZoom: 1,
									identityField: "gmx_id",
									NameObject: "",
									GeometryType: "polygon",
									attributes: [
										"project",
										"priority",
										"region"
									],
									attrTypes: [
										"string",
										"float",
										"string"
									],
									visible: false,
									MapStructureID: "1063683331F24ED28FD92856B5DEFBA4",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>text:</strong> [text]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20003264.55,
												2734611.2
											],
											[
												-20003264.55,
												18834084.07
											],
											[
												20013048.42,
												18834084.07
											],
											[
												20013048.42,
												2734611.2
											],
											[
												-20003264.55,
												2734611.2
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "9132DB4583944CC2836D2C416B4DC093",
									title: "Sentinel-1 Метаданные съемки",
									description: "GRD, весь мир",
									Copyright: "",
									Owner: "alt_proc",
									MetaProperties: {
									},
									LayerVersion: 3028342,
									LayerID: "9132DB4583944CC2836D2C416B4DC093",
									type: "Vector",
									date: "26.10.2016",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 6,
									MinZoom: 1,
									MaxZoom: 6,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "15.06.2014",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1402790400,
									DateEndUTC: 1555372800,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"platform",
										"acqdate",
										"acqtime",
										"mode",
										"resolution",
										"polar",
										"esa_product_id",
										"acqdatetime"
									],
									attrTypes: [
										"string",
										"string",
										"date",
										"time",
										"string",
										"integer",
										"string",
										"string",
										"datetime"
									],
									visible: false,
									MapStructureID: "D5F6180B295D48B9B7CB203914E3591B",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>platform:</strong> [platform]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>mode:</strong> [mode]<br /> <strong>resolution:</strong> [resolution]<br /> <strong>polar:</strong> [polar]<br /> <strong>esa_product_id:</strong> [esa_product_id]<br /><a onclick=\"javascript:window.open(serverBase + 'plugins/download/source?sceneid=[sceneid]&amp;layer=9132DB4583944CC2836D2C416B4DC093', '_blank')\" href=\"#\">Скачать исходные данные</a></p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												-16862595.68
											],
											[
												-20037508.34,
												18764534.81
											],
											[
												20037508.34,
												18764534.81
											],
											[
												20037508.34,
												-16862595.68
											],
											[
												-20037508.34,
												-16862595.68
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								children: [
								],
								properties: {
									visible: false,
									title: "old",
									GroupID: "xRIydVPImsmR6Z69",
									expanded: false,
									list: false,
									ShowCheckbox: true
								}
							},
							type: "group"
						}
					],
					properties: {
						visible: false,
						title: "Sentinel-1",
						GroupID: "LfcC9XEk9D6kZOz3",
						expanded: false,
						list: false,
						ShowCheckbox: true
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								properties: {
									Access: "edit",
									name: "8AE4417878CF455E9DBA0191CE2EFDA9",
									title: "s2_download_AOI",
									description: "граница скачивания и тайлинга данных S2",
									Copyright: "",
									Owner: "alt_proc",
									MetaProperties: {
									},
									LayerVersion: 102,
									LayerID: "8AE4417878CF455E9DBA0191CE2EFDA9",
									type: "Vector",
									date: "23.01.2019",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 1,
									MaxZoom: 1,
									identityField: "gmx_id",
									NameObject: "",
									GeometryType: "polygon",
									attributes: [
										"region_id",
										"comment",
										"date_start",
										"date_end",
										"clouds_max",
										"products",
										"disable"
									],
									attrTypes: [
										"string",
										"string",
										"date",
										"date",
										"integer",
										"string",
										"boolean"
									],
									visible: false,
									MapStructureID: "2B6292B4AF7E40DABD1C660618F09D58",
									AllowSearch: true,
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											labelMinZoom: 1,
											labelMaxZoom: 21,
											Name: "Агро",
											Filter: "[region_id]<>'forest2' AND [region_id]<>'forest' AND [region_id]<>'aoi' AND [region_id] <> 'Финский-залив'",
											Balloon: "",
											DisableBalloonOnMouseMove: true,
											DisableBalloonOnClick: false,
											RenderStyle: {
												fill: {
													color: 16777215,
													opacity: 20
												},
												outline: {
													color: 255,
													opacity: 100,
													thickness: 1
												},
												label: {
													color: 0,
													haloColor: 16777215,
													size: 10
												},
												labelTemplate: ""
											}
										},
										{
											MinZoom: 1,
											MaxZoom: 21,
											labelMinZoom: 1,
											labelMaxZoom: 21,
											Name: "Лесной мониторинг",
											Filter: "[region_id]='forest2' OR [region_id]='forest'",
											Balloon: "",
											DisableBalloonOnMouseMove: true,
											DisableBalloonOnClick: false,
											RenderStyle: {
												fill: {
													color: 16777215,
													opacity: 0
												},
												outline: {
													color: 384571,
													opacity: 100,
													thickness: 2
												},
												label: {
													color: 0,
													haloColor: 16777215,
													size: 10
												},
												labelTemplate: ""
											}
										},
										{
											MinZoom: 1,
											MaxZoom: 21,
											labelMinZoom: 1,
											labelMaxZoom: 21,
											Name: "Кадеты",
											Filter: "[region_id] = 'Финский-залив'",
											Balloon: "",
											DisableBalloonOnMouseMove: true,
											DisableBalloonOnClick: false,
											RenderStyle: {
												outline: {
													color: 6948615,
													opacity: 100,
													thickness: 3
												},
												label: {
													color: 0,
													haloColor: 16777215,
													size: 10
												},
												labelTemplate: ""
											}
										},
										{
											MinZoom: 1,
											MaxZoom: 21,
											labelMinZoom: 1,
											labelMaxZoom: 21,
											Name: "Метаданные",
											Filter: "[region_id] = 'aoi'",
											Balloon: "",
											DisableBalloonOnMouseMove: true,
											DisableBalloonOnClick: false,
											RenderStyle: {
												fill: {
													color: 16777215,
													opacity: 10
												},
												outline: {
													color: 7303023,
													opacity: 98,
													dashes: [
														10,
														10
													],
													thickness: 3
												},
												label: {
													color: 0,
													haloColor: 16777215,
													size: 10
												},
												labelTemplate: ""
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												3310124.54
											],
											[
												-20037508.34,
												16280475.68
											],
											[
												20037508.34,
												16280475.68
											],
											[
												20037508.34,
												3310124.54
											],
											[
												-20037508.34,
												3310124.54
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "636CBFF5155F4F299254EAF54079040C",
									title: "Sentinel-2 Отдельные сцены 4-3-2",
									description: "",
									Copyright: "",
									Owner: "altyntsev",
									MetaProperties: {
										type: {
											Type: "String",
											Value: "оптическая"
										},
										system: {
											Type: "String",
											Value: "Sentinel-2"
										},
										resolution: {
											Type: "String",
											Value: "10"
										}
									},
									LayerVersion: 368521,
									LayerID: "636CBFF5155F4F299254EAF54079040C",
									type: "Vector",
									date: "22.12.2016",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 8,
									MinZoom: 0,
									MaxZoom: 15,
									RasterSRS: 3857,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "08.07.2015",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1436313600,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 5,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"acqtime",
										"MGRS",
										"area",
										"clouds",
										"esa_product_id",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"time",
										"string",
										"integer",
										"integer",
										"string",
										"string"
									],
									visible: false,
									MapStructureID: "D18770532C6A48859AAA187A043A2334",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>clouds:</strong> [clouds]<br /><strong>sceneid:</strong> [sceneid]<br /><strong>esa_id:</strong> [esa_product_id]</p>\n<p><a onclick=\"javascript:window.open(serverBase + 'plugins/download/source?sceneid=[sceneid]&amp;layer=61F54CF35EC44536B527A2168BE6F5A0', '_blank')\" href=\"#\">Скачать исходные данные</a></p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 0
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												3216532.03
											],
											[
												-20037508.34,
												10561240
											],
											[
												20037508.34,
												10561240
											],
											[
												20037508.34,
												3216532.03
											],
											[
												-20037508.34,
												3216532.03
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "61F54CF35EC44536B527A2168BE6F5A0",
									title: "Sentinel-2 Метаданные съемки",
									description: "квиклуки и метаданные по территории РФ",
									Copyright: "",
									Owner: "alt_proc",
									MetaProperties: {
										timeColumnName1: {
											Type: "String",
											Value: "acqtime"
										}
									},
									LayerVersion: 5763378,
									LayerID: "61F54CF35EC44536B527A2168BE6F5A0",
									type: "Vector",
									date: "08.11.2016",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 9,
									MinZoom: 1,
									MaxZoom: 9,
									identityField: "gmx_id",
									Quicklook: "{\"template\":\"//sender.kosmosnimki.ru/operative/alt_proc.ashx?platform=s2&product=ql&date=[acqdate]&file=[sceneid].jpg\",\"minZoom\":6,\"X1\":\"x1\",\"Y1\":\"y1\",\"X2\":\"x2\",\"Y2\":\"y2\",\"X3\":\"x3\",\"Y3\":\"y3\",\"X4\":\"x4\",\"Y4\":\"y4\"}",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "27.06.2015",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1435363200,
									DateEndUTC: 1555372800,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"MGRS",
										"acqdate",
										"acqtime",
										"area",
										"clouds",
										"esa_product_id",
										"x1",
										"y1",
										"x2",
										"y2",
										"x3",
										"y3",
										"x4",
										"y4",
										"test"
									],
									attrTypes: [
										"string",
										"string",
										"date",
										"time",
										"integer",
										"integer",
										"string",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"string"
									],
									visible: false,
									MapStructureID: "FE5C5F95165A4016B00DCDD33B89B1C3",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>MGRS:</strong> [MGRS]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>area:</strong> [area]<br /> <strong>clouds:</strong> [clouds]<br /> <strong>esa_product_id:</strong> [esa_product_id]<br /> <strong><br /></strong><a onclick=\"javascript:window.open(serverBase + 'plugins/download/source?sceneid=[sceneid]&amp;layer=61F54CF35EC44536B527A2168BE6F5A0', '_blank')\" href=\"#\">Скачать исходные данные</a></p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 0
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												3104025.76
											],
											[
												-20037508.34,
												17614693.93
											],
											[
												20037508.34,
												17614693.93
											],
											[
												20037508.34,
												3104025.76
											],
											[
												-20037508.34,
												3104025.76
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "12ECA8F4ED7B487A913ADBD4072B605B",
									title: "Sentinel-2 Отдельные сцены 3-8-4",
									description: "",
									Copyright: "",
									Owner: "alt_proc",
									MetaProperties: {
										type: {
											Type: "String",
											Value: "оптическая"
										},
										system: {
											Type: "String",
											Value: "Sentinel-2"
										},
										resolution: {
											Type: "String",
											Value: "10"
										}
									},
									LayerVersion: 315420,
									LayerID: "12ECA8F4ED7B487A913ADBD4072B605B",
									type: "Vector",
									date: "12.09.2016",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 8,
									MinZoom: 0,
									MaxZoom: 15,
									RasterSRS: 3395,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "08.07.2015",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1436313600,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 5,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"acqtime",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"time",
										"string"
									],
									visible: false,
									MapStructureID: "801D7C9E8590406F919A6EE0E748080B",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 0
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												1744114.43,
												3216532.03
											],
											[
												1744114.43,
												10561240
											],
											[
												14798378.72,
												10561240
											],
											[
												14798378.72,
												3216532.03
											],
											[
												1744114.43,
												3216532.03
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "EC68D0C097BE4F0B9E9DE4A0B9F591A2",
									title: "Sentinel-2 Индекс NDVI",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 32585,
									LayerID: "EC68D0C097BE4F0B9E9DE4A0B9F591A2",
									type: "Vector",
									date: "08.11.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 8,
									MinZoom: 0,
									MaxZoom: 15,
									RasterSRS: 3857,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "08.07.2015",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1436313600,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"string"
									],
									visible: false,
									MapStructureID: "1574DE693DB64A5FBD4AB4481A0F0294",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1,
													opacity: 100
												},
												fill: {
													color: 16777215,
													opacity: 0
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												1744114.43,
												3216642.81
											],
											[
												1744114.43,
												7692460.1
											],
											[
												14798267.35,
												7692460.1
											],
											[
												14798267.35,
												3216642.81
											],
											[
												1744114.43,
												3216642.81
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "14A988CBC5FD424D9EBE23CEC8168150",
									title: "Sentinel-2 Маска облачности FMASK",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 37535,
									LayerID: "14A988CBC5FD424D9EBE23CEC8168150",
									type: "Vector",
									date: "08.11.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 8,
									MinZoom: 0,
									MaxZoom: 15,
									RasterSRS: 3857,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "08.07.2015",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1436313600,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"string"
									],
									visible: false,
									MapStructureID: "29F97C413AD3479199146C1FAC1F5BF4",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 20
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												1744114.43,
												3216642.81
											],
											[
												1744114.43,
												10561126.24
											],
											[
												14798267.35,
												10561126.24
											],
											[
												14798267.35,
												3216642.81
											],
											[
												1744114.43,
												3216642.81
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "341BB64419E94750999BB0AB4A9DD835",
									title: "s2-rgb-border",
									description: "",
									Copyright: "",
									Owner: "altyntsev",
									MetaProperties: {
									},
									LayerVersion: 57,
									LayerID: "341BB64419E94750999BB0AB4A9DD835",
									type: "Vector",
									date: "14.09.2017",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 1,
									MaxZoom: 1,
									identityField: "gmx_id",
									NameObject: "",
									GeometryType: "polygon",
									attributes: [
										"comment"
									],
									attrTypes: [
										"string"
									],
									visible: false,
									MapStructureID: "D41CE80F13924D519E6EF1DDD53ABD0B",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 20
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												4214431.99,
												7166735.7
											],
											[
												4214431.99,
												10472484.37
											],
											[
												12056259.67,
												10472484.37
											],
											[
												12056259.67,
												7166735.7
											],
											[
												4214431.99,
												7166735.7
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "E541359719264F2CBEEA4BB2BCA5BEB1",
									title: "RC_Sentinel-2_NDVI_10 m",
									description: "данные по контуру Агро-Софт",
									Copyright: "",
									Owner: "altyntsev",
									MetaProperties: {
									},
									LayerVersion: 48060,
									LayerID: "E541359719264F2CBEEA4BB2BCA5BEB1",
									type: "Vector",
									date: "19.03.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 8,
									MinZoom: 0,
									MaxZoom: 14,
									RasterSRS: 3857,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "01.01.2016",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1451606400,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"string"
									],
									visible: false,
									MapStructureID: "3A087CC6F89F4E77BDBA0DC0639CC096",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 20
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												2159549.46,
												3216642.81
											],
											[
												2159549.46,
												7692347.76
											],
											[
												14798267.35,
												7692347.76
											],
											[
												14798267.35,
												3216642.81
											],
											[
												2159549.46,
												3216642.81
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "4280091A6C6546B8A406E993903C0012",
									title: "RC_Sentinel-2_MSAVI_10 m",
									description: "данные по контуру Агро-Софт",
									Copyright: "",
									Owner: "altyntsev",
									MetaProperties: {
									},
									LayerVersion: 48196,
									LayerID: "4280091A6C6546B8A406E993903C0012",
									type: "Vector",
									date: "19.03.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 8,
									MinZoom: 0,
									MaxZoom: 14,
									RasterSRS: 3857,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "01.01.2016",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1451606400,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"string"
									],
									visible: false,
									MapStructureID: "5090418748ED4027ABB424CA72FCC7C3",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 20
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												2159549.46,
												3216642.81
											],
											[
												2159549.46,
												7692347.76
											],
											[
												14798267.35,
												7692347.76
											],
											[
												14798267.35,
												3216642.81
											],
											[
												2159549.46,
												3216642.81
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "F350F1FB55944351AE10AC66C1BAB76B",
									title: "Sentinel-2 Индекс MSAVI",
									description: "",
									Copyright: "",
									Owner: "altyntsev",
									MetaProperties: {
									},
									LayerVersion: 55373,
									LayerID: "F350F1FB55944351AE10AC66C1BAB76B",
									type: "Vector",
									date: "19.12.2017",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 8,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3857,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "01.01.2016",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1451606400,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"string"
									],
									visible: false,
									MapStructureID: "84EF5C9FD7CD4386945D6ACB9BAA2195",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 20
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												2159549.46,
												3216642.81
											],
											[
												2159549.46,
												7692347.76
											],
											[
												14798267.35,
												7692347.76
											],
											[
												14798267.35,
												3216642.81
											],
											[
												2159549.46,
												3216642.81
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								children: [
									{
										content: {
											properties: {
												Access: "edit",
												name: "F4DA3B0CD00747079CABACCFA26201E4",
												title: "SL2A_20181227_T31TCJ_maja_cld",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 0,
												LayerID: "F4DA3B0CD00747079CABACCFA26201E4",
												type: "Raster",
												date: "22.02.2019",
												Legend: "",
												MinZoom: 0,
												MaxZoom: 14,
												RasterSRS: 3857,
												RasterPath: "workfolder\\UF\\LayerManager\\Maps\\ADPS-STREAM\\maja\\SENTINEL2A_20181227-105851-748_L2A_T31TCJ_D_V1-9_CLM_R1.tiles",
												visible: false,
												MapStructureID: "D5539DE483CC4C01A00DB98B693C79F7",
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															53811.67,
															5346923
														],
														[
															53811.67,
															5505912.02
														],
														[
															210354.7,
															5505912.02
														],
														[
															210354.7,
															5346923
														],
														[
															53811.67,
															5346923
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "B2C62F85D369477FB466C268EA080CC7",
												title: "SL2A_20180901_T30TYP_maja_cld_mask",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 0,
												LayerID: "B2C62F85D369477FB466C268EA080CC7",
												type: "Raster",
												date: "15.02.2019",
												Legend: "",
												MinZoom: 0,
												MaxZoom: 14,
												RasterSRS: 3857,
												RasterPath: "workfolder\\UF\\LayerManager\\Maps\\ADPS-STREAM\\maja\\SENTINEL2A_20180901-105939-499_L2A_T30TYP_D_V1-8_CLM_R1.tiles",
												visible: false,
												MapStructureID: "2C1C8E1F74E24A4A9BF81840AB1A407D",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-61149.62,
															5342031.03
														],
														[
															-61149.62,
															5501020.05
														],
														[
															97839.4,
															5501020.05
														],
														[
															97839.4,
															5342031.03
														],
														[
															-61149.62,
															5342031.03
														]
													]
												]
											}
										},
										type: "layer"
									}
								],
								properties: {
									visible: false,
									title: "maja",
									GroupID: "M9fIymR1xJU80kzD",
									expanded: false,
									list: false,
									ShowCheckbox: true
								}
							},
							type: "group"
						},
						{
							content: {
								children: [
									{
										content: {
											properties: {
												Access: "edit",
												name: "65E9996F4AAF4F0AA4B6439A6A96E58B",
												title: "RC_Sentinel-2_NDVI_L2A",
												description: "данные по агро-контуру",
												Copyright: "",
												Owner: "altyntsev",
												MetaProperties: {
												},
												LayerVersion: 218,
												LayerID: "65E9996F4AAF4F0AA4B6439A6A96E58B",
												type: "Vector",
												date: "16.05.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3857,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 0,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "11.01.2017",
												DateEnd: "05.06.2018",
												DateBeginUTC: 1484092800,
												DateEndUTC: 1528156800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"acqdate",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"string"
												],
												visible: false,
												MapStructureID: "D3202E22287D4602936950ED9D6F1EDE",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															fill: {
																color: 16777215,
																opacity: 0
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															4482844.35,
															5596661.96
														],
														[
															4482844.35,
															5756992.73
														],
														[
															4643196.54,
															5756992.73
														],
														[
															4643196.54,
															5596661.96
														],
														[
															4482844.35,
															5596661.96
														]
													]
												]
											}
										},
										type: "layer"
									}
								],
								properties: {
									visible: false,
									title: "без обновления, тестовые данные",
									GroupID: "ItnDCat6XsiUaVT5",
									expanded: false,
									list: false,
									ShowCheckbox: true
								}
							},
							type: "group"
						}
					],
					properties: {
						visible: false,
						title: "Sentinel-2",
						GroupID: "sRFAyNt60qdTa8wB",
						expanded: false,
						list: false,
						ShowCheckbox: true
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								properties: {
									Access: "edit",
									name: "A8FFA5B3A74342EDAB87623965F088E8",
									title: "MODIS FalseColor Покрытие 24 ч",
									description: "данные СКАНЭКС + GIBS NASA",
									Copyright: "",
									Owner: "alt_proc",
									MetaProperties: {
									},
									LayerVersion: 2325684,
									LayerID: "A8FFA5B3A74342EDAB87623965F088E8",
									type: "Vector",
									date: "19.06.2016",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 6,
									MinZoom: 0,
									MaxZoom: 9,
									RasterSRS: 3857,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 1,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "19.06.2016",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1466294400,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"string"
									],
									visible: false,
									MapStructureID: "CF6C3C0D48E844339E6BFEBC442F95CA",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 0,
													opacity: 0
												},
												fill: {
													color: 16777215,
													opacity: 20
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												2241741.81
											],
											[
												-20037508.34,
												20037508.34
											],
											[
												20037508.34,
												20037508.34
											],
											[
												20037508.34,
												2241741.81
											],
											[
												-20037508.34,
												2241741.81
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "509762F05B0044D8A7CCC9D3C2383365",
									title: "MODIS TrueColor Покрытие 24ч",
									description: "данные СКАНЭКС + GIBS NASA",
									Copyright: "",
									Owner: "alt_proc",
									MetaProperties: {
									},
									LayerVersion: 2694817,
									LayerID: "509762F05B0044D8A7CCC9D3C2383365",
									type: "Vector",
									date: "19.06.2016",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 6,
									MinZoom: 0,
									MaxZoom: 9,
									RasterSRS: 3857,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 1,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "19.06.2016",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1466294400,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"string"
									],
									visible: false,
									MapStructureID: "4A4F4DF9541D493A80D9D9C81ED58252",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 0,
													opacity: 0
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												-2786340.55
											],
											[
												-20037508.34,
												20037508.34
											],
											[
												20037508.34,
												20037508.34
											],
											[
												20037508.34,
												-2786340.55
											],
											[
												-20037508.34,
												-2786340.55
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "A66138C36BA249D68183B09232AC3194",
									title: "MODIS-TERRA TrueColor Отдельные сцены",
									description: "данные СКАНЭКС",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 13363,
									LayerID: "A66138C36BA249D68183B09232AC3194",
									type: "Vector",
									date: "18.01.2019",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 6,
									MinZoom: 0,
									MaxZoom: 9,
									RasterSRS: 3395,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 1,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "21.08.2014",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1408579200,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"acqtime",
										"platform",
										"station",
										"bands",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"time",
										"string",
										"string",
										"string",
										"string"
									],
									visible: false,
									MapStructureID: "86805C1F0A9F4D218FFF72108234F4CA",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>platform:</strong> [platform]<br /> <strong>station:</strong> [station]<br /> <strong>bands:</strong> [bands]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												2294818.81
											],
											[
												-20037508.34,
												20037508.34
											],
											[
												20037508.34,
												20037508.34
											],
											[
												20037508.34,
												2294818.81
											],
											[
												-20037508.34,
												2294818.81
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "60EA8F7A8C1B4AC38B59529695605276",
									title: "MODIS-AQUA TrueColor Отдельные сцены",
									description: "данные СКАНЭКС",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 13380,
									LayerID: "60EA8F7A8C1B4AC38B59529695605276",
									type: "Vector",
									date: "18.01.2019",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 6,
									MinZoom: 0,
									MaxZoom: 9,
									RasterSRS: 3395,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 1,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "27.08.2014",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1409097600,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"acqtime",
										"platform",
										"station",
										"bands",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"time",
										"string",
										"string",
										"string",
										"string"
									],
									visible: false,
									MapStructureID: "753D254641244F23A3CC75142A9F6229",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>platform:</strong> [platform]<br /> <strong>station:</strong> [station]<br /> <strong>bands:</strong> [bands]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												2350982.11
											],
											[
												-20037508.34,
												20037508.34
											],
											[
												20037508.34,
												20037508.34
											],
											[
												20037508.34,
												2350982.11
											],
											[
												-20037508.34,
												2350982.11
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "EB271FC4D2AD425A9BAA78ADEA041AB9",
									title: "MODIS-AQUA FalseColor Отдельные сцены",
									description: "данные СКАНЭКС",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 24945,
									LayerID: "EB271FC4D2AD425A9BAA78ADEA041AB9",
									type: "Vector",
									date: "24.10.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 6,
									MinZoom: 0,
									MaxZoom: 10,
									RasterSRS: 3395,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 1,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "27.02.2012",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1330300800,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"acqtime",
										"platform",
										"station",
										"bands",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"time",
										"string",
										"string",
										"string",
										"string"
									],
									visible: false,
									MapStructureID: "618D9DFCD84C4F469371CF7A3CBFB742",
									TiledQuicklook: "http://maps.kosmosnimki.ru/TileSenderSimple.ashx?TilePath=OperativeMODIS[TILES]/",
									TiledQuicklookMinZoom: 3,
									isGeneralized: true,
									styles: [
										{
											Name: "контура",
											MinZoom: 1,
											MaxZoom: 2,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>platform:</strong> [platform]<br /> <strong>station:</strong> [station]<br /> <strong>bands:</strong> [bands]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 0
												}
											}
										},
										{
											Name: "изображения",
											MinZoom: 3,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>platform:</strong> [platform]<br /> <strong>station:</strong> [station]<br /> <strong>bands:</strong> [bands]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 2
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												2350982.11
											],
											[
												-20037508.34,
												20037508.34
											],
											[
												20037508.34,
												20037508.34
											],
											[
												20037508.34,
												2350982.11
											],
											[
												-20037508.34,
												2350982.11
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "533FCC7439DA4A2EB97A2BE77887A462",
									title: "MODIS-TERRA FalseColor Отдельные сцены",
									description: "данные СКАНЭКС",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 24824,
									LayerID: "533FCC7439DA4A2EB97A2BE77887A462",
									type: "Vector",
									date: "29.10.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 6,
									MinZoom: 0,
									MaxZoom: 10,
									RasterSRS: 3395,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 1,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "28.02.2012",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1330387200,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"acqtime",
										"platform",
										"station",
										"bands",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"time",
										"string",
										"string",
										"string",
										"string"
									],
									visible: false,
									MapStructureID: "B85D9E4D1B224A279CCABADE95701B0B",
									TiledQuicklookMinZoom: 3,
									isGeneralized: true,
									styles: [
										{
											Name: "контура",
											MinZoom: 1,
											MaxZoom: 2,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>platform:</strong> [platform]<br /> <strong>station:</strong> [station]<br /> <strong>bands:</strong> [bands]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 0
												}
											}
										},
										{
											Name: "изображения",
											MinZoom: 3,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>platform:</strong> [platform]<br /> <strong>station:</strong> [station]<br /> <strong>bands:</strong> [bands]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 2
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												2184458.3
											],
											[
												-20037508.34,
												20037508.34
											],
											[
												20037508.34,
												20037508.34
											],
											[
												20037508.34,
												2184458.3
											],
											[
												-20037508.34,
												2184458.3
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								children: [
									{
										content: {
											properties: {
												Access: "edit",
												name: "A10C86983EB140019725D00CE3A58833",
												title: "MOYD13Q1_NDVI_alt_proc",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 1063,
												LayerID: "A10C86983EB140019725D00CE3A58833",
												type: "Vector",
												date: "03.12.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 9,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "date",
												DateBegin: "16.01.2006",
												DateEnd: "06.04.2019",
												DateBeginUTC: 1137369600,
												DateEndUTC: 1554508800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"date",
													"gridh",
													"gridv",
													"platform",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"string",
													"string",
													"string",
													"string"
												],
												visible: false,
												MapStructureID: "6DA0ACBF12484E7D80CB3CE6298A76A6",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>date:</strong> [date]<br /> <strong>gridh:</strong> [gridh]<br /> <strong>gridv:</strong> [gridv]<br /> <strong>platform:</strong> [platform]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 0,
																thickness: 1
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															3482189.07
														],
														[
															-20037508.34,
															11028513.66
														],
														[
															20037508.34,
															11028513.66
														],
														[
															20037508.34,
															3482189.07
														],
														[
															-20037508.34,
															3482189.07
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "19EB2D31114842BF84A87FC69C3D6BA8",
												title: "MYD13Q1_NDVI_alt_proc",
												description: "",
												Copyright: "",
												Owner: "alt_proc",
												MetaProperties: {
												},
												LayerVersion: 24445,
												LayerID: "19EB2D31114842BF84A87FC69C3D6BA8",
												type: "Vector",
												date: "26.07.2016",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 9,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "date",
												DateBegin: "24.01.2006",
												DateEnd: "29.03.2019",
												DateBeginUTC: 1138060800,
												DateEndUTC: 1553817600,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"date",
													"gridh",
													"gridv",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"integer",
													"integer",
													"string"
												],
												visible: false,
												MapStructureID: "F00046764D6F4E529AD4CBD3D2AF0DD7",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>date:</strong> [date]<br /> <strong>gridh:</strong> [gridh]<br /> <strong>gridv:</strong> [gridv]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 0,
																thickness: 1
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															3482189.07
														],
														[
															-20037508.34,
															11028513.66
														],
														[
															20037508.34,
															11028513.66
														],
														[
															20037508.34,
															3482189.07
														],
														[
															-20037508.34,
															3482189.07
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "6052756AFE19492C8DED43A92FE5B940",
												title: "MOD13Q1_NDVI_alt_proc",
												description: "",
												Copyright: "",
												Owner: "alt_proc",
												MetaProperties: {
												},
												LayerVersion: 33695,
												LayerID: "6052756AFE19492C8DED43A92FE5B940",
												type: "Vector",
												date: "26.07.2016",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 9,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "date",
												DateBegin: "16.01.2006",
												DateEnd: "06.04.2019",
												DateBeginUTC: 1137369600,
												DateEndUTC: 1554508800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"date",
													"gridh",
													"gridv",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"integer",
													"integer",
													"string"
												],
												visible: false,
												MapStructureID: "91C474A6286D41BDAF6772B69278D824",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>date:</strong> [date]<br /> <strong>gridh:</strong> [gridh]<br /> <strong>gridv:</strong> [gridv]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 0,
																thickness: 1
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															3482189.07
														],
														[
															-20037508.34,
															11028513.66
														],
														[
															20037508.34,
															11028513.66
														],
														[
															20037508.34,
															3482189.07
														],
														[
															-20037508.34,
															3482189.07
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "93BA58418E0B4B958D9DAF4D8B3E1878",
												title: "MOD09Q1_NDVI_alt_proc",
												description: "",
												Copyright: "",
												Owner: "alt_proc",
												MetaProperties: {
												},
												LayerVersion: 44932,
												LayerID: "93BA58418E0B4B958D9DAF4D8B3E1878",
												type: "Vector",
												date: "21.07.2016",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 9,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "date",
												DateBegin: "03.01.2006",
												DateEnd: "06.04.2019",
												DateBeginUTC: 1136246400,
												DateEndUTC: 1554508800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"date",
													"GMX_RasterCatalogID",
													"sceneid",
													"gridh",
													"gridv"
												],
												attrTypes: [
													"date",
													"string",
													"string",
													"integer",
													"integer"
												],
												visible: false,
												MapStructureID: "77E21E88E8164259B3703A71F46D556F",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>date:</strong> [date]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>sceneid:</strong> [sceneid]<br /> <strong>gridh:</strong> [gridh]<br /> <strong>gridv:</strong> [gridv]<br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 0,
																thickness: 1
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															3482189.07
														],
														[
															-20037508.34,
															11028513.66
														],
														[
															20037508.34,
															11028513.66
														],
														[
															20037508.34,
															3482189.07
														],
														[
															-20037508.34,
															3482189.07
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "EF055D2AB2D04FE58C515AA4FDC6AEE8",
												title: "MYD09Q1_NDVI_alt_proc",
												description: "",
												Copyright: "",
												Owner: "alt_proc",
												MetaProperties: {
												},
												LayerVersion: 42047,
												LayerID: "EF055D2AB2D04FE58C515AA4FDC6AEE8",
												type: "Vector",
												date: "25.07.2016",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 9,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "date",
												DateBegin: "08.01.2006",
												DateEnd: "06.04.2019",
												DateBeginUTC: 1136678400,
												DateEndUTC: 1554508800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"date",
													"GMX_RasterCatalogID",
													"gridh",
													"gridv"
												],
												attrTypes: [
													"string",
													"date",
													"string",
													"integer",
													"integer"
												],
												visible: false,
												MapStructureID: "917D3656E1524822B97F8C63D1F898AA",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>date:</strong> [date]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>gridh:</strong> [gridh]<br /> <strong>gridv:</strong> [gridv]<br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 0,
																thickness: 1
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															3482189.07
														],
														[
															-20037508.34,
															11028513.66
														],
														[
															20037508.34,
															11028513.66
														],
														[
															20037508.34,
															3482189.07
														],
														[
															-20037508.34,
															3482189.07
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "02BA2ACF5B26491681EBAD888771FC55",
												title: "MOD13Q4N_NDVI_alt_proc",
												description: "",
												Copyright: "",
												Owner: "alt_proc",
												MetaProperties: {
												},
												LayerVersion: 56020,
												LayerID: "02BA2ACF5B26491681EBAD888771FC55",
												type: "Vector",
												date: "22.07.2016",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 5,
												MinZoom: 0,
												MaxZoom: 9,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "date",
												DateBegin: "16.07.2016",
												DateEnd: "18.11.2018",
												DateBeginUTC: 1468627200,
												DateEndUTC: 1542499200,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"date",
													"filename",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"string",
													"string"
												],
												visible: false,
												MapStructureID: "6C574A27341E4263948AC5E39DE76A25",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>date:</strong> [date]<br /> <strong>filename:</strong> [filename]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 0,
																thickness: 1
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															3482189.07
														],
														[
															-20037508.34,
															11028513.66
														],
														[
															20037508.34,
															11028513.66
														],
														[
															20037508.34,
															3482189.07
														],
														[
															-20037508.34,
															3482189.07
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											children: [
												{
													content: {
														properties: {
															Access: "edit",
															name: "3471393ADBD546EC9E6D7935F30EA7BA",
															title: "MOYD13Q1_mask_alt_proc",
															description: "",
															Copyright: "",
															Owner: "altyntsev",
															MetaProperties: {
															},
															LayerVersion: 44926,
															LayerID: "3471393ADBD546EC9E6D7935F30EA7BA",
															type: "Vector",
															date: "30.08.2016",
															Legend: null,
															EncodeSource: null,
															VtMinZoom: 1,
															VtMaxZoom: 3,
															MinZoom: 0,
															MaxZoom: 9,
															RasterSRS: 3395,
															identityField: "gmx_id",
															NameObject: "",
															Temporal: true,
															maxShownPeriod: 1,
															TemporalPeriods: [
																1,
																16,
																256
															],
															ZeroDate: "01.01.1980",
															TemporalColumnName: "date",
															DateBegin: "16.01.2006",
															DateEnd: "06.04.2019",
															DateBeginUTC: 1137369600,
															DateEndUTC: 1554508800,
															IsRasterCatalog: true,
															RCMinZoomForRasters: 0,
															GeometryType: "polygon",
															attributes: [
																"sceneid",
																"date",
																"gridh",
																"gridv",
																"platform",
																"GMX_RasterCatalogID"
															],
															attrTypes: [
																"string",
																"date",
																"string",
																"string",
																"string",
																"string"
															],
															visible: false,
															MapStructureID: "C13295F7F3884C458AE28EC5409DCA83",
															isGeneralized: true,
															styles: [
																{
																	MinZoom: 1,
																	MaxZoom: 21,
																	BalloonEnable: true,
																	DisableBalloonOnClick: false,
																	DisableBalloonOnMouseMove: true,
																	Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>date:</strong> [date]<br /> <strong>gridh:</strong> [gridh]<br /> <strong>gridv:</strong> [gridv]<br /> <strong>platform:</strong> [platform]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
																	RenderStyle: {
																		outline: {
																			color: 0,
																			thickness: 1
																		}
																	}
																}
															]
														},
														geometry: {
															type: "POLYGON",
															coordinates: [
																[
																	[
																		-20037508.34,
																		3482189.07
																	],
																	[
																		-20037508.34,
																		11028513.66
																	],
																	[
																		20037508.34,
																		11028513.66
																	],
																	[
																		20037508.34,
																		3482189.07
																	],
																	[
																		-20037508.34,
																		3482189.07
																	]
																]
															]
														}
													},
													type: "layer"
												},
												{
													content: {
														properties: {
															Access: "edit",
															name: "91B9C42793594DAFB8248656C952E5E1",
															title: "MYD13Q1_mask_alt_proc",
															description: "",
															Copyright: "",
															Owner: "alt_proc",
															MetaProperties: {
															},
															LayerVersion: 24363,
															LayerID: "91B9C42793594DAFB8248656C952E5E1",
															type: "Vector",
															date: "26.07.2016",
															Legend: null,
															EncodeSource: null,
															VtMinZoom: 1,
															VtMaxZoom: 1,
															MinZoom: 0,
															MaxZoom: 9,
															RasterSRS: 3395,
															identityField: "gmx_id",
															NameObject: "",
															Temporal: true,
															maxShownPeriod: 1,
															TemporalPeriods: [
																1
															],
															ZeroDate: "01.01.1980",
															TemporalColumnName: "date",
															DateBegin: "24.01.2006",
															DateEnd: "29.03.2019",
															DateBeginUTC: 1138060800,
															DateEndUTC: 1553817600,
															IsRasterCatalog: true,
															RCMinZoomForRasters: 0,
															GeometryType: "polygon",
															attributes: [
																"sceneid",
																"date",
																"gridh",
																"gridv",
																"GMX_RasterCatalogID"
															],
															attrTypes: [
																"string",
																"date",
																"integer",
																"integer",
																"string"
															],
															visible: false,
															MapStructureID: "90A2DF4CBC1D40808BBFFDD3F662821A",
															isGeneralized: true,
															styles: [
																{
																	MinZoom: 1,
																	MaxZoom: 21,
																	BalloonEnable: true,
																	DisableBalloonOnClick: false,
																	DisableBalloonOnMouseMove: true,
																	Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>date:</strong> [date]<br /> <strong>gridh:</strong> [gridh]<br /> <strong>gridv:</strong> [gridv]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
																	RenderStyle: {
																		outline: {
																			color: 0,
																			thickness: 1
																		}
																	}
																}
															]
														},
														geometry: {
															type: "POLYGON",
															coordinates: [
																[
																	[
																		-20037508.34,
																		3482189.07
																	],
																	[
																		-20037508.34,
																		11028513.66
																	],
																	[
																		20037508.34,
																		11028513.66
																	],
																	[
																		20037508.34,
																		3482189.07
																	],
																	[
																		-20037508.34,
																		3482189.07
																	]
																]
															]
														}
													},
													type: "layer"
												},
												{
													content: {
														properties: {
															Access: "edit",
															name: "03ADBEF87C4940719E0298A69FA29416",
															title: "MOD13Q1_mask_alt_proc",
															description: "",
															Copyright: "",
															Owner: "alt_proc",
															MetaProperties: {
															},
															LayerVersion: 23421,
															LayerID: "03ADBEF87C4940719E0298A69FA29416",
															type: "Vector",
															date: "26.07.2016",
															Legend: null,
															EncodeSource: null,
															VtMinZoom: 1,
															VtMaxZoom: 1,
															MinZoom: 0,
															MaxZoom: 9,
															RasterSRS: 3395,
															identityField: "gmx_id",
															NameObject: "",
															Temporal: true,
															maxShownPeriod: 1,
															TemporalPeriods: [
																1,
																16,
																256
															],
															ZeroDate: "01.01.1980",
															TemporalColumnName: "date",
															DateBegin: "16.01.2006",
															DateEnd: "06.04.2019",
															DateBeginUTC: 1137369600,
															DateEndUTC: 1554508800,
															IsRasterCatalog: true,
															RCMinZoomForRasters: 0,
															GeometryType: "polygon",
															attributes: [
																"sceneid",
																"date",
																"gridh",
																"gridv",
																"GMX_RasterCatalogID"
															],
															attrTypes: [
																"string",
																"date",
																"integer",
																"integer",
																"string"
															],
															visible: false,
															MapStructureID: "820AD2608D8149CCABC22D8CF18ED318",
															isGeneralized: true,
															styles: [
																{
																	MinZoom: 1,
																	MaxZoom: 21,
																	BalloonEnable: true,
																	DisableBalloonOnClick: false,
																	DisableBalloonOnMouseMove: true,
																	Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>date:</strong> [date]<br /> <strong>gridh:</strong> [gridh]<br /> <strong>gridv:</strong> [gridv]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
																	RenderStyle: {
																		outline: {
																			color: 0,
																			thickness: 1
																		}
																	}
																}
															]
														},
														geometry: {
															type: "POLYGON",
															coordinates: [
																[
																	[
																		-20037508.34,
																		3482189.07
																	],
																	[
																		-20037508.34,
																		11028513.66
																	],
																	[
																		20037508.34,
																		11028513.66
																	],
																	[
																		20037508.34,
																		3482189.07
																	],
																	[
																		-20037508.34,
																		3482189.07
																	]
																]
															]
														}
													},
													type: "layer"
												},
												{
													content: {
														properties: {
															Access: "edit",
															name: "7067EBD95ED047DB86F8D712AC1D44FC",
															title: "MOD09Q1_mask_alt_proc",
															description: "",
															Copyright: "",
															Owner: "alt_proc",
															MetaProperties: {
															},
															LayerVersion: 44689,
															LayerID: "7067EBD95ED047DB86F8D712AC1D44FC",
															type: "Vector",
															date: "21.07.2016",
															Legend: null,
															EncodeSource: null,
															VtMinZoom: 1,
															VtMaxZoom: 1,
															MinZoom: 0,
															MaxZoom: 9,
															RasterSRS: 3395,
															identityField: "gmx_id",
															NameObject: "",
															Temporal: true,
															maxShownPeriod: 1,
															TemporalPeriods: [
																1,
																16,
																256
															],
															ZeroDate: "01.01.1980",
															TemporalColumnName: "date",
															DateBegin: "03.01.2006",
															DateEnd: "06.04.2019",
															DateBeginUTC: 1136246400,
															DateEndUTC: 1554508800,
															IsRasterCatalog: true,
															RCMinZoomForRasters: 0,
															GeometryType: "polygon",
															attributes: [
																"sceneid",
																"date",
																"GMX_RasterCatalogID",
																"gridh",
																"gridv"
															],
															attrTypes: [
																"string",
																"date",
																"string",
																"integer",
																"integer"
															],
															visible: false,
															MapStructureID: "68AB1A89FB4747CC91D7162D24C9CA1F",
															isGeneralized: true,
															styles: [
																{
																	MinZoom: 1,
																	MaxZoom: 21,
																	BalloonEnable: true,
																	DisableBalloonOnClick: false,
																	DisableBalloonOnMouseMove: true,
																	Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>date:</strong> [date]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>gridh:</strong> [gridh]<br /> <strong>gridv:</strong> [gridv]<br /> <br /> [SUMMARY]</p>",
																	RenderStyle: {
																		outline: {
																			color: 0,
																			thickness: 1
																		}
																	}
																}
															]
														},
														geometry: {
															type: "POLYGON",
															coordinates: [
																[
																	[
																		-20037508.34,
																		3482189.07
																	],
																	[
																		-20037508.34,
																		11028513.66
																	],
																	[
																		20037508.34,
																		11028513.66
																	],
																	[
																		20037508.34,
																		3482189.07
																	],
																	[
																		-20037508.34,
																		3482189.07
																	]
																]
															]
														}
													},
													type: "layer"
												},
												{
													content: {
														properties: {
															Access: "edit",
															name: "290E3346C5A5433180A5D0CC10524F16",
															title: "MYD09Q1_mask_alt_proc",
															description: "",
															Copyright: "",
															Owner: "alt_proc",
															MetaProperties: {
															},
															LayerVersion: 41625,
															LayerID: "290E3346C5A5433180A5D0CC10524F16",
															type: "Vector",
															date: "25.07.2016",
															Legend: null,
															EncodeSource: null,
															VtMinZoom: 1,
															VtMaxZoom: 1,
															MinZoom: 0,
															MaxZoom: 9,
															RasterSRS: 3395,
															identityField: "gmx_id",
															NameObject: "",
															Temporal: true,
															maxShownPeriod: 1,
															TemporalPeriods: [
																1,
																16,
																256
															],
															ZeroDate: "01.01.1980",
															TemporalColumnName: "date",
															DateBegin: "08.01.2006",
															DateEnd: "06.04.2019",
															DateBeginUTC: 1136678400,
															DateEndUTC: 1554508800,
															IsRasterCatalog: true,
															RCMinZoomForRasters: 0,
															GeometryType: "polygon",
															attributes: [
																"date",
																"sceneid",
																"GMX_RasterCatalogID",
																"gridh",
																"gridv"
															],
															attrTypes: [
																"date",
																"string",
																"string",
																"integer",
																"integer"
															],
															visible: false,
															MapStructureID: "2875AAB76D33407E95FD8CE032DD5067",
															isGeneralized: true,
															styles: [
																{
																	MinZoom: 1,
																	MaxZoom: 21,
																	BalloonEnable: true,
																	DisableBalloonOnClick: false,
																	DisableBalloonOnMouseMove: true,
																	Balloon: "<p><strong>date:</strong> [date]<br /> <strong>sceneid:</strong> [sceneid]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>gridh:</strong> [gridh]<br /> <strong>gridv:</strong> [gridv]<br /> <br /> [SUMMARY]</p>",
																	RenderStyle: {
																		outline: {
																			color: 0,
																			thickness: 1
																		}
																	}
																}
															]
														},
														geometry: {
															type: "POLYGON",
															coordinates: [
																[
																	[
																		-20037508.34,
																		3482189.07
																	],
																	[
																		-20037508.34,
																		11028513.66
																	],
																	[
																		20037508.34,
																		11028513.66
																	],
																	[
																		20037508.34,
																		3482189.07
																	],
																	[
																		-20037508.34,
																		3482189.07
																	]
																]
															]
														}
													},
													type: "layer"
												},
												{
													content: {
														properties: {
															Access: "edit",
															name: "94B096994CBA47D889C1077C669BC466",
															title: "MOD13Q4N_mask_alt_proc",
															description: "",
															Copyright: "",
															Owner: "alt_proc",
															MetaProperties: {
															},
															LayerVersion: 55809,
															LayerID: "94B096994CBA47D889C1077C669BC466",
															type: "Vector",
															date: "22.07.2016",
															Legend: null,
															EncodeSource: null,
															VtMinZoom: 1,
															VtMaxZoom: 5,
															MinZoom: 0,
															MaxZoom: 9,
															RasterSRS: 3395,
															identityField: "gmx_id",
															NameObject: "",
															Temporal: true,
															maxShownPeriod: 1,
															TemporalPeriods: [
																1,
																16,
																256
															],
															ZeroDate: "01.01.1980",
															TemporalColumnName: "date",
															DateBegin: "16.07.2016",
															DateEnd: "18.11.2018",
															DateBeginUTC: 1468627200,
															DateEndUTC: 1542499200,
															IsRasterCatalog: true,
															RCMinZoomForRasters: 0,
															GeometryType: "polygon",
															attributes: [
																"sceneid",
																"date",
																"filename",
																"GMX_RasterCatalogID"
															],
															attrTypes: [
																"string",
																"date",
																"string",
																"string"
															],
															visible: false,
															MapStructureID: "FC18D5B7826B4937939ECE0B0DF68FE3",
															isGeneralized: true,
															styles: [
																{
																	MinZoom: 1,
																	MaxZoom: 21,
																	BalloonEnable: true,
																	DisableBalloonOnClick: false,
																	DisableBalloonOnMouseMove: true,
																	Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>date:</strong> [date]<br /> <strong>filename:</strong> [filename]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
																	RenderStyle: {
																		outline: {
																			color: 0,
																			thickness: 1
																		}
																	}
																}
															]
														},
														geometry: {
															type: "POLYGON",
															coordinates: [
																[
																	[
																		-20037508.34,
																		3482189.07
																	],
																	[
																		-20037508.34,
																		11028513.66
																	],
																	[
																		20037508.34,
																		11028513.66
																	],
																	[
																		20037508.34,
																		3482189.07
																	],
																	[
																		-20037508.34,
																		3482189.07
																	]
																]
															]
														}
													},
													type: "layer"
												}
											],
											properties: {
												visible: false,
												title: "Качество композитов NDVI",
												GroupID: "Pqu5ms5t8bIsc9rm",
												expanded: false,
												list: true,
												ShowCheckbox: false
											}
										},
										type: "group"
									}
								],
								properties: {
									visible: false,
									title: "Композиты NDVI",
									GroupID: "ylTUOTtNNTRDWcCa",
									expanded: false,
									list: true,
									ShowCheckbox: false
								}
							},
							type: "group"
						}
					],
					properties: {
						visible: false,
						title: "MODIS",
						GroupID: "snBwe5yM3Gr7mJ68",
						expanded: false,
						list: false,
						ShowCheckbox: false
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								properties: {
									Access: "edit",
									name: "3D0631DA781F444EA6A8ABF9BD607720",
									title: "NPP FalseColor",
									description: "Данные СКАНЭКС",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 13364,
									LayerID: "3D0631DA781F444EA6A8ABF9BD607720",
									type: "Vector",
									date: "18.01.2019",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 0,
									MaxZoom: 9,
									RasterSRS: 3395,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 1,
									TemporalPeriods: [
										1
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "14.01.2013",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1358121600,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"acqtime",
										"platform",
										"station",
										"bands",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"time",
										"string",
										"string",
										"string",
										"string"
									],
									visible: false,
									MapStructureID: "D9D8B94D787948E0A93662B181FF0428",
									isGeneralized: true,
									styles: [
										{
											Name: "изображения",
											MinZoom: 3,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>platform:</strong> [platform]<br /> <strong>station:</strong> [station]<br /> <strong>bands:</strong> [bands]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 2
												},
												marker: {
													size: 3,
													center: true
												}
											}
										},
										{
											Name: "контура",
											MinZoom: 1,
											MaxZoom: 2,
											BalloonEnable: false,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>platform:</strong> [platform]<br /> <strong>station:</strong> [station]<br /> <strong>bands:</strong> [bands]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												marker: {
													size: 3,
													center: true
												},
												fill: {
													color: 16777215,
													opacity: 0
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												-78271.52
											],
											[
												-20037508.34,
												20037508.34
											],
											[
												20037508.34,
												20037508.34
											],
											[
												20037508.34,
												-78271.52
											],
											[
												-20037508.34,
												-78271.52
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "EBCB165D6E274686999594A60C5DA2E9",
									title: "NPP TrueColor",
									description: "Данные СКАНЭКС",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 13345,
									LayerID: "EBCB165D6E274686999594A60C5DA2E9",
									type: "Vector",
									date: "18.01.2019",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 0,
									MaxZoom: 9,
									RasterSRS: 3395,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 1,
									TemporalPeriods: [
										1
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "acqdate",
									DateBegin: "21.01.2013",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1358726400,
									DateEndUTC: 1555372800,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"acqdate",
										"acqtime",
										"platform",
										"station",
										"bands",
										"GMX_RasterCatalogID"
									],
									attrTypes: [
										"string",
										"date",
										"time",
										"string",
										"string",
										"string",
										"string"
									],
									visible: false,
									MapStructureID: "EC334D68DEB24E67A2AE9A36DACF8556",
									isGeneralized: true,
									styles: [
										{
											Name: "изображения",
											MinZoom: 3,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>platform:</strong> [platform]<br /> <strong>station:</strong> [station]<br /> <strong>bands:</strong> [bands]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 2
												},
												marker: {
													size: 3,
													center: true
												}
											}
										},
										{
											Name: "контура",
											MinZoom: 1,
											MaxZoom: 2,
											BalloonEnable: false,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>platform:</strong> [platform]<br /> <strong>station:</strong> [station]<br /> <strong>bands:</strong> [bands]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												marker: {
													size: 3,
													center: true
												},
												fill: {
													color: 16777215,
													opacity: 0
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												-78271.52
											],
											[
												-20037508.34,
												20037508.34
											],
											[
												20037508.34,
												20037508.34
											],
											[
												20037508.34,
												-78271.52
											],
											[
												-20037508.34,
												-78271.52
											]
										]
									]
								}
							},
							type: "layer"
						}
					],
					properties: {
						visible: false,
						title: "NPP",
						GroupID: "0E2E354D0BAA45498A48367615E2B4FC",
						expanded: false,
						list: true,
						ShowCheckbox: true
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								children: [
									{
										content: {
											properties: {
												Access: "edit",
												name: "10E6B7A88F514526A7CBA592A1A0206B",
												title: "RC_SCANEX_NPP_TrueColor_IRK",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 13406,
												LayerID: "10E6B7A88F514526A7CBA592A1A0206B",
												type: "Vector",
												date: "18.01.2019",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 9,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: null,
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "12.08.2013",
												DateEnd: "16.04.2019",
												DateBeginUTC: 1376265600,
												DateEndUTC: 1555372800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"acqdate",
													"acqtime",
													"platform",
													"station",
													"bands",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"time",
													"string",
													"string",
													"string",
													"string"
												],
												visible: false,
												MapStructureID: "13334162934442A1BAE1DE4549D11ADE",
												isGeneralized: true,
												styles: [
													{
														Name: "изображения",
														MinZoom: 3,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>IsDay:</strong> [IsDay]<br /> <strong>ORBIT:</strong> [ORBIT]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>RESOLUTION:</strong> [RESOLUTION]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SEGMENT:</strong> [SEGMENT]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>TILES:</strong> [TILES]<br /> <br /> <a href=\"//projects.scanex.ru/SourceDownload/Default.aspx?sceneid=[SCENEID]&amp;station=[Station]\">Скачать исходные данные</a><br /> <br />[SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 2
															},
															marker: {
																size: 3,
																center: true
															}
														}
													},
													{
														Name: "контура",
														MinZoom: 1,
														MaxZoom: 2,
														BalloonEnable: false,
														DisableBalloonOnClick: true,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>IsDay:</strong> [IsDay]<br /> <strong>ORBIT:</strong> [ORBIT]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>RESOLUTION:</strong> [RESOLUTION]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SEGMENT:</strong> [SEGMENT]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>TILES:</strong> [TILES]<br /> <br /> <a href=\"//projects.scanex.ru/SourceDownload/Default.aspx?sceneid=[SCENEID]&amp;station=[Station]\">Скачать исходные данные</a><br /> <br />[SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															marker: {
																size: 3,
																center: true
															},
															fill: {
																color: 16777215,
																opacity: 0
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															2317928.03
														],
														[
															-20037508.34,
															19167419.98
														],
														[
															20037508.34,
															19167419.98
														],
														[
															20037508.34,
															2317928.03
														],
														[
															-20037508.34,
															2317928.03
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "820377CEEF874A4698BA9E1ECE87486B",
												title: "RC_SCANEX_NPP_FalseColor_IRK",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 13075,
												LayerID: "820377CEEF874A4698BA9E1ECE87486B",
												type: "Vector",
												date: "21.01.2019",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 9,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: null,
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "12.08.2013",
												DateEnd: "16.04.2019",
												DateBeginUTC: 1376265600,
												DateEndUTC: 1555372800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"acqdate",
													"acqtime",
													"platform",
													"station",
													"bands",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"time",
													"string",
													"string",
													"string",
													"string"
												],
												visible: false,
												MapStructureID: "C788E535EA624A9AB1773F176A18B5AC",
												isGeneralized: true,
												styles: [
													{
														Name: "изображения",
														MinZoom: 3,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>IsDay:</strong> [IsDay]<br /> <strong>ORBIT:</strong> [ORBIT]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>RESOLUTION:</strong> [RESOLUTION]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SEGMENT:</strong> [SEGMENT]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>TILES:</strong> [TILES]<br /> <br /> <a href=\"//projects.scanex.ru/SourceDownload/Default.aspx?sceneid=[SCENEID]&amp;station=[Station]\">Скачать исходные данные</a><br /> <br />[SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 2
															},
															marker: {
																size: 3,
																center: true
															}
														}
													},
													{
														Name: "контура",
														MinZoom: 1,
														MaxZoom: 2,
														BalloonEnable: false,
														DisableBalloonOnClick: true,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>IsDay:</strong> [IsDay]<br /> <strong>ORBIT:</strong> [ORBIT]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>RESOLUTION:</strong> [RESOLUTION]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SEGMENT:</strong> [SEGMENT]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>TILES:</strong> [TILES]<br /> <br /> <a href=\"//projects.scanex.ru/SourceDownload/Default.aspx?sceneid=[SCENEID]&amp;station=[Station]\">Скачать исходные данные</a><br /> <br />[SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															marker: {
																size: 3,
																center: true
															},
															fill: {
																color: 16777215,
																opacity: 0
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															2317590.55
														],
														[
															-20037508.34,
															19171876.02
														],
														[
															20037508.34,
															19171876.02
														],
														[
															20037508.34,
															2317590.55
														],
														[
															-20037508.34,
															2317590.55
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "825AD525214740A897007EF765D34C59",
												title: "OperativeADPS_IRK_EROS",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 729,
												LayerID: "825AD525214740A897007EF765D34C59",
												type: "Vector",
												date: "18.11.2013",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 18,
												RasterSRS: 3395,
												identityField: "ogc_fid",
												Quicklook: "null",
												NameObject: null,
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "ACQDATE",
												DateBegin: "13.08.2013",
												DateEnd: "24.04.2014",
												DateBeginUTC: 1376352000,
												DateEndUTC: 1398297600,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"SCENEID",
													"PLATFORM",
													"SENSOR",
													"BANDS",
													"TILES",
													"ACQDATE",
													"ACQTIME",
													"Delay",
													"Station",
													"ORBIT",
													"SEGMENT",
													"SUNELEV",
													"SUNAZIM",
													"RESOLUTION",
													"CLOUDS",
													"GMX_RasterCatalogID",
													"viewangle"
												],
												attrTypes: [
													"string",
													"string",
													"string",
													"string",
													"string",
													"datetime",
													"time",
													"string",
													"string",
													"integer",
													"string",
													"float",
													"float",
													"float",
													"integer",
													"string",
													"float"
												],
												visible: false,
												MapStructureID: "55A1517C8AEB47C5ABDF251966163AB1",
												isGeneralized: true,
												styles: [
													{
														Name: "маркеры",
														MinZoom: 1,
														MaxZoom: 5,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>ORBIT:</strong> [ORBIT]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>RESOLUTION:</strong> [RESOLUTION]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SEGMENT:</strong> [SEGMENT]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>TILES:</strong> [TILES]<br /> <strong>viewangle:</strong> [viewangle]<br /> <br /> <a href=\"//projects.scanex.ru/SourceDownload/Default.aspx?sceneid=[SCENEID]&amp;station=[Station]\">Скачать исходные данные</a><br /> <br />[SUMMARY]</p>",
														RenderStyle: {
															marker: {
																image: "//maps.kosmosnimki.ru/GetImage.ashx?usr=LayerManager&img=arrow_down.png",
																center: true
															}
														}
													},
													{
														Name: "изображения",
														MinZoom: 6,
														MaxZoom: 21,
														BalloonEnable: false,
														DisableBalloonOnClick: true,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>ORBIT:</strong> [ORBIT]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>RESOLUTION:</strong> [RESOLUTION]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SEGMENT:</strong> [SEGMENT]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>TILES:</strong> [TILES]<br /> <strong>viewangle:</strong> [viewangle]<br /> <br /> <a href=\"//projects.scanex.ru/SourceDownload/Default.aspx?sceneid=[SCENEID]&amp;station=[Station]\">Скачать исходные данные</a><br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															marker: {
																size: 3,
																center: true
															},
															fill: {
																color: 16777215,
																opacity: 20
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															4998507.65,
															-9580577.64
														],
														[
															4998507.65,
															13215045.99
														],
														[
															19159811.66,
															13215045.99
														],
														[
															19159811.66,
															-9580577.64
														],
														[
															4998507.65,
															-9580577.64
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "030914C5D13542D7B55BEC342F672D9D",
												title: "RC_SCANEX_MODIS_AQUA_FalseColor_IRK",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 24772,
												LayerID: "030914C5D13542D7B55BEC342F672D9D",
												type: "Vector",
												date: "25.10.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 9,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "27.09.2012",
												DateEnd: "16.04.2019",
												DateBeginUTC: 1348704000,
												DateEndUTC: 1555372800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"acqdate",
													"acqtime",
													"platform",
													"station",
													"bands",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"time",
													"string",
													"string",
													"string",
													"string"
												],
												visible: false,
												MapStructureID: "318C6DFC2B4F42E890159EAA194A13FA",
												TiledQuicklook: "http://maps.kosmosnimki.ru/TileSenderSimple.ashx?TilePath=OperativeMODIS[TILES]/",
												TiledQuicklookMinZoom: 3,
												isGeneralized: true,
												styles: [
													{
														Name: "контура",
														MinZoom: 1,
														MaxZoom: 2,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															fill: {
																color: 16777215,
																opacity: 0
															}
														}
													},
													{
														Name: "изображения",
														MinZoom: 3,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 2
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-1144389.29,
															2822428.09
														],
														[
															-1144389.29,
															14604504.71
														],
														[
															19529229.28,
															14604504.71
														],
														[
															19529229.28,
															2822428.09
														],
														[
															-1144389.29,
															2822428.09
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "778B754E089A461382BECA7A91653EC4",
												title: "RC_SCANEX_MODIS_TERRA_FalseColor_IRK",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 23765,
												LayerID: "778B754E089A461382BECA7A91653EC4",
												type: "Vector",
												date: "07.11.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 9,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: null,
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "10.11.2014",
												DateEnd: "16.04.2019",
												DateBeginUTC: 1415577600,
												DateEndUTC: 1555372800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"acqdate",
													"acqtime",
													"platform",
													"station",
													"bands",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"time",
													"string",
													"string",
													"string",
													"string"
												],
												visible: false,
												MapStructureID: "6C9DD8B4EB8E43A6A537F3F4D7555E69",
												TiledQuicklook: "http://maps.kosmosnimki.ru/TileSenderSimple.ashx?TilePath=OperativeMODIS[TILES]/",
												TiledQuicklookMinZoom: 3,
												isGeneralized: true,
												styles: [
													{
														Name: "контура",
														MinZoom: 1,
														MaxZoom: 2,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															fill: {
																color: 16777215,
																opacity: 0
															}
														}
													},
													{
														Name: "изображения",
														MinZoom: 3,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 2
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															2885141.76
														],
														[
															-20037508.34,
															14840726.55
														],
														[
															20037508.34,
															14840726.55
														],
														[
															20037508.34,
															2885141.76
														],
														[
															-20037508.34,
															2885141.76
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "73243B8BB5254E1EB8298A8278A6649D",
												title: "Operative_IRK_SPOT4_PAN",
												description: "снимки с 27.09.2012",
												Copyright: "",
												Owner: "mamont",
												MetaProperties: {
												},
												LayerVersion: 44560,
												LayerID: "73243B8BB5254E1EB8298A8278A6649D",
												type: "Vector",
												date: "02.10.2012",
												Legend: null,
												EncodeSource: "windows-1251",
												VtMinZoom: 1,
												VtMaxZoom: 5,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3395,
												identityField: "ogc_fid",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 0,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "ACQDATE",
												DateBegin: "27.09.2012",
												DateEnd: "11.01.2013",
												DateBeginUTC: 1348704000,
												DateEndUTC: 1357862400,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 8,
												GeometryType: "polygon",
												attributes: [
													"SCENEID",
													"PLATFORM",
													"SENSOR",
													"ACQDATE",
													"BANDS",
													"CLOUDS",
													"ORBIT",
													"SEGMENT",
													"TILES",
													"DELAY",
													"STATION",
													"VIEWANGLE",
													"SUNELEV",
													"SUNAZIM",
													"PATH",
													"ROW",
													"RESOLUTION",
													"ACQTIME",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"string",
													"string",
													"datetime",
													"string",
													"integer",
													"integer",
													"string",
													"string",
													"string",
													"string",
													"float",
													"float",
													"float",
													"integer",
													"integer",
													"float",
													"time",
													"string"
												],
												visible: false,
												MapStructureID: "28992490268F4647923B73A98FED677F",
												TiledQuicklook: "http://maps.kosmosnimki.ru/TileSenderSimple.ashx?TilePath=OperativeSpot4[TILES]/",
												TiledQuicklookMinZoom: 8,
												isGeneralized: true,
												styles: [
													{
														Name: "контура",
														MinZoom: 2,
														MaxZoom: 7,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														Balloon: "<b>ACQDATE:</b> [ACQDATE]<br />\n<b>ACQTIME:</b> [ACQTIME]<br />\n<b>BANDS:</b> [BANDS]<br />\n<b>CLOUDS:</b> [CLOUDS]<br />\n<b>DELAY:</b> [DELAY]<br />\n<b>GM_LayerName:</b> [GM_LayerName]<br />\n<b>ORBIT:</b> [ORBIT]<br />\n<b>PATH:</b> [PATH]<br />\n<b>PLATFORM:</b> [PLATFORM]<br />\n<b>RESOLUTION:</b> [RESOLUTION]<br />\n<b>ROW:</b> [ROW]<br />\n<b>SCENEID:</b> [SCENEID]<br />\n<b>SEGMENT:</b> [SEGMENT]<br />\n<b>SENSOR:</b> [SENSOR]<br />\n<b>STATION:</b> [STATION]<br />\n<b>SUNAZIM:</b> [SUNAZIM]<br />\n<b>SUNELEV:</b> [SUNELEV]<br />\n<b>TILES:</b> [TILES]<br />\n<b>VIEWANGLE:</b> [VIEWANGLE]<br />\n<a href=\"//[IP]/DownloadService/Default.aspx?sceneid=[SCENEID]\">Скачать исходные данные</a><br/>\n<br />\n[SUMMARY]",
														RenderStyle: {
															outline: {
																color: 0,
																thickness: 1
															},
															fill: {
																color: 14408667,
																opacity: 50
															}
														}
													},
													{
														Name: "снимки",
														MinZoom: 8,
														MaxZoom: 18,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 0,
																thickness: 1,
																opacity: 100
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															6748419.5,
															3198773.19
														],
														[
															6748419.5,
															13103062.91
														],
														[
															16338329.7,
															13103062.91
														],
														[
															16338329.7,
															3198773.19
														],
														[
															6748419.5,
															3198773.19
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "978A4877FC5143A7A8B6BEA4BCBE0106",
												title: "Operative_IRK_SPOT4_MS",
												description: "снимки с 27.09.2012",
												Copyright: "",
												Owner: "mamont",
												MetaProperties: {
												},
												LayerVersion: 35286,
												LayerID: "978A4877FC5143A7A8B6BEA4BCBE0106",
												type: "Vector",
												date: "02.10.2012",
												Legend: null,
												EncodeSource: "windows-1251",
												VtMinZoom: 1,
												VtMaxZoom: 5,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3395,
												identityField: "ogc_fid",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 0,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "ACQDATE",
												DateBegin: "27.09.2012",
												DateEnd: "11.01.2013",
												DateBeginUTC: 1348704000,
												DateEndUTC: 1357862400,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 8,
												GeometryType: "polygon",
												attributes: [
													"SCENEID",
													"PLATFORM",
													"SENSOR",
													"ACQDATE",
													"BANDS",
													"CLOUDS",
													"ORBIT",
													"SEGMENT",
													"TILES",
													"DELAY",
													"STATION",
													"VIEWANGLE",
													"SUNELEV",
													"SUNAZIM",
													"PATH",
													"ROW",
													"RESOLUTION",
													"ACQTIME",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"string",
													"string",
													"datetime",
													"string",
													"integer",
													"integer",
													"string",
													"string",
													"string",
													"string",
													"float",
													"float",
													"float",
													"integer",
													"integer",
													"float",
													"time",
													"string"
												],
												visible: false,
												MapStructureID: "95B75943B9154753B1AD2E6EA4A1AE3A",
												TiledQuicklook: "http://maps.kosmosnimki.ru/TileSenderSimple.ashx?TilePath=OperativeSpot4[TILES]/",
												TiledQuicklookMinZoom: 8,
												isGeneralized: true,
												styles: [
													{
														Name: "Безоблачно",
														MinZoom: 2,
														MaxZoom: 7,
														Filter: "\"CLOUDS\" >= 0 AND \"CLOUDS\" <= 5",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1
															},
															fill: {
																color: 14408667,
																opacity: 50
															}
														}
													},
													{
														Name: "Малооблачно",
														MinZoom: 2,
														MaxZoom: 7,
														Filter: "\"CLOUDS\" > 5 AND \"CLOUDS\" <= 20",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1
															},
															fill: {
																color: 10289144,
																opacity: 50
															}
														}
													},
													{
														Name: "Среднеоблачно",
														MinZoom: 2,
														MaxZoom: 7,
														Filter: "\"CLOUDS\" > 20 AND \"CLOUDS\" <= 35",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1
															},
															fill: {
																color: 2537471,
																opacity: 50
															}
														}
													},
													{
														Name: "Сильнооблачно",
														MinZoom: 2,
														MaxZoom: 7,
														Filter: "\"CLOUDS\" > 35 AND \"CLOUDS\" <= 50",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															fill: {
																color: 3368703,
																opacity: 50
															},
															outline: {
																thickness: 1,
																color: 16724736,
																opacity: 100
															}
														}
													},
													{
														Name: "Сплошная облачность",
														MinZoom: 2,
														MaxZoom: 7,
														Filter: "\"CLOUDS\" > 50 AND \"CLOUDS\" <= 100",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1
															},
															fill: {
																color: 4591247,
																opacity: 50
															}
														}
													},
													{
														Name: "Безоблачно",
														MinZoom: 8,
														MaxZoom: 18,
														Filter: "\"CLOUDS\" >= 0 AND \"CLOUDS\" <= 5",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1,
																opacity: 100
															}
														}
													},
													{
														Name: "Малооблачно",
														MinZoom: 8,
														MaxZoom: 18,
														Filter: "\"CLOUDS\" > 5 AND \"CLOUDS\" <= 20",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1,
																opacity: 100
															}
														}
													},
													{
														Name: "Среднеоблачно",
														MinZoom: 8,
														MaxZoom: 18,
														Filter: "\"CLOUDS\" > 20 AND \"CLOUDS\" <= 35",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1,
																opacity: 100
															}
														}
													},
													{
														Name: "Сильнооблачно",
														MinZoom: 8,
														MaxZoom: 18,
														Filter: "\"CLOUDS\" > 35 AND \"CLOUDS\" <= 50",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1,
																opacity: 100
															}
														}
													},
													{
														Name: "Сплошная облачность",
														MinZoom: 8,
														MaxZoom: 18,
														Filter: "\"CLOUDS\" > 50 AND \"CLOUDS\" <= 100",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1,
																opacity: 100
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															6748432.34,
															3198785.35
														],
														[
															6748432.34,
															13103051.49
														],
														[
															16338319.18,
															13103051.49
														],
														[
															16338319.18,
															3198785.35
														],
														[
															6748432.34,
															3198785.35
														]
													]
												]
											}
										},
										type: "layer"
									}
								],
								properties: {
									visible: false,
									title: "IRK",
									GroupID: "C1F566D0F07B49098B619E32E8DD6434",
									expanded: false,
									list: false,
									ShowCheckbox: true
								}
							},
							type: "group"
						},
						{
							content: {
								children: [
									{
										content: {
											properties: {
												Access: "edit",
												name: "7BBE572E27E24C89832A5C374FA950DA",
												title: "RC_SCANEX_NPP_TrueColor_MSK",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 13357,
												LayerID: "7BBE572E27E24C89832A5C374FA950DA",
												type: "Vector",
												date: "18.01.2019",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 9,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: null,
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "21.01.2013",
												DateEnd: "16.04.2019",
												DateBeginUTC: 1358726400,
												DateEndUTC: 1555372800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"acqdate",
													"acqtime",
													"platform",
													"station",
													"bands",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"time",
													"string",
													"string",
													"string",
													"string"
												],
												visible: false,
												MapStructureID: "D391012534BA4934B11F29DB3B54F7BF",
												isGeneralized: true,
												styles: [
													{
														Name: "изображения",
														MinZoom: 3,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>IsDay:</strong> [IsDay]<br /> <strong>ORBIT:</strong> [ORBIT]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>RESOLUTION:</strong> [RESOLUTION]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SEGMENT:</strong> [SEGMENT]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>TILES:</strong> [TILES]<br /> <br /> <a href=\"//projects.scanex.ru/SourceDownload/Default.aspx?sceneid=[SCENEID]&amp;station=[Station]\">Скачать исходные данные</a><br /> <br />[SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 2
															},
															marker: {
																size: 3,
																center: true
															}
														}
													},
													{
														Name: "контура",
														MinZoom: 1,
														MaxZoom: 2,
														BalloonEnable: false,
														DisableBalloonOnClick: true,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>IsDay:</strong> [IsDay]<br /> <strong>ORBIT:</strong> [ORBIT]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>RESOLUTION:</strong> [RESOLUTION]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SEGMENT:</strong> [SEGMENT]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>TILES:</strong> [TILES]<br /> <br /> <a href=\"//projects.scanex.ru/SourceDownload/Default.aspx?sceneid=[SCENEID]&amp;station=[Station]\">Скачать исходные данные</a><br /> <br />[SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															marker: {
																size: 3,
																center: true
															},
															fill: {
																color: 16777215,
																opacity: 0
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-9197164.2,
															-78271.52
														],
														[
															-9197164.2,
															19994875.22
														],
														[
															19503091.25,
															19994875.22
														],
														[
															19503091.25,
															-78271.52
														],
														[
															-9197164.2,
															-78271.52
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "0B809FC1A6DF4F3D92C15BAB0D653EC1",
												title: "RC_SCANEX_NPP_FalseColor_MSK",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 12886,
												LayerID: "0B809FC1A6DF4F3D92C15BAB0D653EC1",
												type: "Vector",
												date: "21.01.2019",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 9,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: null,
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "14.01.2013",
												DateEnd: "16.04.2019",
												DateBeginUTC: 1358121600,
												DateEndUTC: 1555372800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"acqdate",
													"acqtime",
													"platform",
													"station",
													"bands",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"time",
													"string",
													"string",
													"string",
													"string"
												],
												visible: false,
												MapStructureID: "D4E755D6CB6E4927820912EDC48F5797",
												isGeneralized: true,
												styles: [
													{
														Name: "изображения",
														MinZoom: 3,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>IsDay:</strong> [IsDay]<br /> <strong>ORBIT:</strong> [ORBIT]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>RESOLUTION:</strong> [RESOLUTION]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SEGMENT:</strong> [SEGMENT]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>TILES:</strong> [TILES]<br /> <br /> <a href=\"//projects.scanex.ru/SourceDownload/Default.aspx?sceneid=[SCENEID]&amp;station=[Station]\">Скачать исходные данные</a><br /> <br />[SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 2
															},
															marker: {
																size: 3,
																center: true
															}
														}
													},
													{
														Name: "контура",
														MinZoom: 1,
														MaxZoom: 2,
														BalloonEnable: false,
														DisableBalloonOnClick: true,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>IsDay:</strong> [IsDay]<br /> <strong>ORBIT:</strong> [ORBIT]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>RESOLUTION:</strong> [RESOLUTION]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SEGMENT:</strong> [SEGMENT]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>TILES:</strong> [TILES]<br /> <br /> <a href=\"//projects.scanex.ru/SourceDownload/Default.aspx?sceneid=[SCENEID]&amp;station=[Station]\">Скачать исходные данные</a><br /> <br />[SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															marker: {
																size: 3,
																center: true
															},
															fill: {
																color: 16777215,
																opacity: 0
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-9347109.62,
															-78271.52
														],
														[
															-9347109.62,
															19994875.22
														],
														[
															19503091.25,
															19994875.22
														],
														[
															19503091.25,
															-78271.52
														],
														[
															-9347109.62,
															-78271.52
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "D11BBAA6798D44F3B0D57A158D5702C5",
												title: "OperativeADPS_MSK_EROS",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 719,
												LayerID: "D11BBAA6798D44F3B0D57A158D5702C5",
												type: "Vector",
												date: "18.11.2013",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 18,
												RasterSRS: 3395,
												identityField: "ogc_fid",
												Quicklook: "null",
												NameObject: null,
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "ACQDATE",
												DateBegin: "11.08.2013",
												DateEnd: "20.09.2013",
												DateBeginUTC: 1376179200,
												DateEndUTC: 1379635200,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"SCENEID",
													"PLATFORM",
													"SENSOR",
													"BANDS",
													"TILES",
													"ACQDATE",
													"ACQTIME",
													"Delay",
													"Station",
													"ORBIT",
													"SEGMENT",
													"SUNELEV",
													"SUNAZIM",
													"RESOLUTION",
													"CLOUDS",
													"GMX_RasterCatalogID",
													"viewangle"
												],
												attrTypes: [
													"string",
													"string",
													"string",
													"string",
													"string",
													"datetime",
													"time",
													"string",
													"string",
													"integer",
													"string",
													"float",
													"float",
													"float",
													"integer",
													"string",
													"float"
												],
												visible: false,
												MapStructureID: "BB7BC292514346E99927C6F5F9E881E0",
												isGeneralized: true,
												styles: [
													{
														Name: "маркеры",
														MinZoom: 1,
														MaxZoom: 5,
														BalloonEnable: false,
														DisableBalloonOnClick: true,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>ORBIT:</strong> [ORBIT]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>RESOLUTION:</strong> [RESOLUTION]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SEGMENT:</strong> [SEGMENT]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>TILES:</strong> [TILES]<br /> <strong>viewangle:</strong> [viewangle]<br /> <br /> <a href=\"//projects.scanex.ru/SourceDownload/Default.aspx?sceneid=[SCENEID]&amp;station=[Station]\">Скачать исходные данные</a><br /> <br />[SUMMARY]</p>",
														RenderStyle: {
															marker: {
																image: "//maps.kosmosnimki.ru/GetImage.ashx?usr=LayerManager&img=arrow_down.png",
																center: true
															}
														}
													},
													{
														Name: "изображения",
														MinZoom: 6,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>ACQDATE:</strong> [ACQDATE]<br /> <strong>ACQTIME:</strong> [ACQTIME]<br /> <strong>BANDS:</strong> [BANDS]<br /> <strong>CLOUDS:</strong> [CLOUDS]<br /> <strong>Delay:</strong> [Delay]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>ORBIT:</strong> [ORBIT]<br /> <strong>PLATFORM:</strong> [PLATFORM]<br /> <strong>RESOLUTION:</strong> [RESOLUTION]<br /> <strong>SCENEID:</strong> [SCENEID]<br /> <strong>SEGMENT:</strong> [SEGMENT]<br /> <strong>SENSOR:</strong> [SENSOR]<br /> <strong>SUNAZIM:</strong> [SUNAZIM]<br /> <strong>SUNELEV:</strong> [SUNELEV]<br /> <strong>Station:</strong> [Station]<br /> <strong>TILES:</strong> [TILES]<br /> <strong>viewangle:</strong> [viewangle]<br /> <br /> <a href=\"//projects.scanex.ru/SourceDownload/Default.aspx?sceneid=[SCENEID]&amp;station=[Station]\">Скачать исходные данные</a><br /> <br />[SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															marker: {
																size: 3,
																center: true
															},
															fill: {
																color: 16777215,
																opacity: 20
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															3345070.15,
															5227547.47
														],
														[
															3345070.15,
															13851881.09
														],
														[
															17923709.88,
															13851881.09
														],
														[
															17923709.88,
															5227547.47
														],
														[
															3345070.15,
															5227547.47
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "BEAA5B4898024FAD936167CB36AF869A",
												title: "RC_SCANEX_MODIS_TERRA_FalseColor_MSK",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 23601,
												LayerID: "BEAA5B4898024FAD936167CB36AF869A",
												type: "Vector",
												date: "07.11.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 10,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: null,
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "21.09.2012",
												DateEnd: "16.04.2019",
												DateBeginUTC: 1348185600,
												DateEndUTC: 1555372800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"acqdate",
													"acqtime",
													"platform",
													"station",
													"bands",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"time",
													"string",
													"string",
													"string",
													"string"
												],
												visible: false,
												MapStructureID: "4634850CFE4F4C0D9AB8F7EC5871EB47",
												TiledQuicklook: "http://maps.kosmosnimki.ru/TileSenderSimple.ashx?TilePath=OperativeMODIS[TILES]/",
												TiledQuicklookMinZoom: 3,
												isGeneralized: true,
												styles: [
													{
														Name: "контура",
														MinZoom: 1,
														MaxZoom: 2,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															fill: {
																color: 16777215,
																opacity: 0
															}
														}
													},
													{
														Name: "изображения",
														MinZoom: 3,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 2
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															3138172.06
														],
														[
															-20037508.34,
															19994875.22
														],
														[
															20037508.34,
															19994875.22
														],
														[
															20037508.34,
															3138172.06
														],
														[
															-20037508.34,
															3138172.06
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "D8906BFD7BBA454D8995665B23010600",
												title: "RC_SCANEX_MODIS_AQUA_FalseColor_MSK",
												description: "",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 24985,
												LayerID: "D8906BFD7BBA454D8995665B23010600",
												type: "Vector",
												date: "25.10.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 0,
												MaxZoom: 10,
												RasterSRS: 3395,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "acqdate",
												DateBegin: "20.09.2012",
												DateEnd: "16.04.2019",
												DateBeginUTC: 1348099200,
												DateEndUTC: 1555372800,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 0,
												GeometryType: "polygon",
												attributes: [
													"sceneid",
													"acqdate",
													"acqtime",
													"platform",
													"station",
													"bands",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"date",
													"time",
													"string",
													"string",
													"string",
													"string"
												],
												visible: false,
												MapStructureID: "7D4132E369FB492F97324596B0D63B45",
												TiledQuicklook: "http://maps.kosmosnimki.ru/TileSenderSimple.ashx?TilePath=OperativeMODIS[TILES]/",
												TiledQuicklookMinZoom: 3,
												isGeneralized: true,
												styles: [
													{
														Name: "контура",
														MinZoom: 1,
														MaxZoom: 2,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															fill: {
																color: 16777215,
																opacity: 0
															}
														}
													},
													{
														Name: "изображения",
														MinZoom: 3,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 2
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															3237949.4
														],
														[
															-20037508.34,
															20037508.34
														],
														[
															20037508.34,
															20037508.34
														],
														[
															20037508.34,
															3237949.4
														],
														[
															-20037508.34,
															3237949.4
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "A0D93E362B0C4BB997387DD3F65347E0",
												title: "Operative_MSK_SPOT4_PAN",
												description: "снимки с 21.09.2012",
												Copyright: "",
												Owner: "mamont",
												MetaProperties: {
												},
												LayerVersion: 26813,
												LayerID: "A0D93E362B0C4BB997387DD3F65347E0",
												type: "Vector",
												date: "02.10.2012",
												Legend: null,
												EncodeSource: "windows-1251",
												VtMinZoom: 1,
												VtMaxZoom: 5,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3395,
												identityField: "ogc_fid",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 0,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "ACQDATE",
												DateBegin: "21.09.2012",
												DateEnd: "09.01.2013",
												DateBeginUTC: 1348185600,
												DateEndUTC: 1357689600,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 8,
												GeometryType: "polygon",
												attributes: [
													"SCENEID",
													"PLATFORM",
													"SENSOR",
													"ACQDATE",
													"BANDS",
													"CLOUDS",
													"ORBIT",
													"SEGMENT",
													"TILES",
													"DELAY",
													"STATION",
													"VIEWANGLE",
													"SUNELEV",
													"SUNAZIM",
													"PATH",
													"ROW",
													"RESOLUTION",
													"ACQTIME",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"string",
													"string",
													"datetime",
													"string",
													"integer",
													"integer",
													"string",
													"string",
													"string",
													"string",
													"float",
													"float",
													"float",
													"integer",
													"integer",
													"float",
													"time",
													"string"
												],
												visible: false,
												MapStructureID: "D598896DDE4B418B83A112BC27AFE4FF",
												TiledQuicklook: "http://maps.kosmosnimki.ru/TileSenderSimple.ashx?TilePath=OperativeSpot4[TILES]/",
												TiledQuicklookMinZoom: 8,
												isGeneralized: true,
												styles: [
													{
														Name: "контура",
														MinZoom: 2,
														MaxZoom: 7,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														Balloon: "<b>ACQDATE:</b> [ACQDATE]<br />\n<b>ACQTIME:</b> [ACQTIME]<br />\n<b>BANDS:</b> [BANDS]<br />\n<b>CLOUDS:</b> [CLOUDS]<br />\n<b>DELAY:</b> [DELAY]<br />\n<b>GM_LayerName:</b> [GM_LayerName]<br />\n<b>ORBIT:</b> [ORBIT]<br />\n<b>PATH:</b> [PATH]<br />\n<b>PLATFORM:</b> [PLATFORM]<br />\n<b>RESOLUTION:</b> [RESOLUTION]<br />\n<b>ROW:</b> [ROW]<br />\n<b>SCENEID:</b> [SCENEID]<br />\n<b>SEGMENT:</b> [SEGMENT]<br />\n<b>SENSOR:</b> [SENSOR]<br />\n<b>STATION:</b> [STATION]<br />\n<b>SUNAZIM:</b> [SUNAZIM]<br />\n<b>SUNELEV:</b> [SUNELEV]<br />\n<b>TILES:</b> [TILES]<br />\n<b>VIEWANGLE:</b> [VIEWANGLE]<br />\n<a href=\"//[IP]/DownloadService/Default.aspx?sceneid=[SCENEID]\">Скачать исходные данные</a><br/>\n<br />\n[SUMMARY]",
														RenderStyle: {
															outline: {
																color: 0,
																thickness: 1
															},
															fill: {
																color: 14408667,
																opacity: 50
															}
														}
													},
													{
														Name: "снимки",
														MinZoom: 8,
														MaxZoom: 18,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 0,
																thickness: 1,
																opacity: 100
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-991799.33,
															3333706.11
														],
														[
															-991799.33,
															13684906.2
														],
														[
															16261534.6,
															13684906.2
														],
														[
															16261534.6,
															3333706.11
														],
														[
															-991799.33,
															3333706.11
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "90DF59F6D20046FEAFBB6478D9473496",
												title: "Operative_MSK_SPOT4_MS",
												description: "снимки с 11.09.2012",
												Copyright: "",
												Owner: "mamont",
												MetaProperties: {
												},
												LayerVersion: 49593,
												LayerID: "90DF59F6D20046FEAFBB6478D9473496",
												type: "Vector",
												date: "02.10.2012",
												Legend: null,
												EncodeSource: "windows-1251",
												VtMinZoom: 1,
												VtMaxZoom: 6,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3395,
												identityField: "ogc_fid",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 0,
												TemporalPeriods: [
													1,
													16,
													256
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "ACQDATE",
												DateBegin: "11.09.2012",
												DateEnd: "09.01.2013",
												DateBeginUTC: 1347321600,
												DateEndUTC: 1357689600,
												IsRasterCatalog: true,
												RCMinZoomForRasters: 8,
												GeometryType: "polygon",
												attributes: [
													"SCENEID",
													"PLATFORM",
													"SENSOR",
													"ACQDATE",
													"BANDS",
													"CLOUDS",
													"ORBIT",
													"SEGMENT",
													"TILES",
													"DELAY",
													"STATION",
													"VIEWANGLE",
													"SUNELEV",
													"SUNAZIM",
													"PATH",
													"ROW",
													"RESOLUTION",
													"ACQTIME",
													"GMX_RasterCatalogID"
												],
												attrTypes: [
													"string",
													"string",
													"string",
													"datetime",
													"string",
													"integer",
													"integer",
													"string",
													"string",
													"string",
													"string",
													"float",
													"float",
													"float",
													"integer",
													"integer",
													"float",
													"time",
													"string"
												],
												visible: false,
												MapStructureID: "058DDBD75A4C4E8FB703807DF851B086",
												TiledQuicklook: "http://maps.kosmosnimki.ru/TileSenderSimple.ashx?TilePath=OperativeSpot4[TILES]/",
												TiledQuicklookMinZoom: 8,
												isGeneralized: true,
												styles: [
													{
														Name: "Безоблачно",
														MinZoom: 2,
														MaxZoom: 7,
														Filter: "\"CLOUDS\" >= 0 AND \"CLOUDS\" <= 5",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1
															},
															fill: {
																color: 14408667,
																opacity: 50
															}
														}
													},
													{
														Name: "Малооблачно",
														MinZoom: 2,
														MaxZoom: 7,
														Filter: "\"CLOUDS\" > 5 AND \"CLOUDS\" <= 20",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1
															},
															fill: {
																color: 10289144,
																opacity: 50
															}
														}
													},
													{
														Name: "Среднеоблачно",
														MinZoom: 2,
														MaxZoom: 7,
														Filter: "\"CLOUDS\" > 20 AND \"CLOUDS\" <= 35",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1
															},
															fill: {
																color: 2537471,
																opacity: 50
															}
														}
													},
													{
														Name: "Сильнооблачно",
														MinZoom: 2,
														MaxZoom: 7,
														Filter: "\"CLOUDS\" > 35 AND \"CLOUDS\" <= 50",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															fill: {
																color: 3368703,
																opacity: 50
															},
															outline: {
																thickness: 1,
																color: 16724736,
																opacity: 100
															}
														}
													},
													{
														Name: "Сплошная облачность",
														MinZoom: 2,
														MaxZoom: 7,
														Filter: "\"CLOUDS\" > 50 AND \"CLOUDS\" <= 100",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1
															},
															fill: {
																color: 4591247,
																opacity: 50
															}
														}
													},
													{
														Name: "Безоблачно",
														MinZoom: 8,
														MaxZoom: 18,
														Filter: "\"CLOUDS\" >= 0 AND \"CLOUDS\" <= 5",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1,
																opacity: 100
															}
														}
													},
													{
														Name: "Малооблачно",
														MinZoom: 8,
														MaxZoom: 18,
														Filter: "\"CLOUDS\" > 5 AND \"CLOUDS\" <= 20",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1,
																opacity: 100
															}
														}
													},
													{
														Name: "Среднеоблачно",
														MinZoom: 8,
														MaxZoom: 18,
														Filter: "\"CLOUDS\" > 20 AND \"CLOUDS\" <= 35",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1,
																opacity: 100
															}
														}
													},
													{
														Name: "Сильнооблачно",
														MinZoom: 8,
														MaxZoom: 18,
														Filter: "\"CLOUDS\" > 35 AND \"CLOUDS\" <= 50",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1,
																opacity: 100
															}
														}
													},
													{
														Name: "Сплошная облачность",
														MinZoom: 8,
														MaxZoom: 18,
														Filter: "\"CLOUDS\" > 50 AND \"CLOUDS\" <= 100",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: false,
														RenderStyle: {
															outline: {
																color: 16724736,
																thickness: 1,
																opacity: 100
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-1012197.34,
															3333718.28
														],
														[
															-1012197.34,
															13684891.04
														],
														[
															16261524,
															13684891.04
														],
														[
															16261524,
															3333718.28
														],
														[
															-1012197.34,
															3333718.28
														]
													]
												]
											}
										},
										type: "layer"
									}
								],
								properties: {
									visible: false,
									title: "MSK",
									GroupID: "75FFE5C1C85D4A7A8286F8AF752A1CCF",
									expanded: false,
									list: false,
									ShowCheckbox: true
								}
							},
							type: "group"
						}
					],
					properties: {
						visible: false,
						title: "Оперативные данные по станциям",
						GroupID: "50D44BE4164F4E3594B5F7C02A60E66D",
						expanded: false,
						list: false,
						ShowCheckbox: true
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								children: [
									{
										content: {
											properties: {
												Access: "edit",
												name: "B6627D67054240A7ACBC6D5DE1B2F9C4",
												title: "Поле ветра с шагом 2°",
												description: "карта ветра",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 5287,
												LayerID: "B6627D67054240A7ACBC6D5DE1B2F9C4",
												type: "Vector",
												date: "03.10.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 2,
												MinZoom: 1,
												MaxZoom: 2,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "DateTime",
												DateBegin: "18.10.2018",
												DateEnd: "18.04.2019",
												DateBeginUTC: 1539820800,
												DateEndUTC: 1555545600,
												GeometryType: "point",
												attributes: [
													"Lat",
													"Lon",
													"Angle",
													"Speed",
													"DateTime",
													"BeaufortScale"
												],
												attrTypes: [
													"float",
													"float",
													"float",
													"float",
													"datetime",
													"integer"
												],
												visible: false,
												MapStructureID: "E54E0C006C57460C8D6C427DFD91D291",
												isGeneralized: true,
												styles: [
													{
														Name: "0",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" < 0.5",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong> [Angle]&deg;<br /> <strong>DateTime:</strong> [DateTime]<br /><strong>Speed:</strong> [Speed] m/s<br /><br /></p>",
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/0.svg",
																center: true,
																color: 16711935
															}
														}
													},
													{
														Name: "0.5-1",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '0.5' and \"Speed\" <= '1'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/0.5-1.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "2-3",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '2' and \"Speed\" <= '3'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/2-3.svg",
																center: true,
																color: 16711935,
																angle: "[Angle]"
															}
														}
													},
													{
														Name: "4-6",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '4' and \"Speed\" <= '6'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/4-6.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "7-8",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '7' and \"Speed\" <= '8'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/7-8.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "9-11",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '9' and \"Speed\" <= '11'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s</p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/9-11.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "12-13",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '12' and \"Speed\" <= '13'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/12-13.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "14-16",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '14' and \"Speed\" <= '16'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/14-16.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "17-18",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '17' and \"Speed\" <= '18'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/17-18.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "19-21",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '19' and \"Speed\" <= '21'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/19-21.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "22-23",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '22' and \"Speed\" <= '23'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/22-23.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "24-26",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '24' and \"Speed\" <= '26'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/24-26.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "27-28",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '27' and \"Speed\" <= '28'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/27-28.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "29-31",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '29' and \"Speed\" <= '31'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/29-31.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: ">31",
														MinZoom: 1,
														MaxZoom: 4,
														Filter: "\"Speed\" >= '32'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/32-33.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															2495525.43
														],
														[
															-20037508.34,
															16925421.91
														],
														[
															19814869.37,
															16925421.91
														],
														[
															19814869.37,
															2495525.43
														],
														[
															-20037508.34,
															2495525.43
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "73296C4AF2CC4FD1A90F45539F818550",
												title: "Поле ветра с шагом 1°",
												description: "карта ветра",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 3620,
												LayerID: "73296C4AF2CC4FD1A90F45539F818550",
												type: "Vector",
												date: "04.10.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 3,
												VtMaxZoom: 3,
												MinZoom: 3,
												MaxZoom: 3,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "DateTime",
												DateBegin: "18.10.2018",
												DateEnd: "18.04.2019",
												DateBeginUTC: 1539820800,
												DateEndUTC: 1555545600,
												GeometryType: "point",
												attributes: [
													"Lat",
													"Lon",
													"Angle",
													"Speed",
													"DateTime",
													"BeaufortScale"
												],
												attrTypes: [
													"float",
													"float",
													"float",
													"float",
													"datetime",
													"integer"
												],
												visible: false,
												MapStructureID: "9775BEEE50EE4123A9C9C1831067683D",
												isGeneralized: true,
												styles: [
													{
														Name: "0",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" < 0.5",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong> [Angle]&deg;<br /> <strong>DateTime:</strong> [DateTime]<br /><strong>Speed:</strong> [Speed] m/s<br /><br /></p>",
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/0.svg",
																center: true,
																color: 16711935
															}
														}
													},
													{
														Name: "0.5-1",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '0.5' and \"Speed\" <= '1'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/0.5-1.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "2-3",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '2' and \"Speed\" <= '3'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/2-3.svg",
																center: true,
																color: 16711935,
																angle: "[Angle]"
															}
														}
													},
													{
														Name: "4-6",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '4' and \"Speed\" <= '6'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/4-6.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "7-8",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '7' and \"Speed\" <= '8'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/7-8.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "9-11",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '9' and \"Speed\" <= '11'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s</p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/9-11.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "12-13",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '12' and \"Speed\" <= '13'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/12-13.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "14-16",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '14' and \"Speed\" <= '16'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/14-16.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "17-18",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '17' and \"Speed\" <= '18'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/17-18.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "19-21",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '19' and \"Speed\" <= '21'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/19-21.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "22-23",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '22' and \"Speed\" <= '23'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/22-23.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "24-26",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '24' and \"Speed\" <= '26'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/24-26.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "27-28",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '27' and \"Speed\" <= '28'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/27-28.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: "29-31",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '29' and \"Speed\" <= '31'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/29-31.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													},
													{
														Name: ">31",
														MinZoom: 5,
														MaxZoom: 6,
														Filter: "\"Speed\" >= '32'",
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														RenderStyle: {
															common: true,
															type: "",
															maxSize: 0,
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/32-33.svg",
																center: true,
																angle: "[Angle]",
																color: 16711935
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															2495525.43
														],
														[
															-20037508.34,
															16925421.91
														],
														[
															19926188.86,
															16925421.91
														],
														[
															19926188.86,
															2495525.43
														],
														[
															-20037508.34,
															2495525.43
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "7CB878E2BE274837B291E592B2530C39",
												title: "Поле ветра с шагом 0.25°",
												description: "карта ветра",
												Copyright: "",
												Owner: "slipatov",
												MetaProperties: {
												},
												LayerVersion: 5848,
												LayerID: "7CB878E2BE274837B291E592B2530C39",
												type: "Vector",
												date: "04.10.2018",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 5,
												VtMaxZoom: 6,
												MinZoom: 5,
												MaxZoom: 6,
												identityField: "gmx_id",
												NameObject: "",
												Temporal: true,
												maxShownPeriod: 1,
												TemporalPeriods: [
													1
												],
												ZeroDate: "01.01.1980",
												TemporalColumnName: "DateTime",
												DateBegin: "18.10.2018",
												DateEnd: "18.04.2019",
												DateBeginUTC: 1539820800,
												DateEndUTC: 1555545600,
												GeometryType: "point",
												attributes: [
													"Lat",
													"Lon",
													"Angle",
													"Speed",
													"DateTime",
													"BeaufortScale"
												],
												attrTypes: [
													"float",
													"float",
													"float",
													"float",
													"datetime",
													"integer"
												],
												visible: false,
												MapStructureID: "738FD37EA2E74BB282BDC57D006B994C",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "0",
														Filter: "\"Speed\" < 0.5",
														Balloon: "<p><strong>Angle:</strong> [Angle]&deg;<br /> <strong>DateTime:</strong> [DateTime]<br /><strong>Speed:</strong> [Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/0.svg",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "0.5-1",
														Filter: "\"Speed\" >= '0.5' and \"Speed\" <= '1'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/0.5-1.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "2-3",
														Filter: "\"Speed\" >= '2' and \"Speed\" <= '3'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/2-3.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "4-6",
														Filter: "\"Speed\" >= '4' and \"Speed\" <= '6'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/4-6.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "7-8",
														Filter: "\"Speed\" >= '7' and \"Speed\" <= '8'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/7-8.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "9-11",
														Filter: "\"Speed\" >= '9' and \"Speed\" <= '11'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s</p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/9-11.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "12-13",
														Filter: "\"Speed\" >= '12' and \"Speed\" <= '13'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/12-13.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "14-16",
														Filter: "\"Speed\" >= '14' and \"Speed\" <= '16'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/14-16.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "17-18",
														Filter: "\"Speed\" >= '17' and \"Speed\" <= '18'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/17-18.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "19-21",
														Filter: "\"Speed\" >= '19' and \"Speed\" <= '21'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/19-21.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "22-23",
														Filter: "\"Speed\" >= '22' and \"Speed\" <= '23'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/22-23.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "24-26",
														Filter: "\"Speed\" >= '24' and \"Speed\" <= '26'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/24-26.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "27-28",
														Filter: "\"Speed\" >= '27' and \"Speed\" <= '28'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/27-28.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: "29-31",
														Filter: "\"Speed\" >= '29' and \"Speed\" <= '31'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/29-31.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													},
													{
														MinZoom: 7,
														MaxZoom: 21,
														Name: ">31",
														Filter: "\"Speed\" >= '32'",
														Balloon: "<p><strong>Angle:</strong>&nbsp;[Angle]&deg;<br /><strong>DateTime:</strong>&nbsp;[DateTime]<br /><strong>Speed:</strong>&nbsp;[Speed] m/s<br /><br /></p>",
														DisableBalloonOnMouseMove: true,
														DisableBalloonOnClick: false,
														RenderStyle: {
															marker: {
																image: "//kosmosnimki.ru/img/weather/svg-wind-color/32-33.svg",
																angle: "[Angle]",
																scale: 1,
																maxScale: 1000,
																minScale: 0.01,
																size: 10
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															-20037508.34,
															2495525.43
														],
														[
															-20037508.34,
															16925421.91
														],
														[
															20009678.47,
															16925421.91
														],
														[
															20009678.47,
															2495525.43
														],
														[
															-20037508.34,
															2495525.43
														]
													]
												]
											}
										},
										type: "layer"
									}
								],
								properties: {
									visible: false,
									title: "Ветер",
									GroupID: "Fop8RiMrRRBzy6RT",
									expanded: false,
									list: false,
									ShowCheckbox: true
								}
							},
							type: "group"
						}
					],
					properties: {
						visible: false,
						title: "GFS (meteo)",
						GroupID: "10riUTvti2NTfC5I",
						expanded: false,
						list: false,
						ShowCheckbox: true
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								properties: {
									Access: "edit",
									name: "7F62E9BD4C314EFB939A23BF38A5339B",
									title: "world_border",
									description: "",
									Copyright: "",
									Owner: "mamont",
									MetaProperties: {
									},
									LayerVersion: 20,
									LayerID: "7F62E9BD4C314EFB939A23BF38A5339B",
									type: "Vector",
									date: "05.02.2013",
									Legend: null,
									EncodeSource: "windows-1251",
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 1,
									MaxZoom: 1,
									identityField: "ogc_fid",
									NameObject: "",
									GeometryType: "polygon",
									attributes: [
										"t"
									],
									attrTypes: [
										"string"
									],
									visible: false,
									MapStructureID: "F1742FDDB58248A49A9186A4E6AF501C",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>t:</strong> [t]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 1339579,
													thickness: 1
												},
												fill: {
													pattern: {
														style: "diagonal1",
														width: 8,
														step: 0,
														colors: [
															0,
															16777215
														],
														patternColorsFunction: [
															null,
															null
														]
													},
													opacity: 41
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												-19971868.87
											],
											[
												-20037508.34,
												19979377.98
											],
											[
												20037508.34,
												19979377.98
											],
											[
												20037508.34,
												-19971868.87
											],
											[
												-20037508.34,
												-19971868.87
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "8EE2C7996800458AAF70BABB43321FA4",
									title: "AISDaily",
									description: "",
									Copyright: "&copy;  <a href=\"http://www.exactearth.com/products/exactais/\">ExactAIS</a>",
									Owner: "mamont",
									MetaProperties: {
									},
									LayerVersion: 291963,
									LayerID: "8EE2C7996800458AAF70BABB43321FA4",
									type: "Vector",
									date: "06.08.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 17,
									MinZoom: 1,
									MaxZoom: 17,
									identityField: "id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "ts_pos_utc",
									DateBegin: "26.02.2013",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1361836800,
									DateEndUTC: 1555372800,
									GeometryType: "point",
									attributes: [
										"mmsi",
										"imo",
										"vessel_name",
										"callsign",
										"vessel_type",
										"vessel_type_code",
										"vessel_type_cargo",
										"vessel_class",
										"length",
										"width",
										"flag_country",
										"flag_code",
										"destination",
										"eta",
										"draught",
										"longitude",
										"latitude",
										"sog",
										"cog",
										"rot",
										"heading",
										"nav_status",
										"nav_status_code",
										"source",
										"ts_pos_utc",
										"ts_static_utc",
										"ts_eta",
										"ts_insert_utc",
										"registry_name",
										"registry_name_en",
										"vessel_type_main",
										"vessel_type_sub",
										"message_type"
									],
									attrTypes: [
										"integer",
										"integer",
										"string",
										"string",
										"string",
										"integer",
										"string",
										"string",
										"integer",
										"integer",
										"string",
										"integer",
										"string",
										"string",
										"float",
										"float",
										"float",
										"integer",
										"float",
										"integer",
										"integer",
										"string",
										"integer",
										"string",
										"datetime",
										"datetime",
										"datetime",
										"datetime",
										"string",
										"string",
										"string",
										"string",
										"integer"
									],
									visible: false,
									MapStructureID: "616B00E036BD4BF581E3974503F49A43",
									AllowSearch: false,
									isGeneralized: true,
									styles: [
										{
											Name: "размер 1 WIG",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'WIG'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_WIG.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Vessel With Anti-Pollution Equipment",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Vessel With Anti-Pollution Equipment'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_VAPE.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Tug",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Tug'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Tug.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Towing",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Towing'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Towing.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Tanker",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Tanker'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog] <br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Tanker.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Spare",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Spare'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Spare.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Ships Not Party to Armed Conflict",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Ships Not Party to Armed Conflict'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_SNPAC.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 SAR",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'SAR'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_SAR.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Sailing",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Sailing'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Sailing.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Reserved",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Reserved'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Reserved.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Port Tender",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Port Tender'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_PT.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Pleasure Craft",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Pleasure Craft'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog] <br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_PC.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Pilot",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Pilot'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Pilot.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Passenger",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Passenger'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Passenger.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Other",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Other'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Other.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Military",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Military'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Military.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Medical Transport",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Medical Transport'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_MT.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Law Enforcement",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Law Enforcement'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_LE.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 HSC",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'HSC'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_HSC.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Fishing",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Fishing'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Fishing.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Dredging",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Dredging'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Dredging.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Diving",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Diving'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Diving.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Cargo",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Cargo'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Cargo.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Unknown",
											MinZoom: 5,
											MaxZoom: 18,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Unknown.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037506.1,
												-44812747.17
											],
											[
												-20037506.1,
												73014845.64
											],
											[
												20037470.27,
												73014845.64
											],
											[
												20037470.27,
												-44812747.17
											],
											[
												-20037506.1,
												-44812747.17
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "EE5587AF1F70433AA878462272C0274C",
									title: "AISLastPosition",
									description: "последняя позиция",
									Copyright: "",
									Owner: "golikov",
									MetaProperties: {
									},
									LayerVersion: 376759,
									LayerID: "EE5587AF1F70433AA878462272C0274C",
									type: "Vector",
									date: "03.08.2017",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 13,
									MinZoom: 1,
									MaxZoom: 13,
									identityField: "id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "ts_pos_utc",
									DateBegin: "27.02.2013",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1361923200,
									DateEndUTC: 1555372800,
									GeometryType: "point",
									attributes: [
										"mmsi",
										"imo",
										"vessel_name",
										"callsign",
										"vessel_type",
										"vessel_type_code",
										"vessel_type_cargo",
										"vessel_class",
										"length",
										"width",
										"flag_country",
										"flag_code",
										"destination",
										"eta",
										"draught",
										"longitude",
										"latitude",
										"sog",
										"cog",
										"rot",
										"heading",
										"nav_status",
										"nav_status_code",
										"source",
										"ts_pos_utc",
										"ts_static_utc",
										"ts_eta",
										"ts_insert_utc",
										"registry_name",
										"registry_name_en",
										"vessel_type_main",
										"vessel_type_sub",
										"message_type"
									],
									attrTypes: [
										"integer",
										"integer",
										"string",
										"string",
										"string",
										"integer",
										"string",
										"string",
										"integer",
										"integer",
										"string",
										"integer",
										"string",
										"string",
										"float",
										"float",
										"float",
										"integer",
										"float",
										"integer",
										"integer",
										"string",
										"integer",
										"string",
										"datetime",
										"datetime",
										"datetime",
										"datetime",
										"string",
										"string",
										"string",
										"string",
										"integer"
									],
									visible: false,
									MapStructureID: "F38FEF83D5924310BD00EA9E2C1BEDC8",
									isGeneralized: true,
									styles: [
										{
											Name: "cargo\\move\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" = 'Cargo' AND \"sog\">0 ",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #000000;\"><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #000000;\">[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												marker: {
													image: "//kosmosnimki.ru/img/AIS/cargo-L-100-move.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "cargo\\stand\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" = 'Cargo' AND \"sog\"=0 ",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/cargo-L-100-stand.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "fishing\\move\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" = 'Fishing' AND \"sog\">0 ",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/fishing-L-100-move.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "fishing\\stand\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" = 'Fishing' AND \"sog\"=0 ",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/fishing-L-100-stand.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "tanker\\move\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" = 'Tanker' AND \"sog\">0 ",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/tanker-L-100-move.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "tanker\\stand\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" = 'Tanker' AND \"sog\"=0 ",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/tanker-L-100-stand.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "pass\\move\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" = 'Passenger' AND \"sog\">0",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/passenger-L-100-move.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "pass\\stand\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" = 'Passenger' AND \"sog\"=0",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/passenger-L-100-stand.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "HSC\\move\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" = 'HSC' AND \"sog\">0 ",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/highspeed-L-100-move.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "HSC\\stand\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" = 'HSC' AND \"sog\"=0",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/highspeed-L-100-stand.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "ples\\move\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" in ('Pleasure Craft', 'Sailing') AND \"sog\">0 ",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/pleasure-L-100-move.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "ples\\stand\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" in ('Pleasure Craft', 'Sailing') AND \"sog\"=0",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/pleasure-L-100-stand.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "other\\move\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" in ('Unknown', 'Reserved', 'Other') AND \"sog\">0 \n\n",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/other-L-100-move.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "other\\stand\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" in ('Unknown', 'Reserved', 'Other') AND \"sog\"=0",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/other-L-100-stand.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "special\\move\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" in ('Dredging', 'Law Enforcement', 'Medical Transport', 'Military', 'Pilot', 'Port Tender', 'SAR', 'Ships Not Party to Armed Conflict', 'Spare', 'Towing', 'Tug', 'Vessel With Anti-Pollution Equipment', 'WIG', 'Diving') AND \"sog\">0",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/specialcraft-L-100-move.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										},
										{
											Name: "special\\stand\\large",
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"vessel_type\" in ('Dredging', 'Law Enforcement', 'Medical Transport', 'Military', 'Pilot', 'Port Tender', 'SAR', 'Ships Not Party to Armed Conflict', 'Spare', 'Towing', 'Tug', 'Vessel With Anti-Pollution Equipment', 'WIG', 'Diving') AND \"sog\"=0",
											BalloonEnable: true,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: false,
											Balloon: "<table style=\"width: 150px;\">\n<tbody>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span><strong>[vessel_name]</strong></span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span>[flag_country]</span></td>\n</tr>\n<tr>\n<td style=\"text-align: center;\" colspan=\"2\"><span style=\"color: #808080;\">[ts_pos_utc]</span></td>\n</tr>\n<tr>\n<td colspan=\"2\">\n<p style=\"margin-left: 2px;\"><img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" /></p>\n</td>\n</tr>\n<tr>\n<td><strong>IMO:</strong></td>\n<td>&nbsp;[imo]</td>\n</tr>\n<tr>\n<td><strong>MMSI:</strong></td>\n<td>&nbsp;[mmsi]</td>\n</tr>\n<tr>\n<td><strong>LAT:</strong></td>\n<td>&nbsp;[latitude]</td>\n</tr>\n<tr>\n<td><strong>LON:</strong></td>\n<td>&nbsp;[longitude]</td>\n</tr>\n</tbody>\n</table>",
											RenderStyle: {
												common: true,
												type: "",
												maxSize: 0,
												marker: {
													image: "//kosmosnimki.ru/img/AIS/specialcraft-L-100-stand.svg",
													center: true,
													angle: "[cog]",
													color: 16711935
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037373.68,
												-18434307.14
											],
											[
												-20037373.68,
												28014378.01
											],
											[
												20036563.26,
												28014378.01
											],
											[
												20036563.26,
												-18434307.14
											],
											[
												-20037373.68,
												-18434307.14
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "7233600AFBD042928211500639753B69",
									title: "AISLastPoint72",
									description: "",
									Copyright: "",
									Owner: "mamont",
									MetaProperties: {
										test_pg: {
											Type: "String",
											Value: ""
										}
									},
									LayerVersion: 399595,
									LayerID: "7233600AFBD042928211500639753B69",
									type: "Vector",
									date: "06.09.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 6,
									VtMaxZoom: 6,
									MinZoom: 6,
									MaxZoom: 6,
									identityField: "id",
									NameObject: "",
									GeometryType: "point",
									attributes: [
										"mmsi",
										"imo",
										"vessel_name",
										"callsign",
										"vessel_type",
										"vessel_type_code",
										"vessel_type_cargo",
										"vessel_class",
										"length",
										"width",
										"flag_country",
										"flag_code",
										"destination",
										"eta",
										"draught",
										"longitude",
										"latitude",
										"sog",
										"cog",
										"rot",
										"heading",
										"nav_status",
										"nav_status_code",
										"source",
										"ts_pos_utc",
										"ts_static_utc",
										"ts_eta",
										"ts_insert_utc",
										"registry_name",
										"registry_name_en",
										"vessel_type_main",
										"vessel_type_sub",
										"message_type"
									],
									attrTypes: [
										"integer",
										"integer",
										"string",
										"string",
										"string",
										"integer",
										"string",
										"string",
										"integer",
										"integer",
										"string",
										"integer",
										"string",
										"string",
										"float",
										"float",
										"float",
										"integer",
										"float",
										"integer",
										"integer",
										"string",
										"integer",
										"string",
										"datetime",
										"datetime",
										"datetime",
										"datetime",
										"string",
										"string",
										"string",
										"string",
										"integer"
									],
									visible: false,
									MapStructureID: "EEE94F8A6FB64AB6830CC936D106922A",
									AllowSearch: false,
									isGeneralized: true,
									styles: [
										{
											Name: "размер 1 WIG",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'WIG'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_WIG.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Vessel With Anti-Pollution Equipment",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Vessel With Anti-Pollution Equipment'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Скорость:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_VAPE.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Unknown",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Unknown'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Скорость:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Unknown.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Tug",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Tug'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Скорость:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Tug.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Towing",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Towing'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Towing.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Tanker",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Tanker'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog] <br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Tanker.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Spare",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Spare'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Spare.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Ships Not Party to Armed Conflict",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Ships Not Party to Armed Conflict'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_SNPAC.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 SAR",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'SAR'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_SAR.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Sailing",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Sailing'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Sailing.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Reserved",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Reserved'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Reserved.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Port Tender",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Port Tender'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_PT.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Pleasure Craft",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Pleasure Craft'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog] <br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_PC.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Pilot",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Pilot'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Pilot.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Passenger",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Passenger'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Passenger.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Other",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Other'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Other.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Military",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Military'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Military.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Medical Transport",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Medical Transport'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_MT.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Law Enforcement",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Law Enforcement'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_LE.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 HSC",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'HSC'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_HSC.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Fishing",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Fishing'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Fishing.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Dredging",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Dredging'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Dredging.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Diving",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Diving'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Diving.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Cargo",
											MinZoom: 1,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Cargo'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Cargo.svg",
													center: true,
													angle: "[cog]",
													size: 3
												},
												common: true,
												type: "",
												maxSize: 0
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037322.77,
												-9695036.64
											],
											[
												-20037322.77,
												16235184.57
											],
											[
												20029438.41,
												16235184.57
											],
											[
												20029438.41,
												-9695036.64
											],
											[
												-20037322.77,
												-9695036.64
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "0CF30127344044DBA775095D0E857DC7",
									title: "AISLastPositionDaily",
									description: "",
									Copyright: "",
									Owner: "mamont",
									MetaProperties: {
										test_pg: {
											Type: "String",
											Value: ""
										}
									},
									LayerVersion: 395289,
									LayerID: "0CF30127344044DBA775095D0E857DC7",
									type: "Vector",
									date: "06.09.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 6,
									MinZoom: 1,
									MaxZoom: 6,
									identityField: "id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "ts_pos_utc",
									DateBegin: "29.06.2018",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1530230400,
									DateEndUTC: 1555372800,
									GeometryType: "point",
									attributes: [
										"mmsi",
										"imo",
										"vessel_name",
										"callsign",
										"vessel_type",
										"vessel_type_code",
										"vessel_type_cargo",
										"vessel_class",
										"length",
										"width",
										"flag_country",
										"flag_code",
										"destination",
										"eta",
										"draught",
										"longitude",
										"latitude",
										"sog",
										"cog",
										"rot",
										"heading",
										"nav_status",
										"nav_status_code",
										"source",
										"ts_pos_utc",
										"ts_static_utc",
										"ts_eta",
										"ts_insert_utc",
										"registry_name",
										"registry_name_en",
										"vessel_type_main",
										"vessel_type_sub",
										"message_type",
										"ts_pos_utc_date"
									],
									attrTypes: [
										"integer",
										"integer",
										"string",
										"string",
										"string",
										"integer",
										"string",
										"string",
										"integer",
										"integer",
										"string",
										"integer",
										"string",
										"string",
										"float",
										"float",
										"float",
										"integer",
										"float",
										"integer",
										"integer",
										"string",
										"integer",
										"string",
										"datetime",
										"datetime",
										"datetime",
										"datetime",
										"string",
										"string",
										"string",
										"string",
										"integer",
										"date"
									],
									visible: false,
									MapStructureID: "2E698258584644619A019C36A8FBFE35",
									AllowSearch: false,
									isGeneralized: true,
									styles: [
										{
											Name: "размер 1 WIG",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'WIG'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_WIG.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Vessel With Anti-Pollution Equipment",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Vessel With Anti-Pollution Equipment'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Скорость:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_VAPE.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Unknown",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Unknown'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Скорость:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Unknown.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Tug",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Tug'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Скорость:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Tug.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Towing",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Towing'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Towing.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Tanker",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Tanker'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog] <br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Tanker.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Spare",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Spare'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Spare.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Ships Not Party to Armed Conflict",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Ships Not Party to Armed Conflict'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_SNPAC.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 SAR",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'SAR'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_SAR.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Sailing",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Sailing'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Sailing.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Reserved",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Reserved'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Reserved.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Port Tender",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Port Tender'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_PT.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Pleasure Craft",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Pleasure Craft'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog] <br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_PC.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Pilot",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Pilot'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Pilot.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Passenger",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Passenger'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Passenger.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Other",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Other'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Other.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Military",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Military'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Military.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Medical Transport",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Medical Transport'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_MT.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Law Enforcement",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Law Enforcement'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_LE.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 HSC",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'HSC'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_HSC.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Fishing",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Fishing'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Fishing.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Dredging",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Dredging'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Dredging.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Diving",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Diving'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /> <strong>Sog:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Diving.svg",
													center: true,
													angle: "[cog]",
													size: 3
												}
											}
										},
										{
											Name: "размер 1 Cargo",
											MinZoom: 5,
											MaxZoom: 18,
											Filter: "\"vessel_type\" = 'Cargo'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle_Cargo.svg",
													center: true,
													angle: "[cog]",
													size: 3
												},
												common: true,
												type: "",
												maxSize: 0
											}
										},
										{
											MinZoom: 4,
											MaxZoom: 4,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: false,
											Balloon: "<p><strong>Имя судна: [vessel_name]</strong> <br /> <img src=\"//photos.marinetraffic.com/ais/showphoto.aspx?size=thumb&amp;mmsi=[mmsi]\" alt=\"\" border=\"0\" /><br /><strong>Курс: </strong> [cog]&nbsp;<br /> <strong> Время точки:</strong> [ts_pos_utc] <br /> <strong> Позывной:</strong> [callsign] <br /> <strong> Назначение:</strong> [destination] <br /> <strong> Страна:</strong> [flag_country] <br /> <strong>Тип Судна: </strong> [vessel_type] <br /> <strong>Статус:</strong> [nav_status] <br /> <strong>Heading: </strong> [heading] <br /> <strong>Imo:</strong> [imo] <br /> <strong>Mmsi:</strong> [mmsi] <br /><strong>Скорость</strong><strong>:</strong> [sog] <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//maps.kosmosnimki.ru/api/plugins/img/triangle.svg",
													center: true,
													angle: "[cog]",
													scale: "0.4"
												},
												common: true,
												type: "",
												maxSize: 0
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037392.42,
												-14220647.73
											],
											[
												-20037392.42,
												28014378.01
											],
											[
												20037313.89,
												28014378.01
											],
											[
												20037313.89,
												-14220647.73
											],
											[
												-20037392.42,
												-14220647.73
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "13E2051DFEE04EEF997DC5733BD69A15",
									title: "AISTracksDaily",
									description: "",
									Copyright: "",
									Owner: "mamont",
									MetaProperties: {
									},
									LayerVersion: 118963,
									LayerID: "13E2051DFEE04EEF997DC5733BD69A15",
									type: "Vector",
									date: "06.09.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 17,
									MinZoom: 1,
									MaxZoom: 17,
									identityField: "id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "date",
									DateBegin: "26.02.2013",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1361836800,
									DateEndUTC: 1555372800,
									GeometryType: "linestring",
									attributes: [
										"mmsi",
										"imo",
										"date",
										"vessel_name",
										"vessel_type"
									],
									attrTypes: [
										"integer",
										"integer",
										"date",
										"string",
										"string"
									],
									visible: false,
									MapStructureID: "7D0594E907434E3B82C71D4420E68727",
									AllowSearch: false,
									isGeneralized: true,
									styles: [
										{
											MinZoom: 2,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Date:</strong> [Date]<br /> <strong>MMSI:</strong> [MMSI]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 1454560,
													thickness: 1,
													dashes: [
														4,
														4
													]
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												-14224594.98
											],
											[
												-20037508.34,
												70936632.79
											],
											[
												20037508.34,
												70936632.79
											],
											[
												20037508.34,
												-14224594.98
											],
											[
												-20037508.34,
												-14224594.98
											]
										]
									]
								}
							},
							type: "layer"
						}
					],
					properties: {
						visible: false,
						title: "АИС",
						GroupID: "63B00BB3B936416A9FC8F51AA56804E1",
						expanded: false,
						list: false,
						ShowCheckbox: false
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								properties: {
									Access: "edit",
									name: "DAEAD877FA124ED7AAA843EEDFB70AAC",
									title: "GCOM-W1 AMSR-2 Сплоченность льда",
									description: "Задержка в 3 сут. Разрешение 3 км",
									Copyright: "",
									Owner: "altyntsev",
									MetaProperties: {
										legend_eng: {
											Type: "String",
											Value: "<table> <tr style=\"height:20px\"> <td style=\"background-color:rgb(0,255,255);border:none;\"></td> <td style=\"background-color:rgb(40,215,255);border:none;\"></td> <td style=\"background-color:rgb(80,175,255);border:none;\"></td> <td style=\"background-color:rgb(120,135,255);border:none;\"></td> <td style=\"background-color:rgb(160,95,255);border:none;\"></td> <td style=\"background-color:rgb(200,55,255);border:none;\"></td> <td style=\"background-color:rgb(240,15,255);border:none;\"></td> </tr> <tr style=\"text-align: center;\"> <td style=\"border:none; width:20px\">70</td><td style=\"border:none;width:20px\">75</td><td style=\"border:none;width:20px\">80</td> <td style=\"border:none;width:20px\">85</td><td style=\"border:none;width:20px\">90</td><td style=\"border:none;width:20px\">95</td> <td style=\"border:none;width:20px\">100%</td> </tr> </table> Ice Concentration"
										},
										product: {
											Type: "String",
											Value: "MASAM2, Daily "
										},
										datasource_ref: {
											Type: "String",
											Value: "https://nsidc.org/data/docs/noaa/g10005-masam2/"
										}
									},
									LayerVersion: 7395,
									LayerID: "DAEAD877FA124ED7AAA843EEDFB70AAC",
									type: "Vector",
									date: "04.05.2017",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 0,
									MaxZoom: 5,
									RasterSRS: 3395,
									identityField: "gmx_id",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 1,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "date",
									DateBegin: "03.07.2012",
									DateEnd: "13.04.2019",
									DateBeginUTC: 1341273600,
									DateEndUTC: 1555113600,
									IsRasterCatalog: true,
									RCMinZoomForRasters: 0,
									GeometryType: "polygon",
									attributes: [
										"date",
										"GMX_RasterCatalogID",
										"sceneid"
									],
									attrTypes: [
										"date",
										"string",
										"string"
									],
									visible: false,
									MapStructureID: "53288620D2364B2E82B96064124FEE59",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: false,
											DisableBalloonOnClick: true,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>date:</strong> [date]<br /> <strong>GMX_RasterCatalogID:</strong> [GMX_RasterCatalogID]<br /> <strong>sceneid:</strong> [sceneid]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 0,
													opacity: 0
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037508.34,
												6229494.04
											],
											[
												-20037508.34,
												20037508.34
											],
											[
												20037508.34,
												20037508.34
											],
											[
												20037508.34,
												6229494.04
											],
											[
												-20037508.34,
												6229494.04
											]
										]
									]
								}
							},
							type: "layer"
						}
					],
					properties: {
						visible: false,
						title: "ICE",
						GroupID: "pUJpeZzMEFhrlpuM",
						expanded: false,
						list: false,
						ShowCheckbox: true
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								properties: {
									Access: "edit",
									name: "3E88643A8AC94AFAB4FD44941220B1CE",
									title: "[mailru].[fires].[global_cluster_per_day]",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 4531,
									LayerID: "3E88643A8AC94AFAB4FD44941220B1CE",
									type: "Vector",
									date: "22.10.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 8,
									MinZoom: 1,
									MaxZoom: 8,
									identityField: "ClusterId",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "ClusterDate",
									DateBegin: "27.07.2012",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1343347200,
									DateEndUTC: 1555372800,
									GeometryType: "point",
									attributes: [
										"ParentClusterId",
										"HotSpotCount",
										"TotalPower",
										"MaxArea",
										"PixelArea",
										"ClusterDate",
										"duration",
										"FireType",
										"Town",
										"IsIndustrial"
									],
									attrTypes: [
										"integer",
										"integer",
										"float",
										"float",
										"float",
										"date",
										"float",
										"integer",
										"string",
										"integer"
									],
									visible: false,
									MapStructureID: "F67DF73394004BD5BC5DEEB00095CF16",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>ClusterDate:</strong> [ClusterDate]<br /> <strong>HotSpotCount:</strong> [HotSpotCount]<br /> <strong>IsIndustrial:</strong> [IsIndustrial]<br /> <strong>MaxArea:</strong> [MaxArea]<br /> <strong>ParentClusterId:</strong> [ParentClusterId]<br /> <strong>PixelArea:</strong> [PixelArea]<br /> <strong>TotalPower:</strong> [TotalPower]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//images.kosmosnimki.ru/fires/fire.png",
													center: true
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-19525310.53,
												-8147342.38
											],
											[
												-19525310.53,
												11952548.43
											],
											[
												19999720.46,
												11952548.43
											],
											[
												19999720.46,
												-8147342.38
											],
											[
												-19525310.53,
												-8147342.38
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "F2840D287CD943C4B1122882C5B92565",
									title: "Russia_hotspots",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 71639,
									LayerID: "F2840D287CD943C4B1122882C5B92565",
									type: "Vector",
									date: "22.10.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 10,
									MinZoom: 1,
									MaxZoom: 10,
									identityField: "HotSpotID",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "DateTime",
									DateBegin: "09.04.2009",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1239235200,
									DateEndUTC: 1555372800,
									GeometryType: "point",
									attributes: [
										"latitude",
										"longitude",
										"brightness",
										"Platform",
										"Confidence",
										"Power",
										"daynight",
										"ClusterID",
										"FireType",
										"Town",
										"DateTime",
										"filename",
										"Sample",
										"line",
										"DataSource"
									],
									attrTypes: [
										"float",
										"float",
										"float",
										"string",
										"float",
										"float",
										"string",
										"integer",
										"integer",
										"string",
										"datetime",
										"string",
										"integer",
										"integer",
										"string"
									],
									visible: false,
									MapStructureID: "EFF860967D6B4E1F86AF2D499FDAF845",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Sample:</strong> [Sample]<br /> <strong>DataSource:</strong> [DataSource]<br /> <strong>Platform:</strong> [Platform]<br /> <strong>Confidence:</strong> [Confidence]<br /> <strong>Power:</strong> [Power]<br /> <strong>DateTime:</strong> [DateTime]<br /> <strong>ClusterID:</strong> [ClusterID]<br /> <strong>FireType:</strong> [FireType]<br /> <strong>Town:</strong> [Town]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//images.kosmosnimki.ru/fires/fire.png",
													center: true
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-18146746.78,
												2501471.1
											],
											[
												-18146746.78,
												12989102.69
											],
											[
												19577313.54,
												12989102.69
											],
											[
												19577313.54,
												2501471.1
											],
											[
												-18146746.78,
												2501471.1
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "E58063D97D534BB4BBDFF07FE5CB17F2",
									title: "[mailru].[fires].[scanex_cluster_per_day]",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 9520,
									LayerID: "E58063D97D534BB4BBDFF07FE5CB17F2",
									type: "Vector",
									date: "22.10.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 6,
									MinZoom: 1,
									MaxZoom: 6,
									identityField: "ClusterId",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16,
										256
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "DateTime",
									DateBegin: "10.04.2009",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1239321600,
									DateEndUTC: 1555372800,
									GeometryType: "point",
									attributes: [
										"ParentClusterId",
										"HotSpotCount",
										"TotalPower",
										"MaxArea",
										"PixelArea",
										"DateTime",
										"duration",
										"FireType",
										"Town"
									],
									attrTypes: [
										"integer",
										"integer",
										"float",
										"float",
										"float",
										"date",
										"float",
										"integer",
										"string"
									],
									visible: false,
									MapStructureID: "57620630D6574A8093B273BDA0BF3C59",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>ParentClusterId:</strong> [ParentClusterId]<br /> <strong>TotalPower:</strong> [TotalPower]<br /> <strong>HotSpotCount:</strong> [HotSpotCount]<br /> <strong>MaxArea:</strong> [MaxArea]<br /> <strong>PixelArea:</strong> [PixelArea]<br /> <strong>DateTime:</strong> [DateTime]<br /> <strong>FireType:</strong> [FireType]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//images.kosmosnimki.ru/fires/fire.png",
													center: true
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-18092311.53,
												2598464.91
											],
											[
												-18092311.53,
												12847081.65
											],
											[
												19292725.27,
												12847081.65
											],
											[
												19292725.27,
												2598464.91
											],
											[
												-18092311.53,
												2598464.91
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "C13B4D9706F7491EBC6DC70DFFA988C0",
									title: "[mailru].[fires].[global_hotspot]",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
									},
									LayerVersion: 164113,
									LayerID: "C13B4D9706F7491EBC6DC70DFFA988C0",
									type: "Vector",
									date: "22.10.2018",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 14,
									MinZoom: 1,
									MaxZoom: 14,
									identityField: "SpotID",
									NameObject: "",
									Temporal: true,
									maxShownPeriod: 0,
									TemporalPeriods: [
										1,
										16
									],
									ZeroDate: "01.01.1980",
									TemporalColumnName: "Timestamp",
									DateBegin: "27.07.2012",
									DateEnd: "16.04.2019",
									DateBeginUTC: 1343347200,
									DateEndUTC: 1555372800,
									GeometryType: "point",
									attributes: [
										"latitude",
										"longitude",
										"brightness",
										"Platform",
										"Confidence",
										"Power",
										"daynight",
										"ClusterID",
										"FireType",
										"Town",
										"Timestamp",
										"FileName",
										"Sample",
										"line",
										"IndustrialClusterID",
										"IndustrialFireStatus",
										"Source"
									],
									attrTypes: [
										"float",
										"float",
										"float",
										"string",
										"float",
										"float",
										"string",
										"integer",
										"integer",
										"string",
										"datetime",
										"string",
										"integer",
										"integer",
										"integer",
										"integer",
										"string"
									],
									visible: false,
									MapStructureID: "D49F5BE37DBD420DAFEAD762FA07F11E",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>FileName:</strong> [FileName]<br /> <strong>Confidence:</strong> [Confidence]<br /> <strong>Timestamp:</strong> [Timestamp]<br /> <strong>ClusterID:</strong> [ClusterID]<br /> <strong>IndustrialClusterID:</strong> [IndustrialClusterID]<br /> <strong>IndustrialFireStatus:</strong> [IndustrialFireStatus]<br /> <strong>FireType:</strong> [FireType]<br /> <strong>Platform:</strong> [Platform]<br /> <strong>Source:</strong> [Source]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												marker: {
													image: "//images.kosmosnimki.ru/fires/fire.png",
													center: true
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												-20037397.05,
												-21027100.63
											],
											[
												-20037397.05,
												17113669.59
											],
											[
												20034856.86,
												17113669.59
											],
											[
												20034856.86,
												-21027100.63
											],
											[
												-20037397.05,
												-21027100.63
											]
										]
									]
								}
							},
							type: "layer"
						}
					],
					properties: {
						visible: false,
						title: "FIRES",
						GroupID: "vmxVgP21s0kA2OHw",
						expanded: false,
						list: false,
						ShowCheckbox: true
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								children: [
									{
										content: {
											properties: {
												Access: "edit",
												name: "5BB469632E9543109D0C92D9025392DD",
												title: "suda_15062017_Sentinel_poly",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 59,
												LayerID: "5BB469632E9543109D0C92D9025392DD",
												type: "Vector",
												date: "21.07.2017",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 1,
												MaxZoom: 1,
												identityField: "gmx_id",
												NameObject: "",
												GeometryType: "polygon",
												attributes: [
													"target_id"
												],
												attrTypes: [
													"integer"
												],
												visible: false,
												MapStructureID: "85A8E244212142CCB3A5524E2836AD01",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														BalloonEnable: true,
														DisableBalloonOnClick: false,
														DisableBalloonOnMouseMove: true,
														Balloon: "<p><strong>text:</strong> [text]<br /> <br /> [SUMMARY]</p>",
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 2
															},
															fill: {
																color: 16777215,
																opacity: 20
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															3499857.22,
															5225404.62
														],
														[
															3499857.22,
															5470698.96
														],
														[
															3781176.24,
															5470698.96
														],
														[
															3781176.24,
															5225404.62
														],
														[
															3499857.22,
															5225404.62
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "DA7DE148675A4B24A0F613D82997E4B5",
												title: "suda_15062017_Sentinel_point",
												description: "",
												Copyright: "",
												Owner: "michigan",
												MetaProperties: {
												},
												LayerVersion: 157,
												LayerID: "DA7DE148675A4B24A0F613D82997E4B5",
												type: "Vector",
												date: "21.07.2017",
												Legend: null,
												EncodeSource: null,
												VtMinZoom: 1,
												VtMaxZoom: 1,
												MinZoom: 1,
												MaxZoom: 1,
												identityField: "gmx_id",
												NameObject: "",
												GeometryType: "point",
												attributes: [
													"text",
													"target_id"
												],
												attrTypes: [
													"string",
													"integer"
												],
												visible: false,
												MapStructureID: "A796D59CA08E4830A7DA57E9487A3CF1",
												isGeneralized: true,
												styles: [
													{
														MinZoom: 1,
														MaxZoom: 21,
														RenderStyle: {
															outline: {
																color: 255,
																thickness: 1
															},
															marker: {
																size: 8
															},
															fill: {
																color: 16777215,
																opacity: 20
															}
														}
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															3498599.22,
															5223142.79
														],
														[
															3498599.22,
															5470617.22
														],
														[
															3812038.81,
															5470617.22
														],
														[
															3812038.81,
															5223142.79
														],
														[
															3498599.22,
															5223142.79
														]
													]
												]
											}
										},
										type: "layer"
									}
								],
								properties: {
									visible: false,
									title: "reference",
									GroupID: "Et49BDumkEobH02m",
									expanded: false,
									list: false,
									ShowCheckbox: true
								}
							},
							type: "group"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "4DBE814757BE4820AD10DCE80FECD507",
									title: "S1B_IW_GRDH_1SDV_20170615T154253_results_r",
									description: "",
									Copyright: "",
									Owner: "michigan",
									MetaProperties: {
									},
									LayerVersion: 7,
									LayerID: "4DBE814757BE4820AD10DCE80FECD507",
									type: "Vector",
									date: "21.07.2017",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 1,
									MaxZoom: 1,
									identityField: "gmx_id",
									NameObject: "",
									GeometryType: "polygon",
									attributes: [
										"Field1"
									],
									attrTypes: [
										"string"
									],
									visible: false,
									MapStructureID: "5C4A4CF1FC194E94960C971C46183779",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>Field1:</strong> [Field1]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 16711680,
													thickness: 2
												},
												fill: {
													color: 16777215,
													opacity: 0
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												3479891.71,
												5223077.25
											],
											[
												3479891.71,
												5478703.8
											],
											[
												3812191.91,
												5478703.8
											],
											[
												3812191.91,
												5223077.25
											],
											[
												3479891.71,
												5223077.25
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								children: [
									{
										content: {
											properties: {
												Access: "edit",
												name: "753FE659FA7E4600A119329F8EAA46FD",
												title: "S1A_EW_GRDM_1SDH_20170715T025203_1",
												description: "",
												Copyright: "",
												Owner: "alt_proc",
												MetaProperties: {
													polar: {
														Type: "String",
														Value: "DH"
													},
													esa_product_id: {
														Type: "String",
														Value: "836f2807-74df-4b3a-9e8a-f6dcb6bd7421"
													},
													acqtime: {
														Type: "Time",
														Value: 10323
													},
													acqdate: {
														Type: "Date",
														Value: 1500076800
													},
													sceneid: {
														Type: "String",
														Value: "S1A_EW_GRDM_1SDH_20170715T025203_1"
													},
													platform: {
														Type: "String",
														Value: "Sentinel-1A"
													},
													mode: {
														Type: "String",
														Value: "EW"
													},
													acqdatetime: {
														Type: "DateTime",
														Value: 1500087123
													},
													resolution: {
														Type: "Number",
														Value: 40
													}
												},
												LayerVersion: 0,
												LayerID: "753FE659FA7E4600A119329F8EAA46FD",
												type: "Raster",
												date: "15.07.2017",
												Legend: null,
												MinZoom: 0,
												MaxZoom: 10,
												RasterSRS: 3395,
												RasterPath: "Y:\\Kosmosnimki\\Operative\\s1\\tile\\2017\\2017-07-15\\S1A_EW_GRDM_1SDH_20170715T025203_1.tiles",
												visible: false,
												MapStructureID: "A52CBCB2EE154BF096C08C0D92FE036F",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															7155070.61,
															11139499.35
														],
														[
															7099550.45,
															11159493.9
														],
														[
															7043707.07,
															11179087.65
														],
														[
															6987542.33,
															11198274.93
														],
														[
															6931064.63,
															11217046.92
														],
														[
															6874275.51,
															11235397.04
														],
														[
															6817183.98,
															11253316.66
														],
														[
															6759791.93,
															11270799.3
														],
														[
															6702107.99,
															11287836.78
														],
														[
															6644138.29,
															11304421.82
														],
														[
															6585886.19,
															11320547.85
														],
														[
															6527361.19,
															11336207.12
														],
														[
															6468570.12,
															11351392.66
														],
														[
															6409516.9,
															11366098.23
														],
														[
															6350212.91,
															11380316.36
														],
														[
															6290661.43,
															11394041.22
														],
														[
															6230873.3,
															11407265.89
														],
														[
															6170856.47,
															11419984.2
														],
														[
															6110616.88,
															11432190.41
														],
														[
															6050162.82,
															11443878.65
														],
														[
															5989506.46,
															11455043.8
														],
														[
															5947899.35,
															11462368.27
														],
														[
															5937162.71,
															11401332.8
														],
														[
															5926571.03,
															11340833.49
														],
														[
															5916122.43,
															11280860.46
														],
														[
															5905293.9,
															11221491.82
														],
														[
															5894627.67,
															11162625.39
														],
														[
															5884392.14,
															11104206.57
														],
														[
															5874630.72,
															11046219.6
														],
														[
															5865221.19,
															10988676.37
														],
														[
															5855843.91,
															10931621.22
														],
														[
															5846303.88,
															10875077.37
														],
														[
															5836808.27,
															10819001.92
														],
														[
															5827438.97,
															10763372.88
														],
														[
															5818005.2,
															10708213.65
														],
														[
															5808666.1,
															10653490.11
														],
														[
															5799608.46,
															10599164.46
														],
														[
															5790731.5,
															10545245.72
														],
														[
															5781950.35,
															10491740.65
														],
														[
															5773254.72,
															10438643.49
														],
														[
															5767941.02,
															10405918.29
														],
														[
															5820198.96,
															10397383.4
														],
														[
															5872211.8,
															10388478.06
														],
														[
															5924146.52,
															10379187.94
														],
														[
															5975939.03,
															10369521
														],
														[
															6027570.08,
															10359471.19
														],
														[
															6079065.34,
															10349042.04
														],
														[
															6130349.84,
															10338253.16
														],
														[
															6181557.38,
															10327090.44
														],
														[
															6232479.95,
															10315585.34
														],
														[
															6283379.49,
															10303702.74
														],
														[
															6333922.96,
															10291497.64
														],
														[
															6384494.99,
															10278909.6
														],
														[
															6434643.22,
															10266021.33
														],
														[
															6484869.02,
															10252742.97
														],
														[
															6534631.48,
															10239183.65
														],
														[
															6584468.58,
															10225235.94
														],
														[
															6633835.49,
															10211021.27
														],
														[
															6683262.54,
															10196422.59
														],
														[
															6732348.21,
															10181536.95
														],
														[
															6781094.48,
															10166371.8
														],
														[
															6814465.85,
															10155827.06
														],
														[
															6830573.03,
															10205572.45
														],
														[
															6846927.39,
															10255633.55
														],
														[
															6863487.55,
															10306029.53
														],
														[
															6880291.57,
															10356753.85
														],
														[
															6897428.7,
															10407782.97
														],
														[
															6914893.16,
															10459124.36
														],
														[
															6932518.8,
															10510839.28
														],
														[
															6950285.11,
															10562941.64
														],
														[
															6968280.07,
															10615408.83
														],
														[
															6986379.17,
															10668290.27
														],
														[
															7004538.37,
															10721609.2
														],
														[
															7022996.55,
															10775291.44
														],
														[
															7041977.36,
															10829265.82
														],
														[
															7061547.8,
															10883514.33
														],
														[
															7081573.99,
															10938089.39
														],
														[
															7101703.46,
															10993123.2
														],
														[
															7121841.27,
															11048659.38
														],
														[
															7142279.56,
															11104602.32
														],
														[
															7155070.61,
															11139499.35
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "C46D1589FEDB42F39D45EEE66CA26367",
												title: "S1A_IW_GRDH_1SDV_20170523T025112_1",
												description: "",
												Copyright: "",
												Owner: "alt_proc",
												MetaProperties: {
													polar: {
														Type: "String",
														Value: "DV"
													},
													esa_product_id: {
														Type: "String",
														Value: "b3c297d8-1987-4d5b-b7fe-97a6d162cca1"
													},
													acqtime: {
														Type: "Time",
														Value: 10272
													},
													acqdate: {
														Type: "Date",
														Value: 1495497600
													},
													sceneid: {
														Type: "String",
														Value: "S1A_IW_GRDH_1SDV_20170523T025112_1"
													},
													platform: {
														Type: "String",
														Value: "Sentinel-1A"
													},
													mode: {
														Type: "String",
														Value: "IW"
													},
													acqdatetime: {
														Type: "DateTime",
														Value: 1495507872
													},
													resolution: {
														Type: "Number",
														Value: 10
													}
												},
												LayerVersion: 0,
												LayerID: "C46D1589FEDB42F39D45EEE66CA26367",
												type: "Raster",
												date: "23.05.2017",
												Legend: null,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3395,
												RasterPath: "Y:\\Kosmosnimki\\Operative\\s1\\tile\\2017\\2017-05-23\\S1A_IW_GRDH_1SDV_20170523T025112_1.tiles",
												visible: false,
												MapStructureID: "B74FD2A520DF44C698D5A2EB87AA68DD",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															5644897.6,
															5485156.91
														],
														[
															5638068.47,
															5486480.27
														],
														[
															5631239.33,
															5487803.82
														],
														[
															5624405.66,
															5489115.56
														],
														[
															5617571.51,
															5490426.38
														],
														[
															5610735.64,
															5491732.8
														],
														[
															5603896.51,
															5493030.87
														],
														[
															5597057.39,
															5494329.12
														],
														[
															5590214.39,
															5495617.25
														],
														[
															5583370.33,
															5496902.71
														],
														[
															5576525.26,
															5498185.48
														],
														[
															5569676.31,
															5499458.13
														],
														[
															5562827.36,
															5500730.96
														],
														[
															5555975.27,
															5501995.35
														],
														[
															5549121.48,
															5503255.32
														],
														[
															5542267.27,
															5504514.33
														],
														[
															5535408.66,
															5505761.43
														],
														[
															5528550.06,
															5507008.7
														],
														[
															5521689.04,
															5508249.25
														],
														[
															5514825.68,
															5509483.6
														],
														[
															5507962.32,
															5510718.13
														],
														[
															5501094.46,
															5511940.16
														],
														[
															5494226.39,
															5513161.74
														],
														[
															5487356.55,
															5514378.33
														],
														[
															5480483.81,
															5515586.95
														],
														[
															5473611.06,
															5516795.72
														],
														[
															5466734.54,
															5517993.71
														],
														[
															5459857.16,
															5519189.49
														],
														[
															5452978.62,
															5520382.01
														],
														[
															5446096.66,
															5521564.76
														],
														[
															5439214.71,
															5522747.66
														],
														[
															5432329.68,
															5523921.5
														],
														[
															5425443.19,
															5525091.35
														],
														[
															5418556.14,
															5526259.69
														],
														[
															5411665.16,
															5527416.45
														],
														[
															5404774.18,
															5528573.36
														],
														[
															5397880.75,
															5529722.94
														],
														[
															5390985.32,
															5530866.74
														],
														[
															5384089.9,
															5532010.69
														],
														[
															5377190.16,
															5533141.45
														],
														[
															5370290.34,
															5534272.26
														],
														[
															5363388.66,
															5535397.47
														],
														[
															5356484.49,
															5536515.1
														],
														[
															5349580.31,
															5537632.87
														],
														[
															5342672.49,
															5538739.2
														],
														[
															5335764,
															5539843.77
														],
														[
															5328854.27,
															5540944.51
														],
														[
															5321941.53,
															5542035.87
														],
														[
															5315028.79,
															5543127.35
														],
														[
															5308113.05,
															5544209.18
														],
														[
															5301196.12,
															5545287.48
														],
														[
															5297875.99,
															5545805.11
														],
														[
															5296777.92,
															5538807.44
														],
														[
															5295679.85,
															5531815.15
														],
														[
															5294581.78,
															5524828.21
														],
														[
															5293476.77,
															5517846.34
														],
														[
															5292374,
															5510869.45
														],
														[
															5291278.39,
															5503898.18
														],
														[
															5290182.79,
															5496932.22
														],
														[
															5289087.19,
															5489971.57
														],
														[
															5287987.01,
															5483015.51
														],
														[
															5286893.83,
															5476065.02
														],
														[
															5285800.65,
															5469119.8
														],
														[
															5284707.47,
															5462179.83
														],
														[
															5283616.59,
															5455244.71
														],
														[
															5282525.8,
															5448314.81
														],
														[
															5281435.01,
															5441390.13
														],
														[
															5280337.94,
															5434470.38
														],
														[
															5279248.8,
															5427555.74
														],
														[
															5278160.37,
															5420646.29
														],
														[
															5277071.94,
															5413742.01
														],
														[
															5275977.44,
															5406842.62
														],
														[
															5274883.69,
															5399947.98
														],
														[
															5273797.58,
															5393058.79
														],
														[
															5272711.48,
															5386174.73
														],
														[
															5271625.37,
															5379295.77
														],
														[
															5270534.69,
															5372421.24
														],
														[
															5269450.87,
															5365552.09
														],
														[
															5268367.05,
															5358688
														],
														[
															5267283.23,
															5351828.98
														],
														[
															5266201.47,
															5344974.66
														],
														[
															5265119.9,
															5338125.35
														],
														[
															5264038.33,
															5331281.06
														],
														[
															5262951.31,
															5324441.54
														],
														[
															5261867.69,
															5317606.99
														],
														[
															5261409.72,
															5314710.72
														],
														[
															5268154.93,
															5313651.59
														],
														[
															5274900.14,
															5312592.58
														],
														[
															5281642.31,
															5311523.84
														],
														[
															5288383.62,
															5310452.63
														],
														[
															5295124.06,
															5309378.73
														],
														[
															5301861.4,
															5308295.29
														],
														[
															5308598.74,
															5307211.97
														],
														[
															5315333.44,
															5306120.56
														],
														[
															5322066.78,
															5305025.03
														],
														[
															5328799.79,
															5303928.47
														],
														[
															5335529.08,
															5302820.76
														],
														[
															5342258.37,
															5301713.18
														],
														[
															5348985.51,
															5300599.17
														],
														[
															5355710.72,
															5299479.43
														],
														[
															5362435.92,
															5298359.82
														],
														[
															5369157.21,
															5297228.42
														],
														[
															5375878.29,
															5296096.67
														],
														[
															5382597.74,
															5294960.17
														],
														[
															5389314.65,
															5293816.31
														],
														[
															5396031.57,
															5292672.6
														],
														[
															5402744.99,
															5291518.76
														],
														[
															5409457.7,
															5290362.97
														],
														[
															5416169.33,
															5289204.06
														],
														[
															5422877.79,
															5288036.2
														],
														[
															5429586.25,
															5286868.49
														],
														[
															5436291.72,
															5285692.32
														],
														[
															5442995.9,
															5284512.58
														],
														[
															5449699.52,
															5283331.36
														],
														[
															5456399.37,
															5282139.61
														],
														[
															5463099.23,
															5280948.01
														],
														[
															5469796.66,
															5279749.61
														],
														[
															5476492.14,
															5278546.03
														],
														[
															5483187.63,
															5277342.6
														],
														[
															5489878.72,
															5276127.06
														],
														[
															5496569.8,
															5274911.69
														],
														[
															5503259.01,
															5273691.15
														],
														[
															5509945.65,
															5272463.85
														],
														[
															5516632.3,
															5271236.7
														],
														[
															5523315.06,
															5269999.11
														],
														[
															5529997.22,
															5268760.06
														],
														[
															5536678.08,
															5267517.49
														],
														[
															5543355.73,
															5266266.58
														],
														[
															5550033.38,
															5265015.82
														],
														[
															5556707.67,
															5263756.27
														],
														[
															5563380.77,
															5262493.68
														],
														[
															5570053.11,
															5261229.18
														],
														[
															5576721.62,
															5259954.76
														],
														[
															5583390.12,
															5258680.52
														],
														[
															5590055.88,
															5257399.12
														],
														[
															5596719.76,
															5256113.08
														],
														[
															5599918.42,
															5255495.85
														],
														[
															5601248,
															5262287.66
														],
														[
															5602576.54,
															5269084.26
														],
														[
															5603909.12,
															5275885.58
														],
														[
															5605241.71,
															5282691.84
														],
														[
															5606569.23,
															5289503.18
														],
														[
															5607892.41,
															5296319.31
														],
														[
															5609228.34,
															5303139.88
														],
														[
															5610565.46,
															5309965.39
														],
														[
															5611902.58,
															5316795.89
														],
														[
															5613242.66,
															5323631.01
														],
														[
															5614584.36,
															5330470.94
														],
														[
															5615926.07,
															5337315.89
														],
														[
															5617262.92,
															5344166.01
														],
														[
															5618594.97,
															5351021.06
														],
														[
															5619939.82,
															5357880.63
														],
														[
															5621286.18,
															5364745.22
														],
														[
															5622632.54,
															5371614.88
														],
														[
															5623973.89,
															5378489.53
														],
														[
															5625323.29,
															5385368.88
														],
														[
															5626674.36,
															5392253.28
														],
														[
															5628025.44,
															5399142.8
														],
														[
															5629379.42,
															5406037.1
														],
														[
															5630735.26,
															5412936.31
														],
														[
															5632091.11,
															5419840.69
														],
														[
															5633442.42,
															5426750.37
														],
														[
															5634795.98,
															5433664.91
														],
														[
															5636156.65,
															5440584.22
														],
														[
															5637517.33,
															5447508.75
														],
														[
															5638873.59,
															5454438.63
														],
														[
															5640224.07,
															5461373.71
														],
														[
															5641587.45,
															5468313.42
														],
														[
															5642953.02,
															5475258.3
														],
														[
															5644318.6,
															5482208.45
														],
														[
															5644897.6,
															5485156.91
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "58651D94713B47C899B0C832B2A2FDAC",
												title: "S1A_IW_GRDH_1SDV_20170523T025047_1",
												description: "",
												Copyright: "",
												Owner: "alt_proc",
												MetaProperties: {
													polar: {
														Type: "String",
														Value: "DV"
													},
													esa_product_id: {
														Type: "String",
														Value: "7ad920ee-61c3-42a9-bb26-cd960bd0ac33"
													},
													acqtime: {
														Type: "Time",
														Value: 10247
													},
													acqdate: {
														Type: "Date",
														Value: 1495497600
													},
													sceneid: {
														Type: "String",
														Value: "S1A_IW_GRDH_1SDV_20170523T025047_1"
													},
													platform: {
														Type: "String",
														Value: "Sentinel-1A"
													},
													mode: {
														Type: "String",
														Value: "IW"
													},
													acqdatetime: {
														Type: "DateTime",
														Value: 1495507847
													},
													resolution: {
														Type: "Number",
														Value: 10
													}
												},
												LayerVersion: 0,
												LayerID: "58651D94713B47C899B0C832B2A2FDAC",
												type: "Raster",
												date: "23.05.2017",
												Legend: null,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3395,
												RasterPath: "Y:\\Kosmosnimki\\Operative\\s1\\tile\\2017\\2017-05-23\\S1A_IW_GRDH_1SDV_20170523T025047_1.tiles",
												visible: false,
												MapStructureID: "EEB34C3EE7434FFBA9DCB384BCB8101E",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															5690670.17,
															5720700.32
														],
														[
															5683662.8,
															5722065.49
														],
														[
															5676655.46,
															5723430.87
														],
														[
															5669642.63,
															5724782.3
														],
														[
															5662629.8,
															5726133.93
														],
														[
															5655614.69,
															5727479.6
														],
														[
															5648596.46,
															5728817.44
														],
														[
															5641578.23,
															5730155.49
														],
														[
															5634555.35,
															5731481.39
														],
														[
															5627531.76,
															5732805.62
														],
														[
															5620506.6,
															5734125.74
														],
														[
															5613477.7,
															5735436.11
														],
														[
															5606448.81,
															5736746.67
														],
														[
															5599416.1,
															5738046.92
														],
														[
															5592381.95,
															5739343.6
														],
														[
															5585346.91,
															5740638.03
														],
														[
															5578307.55,
															5741920.78
														],
														[
															5571268.19,
															5743203.72
														],
														[
															5564225.78,
															5744478.19
														],
														[
															5557181.26,
															5745747.17
														],
														[
															5550136.58,
															5747015.79
														],
														[
															5543086.95,
															5748270.78
														],
														[
															5536037.33,
															5749525.95
														],
														[
															5528985.32,
															5750774.52
														],
														[
															5521930.64,
															5752015.66
														],
														[
															5514875.96,
															5753256.98
														],
														[
															5507816.77,
															5754485.43
														],
														[
															5500757.08,
															5755712.69
														],
														[
															5493695.74,
															5756935.22
														],
														[
															5486631.1,
															5758148.4
														],
														[
															5479566.46,
															5759361.74
														],
														[
															5472498.09,
															5760564.06
														],
														[
															5465428.55,
															5761763.28
														],
														[
															5458358.03,
															5762959.65
														],
														[
															5451283.63,
															5764144.72
														],
														[
															5444209.24,
															5765329.95
														],
														[
															5437131.77,
															5766506.02
														],
														[
															5430052.58,
															5767677.07
														],
														[
															5422973.09,
															5768847.16
														],
														[
															5415889.16,
															5770003.99
														],
														[
															5408805.23,
															5771160.97
														],
														[
															5401718.9,
															5772310.68
														],
														[
															5394630.27,
															5773453.41
														],
														[
															5387541.65,
															5774596.29
														],
														[
															5380448.7,
															5775725.56
														],
														[
															5373355.44,
															5776854.16
														],
														[
															5366260.44,
															5777977.39
														],
														[
															5359162.6,
															5779091.68
														],
														[
															5352064.75,
															5780206.12
														],
														[
															5344963.28,
															5781308.84
														],
														[
															5337860.91,
															5782408.95
														],
														[
															5334181.88,
															5782978.86
														],
														[
															5333061.92,
															5775797.28
														],
														[
															5331941.96,
															5768621.51
														],
														[
															5330821.99,
															5761451.54
														],
														[
															5329696.88,
															5754287.17
														],
														[
															5328574.28,
															5747128.14
														],
														[
															5327457.1,
															5739975.05
														],
														[
															5326339.92,
															5732827.7
														],
														[
															5325222.74,
															5725686.09
														],
														[
															5324103.05,
															5718549.63
														],
														[
															5322988.62,
															5711419.06
														],
														[
															5321874.19,
															5704294.18
														],
														[
															5320759.75,
															5697174.97
														],
														[
															5319647.94,
															5690061.07
														],
														[
															5318536.21,
															5682952.81
														],
														[
															5317424.49,
															5675850.18
														],
														[
															5316308.27,
															5668753.01
														],
														[
															5315197.68,
															5661661.31
														],
														[
															5314087.83,
															5654575.22
														],
														[
															5312977.98,
															5647494.71
														],
														[
															5311863.85,
															5640419.61
														],
														[
															5310745.74,
															5633350.4
														],
														[
															5309633.35,
															5626286.97
														],
														[
															5308520.97,
															5619229.07
														],
														[
															5307408.59,
															5612176.68
														],
														[
															5306287.26,
															5605130.22
														],
														[
															5305170.64,
															5598089.49
														],
														[
															5304054.03,
															5591054.22
														],
														[
															5302937.41,
															5584024.43
														],
														[
															5301847.79,
															5576995.02
														],
														[
															5300765.99,
															5569970.83
														],
														[
															5299684.18,
															5562952.09
														],
														[
															5298602.37,
															5555938.76
														],
														[
															5297504.37,
															5548933.23
														],
														[
															5297038.69,
															5545978.56
														],
														[
															5303955.65,
															5544900.23
														],
														[
															5310872.61,
															5543822.03
														],
														[
															5317786.75,
															5542734.92
														],
														[
															5324699.5,
															5541643.48
														],
														[
															5331611.87,
															5540550.78
														],
														[
															5338520.36,
															5539446.12
														],
														[
															5345428.85,
															5538341.59
														],
														[
															5352335.03,
															5537229.96
														],
														[
															5359239.22,
															5536112.24
														],
														[
															5366143.4,
															5534994.65
														],
														[
															5373043.41,
															5533864.14
														],
														[
															5379943.25,
															5532733.39
														],
														[
															5386841.3,
															5531597.33
														],
														[
															5393736.73,
															5530453.44
														],
														[
															5400632.17,
															5529309.69
														],
														[
															5407523.93,
															5528154.83
														],
														[
															5414414.92,
															5526997.97
														],
														[
															5421304.71,
															5525837.6
														],
														[
															5428191.21,
															5524667.65
														],
														[
															5435077.71,
															5523497.86
														],
														[
															5441961,
															5522318.76
														],
														[
															5448842.96,
															5521135.91
														],
														[
															5455724.33,
															5519951.32
														],
														[
															5462601.71,
															5518755.45
														],
														[
															5469479.1,
															5517559.73
														],
														[
															5476353.82,
															5516356.5
														],
														[
															5483226.57,
															5515147.78
														],
														[
															5490099.34,
															5513939.09
														],
														[
															5496967.42,
															5512717.4
														],
														[
															5503835.51,
															5511495.88
														],
														[
															5510701.5,
															5510268.62
														],
														[
															5517564.87,
															5509034.16
														],
														[
															5524428.24,
															5507799.86
														],
														[
															5531287.46,
															5506554.1
														],
														[
															5538146.07,
															5505306.9
														],
														[
															5545003.24,
															5504055.74
														],
														[
															5551857.05,
															5502795.65
														],
														[
															5558710.86,
															5501535.74
														],
														[
															5565561.05,
															5500266.16
														],
														[
															5572410.01,
															5498993.4
														],
														[
															5579258.14,
															5497718.44
														],
														[
															5586102.22,
															5496432.87
														],
														[
															5592946.29,
															5495147.47
														],
														[
															5599787.33,
															5493854.17
														],
														[
															5606626.47,
															5492555.99
														],
														[
															5613465.39,
															5491257.35
														],
														[
															5620299.55,
															5489946.41
														],
														[
															5627133.72,
															5488635.65
														],
														[
															5633965.51,
															5487318.76
														],
														[
															5640794.65,
															5485995.28
														],
														[
															5644332.15,
															5485309.79
														],
														[
															5645701.03,
															5492267.22
														],
														[
															5647055.21,
															5499232.31
														],
														[
															5648407.97,
															5506203.65
														],
														[
															5649760.73,
															5513180.31
														],
														[
															5651106.25,
															5520162.54
														],
														[
															5652470.29,
															5527145.86
														],
														[
															5653857.36,
															5534131.84
														],
														[
															5655247.45,
															5541123.07
														],
														[
															5656637.53,
															5548119.67
														],
														[
															5658026.38,
															5555122.15
														],
														[
															5659414.56,
															5562130.3
														],
														[
															5660802.73,
															5569143.85
														],
														[
															5662183.88,
															5576163.1
														],
														[
															5663558.54,
															5583188.28
														],
														[
															5664943.44,
															5590218.66
														],
														[
															5666331.74,
															5597254.37
														],
														[
															5667720.03,
															5604295.57
														],
														[
															5669102.53,
															5611342.28
														],
														[
															5670491.72,
															5618394.13
														],
														[
															5671884.49,
															5625451.35
														],
														[
															5673277.26,
															5632514.1
														],
														[
															5674673.29,
															5639582.02
														],
														[
															5676071.39,
															5646655.26
														],
														[
															5677469.48,
															5653734.07
														],
														[
															5678860.83,
															5660818.72
														],
														[
															5680256.6,
															5667908.55
														],
														[
															5681660.08,
															5675003.53
														],
														[
															5683063.56,
															5682104.12
														],
														[
															5684460.41,
															5689210.6
														],
														[
															5685853.01,
															5696322.66
														],
														[
															5687257.74,
															5703439.71
														],
														[
															5688666.67,
															5710562.26
														],
														[
															5690075.6,
															5717690.49
														],
														[
															5690670.17,
															5720700.32
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "A68DDE20AAA842BEA11C5911D7EC2E72",
												title: "S1A_IW_GRDH_1SDV_20170524T143744_1",
												description: "",
												Copyright: "",
												Owner: "alt_proc",
												MetaProperties: {
													polar: {
														Type: "String",
														Value: "DV"
													},
													esa_product_id: {
														Type: "String",
														Value: "b2bed021-121e-4c56-aa47-be4a3ccf5add"
													},
													acqtime: {
														Type: "Time",
														Value: 52664
													},
													acqdate: {
														Type: "Date",
														Value: 1495584000
													},
													sceneid: {
														Type: "String",
														Value: "S1A_IW_GRDH_1SDV_20170524T143744_1"
													},
													platform: {
														Type: "String",
														Value: "Sentinel-1A"
													},
													mode: {
														Type: "String",
														Value: "IW"
													},
													acqdatetime: {
														Type: "DateTime",
														Value: 1495636664
													},
													resolution: {
														Type: "Number",
														Value: 10
													}
												},
												LayerVersion: 0,
												LayerID: "A68DDE20AAA842BEA11C5911D7EC2E72",
												type: "Raster",
												date: "24.05.2017",
												Legend: null,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3395,
												RasterPath: "Y:\\Kosmosnimki\\Operative\\s1\\tile\\2017\\2017-05-24\\S1A_IW_GRDH_1SDV_20170524T143744_1.tiles",
												visible: false,
												MapStructureID: "7ED0D1902E7E40D39377F0C1091BE8CF",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															5322022.07,
															5205653.66
														],
														[
															5328650.15,
															5206933.87
														],
														[
															5335279.7,
															5208210.49
														],
														[
															5341912.4,
															5209478.99
														],
														[
															5348545.09,
															5210747.65
														],
														[
															5355181.12,
															5212007.82
														],
														[
															5361818.39,
															5213264.74
														],
														[
															5368456.24,
															5214520.33
														],
														[
															5375098.04,
															5215765.48
														],
														[
															5381739.85,
															5217010.8
														],
														[
															5388384.03,
															5218249.86
														],
														[
															5395030.33,
															5219483.38
														],
														[
															5401676.63,
															5220717.06
														],
														[
															5408327.16,
															5221939.54
														],
														[
															5414977.92,
															5223161.39
														],
														[
															5421630.19,
															5224379.25
														],
														[
															5428285.37,
															5225589.25
														],
														[
															5434940.55,
															5226799.41
														],
														[
															5441599.06,
															5228000.61
														],
														[
															5448258.62,
															5229198.89
														],
														[
															5454918.86,
															5230395.44
														],
														[
															5461582.76,
															5231581.82
														],
														[
															5468246.67,
															5232768.34
														],
														[
															5474913.04,
															5233948.17
														],
														[
															5481581.25,
															5235122.76
														],
														[
															5488249.47,
															5236297.5
														],
														[
															5494921.8,
															5237460.56
														],
														[
															5501594.28,
															5238623.34
														],
														[
															5508268.36,
															5239781.7
														],
														[
															5514945.06,
															5240932.5
														],
														[
															5521621.77,
															5242083.43
														],
														[
															5528301.78,
															5243224.95
														],
														[
															5534982.68,
															5244363.88
														],
														[
															5541664.33,
															5245500.68
														],
														[
															5548349.38,
															5246627.57
														],
														[
															5555034.42,
															5247754.6
														],
														[
															5561721.91,
															5248874.49
														],
														[
															5568411.06,
															5249989.46
														],
														[
															5575100.21,
															5251104.56
														],
														[
															5581793.46,
															5252207.49
														],
														[
															5588486.68,
															5253310.5
														],
														[
															5595181.51,
															5254408.67
														],
														[
															5601878.76,
															5255499.58
														],
														[
															5608576.01,
															5256590.61
														],
														[
															5615276.52,
															5257671.75
														],
														[
															5621977.76,
															5258750.64
														],
														[
															5628679.83,
															5259827.01
														],
														[
															5635385.01,
															5260893.74
														],
														[
															5642090.19,
															5261960.6
														],
														[
															5648797.83,
															5263019.91
														],
														[
															5655506.89,
															5264074.66
														],
														[
															5658874.84,
															5264604.18
														],
														[
															5657744.7,
															5271379.74
														],
														[
															5656614.55,
															5278160.18
														],
														[
															5655484.41,
															5284945.52
														],
														[
															5654345.83,
															5291736.11
														],
														[
															5653232.84,
															5298535.76
														],
														[
															5652129.33,
															5305340.04
														],
														[
															5651025.82,
															5312149.26
														],
														[
															5649922.31,
															5318963.45
														],
														[
															5648824.6,
															5325785.26
														],
														[
															5647736.3,
															5332611.74
														],
														[
															5646648.01,
															5339443.23
														],
														[
															5645559.71,
															5346279.72
														],
														[
															5644477.71,
															5353122.23
														],
														[
															5643396.09,
															5359969.83
														],
														[
															5642314.47,
															5366822.48
														],
														[
															5641224.94,
															5373680.56
														],
														[
															5640140.22,
															5380543.07
														],
														[
															5639056.31,
															5387410.59
														],
														[
															5637972.41,
															5394283.2
														],
														[
															5636880.79,
															5401161.27
														],
														[
															5635784.47,
															5408044.22
														],
														[
															5634698.26,
															5414931.79
														],
														[
															5633612.05,
															5421824.51
														],
														[
															5632525.83,
															5428722.38
														],
														[
															5631428.41,
															5435625.46
														],
														[
															5630339.85,
															5442533.28
														],
														[
															5629251.29,
															5449446.28
														],
														[
															5628162.74,
															5456364.48
														],
														[
															5627072.13,
															5463287.6
														],
														[
															5625981.19,
															5470215.89
														],
														[
															5624890.25,
															5477149.41
														],
														[
															5623792.18,
															5484088.49
														],
														[
															5622694.63,
															5491032.52
														],
														[
															5622167.98,
															5494381.29
														],
														[
															5615289.95,
															5493307.52
														],
														[
															5608411.92,
															5492233.87
														],
														[
															5601537.6,
															5491148.62
														],
														[
															5594663.74,
															5490061.89
														],
														[
															5587791.11,
															5488971.47
														],
														[
															5580921.48,
															5487871.59
														],
														[
															5574051.86,
															5486771.85
														],
														[
															5567185.19,
															5485663
														],
														[
															5560319.85,
															5484550.15
														],
														[
															5553454.98,
															5483436.14
														],
														[
															5546593.97,
															5482310.2
														],
														[
															5539732.97,
															5481184.4
														],
														[
															5532874.18,
															5480052.04
														],
														[
															5526017.55,
															5478913.18
														],
														[
															5519160.92,
															5477774.46
														],
														[
															5512308.3,
															5476623.8
														],
														[
															5505456.09,
															5475472.05
														],
														[
															5498605.34,
															5474316.28
														],
														[
															5491757.6,
															5473151.53
														],
														[
															5484909.86,
															5471986.93
														],
														[
															5478065.37,
															5470812.93
														],
														[
															5471222.14,
															5469635.36
														],
														[
															5464379.52,
															5468456.27
														],
														[
															5457540.85,
															5467265.76
														],
														[
															5450702.18,
															5466075.4
														],
														[
															5443865.99,
															5464878.16
														],
														[
															5437031.92,
															5463674.88
														],
														[
															5430197.86,
															5462471.77
														],
														[
															5423368.2,
															5461256.43
														],
														[
															5416538.79,
															5460040.43
														],
														[
															5409711.01,
															5458820.06
														],
														[
															5402886.28,
															5457591.2
														],
														[
															5396061.56,
															5456362.51
														],
														[
															5389240.39,
															5455124.12
														],
														[
															5382420.4,
															5453882.61
														],
														[
															5375601.21,
															5452639.21
														],
														[
															5368786,
															5451384.9
														],
														[
															5361970.79,
															5450130.76
														],
														[
															5355158.29,
															5448869.42
														],
														[
															5348347.9,
															5447602.52
														],
														[
															5341537.51,
															5446335.79
														],
														[
															5334731.89,
															5445056.56
														],
														[
															5327926.37,
															5443777.1
														],
														[
															5321122.68,
															5442492.93
														],
														[
															5314322.07,
															5441200.76
														],
														[
															5307521.46,
															5439908.77
														],
														[
															5300724.74,
															5438606.8
														],
														[
															5293929.08,
															5437302.14
														],
														[
															5287134.4,
															5435995.25
														],
														[
															5280343.73,
															5434677.94
														],
														[
															5276934.82,
															5434016.73
														],
														[
															5278291.73,
															5427114.6
														],
														[
															5279635.31,
															5420216.99
														],
														[
															5280981.39,
															5413324.54
														],
														[
															5282336.91,
															5406437.53
														],
														[
															5283692.43,
															5399555.65
														],
														[
															5285044.81,
															5392678.52
														],
														[
															5286395.55,
															5385806.3
														],
														[
															5287745.77,
															5378939.15
														],
														[
															5289083.66,
															5372076.68
														],
														[
															5290426.72,
															5365219.18
														],
														[
															5291772.74,
															5358366.67
														],
														[
															5293118.51,
															5351519.21
														],
														[
															5294451.8,
															5344676.38
														],
														[
															5295782.29,
															5337838.23
														],
														[
															5297113.71,
															5331004.95
														],
														[
															5298455.08,
															5324176.99
														],
														[
															5299796.44,
															5317354.01
														],
														[
															5301127.61,
															5310535.46
														],
														[
															5302454.27,
															5303721.58
														],
														[
															5303791.04,
															5296912.96
														],
														[
															5305127.8,
															5290109.29
														],
														[
															5306467.38,
															5283311.28
														],
														[
															5307809.02,
															5276518.75
														],
														[
															5309150.67,
															5269731.12
														],
														[
															5310480.38,
															5262948.01
														],
														[
															5311824.23,
															5256171.67
														],
														[
															5313179.78,
															5249401.7
														],
														[
															5314535.33,
															5242636.59
														],
														[
															5315879.22,
															5235875.94
														],
														[
															5317234.54,
															5229122.59
														],
														[
															5318601.98,
															5222376.3
														],
														[
															5319979.94,
															5215635.18
														],
														[
															5321357.9,
															5208898.86
														],
														[
															5322022.07,
															5205653.66
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "0194DBE7B8F64BE0A3E6108DD8490965",
												title: "S1A_IW_GRDH_1SDV_20170524T143809_1",
												description: "",
												Copyright: "",
												Owner: "alt_proc",
												MetaProperties: {
													polar: {
														Type: "String",
														Value: "DV"
													},
													esa_product_id: {
														Type: "String",
														Value: "faf14fbf-393c-4aca-92b6-fb6d898458d2"
													},
													acqtime: {
														Type: "Time",
														Value: 52689
													},
													acqdate: {
														Type: "Date",
														Value: 1495584000
													},
													sceneid: {
														Type: "String",
														Value: "S1A_IW_GRDH_1SDV_20170524T143809_1"
													},
													platform: {
														Type: "String",
														Value: "Sentinel-1A"
													},
													mode: {
														Type: "String",
														Value: "IW"
													},
													acqdatetime: {
														Type: "DateTime",
														Value: 1495636689
													},
													resolution: {
														Type: "Number",
														Value: 10
													}
												},
												LayerVersion: 0,
												LayerID: "0194DBE7B8F64BE0A3E6108DD8490965",
												type: "Raster",
												date: "24.05.2017",
												Legend: null,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3395,
												RasterPath: "Y:\\Kosmosnimki\\Operative\\s1\\tile\\2017\\2017-05-24\\S1A_IW_GRDH_1SDV_20170524T143809_1.tiles",
												visible: false,
												MapStructureID: "476184F83B994B4C9C2AF620CA67497C",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															5278081.06,
															5434282.16
														],
														[
															5284871.74,
															5435599.41
														],
														[
															5291664.85,
															5436910.57
														],
														[
															5298460.52,
															5438215.17
														],
														[
															5305256.19,
															5439519.96
														],
														[
															5312056.31,
															5440813.36
														],
														[
															5318856.93,
															5442105.47
														],
														[
															5325659.03,
															5443393.93
														],
														[
															5332464.56,
															5444673.34
														],
														[
															5339270.09,
															5445952.93
														],
														[
															5346079.03,
															5447223.53
														],
														[
															5352889.43,
															5448490.38
														],
														[
															5359700.39,
															5449756.02
														],
														[
															5366515.61,
															5451010.11
														],
														[
															5373330.83,
															5452264.37
														],
														[
															5380148.5,
															5453512.08
														],
														[
															5386968.5,
															5454753.54
														],
														[
															5393788.5,
															5455995.18
														],
														[
															5400612.9,
															5457224.9
														],
														[
															5407437.63,
															5458453.7
														],
														[
															5414263.89,
															5459678.4
														],
														[
															5421093.32,
															5460894.35
														],
														[
															5427922.75,
															5462110.46
														],
														[
															5434755.62,
															5463317.1
														],
														[
															5441589.7,
															5464520.32
														],
														[
															5448424.4,
															5465721.91
														],
														[
															5455263.08,
															5466912.22
														],
														[
															5462101.76,
															5468102.69
														],
														[
															5468942.93,
															5469286.13
														],
														[
															5475786.17,
															5470463.65
														],
														[
															5482629.41,
															5471641.33
														],
														[
															5489476.98,
															5472806.57
														],
														[
															5496324.73,
															5473971.27
														],
														[
															5503174.06,
															5475131.42
														],
														[
															5510026.28,
															5476283.12
														],
														[
															5516878.5,
															5477434.97
														],
														[
															5523734.14,
															5478576.84
														],
														[
															5530590.78,
															5479715.66
														],
														[
															5537448.17,
															5480852.4
														],
														[
															5544309.19,
															5481978.16
														],
														[
															5551170.21,
															5483104.06
														],
														[
															5558033.71,
															5484222.46
														],
														[
															5564899.06,
															5485335.28
														],
														[
															5571764.41,
															5486448.23
														],
														[
															5578634.01,
															5487548.23
														],
														[
															5585503.64,
															5488648.06
														],
														[
															5592374.9,
															5489742.89
														],
														[
															5599248.78,
															5490829.59
														],
														[
															5606122.65,
															5491916.42
														],
														[
															5612999.88,
															5492992.79
														],
														[
															5619877.94,
															5494066.48
														],
														[
															5622794.24,
															5494521.76
														],
														[
															5621700.18,
															5501473.21
														],
														[
															5620606.12,
															5508429.96
														],
														[
															5619512.06,
															5515392
														],
														[
															5618410.42,
															5522359.67
														],
														[
															5617305.79,
															5529332.35
														],
														[
															5616209.26,
															5536310.02
														],
														[
															5615112.73,
															5543293.04
														],
														[
															5614016.2,
															5550281.42
														],
														[
															5612917.27,
															5557274.8
														],
														[
															5611818.24,
															5564273.54
														],
														[
															5610719.22,
															5571277.69
														],
														[
															5609613.02,
															5578287.54
														],
														[
															5608502.76,
															5585302.49
														],
														[
															5607401.2,
															5592322.5
														],
														[
															5606299.64,
															5599347.97
														],
														[
															5605198.07,
															5606378.89
														],
														[
															5604094.13,
															5613414.97
														],
														[
															5602989.99,
															5620456.51
														],
														[
															5601885.85,
															5627503.54
														],
														[
															5600774.97,
															5634556.35
														],
														[
															5599658.89,
															5641614.46
														],
														[
															5598552.13,
															5648677.71
														],
														[
															5597445.37,
															5655746.52
														],
														[
															5596338.61,
															5662820.89
														],
														[
															5595221.24,
															5669900.78
														],
														[
															5594111.83,
															5676985.91
														],
														[
															5593002.42,
															5684076.64
														],
														[
															5591893,
															5691172.99
														],
														[
															5590772.92,
															5698274.93
														],
														[
															5589660.82,
															5705382.16
														],
														[
															5588548.72,
															5712495.05
														],
														[
															5587436.61,
															5719613.61
														],
														[
															5586322.91,
															5726737.62
														],
														[
															5585780.99,
															5730187.76
														],
														[
															5578720.63,
															5729092.77
														],
														[
															5571660.28,
															5727997.92
														],
														[
															5564603.46,
															5726891.82
														],
														[
															5557547.6,
															5725782.75
														],
														[
															5550492.68,
															5724671.03
														],
														[
															5543441.39,
															5723547.75
														],
														[
															5536390.09,
															5722424.61
														],
														[
															5529341.55,
															5721292.96
														],
														[
															5522294.87,
															5720155.64
														],
														[
															5515248.27,
															5719018.4
														],
														[
															5508206.25,
															5717866.93
														],
														[
															5501164.24,
															5716715.6
														],
														[
															5494124.16,
															5715558.51
														],
														[
															5487086.86,
															5714393.06
														],
														[
															5480049.56,
															5713227.76
														],
														[
															5473016.22,
															5712050.87
														],
														[
															5465983.7,
															5710871.48
														],
														[
															5458952.24,
															5709689.06
														],
														[
															5451924.54,
															5708495.62
														],
														[
															5444896.84,
															5707302.33
														],
														[
															5437872.26,
															5706100.2
														],
														[
															5430849.44,
															5704892.89
														],
														[
															5423826.81,
															5703685.25
														],
														[
															5416808.91,
															5702463.94
														],
														[
															5409791.01,
															5701242.8
														],
														[
															5402775.3,
															5700015.54
														],
														[
															5395762.38,
															5698780.44
														],
														[
															5388749.46,
															5697545.51
														],
														[
															5381740.85,
															5696298.67
														],
														[
															5374732.96,
															5695049.81
														],
														[
															5367726.35,
															5693797.54
														],
														[
															5360723.54,
															5692534.78
														],
														[
															5353720.73,
															5691272.2
														],
														[
															5346721.32,
															5690000.45
														],
														[
															5339723.64,
															5688724.01
														],
														[
															5332726.34,
															5687446.84
														],
														[
															5325733.84,
															5686156.58
														],
														[
															5318741.34,
															5684866.49
														],
														[
															5311751.29,
															5683569.94
														],
														[
															5304764.02,
															5682266.06
														],
														[
															5297776.75,
															5680962.37
														],
														[
															5290794.15,
															5679646.48
														],
														[
															5283812.16,
															5678329.04
														],
														[
															5276831.67,
															5677007.8
														],
														[
															5269855,
															5675676.63
														],
														[
															5262878.33,
															5674345.65
														],
														[
															5255905.39,
															5673005.18
														],
														[
															5248934.1,
															5671660.51
														],
														[
															5241963.37,
															5670314.73
														],
														[
															5234997.51,
															5668956.41
														],
														[
															5232043.98,
															5668380.54
														],
														[
															5233442.22,
															5661303.35
														],
														[
															5234827.19,
															5654231.02
														],
														[
															5236211.12,
															5647164.11
														],
														[
															5237608.94,
															5640103.32
														],
														[
															5239006.76,
															5633048.05
														],
														[
															5240401.1,
															5625997.9
														],
														[
															5241793.6,
															5618953.05
														],
														[
															5243181.92,
															5611913.53
														],
														[
															5244560.56,
															5604879.11
														],
														[
															5245944.66,
															5597850.11
														],
														[
															5247331.9,
															5590826.53
														],
														[
															5248715.29,
															5583808.26
														],
														[
															5250088.8,
															5576795.04
														],
														[
															5251459.21,
															5569786.88
														],
														[
															5252827.66,
															5562783.91
														],
														[
															5254208.99,
															5555786.81
														],
														[
															5255591.05,
															5548795.13
														],
														[
															5256962.06,
															5541808.18
														],
														[
															5258325.51,
															5534826.15
														],
														[
															5259701.46,
															5527849.92
														],
														[
															5261078.39,
															5520879.07
														],
														[
															5262452.43,
															5513913.19
														],
														[
															5263824.32,
															5506952.35
														],
														[
															5265193.25,
															5499996.71
														],
														[
															5266551.77,
															5493045.98
														],
														[
															5267914.94,
															5486100.46
														],
														[
															5269281.84,
															5479160.14
														],
														[
															5270646.07,
															5472224.98
														],
														[
															5271999.73,
															5465294.68
														],
														[
															5273350.82,
															5458369.32
														],
														[
															5274699.67,
															5451448.91
														],
														[
															5276059.89,
															5444534.09
														],
														[
															5277421.87,
															5437624.53
														],
														[
															5278081.06,
															5434282.16
														]
													]
												]
											}
										},
										type: "layer"
									},
									{
										content: {
											properties: {
												Access: "edit",
												name: "2B6B48E3100943EA9DE8ED651DCF8CCD",
												title: "S1B_IW_GRDH_1SDV_20170615T154253_1",
												description: "",
												Copyright: "",
												Owner: "alt_proc",
												MetaProperties: {
													polar: {
														Type: "String",
														Value: "DV"
													},
													esa_product_id: {
														Type: "String",
														Value: "8b9025eb-e171-471f-b219-0191957dcb21"
													},
													acqtime: {
														Type: "Time",
														Value: 56573
													},
													acqdate: {
														Type: "Date",
														Value: 1497484800
													},
													sceneid: {
														Type: "String",
														Value: "S1B_IW_GRDH_1SDV_20170615T154253_1"
													},
													platform: {
														Type: "String",
														Value: "Sentinel-1B"
													},
													mode: {
														Type: "String",
														Value: "IW"
													},
													acqdatetime: {
														Type: "DateTime",
														Value: 1497541373
													},
													resolution: {
														Type: "Number",
														Value: 10
													}
												},
												LayerVersion: 0,
												LayerID: "2B6B48E3100943EA9DE8ED651DCF8CCD",
												type: "Raster",
												date: "15.06.2017",
												Legend: null,
												MinZoom: 0,
												MaxZoom: 13,
												RasterSRS: 3395,
												RasterPath: "Y:\\Kosmosnimki\\Operative\\s1\\tile\\2017\\2017-06-15\\S1B_IW_GRDH_1SDV_20170615T154253_1.tiles",
												visible: false,
												MapStructureID: "ABC87D2E069944EEB3D012A3A1273AC2",
												styles: [
													{
														MinZoom: 0,
														MaxZoom: 21
													}
												]
											},
											geometry: {
												type: "POLYGON",
												coordinates: [
													[
														[
															3490477.55,
															5200987.02
														],
														[
															3497102.97,
															5202265.91
														],
														[
															3503728.78,
															5203544.06
														],
														[
															3510358.76,
															5204811.34
														],
														[
															3516988.74,
															5206078.78
														],
														[
															3523621.02,
															5207340.4
														],
														[
															3530255.53,
															5208596.2
														],
														[
															3536890.04,
															5209852.17
														],
														[
															3543528.7,
															5211097.21
														],
														[
															3550167.71,
															5212341.51
														],
														[
															3556808.29,
															5213581.78
														],
														[
															3563451.75,
															5214814.38
														],
														[
															3570095.21,
															5216047.14
														],
														[
															3576742.13,
															5217270.76
														],
														[
															3583390.01,
															5218491.79
														],
														[
															3590038.75,
															5219710.62
														],
														[
															3596691.01,
															5220919.9
														],
														[
															3603343.27,
															5222129.34
														],
														[
															3609998.27,
															5223331.44
														],
														[
															3616654.87,
															5224529.1
														],
														[
															3623311.67,
															5225726.38
														],
														[
															3629972.58,
															5226912.23
														],
														[
															3636633.49,
															5228098.24
														],
														[
															3643296.44,
															5229278.72
														],
														[
															3649961.62,
															5230452.9
														],
														[
															3656626.8,
															5231627.22
														],
														[
															3663295.75,
															5232790.86
														],
														[
															3669965.15,
															5233953.32
														],
														[
															3676635.93,
															5235112.09
														],
														[
															3683309.53,
															5236262.68
														],
														[
															3689983.13,
															5237413.4
														],
														[
															3696659.8,
															5238555.25
														],
														[
															3703337.55,
															5239694.07
														],
														[
															3710016.02,
															5240831.03
														],
														[
															3716697.88,
															5241957.92
														],
														[
															3723379.75,
															5243084.94
														],
														[
															3730064.01,
															5244204.91
														],
														[
															3736749.94,
															5245319.98
														],
														[
															3743435.98,
															5246435.03
														],
														[
															3750125.95,
															5247538.11
														],
														[
															3756815.92,
															5248641.33
														],
														[
															3763507.64,
															5249739.33
														],
														[
															3770201.6,
															5250830.54
														],
														[
															3776895.57,
															5251921.88
														],
														[
															3783592.99,
															5253002.78
														],
														[
															3790290.91,
															5254082.09
														],
														[
															3796989.95,
															5255158.02
														],
														[
															3803691.78,
															5256225.28
														],
														[
															3810393.62,
															5257292.65
														],
														[
															3817098.24,
															5258351.47
														],
														[
															3823803.93,
															5259406.83
														],
														[
															3827076.31,
															5259921.89
														],
														[
															3825999.98,
															5266710.08
														],
														[
															3824923.65,
															5273503.18
														],
														[
															3823847.32,
															5280301.19
														],
														[
															3822764.27,
															5287104.45
														],
														[
															3821678.66,
															5293912.29
														],
														[
															3820600.16,
															5300724.73
														],
														[
															3819521.65,
															5307542.13
														],
														[
															3818443.14,
															5314364.5
														],
														[
															3817355.47,
															5321191.85
														],
														[
															3816274.74,
															5328023.86
														],
														[
															3815194.02,
															5334860.88
														],
														[
															3814113.29,
															5341702.91
														],
														[
															3813030.42,
															5348549.65
														],
														[
															3811947.45,
															5355401.41
														],
														[
															3810864.47,
															5362258.22
														],
														[
															3809775.21,
															5369120.38
														],
														[
															3808689.31,
															5375987
														],
														[
															3807604.06,
															5382858.65
														],
														[
															3806518.81,
															5389735.39
														],
														[
															3805427.42,
															5396617.52
														],
														[
															3804331.82,
															5403504.49
														],
														[
															3803244.26,
															5410396.21
														],
														[
															3802156.7,
															5417293.06
														],
														[
															3801069.14,
															5424195.08
														],
														[
															3799972.17,
															5431102.26
														],
														[
															3798882.26,
															5438014.27
														],
														[
															3797792.35,
															5444931.48
														],
														[
															3796702.44,
															5451853.88
														],
														[
															3795603.05,
															5458781.51
														],
														[
															3794510.75,
															5465714.01
														],
														[
															3793418.45,
															5472651.75
														],
														[
															3792326.15,
															5479594.75
														],
														[
															3791232.38,
															5486542.69
														],
														[
															3790739.86,
															5489657.16
														],
														[
															3783865.57,
															5488583.06
														],
														[
															3776991.28,
															5487509.08
														],
														[
															3770120.31,
															5486424.59
														],
														[
															3763250.15,
															5485337.64
														],
														[
															3756381.01,
															5484247.79
														],
														[
															3749515.06,
															5483147.81
														],
														[
															3742649.11,
															5482047.96
														],
														[
															3735785.93,
															5480939.6
														],
														[
															3728924.23,
															5479826.76
														],
														[
															3722062.91,
															5478713.05
														],
														[
															3715205.5,
															5477587.23
														],
														[
															3708348.1,
															5476461.56
														],
														[
															3701492.86,
															5475329.41
														],
														[
															3694639.8,
															5474190.79
														],
														[
															3687786.73,
															5473052.31
														],
														[
															3680937.78,
															5471901.78
														],
														[
															3674089.1,
															5470750.38
														],
														[
															3667241.99,
															5469594.55
														],
														[
															3660397.74,
															5468430.27
														],
														[
															3653553.5,
															5467266.14
														],
														[
															3646712.71,
															5466091.99
														],
														[
															3639872.94,
															5464915
														],
														[
															3633034.08,
															5463735.59
														],
														[
															3626198.83,
															5462545.76
														],
														[
															3619363.58,
															5461356.09
														],
														[
															3612531.21,
															5460158.45
														],
														[
															3605700.52,
															5458955.98
														],
														[
															3598870.04,
															5457753.09
														],
														[
															3592043.96,
															5456537.84
														],
														[
															3585217.88,
															5455322.75
														],
														[
															3578394.03,
															5454101.71
														],
														[
															3571572.6,
															5452873.88
														],
														[
															3564751.17,
															5451646.21
														],
														[
															3557933.93,
															5450407.07
														],
														[
															3551117.19,
															5449166.69
														],
														[
															3544302.01,
															5447922.36
														],
														[
															3537490.01,
															5446669.29
														],
														[
															3530678.01,
															5445416.39
														],
														[
															3523869.55,
															5444154.04
														],
														[
															3517062.34,
															5442888.49
														],
														[
															3510255.96,
															5441620.98
														],
														[
															3503453.57,
															5440342.8
														],
														[
															3496651.17,
															5439064.8
														],
														[
															3489851.64,
															5437779.36
														],
														[
															3483054.11,
															5436488.76
														],
														[
															3476256.69,
															5435198.18
														],
														[
															3469464.07,
															5433895.02
														],
														[
															3462671.44,
															5432592.04
														],
														[
															3455881,
															5431283.61
														],
														[
															3449093.33,
															5429968.1
														],
														[
															3445780.94,
															5429326.19
														],
														[
															3447138.91,
															5422420.04
														],
														[
															3448490.72,
															5415518.63
														],
														[
															3449845.67,
															5408622.37
														],
														[
															3451200.62,
															5401731.25
														],
														[
															3452546.83,
															5394844.97
														],
														[
															3453885.83,
															5387963.32
														],
														[
															3455231.5,
															5381086.85
														],
														[
															3456581.68,
															5374215.62
														],
														[
															3457931.87,
															5367349.48
														],
														[
															3459279.01,
															5360488.04
														],
														[
															3460624.49,
															5353631.48
														],
														[
															3461969.97,
															5346779.96
														],
														[
															3463307.28,
															5339933.23
														],
														[
															3464645.16,
															5333091.27
														],
														[
															3465986,
															5326254.25
														],
														[
															3467326.84,
															5319422.24
														],
														[
															3468659.78,
															5312594.99
														],
														[
															3469992.97,
															5305772.45
														],
														[
															3471329.23,
															5298954.81
														],
														[
															3472665.49,
															5292142.14
														],
														[
															3473994.12,
															5285334.18
														],
														[
															3475315.32,
															5278530.71
														],
														[
															3476641.9,
															5271732.15
														],
														[
															3477973.63,
															5264938.66
														],
														[
															3479305.36,
															5258150.07
														],
														[
															3480634.49,
															5251366.06
														],
														[
															3481961.75,
															5244586.71
														],
														[
															3483289.01,
															5237812.23
														],
														[
															3484609.17,
															5231042.41
														],
														[
															3485921.8,
															5224276.99
														],
														[
															3487239.21,
															5217516.36
														],
														[
															3488562.06,
															5210760.69
														],
														[
															3489884.91,
															5204009.84
														],
														[
															3490477.55,
															5200987.02
														]
													]
												]
											}
										},
										type: "layer"
									}
								],
								properties: {
									visible: false,
									title: "SelectedImages",
									GroupID: "XP5hVFnhLGKIztOv",
									expanded: false,
									list: false,
									ShowCheckbox: true
								}
							},
							type: "group"
						}
					],
					properties: {
						visible: false,
						title: "VesselDetect",
						GroupID: "O20voTbJf5ituSW9",
						expanded: false,
						list: false,
						ShowCheckbox: true
					}
				},
				type: "group"
			},
			{
				content: {
					children: [
						{
							content: {
								properties: {
									Access: "edit",
									name: "AF15283A583C42FB89CFCCFCC7C58607",
									title: "QL_Sentinel-2 копия Иркутск",
									description: "MSI L1C granules, квиклуки и метаданные по РФ с 27.06.2015",
									Copyright: "",
									Owner: "michigan",
									MetaProperties: {
										timeColumnName1: {
											Type: "String",
											Value: "acqtime"
										},
										mediaDescField: {
											Type: "String",
											Value: "_mediadescript_"
										}
									},
									LayerVersion: 557,
									LayerID: "AF15283A583C42FB89CFCCFCC7C58607",
									type: "Vector",
									date: "01.09.2017",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 1,
									MaxZoom: 1,
									identityField: "gmx_id",
									Quicklook: "{\"template\":\"http://sender.kosmosnimki.ru/operative/alt_proc.ashx?platform=s2&product=ql&date=[acqdate]&file=[sceneid].jpg\"}",
									NameObject: "",
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"MGRS",
										"acqdate",
										"acqtime",
										"area",
										"clouds",
										"esa_product_id",
										"x1",
										"y1",
										"x2",
										"y2",
										"x3",
										"y3",
										"x4",
										"y4",
										"best",
										"z",
										"_mediadescript_"
									],
									attrTypes: [
										"string",
										"string",
										"date",
										"time",
										"integer",
										"integer",
										"string",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"string",
										"integer",
										"string"
									],
									visible: false,
									MapStructureID: "8F0F0AB7D389455EA61475EE2FD51174",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"best\" = '1'",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><strong>sceneid:</strong> [sceneid]<br /> <strong>MGRS:</strong> [MGRS]<br /> <strong>acqdate:</strong> [acqdate]<br /> <strong>acqtime:</strong> [acqtime]<br /> <strong>area:</strong> [area]<br /> <strong>clouds:</strong> [clouds]<br /> <strong>esa_product_id:</strong> [esa_product_id]<br /> <strong>x1:</strong> [x1]<br /> <strong>y1:</strong> [y1]<br /> <strong>x2:</strong> [x2]<br /> <strong>y2:</strong> [y2]<br /> <strong>x3:</strong> [x3]<br /> <strong>y3:</strong> [y3]<br /> <strong>x4:</strong> [x4]<br /> <strong>y4:</strong> [y4]<br /> <strong>best:</strong> [best]<br /> <br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 2,
													opacity: 100
												},
												fill: {
													color: 16711680,
													opacity: 0
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												10519177.54,
												6525496.29
											],
											[
												10519177.54,
												9588415.2
											],
											[
												13436851.32,
												9588415.2
											],
											[
												13436851.32,
												6525496.29
											],
											[
												10519177.54,
												6525496.29
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "E80A80C0D4DB4CFA8514FA16A8EFBA0E",
									title: "QL_Sentinel-2_Иркутск",
									description: "вьюха",
									Copyright: "",
									Owner: "michigan",
									MetaProperties: {
										parentLayer: {
											Type: "String",
											Value: "AF15283A583C42FB89CFCCFCC7C58607"
										}
									},
									LayerVersion: 8,
									LayerID: "E80A80C0D4DB4CFA8514FA16A8EFBA0E",
									type: "Vector",
									date: "01.09.2017",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 1,
									MaxZoom: 1,
									identityField: "gmx_id",
									NameObject: "",
									GeometryType: "polygon",
									attributes: [
									],
									attrTypes: [
									],
									visible: false,
									MapStructureID: "D163A5D4A20841B2A8778BDDA82070FA",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											Filter: "\"best\" = 1",
											BalloonEnable: true,
											DisableBalloonOnClick: false,
											DisableBalloonOnMouseMove: true,
											Balloon: "<p><br /> [SUMMARY]</p>",
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16516604,
													opacity: 0
												}
											}
										}
									]
								},
								geometry: null
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "6028FB527E40481D91357841400DCA35",
									title: "LC81370172016255LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81370172016255LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1473552000
										},
										acqtime: {
											Type: "Time",
											Value: 15241
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "6028FB527E40481D91357841400DCA35",
									type: "Raster",
									date: "13.09.2016",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\16\\09\\LC81370172016255LGN00_432.tiles",
									visible: false,
									MapStructureID: "DE077A9490914BDCB27874230151530F",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												11425614.12,
												8605231.93
											],
											[
												11455584.26,
												8701069.26
											],
											[
												11486331.95,
												8798629.92
											],
											[
												11517906.26,
												8897708.77
											],
											[
												11550348.68,
												8998413.73
											],
											[
												11648678.96,
												8965666.91
											],
											[
												11746170.06,
												8931802.89
											],
											[
												11842732.27,
												8896795.99
											],
											[
												11938343.98,
												8860751.08
											],
											[
												11900950.78,
												8763082.62
											],
											[
												11864628.15,
												8667008.53
											],
											[
												11829258.92,
												8572305.78
											],
											[
												11794801.49,
												8479123.31
											],
											[
												11703671.27,
												8512199.28
											],
											[
												11611789.56,
												8544214.09
											],
											[
												11519058.25,
												8575132.87
											],
											[
												11425614.12,
												8605231.93
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "324B196958E046899F9BC20A90C23273",
									title: "LC81380222017168LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81380222017168LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1497657600
										},
										acqtime: {
											Type: "Time",
											Value: 15701
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "324B196958E046899F9BC20A90C23273",
									type: "Raster",
									date: "20.06.2017",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\17\\06\\LC81380222017168LGN00_432.tiles",
									visible: false,
									MapStructureID: "02C37B6A36C54E55BA081B5ACAB8D0C6",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												10835912.59,
												7150139.39
											],
											[
												10913648.5,
												7128586.42
											],
											[
												10991011.2,
												7106379.39
											],
											[
												11067937.16,
												7083532.35
											],
											[
												11144411.14,
												7059859.39
											],
											[
												11169016.63,
												7137521.79
											],
											[
												11194152.64,
												7217405.91
											],
											[
												11219819.96,
												7298223.21
											],
											[
												11246046.81,
												7380204.28
											],
											[
												11166294.03,
												7405384.41
											],
											[
												11086076.91,
												7429821.1
											],
											[
												11005358.34,
												7453549.92
											],
											[
												10924154.06,
												7476446.61
											],
											[
												10901384.34,
												7393376.57
											],
											[
												10879136.95,
												7311223.14
											],
											[
												10857273.99,
												7230683.6
											],
											[
												10835912.59,
												7150139.39
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "DD1FC2C2BC8840B1ADE227227DFAAE3F",
									title: "LC81390232017239LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81390232017239LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1503792000
										},
										acqtime: {
											Type: "Time",
											Value: 16118
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "DD1FC2C2BC8840B1ADE227227DFAAE3F",
									type: "Raster",
									date: "28.08.2017",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\17\\08\\LC81390232017239LGN00_432.tiles",
									visible: false,
									MapStructureID: "4A20B3E5D0FB441CA145145EB87A29C2",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												10594018.89,
												6887596.83
											],
											[
												10614422.59,
												6965026.94
											],
											[
												10635246.51,
												7043370.76
											],
											[
												10656395.2,
												7122898.15
											],
											[
												10677989.64,
												7203592.71
											],
											[
												10756399.5,
												7181985.63
											],
											[
												10834436.21,
												7159705.38
											],
											[
												10911985.37,
												7136713.75
											],
											[
												10989134.22,
												7113079.55
											],
											[
												10964502.97,
												7034750.45
											],
											[
												10940360.97,
												6955615.81
											],
											[
												10916664.29,
												6878757.55
											],
											[
												10893462.82,
												6802167.12
											],
											[
												10819144.37,
												6824539.16
											],
											[
												10744481.65,
												6846179.2
											],
											[
												10669435.03,
												6867219.25
											],
											[
												10594018.89,
												6887596.83
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "97076461A38140A29D74398084AB0FA9",
									title: "LC81400212017086LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81400212017086LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1490572800
										},
										acqtime: {
											Type: "Time",
											Value: 16412
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "97076461A38140A29D74398084AB0FA9",
									type: "Raster",
									date: "28.03.2017",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\17\\03\\LC81400212017086LGN00_432.tiles",
									visible: false,
									MapStructureID: "35A19277F31241EEAE462CB39B14AFEB",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												10560867.11,
												7420684.07
											],
											[
												10583645.56,
												7503475.98
											],
											[
												10606877.97,
												7587480.9
											],
											[
												10630597.25,
												7672513.05
											],
											[
												10654809.08,
												7758927.66
											],
											[
												10738906.09,
												7734625.04
											],
											[
												10822527.31,
												7709469.93
											],
											[
												10905600.6,
												7683426.33
											],
											[
												10988106.19,
												7656733.72
											],
											[
												10960250.92,
												7571987.09
											],
											[
												10932991.25,
												7488488.37
											],
											[
												10906302.51,
												7406049.55
											],
											[
												10880205.09,
												7325063.75
											],
											[
												10801090.67,
												7350148.76
											],
											[
												10721487.89,
												7374389.59
											],
											[
												10641410.11,
												7397872.23
											],
											[
												10560867.11,
												7420684.07
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "CC417C88724C4B28B4EEFAA70967B1BD",
									title: "LC81370232017241LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81370232017241LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1503964800
										},
										acqtime: {
											Type: "Time",
											Value: 15377
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "CC417C88724C4B28B4EEFAA70967B1BD",
									type: "Raster",
									date: "30.08.2017",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\17\\08\\LC81370232017241LGN00_432.tiles",
									visible: false,
									MapStructureID: "2FFF154D5FC245ECBAD076F4BFB09518",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												10938326.26,
												6887581.36
											],
											[
												11013622.01,
												6867175.82
											],
											[
												11088533.25,
												6846218.99
											],
											[
												11163047.25,
												6824577.12
											],
											[
												11237199.02,
												6802263.38
											],
											[
												11260499.6,
												6877815.61
											],
											[
												11284293.48,
												6955193.13
											],
											[
												11308569.78,
												7033339.28
											],
											[
												11333377,
												7113029.67
											],
											[
												11256171,
												7136637.12
											],
											[
												11178551.7,
												7159659.75
											],
											[
												11100478.43,
												7181981.76
											],
											[
												11021965.73,
												7203586.93
											],
											[
												11000430.17,
												7123261.32
											],
											[
												10979325.21,
												7043379.73
											],
											[
												10958626.93,
												6965278.63
											],
											[
												10938326.26,
												6887581.36
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "17075E809636489FB3BE91D531C5FBBF",
									title: "LC81350222017163LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81350222017163LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1497225600
										},
										acqtime: {
											Type: "Time",
											Value: 14587
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "17075E809636489FB3BE91D531C5FBBF",
									type: "Raster",
									date: "13.06.2017",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\17\\06\\LC81350222017163LGN00_432.tiles",
									visible: false,
									MapStructureID: "25803A81D7434367896B9742637DE960",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												11351426.81,
												7150334.89
											],
											[
												11372953.84,
												7230144.86
											],
											[
												11394894.95,
												7311081.12
											],
											[
												11417269.38,
												7393172.01
											],
											[
												11440146.99,
												7476554.75
											],
											[
												11521287.82,
												7453607.39
											],
											[
												11602002.41,
												7429878.12
											],
											[
												11682221.6,
												7405436.29
											],
											[
												11761931.58,
												7380300.21
											],
											[
												11735796.28,
												7298651.86
											],
											[
												11710201.15,
												7218217.64
											],
											[
												11685122.19,
												7138460.16
											],
											[
												11660539.38,
												7059870.13
											],
											[
												11583915.37,
												7083587.89
											],
											[
												11506847.68,
												7106472.37
											],
											[
												11429347.91,
												7128709.5
											],
											[
												11351426.81,
												7150334.89
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "A7931CADA96A47DBB1907AAA3BC43653",
									title: "LC81340242017172LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81340242017172LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1498003200
										},
										acqtime: {
											Type: "Time",
											Value: 14267
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "A7931CADA96A47DBB1907AAA3BC43653",
									type: "Raster",
									date: "22.06.2017",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\17\\06\\LC81340242017172LGN00_432.tiles",
									visible: false,
									MapStructureID: "E662932F6829421381933831317FF307",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												11388517.8,
												6632901.45
											],
											[
												11407843.84,
												6707716.04
											],
											[
												11427492.75,
												6783860.16
											],
											[
												11447479.94,
												6861416.18
											],
											[
												11467849.51,
												6939478.25
											],
											[
												11543892.41,
												6919016.42
											],
											[
												11619549.96,
												6897884.96
											],
											[
												11694808.78,
												6876147.16
											],
											[
												11769657.41,
												6853816.98
											],
											[
												11746336.02,
												6776630.8
											],
											[
												11723458.9,
												6701159.5
											],
											[
												11701000.04,
												6626215.64
											],
											[
												11678992.93,
												6551837.2
											],
											[
												11606868.42,
												6573041.11
											],
											[
												11534430.9,
												6593564.73
											],
											[
												11461643.23,
												6613538
											],
											[
												11388517.8,
												6632901.45
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "466B93B9ED9B48A5A102FD8EAC66E431",
									title: "LC81340222017172LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81340222017172LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1498003200
										},
										acqtime: {
											Type: "Time",
											Value: 14219
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "466B93B9ED9B48A5A102FD8EAC66E431",
									type: "Raster",
									date: "22.06.2017",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\17\\06\\LC81340222017172LGN00_432.tiles",
									visible: false,
									MapStructureID: "02EBB6431C084C3B81D0E15C9FF9B074",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												11523849.43,
												7150379.84
											],
											[
												11545327.82,
												7230151.49
											],
											[
												11567287.26,
												7311044.42
											],
											[
												11589645.65,
												7392979.91
											],
											[
												11612522.01,
												7476515.99
											],
											[
												11693666.03,
												7453616.25
											],
											[
												11774376.2,
												7429885.69
											],
											[
												11854584.11,
												7405448.05
											],
											[
												11934276.13,
												7380321.69
											],
											[
												11908103.74,
												7298662.5
											],
											[
												11882484.65,
												7217954.88
											],
											[
												11857392.39,
												7137974.59
											],
											[
												11832879.16,
												7059864.2
											],
											[
												11756263.75,
												7083535.5
											],
											[
												11679244.63,
												7106480.09
											],
											[
												11601735.96,
												7128681.85
											],
											[
												11523849.43,
												7150379.84
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "7CABF96AA0444D42AE0EAD4742F34FBB",
									title: "LC81340232017172LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81340232017172LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1498003200
										},
										acqtime: {
											Type: "Time",
											Value: 14243
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "7CABF96AA0444D42AE0EAD4742F34FBB",
									type: "Raster",
									date: "22.06.2017",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\17\\06\\LC81340232017172LGN00_432.tiles",
									visible: false,
									MapStructureID: "54B9428F3D46402DB7EEFBCDD58D8A25",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												11454322.68,
												6887787.25
											],
											[
												11474695.11,
												6965290.28
											],
											[
												11495450.38,
												7043750.33
											],
											[
												11516607.2,
												7123088.76
											],
											[
												11538174.37,
												7203736.14
											],
											[
												11616698.8,
												7182110.28
											],
											[
												11694790.52,
												7159762.97
											],
											[
												11772434.89,
												7136710.35
											],
											[
												11849619.97,
												7113070.23
											],
											[
												11824995.89,
												7034327.8
											],
											[
												11800853.6,
												6955974.62
											],
											[
												11777187.31,
												6878793.47
											],
											[
												11754019.49,
												6802122.77
											],
											[
												11679654.4,
												6824509.8
											],
											[
												11604932.74,
												6846217.87
											],
											[
												11529819.73,
												6867232.95
											],
											[
												11454322.68,
												6887787.25
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "667BAD2B2E834CC28A630AF37FCF7499",
									title: "LC81280192017242LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81280192017242LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1504051200
										},
										acqtime: {
											Type: "Time",
											Value: 11944
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "667BAD2B2E834CC28A630AF37FCF7499",
									type: "Raster",
									date: "30.08.2017",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\17\\08\\LC81280192017242LGN00_432.tiles",
									visible: false,
									MapStructureID: "10DBC46277A0429D9CDD0AE914DC9892",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												12789993.49,
												7991804.89
											],
											[
												12815833.85,
												8080439.24
											],
											[
												12842289.18,
												8169928.85
											],
											[
												12869368.44,
												8261056.99
											],
											[
												12897100.51,
												8354169.14
											],
											[
												12987679.75,
												8326204.95
											],
											[
												13077625.8,
												8297244.5
											],
											[
												13166856.52,
												8267256.91
											],
											[
												13255355.21,
												8236448.37
											],
											[
												13223344.29,
												8146039.01
											],
											[
												13192103.39,
												8056510.2
											],
											[
												13161613.96,
												7968467.5
											],
											[
												13131908.21,
												7882767.59
											],
											[
												13047360.9,
												7911370.7
											],
											[
												12962180.64,
												7939009.84
											],
											[
												12876386.93,
												7965772.51
											],
											[
												12789993.49,
												7991804.89
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "DAE797141CBE490292BFE61BBBBE1AA2",
									title: "LC81270202016217LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81270202016217LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1470268800
										},
										acqtime: {
											Type: "Time",
											Value: 11593
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "DAE797141CBE490292BFE61BBBBE1AA2",
									type: "Raster",
									date: "05.08.2016",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\16\\08\\LC81270202016217LGN00_432.tiles",
									visible: false,
									MapStructureID: "17DB0C99068B454AB16A630C7FBD0F92",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												12880650.52,
												7701153.77
											],
											[
												12904839.91,
												7787102.08
											],
											[
												12929633.39,
												7874064.86
											],
											[
												12955005.46,
												7961500.21
											],
											[
												12980963.94,
												8051416.34
											],
											[
												13068158.8,
												8025303.9
											],
											[
												13154737.99,
												7998334.62
											],
											[
												13240682.43,
												7970476.14
											],
											[
												13326030.12,
												7941751.51
											],
											[
												13296121.2,
												7854519.88
											],
											[
												13266902.48,
												7768153.01
											],
											[
												13238356.56,
												7682960.56
											],
											[
												13210511.9,
												7599075.41
											],
											[
												13128839.5,
												7625806.52
											],
											[
												13046653.94,
												7651643.85
											],
											[
												12963919.84,
												7676729.92
											],
											[
												12880650.52,
												7701153.77
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "5412F0BCF51A4F4CB8184C674C662974",
									title: "LC81290202016263LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81290202016263LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1474243200
										},
										acqtime: {
											Type: "Time",
											Value: 12347
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "5412F0BCF51A4F4CB8184C674C662974",
									type: "Raster",
									date: "19.09.2016",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\16\\09\\LC81290202016263LGN00_432.tiles",
									visible: false,
									MapStructureID: "9DC42BE93CC4480AAC19C97FBAFF2C60",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												12534993.55,
												7701097.89
											],
											[
												12559283.48,
												7786647.17
											],
											[
												12584129.78,
												7873661.63
											],
											[
												12609501.38,
												7962234.89
											],
											[
												12635483.15,
												8051326.04
											],
											[
												12722622.37,
												8025280.89
											],
											[
												12809162.42,
												7998311.34
											],
											[
												12895082.56,
												7970498.59
											],
											[
												12980422.78,
												7941810.96
											],
											[
												12950597.93,
												7854198.66
											],
											[
												12921496.01,
												7767969.24
											],
											[
												12892969.19,
												7683413.85
											],
											[
												12865124.03,
												7599034.14
											],
											[
												12783373.82,
												7625806.91
											],
											[
												12701129.61,
												7651675.63
											],
											[
												12618297.7,
												7676723.24
											],
											[
												12534993.55,
												7701097.89
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "B9D4941EBA5D4BC99426573F0091EFE2",
									title: "LC81300182016254LGN00_432",
									description: "",
									Copyright: "",
									Owner: "slipatov",
									MetaProperties: {
										sceneid: {
											Type: "String",
											Value: "LC81300182016254LGN00"
										},
										acqdate: {
											Type: "Date",
											Value: 1473465600
										},
										acqtime: {
											Type: "Time",
											Value: 12669
										},
										bands: {
											Type: "String",
											Value: "4-3-2"
										},
										sensor: {
											Type: "String",
											Value: "OLI_TIRS"
										},
										platform: {
											Type: "String",
											Value: "LANDSAT8"
										},
										product: {
											Type: "String",
											Value: "fusion"
										}
									},
									LayerVersion: 0,
									LayerID: "B9D4941EBA5D4BC99426573F0091EFE2",
									type: "Raster",
									date: "10.09.2016",
									Legend: null,
									MinZoom: 0,
									MaxZoom: 13,
									RasterSRS: 3395,
									RasterPath: "Z:\\kosmosnimki\\alt_proc\\ls8\\RGB\\432\\16\\09\\LC81300182016254LGN00_432.tiles",
									visible: false,
									MapStructureID: "92C6677285DA45E9818643D26120ABF8",
									styles: [
										{
											MinZoom: 0,
											MaxZoom: 21
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												12534207.45,
												8292319.81
											],
											[
												12562044.46,
												8384285.24
											],
											[
												12590576.8,
												8478164.05
											],
											[
												12619773.49,
												8573088.84
											],
											[
												12649743.42,
												8669960.39
											],
											[
												12744079.73,
												8639793.93
											],
											[
												12837699.39,
												8608535.12
											],
											[
												12930455.03,
												8576214.06
											],
											[
												13022447.27,
												8542928.83
											],
											[
												12987878.03,
												8449034.88
											],
											[
												12954227.1,
												8356760.97
											],
											[
												12921338.01,
												8265592.39
											],
											[
												12889296.2,
												8175390.01
											],
											[
												12801530.14,
												8206106.19
											],
											[
												12713121.02,
												8235775.4
											],
											[
												12623969.91,
												8264481.41
											],
											[
												12534207.45,
												8292319.81
											]
										]
									]
								}
							},
							type: "layer"
						},
						{
							content: {
								properties: {
									Access: "edit",
									name: "EEB0AA5748A746D58E8C83E3532BC73C",
									title: "QL_Sentinel-2 копия_Иркутск_cld_4-9",
									description: "MSI L1C granules, квиклуки и метаданные по РФ с 27.06.2015",
									Copyright: "",
									Owner: "michigan",
									MetaProperties: {
										timeColumnName1: {
											Type: "String",
											Value: "acqtime"
										}
									},
									LayerVersion: 8,
									LayerID: "EEB0AA5748A746D58E8C83E3532BC73C",
									type: "Vector",
									date: "02.09.2017",
									Legend: null,
									EncodeSource: null,
									VtMinZoom: 1,
									VtMaxZoom: 1,
									MinZoom: 1,
									MaxZoom: 1,
									identityField: "gmx_id",
									Quicklook: "{\"template\":\"http://sender.kosmosnimki.ru/operative/alt_proc.ashx?platform=s2&product=ql&date=[acqdate]&file=[sceneid].jpg\",\"minZoom\":4,\"X1\":\"x1\",\"Y1\":\"y1\",\"X2\":\"x2\",\"Y2\":\"y2\",\"X3\":\"x3\",\"Y3\":\"y3\",\"X4\":\"x4\",\"Y4\":\"y4\"}",
									NameObject: "",
									GeometryType: "polygon",
									attributes: [
										"sceneid",
										"MGRS",
										"acqdate",
										"acqtime",
										"area",
										"clouds",
										"esa_product_id",
										"x1",
										"y1",
										"x2",
										"y2",
										"x3",
										"y3",
										"x4",
										"y4"
									],
									attrTypes: [
										"string",
										"string",
										"date",
										"time",
										"integer",
										"integer",
										"string",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float",
										"float"
									],
									visible: false,
									MapStructureID: "251D9A93625D457D9DED563F68B4719F",
									isGeneralized: true,
									styles: [
										{
											MinZoom: 1,
											MaxZoom: 21,
											RenderStyle: {
												outline: {
													color: 255,
													thickness: 1
												},
												fill: {
													color: 16777215,
													opacity: 20
												}
											}
										}
									]
								},
								geometry: {
									type: "POLYGON",
									coordinates: [
										[
											[
												10519177.54,
												6521029.87
											],
											[
												10519177.54,
												9588336
											],
											[
												13436851.32,
												9588336
											],
											[
												13436851.32,
												6521029.87
											],
											[
												10519177.54,
												6521029.87
											]
										]
									]
								}
							},
							type: "layer"
						}
					],
					properties: {
						visible: false,
						title: "Иркутск",
						GroupID: "8Tq6kDaDdiXTPahQ",
						expanded: false,
						list: false,
						ShowCheckbox: true
					}
				},
				type: "group"
			}
		],
		properties: {
			MapID: "ATTBP",
			name: "ATTBP",
			title: "OPERATIVE",
			Copyright: "",
			ViewUrl: "False",
			list: false,
			UseKosmosnimkiAPI: true,
			UseOpenStreetMap: true,
			WMSAccess: true,
			DefaultLat: 59.434524,
			DefaultLong: 88.59375,
			DefaultZoom: 3,
			CanDownloadVectors: true,
			CanDownloadRasters: true,
			CanSearchVector: true,
			MiniMapZoomDelta: -4,
			ShowPropertiesBalloons: true,
			LayersDir: "@LayerManager\\Maps\\ADPS-STREAM",
			Access: "edit",
			OnLoad: "function( map )\n{\nwindow.gmxAPIdebugLevel = 11;\n\n\nvar myLayer = map.layers['533FCC7439DA4A2EB97A2BE77887A462'];\ngmxAPI._cmdProxy('setAPIProperties', { 'obj': myLayer , 'attr':{'rasterView': 'onClick'} });\n\n\nvar pointKhab = map.addObject();\n\npointKhab.setGeometry({\n\n\t\t\t\"type\":\"POINT\",\n\n\t\t\t\"coordinates\":[135.06042,48.479639]\n\n\t\t});\n\n\t\tpointKhab.setStyle({\n\n\t\t\tmarker: {\n\n\t\t\t\timage: \"http://images.kosmosnimki.ru/icons/alisa_15x21.png\",\n\n\t\t\t\tdx: -2,\n\n\t\t\t\tdy: -20\n\n\t\t\t},\n\n\t\t\tlabel: {\n\n\t\t\t\tsize: 12,\n\n\t\t\t\tcolor: 0xff00ff,\n\n\t\t\t\thaloColor: 0xffffff\n\n\t\t\t}\n\n\t\t});\n\n\t\tpointKhab.setLabel(\"Хабаровск\");\n\n\n\nvar circleKhab = map.addObject(); // создает объект на карте\ncircleKhab.setCircle(135.06042, 48.479639, 2600000); // определяет созданный объект в виде круга с заданными координатами центра и радиусом\ncircleKhab.setStyle({outline: {color: 0xff0000, thickness: 3, opacity: 25}});\n\n\n\nvar circleMsk = map.addObject(); // создает объект на карте\ncircleMsk.setCircle(37.441640,55.634230, 2600000); // определяет созданный объект в виде круга с заданными координатами центра и радиусом\ncircleMsk.setStyle({outline: {color: 0xff0000, thickness: 3, opacity: 25}});\n\nvar pointMsk = map.addObject();\n\npointMsk.setGeometry({\n\n\t\t\t\"type\":\"POINT\",\n\n\t\t\t\"coordinates\":[37.441640, 55.634230]\n\n\t\t});\n\n\t\tpointMsk.setStyle({\n\n\t\t\tmarker: {\n\n\t\t\t\timage: \"http://images.kosmosnimki.ru/icons/alisa_15x21.png\",\n\n\t\t\t\tdx: -2,\n\n\t\t\t\tdy: -20\n\n\t\t\t},\n\n\t\t\tlabel: {\n\n\t\t\t\tsize: 12,\n\n\t\t\t\tcolor: 0xff00ff,\n\n\t\t\t\thaloColor: 0xffffff\n\n\t\t\t}\n\n\t\t});\n\n\t\tpointMsk.setLabel(\"Москва\");\n\n\n\nvar circleIrk = map.addObject(); // создает объект на карте\ncircleIrk.setCircle(104.29670,52.289747, 2600000); // определяет созданный объект в виде круга с заданными координатами центра и радиусом\ncircleIrk.setStyle({outline: {color: 0xff0000, thickness: 3, opacity: 25}});\n\nvar pointIrk = map.addObject();\n\npointIrk.setGeometry({\n\n\t\t\t\"type\":\"POINT\",\n\n\t\t\t\"coordinates\":[104.29670,52.289747]\n\n\t\t});\n\n\t\tpointIrk.setStyle({\n\n\t\t\tmarker: {\n\n\t\t\t\timage: \"http://images.kosmosnimki.ru/icons/alisa_15x21.png\",\n\n\t\t\t\tdx: -2,\n\n\t\t\t\tdy: -20\n\n\t\t\t},\n\n\t\t\tlabel: {\n\n\t\t\t\tsize: 12,\n\n\t\t\t\tcolor: 0xff00ff,\n\n\t\t\t\thaloColor: 0xffffff\n\n\t\t\t}\n\n\t\t});\n\n\t\tpointIrk.setLabel(\"Иркутск\");\n\n\n/*var circleVld = map.addObject(); // создает объект на карте\ncircleVld.setCircle(132.00073,43.292926, 2600000); // определяет созданный объект в виде круга с заданными координатами центра и радиусом\ncircleVld.setStyle({outline: {color: 0xff0000, thickness: 3, opacity: 25}});\n\n\n\nvar pointVld = map.addObject();\n\npointVld.setGeometry({\n\n\t\t\t\"type\":\"POINT\",\n\n\t\t\t\"coordinates\":[132.00159,43.281607]\n\n\t\t});\n\n\t\tpointVld.setStyle({\n\n\t\t\tmarker: {\n\n\t\t\t\timage: \"http://images.kosmosnimki.ru/icons/alisa_15x21.png\",\n\n\t\t\t\tdx: -2,\n\n\t\t\t\tdy: -20\n\n\t\t\t},\n\n\t\t\tlabel: {\n\n\t\t\t\tsize: 12,\n\n\t\t\t\tcolor: 0xff00ff,\n\n\t\t\t\thaloColor: 0xffffff\n\n\t\t\t}\n\n\t\t});\n\n\t\tpointVld.setLabel(\"Владивосток\");\n*/\n\n\nvar circleMag = map.addObject(); // создает объект на карте\ncircleMag.setCircle(150.81400, 59.554506, 2600000); // определяет созданный объект в виде круга с заданными координатами центра и радиусом\ncircleMag.setStyle({outline: {color: 0xff0000, thickness: 3, opacity: 25}});\n\n\n\nvar pointMag = map.addObject();\npointMag.setGeometry({\n\n\t\t\t\"type\":\"POINT\",\n\n\t\t\t\"coordinates\":[150.81400, 59.554506]\n\n\t\t});\n\n\t\tpointMag.setStyle({\n\n\t\t\tmarker: {\n\n\t\t\t\timage: \"http://images.kosmosnimki.ru/icons/alisa_15x21.png\",\n\n\t\t\t\tdx: -2,\n\n\t\t\t\tdy: -20\n\n\t\t\t},\n\n\t\t\tlabel: {\n\n\t\t\t\tsize: 12,\n\n\t\t\t\tcolor: 0xff00ff,\n\n\t\t\t\thaloColor: 0xffffff\n\n\t\t\t}\n\n\t\t});\n\n\t\tpointMag.setLabel(\"Магадан\");\n\nvar interval = setInterval(function()\n            {\n                if (typeof _queryMapLayers !== 'undefined' && _queryMapLayers.buildedTree)\n                {\n                    clearInterval(interval);\n                    var table = $(_queryMapLayers.workCanvas).children(\"table\")[0],\n                        div = _div();\n\n                    var link = makeLinkButton(\"Отчет по ADPS-MSK\");\n\t\t\tlink.style.margin = '5px';\n\t\t\tlink.onclick = function()\n\t\t\t{\n\t\t\t\twindow.open('http://192.168.5.164/report', '_blank')\n\t\t\t}\n                    var link2 = makeLinkButton(\"Отчет по ADPS-IRK\");\n\t\t\tlink2.style.margin = '5px';\n\t\t\tlink2.onclick = function()\n\t\t\t{\n\t\t\t\twindow.open('http://192.168.5.230/report', '_blank')\n\t\t\t}\n\t\t\t$(table).after(_(_div(null, [['css', 'marginBottom', '5px']]), [link]));\n                        $(table).after(_(_div(null, [['css', 'marginBottom', '5px']]), [link2]));\n                    \n                    $(table).after(div);\n                    gmxCore.loadModule('CoverControl2', 'http://maps.kosmosnimki.ru/api/CoverControl2.js');\n                    gmxCore.addModulesCallback(['CoverControl2'], function(mCover)\n                    {                    \n                        var coverControl = new mCover.CoverControl2();\n                        coverControl.init(['6B94D0889DD54F78938349FD095E729B'], 'CLOUDS', \n                            ['img/weather/16/0.png','img/weather/16/1.png','img/weather/16/9.png','img/weather/16/2.png','img/weather/16/3.png'], 4);\n                            \n                        coverControl.add(div);\n\n//nsGmx.widgets.getCommonCalendar().setDateMin(  new Date((new Date(2012, 2, 1)).valueOf() - (new Date()).getTimezoneOffset()*60*1000)  );\n\n        _mapHelper.customParamsManager.addProvider({\n            name: 'cover2',\n            loadState: function(state) { coverControl.loadState(state); },\n            saveState: function() { return coverControl.saveState(); }\n        });\n                    })\n                }\n            }, 200);\n\n}",
			UserData: "{\"mapPlugins\":[\"Cadastre\",\"BufferPlugin\",\"TileGlPlugin\"],\"mapPlugins_v2\":[{\"name\":\"Cadastre\",\"params\":{\"notHideDrawing\":true}},{\"name\":\"BufferPlugin\",\"params\":{}},{\"name\":\"TileGlPlugin\",\"params\":{\"ndviIDS\":[\"EF055D2AB2D04FE58C515AA4FDC6AEE8, 93BA58418E0B4B958D9DAF4D8B3E1878, 02BA2ACF5B26491681EBAD888771FC55\"]}}],\"mapPlugins_v3\":{\"plugins\":[\"Cadastre\",\"BufferPlugin\",\"TileGlPlugin\"],\"params\":{\"Timeline Vectors\":{},\"Cadastre\":{\"notHideDrawing\":true},\"AISSearch\":{},\"BufferPlugin\":{},\"TileGlPlugin\":{\"ndviIDS\":[\"EF055D2AB2D04FE58C515AA4FDC6AEE8, 93BA58418E0B4B958D9DAF4D8B3E1878, 02BA2ACF5B26491681EBAD888771FC55\"]},\"Style Editor\":{}}},\"mapplet_v2\":\"function () {\\n    var lmap = nsGmx.leafletMap,\\n        data = [\\n\\t\\t\\t{\\n\\t\\t\\t\\tpoint: [55.634464,37.441234],\\n\\t\\t\\t\\tradiusMerc: 2500000,\\n\\t\\t\\t\\toptionsMarker: {\\n\\t\\t\\t\\t\\t// clickable: false,\\n\\t\\t\\t\\t\\ttitle: '',\\n\\t\\t\\t\\t\\tdraggable: true,\\n\\t\\t\\t\\t\\ticon: L.icon({\\n\\t\\t\\t\\t\\t\\ticonSize: [20, 20],\\n\\t\\t\\t\\t\\t\\ticonAnchor: [10, 10],\\n\\t\\t\\t\\t\\t\\ticonUrl: './img/stations/lorett.jpg'\\n\\t\\t\\t\\t\\t})\\n\\t\\t\\t\\t},\\n\\t\\t\\t\\toptions: {\\n\\t\\t\\t\\t\\tfill: false,\\n\\t\\t\\t\\t\\tcolor: '#1470bb',\\n\\t\\t\\t\\t\\tweight: 3,\\n\\t\\t\\t\\t\\topacity: 0.5\\n\\t\\t\\t\\t}\\n\\t\\t\\t},\\n\\t\\t\\t{\\n\\t\\t\\t\\tpoint: [52.280551,104.28359],\\n\\t\\t\\t\\tradiusMerc: 2500000,\\n\\t\\t\\t\\toptionsMarker: {\\n\\t\\t\\t\\t\\t// clickable: false,\\n\\t\\t\\t\\t\\ttitle: '',\\n\\t\\t\\t\\t\\tdraggable: true,\\n\\t\\t\\t\\t\\ticon: L.icon({\\n\\t\\t\\t\\t\\t\\ticonSize: [20, 20],\\n\\t\\t\\t\\t\\t\\ticonAnchor: [10, 10],\\n\\t\\t\\t\\t\\t\\ticonUrl: './img/stations/lorett.jpg'\\n\\t\\t\\t\\t\\t})\\n\\t\\t\\t\\t},\\n\\t\\t\\t\\toptions: {\\n\\t\\t\\t\\t\\tfill: false,\\n\\t\\t\\t\\t\\tcolor: '#1470bb',\\n\\t\\t\\t\\t\\tweight: 3,\\n\\t\\t\\t\\t\\topacity: 0.5\\n\\t\\t\\t\\t}\\n\\t\\t\\t},\\n\\t\\t\\t{\\n\\t\\t\\t\\tpoint: [59.556244,150.79833],\\n\\t\\t\\t\\tradiusMerc: 2500000,\\n\\t\\t\\t\\toptionsMarker: {\\n\\t\\t\\t\\t\\t// clickable: false,\\n\\t\\t\\t\\t\\ttitle: '',\\n\\t\\t\\t\\t\\tdraggable: true,\\n\\t\\t\\t\\t\\ticon: L.icon({\\n\\t\\t\\t\\t\\t\\ticonSize: [20, 20],\\n\\t\\t\\t\\t\\t\\ticonAnchor: [10, 10],\\n\\t\\t\\t\\t\\t\\ticonUrl: './img/stations/lorett.jpg'\\n\\t\\t\\t\\t\\t})\\n\\t\\t\\t\\t},\\n\\t\\t\\t\\toptions: {\\n\\t\\t\\t\\t\\tfill: false,\\n\\t\\t\\t\\t\\tcolor: '#1470bb',\\n\\t\\t\\t\\t\\tweight: 3,\\n\\t\\t\\t\\t\\topacity: 0.5\\n\\t\\t\\t\\t}\\n\\t\\t\\t},\\n\\t\\t\\t{\\n\\t\\t\\t\\tpoint: [61.033541,76.099205],\\n\\t\\t\\t\\tradiusMerc: 2500000,\\n\\t\\t\\t\\toptionsMarker: {\\n\\t\\t\\t\\t\\t// clickable: false,\\n\\t\\t\\t\\t\\ttitle: '',\\n\\t\\t\\t\\t\\tdraggable: true,\\n\\t\\t\\t\\t\\ticon: L.icon({\\n\\t\\t\\t\\t\\t\\ticonSize: [20, 20],\\n\\t\\t\\t\\t\\t\\ticonAnchor: [10, 10],\\n\\t\\t\\t\\t\\t\\ticonUrl: './img/stations/lorett.jpg'\\n\\t\\t\\t\\t\\t})\\n\\t\\t\\t\\t},\\n\\t\\t\\t\\toptions: {\\n\\t\\t\\t\\t\\tfill: false,\\n\\t\\t\\t\\t\\tcolor: '#1470bb',\\n\\t\\t\\t\\t\\tweight: 3,\\n\\t\\t\\t\\t\\topacity: 0.5\\n\\t\\t\\t\\t}\\n\\t\\t\\t}\\n\\t\\t];\\n        \\n    function start(it) {\\n\\t\\tvar polygon,\\n\\t\\t\\tlatlngs = [],\\n\\t\\t\\tsq = 0;\\n\\t\\t\\t\\n\\t\\t\\n\\t\\tvar dragMe = function(ev) {\\n\\t\\t\\tif (polygon) lmap.removeLayer(polygon);\\n\\t\\t\\t\\n\\t\\t\\tvar latlng = ev.latlng || ev;\\n\\t\\t\\tlatlngs = L.gmxUtil.getCircleLatLngs(latlng, it.radiusMerc);\\n\\t\\t\\tpolygon = L.polygon(latlngs, it.options).addTo(lmap);\\n\\t\\t}\\n        L.marker(it.point, it.optionsMarker)\\n\\t\\t\\t.on('drag', dragMe)\\n\\t\\t\\t.bindPopup(function(e) {\\n\\t\\t\\t\\tvar sq = L.gmxUtil.getArea(polygon.getLatLngs()[0]);\\n\\t\\t\\t\\treturn 'area: ' + L.gmxUtil.prettifyArea(sq) + ' ';\\n\\t\\t\\t})\\n\\t\\t\\t.addTo(lmap);\\n\\t\\tdragMe(it.point);\\n\\t}\\n\\t\\n\\tstart(data[0]);\\n\\tstart(data[1]);\\n\\tstart(data[2]);\\n\\tstart(data[3]);\\n}\"}",
			MinViewX: 0,
			MinViewY: 0,
			MaxViewX: 0,
			MaxViewY: 0,
			Owner: "LayerManager",
			Version: 447005,
			OldVersion: 447005,
			SessionMap: "15684B78394A4454A057C5375D2DD46F",
			DefaultLanguage: "rus",
			DistanceUnit: "auto",
			SquareUnit: "auto",
			MinZoom: 1,
			MaxZoom: 21,
			UserBaseLayers: null,
			BaseLayers: "[\"satellite\",\"sputnik\",\"here\",\"here_hyb\",\"OSMHybrid\",\"empty\",\"agroRelief\",\"slope\",\"aspect\",\"heatmap2018\"]",
			maxPopupContent: 1,
			isGeneralized: true,
			coordinatesFormat: 0,
			GroupID: "root",
			LayerOrder: "VectorOnTop"
		}
	};

	var Example = function Example(container) {
	  _classCallCheck(this, Example);

	  this._root = new Tree(container);

	  this._root.on('change:state', function (e) {
	    var _e$detail = e.detail,
	        title = _e$detail.title,
	        visible = _e$detail.visible,
	        geometry = _e$detail.geometry,
	        order = _e$detail.order;
	    console.log('change:', {
	      title: title,
	      visible: visible,
	      geometry: geometry,
	      order: order
	    });
	  }); // this._root.on('node:redraw', e => {
	  //     const {detail: {title, visible, geometry, order}} = e;
	  //     console.log('node:redraw:', {title, visible, geometry, order});
	  // });


	  this._root.on('node:click', function (e) {
	    var _e$detail2 = e.detail,
	        title = _e$detail2.title,
	        visible = _e$detail2.visible,
	        geometry = _e$detail2.geometry,
	        order = _e$detail2.order;
	    console.log('node:click', {
	      title: title,
	      visible: visible,
	      geometry: geometry,
	      order: order
	    });
	  });

	  this._root.update(Result);

	  console.log('temporal:', this._root.temporal);

	  var vectors = function vectors(item) {
	    return item.type === 'Vector';
	  };

	  var rasters = function rasters(item) {
	    return item.type === 'Raster';
	  };

	  var ord = function ord(item) {
	    return item.order;
	  };

	  console.log('vector:', this._root.getLayers(vectors).map(ord), ', raster:', this._root.getLayers(rasters).map(ord));
	  console.log('change order');
	  this._root.vectorFirst = true;
	  console.log('vector:', this._root.getLayers(vectors).map(ord), ', raster:', this._root.getLayers(rasters).map(ord));
	};

	return Example;

}());
//# sourceMappingURL=main.js.map
