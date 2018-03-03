"use strict";

import assert from "assert";
import memoize from "../memoize";

test("called once with same arguments", () => {
  let cnt = 0;
  const obj = {
    method: arg => {
      cnt++;
      return arg;
    }
  };
  const wrapped = memoize({ instance: obj, methods: ["method"] });

  wrapped.method("test");
  wrapped.method("test");

  assert.strictEqual(cnt, 1);
});

test("called twice with different arguments", () => {
  let cnt = 0;
  const obj = {
    method: arg => {
      cnt++;
      return arg;
    }
  };
  const wrapped = memoize({ instance: obj, methods: ["method"] });

  wrapped.method("test1");
  wrapped.method("test2");

  assert.strictEqual(cnt, 2);
});

test("cached result value appropriately", () => {
  const obj = {
    method: () => {
      return "this is test result";
    }
  };
  const wrapped = memoize({ instance: obj, methods: ["method"] });
  assert.strictEqual(wrapped.method("test1"), wrapped.method("test1"));
});

test("cached result value appropriately with multiple function", () => {
  const obj = {
    method1: () => {
      return "this is test result1";
    },
    method2: () => {
      return "this is test result2";
    }
  };
  const wrapped = memoize({ instance: obj, methods: ["method1", "method2"] });
  assert.strictEqual(wrapped.method1("test1"), wrapped.method1("test1"));
  assert.strictEqual(wrapped.method2("test1"), wrapped.method2("test1"));
});

test("using customized cache", () => {
  const obj = {
    method: arg => {
      return arg;
    }
  };
  let getCalled = false;
  let setCalled = false;
  const cache = {
    get: () => {
      getCalled = true;
    },
    set: () => {
      setCalled = true;
    }
  };
  const wrapped = memoize({
    instance: obj,
    methods: ["method"],
    options: {
      cache
    }
  });

  wrapped.method("test1");
  assert(getCalled);
  assert(setCalled);
});

test("using customized keygen function", () => {
  const obj = {
    method: (...arg) => {
      return arg;
    }
  };
  let getCalledKey = "";
  let setCalledKey = "";
  const cache = {
    get: key => {
      getCalledKey = key;
    },
    set: key => {
      setCalledKey = key;
    }
  };
  const keygen = (method, ...args) => {
    return method + "//" + args.join("//");
  };
  const wrapped = memoize({
    instance: obj,
    methods: ["method"],
    options: {
      cache,
      keygen
    }
  });
  const args = ["test1", "test2", "test3"];
  wrapped.method(...args);
  assert.strictEqual(getCalledKey, keygen("method", ...args));
  assert.strictEqual(setCalledKey, keygen("method", ...args));
});

test("method contains 'this' keyword", () => {
  const obj = {
    counter: 0,
    method: function(arg) {
      this.counter++;
      return arg;
    }
  };
  const wrapped = memoize({ instance: obj, methods: ["method"] });

  wrapped.method("test");
  wrapped.method("test");

  assert.strictEqual(wrapped.counter, 1);
});

test("multiple method cache", () => {
  const obj = {
    counter1: 0,
    counter2: 0,
    method1: function(arg) {
      this.counter1++;
      return arg;
    },
    method2: function(arg) {
      this.counter2++;
      return arg;
    }
  };
  const wrapped = memoize({ instance: obj, methods: ["method1", "method2"] });

  wrapped.method1("test");
  wrapped.method1("test");
  wrapped.method2("test");
  wrapped.method2("test");
  assert.strictEqual(wrapped.counter1, 1);
  assert.strictEqual(wrapped.counter2, 1);
  wrapped.method1("test1");
  wrapped.method1("test1");
  wrapped.method2("test1");
  wrapped.method2("test1");
  assert.strictEqual(wrapped.counter1, 2);
  assert.strictEqual(wrapped.counter2, 2);
});

test("purge cache", () => {
  let cnt = 0;
  const obj = {
    method: (...arg) => {
      cnt++;
      return arg;
    }
  };
  const wrapped = memoize({ instance: obj, methods: ["method"] });
  wrapped.method("test1");
  obj._purge("method");
  wrapped.method("test1");
  assert.strictEqual(cnt, 2);
});

test("purge cache with multiple function", () => {
  let cnt1 = 0;
  let cnt2 = 0;
  const obj = {
    method1: (...arg) => {
      cnt1++;
      return arg;
    },
    method2: (...arg) => {
      cnt2++;
      return arg;
    }
  };
  const wrapped = memoize({ instance: obj, methods: ["method1", "method2"] });
  wrapped.method1("test1");
  wrapped.method2("test2");
  obj._purge("method1");
  wrapped.method1("test1");
  wrapped.method2("test2");
  assert.strictEqual(cnt1, 2);
  assert.strictEqual(cnt2, 1);
});
