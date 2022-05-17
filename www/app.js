(() => {
  // bundlers/leste.js
  function M(n, t) {
    let e = new WeakMap();
    function i(c) {
      return {set(r, p, h, a) {
        let m = [...c, p], j = m.join("_");
        return t.beforeSet && (h = t.beforeSet(r, m, h, j) || h), h && typeof h == "object" && (h = s(h, m)), r[p] = h, t.set && t.set(r, m, h, j), true;
      }, get(r, p) {
        return t.get && t.get(r, [...c, p]), r[p];
      }, deleteProperty(r, p) {
        if (Reflect.has(r, p)) {
          o(r, p);
          let h = Reflect.deleteProperty(r, p);
          return h && t.deleteProperty && t.deleteProperty(r, [...c, p]), h;
        }
        return false;
      }, getPrototypeOf(r) {
        return {target: r, instance: "Proxy"};
      }};
    }
    function o(c, r) {
      e.has(c[r]) && (c[r] = e.get(c[r]), e.delete(c[r]));
      for (let p of Object.keys(c[r]))
        c[r][p] != null && typeof c[r][p] == "object" && o(c[r], p);
    }
    function s(c, r) {
      for (let h of Object.keys(c))
        c[h] && typeof c[h] == "object" && (c[h] = s(c[h], [...r, h]));
      let p = new Proxy(c, i(r));
      return e.set(p, c), p;
    }
    return s(n, []);
  }
  var y = null;
  function N(n, t) {
    return clearTimeout(y), new Promise((e) => {
      y = setTimeout(() => {
        n && n(), clearTimeout(y), e();
      }, t || 0);
    });
  }
  function f(n) {
    return !n || n instanceof HTMLCollection || n instanceof NodeList || n instanceof Element ? n : JSON.parse(JSON.stringify(n));
  }
  var P = ["Error props type", "Node with ingrate must bu empty"];
  function k() {
    for (let [n, t] of Object.entries(this.node.classes)) {
      let e = () => {
        t() ? this.nodeElement.classList.add(n) : this.nodeElement.classList.remove(n);
      };
      this.refs.length = 0, e(), this.nodeElement.reactive(this.refs, "classes", e);
    }
  }
  function C(n, t = 300) {
    let e;
    return (...i) => {
      e || n.apply(this, i), clearTimeout(e), e = setTimeout(() => {
        e = null;
      }, t);
    };
  }
  function q(n, t) {
    typeof t == "function" && (this.nodeElement[n] = (e) => this.node[n].bind(this.context)(e, C));
  }
  function _(n, t) {
    if (typeof t == "function") {
      let e = () => {
        let i = t.bind(this.context)();
        typeof i == "object" ? Object.assign(this.nodeElement[n], i) : this.nodeElement[n] = i;
      };
      this.refs.length = 0, e(), this.nodeElement.reactive(this.refs, n, e);
    } else
      this.nodeElement[n] = t;
  }
  function A(n, t) {
    n in this.nodeElement && (n.substr(0, 2) === "on" ? this.listeners(n, t) : this.general(n, t));
  }
  var L = {native: A, listeners: q, general: _};
  function g(n) {
    let t = new this.Component(n || this.node.component, this.context, this.keyNode, this.nodeElement, this.common), e = {}, i = n?.proxies || this.node.component.proxies;
    if (i)
      for (let [o, s] of Object.entries(i))
        typeof s == "function" && s.name ? (this.refs.length = 0, Object.assign(e, {[o]: s()}), this.nodeElement.reactive(this.refs, "component", () => {
          let c = s();
          this.nodeElement.proxy[o] = c;
        })) : Object.assign(e, {[o]: s});
    return {component: t, proxies: e};
  }
  var l = class {
    constructor(t, e, i, o) {
      this.nodeElement = t, this.props = e, this.append = o, this.data = i;
    }
    async length(t) {
      t > this.nodeElement.children.length && await this.add(t), t < this.nodeElement.children.length && this.remove(t);
    }
    async set(t) {
      this.remove(0), await this.add(t.length);
    }
    async add(t) {
      let e = this.nodeElement.children.length;
      for (; t > e; )
        await this.append(e), e++;
    }
    remove(t) {
      let e = this.nodeElement.children.length;
      for (; t < e; )
        e--, this.nodeElement.children[e].unmount();
    }
  };
  async function E() {
    if (this.nodeElement.innerHTML === "") {
      let n = (i, o) => {
        let s = {};
        if (this.node.component.proxies)
          for (let [c, r] of Object.entries(this.node.component.proxies))
            typeof r == "function" && r.name && (this.refs.length = 0, r.length ? Object.assign(s, {[c]: r(i[o], o)}) : Object.assign(s, {[c]: r()}), this.nodeElement.reactive(this.refs, "component", (p, h) => {
              let a = h[1];
              if (a)
                this.nodeElement.children[a].proxy[c] = r(i[a], a);
              else
                for (let m = 0; m < this.nodeElement.children.length; m++)
                  this.nodeElement.children[m].proxy[c] = r(i[m], m);
            }));
        return s;
      };
      this.refs.length = 0;
      let t = this.node.component.data, e = new this.Component(this.node.component, this.context, this.keyNode, this.nodeElement, this.common);
      if (typeof t != "number")
        if (Object.getPrototypeOf(this.node.component.data).instance === "Proxy") {
          let i = t.length, o = this.refs[0], s = o.split("_")[0], c = async (p) => {
            await e.create(this.node.component.src, n(this.node.component.data, p), this.node.component.data[p], p);
          }, r = new l(this.nodeElement, this.node.component.proxies, this.node.component.data, c);
          if (this.nodeElement.reactive([s], "component", (p, h, a) => {
            this.node.component.data = a, r.set.bind(r)(a);
          }), this.nodeElement.reactive([o], "component", (p, h, a) => r.length.bind(r)(a)), i)
            for await (let [p] of t.entries())
              await c(p);
        } else
          for await (let [i, o] of t.entries()) {
            let s = n(t, i);
            await e.create(this.node.component.src, s, o, i);
          }
    } else
      this.nodeElement.textContent = this.common.errors[1], console.error(this.common.errors[1]);
  }
  async function b() {
    this.refs.length = 0;
    let n = this.node.component.precept();
    if (this.nodeElement.reactive(this.refs, "precept", async () => {
      if (this.node.component.precept()) {
        this.nodeElement.unmount();
        let {component: t, proxies: e} = this.simple();
        await t.create(this.node.component.src, e);
      } else
        this.nodeElement.unmount();
    }), n) {
      let {component: t, proxies: e} = this.simple();
      await t.create(this.node.component.src, e);
    }
  }
  async function w() {
    this.nodeElement.integrate = async (e) => {
      let {component: i, proxies: o} = this.simple(e);
      await i.create(e.src, o);
    };
    let {component: n, proxies: t} = this.simple();
    await n.create(this.node.component.src, t);
  }
  var x = class {
    constructor(t, e, i, o, s) {
      this.common = s, this.component = t, this.context = e, this.keyNode = i, this.nodeElement = o, this.props = {methods: {}, proxies: {}, params: {}};
    }
    get options() {
      return this.component;
    }
    propsMethods() {
      let t = this.component.methods;
      if (t)
        for (let [e, i] of Object.entries(t))
          typeof i == "function" && Object.assign(this.props.methods, {[e]: (...o) => i.bind(this.context)(...f(o))});
    }
    propsParams(t, e) {
      let i = this.component.params;
      if (i)
        for (let [o, s] of Object.entries(i))
          typeof s == "function" && s.name ? Object.assign(this.props.params, {[o]: s(t, e)}) : Object.assign(this.props.params, {[o]: s});
    }
    async load(t) {
      return t instanceof Promise ? (await t)?.default : await t;
    }
    async create(t, e, i, o) {
      try {
        if (this.propsMethods(), this.propsParams(i, o), e && (this.props.proxies = e), t) {
          let s = await this.load(t);
          await S(this.nodeElement, s, this.props, o !== void 0);
        }
      } catch (s) {
        console.error(s);
      }
    }
  };
  async function J() {
    if (this.nodeElement.advance = async (n) => {
      await new this.Component(n, this.context, this.keyNode, this.nodeElement, this.common).create(n.src, n.proxies, null, true);
    }, this.node.component.type in this)
      this[this.node.component.type]();
    else {
      let {component: n, proxies: t} = this.simple();
      await n.create(this.node.component.src, t);
    }
  }
  var T = {Component: x, component: J, simple: g, iterate: E, induce: b, integrate: w};
  var d = class {
    constructor(t, e, i, o, s) {
      this.node = t, this.keyNode = e, this.context = i, this.common = s, this.refs = s.refs, this.nodeElement = o, this.nodeElement.reactive = (c, r, p) => {
        c.length && (this.keyNode in this.context.reactiveMap || (this.context.reactiveMap[this.keyNode] = {}), c.forEach((h) => {
          r in this.context.reactiveMap[this.keyNode] || (this.context.reactiveMap[this.keyNode][r] = {}), h in this.context.reactiveMap[this.keyNode][r] || (this.context.reactiveMap[this.keyNode][r][h] = []), this.context.reactiveMap[this.keyNode][r][h].push(p);
        }));
      };
    }
  };
  Object.assign(d.prototype, {classes: k});
  Object.assign(d.prototype, L);
  Object.assign(d.prototype, T);
  var H = d;
  var u = class {
    constructor(t) {
      this.component = t, this.component.proxies || (this.component.proxies = {}), this.common = {refs: [], errors: P}, this.storesHadlers = {}, this.context = {options: t, node: {root: document.querySelector("#root")}, param: {}, reactiveMap: {}, method: {}, proxy: {}, setter: {}, handler: {}, source: t.sources, delay: N};
    }
    async created() {
      this.component.created && await this.component.created.bind(this.context)();
    }
    async loaded() {
      this.component.loaded && await this.component.loaded.bind(this.context)();
    }
    async mounted() {
      this.component.mounted && await this.component.mounted.bind(this.context)();
    }
    async unmounted() {
      if (this.component.stores)
        for (let t of Object.values(this.component.stores))
          document.addEventListener(t.name, this.storesHadlers[t.name]);
      this.component.unmounted && await this.component.unmounted.bind(this.context)();
    }
    stores() {
      if (this.component.stores)
        for (let t of Object.values(this.component.stores)) {
          if (t.params)
            for (let o in t.params)
              o in this.component.props.params && (this.context.param[o] = {...t.params[o]});
          if (t.proxies)
            for (let o in t.proxies)
              o in this.component.props.proxies && (this.component.proxies[o] = f(t.proxies[o]));
          if (t.methods)
            for (let o in t.methods)
              o in this.component.props.methods && (this.context.method[o] = (...s) => t.methods[o].bind(t)(...f(s)));
          let e = t.name, i = (o) => {
            let {path: s, value: c} = o.detail;
            if (t.proxies && s[0] in this.component.props.proxies) {
              let r = this.context.proxy;
              if (s.length > 0) {
                for (let p = 0; p < s.length - 1; p++)
                  r = r[s[p]];
                r[s[s.length - 1]] = c;
              } else
                r[s[0]] = c;
            }
          };
          Object.assign(this.storesHadlers, {[e]: i}), document.addEventListener(e, i, false);
        }
    }
    methods(t) {
      if (t.method || (t.method = {}), this.component.methods)
        for (let [e, i] of Object.entries(this.component.methods))
          this.context.method[e] = i.bind(this.context), t.method[e] = (...o) => this.context.method[e](...f(o));
    }
    setters() {
      if (this.component.setters)
        for (let t in this.component.setters)
          this.context.setter[t] = (e) => this.component.setters[t].bind(this.context)(e);
    }
    handlers() {
      if (this.component.handlers)
        for (let t in this.component.handlers)
          this.context.handler[t] = (e) => this.component.handlers[t].bind(this.context)(e);
    }
    params() {
      if (this.component.params)
        for (let t in this.component.params)
          this.context.param[t] = this.component.params[t];
    }
    props(t, e) {
      e.proxy || (e.proxy = {});
      let i = this.context;
      if (this.component.props) {
        if (t.proxies && this.component.props.proxies)
          for (let o in this.component.props.proxies)
            o in t.proxies ? (this.component.proxies[o] = t.proxies[o], Object.defineProperty(e.proxy, o, {set(s) {
              i.proxy[o] = f(s);
            }})) : this.component.proxies[o] = void 0;
        if (t.methods && this.component.props.methods)
          for (let o in t.methods)
            o in this.component.props.methods && (this.context.method[o] = t.methods[o]);
        if (t.params && this.component.props.params)
          for (let o in this.component.props.params)
            o in t.params ? this.context.param[o] = f(t.params[o]) : this.context.param[o] = void 0;
        this.validation();
      }
    }
    validation() {
      if (this.component.props.proxies)
        for (let [t, e] of Object.entries(this.component.props.proxies))
          (this.component.proxies[t] === void 0 || this.component.proxies[t] === null) && (this.component.proxies[t] = e.default), this.component.props.proxies[t].type && !typeof this.component.proxies[t] === this.component.props.proxies[t].type && console.error("Error props type");
      if (this.component.props.methods)
        for (let t in this.component.props.methods)
          typeof this.component.props.methods != "object" ? console.error("Error props type") : this.component.props.methods[t].instance && this.context.method[t] instanceof this.component.props.methods[t].instance && console.error("Error props instance");
      if (this.component.props.params)
        for (let [t, e] of Object.entries(this.component.props.params))
          (this.context.param[t] === void 0 || this.context.param[t] === null) && (this.context.param[t] = e.default), this.component.props.params[t].type && !typeof this.context.param[t] === this.component.props.params[t].type && console.error("Error props type");
    }
    proxies() {
      let t = this;
      this.context.proxy = M(f(this.component.proxies), {beforeSet(e, i, o, s) {
        return t.context.setter[s]?.bind(t.context)(o);
      }, async set(e, i, o, s) {
        if (t.context.reactiveMap)
          for (let c in t.context.reactiveMap)
            for (let r in t.context.reactiveMap[c]) {
              let p = t.context.reactiveMap[c][r][s];
              if (p?.length)
                for (let h of p)
                  await h(e, i, o);
            }
        return t.context.handler[s]?.bind(t.context)(o);
      }, get(e, i) {
        t.common.refs.push(i.join("_"));
      }, deleteProperty(e, i) {
        console.log("delete", i.join("_"));
      }});
    }
    async nodes(t) {
      if (this.component.nodes) {
        let e = this.component.nodes.bind(this.context)();
        for await (let [i, o] of Object.entries(e)) {
          let s = t.querySelector(`.${i}`) || t.classList.contains(i) && t;
          if (Object.assign(this.context.node, {[i]: s}), o) {
            let c = new H(o, i, this.context, s, this.common);
            for await (let [r, p] of Object.entries(o))
              c.native(r, p), r in c && await c[r](i, p);
          }
        }
      }
    }
  };
  function v(n) {
    let t, e = O(n);
    if (e === "Object")
      t = {};
    else if (e === "Array")
      t = [];
    else
      return n;
    for (let i in n) {
      let o = n[i];
      O(o) === "Object" ? t[i] = {...o} : O(o) === "Array" ? t[i] = [...o] : t[i] = n[i];
    }
    return t;
  }
  function O(n) {
    return n === null ? "Null" : n === void 0 ? "Undefined" : Object.prototype.toString.call(n).slice(8, -1);
  }
  function R(n, t, e) {
    if (n.template)
      return t.insertAdjacentHTML("beforeEnd", n.template), e ? t.lastChild : t;
    if (n.fragments) {
      for (let [i, o] of Object.entries(n.fragments)) {
        let s = t.querySelector(`.${i}`);
        s.innerHTML = o;
      }
      return t;
    }
  }
  async function $(n, t, e = {}, i) {
    if (t) {
      let o = v(t), s = new u(o);
      await s.created(), s.stores(), s.setters(), s.handlers(), s.params();
      let c = R(o, n, i);
      return c.unmount = async () => {
        c.remove(), await s.unmounted();
      }, s.props(e, c), s.methods(c), s.proxies(), await s.nodes(c), await s.mounted(), {options: o, context: s.context};
    }
  }
  var S = $;

  // menu/index.js
  console.log(22);
  var Router = class {
    constructor(routes2, root2) {
      this.current = {options: {}, context: {}, path: ""};
      this.routes = routes2;
      this.root = root2;
      this.from = {};
      this.to = {};
      this.links();
      this.addListener();
      this.update();
      this.layout = false;
    }
    setName(name) {
      this.root.setAttribute("name", name);
    }
    addListener() {
      window.addEventListener("popstate", () => {
        this.update();
      }, false);
    }
    links() {
      this.root.onclick = (event) => {
        const a = event.target.closest("a[link]");
        if (a && a.href) {
          event.preventDefault();
          this.push(a.href);
        }
      };
    }
    params(slugs, parts) {
      const param = {};
      slugs && slugs.forEach((slug, index) => {
        param[slug.substring(1)] = parts[index + 1];
      });
      return {path: parts[0], param};
    }
    push(path) {
      history.pushState(null, null, path);
      this.update();
    }
    async update() {
      const path = decodeURI(window.location.pathname + window.location.search).toString().replace(/\/$/, "").replace(/^\//, "");
      for (const route of this.routes) {
        try {
          const slugs = route.path.match(/:\w+/g);
          const reg = new RegExp("^" + route.path.replace(/:\w+/g, "(\\w+)") + "$");
          const parts = path.match(reg);
          if (parts) {
            this.current.options.leave && this.current.options.leave.bind(this.current.context)(this.from, this.to);
            if (this.current.path === route.path) {
              this.current.options.route && this.current.options.route.bind(this.current.context)(this.from, this.to);
            } else {
              document.title = route.title || "Leste";
              this.setName(route.name);
              const component = route.component;
              this.current.path = route.path;
              if (component.layout && !this.layout) {
                await S(this.root, component.layout);
                this.layout = true;
              }
              this.current = await S(this.root, component);
              this.from = {...this.to};
              this.to = this.params(slugs, parts);
              this.current.context.router = {push: this.push.bind(this), ...this.to};
              this.current.options.loaded && this.current.options.loaded.bind(this.current.context)(this.from, this.to);
            }
            break;
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  };
  var layout = {
    template: `
      <nav class="nav"></nav>
      <div class="content">content</div>
      <div class="footer"></div>`,
    params: {
      menu: [
        {path: "/", name: "home"},
        {path: "/about", name: "about"},
        {path: "/contacts", name: "contacts"}
      ],
      active: null
    },
    nodes() {
      return {
        nav: {
          onclick: (event) => {
            event.preventDefault();
            this.param.active && this.param.active.classList.remove("active");
            this.param.active = event.target.closest("a");
            this.param.active.classList.add("active");
          },
          innerHTML: this.method.getNav()
        },
        footer: {
          innerHTML: this.method.getNav()
        }
      };
    },
    methods: {
      getNav() {
        return this.param.menu.reduce((html, a) => html + `<a href="${a.path}" link><span>${a.name}</span></a>`, "");
      }
    }
  };
  var routes = [
    {
      path: "",
      name: "home",
      component: {
        fragment: {
          content: "<h1>home</h1>"
        },
        layout
      }
    },
    {
      path: "about",
      name: "about",
      component: {
        fragment: {
          content: "<h1>about</h1>"
        },
        layout
      }
    },
    {
      path: "contacts",
      name: "contacts",
      component: {
        fragment: {
          content: "<h1>contacts</h1>"
        },
        layout
      }
    }
  ];
  var root = document.querySelector("#root");
  new Router(routes, root);
})();
//# sourceMappingURL=app.js.map
