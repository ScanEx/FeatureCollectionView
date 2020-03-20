var Example = (function () {
  'use strict';

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
    version: '3.6.4',
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

  var arrayMethodIsStrict = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails(function () {
      // eslint-disable-next-line no-useless-call,no-throw-literal
      method.call(null, argument || function () { throw 1; }, 1);
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

  var $forEach = arrayIteration.forEach;



  var STRICT_METHOD = arrayMethodIsStrict('forEach');
  var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

  // `Array.prototype.forEach` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  } : [].forEach;

  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  _export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
    forEach: arrayForEach
  });

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

  var $map = arrayIteration.map;



  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
  // FF49- issue
  var USES_TO_LENGTH$1 = arrayMethodUsesToLength('map');

  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$1 }, {
    map: function map(callbackfn /* , thisArg */) {
      return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
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

  var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule$1(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var check$1 = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global_1$1 =
    // eslint-disable-next-line no-undef
    check$1(typeof globalThis == 'object' && globalThis) ||
    check$1(typeof window == 'object' && window) ||
    check$1(typeof self == 'object' && self) ||
    check$1(typeof commonjsGlobal$1 == 'object' && commonjsGlobal$1) ||
    // eslint-disable-next-line no-new-func
    Function('return this')();

  var fails$1 = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var descriptors$1 = !fails$1(function () {
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var nativePropertyIsEnumerable$1 = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG$1 = getOwnPropertyDescriptor$2 && !nativePropertyIsEnumerable$1.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
  var f$5 = NASHORN_BUG$1 ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$2(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable$1;

  var objectPropertyIsEnumerable$1 = {
  	f: f$5
  };

  var createPropertyDescriptor$1 = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var toString$1 = {}.toString;

  var classofRaw$1 = function (it) {
    return toString$1.call(it).slice(8, -1);
  };

  var split$1 = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject$1 = fails$1(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw$1(it) == 'String' ? split$1.call(it, '') : Object(it);
  } : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible$1 = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings



  var toIndexedObject$1 = function (it) {
    return indexedObject$1(requireObjectCoercible$1(it));
  };

  var isObject$1 = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  // `ToPrimitive` abstract operation
  // https://tc39.github.io/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive$1 = function (input, PREFERRED_STRING) {
    if (!isObject$1(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$1(val = fn.call(input))) return val;
    if (typeof (fn = input.valueOf) == 'function' && !isObject$1(val = fn.call(input))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$1(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var hasOwnProperty$1 = {}.hasOwnProperty;

  var has$2 = function (it, key) {
    return hasOwnProperty$1.call(it, key);
  };

  var document$1$1 = global_1$1.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS$1 = isObject$1(document$1$1) && isObject$1(document$1$1.createElement);

  var documentCreateElement$1 = function (it) {
    return EXISTS$1 ? document$1$1.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine$1 = !descriptors$1 && !fails$1(function () {
    return Object.defineProperty(documentCreateElement$1('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var nativeGetOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
  var f$1$1 = descriptors$1 ? nativeGetOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject$1(O);
    P = toPrimitive$1(P, true);
    if (ie8DomDefine$1) try {
      return nativeGetOwnPropertyDescriptor$1(O, P);
    } catch (error) { /* empty */ }
    if (has$2(O, P)) return createPropertyDescriptor$1(!objectPropertyIsEnumerable$1.f.call(O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor$1 = {
  	f: f$1$1
  };

  var anObject$1 = function (it) {
    if (!isObject$1(it)) {
      throw TypeError(String(it) + ' is not an object');
    } return it;
  };

  var nativeDefineProperty$1 = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  var f$2$1 = descriptors$1 ? nativeDefineProperty$1 : function defineProperty(O, P, Attributes) {
    anObject$1(O);
    P = toPrimitive$1(P, true);
    anObject$1(Attributes);
    if (ie8DomDefine$1) try {
      return nativeDefineProperty$1(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty$1 = {
  	f: f$2$1
  };

  var createNonEnumerableProperty$1 = descriptors$1 ? function (object, key, value) {
    return objectDefineProperty$1.f(object, key, createPropertyDescriptor$1(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var setGlobal$1 = function (key, value) {
    try {
      createNonEnumerableProperty$1(global_1$1, key, value);
    } catch (error) {
      global_1$1[key] = value;
    } return value;
  };

  var SHARED$1 = '__core-js_shared__';
  var store$2 = global_1$1[SHARED$1] || setGlobal$1(SHARED$1, {});

  var sharedStore$1 = store$2;

  var functionToString$1 = Function.toString;

  // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
  if (typeof sharedStore$1.inspectSource != 'function') {
    sharedStore$1.inspectSource = function (it) {
      return functionToString$1.call(it);
    };
  }

  var inspectSource$1 = sharedStore$1.inspectSource;

  var WeakMap$2 = global_1$1.WeakMap;

  var nativeWeakMap$1 = typeof WeakMap$2 === 'function' && /native code/.test(inspectSource$1(WeakMap$2));

  var isPure = false;

  var shared$1 = createCommonjsModule$1(function (module) {
  (module.exports = function (key, value) {
    return sharedStore$1[key] || (sharedStore$1[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.6.4',
    mode:  'global',
    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
  });
  });

  var id$1 = 0;
  var postfix$1 = Math.random();

  var uid$1 = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id$1 + postfix$1).toString(36);
  };

  var keys$1 = shared$1('keys');

  var sharedKey$1 = function (key) {
    return keys$1[key] || (keys$1[key] = uid$1(key));
  };

  var hiddenKeys$2 = {};

  var WeakMap$1$1 = global_1$1.WeakMap;
  var set$1, get$1, has$1$1;

  var enforce$1 = function (it) {
    return has$1$1(it) ? get$1(it) : set$1(it, {});
  };

  var getterFor$1 = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject$1(it) || (state = get$1(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (nativeWeakMap$1) {
    var store$1$1 = new WeakMap$1$1();
    var wmget$1 = store$1$1.get;
    var wmhas$1 = store$1$1.has;
    var wmset$1 = store$1$1.set;
    set$1 = function (it, metadata) {
      wmset$1.call(store$1$1, it, metadata);
      return metadata;
    };
    get$1 = function (it) {
      return wmget$1.call(store$1$1, it) || {};
    };
    has$1$1 = function (it) {
      return wmhas$1.call(store$1$1, it);
    };
  } else {
    var STATE$1 = sharedKey$1('state');
    hiddenKeys$2[STATE$1] = true;
    set$1 = function (it, metadata) {
      createNonEnumerableProperty$1(it, STATE$1, metadata);
      return metadata;
    };
    get$1 = function (it) {
      return has$2(it, STATE$1) ? it[STATE$1] : {};
    };
    has$1$1 = function (it) {
      return has$2(it, STATE$1);
    };
  }

  var internalState$1 = {
    set: set$1,
    get: get$1,
    has: has$1$1,
    enforce: enforce$1,
    getterFor: getterFor$1
  };

  var redefine$1 = createCommonjsModule$1(function (module) {
  var getInternalState = internalState$1.get;
  var enforceInternalState = internalState$1.enforce;
  var TEMPLATE = String(String).split('String');

  (module.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    if (typeof value == 'function') {
      if (typeof key == 'string' && !has$2(value, 'name')) createNonEnumerableProperty$1(value, 'name', key);
      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
    if (O === global_1$1) {
      if (simple) O[key] = value;
      else setGlobal$1(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else createNonEnumerableProperty$1(O, key, value);
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return typeof this == 'function' && getInternalState(this).source || inspectSource$1(this);
  });
  });

  var path$1 = global_1$1;

  var aFunction$2 = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn$1 = function (namespace, method) {
    return arguments.length < 2 ? aFunction$2(path$1[namespace]) || aFunction$2(global_1$1[namespace])
      : path$1[namespace] && path$1[namespace][method] || global_1$1[namespace] && global_1$1[namespace][method];
  };

  var ceil$1 = Math.ceil;
  var floor$1 = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger
  var toInteger$1 = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor$1 : ceil$1)(argument);
  };

  var min$2 = Math.min;

  // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength
  var toLength$1 = function (argument) {
    return argument > 0 ? min$2(toInteger$1(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var max$1 = Math.max;
  var min$1$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex$1 = function (index, length) {
    var integer = toInteger$1(index);
    return integer < 0 ? max$1(integer + length, 0) : min$1$1(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod$2 = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject$1($this);
      var length = toLength$1(O.length);
      var index = toAbsoluteIndex$1(fromIndex, length);
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

  var arrayIncludes$1 = {
    // `Array.prototype.includes` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    includes: createMethod$2(true),
    // `Array.prototype.indexOf` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$2(false)
  };

  var indexOf$1 = arrayIncludes$1.indexOf;


  var objectKeysInternal$1 = function (object, names) {
    var O = toIndexedObject$1(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has$2(hiddenKeys$2, key) && has$2(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has$2(O, key = names[i++])) {
      ~indexOf$1(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys$1 = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var hiddenKeys$1$1 = enumBugKeys$1.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  var f$3$1 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal$1(O, hiddenKeys$1$1);
  };

  var objectGetOwnPropertyNames$1 = {
  	f: f$3$1
  };

  var f$4$1 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols$1 = {
  	f: f$4$1
  };

  // all object keys, includes non-enumerable and symbols
  var ownKeys$1 = getBuiltIn$1('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames$1.f(anObject$1(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols$1.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties$1 = function (target, source) {
    var keys = ownKeys$1(source);
    var defineProperty = objectDefineProperty$1.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor$1.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has$2(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement$1 = /#|\.prototype\./;

  var isForced$1 = function (feature, detection) {
    var value = data$1[normalize$1(feature)];
    return value == POLYFILL$1 ? true
      : value == NATIVE$1 ? false
      : typeof detection == 'function' ? fails$1(detection)
      : !!detection;
  };

  var normalize$1 = isForced$1.normalize = function (string) {
    return String(string).replace(replacement$1, '.').toLowerCase();
  };

  var data$1 = isForced$1.data = {};
  var NATIVE$1 = isForced$1.NATIVE = 'N';
  var POLYFILL$1 = isForced$1.POLYFILL = 'P';

  var isForced_1$1 = isForced$1;

  var getOwnPropertyDescriptor$1$1 = objectGetOwnPropertyDescriptor$1.f;






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
  var _export$1 = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global_1$1;
    } else if (STATIC) {
      target = global_1$1[TARGET] || setGlobal$1(TARGET, {});
    } else {
      target = (global_1$1[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor$1$1(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced_1$1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties$1(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty$1(sourceProperty, 'sham', true);
      }
      // extend global
      redefine$1(target, key, sourceProperty, options);
    }
  };

  // `ToObject` abstract operation
  // https://tc39.github.io/ecma262/#sec-toobject
  var toObject$1 = function (argument) {
    return Object(requireObjectCoercible$1(argument));
  };

  // `IsArray` abstract operation
  // https://tc39.github.io/ecma262/#sec-isarray
  var isArray$1 = Array.isArray || function isArray(arg) {
    return classofRaw$1(arg) == 'Array';
  };

  var nativeSymbol$1 = !!Object.getOwnPropertySymbols && !fails$1(function () {
    // Chrome 38 Symbol has incorrect toString conversion
    // eslint-disable-next-line no-undef
    return !String(Symbol());
  });

  var useSymbolAsUid$1 = nativeSymbol$1
    // eslint-disable-next-line no-undef
    && !Symbol.sham
    // eslint-disable-next-line no-undef
    && typeof Symbol.iterator == 'symbol';

  var WellKnownSymbolsStore$1 = shared$1('wks');
  var Symbol$1$1 = global_1$1.Symbol;
  var createWellKnownSymbol$1 = useSymbolAsUid$1 ? Symbol$1$1 : Symbol$1$1 && Symbol$1$1.withoutSetter || uid$1;

  var wellKnownSymbol$1 = function (name) {
    if (!has$2(WellKnownSymbolsStore$1, name)) {
      if (nativeSymbol$1 && has$2(Symbol$1$1, name)) WellKnownSymbolsStore$1[name] = Symbol$1$1[name];
      else WellKnownSymbolsStore$1[name] = createWellKnownSymbol$1('Symbol.' + name);
    } return WellKnownSymbolsStore$1[name];
  };

  var SPECIES$2 = wellKnownSymbol$1('species');

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.github.io/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate$1 = function (originalArray, length) {
    var C;
    if (isArray$1(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (typeof C == 'function' && (C === Array || isArray$1(C.prototype))) C = undefined;
      else if (isObject$1(C)) {
        C = C[SPECIES$2];
        if (C === null) C = undefined;
      }
    } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
  };

  var createProperty = function (object, key, value) {
    var propertyKey = toPrimitive$1(key);
    if (propertyKey in object) objectDefineProperty$1.f(object, propertyKey, createPropertyDescriptor$1(0, value));
    else object[propertyKey] = value;
  };

  var engineUserAgent$1 = getBuiltIn$1('navigator', 'userAgent') || '';

  var process$1 = global_1$1.process;
  var versions$1 = process$1 && process$1.versions;
  var v8$1 = versions$1 && versions$1.v8;
  var match$1, version$1;

  if (v8$1) {
    match$1 = v8$1.split('.');
    version$1 = match$1[0] + match$1[1];
  } else if (engineUserAgent$1) {
    match$1 = engineUserAgent$1.match(/Edge\/(\d+)/);
    if (!match$1 || match$1[1] >= 74) {
      match$1 = engineUserAgent$1.match(/Chrome\/(\d+)/);
      if (match$1) version$1 = match$1[1];
    }
  }

  var engineV8Version$1 = version$1 && +version$1;

  var SPECIES$1$1 = wellKnownSymbol$1('species');

  var arrayMethodHasSpeciesSupport$1 = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return engineV8Version$1 >= 51 || !fails$1(function () {
      var array = [];
      var constructor = array.constructor = {};
      constructor[SPECIES$1$1] = function () {
        return { foo: 1 };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var defineProperty$1 = Object.defineProperty;
  var cache$1 = {};

  var thrower$1 = function (it) { throw it; };

  var arrayMethodUsesToLength$1 = function (METHOD_NAME, options) {
    if (has$2(cache$1, METHOD_NAME)) return cache$1[METHOD_NAME];
    if (!options) options = {};
    var method = [][METHOD_NAME];
    var ACCESSORS = has$2(options, 'ACCESSORS') ? options.ACCESSORS : false;
    var argument0 = has$2(options, 0) ? options[0] : thrower$1;
    var argument1 = has$2(options, 1) ? options[1] : undefined;

    return cache$1[METHOD_NAME] = !!method && !fails$1(function () {
      if (ACCESSORS && !descriptors$1) return true;
      var O = { length: -1 };

      if (ACCESSORS) defineProperty$1(O, 1, { enumerable: true, get: thrower$1 });
      else O[1] = 1;

      method.call(O, argument0, argument1);
    });
  };

  var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$1('splice');
  var USES_TO_LENGTH$2 = arrayMethodUsesToLength$1('splice', { ACCESSORS: true, 0: 0, 1: 2 });

  var max$1$1 = Math.max;
  var min$2$1 = Math.min;
  var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

  // `Array.prototype.splice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.splice
  // with adding support of @@species
  _export$1({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$2 }, {
    splice: function splice(start, deleteCount /* , ...items */) {
      var O = toObject$1(this);
      var len = toLength$1(O.length);
      var actualStart = toAbsoluteIndex$1(start, len);
      var argumentsLength = arguments.length;
      var insertCount, actualDeleteCount, A, k, from, to;
      if (argumentsLength === 0) {
        insertCount = actualDeleteCount = 0;
      } else if (argumentsLength === 1) {
        insertCount = 0;
        actualDeleteCount = len - actualStart;
      } else {
        insertCount = argumentsLength - 2;
        actualDeleteCount = min$2$1(max$1$1(toInteger$1(deleteCount), 0), len - actualStart);
      }
      if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
        throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
      }
      A = arraySpeciesCreate$1(O, actualDeleteCount);
      for (k = 0; k < actualDeleteCount; k++) {
        from = actualStart + k;
        if (from in O) createProperty(A, k, O[from]);
      }
      A.length = actualDeleteCount;
      if (insertCount < actualDeleteCount) {
        for (k = actualStart; k < len - actualDeleteCount; k++) {
          from = k + actualDeleteCount;
          to = k + insertCount;
          if (from in O) O[to] = O[from];
          else delete O[to];
        }
        for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
      } else if (insertCount > actualDeleteCount) {
        for (k = len - actualDeleteCount; k > actualStart; k--) {
          from = k + actualDeleteCount - 1;
          to = k + insertCount - 1;
          if (from in O) O[to] = O[from];
          else delete O[to];
        }
      }
      for (k = 0; k < insertCount; k++) {
        O[k + actualStart] = arguments[k + 2];
      }
      O.length = len - actualDeleteCount + insertCount;
      return A;
    }
  });

  function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$1(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
  }

  // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys
  var objectKeys = Object.keys || function keys(O) {
    return objectKeysInternal$1(O, enumBugKeys$1);
  };

  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  var objectDefineProperties = descriptors$1 ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject$1(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) objectDefineProperty$1.f(O, key = keys[index++], Properties[key]);
    return O;
  };

  var html = getBuiltIn$1('document', 'documentElement');

  var GT = '>';
  var LT = '<';
  var PROTOTYPE = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO = sharedKey$1('IE_PROTO');

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
    var iframe = documentCreateElement$1('iframe');
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
    var length = enumBugKeys$1.length;
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys$1[length]];
    return NullProtoObject();
  };

  hiddenKeys$2[IE_PROTO] = true;

  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject$1(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO] = O;
    } else result = NullProtoObject();
    return Properties === undefined ? result : objectDefineProperties(result, Properties);
  };

  var nativeGetOwnPropertyNames = objectGetOwnPropertyNames$1.f;

  var toString$1$1 = {}.toString;

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
  var f$5$1 = function getOwnPropertyNames(it) {
    return windowNames && toString$1$1.call(it) == '[object Window]'
      ? getWindowNames(it)
      : nativeGetOwnPropertyNames(toIndexedObject$1(it));
  };

  var objectGetOwnPropertyNamesExternal = {
  	f: f$5$1
  };

  var f$6 = wellKnownSymbol$1;

  var wellKnownSymbolWrapped = {
  	f: f$6
  };

  var defineProperty$1$1 = objectDefineProperty$1.f;

  var defineWellKnownSymbol = function (NAME) {
    var Symbol = path$1.Symbol || (path$1.Symbol = {});
    if (!has$2(Symbol, NAME)) defineProperty$1$1(Symbol, NAME, {
      value: wellKnownSymbolWrapped.f(NAME)
    });
  };

  var defineProperty$2 = objectDefineProperty$1.f;



  var TO_STRING_TAG = wellKnownSymbol$1('toStringTag');

  var setToStringTag = function (it, TAG, STATIC) {
    if (it && !has$2(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
      defineProperty$2(it, TO_STRING_TAG, { configurable: true, value: TAG });
    }
  };

  var aFunction$1$1 = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    } return it;
  };

  // optional / simple context binding
  var functionBindContext$1 = function (fn, that, length) {
    aFunction$1$1(fn);
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

  var push$1 = [].push;

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
  var createMethod$1$1 = function (TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject$1($this);
      var self = indexedObject$1(O);
      var boundFunction = functionBindContext$1(callbackfn, that, 3);
      var length = toLength$1(self.length);
      var index = 0;
      var create = specificCreate || arraySpeciesCreate$1;
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
            case 2: push$1.call(target, value); // filter
          } else if (IS_EVERY) return false;  // every
        }
      }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var arrayIteration$1 = {
    // `Array.prototype.forEach` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
    forEach: createMethod$1$1(0),
    // `Array.prototype.map` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.map
    map: createMethod$1$1(1),
    // `Array.prototype.filter` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.filter
    filter: createMethod$1$1(2),
    // `Array.prototype.some` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.some
    some: createMethod$1$1(3),
    // `Array.prototype.every` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.every
    every: createMethod$1$1(4),
    // `Array.prototype.find` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    find: createMethod$1$1(5),
    // `Array.prototype.findIndex` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$1$1(6)
  };

  var $forEach$1 = arrayIteration$1.forEach;

  var HIDDEN = sharedKey$1('hidden');
  var SYMBOL = 'Symbol';
  var PROTOTYPE$1 = 'prototype';
  var TO_PRIMITIVE = wellKnownSymbol$1('toPrimitive');
  var setInternalState = internalState$1.set;
  var getInternalState = internalState$1.getterFor(SYMBOL);
  var ObjectPrototype = Object[PROTOTYPE$1];
  var $Symbol = global_1$1.Symbol;
  var $stringify = getBuiltIn$1('JSON', 'stringify');
  var nativeGetOwnPropertyDescriptor$1$1 = objectGetOwnPropertyDescriptor$1.f;
  var nativeDefineProperty$1$1 = objectDefineProperty$1.f;
  var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
  var nativePropertyIsEnumerable$1$1 = objectPropertyIsEnumerable$1.f;
  var AllSymbols = shared$1('symbols');
  var ObjectPrototypeSymbols = shared$1('op-symbols');
  var StringToSymbolRegistry = shared$1('string-to-symbol-registry');
  var SymbolToStringRegistry = shared$1('symbol-to-string-registry');
  var WellKnownSymbolsStore$1$1 = shared$1('wks');
  var QObject = global_1$1.QObject;
  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDescriptor = descriptors$1 && fails$1(function () {
    return objectCreate(nativeDefineProperty$1$1({}, 'a', {
      get: function () { return nativeDefineProperty$1$1(this, 'a', { value: 7 }).a; }
    })).a != 7;
  }) ? function (O, P, Attributes) {
    var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1$1(ObjectPrototype, P);
    if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
    nativeDefineProperty$1$1(O, P, Attributes);
    if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
      nativeDefineProperty$1$1(ObjectPrototype, P, ObjectPrototypeDescriptor);
    }
  } : nativeDefineProperty$1$1;

  var wrap = function (tag, description) {
    var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
    setInternalState(symbol, {
      type: SYMBOL,
      tag: tag,
      description: description
    });
    if (!descriptors$1) symbol.description = description;
    return symbol;
  };

  var isSymbol = useSymbolAsUid$1 ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return Object(it) instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(O, P, Attributes) {
    if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
    anObject$1(O);
    var key = toPrimitive$1(P, true);
    anObject$1(Attributes);
    if (has$2(AllSymbols, key)) {
      if (!Attributes.enumerable) {
        if (!has$2(O, HIDDEN)) nativeDefineProperty$1$1(O, HIDDEN, createPropertyDescriptor$1(1, {}));
        O[HIDDEN][key] = true;
      } else {
        if (has$2(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
        Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor$1(0, false) });
      } return setSymbolDescriptor(O, key, Attributes);
    } return nativeDefineProperty$1$1(O, key, Attributes);
  };

  var $defineProperties = function defineProperties(O, Properties) {
    anObject$1(O);
    var properties = toIndexedObject$1(Properties);
    var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
    $forEach$1(keys, function (key) {
      if (!descriptors$1 || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
    });
    return O;
  };

  var $create = function create(O, Properties) {
    return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
  };

  var $propertyIsEnumerable = function propertyIsEnumerable(V) {
    var P = toPrimitive$1(V, true);
    var enumerable = nativePropertyIsEnumerable$1$1.call(this, P);
    if (this === ObjectPrototype && has$2(AllSymbols, P) && !has$2(ObjectPrototypeSymbols, P)) return false;
    return enumerable || !has$2(this, P) || !has$2(AllSymbols, P) || has$2(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
  };

  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
    var it = toIndexedObject$1(O);
    var key = toPrimitive$1(P, true);
    if (it === ObjectPrototype && has$2(AllSymbols, key) && !has$2(ObjectPrototypeSymbols, key)) return;
    var descriptor = nativeGetOwnPropertyDescriptor$1$1(it, key);
    if (descriptor && has$2(AllSymbols, key) && !(has$2(it, HIDDEN) && it[HIDDEN][key])) {
      descriptor.enumerable = true;
    }
    return descriptor;
  };

  var $getOwnPropertyNames = function getOwnPropertyNames(O) {
    var names = nativeGetOwnPropertyNames$1(toIndexedObject$1(O));
    var result = [];
    $forEach$1(names, function (key) {
      if (!has$2(AllSymbols, key) && !has$2(hiddenKeys$2, key)) result.push(key);
    });
    return result;
  };

  var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
    var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
    var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject$1(O));
    var result = [];
    $forEach$1(names, function (key) {
      if (has$2(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has$2(ObjectPrototype, key))) {
        result.push(AllSymbols[key]);
      }
    });
    return result;
  };

  // `Symbol` constructor
  // https://tc39.github.io/ecma262/#sec-symbol-constructor
  if (!nativeSymbol$1) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
      var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
      var tag = uid$1(description);
      var setter = function (value) {
        if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
        if (has$2(this, HIDDEN) && has$2(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDescriptor(this, tag, createPropertyDescriptor$1(1, value));
      };
      if (descriptors$1 && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
      return wrap(tag, description);
    };

    redefine$1($Symbol[PROTOTYPE$1], 'toString', function toString() {
      return getInternalState(this).tag;
    });

    redefine$1($Symbol, 'withoutSetter', function (description) {
      return wrap(uid$1(description), description);
    });

    objectPropertyIsEnumerable$1.f = $propertyIsEnumerable;
    objectDefineProperty$1.f = $defineProperty;
    objectGetOwnPropertyDescriptor$1.f = $getOwnPropertyDescriptor;
    objectGetOwnPropertyNames$1.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
    objectGetOwnPropertySymbols$1.f = $getOwnPropertySymbols;

    wellKnownSymbolWrapped.f = function (name) {
      return wrap(wellKnownSymbol$1(name), name);
    };

    if (descriptors$1) {
      // https://github.com/tc39/proposal-Symbol-description
      nativeDefineProperty$1$1($Symbol[PROTOTYPE$1], 'description', {
        configurable: true,
        get: function description() {
          return getInternalState(this).description;
        }
      });
      {
        redefine$1(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
      }
    }
  }

  _export$1({ global: true, wrap: true, forced: !nativeSymbol$1, sham: !nativeSymbol$1 }, {
    Symbol: $Symbol
  });

  $forEach$1(objectKeys(WellKnownSymbolsStore$1$1), function (name) {
    defineWellKnownSymbol(name);
  });

  _export$1({ target: SYMBOL, stat: true, forced: !nativeSymbol$1 }, {
    // `Symbol.for` method
    // https://tc39.github.io/ecma262/#sec-symbol.for
    'for': function (key) {
      var string = String(key);
      if (has$2(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
      var symbol = $Symbol(string);
      StringToSymbolRegistry[string] = symbol;
      SymbolToStringRegistry[symbol] = string;
      return symbol;
    },
    // `Symbol.keyFor` method
    // https://tc39.github.io/ecma262/#sec-symbol.keyfor
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
      if (has$2(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
    },
    useSetter: function () { USE_SETTER = true; },
    useSimple: function () { USE_SETTER = false; }
  });

  _export$1({ target: 'Object', stat: true, forced: !nativeSymbol$1, sham: !descriptors$1 }, {
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

  _export$1({ target: 'Object', stat: true, forced: !nativeSymbol$1 }, {
    // `Object.getOwnPropertyNames` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
    getOwnPropertyNames: $getOwnPropertyNames,
    // `Object.getOwnPropertySymbols` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
    getOwnPropertySymbols: $getOwnPropertySymbols
  });

  // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
  // https://bugs.chromium.org/p/v8/issues/detail?id=3443
  _export$1({ target: 'Object', stat: true, forced: fails$1(function () { objectGetOwnPropertySymbols$1.f(1); }) }, {
    getOwnPropertySymbols: function getOwnPropertySymbols(it) {
      return objectGetOwnPropertySymbols$1.f(toObject$1(it));
    }
  });

  // `JSON.stringify` method behavior with symbols
  // https://tc39.github.io/ecma262/#sec-json.stringify
  if ($stringify) {
    var FORCED_JSON_STRINGIFY = !nativeSymbol$1 || fails$1(function () {
      var symbol = $Symbol();
      // MS Edge converts symbol values to JSON as {}
      return $stringify([symbol]) != '[null]'
        // WebKit converts symbol values to JSON as null
        || $stringify({ a: symbol }) != '{}'
        // V8 throws on boxed symbols
        || $stringify(Object(symbol)) != '{}';
    });

    _export$1({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
      // eslint-disable-next-line no-unused-vars
      stringify: function stringify(it, replacer, space) {
        var args = [it];
        var index = 1;
        var $replacer;
        while (arguments.length > index) args.push(arguments[index++]);
        $replacer = replacer;
        if (!isObject$1(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
        if (!isArray$1(replacer)) replacer = function (key, value) {
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
    createNonEnumerableProperty$1($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
  }
  // `Symbol.prototype[@@toStringTag]` property
  // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
  setToStringTag($Symbol, SYMBOL);

  hiddenKeys$2[HIDDEN] = true;

  // `Symbol.asyncIterator` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.asynciterator
  defineWellKnownSymbol('asyncIterator');

  var defineProperty$3 = objectDefineProperty$1.f;


  var NativeSymbol = global_1$1.Symbol;

  if (descriptors$1 && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
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
    copyConstructorProperties$1(SymbolWrapper, NativeSymbol);
    var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
    symbolPrototype.constructor = SymbolWrapper;

    var symbolToString = symbolPrototype.toString;
    var native = String(NativeSymbol('test')) == 'Symbol(test)';
    var regexp = /^Symbol\((.*)\)[^)]+$/;
    defineProperty$3(symbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        var symbol = isObject$1(this) ? this.valueOf() : this;
        var string = symbolToString.call(symbol);
        if (has$2(EmptyStringDescriptionStore, symbol)) return '';
        var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
        return desc === '' ? undefined : desc;
      }
    });

    _export$1({ global: true, forced: true }, {
      Symbol: SymbolWrapper
    });
  }

  // `Symbol.hasInstance` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.hasinstance
  defineWellKnownSymbol('hasInstance');

  // `Symbol.isConcatSpreadable` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
  defineWellKnownSymbol('isConcatSpreadable');

  // `Symbol.iterator` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.iterator
  defineWellKnownSymbol('iterator');

  // `Symbol.match` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.match
  defineWellKnownSymbol('match');

  // `Symbol.matchAll` well-known symbol
  defineWellKnownSymbol('matchAll');

  // `Symbol.replace` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.replace
  defineWellKnownSymbol('replace');

  // `Symbol.search` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.search
  defineWellKnownSymbol('search');

  // `Symbol.species` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.species
  defineWellKnownSymbol('species');

  // `Symbol.split` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.split
  defineWellKnownSymbol('split');

  // `Symbol.toPrimitive` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.toprimitive
  defineWellKnownSymbol('toPrimitive');

  // `Symbol.toStringTag` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.tostringtag
  defineWellKnownSymbol('toStringTag');

  // `Symbol.unscopables` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.unscopables
  defineWellKnownSymbol('unscopables');

  var nativeAssign = Object.assign;
  var defineProperty$4 = Object.defineProperty;

  // `Object.assign` method
  // https://tc39.github.io/ecma262/#sec-object.assign
  var objectAssign = !nativeAssign || fails$1(function () {
    // should have correct order of operations (Edge bug)
    if (descriptors$1 && nativeAssign({ b: 1 }, nativeAssign(defineProperty$4({}, 'a', {
      enumerable: true,
      get: function () {
        defineProperty$4(this, 'b', {
          value: 3,
          enumerable: false
        });
      }
    }), { b: 2 })).b !== 1) return true;
    // should work with symbols and should have deterministic property order (V8 bug)
    var A = {};
    var B = {};
    // eslint-disable-next-line no-undef
    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) { B[chr] = chr; });
    return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars
    var T = toObject$1(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = objectGetOwnPropertySymbols$1.f;
    var propertyIsEnumerable = objectPropertyIsEnumerable$1.f;
    while (argumentsLength > index) {
      var S = indexedObject$1(arguments[index++]);
      var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        key = keys[j++];
        if (!descriptors$1 || propertyIsEnumerable.call(S, key)) T[key] = S[key];
      }
    } return T;
  } : nativeAssign;

  // `Object.assign` method
  // https://tc39.github.io/ecma262/#sec-object.assign
  _export$1({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
    assign: objectAssign
  });

  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  _export$1({ target: 'Object', stat: true, sham: !descriptors$1 }, {
    create: objectCreate
  });

  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  _export$1({ target: 'Object', stat: true, forced: !descriptors$1, sham: !descriptors$1 }, {
    defineProperty: objectDefineProperty$1.f
  });

  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  _export$1({ target: 'Object', stat: true, forced: !descriptors$1, sham: !descriptors$1 }, {
    defineProperties: objectDefineProperties
  });

  var propertyIsEnumerable = objectPropertyIsEnumerable$1.f;

  // `Object.{ entries, values }` methods implementation
  var createMethod$2$1 = function (TO_ENTRIES) {
    return function (it) {
      var O = toIndexedObject$1(it);
      var keys = objectKeys(O);
      var length = keys.length;
      var i = 0;
      var result = [];
      var key;
      while (length > i) {
        key = keys[i++];
        if (!descriptors$1 || propertyIsEnumerable.call(O, key)) {
          result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
        }
      }
      return result;
    };
  };

  var objectToArray = {
    // `Object.entries` method
    // https://tc39.github.io/ecma262/#sec-object.entries
    entries: createMethod$2$1(true),
    // `Object.values` method
    // https://tc39.github.io/ecma262/#sec-object.values
    values: createMethod$2$1(false)
  };

  var $entries = objectToArray.entries;

  // `Object.entries` method
  // https://tc39.github.io/ecma262/#sec-object.entries
  _export$1({ target: 'Object', stat: true }, {
    entries: function entries(O) {
      return $entries(O);
    }
  });

  var freezing = !fails$1(function () {
    return Object.isExtensible(Object.preventExtensions({}));
  });

  var internalMetadata = createCommonjsModule$1(function (module) {
  var defineProperty = objectDefineProperty$1.f;



  var METADATA = uid$1('meta');
  var id = 0;

  var isExtensible = Object.isExtensible || function () {
    return true;
  };

  var setMetadata = function (it) {
    defineProperty(it, METADATA, { value: {
      objectID: 'O' + ++id, // object ID
      weakData: {}          // weak collections IDs
    } });
  };

  var fastKey = function (it, create) {
    // return a primitive with prefix
    if (!isObject$1(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!has$2(it, METADATA)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMetadata(it);
    // return object ID
    } return it[METADATA].objectID;
  };

  var getWeakData = function (it, create) {
    if (!has$2(it, METADATA)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMetadata(it);
    // return the store of weak collections IDs
    } return it[METADATA].weakData;
  };

  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (freezing && meta.REQUIRED && isExtensible(it) && !has$2(it, METADATA)) setMetadata(it);
    return it;
  };

  var meta = module.exports = {
    REQUIRED: false,
    fastKey: fastKey,
    getWeakData: getWeakData,
    onFreeze: onFreeze
  };

  hiddenKeys$2[METADATA] = true;
  });
  var internalMetadata_1 = internalMetadata.REQUIRED;
  var internalMetadata_2 = internalMetadata.fastKey;
  var internalMetadata_3 = internalMetadata.getWeakData;
  var internalMetadata_4 = internalMetadata.onFreeze;

  var onFreeze = internalMetadata.onFreeze;

  var nativeFreeze = Object.freeze;
  var FAILS_ON_PRIMITIVES = fails$1(function () { nativeFreeze(1); });

  // `Object.freeze` method
  // https://tc39.github.io/ecma262/#sec-object.freeze
  _export$1({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !freezing }, {
    freeze: function freeze(it) {
      return nativeFreeze && isObject$1(it) ? nativeFreeze(onFreeze(it)) : it;
    }
  });

  var iterators = {};

  var ITERATOR = wellKnownSymbol$1('iterator');
  var ArrayPrototype = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
  };

  var TO_STRING_TAG$1 = wellKnownSymbol$1('toStringTag');
  var test = {};

  test[TO_STRING_TAG$1] = 'z';

  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG$2 = wellKnownSymbol$1('toStringTag');
  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw$1(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof = toStringTagSupport ? classofRaw$1 : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw$1(O)
      // ES3 arguments fallback
      : (result = classofRaw$1(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
  };

  var ITERATOR$1 = wellKnownSymbol$1('iterator');

  var getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$1]
      || it['@@iterator']
      || iterators[classof(it)];
  };

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject$1(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      var returnMethod = iterator['return'];
      if (returnMethod !== undefined) anObject$1(returnMethod.call(iterator));
      throw error;
    }
  };

  var iterate_1 = createCommonjsModule$1(function (module) {
  var Result = function (stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };

  var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
    var boundFunction = functionBindContext$1(fn, that, AS_ENTRIES ? 2 : 1);
    var iterator, iterFn, index, length, result, next, step;

    if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
      // optimisation for array iterators
      if (isArrayIteratorMethod(iterFn)) {
        for (index = 0, length = toLength$1(iterable.length); length > index; index++) {
          result = AS_ENTRIES
            ? boundFunction(anObject$1(step = iterable[index])[0], step[1])
            : boundFunction(iterable[index]);
          if (result && result instanceof Result) return result;
        } return new Result(false);
      }
      iterator = iterFn.call(iterable);
    }

    next = iterator.next;
    while (!(step = next.call(iterator)).done) {
      result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
      if (typeof result == 'object' && result && result instanceof Result) return result;
    } return new Result(false);
  };

  iterate.stop = function (result) {
    return new Result(true, result);
  };
  });

  // `Object.fromEntries` method
  // https://github.com/tc39/proposal-object-from-entries
  _export$1({ target: 'Object', stat: true }, {
    fromEntries: function fromEntries(iterable) {
      var obj = {};
      iterate_1(iterable, function (k, v) {
        createProperty(obj, k, v);
      }, undefined, true);
      return obj;
    }
  });

  var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor$1.f;


  var FAILS_ON_PRIMITIVES$1 = fails$1(function () { nativeGetOwnPropertyDescriptor$2(1); });
  var FORCED = !descriptors$1 || FAILS_ON_PRIMITIVES$1;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
  _export$1({ target: 'Object', stat: true, forced: FORCED, sham: !descriptors$1 }, {
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
      return nativeGetOwnPropertyDescriptor$2(toIndexedObject$1(it), key);
    }
  });

  // `Object.getOwnPropertyDescriptors` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  _export$1({ target: 'Object', stat: true, sham: !descriptors$1 }, {
    getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
      var O = toIndexedObject$1(object);
      var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor$1.f;
      var keys = ownKeys$1(O);
      var result = {};
      var index = 0;
      var key, descriptor;
      while (keys.length > index) {
        descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
        if (descriptor !== undefined) createProperty(result, key, descriptor);
      }
      return result;
    }
  });

  var nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;

  var FAILS_ON_PRIMITIVES$2 = fails$1(function () { return !Object.getOwnPropertyNames(1); });

  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  _export$1({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
    getOwnPropertyNames: nativeGetOwnPropertyNames$2
  });

  var correctPrototypeGetter = !fails$1(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var IE_PROTO$1 = sharedKey$1('IE_PROTO');
  var ObjectPrototype$1 = Object.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof
  var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
    O = toObject$1(O);
    if (has$2(O, IE_PROTO$1)) return O[IE_PROTO$1];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectPrototype$1 : null;
  };

  var FAILS_ON_PRIMITIVES$3 = fails$1(function () { objectGetPrototypeOf(1); });

  // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof
  _export$1({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3, sham: !correctPrototypeGetter }, {
    getPrototypeOf: function getPrototypeOf(it) {
      return objectGetPrototypeOf(toObject$1(it));
    }
  });

  // `SameValue` abstract operation
  // https://tc39.github.io/ecma262/#sec-samevalue
  var sameValue = Object.is || function is(x, y) {
    // eslint-disable-next-line no-self-compare
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  };

  // `Object.is` method
  // https://tc39.github.io/ecma262/#sec-object.is
  _export$1({ target: 'Object', stat: true }, {
    is: sameValue
  });

  var nativeIsExtensible = Object.isExtensible;
  var FAILS_ON_PRIMITIVES$4 = fails$1(function () { nativeIsExtensible(1); });

  // `Object.isExtensible` method
  // https://tc39.github.io/ecma262/#sec-object.isextensible
  _export$1({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4 }, {
    isExtensible: function isExtensible(it) {
      return isObject$1(it) ? nativeIsExtensible ? nativeIsExtensible(it) : true : false;
    }
  });

  var nativeIsFrozen = Object.isFrozen;
  var FAILS_ON_PRIMITIVES$5 = fails$1(function () { nativeIsFrozen(1); });

  // `Object.isFrozen` method
  // https://tc39.github.io/ecma262/#sec-object.isfrozen
  _export$1({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$5 }, {
    isFrozen: function isFrozen(it) {
      return isObject$1(it) ? nativeIsFrozen ? nativeIsFrozen(it) : false : true;
    }
  });

  var nativeIsSealed = Object.isSealed;
  var FAILS_ON_PRIMITIVES$6 = fails$1(function () { nativeIsSealed(1); });

  // `Object.isSealed` method
  // https://tc39.github.io/ecma262/#sec-object.issealed
  _export$1({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$6 }, {
    isSealed: function isSealed(it) {
      return isObject$1(it) ? nativeIsSealed ? nativeIsSealed(it) : false : true;
    }
  });

  var FAILS_ON_PRIMITIVES$7 = fails$1(function () { objectKeys(1); });

  // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys
  _export$1({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$7 }, {
    keys: function keys(it) {
      return objectKeys(toObject$1(it));
    }
  });

  var onFreeze$1 = internalMetadata.onFreeze;



  var nativePreventExtensions = Object.preventExtensions;
  var FAILS_ON_PRIMITIVES$8 = fails$1(function () { nativePreventExtensions(1); });

  // `Object.preventExtensions` method
  // https://tc39.github.io/ecma262/#sec-object.preventextensions
  _export$1({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$8, sham: !freezing }, {
    preventExtensions: function preventExtensions(it) {
      return nativePreventExtensions && isObject$1(it) ? nativePreventExtensions(onFreeze$1(it)) : it;
    }
  });

  var onFreeze$2 = internalMetadata.onFreeze;



  var nativeSeal = Object.seal;
  var FAILS_ON_PRIMITIVES$9 = fails$1(function () { nativeSeal(1); });

  // `Object.seal` method
  // https://tc39.github.io/ecma262/#sec-object.seal
  _export$1({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$9, sham: !freezing }, {
    seal: function seal(it) {
      return nativeSeal && isObject$1(it) ? nativeSeal(onFreeze$2(it)) : it;
    }
  });

  var aPossiblePrototype = function (it) {
    if (!isObject$1(it) && it !== null) {
      throw TypeError("Can't set " + String(it) + ' as a prototype');
    } return it;
  };

  // `Object.setPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */
  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;
    try {
      setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
      setter.call(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) { /* empty */ }
    return function setPrototypeOf(O, proto) {
      anObject$1(O);
      aPossiblePrototype(proto);
      if (CORRECT_SETTER) setter.call(O, proto);
      else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  // `Object.setPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.setprototypeof
  _export$1({ target: 'Object', stat: true }, {
    setPrototypeOf: objectSetPrototypeOf
  });

  var $values = objectToArray.values;

  // `Object.values` method
  // https://tc39.github.io/ecma262/#sec-object.values
  _export$1({ target: 'Object', stat: true }, {
    values: function values(O) {
      return $values(O);
    }
  });

  // `Object.prototype.toString` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
  var objectToString = toStringTagSupport ? {}.toString : function toString() {
    return '[object ' + classof(this) + ']';
  };

  // `Object.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
  if (!toStringTagSupport) {
    redefine$1(Object.prototype, 'toString', objectToString, { unsafe: true });
  }

  // Forced replacement object prototype accessors methods
  var objectPrototypeAccessorsForced =  !fails$1(function () {
    var key = Math.random();
    // In FF throws only define methods
    // eslint-disable-next-line no-undef, no-useless-call
    __defineSetter__.call(null, key, function () { /* empty */ });
    delete global_1$1[key];
  });

  // `Object.prototype.__defineGetter__` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.__defineGetter__
  if (descriptors$1) {
    _export$1({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
      __defineGetter__: function __defineGetter__(P, getter) {
        objectDefineProperty$1.f(toObject$1(this), P, { get: aFunction$1$1(getter), enumerable: true, configurable: true });
      }
    });
  }

  // `Object.prototype.__defineSetter__` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.__defineSetter__
  if (descriptors$1) {
    _export$1({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
      __defineSetter__: function __defineSetter__(P, setter) {
        objectDefineProperty$1.f(toObject$1(this), P, { set: aFunction$1$1(setter), enumerable: true, configurable: true });
      }
    });
  }

  var getOwnPropertyDescriptor$2$1 = objectGetOwnPropertyDescriptor$1.f;

  // `Object.prototype.__lookupGetter__` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.__lookupGetter__
  if (descriptors$1) {
    _export$1({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
      __lookupGetter__: function __lookupGetter__(P) {
        var O = toObject$1(this);
        var key = toPrimitive$1(P, true);
        var desc;
        do {
          if (desc = getOwnPropertyDescriptor$2$1(O, key)) return desc.get;
        } while (O = objectGetPrototypeOf(O));
      }
    });
  }

  var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor$1.f;

  // `Object.prototype.__lookupSetter__` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.__lookupSetter__
  if (descriptors$1) {
    _export$1({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
      __lookupSetter__: function __lookupSetter__(P) {
        var O = toObject$1(this);
        var key = toPrimitive$1(P, true);
        var desc;
        do {
          if (desc = getOwnPropertyDescriptor$3(O, key)) return desc.set;
        } while (O = objectGetPrototypeOf(O));
      }
    });
  }

  var slice = [].slice;
  var factories = {};

  var construct = function (C, argsLength, args) {
    if (!(argsLength in factories)) {
      for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
      // eslint-disable-next-line no-new-func
      factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
    } return factories[argsLength](C, args);
  };

  // `Function.prototype.bind` method implementation
  // https://tc39.github.io/ecma262/#sec-function.prototype.bind
  var functionBind = Function.bind || function bind(that /* , ...args */) {
    var fn = aFunction$1$1(this);
    var partArgs = slice.call(arguments, 1);
    var boundFunction = function bound(/* args... */) {
      var args = partArgs.concat(slice.call(arguments));
      return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
    };
    if (isObject$1(fn.prototype)) boundFunction.prototype = fn.prototype;
    return boundFunction;
  };

  // `Function.prototype.bind` method
  // https://tc39.github.io/ecma262/#sec-function.prototype.bind
  _export$1({ target: 'Function', proto: true }, {
    bind: functionBind
  });

  var defineProperty$5 = objectDefineProperty$1.f;

  var FunctionPrototype = Function.prototype;
  var FunctionPrototypeToString = FunctionPrototype.toString;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME = 'name';

  // Function instances `.name` property
  // https://tc39.github.io/ecma262/#sec-function-instances-name
  if (descriptors$1 && !(NAME in FunctionPrototype)) {
    defineProperty$5(FunctionPrototype, NAME, {
      configurable: true,
      get: function () {
        try {
          return FunctionPrototypeToString.call(this).match(nameRE)[1];
        } catch (error) {
          return '';
        }
      }
    });
  }

  var HAS_INSTANCE = wellKnownSymbol$1('hasInstance');
  var FunctionPrototype$1 = Function.prototype;

  // `Function.prototype[@@hasInstance]` method
  // https://tc39.github.io/ecma262/#sec-function.prototype-@@hasinstance
  if (!(HAS_INSTANCE in FunctionPrototype$1)) {
    objectDefineProperty$1.f(FunctionPrototype$1, HAS_INSTANCE, { value: function (O) {
      if (typeof this != 'function' || !isObject$1(O)) return false;
      if (!isObject$1(this.prototype)) return O instanceof this;
      // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
      while (O = objectGetPrototypeOf(O)) if (this.prototype === O) return true;
      return false;
    } });
  }

  // `globalThis` object
  // https://github.com/tc39/proposal-global
  _export$1({ global: true }, {
    globalThis: global_1$1
  });

  // `Array.from` method implementation
  // https://tc39.github.io/ecma262/#sec-array.from
  var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject$1(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod(O);
    var index = 0;
    var length, result, step, iterator, next, value;
    if (mapping) mapfn = functionBindContext$1(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      result = new C();
      for (;!(step = next.call(iterator)).done; index++) {
        value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
        createProperty(result, index, value);
      }
    } else {
      length = toLength$1(O.length);
      result = new C(length);
      for (;length > index; index++) {
        value = mapping ? mapfn(O[index], index) : O[index];
        createProperty(result, index, value);
      }
    }
    result.length = index;
    return result;
  };

  var ITERATOR$2 = wellKnownSymbol$1('iterator');
  var SAFE_CLOSING = false;

  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function () {
        return { done: !!called++ };
      },
      'return': function () {
        SAFE_CLOSING = true;
      }
    };
    iteratorWithReturn[ITERATOR$2] = function () {
      return this;
    };
    // eslint-disable-next-line no-throw-literal
    Array.from(iteratorWithReturn, function () { throw 2; });
  } catch (error) { /* empty */ }

  var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR$2] = function () {
        return {
          next: function () {
            return { done: ITERATION_SUPPORT = true };
          }
        };
      };
      exec(object);
    } catch (error) { /* empty */ }
    return ITERATION_SUPPORT;
  };

  var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
    Array.from(iterable);
  });

  // `Array.from` method
  // https://tc39.github.io/ecma262/#sec-array.from
  _export$1({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
    from: arrayFrom
  });

  // `Array.isArray` method
  // https://tc39.github.io/ecma262/#sec-array.isarray
  _export$1({ target: 'Array', stat: true }, {
    isArray: isArray$1
  });

  var ISNT_GENERIC = fails$1(function () {
    function F() { /* empty */ }
    return !(Array.of.call(F) instanceof F);
  });

  // `Array.of` method
  // https://tc39.github.io/ecma262/#sec-array.of
  // WebKit Array.of isn't generic
  _export$1({ target: 'Array', stat: true, forced: ISNT_GENERIC }, {
    of: function of(/* ...args */) {
      var index = 0;
      var argumentsLength = arguments.length;
      var result = new (typeof this == 'function' ? this : Array)(argumentsLength);
      while (argumentsLength > index) createProperty(result, index, arguments[index++]);
      result.length = argumentsLength;
      return result;
    }
  });

  var IS_CONCAT_SPREADABLE = wellKnownSymbol$1('isConcatSpreadable');
  var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/679
  var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version$1 >= 51 || !fails$1(function () {
    var array = [];
    array[IS_CONCAT_SPREADABLE] = false;
    return array.concat()[0] !== array;
  });

  var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$1('concat');

  var isConcatSpreadable = function (O) {
    if (!isObject$1(O)) return false;
    var spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray$1(O);
  };

  var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

  // `Array.prototype.concat` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species
  _export$1({ target: 'Array', proto: true, forced: FORCED$1 }, {
    concat: function concat(arg) { // eslint-disable-line no-unused-vars
      var O = toObject$1(this);
      var A = arraySpeciesCreate$1(O, 0);
      var n = 0;
      var i, k, length, len, E;
      for (i = -1, length = arguments.length; i < length; i++) {
        E = i === -1 ? O : arguments[i];
        if (isConcatSpreadable(E)) {
          len = toLength$1(E.length);
          if (n + len > MAX_SAFE_INTEGER$1) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
        } else {
          if (n >= MAX_SAFE_INTEGER$1) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          createProperty(A, n++, E);
        }
      }
      A.length = n;
      return A;
    }
  });

  var min$3 = Math.min;

  // `Array.prototype.copyWithin` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
  var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
    var O = toObject$1(this);
    var len = toLength$1(O.length);
    var to = toAbsoluteIndex$1(target, len);
    var from = toAbsoluteIndex$1(start, len);
    var end = arguments.length > 2 ? arguments[2] : undefined;
    var count = min$3((end === undefined ? len : toAbsoluteIndex$1(end, len)) - from, len - to);
    var inc = 1;
    if (from < to && to < from + count) {
      inc = -1;
      from += count - 1;
      to += count - 1;
    }
    while (count-- > 0) {
      if (from in O) O[to] = O[from];
      else delete O[to];
      to += inc;
      from += inc;
    } return O;
  };

  var UNSCOPABLES = wellKnownSymbol$1('unscopables');
  var ArrayPrototype$1 = Array.prototype;

  // Array.prototype[@@unscopables]
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
    objectDefineProperty$1.f(ArrayPrototype$1, UNSCOPABLES, {
      configurable: true,
      value: objectCreate(null)
    });
  }

  // add a key to Array.prototype[@@unscopables]
  var addToUnscopables = function (key) {
    ArrayPrototype$1[UNSCOPABLES][key] = true;
  };

  // `Array.prototype.copyWithin` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
  _export$1({ target: 'Array', proto: true }, {
    copyWithin: arrayCopyWithin
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('copyWithin');

  var arrayMethodIsStrict$1 = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails$1(function () {
      // eslint-disable-next-line no-useless-call,no-throw-literal
      method.call(null, argument || function () { throw 1; }, 1);
    });
  };

  var $every = arrayIteration$1.every;



  var STRICT_METHOD$1 = arrayMethodIsStrict$1('every');
  var USES_TO_LENGTH$1$1 = arrayMethodUsesToLength$1('every');

  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  _export$1({ target: 'Array', proto: true, forced: !STRICT_METHOD$1 || !USES_TO_LENGTH$1$1 }, {
    every: function every(callbackfn /* , thisArg */) {
      return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // `Array.prototype.fill` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.fill
  var arrayFill = function fill(value /* , start = 0, end = @length */) {
    var O = toObject$1(this);
    var length = toLength$1(O.length);
    var argumentsLength = arguments.length;
    var index = toAbsoluteIndex$1(argumentsLength > 1 ? arguments[1] : undefined, length);
    var end = argumentsLength > 2 ? arguments[2] : undefined;
    var endPos = end === undefined ? length : toAbsoluteIndex$1(end, length);
    while (endPos > index) O[index++] = value;
    return O;
  };

  // `Array.prototype.fill` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.fill
  _export$1({ target: 'Array', proto: true }, {
    fill: arrayFill
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('fill');

  var $filter = arrayIteration$1.filter;



  var HAS_SPECIES_SUPPORT$1$1 = arrayMethodHasSpeciesSupport$1('filter');
  // Edge 14- issue
  var USES_TO_LENGTH$2$1 = arrayMethodUsesToLength$1('filter');

  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  _export$1({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1$1 || !USES_TO_LENGTH$2$1 }, {
    filter: function filter(callbackfn /* , thisArg */) {
      return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var $find = arrayIteration$1.find;



  var FIND = 'find';
  var SKIPS_HOLES = true;

  var USES_TO_LENGTH$3 = arrayMethodUsesToLength$1(FIND);

  // Shouldn't skip holes
  if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  _export$1({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH$3 }, {
    find: function find(callbackfn /* , that = undefined */) {
      return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables(FIND);

  var $findIndex = arrayIteration$1.findIndex;



  var FIND_INDEX = 'findIndex';
  var SKIPS_HOLES$1 = true;

  var USES_TO_LENGTH$4 = arrayMethodUsesToLength$1(FIND_INDEX);

  // Shouldn't skip holes
  if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES$1 = false; });

  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findindex
  _export$1({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 || !USES_TO_LENGTH$4 }, {
    findIndex: function findIndex(callbackfn /* , that = undefined */) {
      return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables(FIND_INDEX);

  // `FlattenIntoArray` abstract operation
  // https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
  var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
    var targetIndex = start;
    var sourceIndex = 0;
    var mapFn = mapper ? functionBindContext$1(mapper, thisArg, 3) : false;
    var element;

    while (sourceIndex < sourceLen) {
      if (sourceIndex in source) {
        element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

        if (depth > 0 && isArray$1(element)) {
          targetIndex = flattenIntoArray(target, original, element, toLength$1(element.length), targetIndex, depth - 1) - 1;
        } else {
          if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
          target[targetIndex] = element;
        }

        targetIndex++;
      }
      sourceIndex++;
    }
    return targetIndex;
  };

  var flattenIntoArray_1 = flattenIntoArray;

  // `Array.prototype.flat` method
  // https://github.com/tc39/proposal-flatMap
  _export$1({ target: 'Array', proto: true }, {
    flat: function flat(/* depthArg = 1 */) {
      var depthArg = arguments.length ? arguments[0] : undefined;
      var O = toObject$1(this);
      var sourceLen = toLength$1(O.length);
      var A = arraySpeciesCreate$1(O, 0);
      A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger$1(depthArg));
      return A;
    }
  });

  // `Array.prototype.flatMap` method
  // https://github.com/tc39/proposal-flatMap
  _export$1({ target: 'Array', proto: true }, {
    flatMap: function flatMap(callbackfn /* , thisArg */) {
      var O = toObject$1(this);
      var sourceLen = toLength$1(O.length);
      var A;
      aFunction$1$1(callbackfn);
      A = arraySpeciesCreate$1(O, 0);
      A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      return A;
    }
  });

  var $forEach$1$1 = arrayIteration$1.forEach;



  var STRICT_METHOD$1$1 = arrayMethodIsStrict$1('forEach');
  var USES_TO_LENGTH$5 = arrayMethodUsesToLength$1('forEach');

  // `Array.prototype.forEach` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  var arrayForEach$1 = (!STRICT_METHOD$1$1 || !USES_TO_LENGTH$5) ? function forEach(callbackfn /* , thisArg */) {
    return $forEach$1$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  } : [].forEach;

  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  _export$1({ target: 'Array', proto: true, forced: [].forEach != arrayForEach$1 }, {
    forEach: arrayForEach$1
  });

  var $includes = arrayIncludes$1.includes;



  var USES_TO_LENGTH$6 = arrayMethodUsesToLength$1('indexOf', { ACCESSORS: true, 1: 0 });

  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  _export$1({ target: 'Array', proto: true, forced: !USES_TO_LENGTH$6 }, {
    includes: function includes(el /* , fromIndex = 0 */) {
      return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('includes');

  var $indexOf = arrayIncludes$1.indexOf;



  var nativeIndexOf = [].indexOf;

  var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
  var STRICT_METHOD$2 = arrayMethodIsStrict$1('indexOf');
  var USES_TO_LENGTH$7 = arrayMethodUsesToLength$1('indexOf', { ACCESSORS: true, 1: 0 });

  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  _export$1({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$2 || !USES_TO_LENGTH$7 }, {
    indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
      return NEGATIVE_ZERO
        // convert -0 to +0
        ? nativeIndexOf.apply(this, arguments) || 0
        : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var nativeJoin = [].join;

  var ES3_STRINGS = indexedObject$1 != Object;
  var STRICT_METHOD$3 = arrayMethodIsStrict$1('join', ',');

  // `Array.prototype.join` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.join
  _export$1({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$3 }, {
    join: function join(separator) {
      return nativeJoin.call(toIndexedObject$1(this), separator === undefined ? ',' : separator);
    }
  });

  var min$4 = Math.min;
  var nativeLastIndexOf = [].lastIndexOf;
  var NEGATIVE_ZERO$1 = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
  var STRICT_METHOD$4 = arrayMethodIsStrict$1('lastIndexOf');
  // For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
  var USES_TO_LENGTH$8 = arrayMethodUsesToLength$1('indexOf', { ACCESSORS: true, 1: 0 });
  var FORCED$2 = NEGATIVE_ZERO$1 || !STRICT_METHOD$4 || !USES_TO_LENGTH$8;

  // `Array.prototype.lastIndexOf` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
  var arrayLastIndexOf = FORCED$2 ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO$1) return nativeLastIndexOf.apply(this, arguments) || 0;
    var O = toIndexedObject$1(this);
    var length = toLength$1(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = min$4(index, toInteger$1(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
    return -1;
  } : nativeLastIndexOf;

  // `Array.prototype.lastIndexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
  _export$1({ target: 'Array', proto: true, forced: arrayLastIndexOf !== [].lastIndexOf }, {
    lastIndexOf: arrayLastIndexOf
  });

  var $map$1 = arrayIteration$1.map;



  var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport$1('map');
  // FF49- issue
  var USES_TO_LENGTH$9 = arrayMethodUsesToLength$1('map');

  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  // with adding support of @@species
  _export$1({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$9 }, {
    map: function map(callbackfn /* , thisArg */) {
      return $map$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // `Array.prototype.{ reduce, reduceRight }` methods implementation
  var createMethod$3 = function (IS_RIGHT) {
    return function (that, callbackfn, argumentsLength, memo) {
      aFunction$1$1(callbackfn);
      var O = toObject$1(that);
      var self = indexedObject$1(O);
      var length = toLength$1(O.length);
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
    left: createMethod$3(false),
    // `Array.prototype.reduceRight` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
    right: createMethod$3(true)
  };

  var $reduce = arrayReduce.left;



  var STRICT_METHOD$5 = arrayMethodIsStrict$1('reduce');
  var USES_TO_LENGTH$a = arrayMethodUsesToLength$1('reduce', { 1: 0 });

  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  _export$1({ target: 'Array', proto: true, forced: !STRICT_METHOD$5 || !USES_TO_LENGTH$a }, {
    reduce: function reduce(callbackfn /* , initialValue */) {
      return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var $reduceRight = arrayReduce.right;



  var STRICT_METHOD$6 = arrayMethodIsStrict$1('reduceRight');
  // For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
  var USES_TO_LENGTH$b = arrayMethodUsesToLength$1('reduce', { 1: 0 });

  // `Array.prototype.reduceRight` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
  _export$1({ target: 'Array', proto: true, forced: !STRICT_METHOD$6 || !USES_TO_LENGTH$b }, {
    reduceRight: function reduceRight(callbackfn /* , initialValue */) {
      return $reduceRight(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var nativeReverse = [].reverse;
  var test$1 = [1, 2];

  // `Array.prototype.reverse` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reverse
  // fix for Safari 12.0 bug
  // https://bugs.webkit.org/show_bug.cgi?id=188794
  _export$1({ target: 'Array', proto: true, forced: String(test$1) === String(test$1.reverse()) }, {
    reverse: function reverse() {
      // eslint-disable-next-line no-self-assign
      if (isArray$1(this)) this.length = this.length;
      return nativeReverse.call(this);
    }
  });

  var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport$1('slice');
  var USES_TO_LENGTH$c = arrayMethodUsesToLength$1('slice', { ACCESSORS: true, 0: 0, 1: 2 });

  var SPECIES$2$1 = wellKnownSymbol$1('species');
  var nativeSlice = [].slice;
  var max$2 = Math.max;

  // `Array.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.slice
  // fallback for not array-like ES3 strings and DOM objects
  _export$1({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$c }, {
    slice: function slice(start, end) {
      var O = toIndexedObject$1(this);
      var length = toLength$1(O.length);
      var k = toAbsoluteIndex$1(start, length);
      var fin = toAbsoluteIndex$1(end === undefined ? length : end, length);
      // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
      var Constructor, result, n;
      if (isArray$1(O)) {
        Constructor = O.constructor;
        // cross-realm fallback
        if (typeof Constructor == 'function' && (Constructor === Array || isArray$1(Constructor.prototype))) {
          Constructor = undefined;
        } else if (isObject$1(Constructor)) {
          Constructor = Constructor[SPECIES$2$1];
          if (Constructor === null) Constructor = undefined;
        }
        if (Constructor === Array || Constructor === undefined) {
          return nativeSlice.call(O, k, fin);
        }
      }
      result = new (Constructor === undefined ? Array : Constructor)(max$2(fin - k, 0));
      for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
      result.length = n;
      return result;
    }
  });

  var $some = arrayIteration$1.some;



  var STRICT_METHOD$7 = arrayMethodIsStrict$1('some');
  var USES_TO_LENGTH$d = arrayMethodUsesToLength$1('some');

  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  _export$1({ target: 'Array', proto: true, forced: !STRICT_METHOD$7 || !USES_TO_LENGTH$d }, {
    some: function some(callbackfn /* , thisArg */) {
      return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var test$2 = [];
  var nativeSort = test$2.sort;

  // IE8-
  var FAILS_ON_UNDEFINED = fails$1(function () {
    test$2.sort(undefined);
  });
  // V8 bug
  var FAILS_ON_NULL = fails$1(function () {
    test$2.sort(null);
  });
  // Old WebKit
  var STRICT_METHOD$8 = arrayMethodIsStrict$1('sort');

  var FORCED$3 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$8;

  // `Array.prototype.sort` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.sort
  _export$1({ target: 'Array', proto: true, forced: FORCED$3 }, {
    sort: function sort(comparefn) {
      return comparefn === undefined
        ? nativeSort.call(toObject$1(this))
        : nativeSort.call(toObject$1(this), aFunction$1$1(comparefn));
    }
  });

  var SPECIES$3 = wellKnownSymbol$1('species');

  var setSpecies = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn$1(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty$1.f;

    if (descriptors$1 && Constructor && !Constructor[SPECIES$3]) {
      defineProperty(Constructor, SPECIES$3, {
        configurable: true,
        get: function () { return this; }
      });
    }
  };

  // `Array[@@species]` getter
  // https://tc39.github.io/ecma262/#sec-get-array-@@species
  setSpecies('Array');

  // this method was added to unscopables after implementation
  // in popular engines, so it's moved to a separate module


  addToUnscopables('flat');

  // this method was added to unscopables after implementation
  // in popular engines, so it's moved to a separate module


  addToUnscopables('flatMap');

  var ITERATOR$3 = wellKnownSymbol$1('iterator');
  var BUGGY_SAFARI_ITERATORS = false;

  var returnThis = function () { return this; };

  // `%IteratorPrototype%` object
  // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
    }
  }

  if (IteratorPrototype == undefined) IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  if ( !has$2(IteratorPrototype, ITERATOR$3)) {
    createNonEnumerableProperty$1(IteratorPrototype, ITERATOR$3, returnThis);
  }

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  };

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





  var returnThis$1 = function () { return this; };

  var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor$1(1, next) });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
    iterators[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$4 = wellKnownSymbol$1('iterator');
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';

  var returnThis$2 = function () { return this; };

  var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
        case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
        case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
      } return function () { return new IteratorConstructor(this); };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$4]
      || IterablePrototype['@@iterator']
      || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
      if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
        if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
          if (objectSetPrototypeOf) {
            objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
          } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
            createNonEnumerableProperty$1(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
      }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return nativeIterator.call(this); };
    }

    // define iterator
    if ( IterablePrototype[ITERATOR$4] !== defaultIterator) {
      createNonEnumerableProperty$1(IterablePrototype, ITERATOR$4, defaultIterator);
    }
    iterators[NAME] = defaultIterator;

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          redefine$1(IterablePrototype, KEY, methods[KEY]);
        }
      } else _export$1({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
    }

    return methods;
  };

  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$1 = internalState$1.set;
  var getInternalState$1 = internalState$1.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.github.io/ecma262/#sec-createarrayiterator
  var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
    setInternalState$1(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject$1(iterated), // target
      index: 0,                          // next index
      kind: kind                         // kind
    });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$1(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;
    if (!target || index >= target.length) {
      state.target = undefined;
      return { value: undefined, done: true };
    }
    if (kind == 'keys') return { value: index, done: false };
    if (kind == 'values') return { value: target[index], done: false };
    return { value: [index, target[index]], done: false };
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
  iterators.Arguments = iterators.Array;

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');

  var fromCharCode = String.fromCharCode;
  var nativeFromCodePoint = String.fromCodePoint;

  // length should be 1, old FF problem
  var INCORRECT_LENGTH = !!nativeFromCodePoint && nativeFromCodePoint.length != 1;

  // `String.fromCodePoint` method
  // https://tc39.github.io/ecma262/#sec-string.fromcodepoint
  _export$1({ target: 'String', stat: true, forced: INCORRECT_LENGTH }, {
    fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
      var elements = [];
      var length = arguments.length;
      var i = 0;
      var code;
      while (length > i) {
        code = +arguments[i++];
        if (toAbsoluteIndex$1(code, 0x10FFFF) !== code) throw RangeError(code + ' is not a valid code point');
        elements.push(code < 0x10000
          ? fromCharCode(code)
          : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00)
        );
      } return elements.join('');
    }
  });

  // `String.raw` method
  // https://tc39.github.io/ecma262/#sec-string.raw
  _export$1({ target: 'String', stat: true }, {
    raw: function raw(template) {
      var rawTemplate = toIndexedObject$1(template.raw);
      var literalSegments = toLength$1(rawTemplate.length);
      var argumentsLength = arguments.length;
      var elements = [];
      var i = 0;
      while (literalSegments > i) {
        elements.push(String(rawTemplate[i++]));
        if (i < argumentsLength) elements.push(String(arguments[i]));
      } return elements.join('');
    }
  });

  // `String.prototype.{ codePointAt, at }` methods implementation
  var createMethod$4 = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = String(requireObjectCoercible$1($this));
      var position = toInteger$1(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = S.charCodeAt(position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size
        || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
          ? CONVERT_TO_STRING ? S.charAt(position) : first
          : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$4(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$4(true)
  };

  var codeAt = stringMultibyte.codeAt;

  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  _export$1({ target: 'String', proto: true }, {
    codePointAt: function codePointAt(pos) {
      return codeAt(this, pos);
    }
  });

  var MATCH = wellKnownSymbol$1('match');

  // `IsRegExp` abstract operation
  // https://tc39.github.io/ecma262/#sec-isregexp
  var isRegexp = function (it) {
    var isRegExp;
    return isObject$1(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw$1(it) == 'RegExp');
  };

  var notARegexp = function (it) {
    if (isRegexp(it)) {
      throw TypeError("The method doesn't accept regular expressions");
    } return it;
  };

  var MATCH$1 = wellKnownSymbol$1('match');

  var correctIsRegexpLogic = function (METHOD_NAME) {
    var regexp = /./;
    try {
      '/./'[METHOD_NAME](regexp);
    } catch (e) {
      try {
        regexp[MATCH$1] = false;
        return '/./'[METHOD_NAME](regexp);
      } catch (f) { /* empty */ }
    } return false;
  };

  var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor$1.f;






  var nativeEndsWith = ''.endsWith;
  var min$5 = Math.min;

  var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('endsWith');
  // https://github.com/zloirock/core-js/pull/702
  var MDN_POLYFILL_BUG =  !CORRECT_IS_REGEXP_LOGIC && !!function () {
    var descriptor = getOwnPropertyDescriptor$4(String.prototype, 'endsWith');
    return descriptor && !descriptor.writable;
  }();

  // `String.prototype.endsWith` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.endswith
  _export$1({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
    endsWith: function endsWith(searchString /* , endPosition = @length */) {
      var that = String(requireObjectCoercible$1(this));
      notARegexp(searchString);
      var endPosition = arguments.length > 1 ? arguments[1] : undefined;
      var len = toLength$1(that.length);
      var end = endPosition === undefined ? len : min$5(toLength$1(endPosition), len);
      var search = String(searchString);
      return nativeEndsWith
        ? nativeEndsWith.call(that, search, end)
        : that.slice(end - search.length, end) === search;
    }
  });

  // `String.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.includes
  _export$1({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
    includes: function includes(searchString /* , position = 0 */) {
      return !!~String(requireObjectCoercible$1(this))
        .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // `RegExp.prototype.flags` getter implementation
  // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
  var regexpFlags = function () {
    var that = anObject$1(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.dotAll) result += 's';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
  // so we use an intermediate function.
  function RE(s, f) {
    return RegExp(s, f);
  }

  var UNSUPPORTED_Y = fails$1(function () {
    // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
    var re = RE('a', 'y');
    re.lastIndex = 2;
    return re.exec('abcd') != null;
  });

  var BROKEN_CARET = fails$1(function () {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
    var re = RE('^r', 'gy');
    re.lastIndex = 2;
    return re.exec('str') != null;
  });

  var regexpStickyHelpers = {
  	UNSUPPORTED_Y: UNSUPPORTED_Y,
  	BROKEN_CARET: BROKEN_CARET
  };

  var nativeExec = RegExp.prototype.exec;
  // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.
  var nativeReplace = String.prototype.replace;

  var patchedExec = nativeExec;

  var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/;
    var re2 = /b*/g;
    nativeExec.call(re1, 'a');
    nativeExec.call(re2, 'a');
    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
  })();

  var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this;
      var lastIndex, reCopy, match, i;
      var sticky = UNSUPPORTED_Y$1 && re.sticky;
      var flags = regexpFlags.call(re);
      var source = re.source;
      var charsAdded = 0;
      var strCopy = str;

      if (sticky) {
        flags = flags.replace('y', '');
        if (flags.indexOf('g') === -1) {
          flags += 'g';
        }

        strCopy = String(str).slice(re.lastIndex);
        // Support anchored sticky behavior.
        if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
          source = '(?: ' + source + ')';
          strCopy = ' ' + strCopy;
          charsAdded++;
        }
        // ^(? + rx + ) is needed, in combination with some str slicing, to
        // simulate the 'y' flag.
        reCopy = new RegExp('^(?:' + source + ')', flags);
      }

      if (NPCG_INCLUDED) {
        reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

      match = nativeExec.call(sticky ? reCopy : re, strCopy);

      if (sticky) {
        if (match) {
          match.input = match.input.slice(charsAdded);
          match[0] = match[0].slice(charsAdded);
          match.index = re.lastIndex;
          re.lastIndex += match[0].length;
        } else re.lastIndex = 0;
      } else if (UPDATES_LAST_INDEX_WRONG && match) {
        re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  var regexpExec = patchedExec;

  _export$1({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
    exec: regexpExec
  });

  // TODO: Remove from `core-js@4` since it's moved to entry points







  var SPECIES$4 = wellKnownSymbol$1('species');

  var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$1(function () {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;
    re.exec = function () {
      var result = [];
      result.groups = { a: '7' };
      return result;
    };
    return ''.replace(re, '$<a>') !== '7';
  });

  // IE <= 11 replaces $0 with the whole match, as if it was $&
  // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
  var REPLACE_KEEPS_$0 = (function () {
    return 'a'.replace(/./, '$0') === '$0';
  })();

  var REPLACE = wellKnownSymbol$1('replace');
  // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
    if (/./[REPLACE]) {
      return /./[REPLACE]('a', '$0') === '';
    }
    return false;
  })();

  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  // Weex JS has frozen built-in prototypes, so use try / catch wrapper
  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$1(function () {
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function () { return originalExec.apply(this, arguments); };
    var result = 'ab'.split(re);
    return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
  });

  var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
    var SYMBOL = wellKnownSymbol$1(KEY);

    var DELEGATES_TO_SYMBOL = !fails$1(function () {
      // String methods call symbol-named RegEp methods
      var O = {};
      O[SYMBOL] = function () { return 7; };
      return ''[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$1(function () {
      // Symbol-named RegExp methods call .exec
      var execCalled = false;
      var re = /a/;

      if (KEY === 'split') {
        // We can't use real regex here since it causes deoptimization
        // and serious performance degradation in V8
        // https://github.com/zloirock/core-js/issues/306
        re = {};
        // RegExp[@@split] doesn't call the regex's exec method, but first creates
        // a new one. We need to return the patched regex when creating the new one.
        re.constructor = {};
        re.constructor[SPECIES$4] = function () { return re; };
        re.flags = '';
        re[SYMBOL] = /./[SYMBOL];
      }

      re.exec = function () { execCalled = true; return null; };

      re[SYMBOL]('');
      return !execCalled;
    });

    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      (KEY === 'replace' && !(
        REPLACE_SUPPORTS_NAMED_GROUPS &&
        REPLACE_KEEPS_$0 &&
        !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
      )) ||
      (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
      var nativeRegExpMethod = /./[SYMBOL];
      var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }, {
        REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
        REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
      });
      var stringMethod = methods[0];
      var regexMethod = methods[1];

      redefine$1(String.prototype, KEY, stringMethod);
      redefine$1(RegExp.prototype, SYMBOL, length == 2
        // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
        // 21.2.5.11 RegExp.prototype[@@split](string, limit)
        ? function (string, arg) { return regexMethod.call(string, this, arg); }
        // 21.2.5.6 RegExp.prototype[@@match](string)
        // 21.2.5.9 RegExp.prototype[@@search](string)
        : function (string) { return regexMethod.call(string, this); }
      );
    }

    if (sham) createNonEnumerableProperty$1(RegExp.prototype[SYMBOL], 'sham', true);
  };

  var charAt = stringMultibyte.charAt;

  // `AdvanceStringIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-advancestringindex
  var advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? charAt(S, index).length : 1);
  };

  // `RegExpExec` abstract operation
  // https://tc39.github.io/ecma262/#sec-regexpexec
  var regexpExecAbstract = function (R, S) {
    var exec = R.exec;
    if (typeof exec === 'function') {
      var result = exec.call(R, S);
      if (typeof result !== 'object') {
        throw TypeError('RegExp exec method returned something other than an Object or null');
      }
      return result;
    }

    if (classofRaw$1(R) !== 'RegExp') {
      throw TypeError('RegExp#exec called on incompatible receiver');
    }

    return regexpExec.call(R, S);
  };

  // @@match logic
  fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
    return [
      // `String.prototype.match` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.match
      function match(regexp) {
        var O = requireObjectCoercible$1(this);
        var matcher = regexp == undefined ? undefined : regexp[MATCH];
        return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
      },
      // `RegExp.prototype[@@match]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
      function (regexp) {
        var res = maybeCallNative(nativeMatch, regexp, this);
        if (res.done) return res.value;

        var rx = anObject$1(regexp);
        var S = String(this);

        if (!rx.global) return regexpExecAbstract(rx, S);

        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
        var A = [];
        var n = 0;
        var result;
        while ((result = regexpExecAbstract(rx, S)) !== null) {
          var matchStr = String(result[0]);
          A[n] = matchStr;
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength$1(rx.lastIndex), fullUnicode);
          n++;
        }
        return n === 0 ? null : A;
      }
    ];
  });

  var SPECIES$5 = wellKnownSymbol$1('species');

  // `SpeciesConstructor` abstract operation
  // https://tc39.github.io/ecma262/#sec-speciesconstructor
  var speciesConstructor = function (O, defaultConstructor) {
    var C = anObject$1(O).constructor;
    var S;
    return C === undefined || (S = anObject$1(C)[SPECIES$5]) == undefined ? defaultConstructor : aFunction$1$1(S);
  };

  var MATCH_ALL = wellKnownSymbol$1('matchAll');
  var REGEXP_STRING = 'RegExp String';
  var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
  var setInternalState$2 = internalState$1.set;
  var getInternalState$2 = internalState$1.getterFor(REGEXP_STRING_ITERATOR);
  var RegExpPrototype = RegExp.prototype;
  var regExpBuiltinExec = RegExpPrototype.exec;
  var nativeMatchAll = ''.matchAll;

  var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails$1(function () {
    'a'.matchAll(/./);
  });

  var regExpExec = function (R, S) {
    var exec = R.exec;
    var result;
    if (typeof exec == 'function') {
      result = exec.call(R, S);
      if (typeof result != 'object') throw TypeError('Incorrect exec result');
      return result;
    } return regExpBuiltinExec.call(R, S);
  };

  // eslint-disable-next-line max-len
  var $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator(regexp, string, global, fullUnicode) {
    setInternalState$2(this, {
      type: REGEXP_STRING_ITERATOR,
      regexp: regexp,
      string: string,
      global: global,
      unicode: fullUnicode,
      done: false
    });
  }, REGEXP_STRING, function next() {
    var state = getInternalState$2(this);
    if (state.done) return { value: undefined, done: true };
    var R = state.regexp;
    var S = state.string;
    var match = regExpExec(R, S);
    if (match === null) return { value: undefined, done: state.done = true };
    if (state.global) {
      if (String(match[0]) == '') R.lastIndex = advanceStringIndex(S, toLength$1(R.lastIndex), state.unicode);
      return { value: match, done: false };
    }
    state.done = true;
    return { value: match, done: false };
  });

  var $matchAll = function (string) {
    var R = anObject$1(this);
    var S = String(string);
    var C, flagsValue, flags, matcher, global, fullUnicode;
    C = speciesConstructor(R, RegExp);
    flagsValue = R.flags;
    if (flagsValue === undefined && R instanceof RegExp && !('flags' in RegExpPrototype)) {
      flagsValue = regexpFlags.call(R);
    }
    flags = flagsValue === undefined ? '' : String(flagsValue);
    matcher = new C(C === RegExp ? R.source : R, flags);
    global = !!~flags.indexOf('g');
    fullUnicode = !!~flags.indexOf('u');
    matcher.lastIndex = toLength$1(R.lastIndex);
    return new $RegExpStringIterator(matcher, S, global, fullUnicode);
  };

  // `String.prototype.matchAll` method
  // https://github.com/tc39/proposal-string-matchall
  _export$1({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
    matchAll: function matchAll(regexp) {
      var O = requireObjectCoercible$1(this);
      var flags, S, matcher, rx;
      if (regexp != null) {
        if (isRegexp(regexp)) {
          flags = String(requireObjectCoercible$1('flags' in RegExpPrototype
            ? regexp.flags
            : regexpFlags.call(regexp)
          ));
          if (!~flags.indexOf('g')) throw TypeError('`.matchAll` does not allow non-global regexes');
        }
        if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
        matcher = regexp[MATCH_ALL];
        if (matcher === undefined && isPure && classofRaw$1(regexp) == 'RegExp') matcher = $matchAll;
        if (matcher != null) return aFunction$1$1(matcher).call(regexp, O);
      } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
      S = String(O);
      rx = new RegExp(regexp, 'g');
      return  rx[MATCH_ALL](S);
    }
  });

   MATCH_ALL in RegExpPrototype || createNonEnumerableProperty$1(RegExpPrototype, MATCH_ALL, $matchAll);

  // `String.prototype.repeat` method implementation
  // https://tc39.github.io/ecma262/#sec-string.prototype.repeat
  var stringRepeat = ''.repeat || function repeat(count) {
    var str = String(requireObjectCoercible$1(this));
    var result = '';
    var n = toInteger$1(count);
    if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
    for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
    return result;
  };

  // https://github.com/tc39/proposal-string-pad-start-end




  var ceil$1$1 = Math.ceil;

  // `String.prototype.{ padStart, padEnd }` methods implementation
  var createMethod$5 = function (IS_END) {
    return function ($this, maxLength, fillString) {
      var S = String(requireObjectCoercible$1($this));
      var stringLength = S.length;
      var fillStr = fillString === undefined ? ' ' : String(fillString);
      var intMaxLength = toLength$1(maxLength);
      var fillLen, stringFiller;
      if (intMaxLength <= stringLength || fillStr == '') return S;
      fillLen = intMaxLength - stringLength;
      stringFiller = stringRepeat.call(fillStr, ceil$1$1(fillLen / fillStr.length));
      if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
      return IS_END ? S + stringFiller : stringFiller + S;
    };
  };

  var stringPad = {
    // `String.prototype.padStart` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
    start: createMethod$5(false),
    // `String.prototype.padEnd` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.padend
    end: createMethod$5(true)
  };

  // https://github.com/zloirock/core-js/issues/280


  // eslint-disable-next-line unicorn/no-unsafe-regex
  var stringPadWebkitBug = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(engineUserAgent$1);

  var $padEnd = stringPad.end;


  // `String.prototype.padEnd` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.padend
  _export$1({ target: 'String', proto: true, forced: stringPadWebkitBug }, {
    padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
      return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var $padStart = stringPad.start;


  // `String.prototype.padStart` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
  _export$1({ target: 'String', proto: true, forced: stringPadWebkitBug }, {
    padStart: function padStart(maxLength /* , fillString = ' ' */) {
      return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // `String.prototype.repeat` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.repeat
  _export$1({ target: 'String', proto: true }, {
    repeat: stringRepeat
  });

  var max$3 = Math.max;
  var min$6 = Math.min;
  var floor$1$1 = Math.floor;
  var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
  var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

  var maybeToString = function (it) {
    return it === undefined ? it : String(it);
  };

  // @@replace logic
  fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
    var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
    var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
    var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

    return [
      // `String.prototype.replace` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = requireObjectCoercible$1(this);
        var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
        return replacer !== undefined
          ? replacer.call(searchValue, O, replaceValue)
          : nativeReplace.call(String(O), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
      function (regexp, replaceValue) {
        if (
          (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
          (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
        ) {
          var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
          if (res.done) return res.value;
        }

        var rx = anObject$1(regexp);
        var S = String(this);

        var functionalReplace = typeof replaceValue === 'function';
        if (!functionalReplace) replaceValue = String(replaceValue);

        var global = rx.global;
        if (global) {
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
        }
        var results = [];
        while (true) {
          var result = regexpExecAbstract(rx, S);
          if (result === null) break;

          results.push(result);
          if (!global) break;

          var matchStr = String(result[0]);
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength$1(rx.lastIndex), fullUnicode);
        }

        var accumulatedResult = '';
        var nextSourcePosition = 0;
        for (var i = 0; i < results.length; i++) {
          result = results[i];

          var matched = String(result[0]);
          var position = max$3(min$6(toInteger$1(result.index), S.length), 0);
          var captures = [];
          // NOTE: This is equivalent to
          //   captures = result.slice(1).map(maybeToString)
          // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
          // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
          // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
          for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
          var namedCaptures = result.groups;
          if (functionalReplace) {
            var replacerArgs = [matched].concat(captures, position, S);
            if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
            var replacement = String(replaceValue.apply(undefined, replacerArgs));
          } else {
            replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
          }
          if (position >= nextSourcePosition) {
            accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }
        return accumulatedResult + S.slice(nextSourcePosition);
      }
    ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
    function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
      var tailPos = position + matched.length;
      var m = captures.length;
      var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
      if (namedCaptures !== undefined) {
        namedCaptures = toObject$1(namedCaptures);
        symbols = SUBSTITUTION_SYMBOLS;
      }
      return nativeReplace.call(replacement, symbols, function (match, ch) {
        var capture;
        switch (ch.charAt(0)) {
          case '$': return '$';
          case '&': return matched;
          case '`': return str.slice(0, position);
          case "'": return str.slice(tailPos);
          case '<':
            capture = namedCaptures[ch.slice(1, -1)];
            break;
          default: // \d\d?
            var n = +ch;
            if (n === 0) return match;
            if (n > m) {
              var f = floor$1$1(n / 10);
              if (f === 0) return match;
              if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
              return match;
            }
            capture = captures[n - 1];
        }
        return capture === undefined ? '' : capture;
      });
    }
  });

  // @@search logic
  fixRegexpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
    return [
      // `String.prototype.search` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.search
      function search(regexp) {
        var O = requireObjectCoercible$1(this);
        var searcher = regexp == undefined ? undefined : regexp[SEARCH];
        return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
      },
      // `RegExp.prototype[@@search]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
      function (regexp) {
        var res = maybeCallNative(nativeSearch, regexp, this);
        if (res.done) return res.value;

        var rx = anObject$1(regexp);
        var S = String(this);

        var previousLastIndex = rx.lastIndex;
        if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
        var result = regexpExecAbstract(rx, S);
        if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
        return result === null ? -1 : result.index;
      }
    ];
  });

  var arrayPush = [].push;
  var min$7 = Math.min;
  var MAX_UINT32 = 0xFFFFFFFF;

  // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
  var SUPPORTS_Y = !fails$1(function () { return !RegExp(MAX_UINT32, 'y'); });

  // @@split logic
  fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
    var internalSplit;
    if (
      'abbc'.split(/(b)*/)[1] == 'c' ||
      'test'.split(/(?:)/, -1).length != 4 ||
      'ab'.split(/(?:ab)*/).length != 2 ||
      '.'.split(/(.?)(.?)/).length != 4 ||
      '.'.split(/()()/).length > 1 ||
      ''.split(/.?/).length
    ) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function (separator, limit) {
        var string = String(requireObjectCoercible$1(this));
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (separator === undefined) return [string];
        // If `separator` is not a regex, use native split
        if (!isRegexp(separator)) {
          return nativeSplit.call(string, separator, lim);
        }
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') +
                    (separator.multiline ? 'm' : '') +
                    (separator.unicode ? 'u' : '') +
                    (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        // Make `global` and avoid `lastIndex` issues by working with a copy
        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;
        while (match = regexpExec.call(separatorCopy, string)) {
          lastIndex = separatorCopy.lastIndex;
          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= lim) break;
          }
          if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
        }
        if (lastLastIndex === string.length) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));
        return output.length > lim ? output.slice(0, lim) : output;
      };
    // Chakra, V8
    } else if ('0'.split(undefined, 0).length) {
      internalSplit = function (separator, limit) {
        return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
      };
    } else internalSplit = nativeSplit;

    return [
      // `String.prototype.split` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O = requireObjectCoercible$1(this);
        var splitter = separator == undefined ? undefined : separator[SPLIT];
        return splitter !== undefined
          ? splitter.call(separator, O, limit)
          : internalSplit.call(String(O), separator, limit);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function (regexp, limit) {
        var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
        if (res.done) return res.value;

        var rx = anObject$1(regexp);
        var S = String(this);
        var C = speciesConstructor(rx, RegExp);

        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (SUPPORTS_Y ? 'y' : 'g');

        // ^(? + rx + ) is needed, in combination with some S slicing, to
        // simulate the 'y' flag.
        var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
        var p = 0;
        var q = 0;
        var A = [];
        while (q < S.length) {
          splitter.lastIndex = SUPPORTS_Y ? q : 0;
          var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
          var e;
          if (
            z === null ||
            (e = min$7(toLength$1(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
          ) {
            q = advanceStringIndex(S, q, unicodeMatching);
          } else {
            A.push(S.slice(p, q));
            if (A.length === lim) return A;
            for (var i = 1; i <= z.length - 1; i++) {
              A.push(z[i]);
              if (A.length === lim) return A;
            }
            q = p = e;
          }
        }
        A.push(S.slice(p));
        return A;
      }
    ];
  }, !SUPPORTS_Y);

  var getOwnPropertyDescriptor$5 = objectGetOwnPropertyDescriptor$1.f;






  var nativeStartsWith = ''.startsWith;
  var min$8 = Math.min;

  var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegexpLogic('startsWith');
  // https://github.com/zloirock/core-js/pull/702
  var MDN_POLYFILL_BUG$1 =  !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
    var descriptor = getOwnPropertyDescriptor$5(String.prototype, 'startsWith');
    return descriptor && !descriptor.writable;
  }();

  // `String.prototype.startsWith` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.startswith
  _export$1({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1 }, {
    startsWith: function startsWith(searchString /* , position = 0 */) {
      var that = String(requireObjectCoercible$1(this));
      notARegexp(searchString);
      var index = toLength$1(min$8(arguments.length > 1 ? arguments[1] : undefined, that.length));
      var search = String(searchString);
      return nativeStartsWith
        ? nativeStartsWith.call(that, search, index)
        : that.slice(index, index + search.length) === search;
    }
  });

  // a string of all valid unicode whitespaces
  // eslint-disable-next-line max-len
  var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

  var whitespace = '[' + whitespaces + ']';
  var ltrim = RegExp('^' + whitespace + whitespace + '*');
  var rtrim = RegExp(whitespace + whitespace + '*$');

  // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
  var createMethod$6 = function (TYPE) {
    return function ($this) {
      var string = String(requireObjectCoercible$1($this));
      if (TYPE & 1) string = string.replace(ltrim, '');
      if (TYPE & 2) string = string.replace(rtrim, '');
      return string;
    };
  };

  var stringTrim = {
    // `String.prototype.{ trimLeft, trimStart }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
    start: createMethod$6(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
    end: createMethod$6(2),
    // `String.prototype.trim` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.trim
    trim: createMethod$6(3)
  };

  var non = '\u200B\u0085\u180E';

  // check that a method works with the correct list
  // of whitespaces and has a correct name
  var stringTrimForced = function (METHOD_NAME) {
    return fails$1(function () {
      return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
    });
  };

  var $trim = stringTrim.trim;


  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  _export$1({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
    trim: function trim() {
      return $trim(this);
    }
  });

  var $trimStart = stringTrim.start;


  var FORCED$4 = stringTrimForced('trimStart');

  var trimStart = FORCED$4 ? function trimStart() {
    return $trimStart(this);
  } : ''.trimStart;

  // `String.prototype.{ trimStart, trimLeft }` methods
  // https://github.com/tc39/ecmascript-string-left-right-trim
  _export$1({ target: 'String', proto: true, forced: FORCED$4 }, {
    trimStart: trimStart,
    trimLeft: trimStart
  });

  var $trimEnd = stringTrim.end;


  var FORCED$5 = stringTrimForced('trimEnd');

  var trimEnd = FORCED$5 ? function trimEnd() {
    return $trimEnd(this);
  } : ''.trimEnd;

  // `String.prototype.{ trimEnd, trimRight }` methods
  // https://github.com/tc39/ecmascript-string-left-right-trim
  _export$1({ target: 'String', proto: true, forced: FORCED$5 }, {
    trimEnd: trimEnd,
    trimRight: trimEnd
  });

  var charAt$1 = stringMultibyte.charAt;



  var STRING_ITERATOR = 'String Iterator';
  var setInternalState$3 = internalState$1.set;
  var getInternalState$3 = internalState$1.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
  defineIterator(String, 'String', function (iterated) {
    setInternalState$3(this, {
      type: STRING_ITERATOR,
      string: String(iterated),
      index: 0
    });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState$3(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return { value: undefined, done: true };
    point = charAt$1(string, index);
    state.index += point.length;
    return { value: point, done: false };
  });

  var quot = /"/g;

  // B.2.3.2.1 CreateHTML(string, tag, attribute, value)
  // https://tc39.github.io/ecma262/#sec-createhtml
  var createHtml = function (string, tag, attribute, value) {
    var S = String(requireObjectCoercible$1(string));
    var p1 = '<' + tag;
    if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
    return p1 + '>' + S + '</' + tag + '>';
  };

  // check the existence of a method, lowercase
  // of a tag and escaping quotes in arguments
  var stringHtmlForced = function (METHOD_NAME) {
    return fails$1(function () {
      var test = ''[METHOD_NAME]('"');
      return test !== test.toLowerCase() || test.split('"').length > 3;
    });
  };

  // `String.prototype.anchor` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.anchor
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('anchor') }, {
    anchor: function anchor(name) {
      return createHtml(this, 'a', 'name', name);
    }
  });

  // `String.prototype.big` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.big
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('big') }, {
    big: function big() {
      return createHtml(this, 'big', '', '');
    }
  });

  // `String.prototype.blink` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.blink
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('blink') }, {
    blink: function blink() {
      return createHtml(this, 'blink', '', '');
    }
  });

  // `String.prototype.bold` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.bold
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('bold') }, {
    bold: function bold() {
      return createHtml(this, 'b', '', '');
    }
  });

  // `String.prototype.fixed` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.fixed
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('fixed') }, {
    fixed: function fixed() {
      return createHtml(this, 'tt', '', '');
    }
  });

  // `String.prototype.fontcolor` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.fontcolor
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('fontcolor') }, {
    fontcolor: function fontcolor(color) {
      return createHtml(this, 'font', 'color', color);
    }
  });

  // `String.prototype.fontsize` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.fontsize
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('fontsize') }, {
    fontsize: function fontsize(size) {
      return createHtml(this, 'font', 'size', size);
    }
  });

  // `String.prototype.italics` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.italics
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('italics') }, {
    italics: function italics() {
      return createHtml(this, 'i', '', '');
    }
  });

  // `String.prototype.link` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.link
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('link') }, {
    link: function link(url) {
      return createHtml(this, 'a', 'href', url);
    }
  });

  // `String.prototype.small` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.small
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('small') }, {
    small: function small() {
      return createHtml(this, 'small', '', '');
    }
  });

  // `String.prototype.strike` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.strike
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('strike') }, {
    strike: function strike() {
      return createHtml(this, 'strike', '', '');
    }
  });

  // `String.prototype.sub` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.sub
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('sub') }, {
    sub: function sub() {
      return createHtml(this, 'sub', '', '');
    }
  });

  // `String.prototype.sup` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.sup
  _export$1({ target: 'String', proto: true, forced: stringHtmlForced('sup') }, {
    sup: function sup() {
      return createHtml(this, 'sup', '', '');
    }
  });

  // makes subclassing work correct for wrapped built-ins
  var inheritIfRequired = function ($this, dummy, Wrapper) {
    var NewTarget, NewTargetPrototype;
    if (
      // it can work only with native `setPrototypeOf`
      objectSetPrototypeOf &&
      // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
      typeof (NewTarget = dummy.constructor) == 'function' &&
      NewTarget !== Wrapper &&
      isObject$1(NewTargetPrototype = NewTarget.prototype) &&
      NewTargetPrototype !== Wrapper.prototype
    ) objectSetPrototypeOf($this, NewTargetPrototype);
    return $this;
  };

  var defineProperty$6 = objectDefineProperty$1.f;
  var getOwnPropertyNames = objectGetOwnPropertyNames$1.f;





  var setInternalState$4 = internalState$1.set;



  var MATCH$2 = wellKnownSymbol$1('match');
  var NativeRegExp = global_1$1.RegExp;
  var RegExpPrototype$1 = NativeRegExp.prototype;
  var re1 = /a/g;
  var re2 = /a/g;

  // "new" should create a new object, old webkit bug
  var CORRECT_NEW = new NativeRegExp(re1) !== re1;

  var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;

  var FORCED$6 = descriptors$1 && isForced_1$1('RegExp', (!CORRECT_NEW || UNSUPPORTED_Y$2 || fails$1(function () {
    re2[MATCH$2] = false;
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
  })));

  // `RegExp` constructor
  // https://tc39.github.io/ecma262/#sec-regexp-constructor
  if (FORCED$6) {
    var RegExpWrapper = function RegExp(pattern, flags) {
      var thisIsRegExp = this instanceof RegExpWrapper;
      var patternIsRegExp = isRegexp(pattern);
      var flagsAreUndefined = flags === undefined;
      var sticky;

      if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
        return pattern;
      }

      if (CORRECT_NEW) {
        if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
      } else if (pattern instanceof RegExpWrapper) {
        if (flagsAreUndefined) flags = regexpFlags.call(pattern);
        pattern = pattern.source;
      }

      if (UNSUPPORTED_Y$2) {
        sticky = !!flags && flags.indexOf('y') > -1;
        if (sticky) flags = flags.replace(/y/g, '');
      }

      var result = inheritIfRequired(
        CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
        thisIsRegExp ? this : RegExpPrototype$1,
        RegExpWrapper
      );

      if (UNSUPPORTED_Y$2 && sticky) setInternalState$4(result, { sticky: sticky });

      return result;
    };
    var proxy = function (key) {
      key in RegExpWrapper || defineProperty$6(RegExpWrapper, key, {
        configurable: true,
        get: function () { return NativeRegExp[key]; },
        set: function (it) { NativeRegExp[key] = it; }
      });
    };
    var keys$1$1 = getOwnPropertyNames(NativeRegExp);
    var index = 0;
    while (keys$1$1.length > index) proxy(keys$1$1[index++]);
    RegExpPrototype$1.constructor = RegExpWrapper;
    RegExpWrapper.prototype = RegExpPrototype$1;
    redefine$1(global_1$1, 'RegExp', RegExpWrapper);
  }

  // https://tc39.github.io/ecma262/#sec-get-regexp-@@species
  setSpecies('RegExp');

  var UNSUPPORTED_Y$3 = regexpStickyHelpers.UNSUPPORTED_Y;

  // `RegExp.prototype.flags` getter
  // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
  if (descriptors$1 && (/./g.flags != 'g' || UNSUPPORTED_Y$3)) {
    objectDefineProperty$1.f(RegExp.prototype, 'flags', {
      configurable: true,
      get: regexpFlags
    });
  }

  var UNSUPPORTED_Y$4 = regexpStickyHelpers.UNSUPPORTED_Y;
  var defineProperty$7 = objectDefineProperty$1.f;
  var getInternalState$4 = internalState$1.get;
  var RegExpPrototype$2 = RegExp.prototype;

  // `RegExp.prototype.sticky` getter
  if (descriptors$1 && UNSUPPORTED_Y$4) {
    defineProperty$7(RegExp.prototype, 'sticky', {
      configurable: true,
      get: function () {
        if (this === RegExpPrototype$2) return undefined;
        // We can't use InternalStateModule.getterFor because
        // we don't add metadata for regexps created by a literal.
        if (this instanceof RegExp) {
          return !!getInternalState$4(this).sticky;
        }
        throw TypeError('Incompatible receiver, RegExp required');
      }
    });
  }

  // TODO: Remove from `core-js@4` since it's moved to entry points




  var DELEGATES_TO_EXEC = function () {
    var execCalled = false;
    var re = /[ac]/;
    re.exec = function () {
      execCalled = true;
      return /./.exec.apply(this, arguments);
    };
    return re.test('abc') === true && execCalled;
  }();

  var nativeTest = /./.test;

  _export$1({ target: 'RegExp', proto: true, forced: !DELEGATES_TO_EXEC }, {
    test: function (str) {
      if (typeof this.exec !== 'function') {
        return nativeTest.call(this, str);
      }
      var result = this.exec(str);
      if (result !== null && !isObject$1(result)) {
        throw new Error('RegExp exec method returned something other than an Object or null');
      }
      return !!result;
    }
  });

  var TO_STRING = 'toString';
  var RegExpPrototype$3 = RegExp.prototype;
  var nativeToString = RegExpPrototype$3[TO_STRING];

  var NOT_GENERIC = fails$1(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
  // FF44- RegExp#toString has a wrong name
  var INCORRECT_NAME = nativeToString.name != TO_STRING;

  // `RegExp.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
  if (NOT_GENERIC || INCORRECT_NAME) {
    redefine$1(RegExp.prototype, TO_STRING, function toString() {
      var R = anObject$1(this);
      var p = String(R.source);
      var rf = R.flags;
      var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$3) ? regexpFlags.call(R) : rf);
      return '/' + p + '/' + f;
    }, { unsafe: true });
  }

  var trim = stringTrim.trim;


  var $parseInt = global_1$1.parseInt;
  var hex = /^[+-]?0[Xx]/;
  var FORCED$7 = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22;

  // `parseInt` method
  // https://tc39.github.io/ecma262/#sec-parseint-string-radix
  var numberParseInt = FORCED$7 ? function parseInt(string, radix) {
    var S = trim(String(string));
    return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
  } : $parseInt;

  // `parseInt` method
  // https://tc39.github.io/ecma262/#sec-parseint-string-radix
  _export$1({ global: true, forced: parseInt != numberParseInt }, {
    parseInt: numberParseInt
  });

  var trim$1 = stringTrim.trim;


  var $parseFloat = global_1$1.parseFloat;
  var FORCED$8 = 1 / $parseFloat(whitespaces + '-0') !== -Infinity;

  // `parseFloat` method
  // https://tc39.github.io/ecma262/#sec-parsefloat-string
  var numberParseFloat = FORCED$8 ? function parseFloat(string) {
    var trimmedString = trim$1(String(string));
    var result = $parseFloat(trimmedString);
    return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
  } : $parseFloat;

  // `parseFloat` method
  // https://tc39.github.io/ecma262/#sec-parsefloat-string
  _export$1({ global: true, forced: parseFloat != numberParseFloat }, {
    parseFloat: numberParseFloat
  });

  var getOwnPropertyNames$1 = objectGetOwnPropertyNames$1.f;
  var getOwnPropertyDescriptor$6 = objectGetOwnPropertyDescriptor$1.f;
  var defineProperty$8 = objectDefineProperty$1.f;
  var trim$2 = stringTrim.trim;

  var NUMBER = 'Number';
  var NativeNumber = global_1$1[NUMBER];
  var NumberPrototype = NativeNumber.prototype;

  // Opera ~12 has broken Object#toString
  var BROKEN_CLASSOF = classofRaw$1(objectCreate(NumberPrototype)) == NUMBER;

  // `ToNumber` abstract operation
  // https://tc39.github.io/ecma262/#sec-tonumber
  var toNumber = function (argument) {
    var it = toPrimitive$1(argument, false);
    var first, third, radix, maxCode, digits, length, index, code;
    if (typeof it == 'string' && it.length > 2) {
      it = trim$2(it);
      first = it.charCodeAt(0);
      if (first === 43 || first === 45) {
        third = it.charCodeAt(2);
        if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
      } else if (first === 48) {
        switch (it.charCodeAt(1)) {
          case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
          case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
          default: return +it;
        }
        digits = it.slice(2);
        length = digits.length;
        for (index = 0; index < length; index++) {
          code = digits.charCodeAt(index);
          // parseInt parses a string to a first unavailable symbol
          // but ToNumber should return NaN if a string contains unavailable symbols
          if (code < 48 || code > maxCode) return NaN;
        } return parseInt(digits, radix);
      }
    } return +it;
  };

  // `Number` constructor
  // https://tc39.github.io/ecma262/#sec-number-constructor
  if (isForced_1$1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
    var NumberWrapper = function Number(value) {
      var it = arguments.length < 1 ? 0 : value;
      var dummy = this;
      return dummy instanceof NumberWrapper
        // check on 1..constructor(foo) case
        && (BROKEN_CLASSOF ? fails$1(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw$1(dummy) != NUMBER)
          ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
    };
    for (var keys$2 = descriptors$1 ? getOwnPropertyNames$1(NativeNumber) : (
      // ES3:
      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
      // ES2015 (in case, if modules with ES2015 Number statics required before):
      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
      'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
    ).split(','), j = 0, key; keys$2.length > j; j++) {
      if (has$2(NativeNumber, key = keys$2[j]) && !has$2(NumberWrapper, key)) {
        defineProperty$8(NumberWrapper, key, getOwnPropertyDescriptor$6(NativeNumber, key));
      }
    }
    NumberWrapper.prototype = NumberPrototype;
    NumberPrototype.constructor = NumberWrapper;
    redefine$1(global_1$1, NUMBER, NumberWrapper);
  }

  // `Number.EPSILON` constant
  // https://tc39.github.io/ecma262/#sec-number.epsilon
  _export$1({ target: 'Number', stat: true }, {
    EPSILON: Math.pow(2, -52)
  });

  var globalIsFinite = global_1$1.isFinite;

  // `Number.isFinite` method
  // https://tc39.github.io/ecma262/#sec-number.isfinite
  var numberIsFinite = Number.isFinite || function isFinite(it) {
    return typeof it == 'number' && globalIsFinite(it);
  };

  // `Number.isFinite` method
  // https://tc39.github.io/ecma262/#sec-number.isfinite
  _export$1({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

  var floor$2 = Math.floor;

  // `Number.isInteger` method implementation
  // https://tc39.github.io/ecma262/#sec-number.isinteger
  var isInteger = function isInteger(it) {
    return !isObject$1(it) && isFinite(it) && floor$2(it) === it;
  };

  // `Number.isInteger` method
  // https://tc39.github.io/ecma262/#sec-number.isinteger
  _export$1({ target: 'Number', stat: true }, {
    isInteger: isInteger
  });

  // `Number.isNaN` method
  // https://tc39.github.io/ecma262/#sec-number.isnan
  _export$1({ target: 'Number', stat: true }, {
    isNaN: function isNaN(number) {
      // eslint-disable-next-line no-self-compare
      return number != number;
    }
  });

  var abs = Math.abs;

  // `Number.isSafeInteger` method
  // https://tc39.github.io/ecma262/#sec-number.issafeinteger
  _export$1({ target: 'Number', stat: true }, {
    isSafeInteger: function isSafeInteger(number) {
      return isInteger(number) && abs(number) <= 0x1FFFFFFFFFFFFF;
    }
  });

  // `Number.MAX_SAFE_INTEGER` constant
  // https://tc39.github.io/ecma262/#sec-number.max_safe_integer
  _export$1({ target: 'Number', stat: true }, {
    MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
  });

  // `Number.MIN_SAFE_INTEGER` constant
  // https://tc39.github.io/ecma262/#sec-number.min_safe_integer
  _export$1({ target: 'Number', stat: true }, {
    MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
  });

  // `Number.parseFloat` method
  // https://tc39.github.io/ecma262/#sec-number.parseFloat
  _export$1({ target: 'Number', stat: true, forced: Number.parseFloat != numberParseFloat }, {
    parseFloat: numberParseFloat
  });

  // `Number.parseInt` method
  // https://tc39.github.io/ecma262/#sec-number.parseint
  _export$1({ target: 'Number', stat: true, forced: Number.parseInt != numberParseInt }, {
    parseInt: numberParseInt
  });

  // `thisNumberValue` abstract operation
  // https://tc39.github.io/ecma262/#sec-thisnumbervalue
  var thisNumberValue = function (value) {
    if (typeof value != 'number' && classofRaw$1(value) != 'Number') {
      throw TypeError('Incorrect invocation');
    }
    return +value;
  };

  var nativeToFixed = 1.0.toFixed;
  var floor$3 = Math.floor;

  var pow = function (x, n, acc) {
    return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
  };

  var log = function (x) {
    var n = 0;
    var x2 = x;
    while (x2 >= 4096) {
      n += 12;
      x2 /= 4096;
    }
    while (x2 >= 2) {
      n += 1;
      x2 /= 2;
    } return n;
  };

  var FORCED$9 = nativeToFixed && (
    0.00008.toFixed(3) !== '0.000' ||
    0.9.toFixed(0) !== '1' ||
    1.255.toFixed(2) !== '1.25' ||
    1000000000000000128.0.toFixed(0) !== '1000000000000000128'
  ) || !fails$1(function () {
    // V8 ~ Android 4.3-
    nativeToFixed.call({});
  });

  // `Number.prototype.toFixed` method
  // https://tc39.github.io/ecma262/#sec-number.prototype.tofixed
  _export$1({ target: 'Number', proto: true, forced: FORCED$9 }, {
    // eslint-disable-next-line max-statements
    toFixed: function toFixed(fractionDigits) {
      var number = thisNumberValue(this);
      var fractDigits = toInteger$1(fractionDigits);
      var data = [0, 0, 0, 0, 0, 0];
      var sign = '';
      var result = '0';
      var e, z, j, k;

      var multiply = function (n, c) {
        var index = -1;
        var c2 = c;
        while (++index < 6) {
          c2 += n * data[index];
          data[index] = c2 % 1e7;
          c2 = floor$3(c2 / 1e7);
        }
      };

      var divide = function (n) {
        var index = 6;
        var c = 0;
        while (--index >= 0) {
          c += data[index];
          data[index] = floor$3(c / n);
          c = (c % n) * 1e7;
        }
      };

      var dataToString = function () {
        var index = 6;
        var s = '';
        while (--index >= 0) {
          if (s !== '' || index === 0 || data[index] !== 0) {
            var t = String(data[index]);
            s = s === '' ? t : s + stringRepeat.call('0', 7 - t.length) + t;
          }
        } return s;
      };

      if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
      // eslint-disable-next-line no-self-compare
      if (number != number) return 'NaN';
      if (number <= -1e21 || number >= 1e21) return String(number);
      if (number < 0) {
        sign = '-';
        number = -number;
      }
      if (number > 1e-21) {
        e = log(number * pow(2, 69, 1)) - 69;
        z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
        z *= 0x10000000000000;
        e = 52 - e;
        if (e > 0) {
          multiply(0, z);
          j = fractDigits;
          while (j >= 7) {
            multiply(1e7, 0);
            j -= 7;
          }
          multiply(pow(10, j, 1), 0);
          j = e - 1;
          while (j >= 23) {
            divide(1 << 23);
            j -= 23;
          }
          divide(1 << j);
          multiply(1, 1);
          divide(2);
          result = dataToString();
        } else {
          multiply(0, z);
          multiply(1 << -e, 0);
          result = dataToString() + stringRepeat.call('0', fractDigits);
        }
      }
      if (fractDigits > 0) {
        k = result.length;
        result = sign + (k <= fractDigits
          ? '0.' + stringRepeat.call('0', fractDigits - k) + result
          : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
      } else {
        result = sign + result;
      } return result;
    }
  });

  var nativeToPrecision = 1.0.toPrecision;

  var FORCED$a = fails$1(function () {
    // IE7-
    return nativeToPrecision.call(1, undefined) !== '1';
  }) || !fails$1(function () {
    // V8 ~ Android 4.3-
    nativeToPrecision.call({});
  });

  // `Number.prototype.toPrecision` method
  // https://tc39.github.io/ecma262/#sec-number.prototype.toprecision
  _export$1({ target: 'Number', proto: true, forced: FORCED$a }, {
    toPrecision: function toPrecision(precision) {
      return precision === undefined
        ? nativeToPrecision.call(thisNumberValue(this))
        : nativeToPrecision.call(thisNumberValue(this), precision);
    }
  });

  var log$1 = Math.log;

  // `Math.log1p` method implementation
  // https://tc39.github.io/ecma262/#sec-math.log1p
  var mathLog1p = Math.log1p || function log1p(x) {
    return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log$1(1 + x);
  };

  var nativeAcosh = Math.acosh;
  var log$2 = Math.log;
  var sqrt = Math.sqrt;
  var LN2 = Math.LN2;

  var FORCED$b = !nativeAcosh
    // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
    || Math.floor(nativeAcosh(Number.MAX_VALUE)) != 710
    // Tor Browser bug: Math.acosh(Infinity) -> NaN
    || nativeAcosh(Infinity) != Infinity;

  // `Math.acosh` method
  // https://tc39.github.io/ecma262/#sec-math.acosh
  _export$1({ target: 'Math', stat: true, forced: FORCED$b }, {
    acosh: function acosh(x) {
      return (x = +x) < 1 ? NaN : x > 94906265.62425156
        ? log$2(x) + LN2
        : mathLog1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
    }
  });

  var nativeAsinh = Math.asinh;
  var log$3 = Math.log;
  var sqrt$1 = Math.sqrt;

  function asinh(x) {
    return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log$3(x + sqrt$1(x * x + 1));
  }

  // `Math.asinh` method
  // https://tc39.github.io/ecma262/#sec-math.asinh
  // Tor Browser bug: Math.asinh(0) -> -0
  _export$1({ target: 'Math', stat: true, forced: !(nativeAsinh && 1 / nativeAsinh(0) > 0) }, {
    asinh: asinh
  });

  var nativeAtanh = Math.atanh;
  var log$4 = Math.log;

  // `Math.atanh` method
  // https://tc39.github.io/ecma262/#sec-math.atanh
  // Tor Browser bug: Math.atanh(-0) -> 0
  _export$1({ target: 'Math', stat: true, forced: !(nativeAtanh && 1 / nativeAtanh(-0) < 0) }, {
    atanh: function atanh(x) {
      return (x = +x) == 0 ? x : log$4((1 + x) / (1 - x)) / 2;
    }
  });

  // `Math.sign` method implementation
  // https://tc39.github.io/ecma262/#sec-math.sign
  var mathSign = Math.sign || function sign(x) {
    // eslint-disable-next-line no-self-compare
    return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
  };

  var abs$1 = Math.abs;
  var pow$1 = Math.pow;

  // `Math.cbrt` method
  // https://tc39.github.io/ecma262/#sec-math.cbrt
  _export$1({ target: 'Math', stat: true }, {
    cbrt: function cbrt(x) {
      return mathSign(x = +x) * pow$1(abs$1(x), 1 / 3);
    }
  });

  var floor$4 = Math.floor;
  var log$5 = Math.log;
  var LOG2E = Math.LOG2E;

  // `Math.clz32` method
  // https://tc39.github.io/ecma262/#sec-math.clz32
  _export$1({ target: 'Math', stat: true }, {
    clz32: function clz32(x) {
      return (x >>>= 0) ? 31 - floor$4(log$5(x + 0.5) * LOG2E) : 32;
    }
  });

  var nativeExpm1 = Math.expm1;
  var exp = Math.exp;

  // `Math.expm1` method implementation
  // https://tc39.github.io/ecma262/#sec-math.expm1
  var mathExpm1 = (!nativeExpm1
    // Old FF bug
    || nativeExpm1(10) > 22025.465794806719 || nativeExpm1(10) < 22025.4657948067165168
    // Tor Browser bug
    || nativeExpm1(-2e-17) != -2e-17
  ) ? function expm1(x) {
    return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
  } : nativeExpm1;

  var nativeCosh = Math.cosh;
  var abs$2 = Math.abs;
  var E = Math.E;

  // `Math.cosh` method
  // https://tc39.github.io/ecma262/#sec-math.cosh
  _export$1({ target: 'Math', stat: true, forced: !nativeCosh || nativeCosh(710) === Infinity }, {
    cosh: function cosh(x) {
      var t = mathExpm1(abs$2(x) - 1) + 1;
      return (t + 1 / (t * E * E)) * (E / 2);
    }
  });

  // `Math.expm1` method
  // https://tc39.github.io/ecma262/#sec-math.expm1
  _export$1({ target: 'Math', stat: true, forced: mathExpm1 != Math.expm1 }, { expm1: mathExpm1 });

  var abs$3 = Math.abs;
  var pow$2 = Math.pow;
  var EPSILON = pow$2(2, -52);
  var EPSILON32 = pow$2(2, -23);
  var MAX32 = pow$2(2, 127) * (2 - EPSILON32);
  var MIN32 = pow$2(2, -126);

  var roundTiesToEven = function (n) {
    return n + 1 / EPSILON - 1 / EPSILON;
  };

  // `Math.fround` method implementation
  // https://tc39.github.io/ecma262/#sec-math.fround
  var mathFround = Math.fround || function fround(x) {
    var $abs = abs$3(x);
    var $sign = mathSign(x);
    var a, result;
    if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    // eslint-disable-next-line no-self-compare
    if (result > MAX32 || result != result) return $sign * Infinity;
    return $sign * result;
  };

  // `Math.fround` method
  // https://tc39.github.io/ecma262/#sec-math.fround
  _export$1({ target: 'Math', stat: true }, { fround: mathFround });

  var $hypot = Math.hypot;
  var abs$4 = Math.abs;
  var sqrt$2 = Math.sqrt;

  // Chrome 77 bug
  // https://bugs.chromium.org/p/v8/issues/detail?id=9546
  var BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity;

  // `Math.hypot` method
  // https://tc39.github.io/ecma262/#sec-math.hypot
  _export$1({ target: 'Math', stat: true, forced: BUGGY }, {
    hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
      var sum = 0;
      var i = 0;
      var aLen = arguments.length;
      var larg = 0;
      var arg, div;
      while (i < aLen) {
        arg = abs$4(arguments[i++]);
        if (larg < arg) {
          div = larg / arg;
          sum = sum * div * div + 1;
          larg = arg;
        } else if (arg > 0) {
          div = arg / larg;
          sum += div * div;
        } else sum += arg;
      }
      return larg === Infinity ? Infinity : larg * sqrt$2(sum);
    }
  });

  var nativeImul = Math.imul;

  var FORCED$c = fails$1(function () {
    return nativeImul(0xFFFFFFFF, 5) != -5 || nativeImul.length != 2;
  });

  // `Math.imul` method
  // https://tc39.github.io/ecma262/#sec-math.imul
  // some WebKit versions fails with big numbers, some has wrong arity
  _export$1({ target: 'Math', stat: true, forced: FORCED$c }, {
    imul: function imul(x, y) {
      var UINT16 = 0xFFFF;
      var xn = +x;
      var yn = +y;
      var xl = UINT16 & xn;
      var yl = UINT16 & yn;
      return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
    }
  });

  var log$6 = Math.log;
  var LOG10E = Math.LOG10E;

  // `Math.log10` method
  // https://tc39.github.io/ecma262/#sec-math.log10
  _export$1({ target: 'Math', stat: true }, {
    log10: function log10(x) {
      return log$6(x) * LOG10E;
    }
  });

  // `Math.log1p` method
  // https://tc39.github.io/ecma262/#sec-math.log1p
  _export$1({ target: 'Math', stat: true }, { log1p: mathLog1p });

  var log$7 = Math.log;
  var LN2$1 = Math.LN2;

  // `Math.log2` method
  // https://tc39.github.io/ecma262/#sec-math.log2
  _export$1({ target: 'Math', stat: true }, {
    log2: function log2(x) {
      return log$7(x) / LN2$1;
    }
  });

  // `Math.sign` method
  // https://tc39.github.io/ecma262/#sec-math.sign
  _export$1({ target: 'Math', stat: true }, {
    sign: mathSign
  });

  var abs$5 = Math.abs;
  var exp$1 = Math.exp;
  var E$1 = Math.E;

  var FORCED$d = fails$1(function () {
    return Math.sinh(-2e-17) != -2e-17;
  });

  // `Math.sinh` method
  // https://tc39.github.io/ecma262/#sec-math.sinh
  // V8 near Chromium 38 has a problem with very small numbers
  _export$1({ target: 'Math', stat: true, forced: FORCED$d }, {
    sinh: function sinh(x) {
      return abs$5(x = +x) < 1 ? (mathExpm1(x) - mathExpm1(-x)) / 2 : (exp$1(x - 1) - exp$1(-x - 1)) * (E$1 / 2);
    }
  });

  var exp$2 = Math.exp;

  // `Math.tanh` method
  // https://tc39.github.io/ecma262/#sec-math.tanh
  _export$1({ target: 'Math', stat: true }, {
    tanh: function tanh(x) {
      var a = mathExpm1(x = +x);
      var b = mathExpm1(-x);
      return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp$2(x) + exp$2(-x));
    }
  });

  // Math[@@toStringTag] property
  // https://tc39.github.io/ecma262/#sec-math-@@tostringtag
  setToStringTag(Math, 'Math', true);

  var ceil$2 = Math.ceil;
  var floor$5 = Math.floor;

  // `Math.trunc` method
  // https://tc39.github.io/ecma262/#sec-math.trunc
  _export$1({ target: 'Math', stat: true }, {
    trunc: function trunc(it) {
      return (it > 0 ? floor$5 : ceil$2)(it);
    }
  });

  // `Date.now` method
  // https://tc39.github.io/ecma262/#sec-date.now
  _export$1({ target: 'Date', stat: true }, {
    now: function now() {
      return new Date().getTime();
    }
  });

  var FORCED$e = fails$1(function () {
    return new Date(NaN).toJSON() !== null
      || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
  });

  // `Date.prototype.toJSON` method
  // https://tc39.github.io/ecma262/#sec-date.prototype.tojson
  _export$1({ target: 'Date', proto: true, forced: FORCED$e }, {
    // eslint-disable-next-line no-unused-vars
    toJSON: function toJSON(key) {
      var O = toObject$1(this);
      var pv = toPrimitive$1(O);
      return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
    }
  });

  var padStart = stringPad.start;

  var abs$6 = Math.abs;
  var DatePrototype = Date.prototype;
  var getTime = DatePrototype.getTime;
  var nativeDateToISOString = DatePrototype.toISOString;

  // `Date.prototype.toISOString` method implementation
  // https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
  // PhantomJS / old WebKit fails here:
  var dateToIsoString = (fails$1(function () {
    return nativeDateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
  }) || !fails$1(function () {
    nativeDateToISOString.call(new Date(NaN));
  })) ? function toISOString() {
    if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
    var date = this;
    var year = date.getUTCFullYear();
    var milliseconds = date.getUTCMilliseconds();
    var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
    return sign + padStart(abs$6(year), sign ? 6 : 4, 0) +
      '-' + padStart(date.getUTCMonth() + 1, 2, 0) +
      '-' + padStart(date.getUTCDate(), 2, 0) +
      'T' + padStart(date.getUTCHours(), 2, 0) +
      ':' + padStart(date.getUTCMinutes(), 2, 0) +
      ':' + padStart(date.getUTCSeconds(), 2, 0) +
      '.' + padStart(milliseconds, 3, 0) +
      'Z';
  } : nativeDateToISOString;

  // `Date.prototype.toISOString` method
  // https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
  // PhantomJS / old WebKit has a broken implementations
  _export$1({ target: 'Date', proto: true, forced: Date.prototype.toISOString !== dateToIsoString }, {
    toISOString: dateToIsoString
  });

  var DatePrototype$1 = Date.prototype;
  var INVALID_DATE = 'Invalid Date';
  var TO_STRING$1 = 'toString';
  var nativeDateToString = DatePrototype$1[TO_STRING$1];
  var getTime$1 = DatePrototype$1.getTime;

  // `Date.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-date.prototype.tostring
  if (new Date(NaN) + '' != INVALID_DATE) {
    redefine$1(DatePrototype$1, TO_STRING$1, function toString() {
      var value = getTime$1.call(this);
      // eslint-disable-next-line no-self-compare
      return value === value ? nativeDateToString.call(this) : INVALID_DATE;
    });
  }

  var dateToPrimitive = function (hint) {
    if (hint !== 'string' && hint !== 'number' && hint !== 'default') {
      throw TypeError('Incorrect hint');
    } return toPrimitive$1(anObject$1(this), hint !== 'number');
  };

  var TO_PRIMITIVE$1 = wellKnownSymbol$1('toPrimitive');
  var DatePrototype$2 = Date.prototype;

  // `Date.prototype[@@toPrimitive]` method
  // https://tc39.github.io/ecma262/#sec-date.prototype-@@toprimitive
  if (!(TO_PRIMITIVE$1 in DatePrototype$2)) {
    createNonEnumerableProperty$1(DatePrototype$2, TO_PRIMITIVE$1, dateToPrimitive);
  }

  var $stringify$1 = getBuiltIn$1('JSON', 'stringify');
  var re = /[\uD800-\uDFFF]/g;
  var low = /^[\uD800-\uDBFF]$/;
  var hi = /^[\uDC00-\uDFFF]$/;

  var fix = function (match, offset, string) {
    var prev = string.charAt(offset - 1);
    var next = string.charAt(offset + 1);
    if ((low.test(match) && !hi.test(next)) || (hi.test(match) && !low.test(prev))) {
      return '\\u' + match.charCodeAt(0).toString(16);
    } return match;
  };

  var FORCED$f = fails$1(function () {
    return $stringify$1('\uDF06\uD834') !== '"\\udf06\\ud834"'
      || $stringify$1('\uDEAD') !== '"\\udead"';
  });

  if ($stringify$1) {
    // https://github.com/tc39/proposal-well-formed-stringify
    _export$1({ target: 'JSON', stat: true, forced: FORCED$f }, {
      // eslint-disable-next-line no-unused-vars
      stringify: function stringify(it, replacer, space) {
        var result = $stringify$1.apply(null, arguments);
        return typeof result == 'string' ? result.replace(re, fix) : result;
      }
    });
  }

  // JSON[@@toStringTag] property
  // https://tc39.github.io/ecma262/#sec-json-@@tostringtag
  setToStringTag(global_1$1.JSON, 'JSON', true);

  var nativePromiseConstructor = global_1$1.Promise;

  var redefineAll = function (target, src, options) {
    for (var key in src) redefine$1(target, key, src[key], options);
    return target;
  };

  var anInstance = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
    } return it;
  };

  var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent$1);

  var location = global_1$1.location;
  var set$1$1 = global_1$1.setImmediate;
  var clear = global_1$1.clearImmediate;
  var process$1$1 = global_1$1.process;
  var MessageChannel = global_1$1.MessageChannel;
  var Dispatch = global_1$1.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;

  var run = function (id) {
    // eslint-disable-next-line no-prototype-builtins
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };

  var runner = function (id) {
    return function () {
      run(id);
    };
  };

  var listener = function (event) {
    run(event.data);
  };

  var post = function (id) {
    // old engines have not location.origin
    global_1$1.postMessage(id + '', location.protocol + '//' + location.host);
  };

  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!set$1$1 || !clear) {
    set$1$1 = function setImmediate(fn) {
      var args = [];
      var i = 1;
      while (arguments.length > i) args.push(arguments[i++]);
      queue[++counter] = function () {
        // eslint-disable-next-line no-new-func
        (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
      };
      defer(counter);
      return counter;
    };
    clear = function clearImmediate(id) {
      delete queue[id];
    };
    // Node.js 0.8-
    if (classofRaw$1(process$1$1) == 'process') {
      defer = function (id) {
        process$1$1.nextTick(runner(id));
      };
    // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(runner(id));
      };
    // Browsers with MessageChannel, includes WebWorkers
    // except iOS - https://github.com/zloirock/core-js/issues/624
    } else if (MessageChannel && !engineIsIos) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = functionBindContext$1(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (global_1$1.addEventListener && typeof postMessage == 'function' && !global_1$1.importScripts && !fails$1(post)) {
      defer = post;
      global_1$1.addEventListener('message', listener, false);
    // IE8-
    } else if (ONREADYSTATECHANGE in documentCreateElement$1('script')) {
      defer = function (id) {
        html.appendChild(documentCreateElement$1('script'))[ONREADYSTATECHANGE] = function () {
          html.removeChild(this);
          run(id);
        };
      };
    // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(runner(id), 0);
      };
    }
  }

  var task = {
    set: set$1$1,
    clear: clear
  };

  var getOwnPropertyDescriptor$7 = objectGetOwnPropertyDescriptor$1.f;

  var macrotask = task.set;


  var MutationObserver = global_1$1.MutationObserver || global_1$1.WebKitMutationObserver;
  var process$2 = global_1$1.process;
  var Promise = global_1$1.Promise;
  var IS_NODE = classofRaw$1(process$2) == 'process';
  // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
  var queueMicrotaskDescriptor = getOwnPropertyDescriptor$7(global_1$1, 'queueMicrotask');
  var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

  var flush, head, last, notify, toggle, node, promise, then;

  // modern engines have queueMicrotask method
  if (!queueMicrotask) {
    flush = function () {
      var parent, fn;
      if (IS_NODE && (parent = process$2.domain)) parent.exit();
      while (head) {
        fn = head.fn;
        head = head.next;
        try {
          fn();
        } catch (error) {
          if (head) notify();
          else last = undefined;
          throw error;
        }
      } last = undefined;
      if (parent) parent.enter();
    };

    // Node.js
    if (IS_NODE) {
      notify = function () {
        process$2.nextTick(flush);
      };
    // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
    } else if (MutationObserver && !engineIsIos) {
      toggle = true;
      node = document.createTextNode('');
      new MutationObserver(flush).observe(node, { characterData: true });
      notify = function () {
        node.data = toggle = !toggle;
      };
    // environments with maybe non-completely correct, but existent Promise
    } else if (Promise && Promise.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      promise = Promise.resolve(undefined);
      then = promise.then;
      notify = function () {
        then.call(promise, flush);
      };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
    } else {
      notify = function () {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(global_1$1, flush);
      };
    }
  }

  var microtask = queueMicrotask || function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };

  var PromiseCapability = function (C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aFunction$1$1(resolve);
    this.reject = aFunction$1$1(reject);
  };

  // 25.4.1.5 NewPromiseCapability(C)
  var f$7 = function (C) {
    return new PromiseCapability(C);
  };

  var newPromiseCapability = {
  	f: f$7
  };

  var promiseResolve = function (C, x) {
    anObject$1(C);
    if (isObject$1(x) && x.constructor === C) return x;
    var promiseCapability = newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var hostReportErrors = function (a, b) {
    var console = global_1$1.console;
    if (console && console.error) {
      arguments.length === 1 ? console.error(a) : console.error(a, b);
    }
  };

  var perform = function (exec) {
    try {
      return { error: false, value: exec() };
    } catch (error) {
      return { error: true, value: error };
    }
  };

  var task$1 = task.set;










  var SPECIES$6 = wellKnownSymbol$1('species');
  var PROMISE = 'Promise';
  var getInternalState$5 = internalState$1.get;
  var setInternalState$5 = internalState$1.set;
  var getInternalPromiseState = internalState$1.getterFor(PROMISE);
  var PromiseConstructor = nativePromiseConstructor;
  var TypeError$1 = global_1$1.TypeError;
  var document$2 = global_1$1.document;
  var process$3 = global_1$1.process;
  var $fetch = getBuiltIn$1('fetch');
  var newPromiseCapability$1 = newPromiseCapability.f;
  var newGenericPromiseCapability = newPromiseCapability$1;
  var IS_NODE$1 = classofRaw$1(process$3) == 'process';
  var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1$1.dispatchEvent);
  var UNHANDLED_REJECTION = 'unhandledrejection';
  var REJECTION_HANDLED = 'rejectionhandled';
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var HANDLED = 1;
  var UNHANDLED = 2;
  var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

  var FORCED$g = isForced_1$1(PROMISE, function () {
    var GLOBAL_CORE_JS_PROMISE = inspectSource$1(PromiseConstructor) !== String(PromiseConstructor);
    if (!GLOBAL_CORE_JS_PROMISE) {
      // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // We can't detect it synchronously, so just check versions
      if (engineV8Version$1 === 66) return true;
      // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
      if (!IS_NODE$1 && typeof PromiseRejectionEvent != 'function') return true;
    }
    // We can't use @@species feature detection in V8 since it causes
    // deoptimization and performance degradation
    // https://github.com/zloirock/core-js/issues/679
    if (engineV8Version$1 >= 51 && /native code/.test(PromiseConstructor)) return false;
    // Detect correctness of subclassing with @@species support
    var promise = PromiseConstructor.resolve(1);
    var FakePromise = function (exec) {
      exec(function () { /* empty */ }, function () { /* empty */ });
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES$6] = FakePromise;
    return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
  });

  var INCORRECT_ITERATION$1 = FORCED$g || !checkCorrectnessOfIteration(function (iterable) {
    PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
  });

  // helpers
  var isThenable = function (it) {
    var then;
    return isObject$1(it) && typeof (then = it.then) == 'function' ? then : false;
  };

  var notify$1 = function (promise, state, isReject) {
    if (state.notified) return;
    state.notified = true;
    var chain = state.reactions;
    microtask(function () {
      var value = state.value;
      var ok = state.state == FULFILLED;
      var index = 0;
      // variable length - can't use forEach
      while (chain.length > index) {
        var reaction = chain[index++];
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;
        try {
          if (handler) {
            if (!ok) {
              if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
              state.rejection = HANDLED;
            }
            if (handler === true) result = value;
            else {
              if (domain) domain.enter();
              result = handler(value); // can throw
              if (domain) {
                domain.exit();
                exited = true;
              }
            }
            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (error) {
          if (domain && !exited) domain.exit();
          reject(error);
        }
      }
      state.reactions = [];
      state.notified = false;
      if (isReject && !state.rejection) onUnhandled(promise, state);
    });
  };

  var dispatchEvent = function (name, promise, reason) {
    var event, handler;
    if (DISPATCH_EVENT) {
      event = document$2.createEvent('Event');
      event.promise = promise;
      event.reason = reason;
      event.initEvent(name, false, true);
      global_1$1.dispatchEvent(event);
    } else event = { promise: promise, reason: reason };
    if (handler = global_1$1['on' + name]) handler(event);
    else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
  };

  var onUnhandled = function (promise, state) {
    task$1.call(global_1$1, function () {
      var value = state.value;
      var IS_UNHANDLED = isUnhandled(state);
      var result;
      if (IS_UNHANDLED) {
        result = perform(function () {
          if (IS_NODE$1) {
            process$3.emit('unhandledRejection', value, promise);
          } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
        if (result.error) throw result.value;
      }
    });
  };

  var isUnhandled = function (state) {
    return state.rejection !== HANDLED && !state.parent;
  };

  var onHandleUnhandled = function (promise, state) {
    task$1.call(global_1$1, function () {
      if (IS_NODE$1) {
        process$3.emit('rejectionHandled', promise);
      } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
    });
  };

  var bind = function (fn, promise, state, unwrap) {
    return function (value) {
      fn(promise, state, value, unwrap);
    };
  };

  var internalReject = function (promise, state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    state.value = value;
    state.state = REJECTED;
    notify$1(promise, state, true);
  };

  var internalResolve = function (promise, state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    try {
      if (promise === value) throw TypeError$1("Promise can't be resolved itself");
      var then = isThenable(value);
      if (then) {
        microtask(function () {
          var wrapper = { done: false };
          try {
            then.call(value,
              bind(internalResolve, promise, wrapper, state),
              bind(internalReject, promise, wrapper, state)
            );
          } catch (error) {
            internalReject(promise, wrapper, error, state);
          }
        });
      } else {
        state.value = value;
        state.state = FULFILLED;
        notify$1(promise, state, false);
      }
    } catch (error) {
      internalReject(promise, { done: false }, error, state);
    }
  };

  // constructor polyfill
  if (FORCED$g) {
    // 25.4.3.1 Promise(executor)
    PromiseConstructor = function Promise(executor) {
      anInstance(this, PromiseConstructor, PROMISE);
      aFunction$1$1(executor);
      Internal.call(this);
      var state = getInternalState$5(this);
      try {
        executor(bind(internalResolve, this, state), bind(internalReject, this, state));
      } catch (error) {
        internalReject(this, state, error);
      }
    };
    // eslint-disable-next-line no-unused-vars
    Internal = function Promise(executor) {
      setInternalState$5(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: [],
        rejection: false,
        state: PENDING,
        value: undefined
      });
    };
    Internal.prototype = redefineAll(PromiseConstructor.prototype, {
      // `Promise.prototype.then` method
      // https://tc39.github.io/ecma262/#sec-promise.prototype.then
      then: function then(onFulfilled, onRejected) {
        var state = getInternalPromiseState(this);
        var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = IS_NODE$1 ? process$3.domain : undefined;
        state.parent = true;
        state.reactions.push(reaction);
        if (state.state != PENDING) notify$1(this, state, false);
        return reaction.promise;
      },
      // `Promise.prototype.catch` method
      // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
      'catch': function (onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    OwnPromiseCapability = function () {
      var promise = new Internal();
      var state = getInternalState$5(promise);
      this.promise = promise;
      this.resolve = bind(internalResolve, promise, state);
      this.reject = bind(internalReject, promise, state);
    };
    newPromiseCapability.f = newPromiseCapability$1 = function (C) {
      return C === PromiseConstructor || C === PromiseWrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };

    if ( typeof nativePromiseConstructor == 'function') {
      nativeThen = nativePromiseConstructor.prototype.then;

      // wrap native Promise#then for native async functions
      redefine$1(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          nativeThen.call(that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });

      // wrap fetch result
      if (typeof $fetch == 'function') _export$1({ global: true, enumerable: true, forced: true }, {
        // eslint-disable-next-line no-unused-vars
        fetch: function fetch(input /* , init */) {
          return promiseResolve(PromiseConstructor, $fetch.apply(global_1$1, arguments));
        }
      });
    }
  }

  _export$1({ global: true, wrap: true, forced: FORCED$g }, {
    Promise: PromiseConstructor
  });

  setToStringTag(PromiseConstructor, PROMISE, false);
  setSpecies(PROMISE);

  PromiseWrapper = getBuiltIn$1(PROMISE);

  // statics
  _export$1({ target: PROMISE, stat: true, forced: FORCED$g }, {
    // `Promise.reject` method
    // https://tc39.github.io/ecma262/#sec-promise.reject
    reject: function reject(r) {
      var capability = newPromiseCapability$1(this);
      capability.reject.call(undefined, r);
      return capability.promise;
    }
  });

  _export$1({ target: PROMISE, stat: true, forced:  FORCED$g }, {
    // `Promise.resolve` method
    // https://tc39.github.io/ecma262/#sec-promise.resolve
    resolve: function resolve(x) {
      return promiseResolve( this, x);
    }
  });

  _export$1({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION$1 }, {
    // `Promise.all` method
    // https://tc39.github.io/ecma262/#sec-promise.all
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aFunction$1$1(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate_1(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          $promiseResolve.call(C, promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    },
    // `Promise.race` method
    // https://tc39.github.io/ecma262/#sec-promise.race
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aFunction$1$1(C.resolve);
        iterate_1(iterable, function (promise) {
          $promiseResolve.call(C, promise).then(capability.resolve, reject);
        });
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  // `Promise.allSettled` method
  // https://github.com/tc39/proposal-promise-allSettled
  _export$1({ target: 'Promise', stat: true }, {
    allSettled: function allSettled(iterable) {
      var C = this;
      var capability = newPromiseCapability.f(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform(function () {
        var promiseResolve = aFunction$1$1(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate_1(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          promiseResolve.call(C, promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = { status: 'fulfilled', value: value };
            --remaining || resolve(values);
          }, function (e) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = { status: 'rejected', reason: e };
            --remaining || resolve(values);
          });
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  // Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
  var NON_GENERIC = !!nativePromiseConstructor && fails$1(function () {
    nativePromiseConstructor.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
  });

  // `Promise.prototype.finally` method
  // https://tc39.github.io/ecma262/#sec-promise.prototype.finally
  _export$1({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
    'finally': function (onFinally) {
      var C = speciesConstructor(this, getBuiltIn$1('Promise'));
      var isFunction = typeof onFinally == 'function';
      return this.then(
        isFunction ? function (x) {
          return promiseResolve(C, onFinally()).then(function () { return x; });
        } : onFinally,
        isFunction ? function (e) {
          return promiseResolve(C, onFinally()).then(function () { throw e; });
        } : onFinally
      );
    }
  });

  // patch native Promise.prototype for native async functions
  if ( typeof nativePromiseConstructor == 'function' && !nativePromiseConstructor.prototype['finally']) {
    redefine$1(nativePromiseConstructor.prototype, 'finally', getBuiltIn$1('Promise').prototype['finally']);
  }

  var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
    var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
    var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
    var ADDER = IS_MAP ? 'set' : 'add';
    var NativeConstructor = global_1$1[CONSTRUCTOR_NAME];
    var NativePrototype = NativeConstructor && NativeConstructor.prototype;
    var Constructor = NativeConstructor;
    var exported = {};

    var fixMethod = function (KEY) {
      var nativeMethod = NativePrototype[KEY];
      redefine$1(NativePrototype, KEY,
        KEY == 'add' ? function add(value) {
          nativeMethod.call(this, value === 0 ? 0 : value);
          return this;
        } : KEY == 'delete' ? function (key) {
          return IS_WEAK && !isObject$1(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
        } : KEY == 'get' ? function get(key) {
          return IS_WEAK && !isObject$1(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
        } : KEY == 'has' ? function has(key) {
          return IS_WEAK && !isObject$1(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
        } : function set(key, value) {
          nativeMethod.call(this, key === 0 ? 0 : key, value);
          return this;
        }
      );
    };

    // eslint-disable-next-line max-len
    if (isForced_1$1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails$1(function () {
      new NativeConstructor().entries().next();
    })))) {
      // create collection constructor
      Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
      internalMetadata.REQUIRED = true;
    } else if (isForced_1$1(CONSTRUCTOR_NAME, true)) {
      var instance = new Constructor();
      // early implementations not supports chaining
      var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
      // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
      var THROWS_ON_PRIMITIVES = fails$1(function () { instance.has(1); });
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      // eslint-disable-next-line no-new
      var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
      // for early implementations -0 and +0 not the same
      var BUGGY_ZERO = !IS_WEAK && fails$1(function () {
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new NativeConstructor();
        var index = 5;
        while (index--) $instance[ADDER](index, index);
        return !$instance.has(-0);
      });

      if (!ACCEPT_ITERABLES) {
        Constructor = wrapper(function (dummy, iterable) {
          anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
          var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
          if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
          return that;
        });
        Constructor.prototype = NativePrototype;
        NativePrototype.constructor = Constructor;
      }

      if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
        fixMethod('delete');
        fixMethod('has');
        IS_MAP && fixMethod('get');
      }

      if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

      // weak collections should not contains .clear method
      if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
    }

    exported[CONSTRUCTOR_NAME] = Constructor;
    _export$1({ global: true, forced: Constructor != NativeConstructor }, exported);

    setToStringTag(Constructor, CONSTRUCTOR_NAME);

    if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

    return Constructor;
  };

  var defineProperty$9 = objectDefineProperty$1.f;








  var fastKey = internalMetadata.fastKey;


  var setInternalState$6 = internalState$1.set;
  var internalStateGetterFor = internalState$1.getterFor;

  var collectionStrong = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$6(that, {
          type: CONSTRUCTOR_NAME,
          index: objectCreate(null),
          first: undefined,
          last: undefined,
          size: 0
        });
        if (!descriptors$1) that.size = 0;
        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
      });

      var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

      var define = function (that, key, value) {
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        var previous, index;
        // change existing entry
        if (entry) {
          entry.value = value;
        // create new entry
        } else {
          state.last = entry = {
            index: index = fastKey(key, true),
            key: key,
            value: value,
            previous: previous = state.last,
            next: undefined,
            removed: false
          };
          if (!state.first) state.first = entry;
          if (previous) previous.next = entry;
          if (descriptors$1) state.size++;
          else that.size++;
          // add to index
          if (index !== 'F') state.index[index] = entry;
        } return that;
      };

      var getEntry = function (that, key) {
        var state = getInternalState(that);
        // fast case
        var index = fastKey(key);
        var entry;
        if (index !== 'F') return state.index[index];
        // frozen object case
        for (entry = state.first; entry; entry = entry.next) {
          if (entry.key == key) return entry;
        }
      };

      redefineAll(C.prototype, {
        // 23.1.3.1 Map.prototype.clear()
        // 23.2.3.2 Set.prototype.clear()
        clear: function clear() {
          var that = this;
          var state = getInternalState(that);
          var data = state.index;
          var entry = state.first;
          while (entry) {
            entry.removed = true;
            if (entry.previous) entry.previous = entry.previous.next = undefined;
            delete data[entry.index];
            entry = entry.next;
          }
          state.first = state.last = undefined;
          if (descriptors$1) state.size = 0;
          else that.size = 0;
        },
        // 23.1.3.3 Map.prototype.delete(key)
        // 23.2.3.4 Set.prototype.delete(value)
        'delete': function (key) {
          var that = this;
          var state = getInternalState(that);
          var entry = getEntry(that, key);
          if (entry) {
            var next = entry.next;
            var prev = entry.previous;
            delete state.index[entry.index];
            entry.removed = true;
            if (prev) prev.next = next;
            if (next) next.previous = prev;
            if (state.first == entry) state.first = next;
            if (state.last == entry) state.last = prev;
            if (descriptors$1) state.size--;
            else that.size--;
          } return !!entry;
        },
        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
        forEach: function forEach(callbackfn /* , that = undefined */) {
          var state = getInternalState(this);
          var boundFunction = functionBindContext$1(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
          var entry;
          while (entry = entry ? entry.next : state.first) {
            boundFunction(entry.value, entry.key, this);
            // revert to the last existing entry
            while (entry && entry.removed) entry = entry.previous;
          }
        },
        // 23.1.3.7 Map.prototype.has(key)
        // 23.2.3.7 Set.prototype.has(value)
        has: function has(key) {
          return !!getEntry(this, key);
        }
      });

      redefineAll(C.prototype, IS_MAP ? {
        // 23.1.3.6 Map.prototype.get(key)
        get: function get(key) {
          var entry = getEntry(this, key);
          return entry && entry.value;
        },
        // 23.1.3.9 Map.prototype.set(key, value)
        set: function set(key, value) {
          return define(this, key === 0 ? 0 : key, value);
        }
      } : {
        // 23.2.3.1 Set.prototype.add(value)
        add: function add(value) {
          return define(this, value = value === 0 ? 0 : value, value);
        }
      });
      if (descriptors$1) defineProperty$9(C.prototype, 'size', {
        get: function () {
          return getInternalState(this).size;
        }
      });
      return C;
    },
    setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
      var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
      var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
      var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
      // add .keys, .values, .entries, [@@iterator]
      // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
      defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
        setInternalState$6(this, {
          type: ITERATOR_NAME,
          target: iterated,
          state: getInternalCollectionState(iterated),
          kind: kind,
          last: undefined
        });
      }, function () {
        var state = getInternalIteratorState(this);
        var kind = state.kind;
        var entry = state.last;
        // revert to the last existing entry
        while (entry && entry.removed) entry = entry.previous;
        // get next entry
        if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
          // or finish the iteration
          state.target = undefined;
          return { value: undefined, done: true };
        }
        // return step by kind
        if (kind == 'keys') return { value: entry.key, done: false };
        if (kind == 'values') return { value: entry.value, done: false };
        return { value: [entry.key, entry.value], done: false };
      }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

      // add [@@species], 23.1.2.2, 23.2.2.2
      setSpecies(CONSTRUCTOR_NAME);
    }
  };

  // `Map` constructor
  // https://tc39.github.io/ecma262/#sec-map-objects
  var es_map = collection('Map', function (init) {
    return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
  }, collectionStrong);

  // `Set` constructor
  // https://tc39.github.io/ecma262/#sec-set-objects
  var es_set = collection('Set', function (init) {
    return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
  }, collectionStrong);

  var getWeakData = internalMetadata.getWeakData;








  var setInternalState$7 = internalState$1.set;
  var internalStateGetterFor$1 = internalState$1.getterFor;
  var find = arrayIteration$1.find;
  var findIndex = arrayIteration$1.findIndex;
  var id$1$1 = 0;

  // fallback for uncaught frozen keys
  var uncaughtFrozenStore = function (store) {
    return store.frozen || (store.frozen = new UncaughtFrozenStore());
  };

  var UncaughtFrozenStore = function () {
    this.entries = [];
  };

  var findUncaughtFrozen = function (store, key) {
    return find(store.entries, function (it) {
      return it[0] === key;
    });
  };

  UncaughtFrozenStore.prototype = {
    get: function (key) {
      var entry = findUncaughtFrozen(this, key);
      if (entry) return entry[1];
    },
    has: function (key) {
      return !!findUncaughtFrozen(this, key);
    },
    set: function (key, value) {
      var entry = findUncaughtFrozen(this, key);
      if (entry) entry[1] = value;
      else this.entries.push([key, value]);
    },
    'delete': function (key) {
      var index = findIndex(this.entries, function (it) {
        return it[0] === key;
      });
      if (~index) this.entries.splice(index, 1);
      return !!~index;
    }
  };

  var collectionWeak = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$7(that, {
          type: CONSTRUCTOR_NAME,
          id: id$1$1++,
          frozen: undefined
        });
        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
      });

      var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

      var define = function (that, key, value) {
        var state = getInternalState(that);
        var data = getWeakData(anObject$1(key), true);
        if (data === true) uncaughtFrozenStore(state).set(key, value);
        else data[state.id] = value;
        return that;
      };

      redefineAll(C.prototype, {
        // 23.3.3.2 WeakMap.prototype.delete(key)
        // 23.4.3.3 WeakSet.prototype.delete(value)
        'delete': function (key) {
          var state = getInternalState(this);
          if (!isObject$1(key)) return false;
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state)['delete'](key);
          return data && has$2(data, state.id) && delete data[state.id];
        },
        // 23.3.3.4 WeakMap.prototype.has(key)
        // 23.4.3.4 WeakSet.prototype.has(value)
        has: function has$1(key) {
          var state = getInternalState(this);
          if (!isObject$1(key)) return false;
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).has(key);
          return data && has$2(data, state.id);
        }
      });

      redefineAll(C.prototype, IS_MAP ? {
        // 23.3.3.3 WeakMap.prototype.get(key)
        get: function get(key) {
          var state = getInternalState(this);
          if (isObject$1(key)) {
            var data = getWeakData(key);
            if (data === true) return uncaughtFrozenStore(state).get(key);
            return data ? data[state.id] : undefined;
          }
        },
        // 23.3.3.5 WeakMap.prototype.set(key, value)
        set: function set(key, value) {
          return define(this, key, value);
        }
      } : {
        // 23.4.3.1 WeakSet.prototype.add(value)
        add: function add(value) {
          return define(this, value, true);
        }
      });

      return C;
    }
  };

  var es_weakMap = createCommonjsModule$1(function (module) {






  var enforceIternalState = internalState$1.enforce;


  var IS_IE11 = !global_1$1.ActiveXObject && 'ActiveXObject' in global_1$1;
  var isExtensible = Object.isExtensible;
  var InternalWeakMap;

  var wrapper = function (init) {
    return function WeakMap() {
      return init(this, arguments.length ? arguments[0] : undefined);
    };
  };

  // `WeakMap` constructor
  // https://tc39.github.io/ecma262/#sec-weakmap-constructor
  var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak);

  // IE11 WeakMap frozen keys fix
  // We can't use feature detection because it crash some old IE builds
  // https://github.com/zloirock/core-js/issues/485
  if (nativeWeakMap$1 && IS_IE11) {
    InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
    internalMetadata.REQUIRED = true;
    var WeakMapPrototype = $WeakMap.prototype;
    var nativeDelete = WeakMapPrototype['delete'];
    var nativeHas = WeakMapPrototype.has;
    var nativeGet = WeakMapPrototype.get;
    var nativeSet = WeakMapPrototype.set;
    redefineAll(WeakMapPrototype, {
      'delete': function (key) {
        if (isObject$1(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeDelete.call(this, key) || state.frozen['delete'](key);
        } return nativeDelete.call(this, key);
      },
      has: function has(key) {
        if (isObject$1(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeHas.call(this, key) || state.frozen.has(key);
        } return nativeHas.call(this, key);
      },
      get: function get(key) {
        if (isObject$1(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
        } return nativeGet.call(this, key);
      },
      set: function set(key, value) {
        if (isObject$1(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
        } else nativeSet.call(this, key, value);
        return this;
      }
    });
  }
  });

  // `WeakSet` constructor
  // https://tc39.github.io/ecma262/#sec-weakset-constructor
  collection('WeakSet', function (init) {
    return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
  }, collectionWeak);

  var arrayBufferNative = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

  // `ToIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-toindex
  var toIndex = function (it) {
    if (it === undefined) return 0;
    var number = toInteger$1(it);
    var length = toLength$1(number);
    if (number !== length) throw RangeError('Wrong length or index');
    return length;
  };

  // IEEE754 conversions based on https://github.com/feross/ieee754
  // eslint-disable-next-line no-shadow-restricted-names
  var Infinity$1 = 1 / 0;
  var abs$7 = Math.abs;
  var pow$3 = Math.pow;
  var floor$6 = Math.floor;
  var log$8 = Math.log;
  var LN2$2 = Math.LN2;

  var pack = function (number, mantissaLength, bytes) {
    var buffer = new Array(bytes);
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var rt = mantissaLength === 23 ? pow$3(2, -24) - pow$3(2, -77) : 0;
    var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
    var index = 0;
    var exponent, mantissa, c;
    number = abs$7(number);
    // eslint-disable-next-line no-self-compare
    if (number != number || number === Infinity$1) {
      // eslint-disable-next-line no-self-compare
      mantissa = number != number ? 1 : 0;
      exponent = eMax;
    } else {
      exponent = floor$6(log$8(number) / LN2$2);
      if (number * (c = pow$3(2, -exponent)) < 1) {
        exponent--;
        c *= 2;
      }
      if (exponent + eBias >= 1) {
        number += rt / c;
      } else {
        number += rt * pow$3(2, 1 - eBias);
      }
      if (number * c >= 2) {
        exponent++;
        c /= 2;
      }
      if (exponent + eBias >= eMax) {
        mantissa = 0;
        exponent = eMax;
      } else if (exponent + eBias >= 1) {
        mantissa = (number * c - 1) * pow$3(2, mantissaLength);
        exponent = exponent + eBias;
      } else {
        mantissa = number * pow$3(2, eBias - 1) * pow$3(2, mantissaLength);
        exponent = 0;
      }
    }
    for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
    exponent = exponent << mantissaLength | mantissa;
    exponentLength += mantissaLength;
    for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
    buffer[--index] |= sign * 128;
    return buffer;
  };

  var unpack = function (buffer, mantissaLength) {
    var bytes = buffer.length;
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var nBits = exponentLength - 7;
    var index = bytes - 1;
    var sign = buffer[index--];
    var exponent = sign & 127;
    var mantissa;
    sign >>= 7;
    for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
    mantissa = exponent & (1 << -nBits) - 1;
    exponent >>= -nBits;
    nBits += mantissaLength;
    for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
    if (exponent === 0) {
      exponent = 1 - eBias;
    } else if (exponent === eMax) {
      return mantissa ? NaN : sign ? -Infinity$1 : Infinity$1;
    } else {
      mantissa = mantissa + pow$3(2, mantissaLength);
      exponent = exponent - eBias;
    } return (sign ? -1 : 1) * mantissa * pow$3(2, exponent - mantissaLength);
  };

  var ieee754 = {
    pack: pack,
    unpack: unpack
  };

  var getOwnPropertyNames$2 = objectGetOwnPropertyNames$1.f;
  var defineProperty$a = objectDefineProperty$1.f;




  var getInternalState$6 = internalState$1.get;
  var setInternalState$8 = internalState$1.set;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var DATA_VIEW = 'DataView';
  var PROTOTYPE$2 = 'prototype';
  var WRONG_LENGTH = 'Wrong length';
  var WRONG_INDEX = 'Wrong index';
  var NativeArrayBuffer = global_1$1[ARRAY_BUFFER];
  var $ArrayBuffer = NativeArrayBuffer;
  var $DataView = global_1$1[DATA_VIEW];
  var $DataViewPrototype = $DataView && $DataView[PROTOTYPE$2];
  var ObjectPrototype$2 = Object.prototype;
  var RangeError$1 = global_1$1.RangeError;

  var packIEEE754 = ieee754.pack;
  var unpackIEEE754 = ieee754.unpack;

  var packInt8 = function (number) {
    return [number & 0xFF];
  };

  var packInt16 = function (number) {
    return [number & 0xFF, number >> 8 & 0xFF];
  };

  var packInt32 = function (number) {
    return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
  };

  var unpackInt32 = function (buffer) {
    return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
  };

  var packFloat32 = function (number) {
    return packIEEE754(number, 23, 4);
  };

  var packFloat64 = function (number) {
    return packIEEE754(number, 52, 8);
  };

  var addGetter = function (Constructor, key) {
    defineProperty$a(Constructor[PROTOTYPE$2], key, { get: function () { return getInternalState$6(this)[key]; } });
  };

  var get$1$1 = function (view, count, index, isLittleEndian) {
    var intIndex = toIndex(index);
    var store = getInternalState$6(view);
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
    var bytes = getInternalState$6(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = bytes.slice(start, start + count);
    return isLittleEndian ? pack : pack.reverse();
  };

  var set$2 = function (view, count, index, conversion, value, isLittleEndian) {
    var intIndex = toIndex(index);
    var store = getInternalState$6(view);
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
    var bytes = getInternalState$6(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = conversion(+value);
    for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
  };

  if (!arrayBufferNative) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
      var byteLength = toIndex(length);
      setInternalState$8(this, {
        bytes: arrayFill.call(new Array(byteLength), 0),
        byteLength: byteLength
      });
      if (!descriptors$1) this.byteLength = byteLength;
    };

    $DataView = function DataView(buffer, byteOffset, byteLength) {
      anInstance(this, $DataView, DATA_VIEW);
      anInstance(buffer, $ArrayBuffer, DATA_VIEW);
      var bufferLength = getInternalState$6(buffer).byteLength;
      var offset = toInteger$1(byteOffset);
      if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
      byteLength = byteLength === undefined ? bufferLength - offset : toLength$1(byteLength);
      if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
      setInternalState$8(this, {
        buffer: buffer,
        byteLength: byteLength,
        byteOffset: offset
      });
      if (!descriptors$1) {
        this.buffer = buffer;
        this.byteLength = byteLength;
        this.byteOffset = offset;
      }
    };

    if (descriptors$1) {
      addGetter($ArrayBuffer, 'byteLength');
      addGetter($DataView, 'buffer');
      addGetter($DataView, 'byteLength');
      addGetter($DataView, 'byteOffset');
    }

    redefineAll($DataView[PROTOTYPE$2], {
      getInt8: function getInt8(byteOffset) {
        return get$1$1(this, 1, byteOffset)[0] << 24 >> 24;
      },
      getUint8: function getUint8(byteOffset) {
        return get$1$1(this, 1, byteOffset)[0];
      },
      getInt16: function getInt16(byteOffset /* , littleEndian */) {
        var bytes = get$1$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
      },
      getUint16: function getUint16(byteOffset /* , littleEndian */) {
        var bytes = get$1$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return bytes[1] << 8 | bytes[0];
      },
      getInt32: function getInt32(byteOffset /* , littleEndian */) {
        return unpackInt32(get$1$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
      },
      getUint32: function getUint32(byteOffset /* , littleEndian */) {
        return unpackInt32(get$1$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
      },
      getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
        return unpackIEEE754(get$1$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
      },
      getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
        return unpackIEEE754(get$1$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
      },
      setInt8: function setInt8(byteOffset, value) {
        set$2(this, 1, byteOffset, packInt8, value);
      },
      setUint8: function setUint8(byteOffset, value) {
        set$2(this, 1, byteOffset, packInt8, value);
      },
      setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
        set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
        set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
        set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
        set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
        set$2(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
        set$2(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
      }
    });
  } else {
    if (!fails$1(function () {
      NativeArrayBuffer(1);
    }) || !fails$1(function () {
      new NativeArrayBuffer(-1); // eslint-disable-line no-new
    }) || fails$1(function () {
      new NativeArrayBuffer(); // eslint-disable-line no-new
      new NativeArrayBuffer(1.5); // eslint-disable-line no-new
      new NativeArrayBuffer(NaN); // eslint-disable-line no-new
      return NativeArrayBuffer.name != ARRAY_BUFFER;
    })) {
      $ArrayBuffer = function ArrayBuffer(length) {
        anInstance(this, $ArrayBuffer);
        return new NativeArrayBuffer(toIndex(length));
      };
      var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE$2] = NativeArrayBuffer[PROTOTYPE$2];
      for (var keys$3 = getOwnPropertyNames$2(NativeArrayBuffer), j$1 = 0, key$1; keys$3.length > j$1;) {
        if (!((key$1 = keys$3[j$1++]) in $ArrayBuffer)) {
          createNonEnumerableProperty$1($ArrayBuffer, key$1, NativeArrayBuffer[key$1]);
        }
      }
      ArrayBufferPrototype.constructor = $ArrayBuffer;
    }

    // WebKit bug - the same parent prototype for typed arrays and data view
    if (objectSetPrototypeOf && objectGetPrototypeOf($DataViewPrototype) !== ObjectPrototype$2) {
      objectSetPrototypeOf($DataViewPrototype, ObjectPrototype$2);
    }

    // iOS Safari 7.x bug
    var testView = new $DataView(new $ArrayBuffer(2));
    var nativeSetInt8 = $DataViewPrototype.setInt8;
    testView.setInt8(0, 2147483648);
    testView.setInt8(1, 2147483649);
    if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
      setInt8: function setInt8(byteOffset, value) {
        nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
      },
      setUint8: function setUint8(byteOffset, value) {
        nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
      }
    }, { unsafe: true });
  }

  setToStringTag($ArrayBuffer, ARRAY_BUFFER);
  setToStringTag($DataView, DATA_VIEW);

  var arrayBuffer = {
    ArrayBuffer: $ArrayBuffer,
    DataView: $DataView
  };

  var ARRAY_BUFFER$1 = 'ArrayBuffer';
  var ArrayBuffer$1 = arrayBuffer[ARRAY_BUFFER$1];
  var NativeArrayBuffer$1 = global_1$1[ARRAY_BUFFER$1];

  // `ArrayBuffer` constructor
  // https://tc39.github.io/ecma262/#sec-arraybuffer-constructor
  _export$1({ global: true, forced: NativeArrayBuffer$1 !== ArrayBuffer$1 }, {
    ArrayBuffer: ArrayBuffer$1
  });

  setSpecies(ARRAY_BUFFER$1);

  var defineProperty$b = objectDefineProperty$1.f;





  var Int8Array$1 = global_1$1.Int8Array;
  var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
  var Uint8ClampedArray = global_1$1.Uint8ClampedArray;
  var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
  var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
  var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
  var ObjectPrototype$3 = Object.prototype;
  var isPrototypeOf = ObjectPrototype$3.isPrototypeOf;

  var TO_STRING_TAG$3 = wellKnownSymbol$1('toStringTag');
  var TYPED_ARRAY_TAG = uid$1('TYPED_ARRAY_TAG');
  // Fixing native typed arrays in Opera Presto crashes the browser, see #595
  var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferNative && !!objectSetPrototypeOf && classof(global_1$1.opera) !== 'Opera';
  var TYPED_ARRAY_TAG_REQIRED = false;
  var NAME$1;

  var TypedArrayConstructorsList = {
    Int8Array: 1,
    Uint8Array: 1,
    Uint8ClampedArray: 1,
    Int16Array: 2,
    Uint16Array: 2,
    Int32Array: 4,
    Uint32Array: 4,
    Float32Array: 4,
    Float64Array: 8
  };

  var isView = function isView(it) {
    var klass = classof(it);
    return klass === 'DataView' || has$2(TypedArrayConstructorsList, klass);
  };

  var isTypedArray = function (it) {
    return isObject$1(it) && has$2(TypedArrayConstructorsList, classof(it));
  };

  var aTypedArray = function (it) {
    if (isTypedArray(it)) return it;
    throw TypeError('Target is not a typed array');
  };

  var aTypedArrayConstructor = function (C) {
    if (objectSetPrototypeOf) {
      if (isPrototypeOf.call(TypedArray, C)) return C;
    } else for (var ARRAY in TypedArrayConstructorsList) if (has$2(TypedArrayConstructorsList, NAME$1)) {
      var TypedArrayConstructor = global_1$1[ARRAY];
      if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
        return C;
      }
    } throw TypeError('Target is not a typed array constructor');
  };

  var exportTypedArrayMethod = function (KEY, property, forced) {
    if (!descriptors$1) return;
    if (forced) for (var ARRAY in TypedArrayConstructorsList) {
      var TypedArrayConstructor = global_1$1[ARRAY];
      if (TypedArrayConstructor && has$2(TypedArrayConstructor.prototype, KEY)) {
        delete TypedArrayConstructor.prototype[KEY];
      }
    }
    if (!TypedArrayPrototype[KEY] || forced) {
      redefine$1(TypedArrayPrototype, KEY, forced ? property
        : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
    }
  };

  var exportTypedArrayStaticMethod = function (KEY, property, forced) {
    var ARRAY, TypedArrayConstructor;
    if (!descriptors$1) return;
    if (objectSetPrototypeOf) {
      if (forced) for (ARRAY in TypedArrayConstructorsList) {
        TypedArrayConstructor = global_1$1[ARRAY];
        if (TypedArrayConstructor && has$2(TypedArrayConstructor, KEY)) {
          delete TypedArrayConstructor[KEY];
        }
      }
      if (!TypedArray[KEY] || forced) {
        // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
        try {
          return redefine$1(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY] || property);
        } catch (error) { /* empty */ }
      } else return;
    }
    for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global_1$1[ARRAY];
      if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
        redefine$1(TypedArrayConstructor, KEY, property);
      }
    }
  };

  for (NAME$1 in TypedArrayConstructorsList) {
    if (!global_1$1[NAME$1]) NATIVE_ARRAY_BUFFER_VIEWS = false;
  }

  // WebKit bug - typed arrays constructors prototype is Object.prototype
  if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
    // eslint-disable-next-line no-shadow
    TypedArray = function TypedArray() {
      throw TypeError('Incorrect invocation');
    };
    if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
      if (global_1$1[NAME$1]) objectSetPrototypeOf(global_1$1[NAME$1], TypedArray);
    }
  }

  if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$3) {
    TypedArrayPrototype = TypedArray.prototype;
    if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
      if (global_1$1[NAME$1]) objectSetPrototypeOf(global_1$1[NAME$1].prototype, TypedArrayPrototype);
    }
  }

  // WebKit bug - one more object in Uint8ClampedArray prototype chain
  if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
    objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
  }

  if (descriptors$1 && !has$2(TypedArrayPrototype, TO_STRING_TAG$3)) {
    TYPED_ARRAY_TAG_REQIRED = true;
    defineProperty$b(TypedArrayPrototype, TO_STRING_TAG$3, { get: function () {
      return isObject$1(this) ? this[TYPED_ARRAY_TAG] : undefined;
    } });
    for (NAME$1 in TypedArrayConstructorsList) if (global_1$1[NAME$1]) {
      createNonEnumerableProperty$1(global_1$1[NAME$1], TYPED_ARRAY_TAG, NAME$1);
    }
  }

  var arrayBufferViewCore = {
    NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
    TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
    aTypedArray: aTypedArray,
    aTypedArrayConstructor: aTypedArrayConstructor,
    exportTypedArrayMethod: exportTypedArrayMethod,
    exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
    isView: isView,
    isTypedArray: isTypedArray,
    TypedArray: TypedArray,
    TypedArrayPrototype: TypedArrayPrototype
  };

  var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

  // `ArrayBuffer.isView` method
  // https://tc39.github.io/ecma262/#sec-arraybuffer.isview
  _export$1({ target: 'ArrayBuffer', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS$1 }, {
    isView: arrayBufferViewCore.isView
  });

  var ArrayBuffer$2 = arrayBuffer.ArrayBuffer;
  var DataView$1 = arrayBuffer.DataView;
  var nativeArrayBufferSlice = ArrayBuffer$2.prototype.slice;

  var INCORRECT_SLICE = fails$1(function () {
    return !new ArrayBuffer$2(2).slice(1, undefined).byteLength;
  });

  // `ArrayBuffer.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice
  _export$1({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
    slice: function slice(start, end) {
      if (nativeArrayBufferSlice !== undefined && end === undefined) {
        return nativeArrayBufferSlice.call(anObject$1(this), start); // FF fix
      }
      var length = anObject$1(this).byteLength;
      var first = toAbsoluteIndex$1(start, length);
      var fin = toAbsoluteIndex$1(end === undefined ? length : end, length);
      var result = new (speciesConstructor(this, ArrayBuffer$2))(toLength$1(fin - first));
      var viewSource = new DataView$1(this);
      var viewTarget = new DataView$1(result);
      var index = 0;
      while (first < fin) {
        viewTarget.setUint8(index++, viewSource.getUint8(first++));
      } return result;
    }
  });

  // `DataView` constructor
  // https://tc39.github.io/ecma262/#sec-dataview-constructor
  _export$1({ global: true, forced: !arrayBufferNative }, {
    DataView: arrayBuffer.DataView
  });

  /* eslint-disable no-new */



  var NATIVE_ARRAY_BUFFER_VIEWS$2 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

  var ArrayBuffer$3 = global_1$1.ArrayBuffer;
  var Int8Array$2 = global_1$1.Int8Array;

  var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$2 || !fails$1(function () {
    Int8Array$2(1);
  }) || !fails$1(function () {
    new Int8Array$2(-1);
  }) || !checkCorrectnessOfIteration(function (iterable) {
    new Int8Array$2();
    new Int8Array$2(null);
    new Int8Array$2(1.5);
    new Int8Array$2(iterable);
  }, true) || fails$1(function () {
    // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
    return new Int8Array$2(new ArrayBuffer$3(2), 1, undefined).length !== 1;
  });

  var toPositiveInteger = function (it) {
    var result = toInteger$1(it);
    if (result < 0) throw RangeError("The argument can't be less than 0");
    return result;
  };

  var toOffset = function (it, BYTES) {
    var offset = toPositiveInteger(it);
    if (offset % BYTES) throw RangeError('Wrong offset');
    return offset;
  };

  var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

  var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
    var O = toObject$1(source);
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod(O);
    var i, length, result, step, iterator, next;
    if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      O = [];
      while (!(step = next.call(iterator)).done) {
        O.push(step.value);
      }
    }
    if (mapping && argumentsLength > 2) {
      mapfn = functionBindContext$1(mapfn, arguments[2], 2);
    }
    length = toLength$1(O.length);
    result = new (aTypedArrayConstructor$1(this))(length);
    for (i = 0; length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var typedArrayConstructor = createCommonjsModule$1(function (module) {


















  var getOwnPropertyNames = objectGetOwnPropertyNames$1.f;

  var forEach = arrayIteration$1.forEach;






  var getInternalState = internalState$1.get;
  var setInternalState = internalState$1.set;
  var nativeDefineProperty = objectDefineProperty$1.f;
  var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor$1.f;
  var round = Math.round;
  var RangeError = global_1$1.RangeError;
  var ArrayBuffer = arrayBuffer.ArrayBuffer;
  var DataView = arrayBuffer.DataView;
  var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
  var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
  var TypedArray = arrayBufferViewCore.TypedArray;
  var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
  var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
  var isTypedArray = arrayBufferViewCore.isTypedArray;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var WRONG_LENGTH = 'Wrong length';

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key) {
    nativeDefineProperty(it, key, { get: function () {
      return getInternalState(this)[key];
    } });
  };

  var isArrayBuffer = function (it) {
    var klass;
    return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
  };

  var isTypedArrayIndex = function (target, key) {
    return isTypedArray(target)
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };

  var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
    return isTypedArrayIndex(target, key = toPrimitive$1(key, true))
      ? createPropertyDescriptor$1(2, target[key])
      : nativeGetOwnPropertyDescriptor(target, key);
  };

  var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
    if (isTypedArrayIndex(target, key = toPrimitive$1(key, true))
      && isObject$1(descriptor)
      && has$2(descriptor, 'value')
      && !has$2(descriptor, 'get')
      && !has$2(descriptor, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !descriptor.configurable
      && (!has$2(descriptor, 'writable') || descriptor.writable)
      && (!has$2(descriptor, 'enumerable') || descriptor.enumerable)
    ) {
      target[key] = descriptor.value;
      return target;
    } return nativeDefineProperty(target, key, descriptor);
  };

  if (descriptors$1) {
    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      objectGetOwnPropertyDescriptor$1.f = wrappedGetOwnPropertyDescriptor;
      objectDefineProperty$1.f = wrappedDefineProperty;
      addGetter(TypedArrayPrototype, 'buffer');
      addGetter(TypedArrayPrototype, 'byteOffset');
      addGetter(TypedArrayPrototype, 'byteLength');
      addGetter(TypedArrayPrototype, 'length');
    }

    _export$1({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
      getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
      defineProperty: wrappedDefineProperty
    });

    module.exports = function (TYPE, wrapper, CLAMPED) {
      var BYTES = TYPE.match(/\d+$/)[0] / 8;
      var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
      var GETTER = 'get' + TYPE;
      var SETTER = 'set' + TYPE;
      var NativeTypedArrayConstructor = global_1$1[CONSTRUCTOR_NAME];
      var TypedArrayConstructor = NativeTypedArrayConstructor;
      var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
      var exported = {};

      var getter = function (that, index) {
        var data = getInternalState(that);
        return data.view[GETTER](index * BYTES + data.byteOffset, true);
      };

      var setter = function (that, index, value) {
        var data = getInternalState(that);
        if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
        data.view[SETTER](index * BYTES + data.byteOffset, value, true);
      };

      var addElement = function (that, index) {
        nativeDefineProperty(that, index, {
          get: function () {
            return getter(this, index);
          },
          set: function (value) {
            return setter(this, index, value);
          },
          enumerable: true
        });
      };

      if (!NATIVE_ARRAY_BUFFER_VIEWS) {
        TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
          anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
          var index = 0;
          var byteOffset = 0;
          var buffer, byteLength, length;
          if (!isObject$1(data)) {
            length = toIndex(data);
            byteLength = length * BYTES;
            buffer = new ArrayBuffer(byteLength);
          } else if (isArrayBuffer(data)) {
            buffer = data;
            byteOffset = toOffset(offset, BYTES);
            var $len = data.byteLength;
            if ($length === undefined) {
              if ($len % BYTES) throw RangeError(WRONG_LENGTH);
              byteLength = $len - byteOffset;
              if (byteLength < 0) throw RangeError(WRONG_LENGTH);
            } else {
              byteLength = toLength$1($length) * BYTES;
              if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
            }
            length = byteLength / BYTES;
          } else if (isTypedArray(data)) {
            return fromList(TypedArrayConstructor, data);
          } else {
            return typedArrayFrom.call(TypedArrayConstructor, data);
          }
          setInternalState(that, {
            buffer: buffer,
            byteOffset: byteOffset,
            byteLength: byteLength,
            length: length,
            view: new DataView(buffer)
          });
          while (index < length) addElement(that, index++);
        });

        if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
        TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
      } else if (typedArrayConstructorsRequireWrappers) {
        TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
          anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
          return inheritIfRequired(function () {
            if (!isObject$1(data)) return new NativeTypedArrayConstructor(toIndex(data));
            if (isArrayBuffer(data)) return $length !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
              : typedArrayOffset !== undefined
                ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
                : new NativeTypedArrayConstructor(data);
            if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
            return typedArrayFrom.call(TypedArrayConstructor, data);
          }(), dummy, TypedArrayConstructor);
        });

        if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
        forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
          if (!(key in TypedArrayConstructor)) {
            createNonEnumerableProperty$1(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
          }
        });
        TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
      }

      if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
        createNonEnumerableProperty$1(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
      }

      if (TYPED_ARRAY_TAG) {
        createNonEnumerableProperty$1(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
      }

      exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

      _export$1({
        global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
      }, exported);

      if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
        createNonEnumerableProperty$1(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
      }

      if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
        createNonEnumerableProperty$1(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
      }

      setSpecies(CONSTRUCTOR_NAME);
    };
  } else module.exports = function () { /* empty */ };
  });

  // `Int8Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Int8', function (init) {
    return function Int8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Uint8Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint8', function (init) {
    return function Uint8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Uint8ClampedArray` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint8', function (init) {
    return function Uint8ClampedArray(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  }, true);

  // `Int16Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Int16', function (init) {
    return function Int16Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Uint16Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint16', function (init) {
    return function Uint16Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Int32Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Int32', function (init) {
    return function Int32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Uint32Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint32', function (init) {
    return function Uint32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Float32Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Float32', function (init) {
    return function Float32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Float64Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Float64', function (init) {
    return function Float64Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  var exportTypedArrayStaticMethod$1 = arrayBufferViewCore.exportTypedArrayStaticMethod;


  // `%TypedArray%.from` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.from
  exportTypedArrayStaticMethod$1('from', typedArrayFrom, typedArrayConstructorsRequireWrappers);

  var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayStaticMethod$2 = arrayBufferViewCore.exportTypedArrayStaticMethod;

  // `%TypedArray%.of` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.of
  exportTypedArrayStaticMethod$2('of', function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = new (aTypedArrayConstructor$2(this))(length);
    while (length > index) result[index] = arguments[index++];
    return result;
  }, typedArrayConstructorsRequireWrappers);

  var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.copyWithin` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
  exportTypedArrayMethod$1('copyWithin', function copyWithin(target, start /* , end */) {
    return arrayCopyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
  });

  var $every$1 = arrayIteration$1.every;

  var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
  exportTypedArrayMethod$2('every', function every(callbackfn /* , thisArg */) {
    return $every$1(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.fill` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
  // eslint-disable-next-line no-unused-vars
  exportTypedArrayMethod$3('fill', function fill(value /* , start, end */) {
    return arrayFill.apply(aTypedArray$3(this), arguments);
  });

  var $filter$1 = arrayIteration$1.filter;


  var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
  exportTypedArrayMethod$4('filter', function filter(callbackfn /* , thisArg */) {
    var list = $filter$1(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var C = speciesConstructor(this, this.constructor);
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor$3(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  });

  var $find$1 = arrayIteration$1.find;

  var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
  exportTypedArrayMethod$5('find', function find(predicate /* , thisArg */) {
    return $find$1(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $findIndex$1 = arrayIteration$1.findIndex;

  var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
  exportTypedArrayMethod$6('findIndex', function findIndex(predicate /* , thisArg */) {
    return $findIndex$1(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $forEach$2 = arrayIteration$1.forEach;

  var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
  exportTypedArrayMethod$7('forEach', function forEach(callbackfn /* , thisArg */) {
    $forEach$2(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $includes$1 = arrayIncludes$1.includes;

  var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
  exportTypedArrayMethod$8('includes', function includes(searchElement /* , fromIndex */) {
    return $includes$1(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $indexOf$1 = arrayIncludes$1.indexOf;

  var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
  exportTypedArrayMethod$9('indexOf', function indexOf(searchElement /* , fromIndex */) {
    return $indexOf$1(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ITERATOR$5 = wellKnownSymbol$1('iterator');
  var Uint8Array = global_1$1.Uint8Array;
  var arrayValues = es_array_iterator.values;
  var arrayKeys = es_array_iterator.keys;
  var arrayEntries = es_array_iterator.entries;
  var aTypedArray$a = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;
  var nativeTypedArrayIterator = Uint8Array && Uint8Array.prototype[ITERATOR$5];

  var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
    && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

  var typedArrayValues = function values() {
    return arrayValues.call(aTypedArray$a(this));
  };

  // `%TypedArray%.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
  exportTypedArrayMethod$a('entries', function entries() {
    return arrayEntries.call(aTypedArray$a(this));
  });
  // `%TypedArray%.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
  exportTypedArrayMethod$a('keys', function keys() {
    return arrayKeys.call(aTypedArray$a(this));
  });
  // `%TypedArray%.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
  exportTypedArrayMethod$a('values', typedArrayValues, !CORRECT_ITER_NAME);
  // `%TypedArray%.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
  exportTypedArrayMethod$a(ITERATOR$5, typedArrayValues, !CORRECT_ITER_NAME);

  var aTypedArray$b = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;
  var $join = [].join;

  // `%TypedArray%.prototype.join` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
  // eslint-disable-next-line no-unused-vars
  exportTypedArrayMethod$b('join', function join(separator) {
    return $join.apply(aTypedArray$b(this), arguments);
  });

  var aTypedArray$c = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.lastIndexOf` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
  // eslint-disable-next-line no-unused-vars
  exportTypedArrayMethod$c('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
    return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
  });

  var $map$1$1 = arrayIteration$1.map;


  var aTypedArray$d = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
  exportTypedArrayMethod$d('map', function map(mapfn /* , thisArg */) {
    return $map$1$1(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
      return new (aTypedArrayConstructor$4(speciesConstructor(O, O.constructor)))(length);
    });
  });

  var $reduce$1 = arrayReduce.left;

  var aTypedArray$e = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
  exportTypedArrayMethod$e('reduce', function reduce(callbackfn /* , initialValue */) {
    return $reduce$1(aTypedArray$e(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $reduceRight$1 = arrayReduce.right;

  var aTypedArray$f = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.reduceRicht` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
  exportTypedArrayMethod$f('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
    return $reduceRight$1(aTypedArray$f(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$g = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;
  var floor$7 = Math.floor;

  // `%TypedArray%.prototype.reverse` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
  exportTypedArrayMethod$g('reverse', function reverse() {
    var that = this;
    var length = aTypedArray$g(that).length;
    var middle = floor$7(length / 2);
    var index = 0;
    var value;
    while (index < middle) {
      value = that[index];
      that[index++] = that[--length];
      that[length] = value;
    } return that;
  });

  var aTypedArray$h = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;

  var FORCED$h = fails$1(function () {
    // eslint-disable-next-line no-undef
    new Int8Array(1).set({});
  });

  // `%TypedArray%.prototype.set` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
  exportTypedArrayMethod$h('set', function set(arrayLike /* , offset */) {
    aTypedArray$h(this);
    var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
    var length = this.length;
    var src = toObject$1(arrayLike);
    var len = toLength$1(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError('Wrong length');
    while (index < len) this[offset + index] = src[index++];
  }, FORCED$h);

  var aTypedArray$i = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$5 = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;
  var $slice = [].slice;

  var FORCED$i = fails$1(function () {
    // eslint-disable-next-line no-undef
    new Int8Array(1).slice();
  });

  // `%TypedArray%.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
  exportTypedArrayMethod$i('slice', function slice(start, end) {
    var list = $slice.call(aTypedArray$i(this), start, end);
    var C = speciesConstructor(this, this.constructor);
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor$5(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  }, FORCED$i);

  var $some$1 = arrayIteration$1.some;

  var aTypedArray$j = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
  exportTypedArrayMethod$j('some', function some(callbackfn /* , thisArg */) {
    return $some$1(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$k = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;
  var $sort = [].sort;

  // `%TypedArray%.prototype.sort` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
  exportTypedArrayMethod$k('sort', function sort(comparefn) {
    return $sort.call(aTypedArray$k(this), comparefn);
  });

  var aTypedArray$l = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.subarray` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
  exportTypedArrayMethod$l('subarray', function subarray(begin, end) {
    var O = aTypedArray$l(this);
    var length = O.length;
    var beginIndex = toAbsoluteIndex$1(begin, length);
    return new (speciesConstructor(O, O.constructor))(
      O.buffer,
      O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
      toLength$1((end === undefined ? length : toAbsoluteIndex$1(end, length)) - beginIndex)
    );
  });

  var Int8Array$3 = global_1$1.Int8Array;
  var aTypedArray$m = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;
  var $toLocaleString = [].toLocaleString;
  var $slice$1 = [].slice;

  // iOS Safari 6.x fails here
  var TO_LOCALE_STRING_BUG = !!Int8Array$3 && fails$1(function () {
    $toLocaleString.call(new Int8Array$3(1));
  });

  var FORCED$j = fails$1(function () {
    return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
  }) || !fails$1(function () {
    Int8Array$3.prototype.toLocaleString.call([1, 2]);
  });

  // `%TypedArray%.prototype.toLocaleString` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
  exportTypedArrayMethod$m('toLocaleString', function toLocaleString() {
    return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
  }, FORCED$j);

  var exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod;



  var Uint8Array$1 = global_1$1.Uint8Array;
  var Uint8ArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype || {};
  var arrayToString = [].toString;
  var arrayJoin = [].join;

  if (fails$1(function () { arrayToString.call({}); })) {
    arrayToString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

  // `%TypedArray%.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
  exportTypedArrayMethod$n('toString', arrayToString, IS_NOT_ARRAY_METHOD);

  var nativeApply = getBuiltIn$1('Reflect', 'apply');
  var functionApply = Function.apply;

  // MS Edge argumentsList argument is optional
  var OPTIONAL_ARGUMENTS_LIST = !fails$1(function () {
    nativeApply(function () { /* empty */ });
  });

  // `Reflect.apply` method
  // https://tc39.github.io/ecma262/#sec-reflect.apply
  _export$1({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
    apply: function apply(target, thisArgument, argumentsList) {
      aFunction$1$1(target);
      anObject$1(argumentsList);
      return nativeApply
        ? nativeApply(target, thisArgument, argumentsList)
        : functionApply.call(target, thisArgument, argumentsList);
    }
  });

  var nativeConstruct = getBuiltIn$1('Reflect', 'construct');

  // `Reflect.construct` method
  // https://tc39.github.io/ecma262/#sec-reflect.construct
  // MS Edge supports only 2 arguments and argumentsList argument is optional
  // FF Nightly sets third argument as `new.target`, but does not create `this` from it
  var NEW_TARGET_BUG = fails$1(function () {
    function F() { /* empty */ }
    return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
  });
  var ARGS_BUG = !fails$1(function () {
    nativeConstruct(function () { /* empty */ });
  });
  var FORCED$k = NEW_TARGET_BUG || ARGS_BUG;

  _export$1({ target: 'Reflect', stat: true, forced: FORCED$k, sham: FORCED$k }, {
    construct: function construct(Target, args /* , newTarget */) {
      aFunction$1$1(Target);
      anObject$1(args);
      var newTarget = arguments.length < 3 ? Target : aFunction$1$1(arguments[2]);
      if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
      if (Target == newTarget) {
        // w/o altered newTarget, optimization for 0-4 arguments
        switch (args.length) {
          case 0: return new Target();
          case 1: return new Target(args[0]);
          case 2: return new Target(args[0], args[1]);
          case 3: return new Target(args[0], args[1], args[2]);
          case 4: return new Target(args[0], args[1], args[2], args[3]);
        }
        // w/o altered newTarget, lot of arguments case
        var $args = [null];
        $args.push.apply($args, args);
        return new (functionBind.apply(Target, $args))();
      }
      // with altered newTarget, not support built-in constructors
      var proto = newTarget.prototype;
      var instance = objectCreate(isObject$1(proto) ? proto : Object.prototype);
      var result = Function.apply.call(Target, instance, args);
      return isObject$1(result) ? result : instance;
    }
  });

  // MS Edge has broken Reflect.defineProperty - throwing instead of returning false
  var ERROR_INSTEAD_OF_FALSE = fails$1(function () {
    // eslint-disable-next-line no-undef
    Reflect.defineProperty(objectDefineProperty$1.f({}, 1, { value: 1 }), 1, { value: 2 });
  });

  // `Reflect.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-reflect.defineproperty
  _export$1({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !descriptors$1 }, {
    defineProperty: function defineProperty(target, propertyKey, attributes) {
      anObject$1(target);
      var key = toPrimitive$1(propertyKey, true);
      anObject$1(attributes);
      try {
        objectDefineProperty$1.f(target, key, attributes);
        return true;
      } catch (error) {
        return false;
      }
    }
  });

  var getOwnPropertyDescriptor$8 = objectGetOwnPropertyDescriptor$1.f;

  // `Reflect.deleteProperty` method
  // https://tc39.github.io/ecma262/#sec-reflect.deleteproperty
  _export$1({ target: 'Reflect', stat: true }, {
    deleteProperty: function deleteProperty(target, propertyKey) {
      var descriptor = getOwnPropertyDescriptor$8(anObject$1(target), propertyKey);
      return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
    }
  });

  // `Reflect.get` method
  // https://tc39.github.io/ecma262/#sec-reflect.get
  function get$2(target, propertyKey /* , receiver */) {
    var receiver = arguments.length < 3 ? target : arguments[2];
    var descriptor, prototype;
    if (anObject$1(target) === receiver) return target[propertyKey];
    if (descriptor = objectGetOwnPropertyDescriptor$1.f(target, propertyKey)) return has$2(descriptor, 'value')
      ? descriptor.value
      : descriptor.get === undefined
        ? undefined
        : descriptor.get.call(receiver);
    if (isObject$1(prototype = objectGetPrototypeOf(target))) return get$2(prototype, propertyKey, receiver);
  }

  _export$1({ target: 'Reflect', stat: true }, {
    get: get$2
  });

  // `Reflect.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-reflect.getownpropertydescriptor
  _export$1({ target: 'Reflect', stat: true, sham: !descriptors$1 }, {
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
      return objectGetOwnPropertyDescriptor$1.f(anObject$1(target), propertyKey);
    }
  });

  // `Reflect.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-reflect.getprototypeof
  _export$1({ target: 'Reflect', stat: true, sham: !correctPrototypeGetter }, {
    getPrototypeOf: function getPrototypeOf(target) {
      return objectGetPrototypeOf(anObject$1(target));
    }
  });

  // `Reflect.has` method
  // https://tc39.github.io/ecma262/#sec-reflect.has
  _export$1({ target: 'Reflect', stat: true }, {
    has: function has(target, propertyKey) {
      return propertyKey in target;
    }
  });

  var objectIsExtensible = Object.isExtensible;

  // `Reflect.isExtensible` method
  // https://tc39.github.io/ecma262/#sec-reflect.isextensible
  _export$1({ target: 'Reflect', stat: true }, {
    isExtensible: function isExtensible(target) {
      anObject$1(target);
      return objectIsExtensible ? objectIsExtensible(target) : true;
    }
  });

  // `Reflect.ownKeys` method
  // https://tc39.github.io/ecma262/#sec-reflect.ownkeys
  _export$1({ target: 'Reflect', stat: true }, {
    ownKeys: ownKeys$1
  });

  // `Reflect.preventExtensions` method
  // https://tc39.github.io/ecma262/#sec-reflect.preventextensions
  _export$1({ target: 'Reflect', stat: true, sham: !freezing }, {
    preventExtensions: function preventExtensions(target) {
      anObject$1(target);
      try {
        var objectPreventExtensions = getBuiltIn$1('Object', 'preventExtensions');
        if (objectPreventExtensions) objectPreventExtensions(target);
        return true;
      } catch (error) {
        return false;
      }
    }
  });

  // `Reflect.set` method
  // https://tc39.github.io/ecma262/#sec-reflect.set
  function set$3(target, propertyKey, V /* , receiver */) {
    var receiver = arguments.length < 4 ? target : arguments[3];
    var ownDescriptor = objectGetOwnPropertyDescriptor$1.f(anObject$1(target), propertyKey);
    var existingDescriptor, prototype;
    if (!ownDescriptor) {
      if (isObject$1(prototype = objectGetPrototypeOf(target))) {
        return set$3(prototype, propertyKey, V, receiver);
      }
      ownDescriptor = createPropertyDescriptor$1(0);
    }
    if (has$2(ownDescriptor, 'value')) {
      if (ownDescriptor.writable === false || !isObject$1(receiver)) return false;
      if (existingDescriptor = objectGetOwnPropertyDescriptor$1.f(receiver, propertyKey)) {
        if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
        existingDescriptor.value = V;
        objectDefineProperty$1.f(receiver, propertyKey, existingDescriptor);
      } else objectDefineProperty$1.f(receiver, propertyKey, createPropertyDescriptor$1(0, V));
      return true;
    }
    return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true);
  }

  // MS Edge 17-18 Reflect.set allows setting the property to object
  // with non-writable property on the prototype
  var MS_EDGE_BUG = fails$1(function () {
    var object = objectDefineProperty$1.f({}, 'a', { configurable: true });
    // eslint-disable-next-line no-undef
    return Reflect.set(objectGetPrototypeOf(object), 'a', 1, object) !== false;
  });

  _export$1({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
    set: set$3
  });

  // `Reflect.setPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-reflect.setprototypeof
  if (objectSetPrototypeOf) _export$1({ target: 'Reflect', stat: true }, {
    setPrototypeOf: function setPrototypeOf(target, proto) {
      anObject$1(target);
      aPossiblePrototype(proto);
      try {
        objectSetPrototypeOf(target, proto);
        return true;
      } catch (error) {
        return false;
      }
    }
  });

  // iterable DOM collections
  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  var domIterables$1 = {
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

  for (var COLLECTION_NAME$1 in domIterables$1) {
    var Collection$1 = global_1$1[COLLECTION_NAME$1];
    var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype$1 && CollectionPrototype$1.forEach !== arrayForEach$1) try {
      createNonEnumerableProperty$1(CollectionPrototype$1, 'forEach', arrayForEach$1);
    } catch (error) {
      CollectionPrototype$1.forEach = arrayForEach$1;
    }
  }

  var ITERATOR$6 = wellKnownSymbol$1('iterator');
  var TO_STRING_TAG$4 = wellKnownSymbol$1('toStringTag');
  var ArrayValues = es_array_iterator.values;

  for (var COLLECTION_NAME$1$1 in domIterables$1) {
    var Collection$1$1 = global_1$1[COLLECTION_NAME$1$1];
    var CollectionPrototype$1$1 = Collection$1$1 && Collection$1$1.prototype;
    if (CollectionPrototype$1$1) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype$1$1[ITERATOR$6] !== ArrayValues) try {
        createNonEnumerableProperty$1(CollectionPrototype$1$1, ITERATOR$6, ArrayValues);
      } catch (error) {
        CollectionPrototype$1$1[ITERATOR$6] = ArrayValues;
      }
      if (!CollectionPrototype$1$1[TO_STRING_TAG$4]) {
        createNonEnumerableProperty$1(CollectionPrototype$1$1, TO_STRING_TAG$4, COLLECTION_NAME$1$1);
      }
      if (domIterables$1[COLLECTION_NAME$1$1]) for (var METHOD_NAME in es_array_iterator) {
        // some Chrome versions have non-configurable methods on DOMTokenList
        if (CollectionPrototype$1$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
          createNonEnumerableProperty$1(CollectionPrototype$1$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
        } catch (error) {
          CollectionPrototype$1$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
        }
      }
    }
  }

  var FORCED$l = !global_1$1.setImmediate || !global_1$1.clearImmediate;

  // http://w3c.github.io/setImmediate/
  _export$1({ global: true, bind: true, enumerable: true, forced: FORCED$l }, {
    // `setImmediate` method
    // http://w3c.github.io/setImmediate/#si-setImmediate
    setImmediate: task.set,
    // `clearImmediate` method
    // http://w3c.github.io/setImmediate/#si-clearImmediate
    clearImmediate: task.clear
  });

  var process$4 = global_1$1.process;
  var isNode = classofRaw$1(process$4) == 'process';

  // `queueMicrotask` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
  _export$1({ global: true, enumerable: true, noTargetGet: true }, {
    queueMicrotask: function queueMicrotask(fn) {
      var domain = isNode && process$4.domain;
      microtask(domain ? domain.bind(fn) : fn);
    }
  });

  var slice$1 = [].slice;
  var MSIE = /MSIE .\./.test(engineUserAgent$1); // <- dirty ie9- check

  var wrap$1 = function (scheduler) {
    return function (handler, timeout /* , ...arguments */) {
      var boundArgs = arguments.length > 2;
      var args = boundArgs ? slice$1.call(arguments, 2) : undefined;
      return scheduler(boundArgs ? function () {
        // eslint-disable-next-line no-new-func
        (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
      } : handler, timeout);
    };
  };

  // ie9- setTimeout & setInterval additional parameters fix
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
  _export$1({ global: true, bind: true, forced: MSIE }, {
    // `setTimeout` method
    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
    setTimeout: wrap$1(global_1$1.setTimeout),
    // `setInterval` method
    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
    setInterval: wrap$1(global_1$1.setInterval)
  });

  var ITERATOR$7 = wellKnownSymbol$1('iterator');

  var nativeUrl = !fails$1(function () {
    var url = new URL('b?a=1&b=2&c=3', 'http://a');
    var searchParams = url.searchParams;
    var result = '';
    url.pathname = 'c%20d';
    searchParams.forEach(function (value, key) {
      searchParams['delete']('b');
      result += key + value;
    });
    return (isPure && !url.toJSON)
      || !searchParams.sort
      || url.href !== 'http://a/c%20d?a=1&c=3'
      || searchParams.get('c') !== '3'
      || String(new URLSearchParams('?a=1')) !== 'a=1'
      || !searchParams[ITERATOR$7]
      // throws in Edge
      || new URL('https://a@b').username !== 'a'
      || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
      // not punycoded in Edge
      || new URL('http://тест').host !== 'xn--e1aybc'
      // not escaped in Chrome 62-
      || new URL('http://a#б').hash !== '#%D0%B1'
      // fails in Chrome 66-
      || result !== 'a1c3'
      // throws in Safari
      || new URL('http://x', undefined).host !== 'x';
  });

  // based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
  var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128; // 0x80
  var delimiter = '-'; // '\x2D'
  var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
  var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
  var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
  var baseMinusTMin = base - tMin;
  var floor$8 = Math.floor;
  var stringFromCharCode = String.fromCharCode;

  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   */
  var ucs2decode = function (string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    while (counter < length) {
      var value = string.charCodeAt(counter++);
      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // It's a high surrogate, and there is a next character.
        var extra = string.charCodeAt(counter++);
        if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // It's an unmatched surrogate; only append this code unit, in case the
          // next code unit is the high surrogate of a surrogate pair.
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }
    return output;
  };

  /**
   * Converts a digit/integer into a basic code point.
   */
  var digitToBasic = function (digit) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26);
  };

  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   */
  var adapt = function (delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor$8(delta / damp) : delta >> 1;
    delta += floor$8(delta / numPoints);
    for (; delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor$8(delta / baseMinusTMin);
    }
    return floor$8(k + (baseMinusTMin + 1) * delta / (delta + skew));
  };

  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   */
  // eslint-disable-next-line  max-statements
  var encode = function (input) {
    var output = [];

    // Convert the input in UCS-2 to an array of Unicode code points.
    input = ucs2decode(input);

    // Cache the length.
    var inputLength = input.length;

    // Initialize the state.
    var n = initialN;
    var delta = 0;
    var bias = initialBias;
    var i, currentValue;

    // Handle the basic code points.
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < 0x80) {
        output.push(stringFromCharCode(currentValue));
      }
    }

    var basicLength = output.length; // number of basic code points.
    var handledCPCount = basicLength; // number of code points that have been handled;

    // Finish the basic string with a delimiter unless it's empty.
    if (basicLength) {
      output.push(delimiter);
    }

    // Main encoding loop:
    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next larger one:
      var m = maxInt;
      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      }

      // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
      var handledCPCountPlusOne = handledCPCount + 1;
      if (m - n > floor$8((maxInt - delta) / handledCPCountPlusOne)) {
        throw RangeError(OVERFLOW_ERROR);
      }

      delta += (m - n) * handledCPCountPlusOne;
      n = m;

      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue < n && ++delta > maxInt) {
          throw RangeError(OVERFLOW_ERROR);
        }
        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer.
          var q = delta;
          for (var k = base; /* no condition */; k += base) {
            var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
            if (q < t) break;
            var qMinusT = q - t;
            var baseMinusT = base - t;
            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
            q = floor$8(qMinusT / baseMinusT);
          }

          output.push(stringFromCharCode(digitToBasic(q)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }

      ++delta;
      ++n;
    }
    return output.join('');
  };

  var stringPunycodeToAscii = function (input) {
    var encoded = [];
    var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
    var i, label;
    for (i = 0; i < labels.length; i++) {
      label = labels[i];
      encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
    }
    return encoded.join('.');
  };

  var getIterator = function (it) {
    var iteratorMethod = getIteratorMethod(it);
    if (typeof iteratorMethod != 'function') {
      throw TypeError(String(it) + ' is not iterable');
    } return anObject$1(iteratorMethod.call(it));
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















  var $fetch$1 = getBuiltIn$1('fetch');
  var Headers = getBuiltIn$1('Headers');
  var ITERATOR$8 = wellKnownSymbol$1('iterator');
  var URL_SEARCH_PARAMS = 'URLSearchParams';
  var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
  var setInternalState$9 = internalState$1.set;
  var getInternalParamsState = internalState$1.getterFor(URL_SEARCH_PARAMS);
  var getInternalIteratorState = internalState$1.getterFor(URL_SEARCH_PARAMS_ITERATOR);

  var plus = /\+/g;
  var sequences = Array(4);

  var percentSequence = function (bytes) {
    return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
  };

  var percentDecode = function (sequence) {
    try {
      return decodeURIComponent(sequence);
    } catch (error) {
      return sequence;
    }
  };

  var deserialize = function (it) {
    var result = it.replace(plus, ' ');
    var bytes = 4;
    try {
      return decodeURIComponent(result);
    } catch (error) {
      while (bytes) {
        result = result.replace(percentSequence(bytes--), percentDecode);
      }
      return result;
    }
  };

  var find$1 = /[!'()~]|%20/g;

  var replace = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+'
  };

  var replacer = function (match) {
    return replace[match];
  };

  var serialize = function (it) {
    return encodeURIComponent(it).replace(find$1, replacer);
  };

  var parseSearchParams = function (result, query) {
    if (query) {
      var attributes = query.split('&');
      var index = 0;
      var attribute, entry;
      while (index < attributes.length) {
        attribute = attributes[index++];
        if (attribute.length) {
          entry = attribute.split('=');
          result.push({
            key: deserialize(entry.shift()),
            value: deserialize(entry.join('='))
          });
        }
      }
    }
  };

  var updateSearchParams = function (query) {
    this.entries.length = 0;
    parseSearchParams(this.entries, query);
  };

  var validateArgumentsLength = function (passed, required) {
    if (passed < required) throw TypeError('Not enough arguments');
  };

  var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
    setInternalState$9(this, {
      type: URL_SEARCH_PARAMS_ITERATOR,
      iterator: getIterator(getInternalParamsState(params).entries),
      kind: kind
    });
  }, 'Iterator', function next() {
    var state = getInternalIteratorState(this);
    var kind = state.kind;
    var step = state.iterator.next();
    var entry = step.value;
    if (!step.done) {
      step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
    } return step;
  });

  // `URLSearchParams` constructor
  // https://url.spec.whatwg.org/#interface-urlsearchparams
  var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
    anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
    var init = arguments.length > 0 ? arguments[0] : undefined;
    var that = this;
    var entries = [];
    var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

    setInternalState$9(that, {
      type: URL_SEARCH_PARAMS,
      entries: entries,
      updateURL: function () { /* empty */ },
      updateSearchParams: updateSearchParams
    });

    if (init !== undefined) {
      if (isObject$1(init)) {
        iteratorMethod = getIteratorMethod(init);
        if (typeof iteratorMethod === 'function') {
          iterator = iteratorMethod.call(init);
          next = iterator.next;
          while (!(step = next.call(iterator)).done) {
            entryIterator = getIterator(anObject$1(step.value));
            entryNext = entryIterator.next;
            if (
              (first = entryNext.call(entryIterator)).done ||
              (second = entryNext.call(entryIterator)).done ||
              !entryNext.call(entryIterator).done
            ) throw TypeError('Expected sequence with length 2');
            entries.push({ key: first.value + '', value: second.value + '' });
          }
        } else for (key in init) if (has$2(init, key)) entries.push({ key: key, value: init[key] + '' });
      } else {
        parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
      }
    }
  };

  var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

  redefineAll(URLSearchParamsPrototype, {
    // `URLSearchParams.prototype.appent` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-append
    append: function append(name, value) {
      validateArgumentsLength(arguments.length, 2);
      var state = getInternalParamsState(this);
      state.entries.push({ key: name + '', value: value + '' });
      state.updateURL();
    },
    // `URLSearchParams.prototype.delete` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
    'delete': function (name) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var key = name + '';
      var index = 0;
      while (index < entries.length) {
        if (entries[index].key === key) entries.splice(index, 1);
        else index++;
      }
      state.updateURL();
    },
    // `URLSearchParams.prototype.get` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-get
    get: function get(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) return entries[index].value;
      }
      return null;
    },
    // `URLSearchParams.prototype.getAll` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
    getAll: function getAll(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var result = [];
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) result.push(entries[index].value);
      }
      return result;
    },
    // `URLSearchParams.prototype.has` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-has
    has: function has(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var index = 0;
      while (index < entries.length) {
        if (entries[index++].key === key) return true;
      }
      return false;
    },
    // `URLSearchParams.prototype.set` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-set
    set: function set(name, value) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var found = false;
      var key = name + '';
      var val = value + '';
      var index = 0;
      var entry;
      for (; index < entries.length; index++) {
        entry = entries[index];
        if (entry.key === key) {
          if (found) entries.splice(index--, 1);
          else {
            found = true;
            entry.value = val;
          }
        }
      }
      if (!found) entries.push({ key: key, value: val });
      state.updateURL();
    },
    // `URLSearchParams.prototype.sort` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
    sort: function sort() {
      var state = getInternalParamsState(this);
      var entries = state.entries;
      // Array#sort is not stable in some engines
      var slice = entries.slice();
      var entry, entriesIndex, sliceIndex;
      entries.length = 0;
      for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
        entry = slice[sliceIndex];
        for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
          if (entries[entriesIndex].key > entry.key) {
            entries.splice(entriesIndex, 0, entry);
            break;
          }
        }
        if (entriesIndex === sliceIndex) entries.push(entry);
      }
      state.updateURL();
    },
    // `URLSearchParams.prototype.forEach` method
    forEach: function forEach(callback /* , thisArg */) {
      var entries = getInternalParamsState(this).entries;
      var boundFunction = functionBindContext$1(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
      var index = 0;
      var entry;
      while (index < entries.length) {
        entry = entries[index++];
        boundFunction(entry.value, entry.key, this);
      }
    },
    // `URLSearchParams.prototype.keys` method
    keys: function keys() {
      return new URLSearchParamsIterator(this, 'keys');
    },
    // `URLSearchParams.prototype.values` method
    values: function values() {
      return new URLSearchParamsIterator(this, 'values');
    },
    // `URLSearchParams.prototype.entries` method
    entries: function entries() {
      return new URLSearchParamsIterator(this, 'entries');
    }
  }, { enumerable: true });

  // `URLSearchParams.prototype[@@iterator]` method
  redefine$1(URLSearchParamsPrototype, ITERATOR$8, URLSearchParamsPrototype.entries);

  // `URLSearchParams.prototype.toString` method
  // https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
  redefine$1(URLSearchParamsPrototype, 'toString', function toString() {
    var entries = getInternalParamsState(this).entries;
    var result = [];
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      result.push(serialize(entry.key) + '=' + serialize(entry.value));
    } return result.join('&');
  }, { enumerable: true });

  setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

  _export$1({ global: true, forced: !nativeUrl }, {
    URLSearchParams: URLSearchParamsConstructor
  });

  // Wrap `fetch` for correct work with polyfilled `URLSearchParams`
  // https://github.com/zloirock/core-js/issues/674
  if (!nativeUrl && typeof $fetch$1 == 'function' && typeof Headers == 'function') {
    _export$1({ global: true, enumerable: true, forced: true }, {
      fetch: function fetch(input /* , init */) {
        var args = [input];
        var init, body, headers;
        if (arguments.length > 1) {
          init = arguments[1];
          if (isObject$1(init)) {
            body = init.body;
            if (classof(body) === URL_SEARCH_PARAMS) {
              headers = init.headers ? new Headers(init.headers) : new Headers();
              if (!headers.has('content-type')) {
                headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
              }
              init = objectCreate(init, {
                body: createPropertyDescriptor$1(0, String(body)),
                headers: createPropertyDescriptor$1(0, headers)
              });
            }
          }
          args.push(init);
        } return $fetch$1.apply(this, args);
      }
    });
  }

  var web_urlSearchParams = {
    URLSearchParams: URLSearchParamsConstructor,
    getState: getInternalParamsState
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











  var codeAt$1 = stringMultibyte.codeAt;





  var NativeURL = global_1$1.URL;
  var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
  var getInternalSearchParamsState = web_urlSearchParams.getState;
  var setInternalState$a = internalState$1.set;
  var getInternalURLState = internalState$1.getterFor('URL');
  var floor$9 = Math.floor;
  var pow$4 = Math.pow;

  var INVALID_AUTHORITY = 'Invalid authority';
  var INVALID_SCHEME = 'Invalid scheme';
  var INVALID_HOST = 'Invalid host';
  var INVALID_PORT = 'Invalid port';

  var ALPHA = /[A-Za-z]/;
  var ALPHANUMERIC = /[\d+\-.A-Za-z]/;
  var DIGIT = /\d/;
  var HEX_START = /^(0x|0X)/;
  var OCT = /^[0-7]+$/;
  var DEC = /^\d+$/;
  var HEX = /^[\dA-Fa-f]+$/;
  // eslint-disable-next-line no-control-regex
  var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
  // eslint-disable-next-line no-control-regex
  var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
  // eslint-disable-next-line no-control-regex
  var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
  // eslint-disable-next-line no-control-regex
  var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
  var EOF;

  var parseHost = function (url, input) {
    var result, codePoints, index;
    if (input.charAt(0) == '[') {
      if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
      result = parseIPv6(input.slice(1, -1));
      if (!result) return INVALID_HOST;
      url.host = result;
    // opaque host
    } else if (!isSpecial(url)) {
      if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
      result = '';
      codePoints = arrayFrom(input);
      for (index = 0; index < codePoints.length; index++) {
        result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
      }
      url.host = result;
    } else {
      input = stringPunycodeToAscii(input);
      if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
      result = parseIPv4(input);
      if (result === null) return INVALID_HOST;
      url.host = result;
    }
  };

  var parseIPv4 = function (input) {
    var parts = input.split('.');
    var partsLength, numbers, index, part, radix, number, ipv4;
    if (parts.length && parts[parts.length - 1] == '') {
      parts.pop();
    }
    partsLength = parts.length;
    if (partsLength > 4) return input;
    numbers = [];
    for (index = 0; index < partsLength; index++) {
      part = parts[index];
      if (part == '') return input;
      radix = 10;
      if (part.length > 1 && part.charAt(0) == '0') {
        radix = HEX_START.test(part) ? 16 : 8;
        part = part.slice(radix == 8 ? 1 : 2);
      }
      if (part === '') {
        number = 0;
      } else {
        if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
        number = parseInt(part, radix);
      }
      numbers.push(number);
    }
    for (index = 0; index < partsLength; index++) {
      number = numbers[index];
      if (index == partsLength - 1) {
        if (number >= pow$4(256, 5 - partsLength)) return null;
      } else if (number > 255) return null;
    }
    ipv4 = numbers.pop();
    for (index = 0; index < numbers.length; index++) {
      ipv4 += numbers[index] * pow$4(256, 3 - index);
    }
    return ipv4;
  };

  // eslint-disable-next-line max-statements
  var parseIPv6 = function (input) {
    var address = [0, 0, 0, 0, 0, 0, 0, 0];
    var pieceIndex = 0;
    var compress = null;
    var pointer = 0;
    var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

    var char = function () {
      return input.charAt(pointer);
    };

    if (char() == ':') {
      if (input.charAt(1) != ':') return;
      pointer += 2;
      pieceIndex++;
      compress = pieceIndex;
    }
    while (char()) {
      if (pieceIndex == 8) return;
      if (char() == ':') {
        if (compress !== null) return;
        pointer++;
        pieceIndex++;
        compress = pieceIndex;
        continue;
      }
      value = length = 0;
      while (length < 4 && HEX.test(char())) {
        value = value * 16 + parseInt(char(), 16);
        pointer++;
        length++;
      }
      if (char() == '.') {
        if (length == 0) return;
        pointer -= length;
        if (pieceIndex > 6) return;
        numbersSeen = 0;
        while (char()) {
          ipv4Piece = null;
          if (numbersSeen > 0) {
            if (char() == '.' && numbersSeen < 4) pointer++;
            else return;
          }
          if (!DIGIT.test(char())) return;
          while (DIGIT.test(char())) {
            number = parseInt(char(), 10);
            if (ipv4Piece === null) ipv4Piece = number;
            else if (ipv4Piece == 0) return;
            else ipv4Piece = ipv4Piece * 10 + number;
            if (ipv4Piece > 255) return;
            pointer++;
          }
          address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
          numbersSeen++;
          if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
        }
        if (numbersSeen != 4) return;
        break;
      } else if (char() == ':') {
        pointer++;
        if (!char()) return;
      } else if (char()) return;
      address[pieceIndex++] = value;
    }
    if (compress !== null) {
      swaps = pieceIndex - compress;
      pieceIndex = 7;
      while (pieceIndex != 0 && swaps > 0) {
        swap = address[pieceIndex];
        address[pieceIndex--] = address[compress + swaps - 1];
        address[compress + --swaps] = swap;
      }
    } else if (pieceIndex != 8) return;
    return address;
  };

  var findLongestZeroSequence = function (ipv6) {
    var maxIndex = null;
    var maxLength = 1;
    var currStart = null;
    var currLength = 0;
    var index = 0;
    for (; index < 8; index++) {
      if (ipv6[index] !== 0) {
        if (currLength > maxLength) {
          maxIndex = currStart;
          maxLength = currLength;
        }
        currStart = null;
        currLength = 0;
      } else {
        if (currStart === null) currStart = index;
        ++currLength;
      }
    }
    if (currLength > maxLength) {
      maxIndex = currStart;
      maxLength = currLength;
    }
    return maxIndex;
  };

  var serializeHost = function (host) {
    var result, index, compress, ignore0;
    // ipv4
    if (typeof host == 'number') {
      result = [];
      for (index = 0; index < 4; index++) {
        result.unshift(host % 256);
        host = floor$9(host / 256);
      } return result.join('.');
    // ipv6
    } else if (typeof host == 'object') {
      result = '';
      compress = findLongestZeroSequence(host);
      for (index = 0; index < 8; index++) {
        if (ignore0 && host[index] === 0) continue;
        if (ignore0) ignore0 = false;
        if (compress === index) {
          result += index ? ':' : '::';
          ignore0 = true;
        } else {
          result += host[index].toString(16);
          if (index < 7) result += ':';
        }
      }
      return '[' + result + ']';
    } return host;
  };

  var C0ControlPercentEncodeSet = {};
  var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
    ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
  });
  var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
    '#': 1, '?': 1, '{': 1, '}': 1
  });
  var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
    '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
  });

  var percentEncode = function (char, set) {
    var code = codeAt$1(char, 0);
    return code > 0x20 && code < 0x7F && !has$2(set, char) ? char : encodeURIComponent(char);
  };

  var specialSchemes = {
    ftp: 21,
    file: null,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
  };

  var isSpecial = function (url) {
    return has$2(specialSchemes, url.scheme);
  };

  var includesCredentials = function (url) {
    return url.username != '' || url.password != '';
  };

  var cannotHaveUsernamePasswordPort = function (url) {
    return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
  };

  var isWindowsDriveLetter = function (string, normalized) {
    var second;
    return string.length == 2 && ALPHA.test(string.charAt(0))
      && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
  };

  var startsWithWindowsDriveLetter = function (string) {
    var third;
    return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
      string.length == 2 ||
      ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
    );
  };

  var shortenURLsPath = function (url) {
    var path = url.path;
    var pathSize = path.length;
    if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
      path.pop();
    }
  };

  var isSingleDot = function (segment) {
    return segment === '.' || segment.toLowerCase() === '%2e';
  };

  var isDoubleDot = function (segment) {
    segment = segment.toLowerCase();
    return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
  };

  // States:
  var SCHEME_START = {};
  var SCHEME = {};
  var NO_SCHEME = {};
  var SPECIAL_RELATIVE_OR_AUTHORITY = {};
  var PATH_OR_AUTHORITY = {};
  var RELATIVE = {};
  var RELATIVE_SLASH = {};
  var SPECIAL_AUTHORITY_SLASHES = {};
  var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
  var AUTHORITY = {};
  var HOST = {};
  var HOSTNAME = {};
  var PORT = {};
  var FILE = {};
  var FILE_SLASH = {};
  var FILE_HOST = {};
  var PATH_START = {};
  var PATH = {};
  var CANNOT_BE_A_BASE_URL_PATH = {};
  var QUERY = {};
  var FRAGMENT = {};

  // eslint-disable-next-line max-statements
  var parseURL = function (url, input, stateOverride, base) {
    var state = stateOverride || SCHEME_START;
    var pointer = 0;
    var buffer = '';
    var seenAt = false;
    var seenBracket = false;
    var seenPasswordToken = false;
    var codePoints, char, bufferCodePoints, failure;

    if (!stateOverride) {
      url.scheme = '';
      url.username = '';
      url.password = '';
      url.host = null;
      url.port = null;
      url.path = [];
      url.query = null;
      url.fragment = null;
      url.cannotBeABaseURL = false;
      input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
    }

    input = input.replace(TAB_AND_NEW_LINE, '');

    codePoints = arrayFrom(input);

    while (pointer <= codePoints.length) {
      char = codePoints[pointer];
      switch (state) {
        case SCHEME_START:
          if (char && ALPHA.test(char)) {
            buffer += char.toLowerCase();
            state = SCHEME;
          } else if (!stateOverride) {
            state = NO_SCHEME;
            continue;
          } else return INVALID_SCHEME;
          break;

        case SCHEME:
          if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
            buffer += char.toLowerCase();
          } else if (char == ':') {
            if (stateOverride && (
              (isSpecial(url) != has$2(specialSchemes, buffer)) ||
              (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
              (url.scheme == 'file' && !url.host)
            )) return;
            url.scheme = buffer;
            if (stateOverride) {
              if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
              return;
            }
            buffer = '';
            if (url.scheme == 'file') {
              state = FILE;
            } else if (isSpecial(url) && base && base.scheme == url.scheme) {
              state = SPECIAL_RELATIVE_OR_AUTHORITY;
            } else if (isSpecial(url)) {
              state = SPECIAL_AUTHORITY_SLASHES;
            } else if (codePoints[pointer + 1] == '/') {
              state = PATH_OR_AUTHORITY;
              pointer++;
            } else {
              url.cannotBeABaseURL = true;
              url.path.push('');
              state = CANNOT_BE_A_BASE_URL_PATH;
            }
          } else if (!stateOverride) {
            buffer = '';
            state = NO_SCHEME;
            pointer = 0;
            continue;
          } else return INVALID_SCHEME;
          break;

        case NO_SCHEME:
          if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
          if (base.cannotBeABaseURL && char == '#') {
            url.scheme = base.scheme;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            url.cannotBeABaseURL = true;
            state = FRAGMENT;
            break;
          }
          state = base.scheme == 'file' ? FILE : RELATIVE;
          continue;

        case SPECIAL_RELATIVE_OR_AUTHORITY:
          if (char == '/' && codePoints[pointer + 1] == '/') {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            pointer++;
          } else {
            state = RELATIVE;
            continue;
          } break;

        case PATH_OR_AUTHORITY:
          if (char == '/') {
            state = AUTHORITY;
            break;
          } else {
            state = PATH;
            continue;
          }

        case RELATIVE:
          url.scheme = base.scheme;
          if (char == EOF) {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '/' || (char == '\\' && isSpecial(url))) {
            state = RELATIVE_SLASH;
          } else if (char == '?') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.path.pop();
            state = PATH;
            continue;
          } break;

        case RELATIVE_SLASH:
          if (isSpecial(url) && (char == '/' || char == '\\')) {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          } else if (char == '/') {
            state = AUTHORITY;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            state = PATH;
            continue;
          } break;

        case SPECIAL_AUTHORITY_SLASHES:
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
          pointer++;
          break;

        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
          if (char != '/' && char != '\\') {
            state = AUTHORITY;
            continue;
          } break;

        case AUTHORITY:
          if (char == '@') {
            if (seenAt) buffer = '%40' + buffer;
            seenAt = true;
            bufferCodePoints = arrayFrom(buffer);
            for (var i = 0; i < bufferCodePoints.length; i++) {
              var codePoint = bufferCodePoints[i];
              if (codePoint == ':' && !seenPasswordToken) {
                seenPasswordToken = true;
                continue;
              }
              var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
              if (seenPasswordToken) url.password += encodedCodePoints;
              else url.username += encodedCodePoints;
            }
            buffer = '';
          } else if (
            char == EOF || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial(url))
          ) {
            if (seenAt && buffer == '') return INVALID_AUTHORITY;
            pointer -= arrayFrom(buffer).length + 1;
            buffer = '';
            state = HOST;
          } else buffer += char;
          break;

        case HOST:
        case HOSTNAME:
          if (stateOverride && url.scheme == 'file') {
            state = FILE_HOST;
            continue;
          } else if (char == ':' && !seenBracket) {
            if (buffer == '') return INVALID_HOST;
            failure = parseHost(url, buffer);
            if (failure) return failure;
            buffer = '';
            state = PORT;
            if (stateOverride == HOSTNAME) return;
          } else if (
            char == EOF || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial(url))
          ) {
            if (isSpecial(url) && buffer == '') return INVALID_HOST;
            if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
            failure = parseHost(url, buffer);
            if (failure) return failure;
            buffer = '';
            state = PATH_START;
            if (stateOverride) return;
            continue;
          } else {
            if (char == '[') seenBracket = true;
            else if (char == ']') seenBracket = false;
            buffer += char;
          } break;

        case PORT:
          if (DIGIT.test(char)) {
            buffer += char;
          } else if (
            char == EOF || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial(url)) ||
            stateOverride
          ) {
            if (buffer != '') {
              var port = parseInt(buffer, 10);
              if (port > 0xFFFF) return INVALID_PORT;
              url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
              buffer = '';
            }
            if (stateOverride) return;
            state = PATH_START;
            continue;
          } else return INVALID_PORT;
          break;

        case FILE:
          url.scheme = 'file';
          if (char == '/' || char == '\\') state = FILE_SLASH;
          else if (base && base.scheme == 'file') {
            if (char == EOF) {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = base.query;
            } else if (char == '?') {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = '';
              state = QUERY;
            } else if (char == '#') {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = base.query;
              url.fragment = '';
              state = FRAGMENT;
            } else {
              if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
                url.host = base.host;
                url.path = base.path.slice();
                shortenURLsPath(url);
              }
              state = PATH;
              continue;
            }
          } else {
            state = PATH;
            continue;
          } break;

        case FILE_SLASH:
          if (char == '/' || char == '\\') {
            state = FILE_HOST;
            break;
          }
          if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
            if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
            else url.host = base.host;
          }
          state = PATH;
          continue;

        case FILE_HOST:
          if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
            if (!stateOverride && isWindowsDriveLetter(buffer)) {
              state = PATH;
            } else if (buffer == '') {
              url.host = '';
              if (stateOverride) return;
              state = PATH_START;
            } else {
              failure = parseHost(url, buffer);
              if (failure) return failure;
              if (url.host == 'localhost') url.host = '';
              if (stateOverride) return;
              buffer = '';
              state = PATH_START;
            } continue;
          } else buffer += char;
          break;

        case PATH_START:
          if (isSpecial(url)) {
            state = PATH;
            if (char != '/' && char != '\\') continue;
          } else if (!stateOverride && char == '?') {
            url.query = '';
            state = QUERY;
          } else if (!stateOverride && char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            state = PATH;
            if (char != '/') continue;
          } break;

        case PATH:
          if (
            char == EOF || char == '/' ||
            (char == '\\' && isSpecial(url)) ||
            (!stateOverride && (char == '?' || char == '#'))
          ) {
            if (isDoubleDot(buffer)) {
              shortenURLsPath(url);
              if (char != '/' && !(char == '\\' && isSpecial(url))) {
                url.path.push('');
              }
            } else if (isSingleDot(buffer)) {
              if (char != '/' && !(char == '\\' && isSpecial(url))) {
                url.path.push('');
              }
            } else {
              if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                if (url.host) url.host = '';
                buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
              }
              url.path.push(buffer);
            }
            buffer = '';
            if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
              while (url.path.length > 1 && url.path[0] === '') {
                url.path.shift();
              }
            }
            if (char == '?') {
              url.query = '';
              state = QUERY;
            } else if (char == '#') {
              url.fragment = '';
              state = FRAGMENT;
            }
          } else {
            buffer += percentEncode(char, pathPercentEncodeSet);
          } break;

        case CANNOT_BE_A_BASE_URL_PATH:
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
          } break;

        case QUERY:
          if (!stateOverride && char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            if (char == "'" && isSpecial(url)) url.query += '%27';
            else if (char == '#') url.query += '%23';
            else url.query += percentEncode(char, C0ControlPercentEncodeSet);
          } break;

        case FRAGMENT:
          if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
          break;
      }

      pointer++;
    }
  };

  // `URL` constructor
  // https://url.spec.whatwg.org/#url-class
  var URLConstructor = function URL(url /* , base */) {
    var that = anInstance(this, URLConstructor, 'URL');
    var base = arguments.length > 1 ? arguments[1] : undefined;
    var urlString = String(url);
    var state = setInternalState$a(that, { type: 'URL' });
    var baseState, failure;
    if (base !== undefined) {
      if (base instanceof URLConstructor) baseState = getInternalURLState(base);
      else {
        failure = parseURL(baseState = {}, String(base));
        if (failure) throw TypeError(failure);
      }
    }
    failure = parseURL(state, urlString, null, baseState);
    if (failure) throw TypeError(failure);
    var searchParams = state.searchParams = new URLSearchParams$1();
    var searchParamsState = getInternalSearchParamsState(searchParams);
    searchParamsState.updateSearchParams(state.query);
    searchParamsState.updateURL = function () {
      state.query = String(searchParams) || null;
    };
    if (!descriptors$1) {
      that.href = serializeURL.call(that);
      that.origin = getOrigin.call(that);
      that.protocol = getProtocol.call(that);
      that.username = getUsername.call(that);
      that.password = getPassword.call(that);
      that.host = getHost.call(that);
      that.hostname = getHostname.call(that);
      that.port = getPort.call(that);
      that.pathname = getPathname.call(that);
      that.search = getSearch.call(that);
      that.searchParams = getSearchParams.call(that);
      that.hash = getHash.call(that);
    }
  };

  var URLPrototype = URLConstructor.prototype;

  var serializeURL = function () {
    var url = getInternalURLState(this);
    var scheme = url.scheme;
    var username = url.username;
    var password = url.password;
    var host = url.host;
    var port = url.port;
    var path = url.path;
    var query = url.query;
    var fragment = url.fragment;
    var output = scheme + ':';
    if (host !== null) {
      output += '//';
      if (includesCredentials(url)) {
        output += username + (password ? ':' + password : '') + '@';
      }
      output += serializeHost(host);
      if (port !== null) output += ':' + port;
    } else if (scheme == 'file') output += '//';
    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
    if (query !== null) output += '?' + query;
    if (fragment !== null) output += '#' + fragment;
    return output;
  };

  var getOrigin = function () {
    var url = getInternalURLState(this);
    var scheme = url.scheme;
    var port = url.port;
    if (scheme == 'blob') try {
      return new URL(scheme.path[0]).origin;
    } catch (error) {
      return 'null';
    }
    if (scheme == 'file' || !isSpecial(url)) return 'null';
    return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
  };

  var getProtocol = function () {
    return getInternalURLState(this).scheme + ':';
  };

  var getUsername = function () {
    return getInternalURLState(this).username;
  };

  var getPassword = function () {
    return getInternalURLState(this).password;
  };

  var getHost = function () {
    var url = getInternalURLState(this);
    var host = url.host;
    var port = url.port;
    return host === null ? ''
      : port === null ? serializeHost(host)
      : serializeHost(host) + ':' + port;
  };

  var getHostname = function () {
    var host = getInternalURLState(this).host;
    return host === null ? '' : serializeHost(host);
  };

  var getPort = function () {
    var port = getInternalURLState(this).port;
    return port === null ? '' : String(port);
  };

  var getPathname = function () {
    var url = getInternalURLState(this);
    var path = url.path;
    return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  };

  var getSearch = function () {
    var query = getInternalURLState(this).query;
    return query ? '?' + query : '';
  };

  var getSearchParams = function () {
    return getInternalURLState(this).searchParams;
  };

  var getHash = function () {
    var fragment = getInternalURLState(this).fragment;
    return fragment ? '#' + fragment : '';
  };

  var accessorDescriptor = function (getter, setter) {
    return { get: getter, set: setter, configurable: true, enumerable: true };
  };

  if (descriptors$1) {
    objectDefineProperties(URLPrototype, {
      // `URL.prototype.href` accessors pair
      // https://url.spec.whatwg.org/#dom-url-href
      href: accessorDescriptor(serializeURL, function (href) {
        var url = getInternalURLState(this);
        var urlString = String(href);
        var failure = parseURL(url, urlString);
        if (failure) throw TypeError(failure);
        getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
      }),
      // `URL.prototype.origin` getter
      // https://url.spec.whatwg.org/#dom-url-origin
      origin: accessorDescriptor(getOrigin),
      // `URL.prototype.protocol` accessors pair
      // https://url.spec.whatwg.org/#dom-url-protocol
      protocol: accessorDescriptor(getProtocol, function (protocol) {
        var url = getInternalURLState(this);
        parseURL(url, String(protocol) + ':', SCHEME_START);
      }),
      // `URL.prototype.username` accessors pair
      // https://url.spec.whatwg.org/#dom-url-username
      username: accessorDescriptor(getUsername, function (username) {
        var url = getInternalURLState(this);
        var codePoints = arrayFrom(String(username));
        if (cannotHaveUsernamePasswordPort(url)) return;
        url.username = '';
        for (var i = 0; i < codePoints.length; i++) {
          url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
        }
      }),
      // `URL.prototype.password` accessors pair
      // https://url.spec.whatwg.org/#dom-url-password
      password: accessorDescriptor(getPassword, function (password) {
        var url = getInternalURLState(this);
        var codePoints = arrayFrom(String(password));
        if (cannotHaveUsernamePasswordPort(url)) return;
        url.password = '';
        for (var i = 0; i < codePoints.length; i++) {
          url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
        }
      }),
      // `URL.prototype.host` accessors pair
      // https://url.spec.whatwg.org/#dom-url-host
      host: accessorDescriptor(getHost, function (host) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        parseURL(url, String(host), HOST);
      }),
      // `URL.prototype.hostname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hostname
      hostname: accessorDescriptor(getHostname, function (hostname) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        parseURL(url, String(hostname), HOSTNAME);
      }),
      // `URL.prototype.port` accessors pair
      // https://url.spec.whatwg.org/#dom-url-port
      port: accessorDescriptor(getPort, function (port) {
        var url = getInternalURLState(this);
        if (cannotHaveUsernamePasswordPort(url)) return;
        port = String(port);
        if (port == '') url.port = null;
        else parseURL(url, port, PORT);
      }),
      // `URL.prototype.pathname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-pathname
      pathname: accessorDescriptor(getPathname, function (pathname) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        url.path = [];
        parseURL(url, pathname + '', PATH_START);
      }),
      // `URL.prototype.search` accessors pair
      // https://url.spec.whatwg.org/#dom-url-search
      search: accessorDescriptor(getSearch, function (search) {
        var url = getInternalURLState(this);
        search = String(search);
        if (search == '') {
          url.query = null;
        } else {
          if ('?' == search.charAt(0)) search = search.slice(1);
          url.query = '';
          parseURL(url, search, QUERY);
        }
        getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
      }),
      // `URL.prototype.searchParams` getter
      // https://url.spec.whatwg.org/#dom-url-searchparams
      searchParams: accessorDescriptor(getSearchParams),
      // `URL.prototype.hash` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hash
      hash: accessorDescriptor(getHash, function (hash) {
        var url = getInternalURLState(this);
        hash = String(hash);
        if (hash == '') {
          url.fragment = null;
          return;
        }
        if ('#' == hash.charAt(0)) hash = hash.slice(1);
        url.fragment = '';
        parseURL(url, hash, FRAGMENT);
      })
    });
  }

  // `URL.prototype.toJSON` method
  // https://url.spec.whatwg.org/#dom-url-tojson
  redefine$1(URLPrototype, 'toJSON', function toJSON() {
    return serializeURL.call(this);
  }, { enumerable: true });

  // `URL.prototype.toString` method
  // https://url.spec.whatwg.org/#URL-stringification-behavior
  redefine$1(URLPrototype, 'toString', function toString() {
    return serializeURL.call(this);
  }, { enumerable: true });

  if (NativeURL) {
    var nativeCreateObjectURL = NativeURL.createObjectURL;
    var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
    // `URL.createObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    // eslint-disable-next-line no-unused-vars
    if (nativeCreateObjectURL) redefine$1(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
      return nativeCreateObjectURL.apply(NativeURL, arguments);
    });
    // `URL.revokeObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
    // eslint-disable-next-line no-unused-vars
    if (nativeRevokeObjectURL) redefine$1(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
      return nativeRevokeObjectURL.apply(NativeURL, arguments);
    });
  }

  setToStringTag(URLConstructor, 'URL');

  _export$1({ global: true, forced: !nativeUrl, sham: !descriptors$1 }, {
    URL: URLConstructor
  });

  // `URL.prototype.toJSON` method
  // https://url.spec.whatwg.org/#dom-url-tojson
  _export$1({ target: 'URL', proto: true, enumerable: true }, {
    toJSON: function toJSON() {
      return URL.prototype.toString.call(this);
    }
  });

  var EventTarget = /*#__PURE__*/function () {
    function EventTarget() {
      _classCallCheck$1(this, EventTarget);

      this.listeners = {};
    }

    _createClass$1(EventTarget, [{
      key: "addEventListener",
      value: function addEventListener(type, callback) {
        if (!(type in this.listeners)) {
          this.listeners[type] = [];
        }

        this.listeners[type].push(callback);
      }
    }, {
      key: "on",
      value: function on(type, callback) {
        this.addEventListener(type, callback);
        return this;
      }
    }, {
      key: "removeEventListener",
      value: function removeEventListener(type, callback) {
        if (!(type in this.listeners)) {
          return;
        }

        var stack = this.listeners[type];

        for (var i = 0, l = stack.length; i < l; i++) {
          if (stack[i] === callback) {
            stack.splice(i, 1);
            return this.removeEventListener(type, callback);
          }
        }
      }
    }, {
      key: "off",
      value: function off(type, callback) {
        this.removeEventListener(type, callback);
        return this;
      }
    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(event) {
        if (!(event.type in this.listeners)) {
          return;
        }

        var stack = this.listeners[event.type];
        Object.defineProperty(event, 'target', {
          enumerable: false,
          configurable: false,
          writable: false,
          value: this
        });

        for (var i = 0, l = stack.length; i < l; i++) {
          stack[i].call(this, event);
        }
      }
    }]);

    return EventTarget;
  }();

  var scanexEventTarget_cjs = EventTarget;

  //     var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  //         var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
  //          return v.toString(16);
  //     });
  //     return guid;
  // }

  var Layer = /*#__PURE__*/function (_EventTarget) {
    _inherits(Layer, _EventTarget);

    function Layer(container, _ref) {
      var _this;

      var properties = _ref.properties,
          geometry = _ref.geometry;

      _classCallCheck(this, Layer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Layer).call(this));
      _this._container = container;

      _this.render(_this._container);

      _this._properties = properties;
      _this._geometry = geometry;

      _this.initialize();

      return _this;
    }

    _createClass(Layer, [{
      key: "initialize",
      value: function initialize() {
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
            this._type.classList.add('block');

            break;

          case 'Raster':
            this._type.classList.add('picture');

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
      key: "geometry",
      get: function get() {
        return this._geometry;
      }
    }, {
      key: "properties",
      get: function get() {
        return this._properties;
      }
    }, {
      key: "title",
      get: function get() {
        return this._properties.title;
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
  }(scanexEventTarget_cjs);

  var Group = /*#__PURE__*/function (_EventTarget) {
    _inherits(Group, _EventTarget);

    function Group(container, _ref) {
      var _this;

      var properties = _ref.properties,
          children = _ref.children;

      _classCallCheck(this, Group);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Group).call(this));
      _this._container = container;

      _this.render(_this._container);

      _this._properties = properties;

      _this.initialize(children);

      return _this;
    }

    _createClass(Group, [{
      key: "initialize",
      value: function initialize(children) {
        var _this2 = this;

        this._expanded = false;

        this._folder.classList.add('folder-filled');

        this._children.classList.add('scanex-layer-tree-hidden');

        this._folder.addEventListener('click', this._toggleChildren.bind(this));

        this._items = children.map(function (_ref2) {
          var content = _ref2.content,
              type = _ref2.type;
          var item;

          if (type === 'group') {
            item = new Group(_this2._children, content);
          } else if (type === 'layer') {
            item = new Layer(_this2._children, content);
          }

          item.addEventListener('change:visible', _this2._onChangeVisible.bind(_this2));
          item.addEventListener('change:state', _this2._onChangeState.bind(_this2));
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

        this._visibility.addEventListener('click', this._toggleVisibility.bind(this));

        this._title.innerText = this.title;
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
      key: "_onChangeVisible",
      value: function _onChangeVisible(e) {
        e.stopPropagation();
        this.visible = this.childrenVisibility;
      }
    }, {
      key: "_onChangeState",
      value: function _onChangeState(e) {
        e.stopPropagation();
        var event = document.createEvent('Event');
        event.initEvent('change:state', false, false);
        event.detail = e.detail;
        this.dispatchEvent(event);
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
      key: "childrenVisibility",
      set: function set(visible) {
        this._items.forEach(function (item) {
          return item.visible = visible;
        });
      },
      get: function get() {
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
      }
    }, {
      key: "properties",
      get: function get() {
        return this._properties;
      }
    }, {
      key: "title",
      get: function get() {
        return this._properties.title;
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
      set: function set(value) {
        if (value) {
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

        var event = document.createEvent('Event');
        event.initEvent('change:expanded', false, false);
        this.dispatchEvent(event);
      }
    }]);

    return Group;
  }(scanexEventTarget_cjs);

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

  console.log(Result);

  var Example = function Example(container) {
    _classCallCheck(this, Example);

    this._root = new Group(container, Result);

    this._root.on('change:state', function (e) {
      var _e$detail = e.detail,
          title = _e$detail.title,
          visible = _e$detail.visible,
          geometry = _e$detail.geometry;
      console.log({
        title: title,
        visible: visible,
        geometry: geometry
      });
    });
  };

  return Example;

}());
//# sourceMappingURL=main.js.map
