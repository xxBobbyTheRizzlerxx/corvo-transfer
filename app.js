// node_modules/@trystero-p2p/core/dist/primitives.mjs
var e = /*@__PURE__*/ new TextEncoder(), t = /*@__PURE__*/ new TextDecoder(), n = "Trystero", r = "trystero", i = (e, t) => `${r}:${e}:v${t}`, a = /*@__PURE__*/ Symbol.for(`${r}.socketInitialFailure`), o = /*@__PURE__*/ Symbol.for(`${r}.slot`), s = (e) => /* @__PURE__ */ Error(`${n}: ${e}`), c = (e) => {
	throw s(e);
}, l = JSON.stringify, u = (e) => {
	try {
		return JSON.parse(e);
	} catch {
		throw s(`failed to parse JSON (${e.length} bytes)`);
	}
}, d = (t) => e.encode(t), f = (t, n) => e.encodeInto(t, n), p = (e) => {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e.charCodeAt(n);
		r < 128 ? t += 1 : r < 2048 ? t += 2 : r >= 55296 && r <= 56319 && n + 1 < e.length && (e.charCodeAt(n + 1) & 64512) == 56320 ? (t += 4, n++) : t += 3;
	}
	return t;
}, m = (e) => t.decode(e), h = {
	alphabet: "base64url",
	omitPadding: !0
}, g = { alphabet: "base64url" }, _ = Uint8Array.prototype.toBase64, v = Uint8Array.fromBase64, y = typeof _ == "function" ? (e) => _.call(e, h) : (e) => {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += String.fromCharCode(e[n]);
	return btoa(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}, b = typeof v == "function" ? (e) => v(e, g) : (e) => {
	let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = atob(t + "=".repeat((4 - t.length % 4) % 4)), r = new Uint8Array(n.length);
	for (let e = 0; e < n.length; e++) r[e] = n.charCodeAt(e);
	return r;
}, x = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", S = /^[A-Za-z0-9_-]+$/, C = (e) => {
	let t = 0n;
	for (let n of e) t = t << 8n | BigInt(n);
	return t;
}, w = (e, t) => {
	if (e.byteLength !== t.byteLength) return !1;
	for (let n = 0; n < e.byteLength; n++) if (e[n] !== t[n]) return !1;
	return !0;
}, T = (e) => {
	let t = d(e), n = 2166136261;
	for (let e = 0; e < t.byteLength; e++) n = Math.imul(n ^ t[e], 16777619);
	return n ^= n >>> 16, n = Math.imul(n, 2246822507), n ^= n >>> 13, n = Math.imul(n, 3266489909), (n ^ n >>> 16) >>> 0;
}, E = (e = 4096) => {
	let t = /* @__PURE__ */ new Map();
	return {
		get size() {
			return t.size;
		},
		get: (e) => {
			if (!t.has(e)) return;
			let n = t.get(e);
			return t.delete(e), t.set(e, n), n;
		},
		has: (e) => t.has(e),
		set: (n, r) => {
			if (t.has(n)) t.delete(n);
			else if (t.size >= e) {
				let e = t.keys().next().value;
				e !== void 0 && t.delete(e);
			}
			t.set(n, r);
		},
		delete: (e) => t.delete(e),
		clear: () => t.clear(),
		keys: () => [...t.keys()],
		entries: () => [...t.entries()]
	};
}, D = () => {}, O = (e, t) => console.error(`${n} ${e} error:`, t), k = (e, t) => {
	let n = /* @__PURE__ */ new Set(), r = 0, i = (t, n) => {
		try {
			let r = t(...n);
			r && typeof r.then == "function" && Promise.resolve(r).catch((t) => O(e, t));
		} catch (t) {
			O(e, t);
		}
	};
	return [
		(a, o, l) => {
			if (typeof a != "function") throw s(`${e.endsWith("handler") ? e : `${e} handler`} must be a function`);
			let u = o?.signal;
			if (u?.aborted) return D;
			let d = !!o?.once, f = u ? new AbortController() : null, p, m = () => {
				switch (p.phase) {
					case "closed": return;
					case "replaying": {
						let e = p.abortCleanup;
						p = { phase: "closed" }, e?.abort();
						return;
					}
					case "live": {
						let { entry: e, abortCleanup: r } = p;
						p = { phase: "closed" }, r?.abort(), n.delete(e) && n.size === 0 && t?.(!1);
						return;
					}
					default: c(p);
				}
			}, h = [(...e) => {
				p.phase === "live" && (d && m(), i(a, e));
			}, m], g = () => {
				switch (p.phase) {
					case "replaying": {
						if (p.epoch !== r) {
							m();
							return;
						}
						let e = n.size === 0;
						p = {
							phase: "live",
							entry: h,
							abortCleanup: p.abortCleanup
						}, n.add(h), e && t?.(!0);
						return;
					}
					case "live":
					case "closed": return;
					default: c(p);
				}
			};
			if (p = {
				phase: "replaying",
				epoch: r,
				abortCleanup: f
			}, f && u && u.addEventListener("abort", m, {
				once: !0,
				signal: f.signal
			}), o?.replay && l) {
				let e = () => p;
				for (let t of l()) {
					let n = e();
					if (n.phase !== "replaying" || n.epoch !== r) {
						m();
						break;
					}
					d && m(), i(a, t);
				}
			}
			return g(), m;
		},
		(...e) => {
			for (let t of Array.from(n)) t[0](...e);
		},
		() => {
			r++;
			for (let e of Array.from(n)) e[1]();
		},
		() => n.size > 0
	];
}, A = (e, t) => {
	let n = null;
	return [
		(r, i) => {
			if (typeof r != "function") throw s(`${e} handler must be a function`);
			let a = i?.signal;
			if (a?.aborted) return D;
			if (n) throw s(`${e} handler already registered; unsubscribe first`);
			let o = !!i?.once, c = a ? new AbortController() : null, l = !0, u = () => {
				l && (l = !1, c?.abort(), n?.[1] === u && (n = null, t?.(null)));
			}, d = ((...e) => {
				if (l) return o && u(), r(...e);
			});
			return n = [d, u], c && a && a.addEventListener("abort", u, {
				once: !0,
				signal: c.signal
			}), t?.(d), u;
		},
		() => n?.[0] ?? null,
		() => n?.[1]()
	];
}, j = (e, t) => {
	for (let r of t) {
		let t = e[r];
		Object.defineProperty(e, r, {
			get: () => t,
			set: () => {
				throw TypeError(`${n}: ${r} is a method; call ${r}(handler), which returns an unsubscribe function`);
			},
			enumerable: !0,
			configurable: !0
		});
	}
	return e;
}, M = `__${r}Auth`, N = (e, t) => e < t ? -1 : +(e > t), P = (e) => console.warn(`${n}: ${e}`), F = (e) => P(`no peer with id ${e} found`), I = () => P("roles({selfAsAdmin: true}) with an ephemeral identity orphans the room on close; use identity: 'local' or an imported UserIdentity"), L = (e, t) => console.error(`${n} ${e} error:`, t), R = (e) => L("action handler", e), ee = "peer disconnected", te = /*@__PURE__*/ s(ee), ne = "peer banned", z = /*@__PURE__*/ s(ne), re = (e, t) => ({
	code: "banned",
	message: e ? `${ne}: ${e}` : ne,
	...e === void 0 ? {} : { reason: e },
	...t ? { peerId: t } : {}
}), ie = /*@__PURE__*/ s("peer left room"), ae = /*@__PURE__*/ s("room left"), B = "room full", oe = /*@__PURE__*/ s(B), se = "operation aborted", ce = "insufficient authority", V = /*@__PURE__*/ s("invalid ECDSA P-256 public key"), H = (e) => s(`${e} must be a positive safe integer`), le = (e) => s(`${e} requires roles() in joinRoom config`), ue = /*@__PURE__*/ le("self-certifying room ID"), de = (e) => s(`action type "${e}" cannot be redefined`), fe = (e) => `invalid action ${e}`, pe = (e) => `no active peer with id ${e}`, me = (e) => s(`${e} is required`), { floor: he } = Math, ge = (e, t) => Array(e).fill(void 0).map(t), _e = 248, ve = (e) => {
	if (e <= 0) return "";
	let t = new Uint8Array(Math.ceil(e * 1.15) + 4), n = "";
	for (; n.length < e;) {
		crypto.getRandomValues(t);
		for (let r = 0; r < t.byteLength && n.length < e; r++) {
			let e = t[r];
			e < _e && (n += x[e % 62]);
		}
	}
	return n;
}, U = /*@__PURE__*/ Promise.all.bind(Promise), ye = typeof window < "u", be = Object.entries, xe = Object.fromEntries, Se = Object.keys, Ce = Object.values, W = () => {}, we = "candidate", G = (e) => (e != null && clearTimeout(e), null), K = (e) => {
	e?.unref?.();
}, q = (e, t) => e instanceof Error && e.message ? e.message : typeof e == "string" && e ? e : l(e ?? t), Te = (e, t) => e instanceof Error ? e : s(q(e, t)), Ee = (...e) => l(e), De = (e, t) => {
	let n = [...e], r = (Math.trunc(t) || 1) >>> 0, i = () => {
		r = r + 1831565813 >>> 0;
		let e = Math.imul(r ^ r >>> 15, 1 | r);
		return e = e + Math.imul(e ^ e >>> 7, 61 | e) ^ e, ((e ^ e >>> 14) >>> 0) / 4294967296;
	}, a = n.length;
	for (; a;) {
		let e = he(i() * a--), t = n[a];
		n[a] = n[e], n[e] = t;
	}
	return n;
}, Oe = (e, t = 2 ** 53 - 1) => T(e) % t, ke = /*@__PURE__*/ new WeakSet(), Ae = (e) => (ke.add(e), e), je = (e) => Ae(s(e)), Me = /*@__PURE__*/ RegExp("^[0-9A-Za-z]{22}$"), Ne = /*@__PURE__*/ RegExp("^(.+)~([0-9A-Za-z]{22})$"), Pe = (e) => {
	let t = Ne.exec(e);
	return t?.[1] && t[2] ? [t[1], t[2]] : [e, null];
}, Fe = (e, t) => `${Pe(e)[0]}~${t}`, Ie = (e) => {
	if (typeof Blob < "u" && e instanceof Blob) return [2, e];
	if (e instanceof ArrayBuffer || ArrayBuffer.isView(e)) return [2, e instanceof ArrayBuffer ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength)];
	let t = typeof e == "string";
	return [+!t, d(t ? e : l(e))];
}, Le = (e, t) => e.some(({ urls: e }) => [e].flat().some((e) => t.test(e))), J = (e) => !(!e || typeof e != "object" || Array.isArray(e)), Y = (e) => typeof e == "string" && e.length > 0, Re = (e) => typeof e == "number" && Number.isSafeInteger(e) && e > 0, ze = (e) => typeof e == "string" && e.length >= 64 && e.length <= 128, Be = (e) => J(e) && e.v === 1 && Y(e.certId) && Y(e.issuerPubKey) && Y(e.subUserId) && Y(e.appId) && Y(e.roomId) && Array.isArray(e.roles) && e.roles.length > 0 && e.roles.every(Y) && Re(e.seq) && Re(e.iat) && ze(e.sig), Ve = (e, t, n = 3e4) => {
	let r = E(e);
	return [
		(e) => {
			let i = Date.now(), a = r.get(e);
			return (!a || i - a[1] > n) && (a = [0, i], r.set(e, a)), ++a[0] >= t;
		},
		(e) => {
			r.delete(e);
		},
		(e) => {
			let i = r.get(e);
			return !!(i && Date.now() - i[1] <= n && i[0] >= t);
		}
	];
}, He = 2, Ue = 1500, We = 15e3, Ge = 32, Ke = 1e4, qe = (e) => e === void 0 || typeof e == "string" && e.length <= 512, Je = (e, t) => {
	let n = (2166136261 ^ t) >>> 0;
	for (let t = 0; t < e.length; t++) n ^= e.charCodeAt(t), n = Math.imul(n, 16777619) >>> 0;
	return n;
}, Ye = (e) => e.phase === "in-flight" || e.phase === "completed", Xe = ({ fanout: e = He, pullTimeoutMs: t = Ue, periodicIntervalMs: n = We, maxPages: r = Ge, canSync: i = () => !0, getDirectPeers: a, isPeerSendable: o, sendPull: s }) => {
	let l = crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(1))[0], u = /* @__PURE__ */ new Map(), d = "active", f = 0, p = () => {
		let e = 0;
		for (let t of u.values()) t.phase === "completed" && e++;
		return e;
	}, m = () => {
		let e = 0;
		for (let t of u.values()) Ye(t) && e++;
		return e;
	}, h = () => {
		for (let e of u.values()) if (e.phase === "in-flight") return !0;
		return !1;
	}, g = (e) => {
		let t = u.get(e);
		if (t) switch (t.phase) {
			case "in-flight":
				G(t.timer), u.delete(e);
				return;
			case "completed":
			case "cooldown":
				u.delete(e);
				return;
			default: c(t);
		}
	}, _ = (e, t) => {
		let n = u.get(e);
		return n?.phase === "cooldown" ? t >= n.until ? (u.delete(e), !1) : !0 : !1;
	}, v = (e = !0) => {
		let t = Date.now();
		return a().filter((n) => o(n) && (!e || !_(n, t))).map((e) => [e, Je(e, l)]).sort((e, t) => e[1] - t[1] || N(e[0], t[0])).map(([e]) => e);
	}, y = (t, n) => {
		let r = u.get(t);
		d !== "closed" && r?.phase === "in-flight" && r.pullId === n && (G(r.timer), o(t) ? u.set(t, {
			phase: "cooldown",
			until: Date.now() + Ke
		}) : u.delete(t), p() < e && S());
	}, b = (e, n) => {
		let r = setTimeout(() => y(e, n), t);
		return K(r), r;
	}, x = (e, t, n = 0, a = !1) => {
		if (d === "closed" || !i() || n >= r || !o(e)) return g(e), !1;
		let c = u.get(e);
		c?.phase === "in-flight" && G(c.timer);
		let l = Symbol(), f = b(e, l);
		return u.set(e, {
			phase: "in-flight",
			pullId: l,
			timer: f,
			pages: n + 1,
			staleDigest: a
		}), Promise.resolve().then(() => s(e, t)).catch(() => y(e, l)), !0;
	}, S = () => {
		if (d === "closed" || !i()) return;
		let t = m();
		for (let n of v()) {
			if (t >= e) break;
			!u.has(n) && x(n) && t++;
		}
	}, C = (e, t = !1) => {
		if (d === "closed" || !i()) return;
		let n = u.get(e);
		if (!n) x(e);
		else switch (n.phase) {
			case "in-flight":
				t && !n.staleDigest && u.set(e, {
					...n,
					staleDigest: !0
				});
				return;
			case "completed":
				t && x(e);
				return;
			case "cooldown":
				x(e);
				return;
			default: c(n);
		}
	}, w = (e, t) => {
		let n = u.get(e);
		d !== "closed" && n?.phase === "in-flight" && (t && n.pages < r ? x(e, t, n.pages, n.staleDigest) : (G(n.timer), n.staleDigest ? (u.delete(e), x(e)) : u.set(e, { phase: "completed" })));
	}, T = (e, t = !1) => {
		if (d === "closed") return;
		let n = u.get(e);
		n?.phase === "in-flight" ? n.staleDigest || u.set(e, {
			...n,
			staleDigest: !0
		}) : u.delete(e), t && C(e, !0), S();
	}, E = (t) => {
		g(t), d !== "closed" && p() < e && S();
	}, D = () => {
		d === "active" && a().length !== 0 && (d = "repull-queued", queueMicrotask(() => {
			if (d === "repull-queued" && (d = "active", i())) {
				for (let [e, t] of u) switch (t.phase) {
					case "completed":
						u.delete(e);
						break;
					case "in-flight":
						t.staleDigest || u.set(e, {
							...t,
							staleDigest: !0
						});
						break;
					case "cooldown": break;
					default: c(t);
				}
				S();
			}
		}));
	}, O = n > 0 ? setInterval(() => {
		if (d === "closed" || !i() || h()) return;
		let e = v();
		if (e.length === 0 && (e = v(!1)), e.length === 0) return;
		let t = e[f++ % e.length];
		x(t);
	}, n) : void 0;
	return K(O), {
		pullPeer: C,
		onSyncPage: w,
		onPeerJoined: T,
		onPeerDisconnected: E,
		scheduleRepull: D,
		isPullInFlight: (e) => u.get(e)?.phase === "in-flight",
		destroy: () => {
			d = "closed", O !== void 0 && clearInterval(O);
			for (let e of u.values()) e.phase === "in-flight" && G(e.timer);
			u.clear();
		}
	};
}, Ze = {
	name: "ECDSA",
	namedCurve: "P-256"
}, X = {
	name: "ECDSA",
	hash: "SHA-256"
}, Qe = "AES-GCM", $e = 12, et = "HMAC", tt = 6e5, nt = /*@__PURE__*/ new Uint8Array(32), rt = /*@__PURE__*/ d(i("room-aes", 3)), it = /*@__PURE__*/ d(i("room-hmac", 3)), at = /*@__PURE__*/ E(4096), ot = /*@__PURE__*/ E(64), st = 115792089210356248762697446949407573529996955224135760342422259061068512044369n, Z = st >> 1n, ct = (e) => {
	if (e.byteLength !== 64) return e;
	let t = C(e.subarray(32, 64));
	if (t <= Z) return e;
	let n = e.slice(), r = st - t;
	for (let e = 63; e >= 32; e--) n[e] = Number(r & 255n), r >>= 8n;
	return n;
}, lt = (e) => {
	if (e.byteLength !== 64) return !1;
	let t = C(e.subarray(0, 32)), n = C(e.subarray(32, 64));
	return t > 0n && t < st && n > 0n && n <= Z;
}, ut = async (e) => new Uint8Array(await crypto.subtle.digest("SHA-256", typeof e == "string" ? d(e) : e)), dt = async (e, t) => ct(new Uint8Array(await crypto.subtle.sign(X, e, t))), ft = (e, t, n) => crypto.subtle.verify(X, e, t, n), pt = async (e) => {
	let t = at.get(e);
	if (t !== void 0) return t;
	let n = y(await ut(e));
	return at.set(e, n), n;
}, mt = (e, t, n) => {
	let r = l([
		e,
		t,
		n
	]), a = ot.get(r);
	if (a) return a;
	let o = (async () => {
		let [r, a] = await Promise.all([crypto.subtle.importKey("raw", d(e), "PBKDF2", !1, ["deriveBits"]), ut(l([
			i("pbkdf2-master", 3),
			t,
			n
		]))]), o = new Uint8Array(await crypto.subtle.deriveBits({
			name: "PBKDF2",
			salt: a,
			iterations: tt,
			hash: "SHA-256"
		}, r, 256));
		try {
			let e = await crypto.subtle.importKey("raw", o, "HKDF", !1, ["deriveKey"]), [t, n] = await Promise.all([crypto.subtle.deriveKey({
				name: "HKDF",
				hash: "SHA-256",
				salt: nt,
				info: rt
			}, e, {
				name: Qe,
				length: 256
			}, !1, ["encrypt", "decrypt"]), crypto.subtle.deriveKey({
				name: "HKDF",
				hash: "SHA-256",
				salt: nt,
				info: it
			}, e, {
				name: et,
				hash: "SHA-256",
				length: 256
			}, !1, ["sign", "verify"])]);
			return {
				aesKey: t,
				hmacKey: n
			};
		} finally {
			o.fill(0);
		}
	})();
	return o.catch(() => {
		ot.delete(r);
	}), ot.set(r, o), o;
}, ht = async (e, t, n) => {
	if (!e) {
		let e = await ut(l([
			i("room-aes", 3),
			t,
			n
		]));
		return crypto.subtle.importKey("raw", e, { name: Qe }, !1, ["encrypt", "decrypt"]);
	}
	return (await mt(e, t, n)).aesKey;
}, gt = (e, t) => t === void 0 ? {
	name: Qe,
	iv: e
} : {
	name: Qe,
	iv: e,
	additionalData: d(t)
}, _t = async (e, t, n) => {
	let r = crypto.getRandomValues(new Uint8Array($e)), i = new Uint8Array(await crypto.subtle.encrypt(gt(r, n), await e, d(t))), a = new Uint8Array($e + i.byteLength);
	return a.set(r, 0), a.set(i, $e), y(a);
}, vt = async (e, t, n) => {
	if (typeof t != "string" || !S.test(t)) throw s("invalid ciphertext");
	let r = b(t);
	if (r.byteLength < 28 || y(r) !== t) throw s("invalid ciphertext");
	return m(await crypto.subtle.decrypt(gt(r.subarray(0, $e), n), await e, r.subarray($e)));
}, yt = `${r}:user_identity:v1:`, bt = `${r}_identity_v1`, xt = "identities", St = (e) => s(`IndexedDB ${e} failed`), Ct = /*@__PURE__*/ d(i("idb-key-probe", 1)), wt = (e) => ({
	userId: e.userId,
	signPubJwk: e.signPubJwk,
	sign: (t) => dt(e.privateKey, t)
}), Tt = () => new Promise((e, t) => {
	let n = indexedDB.open(bt, 1);
	n.onupgradeneeded = () => {
		let e = n.result;
		e.objectStoreNames.contains(xt) || e.createObjectStore(xt);
	}, n.onsuccess = () => e(n.result), n.onerror = () => t(n.error ?? St("open"));
}), Et = (e, t) => new Promise((n, r) => {
	let i = e.transaction(xt, "readonly").objectStore(xt).get(t);
	i.onsuccess = () => n(i.result), i.onerror = () => r(i.error ?? St("get"));
}), Dt = (e, t, n) => new Promise((r, i) => {
	let a = e.transaction(xt, "readwrite"), o, s = (e) => {
		switch (o.phase) {
			case "pending":
			case "staged":
				o = {
					phase: "staged",
					value: e
				};
				return;
			case "done": return;
			default: c(o);
		}
	}, l = (e) => {
		switch (o.phase) {
			case "pending":
			case "staged":
				o = { phase: "done" }, i(e instanceof Error ? e : a.error ?? St(n));
				return;
			case "done": return;
			default: c(o);
		}
	};
	o = { phase: "pending" }, a.oncomplete = () => {
		switch (o.phase) {
			case "staged": {
				let { value: e } = o;
				o = { phase: "done" }, r(e);
				return;
			}
			case "pending":
				o = { phase: "done" }, i(St(n));
				return;
			case "done": return;
			default: c(o);
		}
	}, a.onabort = () => l(a.error), a.onerror = (e) => l(e?.target?.error ?? a.error);
	try {
		t(a.objectStore(xt), s);
	} catch (e) {
		l(e);
	}
}), Ot = (e, t, n) => Dt(e, (e, r) => {
	r(n), e.put(n, t);
}, "put"), kt = (e, t, n) => Dt(e, (e, r) => {
	let i = e.get(t);
	i.onsuccess = () => {
		let a = i.result;
		a === void 0 ? (r([n, !1]), e.add(n, t)) : r([a, !0]);
	};
}, "add"), At = async (e, t, n) => {
	if (!e || typeof e != "object" || !e.userId || !e.signPubJwk || !e.privateKey || !await t(e.userId, e.signPubJwk)) return !1;
	try {
		return await n(await dt(e.privateKey, Ct), Ct, e.signPubJwk);
	} catch {
		return !1;
	}
}, jt = async (e, t) => {
	let n = `${yt}${e}`, r = async () => {
		let e = await Tt();
		try {
			return await t(e);
		} finally {
			e.close();
		}
	}, i = typeof navigator < "u" ? navigator.locks : void 0;
	return typeof i?.request == "function" ? i.request(n, r) : r();
}, Mt = (e, t, n, r) => jt(e, async (i) => {
	let a = async (a) => await At(a, n, r) ? a : Ot(i, e, await t()), o = await Et(i, e);
	if (o !== void 0) return wt(await a(o));
	let [s, c] = await kt(i, e, await t());
	return wt(c ? await a(s) : s);
}), Nt = 62n, Pt = 4096, Ft = 2097152, It = 8192, Lt = /*@__PURE__*/ d(i("identity-self-test", 1)), Rt = /*@__PURE__*/ s("invalid custom user identity; userId does not match signPubJwk"), zt = /*@__PURE__*/ s("invalid custom user identity; use \"local\", \"none\", loader, or importUserIdentity()"), Bt = /*@__PURE__*/ s("invalid custom user identity signature; sign() must return a valid 64-byte IEEE P1363 ECDSA P-256 SHA-256 signature"), Vt = (e, t) => {
	let n = Nt ** BigInt(t), r = C(e) % n, i = "";
	for (let e = 0; e < t; e++) i = x[Number(r % Nt)] + i, r /= Nt;
	return i;
}, Ht = (e) => {
	let t, n;
	if (typeof e == "string") {
		if (e.length !== 87 || e[43] !== ".") return null;
		t = e.slice(0, 43), n = e.slice(44);
	} else {
		if (!e || typeof e != "object" || e.d !== void 0 || e.kty && e.kty !== "EC" || e.crv && e.crv !== "P-256" || typeof e.x != "string" || typeof e.y != "string" || !e.x || !e.y) return null;
		t = e.x, n = e.y;
	}
	try {
		let e = b(t), r = b(n);
		if (e.byteLength !== 32 || r.byteLength !== 32 || y(e) !== t || y(r) !== n) return null;
		let i = /* @__PURE__ */ new Uint8Array(65);
		return i[0] = 4, i.set(e, 1), i.set(r, 33), i;
	} catch {
		return null;
	}
}, Ut = (e = "", t = "", n = "P-256", r = "EC") => ({
	crv: n,
	kty: r,
	x: e,
	y: t
}), Wt = (e) => {
	if (typeof e == "object" && e) {
		let t = Jt.get(e);
		if (t) return t.compactPub;
	}
	return Ht(e) ? typeof e == "string" ? e : `${e.x}.${e.y}` : null;
}, Gt = (e) => {
	let t = Wt(e);
	if (!t) throw V;
	return t;
}, Kt = (e) => typeof e == "string" && Ht(e) ? Ut(e.slice(0, 43), e.slice(44)) : null, qt = /*@__PURE__*/ E(), Jt = /*@__PURE__*/ new WeakMap(), Yt = /* @__PURE__ */ new Map(), Xt = (e) => {
	if (typeof e == "object" && e) {
		let t = Jt.get(e);
		if (t) return t;
	}
	let t = Wt(e);
	return t ? qt.get(t) : void 0;
}, Zt = (e, t) => {
	if (typeof e == "object" && e) {
		let t = Jt.get(e);
		if (t) return Promise.resolve(t);
	}
	let n = Ht(e);
	if (!n) return Promise.resolve(null);
	let r = typeof e == "string" ? e.slice(0, 43) : e.x, a = typeof e == "string" ? e.slice(44) : e.y, o = `${r}.${a}`, s = qt.get(o);
	if (s) return Promise.resolve(s);
	let c = Yt.get(o);
	if (c) return c;
	let l = (async () => {
		try {
			let [e, s, c] = await Promise.all([
				t ? Promise.resolve(t) : crypto.subtle.importKey("raw", n, Ze, !1, ["verify"]),
				ut(`${i("pid", 1)}:${o}`),
				ut(`${i("uid", 1)}:${o}`)
			]), l = Object.freeze(Ut(r, a)), u = {
				compactPub: o,
				cleanJwk: l,
				verifyKey: e,
				peerId: Vt(s, 20),
				userId: Vt(c, 22)
			};
			return Jt.set(l, u), qt.set(o, u), u;
		} catch {
			return null;
		} finally {
			Yt.delete(o);
		}
	})();
	return Yt.set(o, l), l;
}, Qt = (e) => typeof e == "string" && Me.test(e), $t = /*@__PURE__*/ (() => {
	let e = /* @__PURE__ */ new Map(), t = 0;
	return {
		get: (t) => {
			let n = e.get(t);
			return n !== void 0 && (e.delete(t), e.set(t, n)), n;
		},
		set: (n, r) => {
			let i = e.get(n);
			for (i !== void 0 && (t -= i.byteLength, e.delete(n)); e.size >= It || e.size > 0 && t + r.byteLength > Ft;) {
				let n = e.keys().next().value;
				if (n === void 0) break;
				let r = e.get(n);
				r && (t -= r.byteLength), e.delete(n);
			}
			e.set(n, r), t += r.byteLength;
		}
	};
})(), en = /* @__PURE__ */ new Map(), tn = (e, t, n) => {
	if (!e || e.byteLength !== 64) return !1;
	let r = Xt(n);
	if (r && t.byteLength <= Pt) {
		let n = $t.get(`${r.compactPub}:${y(e)}`);
		if (n) return w(n, t);
	}
	return nn(e, t, n, r);
}, nn = async (e, t, n, r) => {
	let i = r ?? await Zt(n);
	if (!i) return !1;
	if (t.byteLength > Pt) {
		if (!lt(e)) return !1;
		try {
			return await ft(i.verifyKey, e, t);
		} catch {
			return !1;
		}
	}
	let a = `${i.compactPub}:${y(e)}`, o = $t.get(a);
	if (o) return w(o, t);
	if (!lt(e)) return !1;
	let s = en.get(a);
	if (s && w(s[0], t)) return s[1];
	let c = t.slice(), l = ft(i.verifyKey, e, c).then((e) => e ? ($t.set(a, c), en.get(a)?.[1] === l && en.delete(a), !0) : (en.get(a)?.[1] === l && en.delete(a), !1), () => (en.get(a)?.[1] === l && en.delete(a), !1));
	return en.set(a, [c, l]), l;
}, rn = (e, t, n) => {
	let r = Xt(t);
	return r ? r[n] === e : Zt(t).then((t) => !!(t && t[n] === e));
}, an = (e, t) => !!(e && typeof e == "string") && rn(e, t, "peerId"), on = (e, t) => Qt(e) && rn(e, t, "userId"), sn = async (e) => {
	let t = await crypto.subtle.generateKey(Ze, e, ["sign", "verify"]), n = await crypto.subtle.exportKey("jwk", e ? t.privateKey : t.publicKey), r = await Zt(Ut(n.x, n.y), t.publicKey);
	if (!r) throw V;
	return [
		t,
		n,
		r
	];
}, cn = "__default__", ln = 8, un = (e) => e || cn, dn = /*@__PURE__*/ new Map(), fn = /*@__PURE__*/ E(), pn = /*@__PURE__*/ E(), mn = (e) => {
	let t = dn.get(e);
	return t || (t = {
		epoch: 0,
		inFlightLoad: null,
		opTail: Promise.resolve()
	}, dn.set(e, t)), t;
}, hn = (e, t) => {
	let n = e.opTail.catch(W).then(t);
	return e.opTail = n.catch(W), n;
}, gn = 0, _n = () => `c${++gn}`, vn = (e, t = "", n = mn(e).epoch) => `${t}\0${n}\0${e}`, yn = () => sn(!1).then(([e, , t]) => ({
	peerId: t.peerId,
	signPrivateKey: e.privateKey,
	signPublicKey: e.publicKey,
	signPubJwk: t.cleanJwk,
	sign: (t) => dt(e.privateKey, t)
})), bn = (e, t) => {
	let n = vn(un(e), t), r = fn.get(n);
	if (r) return r;
	let i = yn();
	return i.catch(() => {
		fn.get(n) === i && fn.delete(n);
	}), fn.set(n, i), i;
}, xn = /* @__PURE__ */ new WeakMap(), Sn = /* @__PURE__ */ new WeakSet(), Cn = async () => {
	let [e, , t] = await sn(!1);
	return {
		userId: t.userId,
		signPubJwk: t.cleanJwk,
		privateKey: e.privateKey
	};
}, wn = () => Cn().then((e) => {
	let t = wt(e);
	return Sn.add(t), t;
}), Tn = (e) => !!(e && typeof e == "object" && typeof e.userId == "string" && Qt(e.userId) && e.signPubJwk && Ht(e.signPubJwk) && typeof e.sign == "function"), En = (e, t, n = e.signPubJwk) => {
	let r = Sn.has(e), i = {
		userId: e.userId,
		signPubJwk: n,
		sign: r ? e.sign : async (t) => ct(new Uint8Array(await e.sign(t))),
		persistence: t
	}, a = xn.get(e);
	return a !== void 0 && xn.set(i, a), r && Sn.add(i), i;
}, Dn = async (e) => {
	if (!Tn(e)) throw zt;
	let t = await Zt(e.signPubJwk);
	if (!t || t.userId !== e.userId) throw Rt;
	if (!Sn.has(e)) {
		let n;
		try {
			n = new Uint8Array(await e.sign(Lt.slice()));
		} catch (e) {
			throw s(`custom user identity sign() failed startup check: ${e instanceof Error ? e.message : String(e)}`);
		}
		let r = ct(n);
		if (r.byteLength !== 64 || !await ft(t.verifyKey, r, Lt)) throw Bt;
	}
	return En(e, e.persistence ?? "custom", t.cleanJwk);
}, On = () => {
	try {
		return typeof globalThis < "u" && "indexedDB" in globalThis && !!globalThis.indexedDB;
	} catch {
		return !1;
	}
}, kn = (e) => e === "none" || (e === void 0 || e === "local") && !On(), An = (e) => {
	let t = e?.identity;
	if (t !== void 0 && t !== "none" && t !== "local" && typeof t != "function") {
		if (Tn(t)) {
			let e = Xt(t.signPubJwk);
			if (e && e.userId !== t.userId) throw Rt;
		} else throw zt;
	}
}, jn = (e, t = "", n = mn(e).epoch) => {
	let r = vn(e, t, n), i = pn.get(r);
	if (i) return i;
	let a = wn().then((e) => En(e, "none"));
	return a.catch(() => {
		pn.get(r) === a && pn.delete(r);
	}), pn.set(r, a), a;
}, Mn = /*@__PURE__*/ s("identity epoch superseded by clearUserIdentity"), Nn = (e, t, n) => {
	let r = hn(t, async () => {
		if (t.epoch !== n) throw Mn;
		let r = await Mt(e, Cn, on, tn);
		return Sn.add(r), En(r, "local");
	}).finally(() => {
		t.inFlightLoad?.promise === r && (t.inFlightLoad = null);
	});
	return t.inFlightLoad = {
		epoch: n,
		promise: r
	}, r;
}, Pn = async (e, t, n, r) => {
	let i = n?.identity;
	if (typeof i == "function") return Dn(await i({
		appId: e,
		roomId: t
	}));
	if (i !== void 0 && i !== "none" && i !== "local") return Dn(i);
	let a = un(e), o = mn(a);
	if ((i === "none" || i === "local" ? i : On() ? "local" : "none") === "none") return jn(a, r, o.epoch);
	if (!On()) return P("IndexedDB unavailable; falling back to identity: 'none'"), jn(a, r, o.epoch);
	for (let e = 0; e < ln; e++) {
		let e = o.epoch, t = o.inFlightLoad?.epoch === e ? o.inFlightLoad.promise : Nn(a, o, e);
		try {
			let n = await t;
			if (o.epoch === e) return n;
		} catch {
			if (o.epoch !== e) continue;
			return P("IndexedDB unavailable; falling back to identity: 'none'"), jn(a, r, e);
		}
	}
	return jn(a, r, o.epoch);
}, Fn = [0, 0], In = 6e4, Ln = 1e4, Rn = 5e3, zn = 64, Bn = (e, t, n = 1) => l([i(e, n), ...t]), Vn = (e) => Array.isArray(e) && e.length === 2 && Re(e[0]) && typeof e[1] == "number" && Number.isSafeInteger(e[1]) && e[1] >= 0, Hn = (e, t) => e[0] - t[0] || e[1] - t[1], Un = async (e, t) => {
	let n = d(t);
	return y(typeof e == "function" ? ct(await e(n)) : await dt(e, n));
}, Wn = (e, t, n) => {
	try {
		let r = tn(b(n), d(t), e);
		return typeof r == "boolean" ? r : r.catch(() => !1);
	} catch {
		return !1;
	}
}, Gn = (e, t = Infinity) => {
	let n = /* @__PURE__ */ new Set(), r = (e, t) => {
		if (t > zn) return null;
		if (e === null || typeof e == "boolean") return String(e);
		if (typeof e == "number") return Number.isFinite(e) ? l(e) : null;
		if (typeof e == "string") return l(e);
		if (typeof e != "object") return null;
		let i = e;
		if (n.has(i)) return null;
		let a = Array.isArray(i);
		if (!a) {
			let e = Object.getPrototypeOf(i);
			if (e !== Object.prototype && e !== null) return null;
		}
		n.add(i);
		try {
			if (a) {
				let e = [];
				for (let n = 0; n < i.length; n++) {
					let a = r(i[n], t + 1);
					if (a === null) return null;
					e.push(a);
				}
				return `[${e.join(",")}]`;
			}
			let e = i, n = Se(e).sort(), o = [];
			for (let i = 0; i < n.length; i++) {
				let a = n[i], s = e[a];
				if (s === void 0) continue;
				let c = r(s, t + 1);
				if (c === null) return null;
				o.push(`${l(a)}:${c}`);
			}
			return `{${o.join(",")}}`;
		} finally {
			n.delete(i);
		}
	}, i = r(e, 0);
	if (i === null) return 0;
	let a = p(i);
	return a > t ? 1 : [i, a];
}, Kn = (e) => {
	let t = Gn(e);
	if (!Array.isArray(t)) throw s("value must be valid finite JSON");
	return t[0];
}, qn = (e = 0) => {
	let t = e, n = 0;
	return {
		peek: () => t,
		observe: (e, r = Rn) => {
			let i = Math.min(e, Date.now() + r);
			i > t && (t = i, n = 0);
		},
		next: (e = 0) => {
			let r = Date.now(), i = Math.max(r, t + 1, e), a = r + Rn;
			return i <= a ? t = i : a > t && (t = a), n = 0, i;
		},
		nextHlc: (e, r = Fn, i = Ln) => {
			let a = Date.now(), o = Math.max(a, t, r[0]);
			if (o > a + i) throw s(`state clock skew exceeded for "${e}"`);
			let c = o > t && o > r[0] ? 0 : Math.max(o === t ? n : -1, o === r[0] ? r[1] : -1) + 1, l = a + Rn;
			return o <= l ? (t = o, n = c) : l > t && (t = l, n = 0), [o, c];
		}
	};
}, Jn = (e, t, n = 512) => {
	let r = E(n);
	return {
		consume: (n, i = 1) => {
			let a = Date.now(), o = r.get(n);
			if (!o) return t < i ? !1 : (r.set(n, [t - i, a]), !0);
			let s = Math.max(0, a - o[1]) / 1e3;
			return s > 0 && (o[0] = Math.min(t, o[0] + s * e), o[1] = a), o[0] < i ? !1 : (o[0] -= i, !0);
		},
		delete: (e) => {
			r.delete(e);
		},
		clear: () => {
			r.clear();
		}
	};
}, { min: Yn } = Math, Xn = 3333, Zn = 6e4, Qn = /*@__PURE__*/ s("relay socket closed"), $n = /*@__PURE__*/ E(256), er = (e) => e.phase === "connecting" || e.phase === "open", tr = (e) => e.phase === "backoff-wait" || e.phase === "parked-offline", nr = /*@__PURE__*/ new Set(), rr = /*@__PURE__*/ new WeakMap(), ir = (e) => !!e.isClosed, ar = "auto", or = !1, sr = null, cr = (e, t, n, r = !1) => e.relayConfig?.urls || (r ? De(t, Oe(e.appId)) : t).slice(0, e.relayConfig?.redundancy ?? n), lr = () => {
	or = !0, nr.forEach((e) => e[0]());
}, ur = () => {
	or = !1, $n.clear(), nr.forEach((e) => e[1]());
}, dr = () => {
	if (sr || typeof addEventListener != "function") return;
	let e = new AbortController(), { signal: t } = e;
	addEventListener("online", ur, { signal: t }), addEventListener("offline", lr, { signal: t }), typeof document < "u" && typeof document.addEventListener == "function" && document.addEventListener("visibilitychange", () => {
		!or && document.visibilityState === "visible" && ur();
	}, { signal: t }), sr = () => e.abort();
}, fr = (e) => {
	e.onopen = e.onclose = e.onmessage = null, e.close();
}, pr = (e, t, n) => {
	let r = {
		url: e,
		isClosed: !1,
		send: W
	}, i = /* @__PURE__ */ new Set(), o = {
		phase: "parked-offline",
		didOpen: !1
	}, l = (e) => {
		i.forEach((t) => t(e)), i.clear();
	}, u = () => {
		let { promise: e, resolve: t, reject: n } = Promise.withResolvers();
		return e.catch(W), Object.defineProperty(e, a, {
			value: () => o.phase === "open" || o.phase === "closed" || or ? Promise.resolve(null) : o.phase === "backoff-wait" && o.attemptFailure ? Promise.resolve(o.attemptFailure) : new Promise((e) => {
				i.add(e);
			}),
			enumerable: !1,
			configurable: !0
		}), {
			promise: e,
			resolve: t,
			reject: n
		};
	}, d = u();
	r.ready = d.promise;
	let f = () => {
		d = u(), r.ready = d.promise;
	};
	ar === "auto" && dr();
	let p = (e) => e.phase === "open" || e.didOpen, m = () => {
		switch (o.phase) {
			case "closed":
			case "connecting":
			case "open": return;
			case "backoff-wait":
				if (clearTimeout(o.timer), or) {
					o = {
						phase: "parked-offline",
						didOpen: o.didOpen
					};
					return;
				}
				break;
			case "parked-offline":
				if (or) return;
				break;
			default: c(o);
		}
		let i = o.didOpen, a = new WebSocket(e);
		r.socket = a, r.url = a.url ?? e, o = {
			phase: "connecting",
			socket: a,
			didOpen: i
		}, a.onclose = () => {
			if (!er(o) || o.socket !== a) return;
			let t = o.phase === "open", n = p(o);
			if (r.send = W, t && f(), or) {
				o = {
					phase: "parked-offline",
					didOpen: n
				}, t || l(null);
				return;
			}
			let i = t ? null : s(`failed to connect to relay ${r.url}`);
			i && l(i);
			let c = $n.get(e) ?? Xn;
			$n.set(e, c);
			let u = setTimeout(m, Math.random() * c);
			$n.set(e, Yn(c * 2, Zn)), o = {
				phase: "backoff-wait",
				didOpen: n,
				timer: u,
				attemptFailure: i
			};
		}, a.onmessage = (e) => {
			try {
				t(String(e.data));
			} catch {}
		}, a.onopen = () => {
			if (o.phase !== "connecting" || o.socket !== a) return;
			let t = o.didOpen;
			o = {
				phase: "open",
				socket: a
			}, l(null), d.resolve(r), $n.set(e, Xn), t && n?.();
		}, r.send = (e) => {
			a.readyState === 1 && a.send(e);
		};
	}, h = [() => {
		switch (o.phase) {
			case "closed":
			case "parked-offline": return;
			case "backoff-wait":
				clearTimeout(o.timer), o = {
					phase: "parked-offline",
					didOpen: o.didOpen
				}, l(null);
				return;
			case "connecting":
			case "open": {
				let e = o.phase === "open", t = p(o), n = o.socket;
				r.send = W, o = {
					phase: "parked-offline",
					didOpen: t
				}, e && f(), l(null), fr(n);
				return;
			}
			default: c(o);
		}
	}, () => {
		o.phase !== "closed" && ($n.set(e, Xn), tr(o) && m());
	}];
	return nr.add(h), rr.set(r, () => {
		!or && tr(o) && h[1]();
	}), r.close = () => {
		if (o.phase === "closed") return;
		let t = o;
		switch (r.isClosed = !0, r.send = W, o = { phase: "closed" }, l(null), d.reject(Qn), nr.delete(h), rr.delete(r), $n.delete(e), t.phase) {
			case "parked-offline": break;
			case "backoff-wait":
				clearTimeout(t.timer);
				break;
			case "connecting":
			case "open":
				fr(t.socket);
				break;
			default: c(t);
		}
	}, or || m(), r;
}, mr = () => {
	let e = /* @__PURE__ */ new WeakMap();
	return { forRelay: (t) => {
		let n = e.get(t);
		return n || (n = Object.create(null), e.set(t, n)), n;
	} };
}, hr = /*@__PURE__*/ new WeakMap(), gr = (e) => {
	if (e && typeof e == "object") {
		let t = hr.get(e);
		t && (hr.delete(e), t());
	}
}, _r = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakSet(), c = n ?? ir, l = (e) => {
		let t = i.get(e);
		t !== void 0 && r.get(t) === e && r.delete(t);
	};
	return {
		register: (e, t) => {
			let n = r.get(e);
			return n && c(n) && (l(n), o.delete(n), n = void 0), n ? rr.get(n)?.() : (n = t(), r.set(e, n), i.set(n, e)), n;
		},
		lease: (e, n) => {
			rr.get(e)?.(), o.set(e, (o.get(e) ?? 0) + 1);
			let r = Promise.resolve(n).then((e) => e);
			r.catch(W);
			let i = n[a];
			typeof i == "function" && Object.defineProperty(r, a, {
				value: i,
				enumerable: !1,
				configurable: !0
			});
			let u = !1;
			return hr.set(r, () => {
				if (u) return;
				u = !0;
				let n = o.get(e);
				!n || n <= 0 || (n > 1 ? o.set(e, n - 1) : (o.delete(e), l(e), !s.has(e) && !c(e) && (s.add(e), t?.(e))));
			}), r;
		},
		evict: l,
		getSockets: () => xe([...r.entries()].flatMap(([t, n]) => {
			let r = c(n) ? void 0 : e(n);
			return r ? [[t, r]] : [];
		}))
	};
}, vr = 16384, yr = 65536, br = 17408, xr = 1e4, Sr = 12e4, Cr = 0, wr = 1, Tr = 2, Er = 3, Dr = 4, Or = 5, kr = 64, Ar = 36, jr = 48, Mr = 6, Nr = 14, Pr = vr - Nr, Fr = yr - Nr, Ir = 256 * 1024 ** 2, Lr = 1024 ** 2, Rr = 1024, zr = 64, Br = 128, Vr = 8, Hr = 32, Ur = "payload exceeds receiver size limit", Wr = fe("payload"), Gr = 0, Kr = 1, qr = 2, Jr = {
	pending: {
		waiting: !0,
		reserved: !1,
		active: !1,
		admitted: !1
	},
	deciding: {
		waiting: !0,
		reserved: !1,
		active: !1,
		admitted: !1
	},
	queued: {
		waiting: !0,
		reserved: !1,
		active: !1,
		admitted: !0
	},
	accepted: {
		waiting: !1,
		reserved: !0,
		active: !0,
		admitted: !0
	},
	receiving: {
		waiting: !1,
		reserved: !0,
		active: !0,
		admitted: !0
	},
	buffered: {
		waiting: !1,
		reserved: !0,
		active: !1,
		admitted: !0
	},
	closed: {
		waiting: !1,
		reserved: !1,
		active: !1,
		admitted: !1
	}
}, Yr = (e) => e.phase === "failed" || e.phase === "done", Xr = (e, t) => {
	let n = Object.assign(s(t), { kind: e });
	return e === "aborted" && (n.name = "AbortError"), n;
}, Zr = (e) => {
	if (e?.aborted) throw Xr("aborted", se);
}, Qr = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), $r = (e, t, n = Mr) => {
	let r = new Uint8Array(n);
	return r[0] = 3, r[1] = e, Qr(r).setUint32(2, t), r;
}, ei = (e, t, n) => {
	let r = () => {
		let i = Sr - (Date.now() - e());
		if (i > 0) {
			let e = setTimeout(r, i);
			K(e), n(e);
		} else t();
	}, i = setTimeout(r, Sr);
	return K(i), i;
}, ti = (e) => m(e.subarray(2, 34)).replaceAll("\0", ""), ni = (e, t) => {
	let n;
	try {
		n = e();
	} catch {
		return t(!1);
	}
	return typeof n == "boolean" ? t(n) : Promise.resolve(n).then((e) => t(e === !0), () => t(!1));
}, ri = (e, t, n) => t === qr ? n ? e.slice() : e : t === Kr ? u(m(e)) : m(e), ii = (e, t, n, r) => {
	try {
		e.onProgress(t, n, r);
	} catch (e) {
		L("progress handler", e);
	}
}, ai = (e, t, n, r) => {
	ii(e, 1, n, r);
	try {
		e.receiver?.(t, n, r);
	} catch (e) {
		R(e);
	}
}, oi = ({ resolveTransport: e, getPeerIds: t, canReceiveFromPeer: n, onPeerError: r, broadcastInline: i, checkAborted: a = Zr, onUnknownType: o, maxReceiveBytes: h = Ir }) => {
	if (!Number.isSafeInteger(h) || h <= 0) throw H("maxReceiveBytes");
	let g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Set(), C = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new WeakSet(), T = null, E = 0, D = 0, O = 0, k = 0, A = !1, j = !1, M = () => Xr("disconnected", ee), N = fe("frame"), F = (e) => e.state.phase !== "closed", I = (e) => Math.min(h, e?.maxPayloadBytes ?? h), L = () => {
		A && (j = !0);
	}, R = (t, n, i = !0) => {
		let a = e(t, !0);
		a && !w.has(a) && (w.add(a), P(`${n}; disconnecting peer ${t}`), r(t, i ? je(n) : s(n)));
	}, te = (e, t, n, r, i = "") => {
		if (!t || !t.isOpen) return;
		let a = d(i).subarray(0, 200), o = $r(r, n, Mr + a.length);
		o.set(a, Mr);
		try {
			if (t.bufferedAmount > Lr) throw s("control send buffer is full");
			t.sendFrame(o, n);
		} catch {
			R(e, "unable to send action control", !1);
		}
	}, ne = (t, n, r, i = "") => {
		te(t, e(t, !0), n, r, i);
	}, z = (e, t, n, r) => {
		n?.[3](t), _.get(e.type)?.onReject?.(e.peerId, e.metadata, t), r !== void 0 && ne(e.peerId, r, Dr, t);
	}, re = (e) => {
		for (let t of Array.from(S)) t.message.peerId === e && (S.delete(t), S.add(t));
	}, ie = (e) => {
		O--;
		let t = (C.get(e) ?? 1) - 1;
		t > 0 ? C.set(e, t) : C.delete(e);
	}, ae = (e, t) => {
		let n = Jr[e.state.phase], r = Jr[t.phase], { peerId: i, size: a } = e.message, o = b.get(i);
		n.reserved !== r.reserved && (k += r.reserved ? a : -a, r.reserved || L()), n.waiting !== r.waiting && (r.waiting ? S.add(e) : S.delete(e)), n.active !== r.active && o && (r.active ? o.activeBulk = e : o.activeBulk === e && (o.activeBulk = null, re(i))), e.state = t, t.phase === "buffered" && L();
	}, B = (e) => {
		if (e.state.phase === "closed") return !1;
		let { peerId: t } = e.message, n = b.get(t);
		e.unbindScopeAbort?.(), e.unbindScopeAbort = null, e.timer = G(e.timer);
		let r = e.controller;
		if (e.controller = null, e.kind === "inline") {
			e.state = { phase: "closed" };
			let t = n?.inlineQueues.get(e.queueKey);
			if (t) {
				let r = t.indexOf(e);
				r >= 0 && t.splice(r, 1), t.length || n.inlineQueues.delete(e.queueKey);
			}
		} else n?.bulkTransfers.delete(e.transferId), ae(e, { phase: "closed" });
		return n && (n.pendingCount--, D--, n.pendingCount || b.delete(t)), r?.abort(), !0;
	}, oe = (e, t) => {
		B(e) && z(e.message, t, e.scope, e.kind === "bulk" ? e.transferId : void 0);
	}, se = (e) => {
		if (e.state.phase !== "pending") return null;
		let { peerId: t } = e.message;
		if (O >= Br || (C.get(t) ?? 0) >= Vr) return oe(e, "too many pending receive decisions"), null;
		let n = new AbortController();
		return e.controller = n, O++, C.set(t, (C.get(t) ?? 0) + 1), e.kind === "inline" ? e.state = {
			phase: "deciding",
			data: e.state.data
		} : ae(e, { phase: "deciding" }), n;
	}, ce = (e) => {
		if (e.kind === "inline") switch (e.state.phase) {
			case "pending":
			case "deciding": return e.state = {
				phase: "ready",
				data: e.state.data
			}, !0;
			case "ready": return !0;
			case "closed": return !1;
			default: return c(e.state);
		}
		switch (e.state.phase) {
			case "pending":
			case "deciding": return ae(e, { phase: "queued" }), !0;
			case "queued":
			case "accepted":
			case "receiving":
			case "buffered": return !0;
			case "closed": return !1;
			default: return c(e.state);
		}
	}, V = (e) => {
		if (e.state.phase !== "queued") return;
		let t = b.get(e.message.peerId);
		!t || t.activeBulk !== null || k + e.message.size > h || (e.lastSeenAt = Date.now(), ae(e, { phase: "accepted" }), ne(e.message.peerId, e.transferId, Er));
	}, le = (e) => {
		switch (e.state.phase) {
			case "receiving": return e.state;
			case "accepted": {
				let t = e.message.size;
				try {
					let n = {
						phase: "receiving",
						data: new Uint8Array(t),
						seenChunks: new Uint8Array(Math.ceil(Math.ceil(t / e.chunkSize) / 8)),
						offset: 0
					};
					return ae(e, n), n;
				} catch {
					return oe(e, "unable to allocate receive buffer"), be(), null;
				}
			}
			case "pending":
			case "deciding":
			case "queued":
			case "buffered":
			case "closed": return null;
			default: return c(e.state);
		}
	}, ue = (e) => {
		if (e.state.phase !== "receiving") return;
		let { data: t } = e.state;
		ae(e, {
			phase: "buffered",
			data: t
		});
	}, me = (e) => e.kind === "inline" ? e.state.phase === "ready" : Jr[e.state.phase].admitted, he = (e, t) => {
		if (e.state.phase !== "pending") return me(e);
		if (e.message.size > I(t)) return oe(e, Ur), !1;
		let n = e.scope ? e.scope[2] : t.receiveGate;
		if (!n) return t.receiver ? ce(e) : !1;
		let r = se(e);
		if (!r) return !1;
		let { peerId: i } = e.message, a = !1, o = ni(() => n({
			byteLength: e.message.size,
			peerId: i,
			signal: r.signal,
			...e.message.metadata === void 0 ? {} : { metadata: e.message.metadata }
		}), (t) => (a || (a = !0, ie(i)), e.state.phase === "deciding" ? t ? ce(e) : (oe(e, "payload rejected by receiver"), !1) : !1));
		return typeof o == "boolean" ? o : (o.then(() => be()), !1);
	}, ge = (e, t, n, r) => {
		let i;
		try {
			i = ri(n, e.message.format, r);
		} catch {
			B(e), R(e.message.peerId, Wr);
			return;
		}
		B(e), ai(t, i, e.message.peerId, e.message.metadata);
	}, _e = (e) => {
		let t = _.get(e.message.type);
		if (t && (e.state.phase !== "pending" || he(e, t)) && e.state.phase === "ready") {
			if (t.receiver) ge(e, t, e.state.data, !0);
			else if (!e.scope) {
				let { data: t } = e.state, { lastSeenAt: n, message: r } = e;
				B(e), Ce(r, t, !0, !0, n);
			}
		}
	}, ve = (e) => {
		let t = _.get(e.message.type);
		if (t) switch (e.state.phase) {
			case "pending":
				he(e, t) && t.receiver && V(e);
				return;
			case "queued":
				t.receiver && V(e);
				return;
			case "buffered":
				t.receiver && ge(e, t, e.state.data, !1);
				return;
			case "deciding":
			case "accepted":
			case "receiving":
			case "closed": return;
			default: c(e.state);
		}
	}, ye = (e, t) => {
		let n = b.get(e)?.inlineQueues.get(t);
		for (; n?.[0];) {
			let e = n[0];
			if (_e(e), F(e)) break;
		}
	}, be = () => {
		if (A) j = !0;
		else {
			A = !0;
			try {
				do {
					j = !1;
					for (let e of S) ve(e);
					for (let [e, t] of b) {
						for (let e of t.bulkTransfers.values()) e.state.phase === "buffered" && ve(e);
						for (let n of t.inlineQueues.keys()) ye(e, n);
					}
				} while (j);
			} finally {
				A = !1, j = !1;
			}
		}
	}, xe = () => {
		T || (T = setTimeout(Se, xr), K(T));
	}, Se = () => {
		T = G(T);
		let e = Date.now(), t = !1;
		for (let [n, r] of x) {
			for (let [n, i] of r) {
				for (; i.length > 0 && e - i[0].receivedAt > 1e4;) i.shift();
				i.length === 0 ? r.delete(n) : t = !0;
			}
			r.size === 0 && x.delete(n);
		}
		t && xe();
	}, Ce = (e, t, n = !1, r = !1, i = Date.now()) => {
		let a = Date.now(), o = x.get(e.peerId);
		o || (o = /* @__PURE__ */ new Map(), x.set(e.peerId, o));
		let s = o.get(e.type);
		for (s || (s = [], o.set(e.type, s)); s.length > 0 && a - s[0].receivedAt > 1e4;) s.shift();
		s.length >= Hr && s.shift(), s.push({
			admitted: n,
			message: e,
			data: r ? t : t.slice(),
			receivedAt: i
		}), xe();
	}, we = (e, t) => ({
		message: e,
		scope: t,
		unbindScopeAbort: null,
		controller: null,
		lastSeenAt: Date.now(),
		timer: null
	}), q = (e) => {
		F(e) && !e.timer && (e.timer = ei(() => e.lastSeenAt, () => {
			oe(e, "action transfer timed out"), be();
		}, (t) => {
			F(e) ? e.timer = t : clearTimeout(t);
		}));
	}, Te = (e, t = !1) => {
		let { peerId: n } = e.message, r = b.get(n);
		if (D >= Rr || (r?.pendingCount ?? 0) >= zr) return z(e.message, "too many pending transfers", e.scope, e.kind === "bulk" ? e.transferId : void 0), !1;
		if (r || (r = {
			bulkTransfers: /* @__PURE__ */ new Map(),
			inlineQueues: /* @__PURE__ */ new Map(),
			activeBulk: null,
			pendingCount: 0
		}, b.set(n, r)), r.pendingCount++, D++, e.kind === "inline") {
			let t = r.inlineQueues.get(e.queueKey) ?? [];
			t.push(e), r.inlineQueues.set(e.queueKey, t);
		} else r.bulkTransfers.set(e.transferId, e), ae(e, { phase: "pending" });
		if (t || q(e), e.scope) {
			let t = e.scope[1], n = () => {
				oe(e, "receive cancelled"), be();
			};
			if (t.aborted) return n(), !1;
			let r = new AbortController();
			t.addEventListener("abort", n, {
				once: !0,
				signal: r.signal
			}), e.unbindScopeAbort = () => r.abort();
		}
		return !0;
	}, Ee = (e, t) => {
		let n = () => !!(t.receiver || t.receiveGate);
		if (!n()) return;
		let r = Date.now();
		for (let i of Array.from(x.keys())) {
			if (!n()) break;
			for (; n();) {
				let n = x.get(i), a = n?.get(e);
				if (!a || a.length === 0) {
					n && (n.delete(e), n.size === 0 && x.delete(i));
					break;
				}
				if (r - a[0].receivedAt > 1e4) {
					a.shift();
					continue;
				}
				if (a[0].admitted && !t.receiver) break;
				let o = a.shift();
				if (a.length === 0 && (n.delete(e), n.size === 0 && x.delete(i)), o.message.size > I(t)) z(o.message, Ur);
				else if (o.admitted || t.receiver && !t.receiveGate && !b.get(i)?.inlineQueues.has(e)) {
					let r;
					try {
						r = ri(o.data, o.message.format, !1);
					} catch {
						n && (n.delete(e), n.size === 0 && x.delete(i)), R(i, Wr);
						break;
					}
					ai(t, r, i, o.message.metadata);
				} else {
					let t = {
						...we(o.message),
						kind: "inline",
						queueKey: e,
						state: {
							phase: "pending",
							data: o.data
						}
					};
					Te(t, !0) && (ye(i, e), q(t));
				}
			}
		}
	}, De = (e, t) => {
		let n = _.get(e.type);
		if (!n) return t !== void 0 && ne(e.peerId, t, Dr, "unregistered action"), null;
		let r = n.receiveScope?.(e.peerId, e.metadata);
		return r === null || r?.[1].aborted ? (t !== void 0 && ne(e.peerId, t, Dr, "unexpected response"), null) : e.size > I(n) ? (z(e, Ur, r, t), null) : [n, r];
	}, Oe = (e) => {
		for (let t of v.get(e)?.values() ?? []) t.fail(M());
		v.delete(e), y.delete(e), x.delete(e);
		let t = b.get(e);
		if (t) {
			for (let e of Array.from(t.bulkTransfers.values())) B(e);
			for (let e of Array.from(t.inlineQueues.values())) e.slice().forEach((e) => {
				B(e);
			});
		}
		be();
	}, ke = (e, t) => new Promise((n, r) => {
		let i = () => {
			try {
				a(t);
			} catch (e) {
				r(e);
			}
		};
		if (t.aborted) {
			i();
			return;
		}
		let o = new AbortController();
		t.addEventListener("abort", i, {
			once: !0,
			signal: o.signal
		}), e.then(n, r).finally(() => {
			o.abort();
		});
	}), Ae = async (e, t, n, r, i, o, s, c, l) => {
		n();
		let u = s ?? e.waitForDrain(r);
		if (u !== !0) {
			if (!await u) throw a(r), Xr("disconnected", "data channel stopped draining");
			n();
		}
		c?.();
		try {
			e.sendFrame(t, i, o);
		} catch {
			let e = M();
			throw l?.(e), e;
		}
	}, Me = async (e, t, n, r, i, o, c, l, u) => {
		let { promise: d, resolve: f, reject: p } = Promise.withResolvers();
		d.catch(W);
		let m = v.get(e) ?? /* @__PURE__ */ new Map();
		if (m.has(r)) throw s("action transfer id in use");
		v.set(e, m);
		let h = (e, t = !1, n) => {
			if (Yr(g)) return;
			let r = !0;
			g.phase === "offering" ? (r = g.sent, clearTimeout(g.timer), g = {
				phase: "failed",
				error: e,
				fromReceiver: t,
				didSendOffer: n ?? r
			}, p(e)) : g = {
				phase: "failed",
				error: e,
				fromReceiver: t,
				didSendOffer: n ?? r
			};
		}, g = {
			phase: "offering",
			sent: !1,
			timer: ei(() => g.phase === "offering" ? g.lastSeen : 0, () => h(Xr("timeout", "action offer timed out")), (e) => {
				g.phase === "offering" ? g.timer = e : clearTimeout(e);
			}),
			lastSeen: Date.now()
		}, _ = () => g, y = () => {
			if (g.phase === "failed") throw g.error;
			try {
				if (a(u), !t.isOpen) throw M();
			} catch (e) {
				throw h(e), e;
			}
		};
		m.set(r, {
			accept: () => g.phase === "offering" && g.sent ? (clearTimeout(g.timer), g = { phase: "streaming" }, f(), !0) : !1,
			fail: (e, t = !1) => {
				h(e, t);
			},
			touch: () => {
				g.phase === "offering" && (g.lastSeen = Date.now());
			}
		});
		let b = u ? new AbortController() : null;
		b && u && u.addEventListener("abort", () => {
			try {
				a(u);
			} catch (e) {
				h(e);
			}
		}, {
			once: !0,
			signal: b.signal
		});
		try {
			let a = (t.maxBulkFrameBytes ?? 16384) >= yr, s = a ? Fr : Pr, f = n;
			a && (f = n.slice(), f[1] |= kr), await Ae(t, f, y, u, r, !0, void 0, () => {
				g.phase === "offering" && (g.sent = !0);
			}, (e) => {
				h(e, !1, !1);
			}), await d;
			for (let n = 0; n < o; n += s) {
				y();
				let a = Math.min(s, o - n), d = $r(Tr, r, Nr + a);
				Qr(d).setFloat64(Mr, n), d.set(i instanceof Uint8Array ? i.subarray(n, n + a) : new Uint8Array(await i.slice(n, n + a).arrayBuffer()), Nr), await Ae(t, d, y, u, r), m.forEach((e) => e.touch()), l?.((n + a) / o, e, c);
			}
			y(), _().phase === "streaming" && (g = { phase: "done" });
		} catch (n) {
			h(n);
			let i = _();
			throw i.phase === "failed" && i.didSendOffer && !i.fromReceiver && t.isOpen && t.bufferedAmount <= Lr && te(e, t, r, Or), i.phase === "failed" ? i.error : n;
		} finally {
			let t = _();
			t.phase === "offering" && clearTimeout(t.timer), b?.abort(), m.delete(r), !m.size && v.get(e) === m && v.delete(e);
		}
	}, Ne = (e, t, n, r) => {
		if (t.length < Mr || (n === Er || n === Or) && t.length !== Mr || n === Dr && t.length > 206) {
			R(e, fe("control"));
			return;
		}
		let i = r.getUint32(2);
		if (n === Er) {
			let t = v.get(e);
			t?.get(i)?.accept() && t.forEach((e) => e.touch());
			return;
		}
		if (n === Dr) {
			v.get(e)?.get(i)?.fail(Xr("rejected", m(t.subarray(Mr))), !0);
			return;
		}
		if (n === Or) {
			let t = b.get(e)?.bulkTransfers.get(i);
			t && (B(t), t.scope?.[3]("response cancelled by sender")), be();
			return;
		}
		let a = t.length >= Nr ? r.getFloat64(Mr) : NaN, o = t.subarray(Nr), s = b.get(e)?.bulkTransfers.get(i);
		if (!s) return;
		let c = s.message.size, l = s.chunkSize;
		if (!Jr[s.state.phase].active || !Number.isSafeInteger(a) || a < 0 || a >= c || a % l !== 0 || !o.length || o.length !== Math.min(l, c - a)) {
			R(e, fe("chunk"));
			return;
		}
		let u = le(s);
		if (!u) return;
		let d = a / l, f = d >>> 3, p = 1 << (d & 7);
		if ((u.seenChunks[f] & p) !== 0) {
			R(e, fe("chunk"));
			return;
		}
		u.seenChunks[f] |= p, u.data.set(o, a), u.offset += o.length;
		let h = Date.now();
		s.lastSeenAt = h;
		for (let e of S) e.state.phase === "queued" && _.get(e.message.type)?.receiver && (e.lastSeenAt = h);
		if (u.offset === c) {
			let e = _.get(s.message.type);
			e?.receiver ? ge(s, e, u.data, !1) : ue(s), be();
		} else {
			let t = _.get(s.message.type);
			t && ii(t, u.offset / c, e, s.message.metadata);
		}
	};
	return {
		makeWireAction: (n, r = {}) => {
			let o = !!r.sendToPending, c = !!r.receiveWhilePending, { maxPayloadBytes: u, receiveScope: m } = r, h = g.get(n);
			if (h) {
				if (h.sendToPending !== o || h.receiveWhilePending !== c || h.maxPayloadBytes !== u || h.receiveScope !== m) throw de(n);
				return h.action;
			}
			let v = d(n);
			if (!n || n.includes("\0") || v.length > 32) throw s("action type must be 1–32 non-null UTF-8 bytes");
			let b = {
				...u === void 0 ? {} : { maxPayloadBytes: u },
				...m ? { receiveScope: m } : {},
				receiver: null,
				receiveGate: null,
				onReject: null,
				onProgress: W
			};
			_.set(n, b);
			let x = {
				onMessage: (e) => {
					b.receiver = e, Ee(n, b), be();
				},
				onReceive: (e) => {
					b.receiveGate = e, e && Ee(n, b), be();
				},
				onReject: (e) => {
					b.onReject = e;
				},
				onProgress: (e) => {
					b.onProgress = e;
				},
				send: async (n, r, c, u, d) => {
					if (a(d), n === void 0) throw s("action data cannot be undefined");
					let [m, h] = Ie(n), g = h instanceof Uint8Array ? h.byteLength : h.size, _ = c === void 0 ? "" : l(c), b = c === void 0 ? 0 : p(_);
					if (b > 16336) throw s("action metadata is too large");
					let x = Ar + b + g <= vr, S = x ? 0 : E++ >>> 0, C = x ? Ar : jr, w = new Uint8Array(C + b + (x ? g : 0));
					w[0] = 3, w[1] = (x ? Cr : wr) | m << 4, w.set(v, 2);
					let T = Qr(w);
					T.setUint16(34, b), x || (T.setUint32(36, S), T.setFloat64(40, g)), b > 0 && f(_, w.subarray(C, C + b)), x && w.set(h instanceof Uint8Array ? h : new Uint8Array(await h.arrayBuffer()), C + b);
					let D = r != null;
					if (!D && x && !o && i) {
						let e = i(w, (e) => u?.(1, e, c), d);
						if (typeof e == "boolean" ? e : await e) return;
					}
					let O = D ? [r].flat() : t(o), k = [...new Set(O)];
					if (D && k.length === 0) throw Xr("disconnected", "target peer list must not be empty");
					let A = [];
					for (let t of k) {
						let n = e(t, o);
						if (!n || !n.isOpen) {
							if (D) throw Xr("disconnected", pe(t));
						} else A.push([t, n]);
					}
					let j = [], N = (e) => {
						e.catch(W), j.push(e);
					};
					for (let [e, t] of A) if (x) {
						a(d);
						let n = y.get(e), r = n ? void 0 : t.waitForDrain(d);
						if (r === !0) {
							try {
								t.sendFrame(w);
							} catch {
								throw M();
							}
							u?.(1, e, c);
							continue;
						}
						let i = (async () => {
							await n, await Ae(t, w, () => {
								if (a(d), !t.isOpen) throw M();
							}, d, void 0, void 0, r), u?.(1, e, c);
						})(), o = i.catch(W).finally(() => {
							y.get(e) === o && y.delete(e);
						});
						y.set(e, o), N(n && d ? ke(i, d) : i);
					} else N(Me(e, t, w, S, h, g, c, u, d));
					j.length > 0 && await U(j);
				}
			};
			return g.set(n, {
				sendToPending: o,
				receiveWhilePending: c,
				maxPayloadBytes: u,
				receiveScope: m,
				action: x
			}), x;
		},
		handleData: (e, t) => {
			if (t.byteLength < 2 || t.byteLength > 65536) {
				R(e, N);
				return;
			}
			let r = new Uint8Array(t);
			if (r[0] !== 3) {
				R(e, "incompatible action protocol version");
				return;
			}
			let i = r[1] & 15, a = r[1] >>> 4 & 3, s = r[1] >>> 6, c = Qr(r);
			if (i > Or || a > qr || s > +(i === wr) || i > wr && a !== Gr || i !== Tr && r.length > 16384) {
				R(e, N);
				return;
			}
			if (i >= Tr) {
				Ne(e, r, i, c);
				return;
			}
			let l = i === Cr ? Ar : jr;
			if (r.length < l) {
				R(e, fe("header"));
				return;
			}
			let d = ti(r), f = g.get(d);
			if (!f && o && (o(d), f = g.get(d)), !n(e, !!f?.receiveWhilePending)) return;
			let p = c.getUint16(34), h = l + p, _ = i === Cr ? r.length - h : c.getFloat64(40), v = i === wr ? c.getUint32(36) : 0;
			if (!d || h > r.length || !Number.isSafeInteger(_) || _ < 0 || i === wr && (_ === 0 || h !== r.length)) {
				R(e, fe("proposal"));
				return;
			}
			let y;
			try {
				p && (y = u(m(r.subarray(l, h))));
			} catch {
				R(e, fe("metadata"));
				return;
			}
			let x = {
				peerId: e,
				type: d,
				format: a,
				size: _,
				metadata: y
			};
			if (i === Cr) {
				let t = r.subarray(h), n = De(x);
				if (!n) return;
				let [i, o] = n, s = o ? `${d}\0${o[0]}` : d, c = !!(o ? o[2] : i.receiveGate);
				if (i.receiver && !c && !b.get(e)?.inlineQueues.has(s)) {
					let n;
					try {
						n = ri(t, a, !0);
					} catch {
						R(e, Wr);
						return;
					}
					ai(i, n, e, y);
					return;
				}
				if (!i.receiver && !c && !b.get(e)?.inlineQueues.has(s)) {
					Ce(x, t);
					return;
				}
				let l = {
					...we(x, o),
					kind: "inline",
					queueKey: s,
					state: {
						phase: "pending",
						data: t.slice()
					}
				};
				Te(l, !0) && (ye(e, s), q(l));
				return;
			}
			if (b.get(e)?.bulkTransfers.has(v)) {
				R(e, "duplicate action offer");
				return;
			}
			let S = De(x, v);
			if (!S) return;
			let C = {
				...we(x, S[1]),
				kind: "bulk",
				transferId: v,
				chunkSize: s === 1 ? Fr : Pr,
				state: { phase: "closed" }
			};
			Te(C) && be();
		},
		clearPeer: Oe
	};
}, si = 1e4, ci = (e, t, n = si) => t?.aborted ? !1 : e.readyState !== "open" || e.bufferedAmount <= (e.bufferedAmountLowThreshold ?? 0) ? e.readyState === "open" : new Promise((r) => {
	let i = !1, a = null, o = new AbortController(), s = () => u(!0), c = () => u(!1), l = (t) => {
		e[t]("bufferedamountlow", s), e[t]("close", c), e[t]("error", c);
	}, u = (e) => {
		i || (i = !0, l("removeEventListener"), o.abort(), a = G(a), r(e));
	};
	a = setTimeout(() => u(!1), n), K(a), l("addEventListener"), t?.addEventListener("abort", c, {
		once: !0,
		signal: o.signal
	}), e.readyState !== "open" || t?.aborted ? u(!1) : e.bufferedAmount <= (e.bufferedAmountLowThreshold ?? 0) && u(!0);
}), li = (e, t = 40, n = 150, r) => {
	if (e.isDead) return r?.(), W;
	e.setHandlers({
		connect: W,
		data: W,
		stream: W,
		close: W,
		error: W
	});
	let i = e.channel;
	if (!i || i.readyState !== "open") return e.destroy(), r?.(), W;
	let a = typeof i.addEventListener == "function", o, s = () => {
		switch (o.phase) {
			case "done": return;
			case "grace-hold":
				G(o.graceTimer), G(o.capTimer);
				break;
			case "draining":
				G(o.capTimer);
				break;
			default: c(o);
		}
		o = { phase: "done" }, a && (i.removeEventListener("bufferedamountlow", u), i.removeEventListener("close", s), i.removeEventListener("error", s)), e.destroy(), r?.();
	}, l = () => i.readyState !== "open" || typeof i.bufferedAmount != "number" || i.bufferedAmount <= 0, u = () => {
		o.phase === "draining" && l() && s();
	}, d = setTimeout(s, Math.max(t, n));
	if (K(d), t > 0) {
		let e = setTimeout(() => {
			o.phase === "grace-hold" && (o = {
				phase: "draining",
				capTimer: o.capTimer
			}, u());
		}, t);
		K(e), o = {
			phase: "grace-hold",
			graceTimer: e,
			capTimer: d
		};
	} else o = {
		phase: "draining",
		capTimer: d
	};
	if (a) {
		try {
			i.bufferedAmountLowThreshold = 0;
		} catch {}
		i.addEventListener("bufferedamountlow", u), i.addEventListener("close", s), i.addEventListener("error", s);
	}
	return t <= 0 && u(), s;
}, ui = (e, t) => ({
	get isOpen() {
		let n = e.channel?.readyState;
		return (!t || t()) && !e.isDead && n !== "closing" && n !== "closed";
	},
	get bufferedAmount() {
		return typeof e.channel?.bufferedAmount == "number" ? e.channel.bufferedAmount : 0;
	},
	get maxBulkFrameBytes() {
		let t = e.connection?.sctp?.maxMessageSize;
		return typeof t == "number" && Number.isFinite(t) && t >= 65536 ? yr : vr;
	},
	sendFrame: (t) => {
		e.sendData(t);
	},
	waitForDrain: (n) => n?.aborted || t && !t() || e.isDead ? !1 : !e.channel || ci(e.channel, n),
	close: () => e.destroy()
}), di = [
	"offer",
	"answer",
	"candidate"
], fi = 131072, pi = 64, mi = 65536, hi = 4096, gi = 256, _i = 6e4, vi = /^[0-9A-Za-z]{20}$/, yi = /^[\w.~:!-]{1,64}$/, bi = (e, t, n) => `${e}|${t}|${n}`, xi = (e, t) => typeof e == "string" && e.length > 0 && e.length <= t && yi.test(e), Si = (e) => typeof e == "string" && vi.test(e), Ci = (e) => xi(e, pi), wi = (e) => {
	if (typeof e == "string") {
		if (e.length > fi) return null;
		try {
			let t = u(e);
			return J(t) ? t : null;
		} catch {
			return null;
		}
	}
	return J(e) ? e : null;
}, Ti = (e, t) => typeof e[t] == "string" && e[t] ? e[t] : void 0, Ei = (e) => !!(e && typeof e == "object" && typeof e.signal == "function" && typeof e.destroy == "function" && typeof e.setHandlers == "function"), Di = (e) => {
	let t = wi(e);
	if (!t) return null;
	let n = typeof e == "string", r = di.some((e) => e in t);
	return "peerId" in t && !Si(t.peerId) || (r || t.offerId !== void 0) && !Ci(t.offerId) || di.some((e) => {
		if (!(e in t)) return !1;
		let n = t[e];
		return typeof n != "string" || n === "" || n.length > (e === "candidate" ? hi : mi);
	}) || "peer" in t && (n || t.peer !== void 0 && !Ei(t.peer)) ? null : [
		Ti(t, "peerId") ?? "",
		Ti(t, "offer"),
		Ti(t, "answer"),
		Ti(t, "candidate"),
		Ti(t, "offerId"),
		Ei(t.peer) ? t.peer : void 0
	];
}, Oi = (e) => Le([...e.turnConfig ?? [], ...e.rtcConfig?.iceServers ?? []], /^turns?:/i), ki = (e) => e === "closed" || e === "failed", Ai = (e) => {
	let { connection: t, channel: n } = e;
	return e.isDead || ki(t.connectionState) || ki(t.iceConnectionState) || n?.readyState === "closing" || n?.readyState === "closed" ? "stale" : !n || n.readyState !== "open" ? "transient" : "live";
}, ji = 23333, Mi = 57333, Ni = 12, Pi = 7533, Fi = 23333, Ii = (e) => !e || e.phase === "exhausted", Li = (e) => e?.phase === "retrying" || e?.phase === "exhausted", Ri = (e) => {
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		n?.phase === "retrying" && G(n.retryTimer), e[t] = void 0;
	}
	e.length = 0;
}, zi = (e) => {
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (n) switch (n.phase) {
			case "reserved":
				e[t] = void 0;
				break;
			case "retrying":
				G(n.retryTimer), e[t] = {
					phase: "exhausted",
					sendCandidate: n.sendCandidate
				};
				break;
			case "exhausted": break;
			default: c(n);
		}
	}
}, Bi = (e, t) => {
	let n = e.relaySlots[t];
	n && (n.phase === "retrying" && G(n.retryTimer), e.relaySlots[t] = void 0);
}, Vi = (e, t) => {
	e?.relaySlots[t]?.phase === "reserved" && (e.relaySlots[t] = void 0);
}, Hi = (e, t, n) => (e.outbound.phase === "advertising" || e.outbound.phase === "answered") && (!t || e.outbound.peer === t) && (n === void 0 || e.outbound.offerId === n), Ui = (e) => {
	switch (e.outbound.phase) {
		case "idle": return e.relaySlots.some(Boolean);
		case "allocating":
		case "advertising":
		case "answered": return !0;
		default: return c(e.outbound);
	}
}, Wi = (e, t) => {
	let n = 0;
	for (let [r, i] of e) r !== t && i.connection.phase !== "connected" && ((i.outbound.phase === "allocating" || Hi(i) && !i.outbound.peer.isDead) && n++, i.inbound.phase === "answering" && !i.inbound.peer.isDead && n++);
	return n;
}, Gi = (e) => e.connection.phase === "disconnected" && e.inbound.phase === "idle" && !Ui(e), Ki = (e) => {
	for (let [t, n] of e) Gi(n) && e.delete(t);
}, qi = /*@__PURE__*/ new WeakMap(), Ji = (e) => {
	e && !e.isDead && e.destroy();
}, Yi = (e) => {
	qi.delete(e), e.inbound.phase === "answering" && G(e.inbound.expiryTimer), e.inbound = { phase: "idle" };
}, Xi = (e, t) => {
	e.inbound.phase === "answering" && e.inbound.peer === t && (Yi(e), e.connectedPeer !== t && Ji(t));
}, Zi = (e, t) => {
	e.inbound.phase === "answering" && e.inbound.peer !== t && Ji(e.inbound.peer), Yi(e), e.connection = {
		phase: "connected",
		peer: t,
		unhealthySince: null
	};
}, Qi = (e, t) => {
	e?.connection.phase === "connected" && e.connection.peer === t && (e.connection = { phase: "disconnected" });
}, $i = (e) => {
	if (e.connection.phase !== "connected") return;
	let { peer: t } = e.connection;
	e.connection = { phase: "disconnected" }, Ji(t);
}, ea = (e) => {
	switch (qi.delete(e), Ri(e.relaySlots), e.outbound.phase) {
		case "idle":
		case "allocating": break;
		case "advertising":
		case "answered":
			G(e.outbound.expiryTimer), e.outbound.peer !== e.connectedPeer && Ji(e.outbound.peer);
			break;
		default: c(e.outbound);
	}
	e.outbound = { phase: "idle" }, e.didReportFailure = !1;
}, ta = () => ({
	outbound: { phase: "idle" },
	inbound: { phase: "idle" },
	connection: { phase: "disconnected" },
	relaySlots: [],
	didReportFailure: !1,
	get offerPeer() {
		return Hi(this) ? this.outbound.peer : null;
	},
	get answeringPeer() {
		return this.inbound.phase === "answering" ? this.inbound.peer : null;
	},
	get connectedPeer() {
		return this.connection.phase === "connected" ? this.connection.peer : null;
	}
}), na = (e, t) => {
	let n = e.get(t);
	if (n) return n;
	if (e.size >= gi) {
		let t, n;
		for (let [r, i] of e) {
			if (Gi(i)) {
				t = r;
				break;
			}
			n === void 0 && i.connection.phase === "disconnected" && (n = r);
		}
		let r = t ?? n;
		if (r !== void 0) {
			let t = e.get(r);
			t && (Ji(t.answeringPeer), ea(t), Yi(t)), e.delete(r);
		}
	}
	let r = ta();
	return e.set(t, r), r;
}, ra = (e) => {
	let { appId: t, getRoomId: n, config: r, peerStates: i, getRootTopicPlaintext: a, rootTopicP: o, selfTopicP: u, toPlain: d, toCipher: f, isLeaving: p, onError: m, checkoutOffers: h, claimLeasedOffer: g, reclaimLeasedOffer: _, encryptOffer: v, initPeer: y, connectPeer: b, disconnectPeer: x, announceIntervals: S, announceIntervalMs: C, getSelfIdNow: w, selfIdP: T, onPeerDiscovered: D, shouldConnectPeer: O } = e, k = [], A = E(512), j = E(512), M = /* @__PURE__ */ new Map(), N = () => T, P = (e) => pt(Ee(a(), e)), F = (e) => Wi(i, e) >= 64, I = (e, i) => {
		if (p() || e.connection.phase === "connected" || e.didReportFailure) return;
		e.didReportFailure = !0;
		let a = Oi(r);
		m?.({
			code: "peer-connect-failed",
			peerId: i,
			turnConfigured: a,
			message: `could not connect to peer ${i} after exchanging SDP; ${a ? "verify TURN server URLs and credentials" : "configure TURN via turnConfig or rtcConfig.iceServers"}`,
			appId: t,
			roomId: n()
		});
	}, R = (e, r, i) => {
		let a = `${e}:${r}`, o = Date.now(), s = A.get(a);
		s !== void 0 && o - s < _i || (A.set(a, o), m?.({
			code: "decrypt-failed",
			peerId: e,
			stage: r,
			message: `failed to decrypt ${r} (incorrect password or corrupted signal)`,
			appId: t,
			roomId: n(),
			cause: i
		}));
	}, ee = (e, t) => {
		let n = setTimeout(() => {
			let n = i.get(e);
			n && n.connection.phase !== "connected" && n.inbound.phase === "answering" && n.inbound.peer === t && (n.inbound.didSendAnswer && I(n, e), Xi(n, t), Ki(i));
		}, Fi);
		return K(n), n;
	}, te = (e, t, n = Mi) => {
		let r = setTimeout(() => {
			let n = i.get(e);
			n && n.connection.phase !== "connected" && Hi(n, void 0, t) && (n.outbound.phase === "answered" && I(n, e), ea(n), Ki(i));
		}, n);
		return K(r), r;
	}, ne = (e, t, n, r) => {
		let a = () => {
			e.offerPeer === n && e.connection.phase !== "connected" && (e.outbound.phase === "answered" && I(e, t), ea(e)), x(n, t), Ki(i);
		};
		n.setHandlers({
			connect: () => {
				j.delete(t), b(n, t);
			},
			...r ? { signal: r } : {},
			close: a,
			error: a
		});
	}, z = (e, t) => {
		switch (e.outbound.phase) {
			case "advertising": return Promise.resolve([
				e.outbound.peer,
				e.outbound.offerSdp,
				e.outbound.offerId
			]);
			case "allocating": return e.outbound.promise;
			case "answered": return Promise.resolve(null);
			case "idle": break;
			default: return c(e.outbound);
		}
		if (F(t)) return Promise.resolve(null);
		let n = () => p() || e.outbound.phase !== "allocating" || e.outbound.promise !== r, r = (async () => {
			let r = w() ?? await N(), i;
			try {
				i = (await h(1, !1, (e, t) => v(e, r, t), Ni))[0];
			} catch (e) {
				if (n()) return null;
				throw e;
			}
			if (!i) {
				if (n()) return null;
				throw s("failed to allocate offer peer");
			}
			let { peer: a, offer: o } = i, c = i.offerId || ve(Ni);
			if (n()) return a.destroy(), null;
			let l = [], u = te(t, c);
			return e.didReportFailure = !1, e.outbound = {
				phase: "advertising",
				peer: a,
				offerId: c,
				offerSdp: o,
				expiryTimer: u,
				bufferedCandidates: l
			}, ne(e, t, a, (t) => {
				if (e.connection.phase !== "connected" && Hi(e, a, c)) {
					e.outbound.bufferedCandidates.push(t);
					for (let n of e.relaySlots) Li(n) && n.sendCandidate(t);
				}
			}), [
				a,
				o,
				c
			];
		})().finally(() => {
			e.outbound.phase === "allocating" && e.outbound.promise === r && (e.outbound = { phase: "idle" });
		});
		return e.outbound = {
			phase: "allocating",
			promise: r
		}, r;
	}, re = (e, t, n, r) => {
		let i = [];
		Hi(e) ? (G(e.outbound.expiryTimer), e.outbound.peer === n && e.outbound.offerId === r ? (i = e.outbound.bufferedCandidates, zi(e.relaySlots)) : (Ri(e.relaySlots), e.connectedPeer !== e.outbound.peer && Ji(e.outbound.peer))) : Ri(e.relaySlots), e.outbound = {
			phase: "answered",
			peer: n,
			offerId: r,
			expiryTimer: te(t, r, ji),
			bufferedCandidates: i
		};
	}, ie = async (e, t, n, r = 0) => {
		let a = i.get(t);
		if (!a || a.connection.phase === "connected" || a.inbound.phase !== "idle" || a.outbound.phase === "answered") {
			Vi(a, e);
			return;
		}
		if (a.relaySlots[e]?.phase !== "reserved") return;
		let o, s, c;
		try {
			[o, s, c] = await U([
				P(t),
				z(a, t),
				N()
			]);
		} catch (t) {
			throw Vi(a, e), Ki(i), t;
		}
		if (!s) {
			Vi(a, e);
			return;
		}
		if (p()) {
			ea(a);
			return;
		}
		if (((e) => e.connection.phase === "connected")(a) || a.inbound.phase !== "idle" || a.outbound.phase !== "advertising" || a.relaySlots[e]?.phase !== "reserved") {
			Vi(a, e);
			return;
		}
		let [u, d, m] = s, h = (e) => {
			!p() && a.connection.phase !== "connected" && Hi(a, u, m) && e.type === "candidate" && f(e, c, m).then((e) => {
				!p() && a.connection.phase !== "connected" && Hi(a, u, m) && n(o, l({
					peerId: c,
					offerId: m,
					candidate: e.sdp
				}));
			}).catch(W);
		}, g = setTimeout(() => {
			if (r >= 2 || p() || a.connection.phase === "connected" || a.inbound.phase !== "idle" || a.outbound.phase !== "advertising" || a.outbound.peer !== u || a.outbound.offerId !== m) {
				let n = i.get(t);
				n && n.connection.phase !== "connected" && (r >= 2 && Hi(n, u, m) ? n.relaySlots[e] = {
					phase: "exhausted",
					sendCandidate: h
				} : Bi(n, e), Ki(i));
			} else a.relaySlots[e] = { phase: "reserved" }, ie(e, t, n, r + 1).catch((e) => {
				p() || L("signal", e);
			});
		}, r === 0 && S[e] === void 0 ? 2e3 : (S[e] ?? C) * .9);
		K(g), n(o, l({
			peerId: c,
			offerId: m,
			offer: d
		})), a.relaySlots[e] = {
			phase: "retrying",
			retryTimer: g,
			sendCandidate: h
		}, a.outbound.bufferedCandidates.forEach(h);
	}, ae = async (e, t, n, r, i, a) => {
		if (e.inbound.phase !== "answering" || e.inbound.peer.isDead || e.inbound.replay.offer !== r || e.inbound.replay.offerId !== i) return;
		let { replay: o } = e.inbound, s = o.lastSentAt[t];
		if (s !== void 0 && Date.now() - s < 1e3) return;
		o.lastSentAt[t] = Date.now();
		let c = await P(n);
		if (!p() && e.connection.phase !== "connected" && e.inbound.phase === "answering" && e.inbound.replay === o) {
			let e = (e) => {
				a(c, e);
			};
			o.relays[t] = e, o.messages.forEach(e);
		}
	}, B = (e, t, n) => {
		let r = `${e}|${n}|${t}`, i = M.get(r);
		if (i) return i;
		let a = d({
			type: "offer",
			sdp: t
		}, e, n).catch((t) => (R(e, "offer", t), null)).finally(() => {
			M.delete(r);
		});
		return M.set(r, a), a;
	}, oe = async (e, t, n, a, o) => {
		if (!a) return;
		let s = w() ?? await N();
		if (O && !O(t, "inbound")) return;
		let c = i.get(t);
		if (c && (c.inbound.phase === "answering" || c.outbound.phase === "answered")) return ae(c, e, t, n, a, o);
		if (c && Ui(c) && s < t || F(t)) return;
		let u = await B(t, n, a);
		if (!u || p()) return;
		let d = na(i, t);
		if (d.connection.phase === "connected") return;
		if (d.inbound.phase === "answering" || d.outbound.phase === "answered") return ae(d, e, t, n, a, o);
		if (Ui(d)) {
			if (s < t) return;
			ea(d);
		}
		if (F(t)) {
			Ki(i);
			return;
		}
		let m = y(!1, r), h = {
			offer: n,
			offerId: a,
			messages: [],
			lastSentAt: [],
			relays: []
		};
		h.lastSentAt[e] = Date.now();
		let g = ee(t, m), _ = [];
		d.didReportFailure = !1, d.inbound = {
			phase: "answering",
			peer: m,
			offerId: a,
			expiryTimer: g,
			didSendAnswer: !1,
			replay: h
		};
		let v = (e) => !p() && e.inbound.phase === "answering" && e.inbound.peer === m && !m.isDead, S = () => {
			d.inbound.phase === "answering" && d.inbound.peer === m && d.connection.phase !== "connected" && d.inbound.didSendAnswer && I(d, t), Xi(d, m), x(m, t), Ki(i);
		};
		if (m.setHandlers({
			connect: () => {
				j.delete(t), b(m, t);
			},
			close: S,
			error: S
		}), m.isDead) {
			Xi(d, m), Ki(i);
			return;
		}
		let C = await P(t);
		if (!v(d) || d.inbound.replay !== h) return;
		h.relays[e] = (e) => {
			o(C, e);
		};
		let T = Promise.resolve(), E = (e) => {
			T = T.then(async () => {
				let t = await f(e, s, a);
				if (!v(d)) return;
				let n = e.type === "answer", r = l({
					peerId: s,
					offerId: a,
					...n ? { answer: t.sdp } : { candidate: t.sdp }
				}), i = Date.now();
				if (h.messages.push(r), h.relays.forEach((e, t) => {
					e && (h.lastSentAt[t] = i, e(r));
				}), n && _) {
					d.inbound.didSendAnswer = !0;
					let e = _;
					_ = null, e.forEach(E);
				}
			}).catch(W);
		};
		m.setHandlers({ signal: (e) => {
			!v(d) || e.type !== "answer" && e.type !== "candidate" || (e.type === "candidate" && _ ? _.push(e) : E(e));
		} }), await m.signal(u);
	}, se = async (e, t, n, r) => {
		if (!n) return;
		let a = i.get(e);
		if (!r && !a?.offerPeer && !a?.answeringPeer) return;
		let o;
		try {
			o = await d({
				type: we,
				sdp: t
			}, e, n);
		} catch {
			return;
		}
		let s = i.get(e), c = r && !r.isDead ? r : s && Hi(s, void 0, n) ? s.outbound.peer : s?.inbound.phase === "answering" && s.inbound.offerId === n ? s.inbound.peer : null;
		c && !c.isDead && c.signal(o);
	}, ce = async (e, t, n, r) => {
		if (!n) return;
		if (O && !O(e, r ? "outbound" : "inbound")) {
			if (r) _(r), Ji(r);
			else {
				let t = i.get(e);
				t && Hi(t, void 0, n) && ea(t);
			}
			return;
		}
		let a = w() ?? await N(), o;
		try {
			o = await d({
				type: "answer",
				sdp: t
			}, e, n);
		} catch (t) {
			r && (_(r), Ji(r)), R(e, "answer", t);
			return;
		}
		if (r) {
			if (!g(r) || r.isDead) {
				Ji(r);
				return;
			}
			let t = na(i, e);
			if (t.connection.phase === "connected" || t.outbound.phase === "answered" || t.inbound.phase === "answering" && !t.inbound.peer.isDead && a > e) {
				r.destroy();
				return;
			}
			t.inbound.phase === "answering" && Xi(t, t.inbound.peer), ea(t), re(t, e, r, n), ne(t, e, r), r.signal(o);
			return;
		}
		let s = i.get(e);
		if (!s || s.outbound.phase !== "advertising" || s.outbound.offerId !== n || s.outbound.peer.isDead) return;
		let c = s.outbound.peer;
		re(s, e, c, n), c.signal(o);
	}, V = (e, t, n, r) => P(e).then((e) => {
		!p() && n.connection.phase !== "connected" && n.inbound.phase === "idle" && n.outbound.phase !== "answered" && r(e, l({ peerId: t }));
	});
	return {
		handleMessage: (e) => async (t, n, r) => {
			try {
				if (p()) return;
				k[e] = r;
				let s = Di(n);
				if (!s) return;
				let [c, l, d, f, m, h] = s, g = w();
				if (!c || g && c === g) return;
				let [_, v, y] = await U([
					o,
					u,
					N()
				]);
				if (c === y || p() || t !== _ && t !== v) return;
				D?.(c, e, r);
				let b = i.get(c);
				if (b?.connection.phase === "connected") {
					let e = Ai(b.connection.peer);
					if (e === "live") {
						b.connection.unhealthySince = null;
						return;
					}
					if (e === "stale") $i(b);
					else {
						var a;
						let e = Date.now();
						if (e - ((a = b.connection).unhealthySince ?? (a.unhealthySince = e)) < Pi) return;
						$i(b);
					}
				}
				if (!l && !d && !f) {
					if (O && !O(c, "outbound") || !i.has(c) && F(c)) return;
					let t = na(i, c);
					if (t.inbound.phase !== "idle" || t.connection.phase === "connected" || t.outbound.phase === "answered") return;
					if (y >= c && !t.offerPeer) {
						let n = qi.get(t);
						n || (n = [], qi.set(t, n));
						let i = n[e];
						if (i !== void 0 && Date.now() - i < 1e3) return;
						n[e] = Date.now(), await V(c, y, t, r);
						return;
					}
					Ii(t.relaySlots[e]) && (t.relaySlots[e] = { phase: "reserved" }, await ie(e, c, r));
					return;
				}
				if (l) {
					await oe(e, c, l, m, r);
					return;
				}
				if (f) {
					await se(c, f, m, h);
					return;
				}
				d && await ce(c, d, m, h);
			} catch (e) {
				p() || L("signal", e);
			}
		},
		dialPeer: (e) => {
			Si(e) && N().then((t) => {
				if (p() || !e || e === t || O && !O(e, "outbound") || !i.has(e) && F(e)) return;
				let n = na(i, e);
				if (n.connection.phase === "connected" || n.inbound.phase !== "idle" || n.outbound.phase !== "idle" || !k.some(Boolean)) return;
				let r = Date.now(), a = j.get(e);
				if (a && r < a[1]) return;
				let o = (a?.[0] ?? 0) + 1;
				j.set(e, [o, r + Math.min(6e4, 2e3 * 2 ** (o - 1))]), k.forEach((r, i) => {
					r && (t < e ? n.outbound.phase !== "answered" && Ii(n.relaySlots[i]) && (n.relaySlots[i] = { phase: "reserved" }, ie(i, e, r).catch((e) => {
						p() || L("signal", e);
					})) : V(e, t, n, r).catch(W));
				});
			}).catch((e) => {
				p() || L("signal", e);
			});
		}
	};
}, ia = 18e4, aa = 20, oa = /*@__PURE__*/ s("room left while preparing offer"), sa = (e) => {
	let t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new Set(), r = !1, i = (e) => {
		let r = t.get(e);
		r?.phase === "leased" && G(r.timer), n.delete(e), t.set(e, { phase: "closed" }), e.destroy();
	}, a = (e) => {
		if (r || e.isDead) return !1;
		let i = t.get(e);
		if (!i) return !0;
		switch (i.phase) {
			case "leased": return G(i.timer), n.delete(e), t.set(e, { phase: "claimed" }), !0;
			case "claimed": return !0;
			case "closed": return !1;
			default: return c(i);
		}
	}, o = (e) => {
		t.get(e)?.phase === "leased" && i(e);
	}, s = (s, c, l, u = aa) => {
		let d = async (s = !1) => {
			if (r) throw oa;
			let f = e(), p = ve(u);
			try {
				let e = await l(f, p);
				if (r) throw oa;
				if (c) {
					let r = setTimeout(() => {
						t.get(f)?.phase === "leased" && i(f);
					}, ia);
					return K(r), t.set(f, {
						phase: "leased",
						timer: r
					}), n.add(f), {
						peer: f,
						offer: e,
						offerId: p,
						claim: () => {
							a(f);
						},
						reclaim: () => o(f)
					};
				}
				return {
					peer: f,
					offer: e,
					offerId: p
				};
			} catch (e) {
				if (f.destroy(), !s && !r) return d(!0);
				throw e;
			}
		};
		return U(ge(s, () => d()));
	};
	return {
		checkout: s,
		getOffers: (e, t) => s(e, !0, t),
		claimLeased: a,
		reclaimLeased: o,
		destroy: () => {
			if (!r) {
				r = !0;
				for (let e of Array.from(n)) i(e);
			}
		}
	};
}, ca = 15e3, la = 150, ua = 5e3, da = "icecandidate", fa = "icegatheringstatechange", pa = "iceconnectionstatechange", ma = "offer", ha = "answer", ga = /out of range/i, _a = 128, va = 8192, ya = (e, t) => {
	let { trickleIce: n, rtcConfig: r, rtcPolyfill: i, turnConfig: a } = t, o = [...r?.iceServers ?? ba, ...a ?? []], l = new (i ?? RTCPeerConnection)({
		...r,
		iceServers: o
	}), u, d, f, p = /* @__PURE__ */ new Set(), m = n !== !1, h = [], g = null, _ = /* @__PURE__ */ new WeakMap(), v = (e, t) => {
		let n = _.get(e);
		n || (n = /* @__PURE__ */ new Set(), _.set(e, n)), n.add(t);
	}, y = { phase: "open" }, b = { phase: "idle" }, x = 0, S = { phase: "unbound-idle" }, C, w = [], T, E = [], D = null, O, k = null, A = e ? new Promise((e) => {
		k = e;
	}) : void 0, j = (e) => {
		if (k) {
			let t = k;
			k = null, O = e, t(e);
		}
	}, M = () => {
		y.phase === "disconnected-grace" && (G(y.timer), y = { phase: "open" });
	}, N = () => {
		y.phase !== "closed" && (y.phase === "disconnected-grace" && G(y.timer), y = { phase: "closed" }, x += 1, b = { phase: "idle" }, j(), S.phase === "unbound-buffering" && (G(S.deadlineTimer), S.queue.length = 0), S = { phase: "closed" }, C = void 0, w.length = 0, T = void 0, E.length = 0, h.length = 0, p.forEach((e) => e()), d?.());
	}, F = () => (y.phase !== "closed" && l.connectionState === "closed" && N(), y.phase === "closed"), I = (e) => {
		if (!F()) {
			if (e.type === ma) {
				let t = k !== null;
				if (j(e), t && !C && !l.remoteDescription) return;
			}
			C ? C(e) : w.push(e);
		}
	}, L = (e) => {
		if (!F()) {
			if (C) {
				let t = C;
				C = (n) => {
					t(n), e(n);
				};
			} else {
				C = e;
				for (let e of w.splice(0)) {
					if (F() || !C) break;
					C(e);
				}
			}
		}
	}, R = (e) => ({
		type: e.localDescription?.type ?? ma,
		sdp: e.localDescription?.sdp ?? ""
	}), te = () => l.remoteDescription?.sdp?.match(/a=ice-ufrag:(\S+)/)?.[1] ?? null, ne = (e) => {
		if (!l.remoteDescription) return !1;
		let t = (l.remoteDescription.sdp?.match(/^m=/gm) ?? []).length;
		if (typeof e.sdpMLineIndex == "number" && t > 0 && e.sdpMLineIndex >= t) return !1;
		let n = te();
		return !(n && e.usernameFragment && e.usernameFragment !== n);
	}, z = async (e) => {
		try {
			return await l.addIceCandidate(e), !0;
		} catch (t) {
			if (t instanceof Error && ga.test(t.message) && typeof e.sdpMLineIndex == "number") return !1;
			throw t;
		}
	}, re = (e) => {
		F() || (h.length >= _a && h.shift(), h.push(e));
	}, ie = async () => {
		if (F() || !l.remoteDescription || g && (await g, F() || !l.remoteDescription) || !h.length) return;
		let e = (async () => {
			let e = [];
			try {
				for (; !F() && l.remoteDescription && h.length > 0;) {
					let t = te();
					for (let n of h.splice(0)) {
						if (F()) return;
						t && n.usernameFragment && n.usernameFragment !== t || ne(n) && await z(n) || e.push(n);
					}
				}
			} finally {
				if (!F() && e.length > 0) {
					let t = h.splice(0);
					for (let n of [...e, ...t]) re(n);
				}
				g = null;
			}
		})();
		g = e, await e;
	}, ae = async (e) => {
		g || !ne(e) ? re(e) : await z(e) || re(e);
	}, B = (e) => {
		e.binaryType = "arraybuffer", e.bufferedAmountLowThreshold = 65535;
		let t = () => {
			P("excessive pre-handler data; disconnecting peer"), e.close(), l.close(), N();
		};
		e.onmessage = (n) => {
			if (D !== e || S.phase === "closed") return;
			let r = n.data, i = S.phase === "bound" ? yr : br;
			if (!(r instanceof ArrayBuffer) && !ArrayBuffer.isView(r) || r.byteLength > i) t();
			else switch (S.phase) {
				case "bound":
					S.handler(r);
					break;
				case "unbound-idle": {
					let e = setTimeout(t, xr);
					K(e), S = {
						phase: "unbound-buffering",
						queue: [r],
						deadlineTimer: e
					};
					break;
				}
				case "unbound-buffering":
					if (S.queue.length >= 64) {
						t();
						return;
					}
					S.queue.push(r);
					break;
				default: c(S);
			}
		}, e.onopen = () => {
			D === e && !F() && u?.();
		}, e.onclose = () => {
			D === e && N();
		}, e.onerror = ({ error: t }) => {
			D !== e || F() || t?.errorDetail === "sctp-failure" && (t.sctpCauseCode === 12 || /^User-Initiated Abort\b/.test(t.message)) || f?.(Te(t, "data channel error"));
		};
	}, oe = Le(o, /^turns?:/i), se = !oe && Le(o, /^stuns?:/i), ce = oe ? /\btyp relay\b/ : se ? /\btyp (?:srflx|relay|prflx)\b/ : /\btyp (?:host|srflx|relay|prflx)\b/, V = async (e) => (await new Promise((t) => {
		let n = !1, r = null, i = () => {
			n || (n = !0, G(c), G(r), e.removeEventListener(fa, o), e.removeEventListener(da, s), p.delete(i), t());
		}, a = (t = "") => {
			if (n) return;
			let a = `${e.localDescription?.sdp ?? ""}\n${t}`;
			ce.test(a) && (G(r), r = setTimeout(i, la), K(r));
		}, o = () => {
			e.iceGatheringState === "complete" || F() ? i() : a();
		}, s = (e) => {
			let { candidate: t } = e;
			t ? a(t.candidate) : i();
		}, c = setTimeout(i, ca);
		K(c), p.add(i), e.addEventListener(fa, o), e.addEventListener(da, s), o();
	}), R(e)), H = () => m ? R(l) : V(l), le = async (e) => {
		let t = await H();
		if (!(F() || e !== void 0 && x !== e)) return I(t), t;
	};
	e ? (D = l.createDataChannel("data"), B(D)) : l.ondatachannel = ({ channel: e }) => {
		D && D !== e && (D.onopen = D.onclose = D.onmessage = D.onerror = null, D.close()), D = e, B(e);
	};
	let ue = async () => {
		if (F() || b.phase !== "idle" || l.signalingState !== "stable") {
			F() && j();
			return;
		}
		let e = ++x;
		b = {
			phase: "making-offer",
			gen: e
		};
		try {
			return await l.setLocalDescription(), F() || x !== e ? void 0 : await le(e);
		} catch (t) {
			if (x !== e) return;
			j(), f?.(Te(t, "failed to create local offer"));
		} finally {
			b.phase === "making-offer" && b.gen === e && (b = { phase: "idle" });
		}
	};
	l.onnegotiationneeded = () => {
		ue();
	}, l.onicecandidate = ({ candidate: e }) => {
		if (!m || !e || F()) return;
		let t = typeof e.toJSON == "function" ? e.toJSON() : {
			candidate: e.candidate,
			sdpMid: e.sdpMid,
			sdpMLineIndex: e.sdpMLineIndex,
			usernameFragment: e.usernameFragment
		};
		I({
			type: we,
			sdp: JSON.stringify(t)
		});
	};
	let de = () => l.connectionState === "disconnected" || l.iceConnectionState === "disconnected", fe = () => {
		if (y.phase === "closed") return;
		let e = l.connectionState, t = l.iceConnectionState;
		if (e === "failed" || e === "closed" || t === "failed" || t === "closed") N();
		else if (e === "connected" || e === "connecting" || t === "connected" || t === "completed" || t === "checking") M();
		else if (de() && y.phase === "open") {
			let e = setTimeout(() => {
				y.phase === "disconnected-grace" && (y = { phase: "open" }, de() && N());
			}, ua);
			K(e), y = {
				phase: "disconnected-grace",
				timer: e
			};
		}
	};
	return l.onconnectionstatechange = fe, l.addEventListener(pa, fe), l.ontrack = (e) => {
		let t = e.streams[0];
		t && !F() && (T ? T(t) : E.push(t));
	}, e && queueMicrotask(() => {
		!F() && b.phase === "idle" && l.signalingState === "stable" && !l.localDescription && l.onnegotiationneeded?.(new Event("negotiationneeded"));
	}), {
		connection: l,
		get channel() {
			return D;
		},
		get isDead() {
			return F();
		},
		getOffer: async () => {
			if (e) return k === null ? O && !l.remoteDescription ? O : l.localDescription?.type === ma ? H() : O : A;
		},
		async signal(t) {
			if (!F()) {
				if (t.type === "candidate") {
					if (t.sdp.length > va) return;
					try {
						let e = JSON.parse(t.sdp);
						e && typeof e == "object" && await ae(e);
					} catch (e) {
						f?.(Te(e, "failed to parse remote candidate"));
					}
				} else if (D?.readyState !== "open" || t.sdp?.includes("a=rtpmap")) try {
					let n = { ...t };
					if (t.type === ma) {
						let t = b.phase === "making-offer" || l.signalingState !== "stable" && b.phase !== "applying-remote-answer";
						return t && e ? void 0 : (x += 1, b.phase === "making-offer" && (b = { phase: "idle" }), t && l.signalingState !== "stable" ? await U([l.setLocalDescription({ type: "rollback" }), l.setRemoteDescription(n)]) : await l.setRemoteDescription(n), await ie(), await l.setLocalDescription(), await le());
					}
					if (t.type === ha) {
						b = { phase: "applying-remote-answer" };
						try {
							await l.setRemoteDescription(n), await ie();
						} finally {
							b.phase === "applying-remote-answer" && (b = { phase: "idle" });
						}
					}
				} catch (e) {
					F() || f?.(Te(e, "failed to apply remote signal"));
				}
			}
		},
		sendData: (e) => {
			if (F() || !D || D.readyState === "closing" || D.readyState === "closed") throw s(ee);
			D.send(e);
		},
		destroy: () => {
			M(), j(), D?.close(), l.connectionState !== "closed" && l.close(), N();
		},
		setHandlers: (e) => {
			if ("connect" in e && (u = e.connect), "close" in e && (d = e.close), "error" in e && (f = e.error), "data" in e && S.phase !== "closed") {
				let t = e.data;
				if (t) {
					let e = [];
					S.phase === "unbound-buffering" && (G(S.deadlineTimer), e = S.queue.splice(0)), S = {
						phase: "bound",
						handler: t
					};
					for (let t of e) {
						if (S.phase !== "bound") break;
						S.handler(t);
					}
				} else S.phase === "unbound-buffering" && G(S.deadlineTimer), S = { phase: "unbound-idle" };
			}
			if (e.signal && L(e.signal), "stream" in e && !F() && (T = e.stream, T)) for (let e of E.splice(0)) {
				if (F() || !T) break;
				T(e);
			}
		},
		addStream: (e) => {
			e.getTracks().forEach((t) => {
				let n = l.addTrack(t, e);
				n && v(e, n);
			});
		},
		removeStream: (e) => {
			let t = _.get(e);
			if (t) {
				_.delete(e), t.forEach((e) => l.removeTrack(e));
				return;
			}
			let n = e.getTracks();
			l.getSenders().forEach((e) => {
				e.track && n.includes(e.track) && l.removeTrack(e);
			});
		},
		addTrack: (e, t) => {
			let n = l.addTrack(e, t);
			n && t && v(t, n);
		},
		removeTrack: (e, t) => {
			let n = l.getSenders().find((t) => t.track === e);
			n && (t && _.get(t)?.delete(n), l.removeTrack(n));
		},
		replaceTrack: (e, t) => {
			let n = l.getSenders().find((t) => t.track === e);
			if (n) return n.replaceTrack(t);
		}
	};
}, ba = [...ge(3, (e, t) => `stun:stun${t || ""}.l.google.com:19302`), "stun:stun.cloudflare.com:3478"].map((e) => ({ urls: e })), xa = 64, Sa = "request failed", Ca = (e) => J(e) && typeof e.r == "string" ? e : null, wa = (e) => {
	let t = Ca(e);
	return t ? [t.r, Object.hasOwn(t, "m") ? t.m : void 0] : null;
}, Ta = (e) => {
	let t = Ca(e);
	return t ? [t.r, typeof t.e == "string" ? t.e : void 0] : null;
}, Ea = (e, t) => t === void 0 ? e : {
	...e,
	metadata: t
}, Da = (e, t) => e ? {
	[M]: e,
	...t === void 0 ? {} : { m: t }
} : t, Oa = (e) => {
	if (J(e) && M in e) {
		let t = e[M];
		return [Be(t) ? t : void 0, Object.hasOwn(e, "m") ? e.m : void 0];
	}
	return [void 0, e];
}, ka = (e) => {
	if (e === void 0) return [];
	let t = [e].flat().filter(Boolean);
	if (t.length === 0) throw s("action roles must contain at least one non-empty role name");
	return [...new Set(t)].sort();
}, Aa = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]), ja = (e) => {
	let t = e.getTransport, n = (t) => e.getPeerUserId ? e.getPeerUserId(t) : t, r = (t) => e.getPeerRoles ? [...e.getPeerRoles(t)] : [], i = (e) => !!t(e, !1)?.isOpen, a = Object.create(null), o = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), { makeWireAction: d, handleData: f, clearPeer: p } = oi({
		resolveTransport: t,
		getPeerIds: e.getPeerIds,
		canReceiveFromPeer: e.canReceiveFromPeer,
		onPeerError: e.onPeerError,
		...e.broadcastInline ? { broadcastInline: e.broadcastInline } : {},
		...e.onUnknownType ? { onUnknownType: e.onUnknownType } : {},
		...e.maxReceiveBytes === void 0 ? {} : { maxReceiveBytes: e.maxReceiveBytes }
	}), m = (e, t) => e ? (r, i) => {
		let a = e(r, Ea({
			peerId: i,
			userId: n(i)
		}, t));
		a && typeof a.then == "function" && Promise.resolve(a).catch((e) => L("progress handler", e));
	} : void 0, h = (t, r = {}) => {
		let i = t.startsWith("@_") ? t : `@_${t}`, a = !!r.sendToPending, s = d(i, r), c = o.get(i);
		if (c) return c;
		let [l, u, , f] = k("progress handler"), [p, h] = k("internal action handler", (e) => {
			s.onMessage(e ? (e, t, r) => {
				h(e, Ea({
					peerId: t,
					userId: n(t)
				}, r));
			} : null);
		}), [g, _] = A("onReceive", (e) => {
			s.onReceive(e ? (t) => e(Ea({
				peerId: t.peerId,
				userId: n(t.peerId),
				byteLength: t.byteLength,
				signal: t.signal
			}, t.metadata)) : null);
		});
		s.onProgress((e, t, r) => {
			f() && u(e, Ea({
				peerId: t,
				userId: n(t)
			}, r));
		});
		let v = j({
			send: (t, n = {}) => s.send(t, e.resolveSendTarget ? e.resolveSendTarget(n.target, a) : n.target, n.metadata, m(n.onProgress, n.metadata), n.signal),
			onMessage: (e, t) => p(e, t),
			onReceiveProgress: (e, t) => l(e, t),
			onReceive: (e, t) => g(e ?? _(), t)
		}, [
			"onMessage",
			"onReceive",
			"onReceiveProgress"
		]);
		return o.set(i, v), v;
	}, g = (e) => {
		let t = e.state;
		switch (t.phase) {
			case "done": return !1;
			case "preparing": return e.state = { phase: "done" }, l.delete(e.requestId), t.controller.abort(), !0;
			case "active": return e.state = { phase: "done" }, G(t.timer), l.delete(e.requestId), t.controller.abort(), !0;
			default: return c(t);
		}
	}, _ = (e) => e.state.phase === "done", v = (e, t) => {
		if (e.state.phase !== "preparing") return !1;
		let n = null;
		return t !== void 0 && (n = setTimeout(() => {
			e.state.phase === "active" && e.reject(Xr("timeout", "request timed out"));
		}, t), K(n)), e.state = {
			phase: "active",
			controller: e.state.controller,
			timer: n
		}, !0;
	}, y = (e, t) => {
		p(e);
		let n = u.get(e);
		n && (u.delete(e), n.forEach((e) => e.abort()));
		let r = Xr("disconnected", q(t, ee));
		for (let t of Array.from(l.values())) if (t.peerId === e) switch (t.state.phase) {
			case "preparing":
			case "active":
				t.reject(r);
				break;
			case "done": break;
			default: c(t.state);
		}
	}, b = (e, t) => {
		let n = Ta(t), r = n ? l.get(n[0]) : void 0;
		return n && r && r.state.phase === "active" && r.peerId === e ? [n, r] : null;
	}, x = d("@_response", { receiveScope: (e, t) => {
		let i = b(e, t);
		if (!i) return null;
		let [a, o] = i;
		if (o.state.phase !== "active") return null;
		let s = a[1] === void 0 ? o.getReceive() : null;
		return [
			a[0],
			o.state.controller.signal,
			s ? (e) => s({
				byteLength: e.byteLength,
				peerId: e.peerId,
				userId: n(e.peerId),
				kind: "response",
				signal: e.signal,
				roles: r(e.peerId)
			}) : null,
			(e) => {
				o.reject(Xr("rejected", e));
			}
		];
	} });
	x.onProgress((e, t, r) => {
		let i = b(t, r);
		i && i[0][1] === void 0 && i[1].emitReceiveProgress(e, {
			peerId: t,
			userId: n(t)
		});
	}), x.onMessage((e, t, n) => {
		let r = b(t, n);
		if (!r) return;
		let [i, a] = r;
		i[1] === void 0 ? a.resolve(e) : a.reject(Xr("rejected", i[1]));
	});
	let S = (t, o, c) => {
		if (!c && t.startsWith("@_")) throw s(`action namespace "${t}" is reserved for internal protocol use`);
		if (o && ("onMessage" in o || "onRequest" in o || "onReceive" in o || "onReceiveProgress" in o)) throw s("makeAction config does not accept event handlers; subscribe via action.on*(fn)");
		let f = o?.kind ?? "message", p = ka(o?.roles), h = p.length > 0, y = a[t];
		if (y) {
			if (y.kind !== f || y.internal !== c || !Aa(y.requiredRoles, p)) throw de(t);
			return y.action;
		}
		h && e.registerActionAuthority?.(t, p);
		let b = d(t), [S, C, w, T] = k("progress handler"), E = (e) => Oa(f === "request" ? wa(e)?.[1] : e), D = (t) => (e.resolveRequestTarget ? e.resolveRequestTarget(t, !1) : t) ?? t, O = (e, t) => Ea({
			peerId: e,
			userId: n(e),
			roles: r(e)
		}, t), M = (e, t) => ({
			...O(e.peerId, t),
			byteLength: e.byteLength,
			signal: e.signal,
			kind: f
		}), N = () => {
			!F() && !h ? b.onReceive(null) : b.onReceive((t) => {
				let [n, r] = E(t.metadata);
				if (!h) {
					let e = F();
					return !e || e(M(t, r));
				}
				if (!e.authorizePeerAction) return !1;
				let i = e.authorizePeerAction(t.peerId, p, n), a = (e) => {
					if (!e) return !1;
					let n = F();
					return !n || n(M(t, r));
				};
				return typeof i == "boolean" ? a(i) : i.then(a, () => !1);
			});
		}, [P, F, I] = A("onReceive", () => N());
		N(), b.onProgress((e, t, r) => {
			if (T()) {
				let [, i] = E(r);
				C(e, Ea({
					peerId: t,
					userId: n(t)
				}, i));
			}
		});
		let L = async (n) => {
			if (!h) return n;
			if (!e.getLocalActionCert) throw s(`${ce} for action "${t}": requires [${p.join(", ")}]`);
			return Da(await e.getLocalActionCert(p, t), n);
		};
		if (f === "message") {
			let n = (t, n, r) => {
				if (h && (!e.authorizePeerAction || e.authorizePeerAction(n, p) !== !0)) return;
				let [, a] = Oa(r);
				i(t, O(n, a));
			}, [r, i, o] = k("action handler", (e) => b.onMessage(e ? n : null)), s = j({
				send: async (t, n = {}) => {
					Zr(n.signal);
					let r = h ? await L(n.metadata) : n.metadata;
					await b.send(t, e.resolveSendTarget ? e.resolveSendTarget(n.target, !1) : n.target, r, m(n.onProgress, n.metadata), n.signal);
				},
				onMessage: (e, t) => r(e, t),
				onReceive: (e, t) => P(e, t),
				onReceiveProgress: (e, t) => S(e, t)
			}, [
				"onMessage",
				"onReceive",
				"onReceiveProgress"
			]);
			return a[t] = {
				kind: f,
				requiredRoles: p,
				action: s,
				internal: c,
				clear: () => {
					o(), I(), w();
				}
			}, s;
		}
		b.onReject((e, t, n) => {
			let r = wa(t);
			r && x.send(null, e, {
				r: r[0],
				e: n
			}).catch(W);
		});
		let R = (t, n, r) => {
			let i = wa(r);
			if (!i) return;
			let a = i[0], o = u.get(n);
			if ((o?.size ?? 0) >= xa) {
				x.send(null, n, {
					r: a,
					e: "too many concurrent requests"
				}).catch(W);
				return;
			}
			let c = new AbortController();
			o || (o = /* @__PURE__ */ new Set(), u.set(n, o)), o.add(c), (async () => {
				if (h && (!e.authorizePeerAction || await e.authorizePeerAction(n, p) !== !0)) throw s(`${ce} for request`);
				let r = te();
				if (!r) throw s("no active request handler");
				let [, a] = Oa(i[1]), o = await r(t, {
					...O(n, a),
					signal: c.signal
				});
				if (o === void 0) throw s("request handler returned undefined");
				return o;
			})().then((e) => c.signal.aborted ? void 0 : x.send(e, n, { r: a }, void 0, c.signal), (e) => c.signal.aborted ? void 0 : x.send(null, n, {
				r: a,
				e: q(e, Sa).slice(0, 512)
			}, void 0, c.signal)).catch(W).finally(() => {
				let e = u.get(n);
				e?.delete(c), e && !e.size && u.delete(n), c.abort();
			});
		}, [ee, te, ne] = A("onRequest", (e) => b.onMessage(e ? R : null)), z = async (e, t, n, r) => {
			let { metadata: a, onProgress: o, signal: s, timeoutMs: c } = r;
			if (Zr(s), !i(t)) throw Xr("disconnected", pe(n));
			let u = crypto.randomUUID(), d = new AbortController(), { promise: f, resolve: p, reject: y } = Promise.withResolvers();
			f.catch(W);
			let x = {
				requestId: u,
				peerId: t,
				state: {
					phase: "preparing",
					controller: d
				},
				getReceive: F,
				emitReceiveProgress: C,
				resolve: (e) => {
					g(x) && p(e);
				},
				reject: (e) => {
					g(x) && y(e);
				}
			};
			if (l.set(u, x), s) {
				let e = () => {
					x.reject(Xr("aborted", se));
				};
				s.aborted ? e() : s.addEventListener("abort", e, {
					once: !0,
					signal: d.signal
				});
			}
			if (_(x)) return await f;
			let S = a;
			if (h) {
				try {
					S = await L(a);
				} catch (e) {
					return x.reject(Te(e, Sa)), await f;
				}
				if (_(x)) return await f;
				if (!i(t)) return x.reject(Xr("disconnected", pe(n))), await f;
			}
			if (!v(x, c)) return await f;
			try {
				let n = s ? AbortSignal.any([d.signal, s]) : d.signal;
				return b.send(e, t, S === void 0 ? { r: u } : {
					r: u,
					m: S
				}, m(o, a), n).catch((e) => {
					x.reject(Te(e, Sa));
				}), await f;
			} finally {
				x.reject(Xr("aborted", se));
			}
		}, re = j({
			request: (e, t) => {
				let { target: n, ...r } = t;
				return z(e, D(n), n, r);
			},
			requestMany: async (e, t) => {
				let { targets: r, onResult: i, ...a } = t;
				return Zr(a.signal), U(r.map(async (t) => {
					let r = D(t), o = {
						peerId: r,
						userId: n(r) || t
					}, s;
					try {
						s = {
							...o,
							status: "fulfilled",
							value: await z(e, r, t, a)
						};
					} catch (e) {
						let t = Te(e, Sa);
						if (t.kind === "aborted" || !t.kind) throw t;
						s = t.kind === "timeout" || t.kind === "disconnected" ? {
							...o,
							status: t.kind
						} : {
							...o,
							status: "rejected",
							error: t
						};
					}
					return i?.(s), s;
				}));
			},
			onRequest: (e, t) => ee(e, t),
			onReceive: (e, t) => P(e, t),
			onReceiveProgress: (e, t) => S(e, t)
		}, [
			"onRequest",
			"onReceive",
			"onReceiveProgress"
		]);
		return a[t] = {
			kind: f,
			requiredRoles: p,
			action: re,
			internal: c,
			clear: () => {
				ne(), I(), w();
			}
		}, re;
	};
	return {
		makeAction: ((e, t) => S(e, t, !1)),
		makeInternalAction: h,
		makeInternalRequestAction: (e) => {
			let t = e.startsWith("@_") ? e : `@_${e}`;
			return S(t, { kind: "request" }, !0);
		},
		handleData: f,
		clearPeer: y,
		clearListeners: () => {
			Ce(a).forEach((e) => {
				e.internal || e.clear();
			});
		}
	};
}, Ma = /*@__PURE__*/ s("peer identity verification failed"), Na = /*@__PURE__*/ s("peer disconnected during handshake"), Pa = 1e4, Fa = 16, Ia = `__${r}_id`, La = /*@__PURE__*/ i("id-hs", 2), Ra = (e) => {
	if (!e || typeof e != "string") return [];
	let t = e.matchAll(/^a=fingerprint:([^\r\n]+)$/gm), n = /* @__PURE__ */ new Set();
	for (let e of t) {
		let t = e[1]?.trim().toLowerCase();
		t && n.add(t);
	}
	return [...n].sort();
}, za = async (e, t, n, r, i = []) => {
	if (!e || typeof e != "object") throw Ma;
	let a = e;
	if (a[Ia] !== t || typeof a.n != "string" || a.n.length < 16 || !Array.isArray(a.dtls) || !Y(a.uid) || typeof a.pk != "string" || typeof a.uk != "string" || t === 2 && (typeof a.ps != "string" || typeof a.us != "string")) throw Ma;
	let o = a.dtls.filter((e) => typeof e == "string");
	if (r.length > 0 && r.join(",") !== o.join(",") || i.length > 0 && o.length === 0) throw s("DTLS fingerprint mismatch");
	let c = Kt(a.pk), l = Kt(a.uk);
	if (!c || !l) throw Ma;
	let [u, d] = await U([an(n, c), on(a.uid, l)]);
	if (!u || !d) throw Ma;
	return [
		a.n,
		o,
		a.uid,
		c,
		l,
		typeof a.ps == "string" ? a.ps : void 0,
		typeof a.us == "string" ? a.us : void 0
	];
}, Ba = async (e, t, n, r, i) => {
	let [a, o] = await U([tn(b(t), e, r), tn(b(n), e, i)]);
	if (!a || !o) throw Ma;
}, Va = (e) => {
	let { endpointIdentityP: t, appId: n, roomId: r, getUserIdentity: i, onVerified: a } = e, o = async (e, n) => {
		let [r, i] = await U([(await t).sign(e), n.sign(e)]);
		return {
			ps: y(r),
			us: y(new Uint8Array(i))
		};
	}, c = (e, t, r, i, a, o, s, c, u) => d(l([
		La,
		n,
		e,
		t,
		r,
		i,
		a,
		o,
		s,
		c,
		u
	]));
	return { run: async (n, l, u, d, f) => {
		let [p, m, h] = await U([
			r,
			i(),
			t
		]), g = h.peerId, _ = f ?? e.getPeerHandle?.(n), v = Ra(_?.connection?.localDescription?.sdp), y = Ra(_?.connection?.remoteDescription?.sdp);
		if (_?.connection && (!v.length || !y.length)) throw s("DTLS fingerprint missing");
		let b = (e, t, n) => l({
			[Ia]: e,
			n: t,
			dtls: v,
			uid: m.userId,
			pk: Gt(h.signPubJwk),
			uk: Gt(m.signPubJwk),
			...n
		}), x = (e, t) => za(e, t, n, y, v), S = (e) => y.length > 0 ? y : e, C = (e, t, n) => ({
			userId: e,
			peerPubKey: t,
			userPubKey: n
		});
		if (d) {
			let e = crypto.randomUUID();
			await b(1, e);
			let { data: t } = await u(), [r, i, s, d, f, h, y] = await x(t, 2), w = c(p, g, n, e, r, v, S(i), m.userId, s);
			await Ba(w, h, y, d, f);
			let T = await o(w, m), E = () => l({
				[Ia]: 3,
				...T
			}), D = C(s, d, f);
			try {
				a?.(n, D, _);
			} catch (e) {
				throw e === z && await E(), e;
			}
			return await E(), D;
		}
		let { data: w } = await u(), [T, E, D, O, k] = await x(w, 1), A = crypto.randomUUID(), j = c(p, n, g, T, A, S(E), v, D, m.userId);
		await b(2, A, await o(j, m));
		let { data: M } = await u();
		if (!M || typeof M != "object") throw Ma;
		let N = M;
		if (N[Ia] !== 3 || typeof N.ps != "string" || typeof N.us != "string") throw Ma;
		await Ba(j, N.ps, N.us, O, k);
		let P = C(D, O, k);
		return a?.(n, P, _), P;
	} };
}, Ha = (e, t) => {
	e.messages.length = 0;
	for (let [, n] of e.waiters.splice(0)) n(t);
}, Ua = (e) => {
	"timer" in e && G(e.timer);
}, Wa = (e) => {
	let { selfIdP: t, onPeerHandshake: n, onHandshakeError: r, deferResponderReady: i, sendHandshakeData: a, sendHandshakeReady: o, onLocalHandshakePassed: l, acquireAdmissionSlot: u, beforeSendHandshakeReady: d, onActivate: f, onFailure: p } = e, m = /* @__PURE__ */ new Map(), h = (e, t) => {
		let n = m.get(e);
		if (!(!n || n.phase === "active" || t && n.peer !== t)) return n;
	}, g = (e, t) => {
		Ua(t), m.set(e, {
			phase: "active",
			peer: t.peer
		}), f(e, t.peer);
	}, _ = (e, t, n) => {
		let i = m.get(e);
		i && i.peer === t && (Ua(i), r?.(e, n), p(e, t, n));
	}, v = (e, t, n, r) => {
		if (!u(e, t)) return;
		let i = h(e, t);
		if (!i) return;
		let a = r || i.phase === "awaiting-remote-ready" || "remoteReady" in i && i.remoteReady;
		m.set(e, {
			phase: "preparing-ready",
			peer: t,
			timer: n,
			remoteReady: a
		});
		let c = (n) => {
			let r = m.get(e);
			if (!r || r.phase !== "preparing-ready" || r.peer !== t) return;
			let i = r.remoteReady;
			i ? (Ua(r), m.set(e, {
				phase: "active",
				peer: t
			})) : m.set(e, {
				phase: "awaiting-peer-ready",
				peer: t,
				timer: r.timer
			}), o(n || "", e).catch((n) => _(e, t, s(`handshake ready send failed: ${q(n, "send failed")}`))), i && f(e, t);
		}, l;
		try {
			l = d(e, t);
		} catch {
			l = void 0;
		}
		l ? l.then(c, () => c()) : c();
	}, y = (e, t) => {
		let n = m.get(e);
		n && (Ua(n), "queue" in n && Ha(n.queue, t), m.delete(e));
	};
	return {
		addPeer: (e, t) => {
			m.has(e) && y(e, Na), m.set(e, {
				phase: "added",
				peer: t,
				queue: {
					messages: [],
					waiters: []
				},
				remoteReady: !1
			});
		},
		clearPeer: y,
		canReceiveFromPeer: (e, t) => {
			let n = m.get(e);
			return !(!n || n.phase !== "active" && !t);
		},
		start: (e, r) => {
			let o = m.get(e);
			if (!o || o.phase !== "added" || o.peer !== r) return;
			let c = setTimeout(() => _(e, r, s(`handshake timed out after ${Pa}ms`)), Pa);
			K(c), m.set(e, {
				phase: "running-steps",
				peer: r,
				timer: c,
				role: "resolving",
				queue: o.queue,
				remoteReady: o.remoteReady
			});
			let u = async (t, n) => {
				if (m.get(e)?.peer !== r) throw Na;
				await a(t, e, n);
			}, d = () => new Promise((t, n) => {
				let i = m.get(e);
				if (!i || i.peer !== r || i.phase !== "running-steps") {
					n(Na);
					return;
				}
				let a = i.queue.messages.shift();
				a ? t(a) : i.queue.waiters.push([t, n]);
			});
			t.then((t) => {
				let i = t < e, a = m.get(e);
				return a?.phase === "running-steps" && a.peer === r && m.set(e, {
					...a,
					role: i ? "initiator" : "responder"
				}), n(e, u, d, i, r);
			}).then(() => {
				let t = m.get(e);
				if (!t || t.phase !== "running-steps" || t.peer !== r || (Ha(t.queue, Na), !l(e, r))) return;
				let n = m.get(e);
				n && n.phase === "running-steps" && n.peer === r && (i && n.role === "responder" && !n.remoteReady ? m.set(e, {
					phase: "awaiting-remote-ready",
					peer: r,
					timer: n.timer
				}) : v(e, r, n.timer, n.remoteReady));
			}).catch((t) => _(e, r, Te(t, "handshake failed")));
		},
		receiveData: (e, t, n) => {
			let r = m.get(t);
			if (!r || !("queue" in r)) return;
			let i = n === void 0 ? { data: e } : {
				data: e,
				metadata: n
			}, a = r.queue.waiters.shift();
			a ? a[0](i) : r.queue.messages.length >= Fa ? _(t, r.peer, s("too many pending handshake messages")) : r.queue.messages.push(i);
		},
		receiveReady: (e) => {
			let t = m.get(e);
			if (t && t.phase !== "active") switch (t.phase) {
				case "added":
				case "running-steps":
				case "preparing-ready":
					m.set(e, {
						...t,
						remoteReady: !0
					});
					return;
				case "awaiting-remote-ready":
					v(e, t.peer, t.timer, !0);
					return;
				case "awaiting-peer-ready":
					g(e, t);
					return;
				default: c(t);
			}
		},
		getPeer: (e) => m.get(e)?.peer
	};
}, Ga = (e) => e?.phase === "waiting" || e?.phase === "active", Ka = (e) => {
	if (!J(e) || typeof e.k != "string") return null;
	let t = e.t, n = Object.hasOwn(e, "m");
	return {
		key: e.k,
		streamId: typeof e.s == "string" ? e.s : void 0,
		expectedTrackCount: typeof t == "number" && Number.isInteger(t) && t >= 0 ? t : void 0,
		hasMetadata: n,
		metadata: n ? e.m : void 0
	};
}, qa = (e) => e?.getTracks?.() ?? [], Ja = (e) => typeof e.id == "string" ? e.id : void 0, Ya = (e, t) => e !== void 0 && e > 0 && t.length < e, Xa = (e, t, n, r) => {
	typeof e.addEventListener == "function" && typeof e.removeEventListener == "function" && (e.addEventListener(t, n), r.push(() => {
		e.removeEventListener?.(t, n);
	}));
}, Za = () => {
	let e = /* @__PURE__ */ new WeakMap();
	return (t) => {
		let n = e.get(t);
		return n || (n = crypto.randomUUID(), e.set(t, n)), n;
	};
}, Qa = () => {
	let e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new WeakMap();
	return {
		getStreamKey: Za(),
		rememberRemoteStream: (r, i, a) => {
			let o = n.get(i);
			o !== void 0 && e.get(o) === i && e.delete(o), n.set(i, r), e.set(r, i), a && t.set(a, i);
		},
		getRemoteStream: (n, r) => e.get(n) ?? (r ? t.get(r) : void 0),
		hasRemoteMedia: () => e.size > 0,
		clearRemote: () => {
			e.clear(), t.clear();
		}
	};
}, $a = (e, t) => {
	for (let [n, r] of e.streams) if (r.phase === "waiting" && (!t || n.id === t)) return n;
}, eo = (e) => {
	let t = 0;
	for (let n of e.streams.values()) n.phase === "waiting" && t++;
	return t;
}, to = ({ iterate: e, isActive: t, preparePeer: n, getPeerUserId: r, onPeerError: i, onPeerMediaPinChange: a }) => {
	let o = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), [d, f, p] = k("peer stream handler"), m = Za(), h = /* @__PURE__ */ new WeakMap(), g = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap(), v = 0, y = (e) => {
		let t = o.get(e);
		return t || (t = {
			identityCache: Qa(),
			metaQueue: [],
			streams: /* @__PURE__ */ new Map()
		}, o.set(e, t)), t;
	}, b = (e) => {
		let t = u.get(e);
		return t || (t = { streams: /* @__PURE__ */ new Map() }, u.set(e, t)), t;
	}, x = (e) => {
		let t = o.get(e);
		if (!t) return !1;
		for (let e of t.streams.values()) if (e.phase === "active") return !0;
		return !1;
	}, S = (e) => !!u.get(e)?.streams.size, C = (e) => {
		a?.(e, x(e) || S(e));
	}, w = async (e, t) => {
		let r = t ?? (n ? await n(e) : void 0);
		if (!r) throw te;
		return r;
	}, T = (e) => {
		let t = e, n = /* @__PURE__ */ new Set();
		for (; !n.has(t);) {
			let e = _.get(t);
			if (!e) break;
			n.add(t), t = e;
		}
		return t;
	}, E = (e) => {
		let t = qa(e), n = g.get(e);
		if (n) for (let e of t) n.has(e) || _.delete(e);
		return g.set(e, new Set(t)), t.map(T);
	}, D = (e, t) => {
		if ("active" in e && e.active === !1) return !1;
		let n = e.getTracks?.();
		return n ? t && n.length === 0 ? !1 : n.length === 0 || !n.every((e) => e?.readyState === "ended") : !0;
	}, O = (e, t, n, r) => {
		t.streams.get(n) === r && (r.cleanup(), t.streams.set(n, {
			phase: "inactive",
			key: r.key
		}), C(e));
	}, A = (e) => {
		for (let [t, n] of Array.from(e.streams.entries())) switch (n.phase) {
			case "waiting":
				n.cleanup(), e.streams.delete(t);
				break;
			case "active":
				n.cleanup(), e.streams.set(t, {
					phase: "inactive",
					key: n.key
				});
				break;
			case "inactive": break;
			default: c(n);
		}
	}, j = (e, t, n) => {
		let i = r ? r(e) : e;
		return t && n !== void 0 ? {
			peerId: e,
			userId: i,
			metadata: n
		} : {
			peerId: e,
			userId: i
		};
	}, M = (e, t) => {
		if (!e.metaQueue.length) return null;
		let n = Ja(t), r = n ? e.metaQueue.findIndex((e) => !e.streamId || e.streamId === n) : 0;
		if (r < 0) return null;
		let i = e.metaQueue[r];
		return Ya(i.expectedTrackCount, qa(t)) ? null : (e.metaQueue.splice(r, 1), i);
	}, N = (e, n) => {
		if (!t(e)) return !1;
		let r = o.get(e);
		if (!r) return !1;
		let i = M(r, n);
		return i ? (I(e, r, i.key, n, i.hasMetadata, i.metadata), !0) : !1;
	}, F = (e, t, n) => {
		if (Ga(t.streams.get(n)) || eo(t) >= 64) return;
		let r = [];
		Xa(n, "addtrack", () => {
			N(e, n);
		}, r), t.streams.set(n, {
			phase: "waiting",
			cleanup: () => {
				for (; r.length > 0;) r.pop()();
			}
		});
	}, I = (e, n, r, i, a, o) => {
		if (!t(e)) return;
		n.identityCache.rememberRemoteStream(r, i, Ja(i));
		let s = n.streams.get(i);
		Ga(s) && s.cleanup();
		let c = qa(i), u = !!(s?.phase === "active" && s.hadTracks || c.length > 0);
		if (!D(i, u)) {
			n.streams.set(i, {
				phase: "inactive",
				key: r
			}), s?.phase === "active" && C(e);
			return;
		}
		let d = a && o !== void 0 ? `m:${l(o)}` : "", p = s?.phase === "active" ? s.emittedSig : void 0, m = [], h = /* @__PURE__ */ new Set(), g = {
			phase: "active",
			key: r,
			hasMetadata: a,
			metadata: o,
			emittedSig: d,
			hadTracks: u,
			cleanup: () => {
				for (; m.length > 0;) m.pop()();
			}
		}, _ = () => {
			D(i, u) || O(e, n, i, g);
		}, v = (e) => {
			e && !h.has(e) && (h.add(e), u || (u = !0, n.streams.get(i) === g && (g = {
				...g,
				hadTracks: !0
			}, n.streams.set(i, g))), Xa(e, "ended", _, m));
		};
		Xa(i, "removetrack", _, m), Xa(i, "inactive", _, m), Xa(i, "addtrack", () => {
			if (n.streams.get(i) === g) {
				for (let e of qa(i)) v(e);
				N(e, i) || _();
			}
		}, m);
		for (let e of c) v(e);
		g = {
			...g,
			hadTracks: u
		}, n.streams.set(i, g), C(e), p !== d && f(i, j(e, a, o));
	};
	return {
		addStream: async (t, n, r) => {
			let i = m(t), a = Object.hasOwn(n, "metadata") ? (h.set(t, n.metadata), n.metadata) : h.get(t), o = E(t);
			await U(e(n.target, async (e, n) => {
				let s = ++v, l = b(e), d = l.streams.get(t);
				l.streams.set(t, d?.phase === "synced" ? {
					phase: "synced",
					syncGen: s,
					appliedTracks: d.appliedTracks
				} : {
					phase: "syncing-initial",
					syncGen: s
				}), C(e);
				let f = () => {
					let n = u.get(e), r = n?.streams.get(t);
					r?.syncGen === s && r.phase === "syncing-initial" && (n.streams.delete(t), n.streams.size || u.delete(e), C(e));
				}, p;
				try {
					p = await w(e, n);
				} catch (e) {
					throw f(), e;
				}
				if (u.get(e)?.streams.get(t)?.syncGen !== s) return;
				try {
					await r({
						k: i,
						s: t.id,
						...o.length > 0 ? { t: o.length } : {},
						...a === void 0 ? {} : { m: a }
					}, { target: e });
				} catch (e) {
					throw f(), e;
				}
				let m = u.get(e)?.streams.get(t);
				if (!m || m.syncGen !== s) return;
				let h = qa(t), g = h.map(T);
				switch (m.phase) {
					case "syncing-initial":
						u.get(e)?.streams.set(t, {
							phase: "synced",
							syncGen: s,
							appliedTracks: new Set(g)
						}), g.length !== h.length || g.some((e, t) => e !== h[t]) ? g.forEach((e) => p.addTrack(e, t)) : p.addStream(t);
						return;
					case "synced": {
						let e = new Set(g);
						for (let n of m.appliedTracks.difference(e)) p.removeTrack(n, t), m.appliedTracks.delete(n);
						for (let n of e.difference(m.appliedTracks)) p.addTrack(n, t), m.appliedTracks.add(n);
						return;
					}
					default: c(m);
				}
			}));
		},
		removeStream: (t, n) => {
			n || (h.delete(t), g.delete(t)), e(n, (e, n) => {
				let r = u.get(e), i = r?.streams.get(t);
				if (r && (r.streams.delete(t), r.streams.size || u.delete(e)), C(e), n && i?.phase !== "syncing-initial" && (n.removeStream(t), i?.phase === "synced")) for (let e of i.appliedTracks.difference(new Set(qa(t)))) n.removeTrack(e, t);
			});
		},
		replaceTrack: async (t, n, r) => {
			_.set(t, n), _.delete(n), await U(e(r, async (e, r) => {
				let i = u.get(e), a = !1;
				if (i) for (let [e, r] of i.streams.entries()) r.phase === "synced" && r.appliedTracks.has(t) ? (r.appliedTracks.delete(t), r.appliedTracks.add(n), a = !0) : r.phase === "syncing-initial" && qa(e).some((e) => e === t || T(e) === n) && (a = !0);
				(a || r) && await (await w(e, r)).replaceTrack(t, n);
			}));
		},
		receiveStreamMeta: (e, n) => {
			if (!t(n)) return;
			let r = Ka(e);
			if (!r) return;
			let a = y(n), o = $a(a, r.streamId), c = o ?? a.identityCache.getRemoteStream(r.key, r.streamId), l = qa(c);
			if (c && (o !== void 0 || l.length > 0) && !Ya(r.expectedTrackCount, l)) {
				let e = a.metaQueue.findIndex((e) => e.key === r.key);
				e >= 0 && a.metaQueue.splice(e, 1), I(n, a, r.key, c, r.hasMetadata, r.metadata);
				return;
			}
			c && Ya(r.expectedTrackCount, l) && F(n, a, c);
			let u = a.metaQueue.findIndex((e) => e.key === r.key);
			u >= 0 ? a.metaQueue[u] = r : a.metaQueue.length >= 64 ? (P("too many pending stream metadata messages"), i(n, s("too many pending media metadata messages"))) : a.metaQueue.push(r);
		},
		receiveRemoteStream: (e, n) => {
			if (!t(e)) return;
			let r = y(e), i = M(r, n);
			i ? I(e, r, i.key, n, i.hasMetadata, i.metadata) : F(e, r, n);
		},
		clearPeer: (e) => {
			let t = o.get(e);
			t && (A(t), o.delete(e)), u.delete(e), a?.(e, !1);
		},
		clearListeners: () => {
			p();
			for (let [e, t] of o) A(t), C(e);
		},
		onPeerStream: (e, n) => d(e, n, () => {
			let e = [];
			for (let [n, r] of o) if (!t(n)) A(r), C(n);
			else for (let [t, i] of Array.from(r.streams.entries())) i.phase === "active" && (D(t, i.hadTracks) ? e.push([t, j(n, i.hasMetadata, i.metadata)]) : O(n, r, t, i));
			return e;
		})
	};
}, no = 16384, ro = 65536, io = 65536, ao = 40, oo = 60, so = 120, co = 1024, lo = 16, uo = 184320, fo = 61440, po = 400, mo = 5e3, ho = 8, go = 32, _o = /*@__PURE__*/ new Set([
	"v",
	"k",
	"appId",
	"roomId",
	"ns",
	"hlc",
	"peerId",
	"userId",
	"pub",
	"val",
	"del",
	"cert",
	"sig"
]), vo = (e, t) => Bn("state", [
	e.v,
	e.k,
	e.appId,
	e.roomId,
	e.ns,
	e.hlc,
	e.peerId,
	e.userId,
	e.pub,
	e.del === !0 ? null : t ?? Kn(e.val),
	+(e.del === !0),
	e.cert?.sig ?? ""
]), yo = (e, t = Infinity) => {
	if (!J(e) || Se(e).some((e) => !_o.has(e)) || e.v !== 1 || e.k !== "s" && e.k !== "u" || !Y(e.appId) || !Y(e.roomId) || !Y(e.ns) || e.ns.length > 256 || !Vn(e.hlc) || !Si(e.peerId) || !Qt(e.userId) || typeof e.pub != "string" || !Kt(e.pub) || !ze(e.sig) || e.cert !== void 0 && !Be(e.cert)) return null;
	if (e.del !== void 0) return e.del === !0 && e.k === "u" && e.val === void 0 ? {
		rec: e,
		bytes: go,
		canonVal: void 0
	} : null;
	if (!("val" in e) || e.val === void 0) return null;
	let n = Gn(e.val, t);
	return Array.isArray(n) ? {
		rec: e,
		bytes: n[1],
		canonVal: n[0]
	} : null;
}, bo = async (e, t, n, r) => {
	let i = typeof n.hlc == "number" ? [n.hlc, 0] : n.hlc ?? [Date.now(), 0], a = {
		v: 1,
		appId: n.appId,
		roomId: n.roomId,
		ns: n.ns,
		hlc: i,
		peerId: n.peerId,
		userId: n.userId,
		pub: Gt(t),
		...n.cert ? { cert: n.cert } : {}
	}, o = n.del === !0 ? {
		...a,
		k: "u",
		del: !0
	} : {
		...a,
		k: n.kind ?? "s",
		val: n.val
	}, s = await Un(e, vo(o, r));
	return {
		...o,
		sig: s
	};
}, xo = (e, t) => Hn(e.hlc, t.hlc) || N(e.userId, t.userId) || N(e.peerId, t.peerId) || N(e.sig, t.sig), So = (e, t) => Hn(e, t) >= 0 ? e : t, Co = (e, t) => ({
	v: e.v,
	k: e.k,
	ns: e.ns,
	hlc: e.hlc,
	peerId: e.peerId,
	userId: e.userId,
	...t ? { pub: e.pub } : {},
	...e.del === !0 ? { del: !0 } : { val: e.val },
	...e.cert === void 0 ? {} : { cert: e.cert },
	sig: e.sig
}), wo = (e, t, n, r) => {
	if (!J(e) || "appId" in e || "roomId" in e) return null;
	let i = e.userId, a = e.pub === void 0 && Y(i) ? r?.[i] : e.pub;
	return {
		...e,
		appId: t,
		roomId: n,
		pub: a
	};
}, To = (e, t, n, r, i, a, o, c) => {
	if (!Y(e) || e.length > 256) throw s(`${o} requires a non-empty namespace string`);
	let l = Gn(t === void 0 ? null : t);
	if (!Array.isArray(l)) throw s(`state "${e}" initialValue must be valid JSON`);
	let d = u(l[0]);
	if (n !== void 0 && (!Re(n) || n > ro)) throw s(`state "${e}" maxBytes must be a positive integer <= ${ro}`);
	if (r !== void 0 && !i) throw le(c);
	let f = null;
	if (i) {
		if (r === void 0) f = a ? ["admin"] : null;
		else {
			let e = [r].flat();
			if (!e.includes("*")) {
				let t = e.filter(Boolean);
				if (!t.length) throw s(`${c} roles must not be empty; use "*" for open`);
				f = t;
			}
		}
	}
	return [
		d,
		n ?? no,
		f
	];
}, Eo = (e, t) => {
	let n = e.entries.get(t);
	return n && !n.rec.del ? n : void 0;
}, Do = (e) => d(l(e)).byteLength + 120, Oo = (e) => e.sig.slice(0, 8), ko = (e) => s(`state "${e}" exceeds user quota`), Ao = ({ appId: e, getRoomId: t, getSelfId: n, getLocalUserId: r, ensureReady: i, hasRolesPlugin: a, getRolesProvider: o, getScaleProvider: l, isPeerActive: d, isPeerPendingHandshake: f, isDirectPeer: p, getDirectPeerIds: m, isUserOnline: h, getKnownPeerUserId: g, isPeerBanned: _, getPeerRoles: v, makeInternalAction: y, onInvalidRecord: b }) => {
	let x = /* @__PURE__ */ new Map(), S = Jn(oo, so, 512), [C] = Ve(512, 96), [w] = Ve(512, 96), T = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), O = E(128), A = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Set(), P = /* @__PURE__ */ new Map(), F = qn(), I = !1, L = () => I, R = (e) => d(e) || !!f?.(e), ee = (e) => A.get(e) ?? 0, te = (e) => {
		if (!e) return;
		let t = ee(e) + 1;
		if (!A.has(e) && A.size >= 4096) {
			for (let e of A.keys()) if (!M.has(e) && !h(e)) {
				A.delete(e);
				break;
			}
		}
		A.set(e, t);
	}, ne = (e, t) => {
		!L() && e && (t ? M.has(e) || (M.add(e), te(e)) : M.delete(e) && te(e));
	}, z = (e, t) => {
		e.optimistic = t, e.snapshot = null;
	}, re = (e) => {
		e.optimistic !== null && (e.optimistic = null, e.snapshot = null);
	}, ie = (e, t) => {
		let { promise: n, resolve: r, reject: i } = Promise.withResolvers();
		return e.ops.push({
			...t,
			promise: n,
			resolve: r,
			reject: i
		}), je(e), n;
	}, ae = () => !!l?.(), B = (e, t) => {
		let n = P.get(e);
		n && (P.delete(e), n.resolve(t));
	}, oe = (e) => {
		if (!f?.(e)) return d(e) ? null : !1;
		let t = P.get(e);
		if (!t) {
			let { promise: n, resolve: r } = Promise.withResolvers();
			t = {
				promise: n,
				resolve: r,
				count: 0
			}, P.set(e, t);
		}
		return t.count >= 8 ? !1 : (t.count++, t.promise);
	}, se = async (e, t) => {
		if (t && !await t) return null;
		let n;
		try {
			({roomId: n} = await i());
		} catch {
			return null;
		}
		return L() || !d(e) || _(e) ? null : n;
	}, V = (e, t, n) => {
		let i = 0, a = n;
		for (let n of x.values()) {
			if (n.kind !== "u" || n === t) continue;
			if (n.optimistic && e === r()) {
				i++, a += n.optimistic.bytes;
				continue;
			}
			let o = e ? n.entries.get(e) : void 0;
			o && (i++, a += o.bytes);
		}
		return i < 32 && a <= io;
	}, H = (e, t, n, r, i) => ({
		prev: e,
		peerId: t,
		userId: n,
		roles: [...r],
		timestamp: i
	}), le = (e, t, n) => H(t, e.peerId, e.userId, n, e.hlc[0]), ue = (e, t, n, i, a = e.hlc[0], o = h(e.userId)) => {
		let s = r();
		return {
			...H(t, e.peerId, e.userId, n, a),
			self: !!(s && e.userId === s),
			online: o,
			removed: i
		};
	}, de = (e, t) => {
		if (_(e.userId)) return !1;
		if (!t) return !0;
		let n = o();
		if (!n) return !1;
		let r = n.getPeerRoles(e.userId);
		return e.cert ? t.some((t) => e.cert.roles.includes(t) && r.includes(t)) : t.some((e) => r.includes(e));
	}, fe = (e, t, r, i, a) => {
		e.entries.delete(t), e.snapshot = null, e.kind === "s" ? e.emit(e.initialValue, H(r.value, n(), r.rec.userId, a, i)) : r.rec.del || e.emit(void 0, ue(r.rec, r.value, a, !0, i, !1));
	}, pe = y ? y("state", {
		receiveWhilePending: !0,
		maxPayloadBytes: 262144
	}) : null, me = (e, t) => {
		pe && pe.send(e, t === void 0 ? void 0 : { target: t }).catch(W);
	}, he = (e) => {
		me({
			t: "rec",
			r: Co(e, !0)
		});
	}, ge = async ({ rec: n, bytes: r, canonVal: i }, a, s) => {
		let c = t();
		if (n.appId !== e || n.roomId !== c || n.cert && n.cert.subUserId !== n.userId) return "invalid";
		let l = await Zt(n.pub);
		if (!l || l.userId !== n.userId || !await Wn(n.pub, vo(n, i), n.sig)) return "invalid";
		let u = Date.now(), d = x.get(`${n.k}:${n.ns}`)?.entries.get(n.k === "s" ? "" : n.userId)?.rec.hlc[0] ?? 0, f = Math.min(u + In, Math.max(u + Ln, n.cert ? n.cert.iat + Ln : 0, d));
		if (n.hlc[0] > f || n.cert && n.hlc[0] < n.cert.iat || _(n.userId)) return "drop";
		let p = o();
		if (p) {
			let e = await p.verifyStateRecordRoles(n, a, s);
			return e.valid ? (F.observe(n.hlc[0]), {
				rec: n,
				roles: e.roles,
				bytes: r
			}) : "drop";
		}
		return a && a.length > 0 ? "drop" : (F.observe(n.hlc[0]), {
			rec: n,
			roles: [],
			bytes: r
		});
	}, _e = (e, t, n, r) => {
		if (r > e.maxBytes) return;
		let i = Date.now(), a = O.get(t.userId);
		if (!a) a = /* @__PURE__ */ new Map(), O.set(t.userId, a);
		else if (!a.has(e.namespace) && a.size >= 32) return;
		let o = a.get(e.namespace);
		if (o && i - o.seenAt < mo && xo(t, o.rec) <= 0) return;
		let s = r;
		for (let [t, n] of a) t !== e.namespace && (s += n.bytes);
		s > io || a.set(e.namespace, {
			slot: e,
			rec: t,
			roles: [...n],
			bytes: r,
			seenAt: i
		});
	}, ve = (e, t, n, i, a = !1, o = !1, s = !1) => {
		if (L()) return null;
		let c = e.kind === "s" ? "" : t.userId;
		if (e.kind === "u" && !h(c)) return o && _e(e, t, n, i), null;
		let l = e.entries.get(c);
		if (l && xo(t, l.rec) <= 0) return null;
		let u = l && !l.rec.del ? l : void 0, d = u ? u.value : e.initialValue, f = e.kind === "s" || r() !== "" && t.userId === r(), p = !a && f && e.optimistic !== null && (e.ops.length > 0 || e.flushState.phase === "stepping" && Hn(t.hlc, e.flushState.signingHlc ?? [e.optimistic.timestamp, 0]) <= 0) && t.hlc[0] <= Date.now() + 1e4;
		if (t.del) {
			if (e.kind !== "u" || !V(c, e, i)) return null;
			let r = {
				rec: t,
				value: e.initialValue,
				prev: d,
				roles: [...n],
				bytes: i
			};
			return e.entries.set(c, r), p ? (e.optimistic.prev = e.initialValue, r) : (!a && f && re(e), e.snapshot = null, !s && u && e.emit(void 0, ue(t, d, n, !0)), r);
		}
		if (i > e.maxBytes || e.kind === "u" && !V(c, e, i)) return null;
		let m = t.val, g = {
			rec: t,
			value: m,
			prev: d,
			roles: [...n],
			bytes: i
		};
		if (e.kind === "s") {
			let r = !a && e.optimistic !== null && !p ? e.optimistic.value : d, i = le(t, d, n);
			if (!a && e.validate) {
				let t = !1;
				try {
					t = e.validate(m, i);
				} catch {
					t = !1;
				}
				if (!t) return null;
			}
			return e.entries.set(c, g), p ? (e.optimistic.prev = m, g) : (a || re(e), e.snapshot = null, s || e.emit(m, r === d ? i : le(t, r, n)), g);
		}
		let _ = !a && f && e.optimistic !== null && !p ? e.optimistic.value : d, v = ue(t, d, n, !1);
		if (!a && e.validate) {
			let t = !1;
			try {
				t = e.validate(m, v);
			} catch {
				t = !1;
			}
			if (!t) return null;
		}
		return e.entries.set(c, g), p ? (e.optimistic.prev = m, g) : (!a && f && re(e), e.snapshot = null, s || e.emit(m, _ === d ? v : ue(t, _, n, !1)), g);
	}, U = (e) => ({
		startedOnline: h(e),
		startEpoch: ee(e)
	}), ye = async (e, t, n = !1, r) => {
		if (L()) return null;
		let i = yo(e, ro);
		if (!i) return b?.(t), null;
		if (_(i.rec.userId)) return null;
		let a = x.get(`${i.rec.k}:${i.rec.ns}`);
		if (!a || !i.rec.del && i.bytes > a.maxBytes) return null;
		let o = a.kind === "s" ? "" : i.rec.userId, { startedOnline: s, startEpoch: c } = a.kind === "u" ? r ?? U(o) : {
			startedOnline: !0,
			startEpoch: 0
		};
		if (a.kind === "s" || s) {
			let e = a.entries.get(o);
			if (e && xo(i.rec, e.rec) <= 0 || !V(o, a, i.bytes) && a.kind === "u") return null;
		}
		let l = await ge(i, a.requiredRoles, t);
		if (L()) return null;
		if (l === "invalid") return b?.(t), null;
		if (l === "drop" || _(l.rec.userId)) return null;
		if (a.kind === "u") {
			let e = ee(o);
			if (s) {
				if (e !== c) return null;
			} else {
				let t = h(o) && e === c + 1;
				if (e !== c && !t) return null;
			}
		}
		return ve(a, l.rec, l.roles, l.bytes, !1, n && !s && ee(o) === c);
	}, xe = () => {
		let e = [];
		for (let t of x.values()) for (let [n, r] of t.entries) (t.kind !== "u" || h(n)) && de(r.rec, t.requiredRoles) && e.push([t.kind === "s" ? `s:${t.namespace}` : `u:${t.namespace}\u0000${n}`, r]);
		return e.sort((e, t) => N(e[0], t[0])), e;
	}, Se = (e) => {
		let t = {}, n = 0;
		for (let [r, i] of xe()) if (!(e !== void 0 && N(r, e) <= 0)) {
			if (n >= co) break;
			t[r] = [i.rec.hlc, Oo(i.rec)], n++;
		}
		return t;
	}, Ce = (e, t, n, r = !1) => {
		if (!pe || L() || !d(e)) return;
		let i = (t, i, a) => me({
			t: "sync",
			p: t,
			r: i,
			...a && n ? { n } : {},
			...r ? { f: 1 } : {}
		}, e);
		if (!t.length) {
			r || i({}, [], !0);
			return;
		}
		let a = [], o = {}, s = [], c = 0;
		for (let e of t) {
			let t = Co(e, !1), n = Do(t);
			s.length > 0 && c + n > uo && (a.push([o, s]), o = {}, s = [], c = 0), o[e.userId] = e.pub, s.push(t), c += n;
		}
		s.length > 0 && a.push([o, s]), a.forEach(([e, t], n) => {
			i(e, t, n === a.length - 1);
		});
	}, we = (e, t) => {
		if (pe && e.length && ae()) for (let n of m()) n !== t && !_(n) && Ce(n, e, void 0, !0);
	}, G = (e) => p(e) && !_(e), q = Xe({
		maxPages: lo,
		canSync: () => !!pe && x.size > 0,
		getDirectPeers: m,
		isPeerSendable: G,
		sendPull: async (e, t) => {
			if (!pe || L() || !G(e)) return;
			let n = {
				t: "pull",
				d: Se(t),
				...t === void 0 ? {} : { c: t }
			};
			await pe.send(n, { target: e });
		}
	});
	if (pe) {
		let t = (e, t) => {
			let n = oe(e);
			n !== !1 && se(e, n).then((e) => e === null ? void 0 : t(e)).catch(W);
		};
		pe.onMessage((n, { peerId: r }) => {
			if (L() || _(r) || !J(n)) return;
			let i = n;
			if (i.t === "rec") {
				if (!S.consume(r)) return;
				let n = J(i.r) && Y(i.r.userId) ? i.r.userId : void 0, a = n ? U(n) : void 0;
				t(r, async (t) => {
					let n = wo(i.r, e, t);
					if (!n) b?.(r);
					else {
						if (p(r) && n.peerId === r) {
							let e = g(r);
							if (e && e !== n.userId) {
								b?.(r);
								return;
							}
						}
						await ye(n, r, !0, a);
					}
				});
			} else if (i.t === "pull") {
				if (C(r) || !J(i.d)) return;
				if (!qe(i.c)) {
					b?.(r);
					return;
				}
				let e = be(i.d);
				if (e.length > co) {
					b?.(r);
					return;
				}
				let n = /* @__PURE__ */ new Map();
				for (let [t, i] of e) {
					if (!Array.isArray(i) || i.length !== 2 || !Vn(i[0]) || typeof i[1] != "string" || i[1].length > 16) {
						b?.(r);
						return;
					}
					n.set(t, [i[0], i[1]]);
				}
				let a = i.c;
				t(r, () => {
					let e = xe().filter(([e]) => a === void 0 || N(e, a) > 0), t = e.slice(0, co), i = e.length > co ? t[t.length - 1][0] : void 0, o = (e, t, n, r) => {
						let i = Hn(e, n);
						return i > 0 || i === 0 && t !== r;
					}, s = [];
					for (let [e, r] of t) {
						let t = r.rec, i = n.get(e);
						(!i || o(t.hlc, Oo(t), i[0], i[1])) && s.push(t);
					}
					if (Ce(r, s, i), a === void 0 && !q.isPullInFlight(r)) for (let [e, t] of n) {
						let n, i = "";
						if (e.startsWith("s:")) {
							let t = x.get(e);
							t?.kind === "s" && (n = t);
						} else if (e.startsWith("u:")) {
							let t = e.indexOf("\0");
							if (t > 2) {
								let r = e.slice(t + 1), a = x.get(e.slice(0, t));
								a?.kind === "u" && h(r) && (n = a, i = r);
							}
						}
						if (!n) continue;
						let a = n.entries.get(i), s = a && de(a.rec, n.requiredRoles) ? a.rec : void 0;
						if (!s || o(t[0], t[1], s.hlc, Oo(s))) {
							q.pullPeer(r, !0);
							break;
						}
					}
				});
			} else if (i.t === "sync") {
				if (i.f && !ae() || (i.f ? w : C)(r) || !J(i.p) || !Array.isArray(i.r)) return;
				if (i.r.length > co || !qe(i.n)) {
					b?.(r);
					return;
				}
				i.f || q.onSyncPage(r, i.n);
				let n = i.p, a = /* @__PURE__ */ new Map();
				for (let e of i.r) if (J(e) && e.k === "u" && Y(e.userId)) {
					let t = e.userId;
					a.has(t) || a.set(t, U(t));
				}
				t(r, async (t) => {
					let o = [];
					for (let s of i.r) {
						if (L() || _(r)) return;
						let i = wo(s, e, t, n);
						if (!i) {
							b?.(r);
							return;
						}
						let c = await ye(i, r, !0, i.k === "u" ? a.get(i.userId) : void 0);
						c && o.push(c.rec);
					}
					we(o, r);
				});
			}
		});
	}
	let Te = async (e, t, n) => {
		let r = o();
		if (r) {
			let n = await r.getStateWriteCert(e, t);
			return [n.cert, n.roles];
		}
		if (e && e.length > 0) throw s(`${ce} to update state "${t}": requires [${e.join(", ")}]`);
		return [null, [...v(n)]];
	}, Ee = (e) => {
		for (let t of e) t.resolve();
	}, De = (e, t) => {
		for (let n of e) n.reject(t);
	}, Oe = (e, t) => {
		if (!e.optimistic || e.ops.length > 0) return;
		let r = e.optimistic;
		re(e);
		let i = Date.now(), a = n(), o = t ? [...v(t)] : [];
		if (e.kind === "s") {
			let n = e.entries.get("")?.value ?? e.initialValue;
			n !== r.value && e.emit(n, H(r.value, a, t, o, i));
		} else {
			let n = t ? Eo(e, t) : void 0;
			n ? (r.del || n.value !== r.value) && e.emit(n.value, {
				...H(r.del ? e.initialValue : r.value, a, t, o, i),
				self: !0,
				online: !0,
				removed: !1
			}) : r.del || e.emit(void 0, {
				...H(r.value, a, t, o, i),
				self: !0,
				online: !0,
				removed: !0
			});
		}
	}, ke = (e, t, n, r) => {
		L() ? Ee(t) : (Oe(e, r), De(t, n));
	}, Ae = (e, t, n) => n === 1 && Array.isArray(Gn(t)) ? s(`state "${e.namespace}" exceeds maxBytes (${e.maxBytes})`) : s(`state "${e.namespace}" value must contain only finite JSON numbers`), je = (t) => {
		switch (t.flushState.phase) {
			case "pacing":
			case "stepping": return t.flushState.flushPromise;
			case "idle": break;
			default: return c(t.flushState);
		}
		let { promise: n, resolve: a } = Promise.withResolvers();
		return (async () => {
			try {
				for (; !L() && t.ops.length > 0;) {
					if (!(t.ops.some((e) => !!e.urgent) || !Number.isFinite(t.lastBroadcastAt) || L())) {
						let e = Math.min(ao, ao - (performance.now() - t.lastBroadcastAt));
						e > 0 && await new Promise((r) => {
							let i = !1, a = () => {
								i || (i = !0, clearTimeout(o), r());
							}, o = setTimeout(a, e);
							K(o), t.flushState = {
								phase: "pacing",
								flushPromise: n,
								wake: a
							};
						});
					}
					if (L() || t.ops.length === 0) break;
					let { promise: a, resolve: o } = Promise.withResolvers(), c = {
						phase: "stepping",
						flushPromise: n,
						stepPromise: a,
						signingHlc: null,
						activeOps: []
					};
					t.flushState = c;
					try {
						let n, a, o, l, d;
						try {
							if ({selfId: n, user: a, roomId: o} = await i(), L()) {
								Ee(t.ops.splice(0));
								break;
							}
							[l, d] = await Te(t.requiredRoles, t.namespace, a.userId);
						} catch (e) {
							ke(t, t.ops.splice(0), e, r());
							continue;
						}
						if (L()) {
							Ee(t.ops.splice(0));
							break;
						}
						l && F.observe(l.iat);
						let f = t.ops.splice(0);
						if (!f.length) continue;
						c.activeOps.push(...f);
						let p = a.userId, m = t.kind === "s" ? "" : p;
						for (let r = 0; r < ho && f.length > 0; r++) {
							if (L()) {
								Ee(f), f = [];
								break;
							}
							let r = t.entries.get(m), i = r && !r.rec.del ? r : void 0, h = i ? i.value : t.initialValue, g = null, _ = 0, v, y = [], b = So(r?.rec.hlc ?? Fn, [l?.iat ?? 0, 0]), x = Math.max(Date.now(), F.peek(), b[0]);
							for (let e of f) {
								let i = r?.rec.sig === e.baseSig;
								if (e.optimisticGen !== void 0 && (i || !e.updater)) {
									e.del ? (h = t.initialValue, g = "del", _ = e.prevalidatedBytes ?? go, v = void 0) : (h = e.next, g = "set", _ = e.prevalidatedBytes ?? 0, v = e.prevalidatedJson), y.push(e);
									continue;
								}
								if (e.del) {
									if (!V(p, t, go)) {
										e.reject(ko(t.namespace));
										continue;
									}
									h = t.initialValue, g = "del", _ = go, v = void 0, y.push(e);
									continue;
								}
								let a = e.updater ?? e.next, o;
								try {
									o = typeof a == "function" ? a(h) : a;
								} catch (t) {
									e.reject(t);
									continue;
								}
								let c = Gn(o, t.maxBytes);
								if (typeof c == "number") {
									e.reject(Ae(t, o, c));
									continue;
								}
								let [l, f] = c;
								if (o = u(l), t.kind === "u" && !V(p, t, f)) e.reject(ko(t.namespace));
								else {
									if (t.validate) {
										let r = H(h, n, p, d, x), i = !1;
										try {
											i = t.kind === "s" ? t.validate(o, r) : t.validate(o, {
												...r,
												self: !0,
												online: !0,
												removed: !1
											});
										} catch (t) {
											e.reject(t);
											continue;
										}
										if (!i) {
											e.reject(s(`state validation failed for "${t.namespace}"`));
											continue;
										}
									}
									h = o, g = "set", _ = f, v = l, y.push(e);
								}
							}
							if (!y.length || !g) {
								f = [];
								break;
							}
							let S = Math.min(In, Math.max(Ln, l ? l.iat - Date.now() + 1e3 : 0, r ? r.rec.hlc[0] - Date.now() + 1e3 : 0)), C;
							try {
								let r = F.nextHlc(t.namespace, b, S);
								c.signingHlc = r, C = await bo(a.sign, a.signPubJwk, {
									kind: t.kind,
									appId: e,
									roomId: o,
									ns: t.namespace,
									hlc: r,
									peerId: n,
									userId: p,
									...g === "del" ? { del: !0 } : { val: h },
									cert: l
								}, v);
							} catch (e) {
								ke(t, y, e, p), f = [];
								break;
							} finally {
								c.signingHlc = null;
							}
							if (L()) {
								re(t), Ee(y), f = [];
								break;
							}
							if (!de(C, t.requiredRoles)) {
								Oe(t, p), De(y, s(`${ce} to update state "${t.namespace}"`)), f = [];
								break;
							}
							let w = t.entries.get(m);
							if (w && xo(C, w.rec) <= 0) {
								if (F.observe(w.rec.hlc[0]), y.some((e) => !!e.updater)) {
									f = y;
									continue;
								}
								Oe(t, p), Ee(y), f = [];
								break;
							}
							let T = y[y.length - 1]?.optimisticGen, E = T !== void 0 && t.optimistic?.gen === T, D = T !== void 0 && t.optimistic !== null && t.optimistic.gen > T;
							E && re(t), ve(t, C, d, _, !0, !1, E || D) && (t.lastBroadcastAt = performance.now(), he(C)), Ee(y), f = [];
							break;
						}
						f.length > 0 && ke(t, f, s(`concurrent state contention exceeded for "${t.namespace}"`), p);
					} finally {
						c.activeOps.length = 0, o();
					}
				}
			} finally {
				t.flushState = { phase: "idle" }, a();
			}
		})(), n;
	}, Me = (e) => {
		if (e.optimistic) return e.optimistic.del ? e.initialValue : e.optimistic.value;
		if (e.kind === "s") return e.entries.get("")?.value ?? e.initialValue;
		let t = r();
		return t ? Eo(e, t)?.value ?? e.initialValue : e.initialValue;
	}, Ne = (e) => {
		if (L()) return "noop";
		let t = r();
		if (!t) return "defer";
		if (_(t)) return s(`${ce} to update state "${e.namespace}"`);
		if (e.requiredRoles === null || e.requiredRoles.length === 0) return "sync";
		let n = o();
		if (!n) return a() ? "defer" : s(`${ce} to update state "${e.namespace}": requires [${e.requiredRoles.join(", ")}]`);
		if (!n.isAuthorityResolved()) return "defer";
		let i = n.getPeerRoles(t);
		return e.requiredRoles.some((e) => i.includes(e)) ? "sync" : s(`${ce} to update state "${e.namespace}": requires [${e.requiredRoles.join(", ")}]`);
	}, Pe = (e, t, i) => {
		let a = Ne(e);
		if (a === "noop") return Promise.resolve();
		if (a instanceof Error) return Promise.reject(a);
		if (a === "defer") return ie(e, {
			del: t,
			next: i
		});
		let o = r(), c = n(), l = o ? [...v(o)] : [], d = Me(e), f = Math.max(Date.now(), F.peek());
		if (t) {
			if (!V(o, e, go)) return Promise.reject(ko(e.namespace));
			let t = e.optimistic ? !e.optimistic.del : !!(o && Eo(e, o)), n = ++e.optGen;
			return z(e, {
				gen: n,
				del: !0,
				value: e.initialValue,
				prev: d,
				bytes: go,
				timestamp: f
			}), t && e.kind === "u" && e.emit(void 0, {
				...H(d, c, o, l, f),
				self: !0,
				online: !0,
				removed: !0
			}), ie(e, {
				del: !0,
				next: void 0,
				optimisticGen: n,
				prevalidatedBytes: go
			});
		}
		let p;
		try {
			p = typeof i == "function" ? i(d) : i;
		} catch (e) {
			return Promise.reject(e);
		}
		let m = Gn(p, e.maxBytes);
		if (typeof m == "number") return Promise.reject(Ae(e, p, m));
		let [h, g] = m;
		if (p = u(h), e.kind === "u" && !V(o, e, g)) return Promise.reject(ko(e.namespace));
		let _ = H(d, c, o, l, f);
		if (e.validate) {
			let t = !1;
			try {
				t = e.kind === "s" ? e.validate(p, _) : e.validate(p, {
					..._,
					self: !0,
					online: !0,
					removed: !1
				});
			} catch (e) {
				return Promise.reject(e);
			}
			if (!t) return Promise.reject(s(`state validation failed for "${e.namespace}"`));
		}
		let y = ++e.optGen;
		z(e, {
			gen: y,
			del: !1,
			value: p,
			prev: d,
			bytes: g,
			timestamp: f
		}), e.kind === "s" ? e.emit(p, _) : e.emit(p, {
			..._,
			self: !0,
			online: !0,
			removed: !1
		});
		let b = e.kind === "s" ? "" : o, x = e.entries.get(b)?.rec.sig;
		return ie(e, {
			del: !1,
			next: p,
			...typeof i == "function" ? { updater: i } : {},
			...x === void 0 ? {} : { baseSig: x },
			optimisticGen: y,
			prevalidatedJson: h,
			prevalidatedBytes: g
		});
	}, Fe = (e, t, n, r, i) => ({
		namespace: e,
		initialValue: t,
		requiredRoles: n,
		maxBytes: r,
		entries: /* @__PURE__ */ new Map(),
		optimistic: null,
		optGen: 0,
		snapshot: null,
		clearListeners: i,
		api: null,
		ops: [],
		flushState: { phase: "idle" },
		lastBroadcastAt: -Infinity
	}), Ie = (e, t, n) => (t.api = n, L() || (x.set(e, t), q.scheduleRepull()), n), Le = ((e, t, i) => {
		let s = `s:${e}`, c = x.get(s);
		if (c) return c.api;
		let [l, u, d] = To(e, t, i?.maxBytes, i?.roles, a() || !!o(), !0, "makeState", "state role gating"), [f, p, m] = k("state handler"), h = i?.validate, g = {
			...Fe(e, l, d, u, m),
			kind: "s",
			...h ? { validate: h } : {},
			emit: p
		}, _ = () => {
			if (g.optimistic) {
				let e = r();
				return H(g.optimistic.prev, n(), e, e ? [...v(e)] : [], g.optimistic.timestamp);
			}
			let e = g.entries.get("");
			return e ? le(e.rec, e.prev, e.roles) : null;
		};
		return Ie(s, g, j({
			get: () => Me(g),
			set: (e) => Pe(g, !1, e),
			getMeta: _,
			onChange: (e, t) => f(e, t, () => {
				let e = _();
				return e ? [[Me(g), e]] : [];
			})
		}, ["onChange"]));
	}), Re = ((e, t, i) => {
		let s = `u:${e}`, c = x.get(s);
		if (c) return c.api;
		let [l, u, d] = To(e, t, i?.maxBytes, i?.roles, a() || !!o(), !1, "makeUserState", "user state role gating"), [f, p, m] = k("user state handler"), h = i?.validate, _ = {
			...Fe(e, l, d, u, m),
			kind: "u",
			...h ? { validate: h } : {},
			emit: p
		}, y = (e) => {
			let t = r();
			if (e.length === 0) return [!0, t || void 0];
			let i = e[0];
			if (!i) return [!1, void 0];
			let a = n();
			if (a !== "" && i === a || t !== "" && i === t) return [!0, t || void 0];
			let o = Eo(_, i) ? i : g(i) ?? i;
			return [t !== "" && o === t, o];
		}, b = () => {
			if (!_.optimistic || _.optimistic.del) return null;
			let e = r();
			return {
				...H(_.optimistic.prev, n(), e, e ? [...v(e)] : [], _.optimistic.timestamp),
				self: !0,
				online: !0,
				removed: !1
			};
		};
		return Ie(s, _, j({
			get: (...e) => {
				let [t, n] = y(e);
				return t && _.optimistic ? _.optimistic.del ? _.initialValue : _.optimistic.value : n === void 0 ? _.initialValue : Eo(_, n)?.value ?? _.initialValue;
			},
			getAll: () => {
				if (!_.snapshot) {
					let e = {};
					for (let [t, n] of _.entries) n.rec.del || (e[t] = n.value);
					let t = r();
					_.optimistic && t && (_.optimistic.del ? delete e[t] : e[t] = _.optimistic.value), _.snapshot = Object.freeze(e);
				}
				return _.snapshot;
			},
			has: (...e) => {
				let [t, n] = y(e);
				return t && _.optimistic ? !_.optimistic.del : !!(n !== void 0 && Eo(_, n));
			},
			set: (e) => Pe(_, !1, e),
			clear: () => Pe(_, !0),
			getMeta: (...e) => {
				let [t, n] = y(e);
				if (t && _.optimistic) return b();
				let r = n ? Eo(_, n) : void 0;
				return r ? ue(r.rec, r.prev, r.roles, !1) : null;
			},
			onChange: (e, t) => f(e, t, () => {
				let e = [], t = r(), n = !1;
				for (let [r, i] of _.entries) if (_.optimistic && t && r === t) {
					n = !0;
					let t = b();
					t && e.push([_.optimistic.value, t]);
				} else i.rec.del || e.push([i.value, ue(i.rec, i.prev, i.roles, !1)]);
				if (_.optimistic && !n) {
					let t = b();
					t && e.push([_.optimistic.value, t]);
				}
				return e;
			})
		}, ["onChange"]));
	}), ze = (e) => {
		if (L() || !R(e) || _(e)) return;
		let t = r(), n = !1;
		for (let e of x.values()) if (e.kind === "u" && (e.flushState.phase !== "idle" || e.ops.length > 0 || t && Eo(e, t))) {
			n = !0;
			break;
		}
		if (n) return (async () => {
			try {
				let t = [];
				for (let e of x.values()) {
					if (e.kind !== "u") continue;
					let n = e.ops.length > 0;
					if (n) for (let n of e.ops) n.urgent = !0, t.push(n.promise.then(W, W));
					switch (e.flushState.phase) {
						case "pacing":
							n && e.flushState.wake();
							break;
						case "idle":
							n && je(e);
							break;
						case "stepping":
							n || t.push(e.flushState.stepPromise);
							break;
						default: c(e.flushState);
					}
				}
				if (t.length > 0) {
					let e;
					await Promise.race([Promise.allSettled(t), new Promise((t) => {
						e = setTimeout(t, po), K(e);
					})]), e !== void 0 && clearTimeout(e);
				}
				let n = r();
				if (!n || L() || !R(e) || _(e)) return;
				let i = {}, a = [], o = /* @__PURE__ */ new Set(), s = 0;
				for (let e of x.values()) {
					if (e.kind !== "u") continue;
					let t = Eo(e, n);
					if (!t) continue;
					let r = Co(t.rec, !1), c = Do(r);
					s + c > fo || (i[t.rec.userId] = t.rec.pub, a.push(r), o.add(t.rec.sig), s += c);
				}
				return o.size > 0 && D.set(e, o), a.length > 0 ? {
					ok: !0,
					p: i,
					r: a
				} : void 0;
			} catch {
				return;
			}
		})();
	}, Be = (e) => L() || !R(e) || _(e), He = async (t, n, r) => {
		try {
			let r = !J(n.p) || !Array.isArray(n.r) || n.r.length > 32;
			if (Be(t) || r) {
				!L() && r && b?.(t);
				return;
			}
			let a;
			try {
				({roomId: a} = await i());
			} catch {
				return;
			}
			if (Be(t)) return;
			let o = n.p, s = g(t), c = [], l = 0, u = Date.now();
			for (let r of n.r) {
				if (Be(t)) return;
				let n = wo(r, e, a, o), i = n && n.k === "u" ? yo(n, ro) : null;
				if (!i || s && i.rec.userId !== s) {
					b?.(t);
					return;
				}
				let d = x.get(`u:${i.rec.ns}`);
				if (!d || d.kind !== "u" || i.bytes > d.maxBytes) continue;
				let f = await ge(i, d.requiredRoles, t);
				if (Be(t)) return;
				if (f === "invalid") {
					b?.(t);
					return;
				}
				if (f !== "drop") {
					if (l += f.bytes, l > io) return;
					c.push({
						slot: d,
						rec: f.rec,
						roles: f.roles,
						bytes: f.bytes,
						seenAt: u
					});
				}
			}
			!Be(t) && c.length > 0 && T.set(t, c);
		} finally {
			r?.();
		}
	}, Ue = (e, t) => {
		let n = r();
		if (!n || !pe || L()) return;
		let i = [];
		for (let e of x.values()) {
			let r = e.entries.get(e.kind === "s" ? "" : n);
			r && r.rec.userId === n && !t?.has(r.rec.sig) && de(r.rec, e.requiredRoles) && i.push(r.rec);
		}
		if (i.length !== 0) {
			if (ae()) Ce(e, i, void 0, !0);
			else for (let t of i) me({
				t: "rec",
				r: Co(t, !0)
			}, e);
		}
	}, We = (e, t, n) => {
		if (L()) return;
		let r = D.get(e);
		D.delete(e);
		let i = T.get(e);
		if (i) {
			T.delete(e);
			let n = [];
			for (let r of i) if (r.rec.userId === t) {
				let e = ve(r.slot, r.rec, r.roles, r.bytes);
				e && n.push(e.rec);
			} else b?.(e);
			we(n, e);
		}
		let a = O.get(t);
		if (a) {
			O.delete(t);
			let n = Date.now(), r = [];
			for (let e of a.values()) if (n - e.seenAt < mo && x.get(`u:${e.slot.namespace}`) === e.slot && de(e.rec, e.slot.requiredRoles)) {
				let t = ve(e.slot, e.rec, e.roles, e.bytes);
				t && r.push(t.rec);
			}
			we(r, e);
		}
		B(e, !0), n && pe && x.size > 0 && (Ue(e, r), q.onPeerJoined(e, ae()));
	}, Ge = (e) => {
		T.delete(e), D.delete(e), S.delete(e), B(e, !1), q.onPeerDisconnected(e);
	};
	return {
		makeState: Le,
		makeUserState: Re,
		verifyAndApplyStateRecord: async (e, t) => !!await ye(e, t),
		prepareHandshakeReady: ze,
		stageHandshakeUserState: He,
		setUserPresence: ne,
		onPeerJoined: We,
		onPeerDisconnected: (e) => {
			Ge(e);
		},
		onUserLeft: (e) => {
			if (L() || h(e)) return;
			O.delete(e);
			let t = Date.now();
			for (let n of x.values()) if (n.kind === "u") {
				let r = n.entries.get(e);
				r && fe(n, e, r, t, [...r.roles]);
			}
		},
		purgeBannedUser: (e) => {
			if (L()) return;
			ne(e, !1), O.delete(e);
			let t = r(), n = Date.now(), i = !1;
			for (let r of x.values()) {
				t && e === t && re(r);
				let a = r.kind === "s" ? "" : e, o = r.entries.get(a);
				o && (r.kind === "u" || o.rec.userId === e) && (fe(r, a, o, n, []), r.kind === "s" && (i = !0));
			}
			i && q.scheduleRepull();
		},
		clearPeer: Ge,
		destroy: () => {
			I || (I = !0, q.destroy(), T.clear(), D.clear(), O.clear(), M.clear(), A.clear(), S.clear(), P.forEach((e) => e.resolve(!1)), P.clear(), x.forEach((e) => {
				re(e);
				let t = e.ops.splice(0), n = [];
				switch (e.flushState.phase) {
					case "pacing":
						e.flushState.wake(), e.flushState = { phase: "idle" };
						break;
					case "stepping":
						n = e.flushState.activeOps.splice(0);
						break;
					case "idle": break;
					default: c(e.flushState);
				}
				Ee(n), Ee(t), e.clearListeners();
			}));
		}
	};
}, jo = 50, Mo = "beforeunload", No = /*@__PURE__*/ new Set(), Po = Object.freeze([]), Fo = () => No.forEach((e) => e()), Io = (e) => (No.add(e), No.size === 1 && addEventListener(Mo, Fo), () => {
	No.delete(e), No.size || removeEventListener(Mo, Fo);
}), Lo = (e) => !!(e && typeof e == "object" && typeof e.then == "function"), Ro = (e, t, n) => {
	if (e !== void 0 && !Array.isArray(e)) throw s("use must be an array of room plugins");
	let r = null, i = null;
	for (let t of e ?? []) {
		let e = t && typeof t == "object" ? t[o] : void 0;
		if (!e) throw s("invalid plugin in use[]; expected roles() or scale()");
		if (e.kind === "roles") {
			if (r) throw s("duplicate plugin \"roles\" in use[]");
			r = e;
		} else {
			if (i) throw s("duplicate plugin \"scale\" in use[]");
			i = e;
		}
	}
	if (!r && Ne.test(t)) throw ue;
	return r?.selfAsAdmin && kn(n) && I(), [r, i];
}, zo = (e) => e.phase === "leaving" || e.phase === "left", Bo = (e) => e.phase === "direct-pending" || e.phase === "virtual-upgrading", Vo = (e) => e.phase === "virtual-only" || e.phase === "virtual-upgrading", Ho = (e, t, n, r = {}) => {
	let { endpointIdentity: i, clientId: a, appId: o = "", roomId: l = "", password: u = "", maxUsers: d, identity: f, maxReceiveBytes: p, onBeforeLeave: m } = r;
	if (d !== void 0 && !Re(d)) throw H("maxUsers");
	f !== void 0 && An({ identity: f });
	let [h, g] = Ro(r.use, l, f), _ = !!h, v = i && !Lo(i) ? i : void 0, y = a ?? (v ? v.peerId : _n()), b = v ? v.peerId : "", x = "", S = { phase: "active" }, C = !1, w = l, T = null, D = null, O = null, A = () => b, M = () => x, P = () => zo(S), I = () => S.phase === "active", R = () => {
		O = null;
	}, se = /* @__PURE__ */ new Set(), ce = [], V = (e) => {
		let [t, n, r] = k(e);
		return ce.push(r), [t, n];
	}, [ue, de] = V("onPeerActivated"), [fe, pe] = V("onPeerDeactivated"), [me, he] = V("onRoomIdChanged"), [ge, _e] = V("onLeave"), [ve, Se] = V("onPeerJoin"), [Ce, we] = V("onPeerLeave"), [G, K] = V("onUserJoin"), [Ee, De] = V("onUserLeave"), [Oe, ke] = V("onError"), Ae = (e) => {
		P() || ke({
			...e,
			appId: o,
			roomId: w
		});
	}, Me = (e) => {
		C || S.phase !== "active" || (C = !0, S = { phase: "setup-failed" }, queueMicrotask(() => {
			Ae(e), At();
		}));
	}, Pe = (i ? Promise.resolve(i) : bn(o, y)).then((e) => (b = e.peerId, e), (e) => {
		throw Me({
			code: "identity-failed",
			message: q(e, "endpoint identity resolution failed"),
			cause: e
		}), e;
	});
	Pe.catch(W);
	let Ie = b ? Promise.resolve(b) : Pe.then((e) => e.peerId);
	Ie.catch(W);
	let Le = (e) => {
		e && e !== w && (w = e, he(e));
	}, J = /* @__PURE__ */ new Map(), Y = Pn(o, l, f === void 0 ? void 0 : { identity: f }, y).then((e) => (x = e.userId, P() || Z?.setUserPresence(x, !0), R(), e), (e) => {
		throw Me({
			code: "identity-failed",
			message: q(e, "identity resolution failed"),
			cause: e
		}), e;
	});
	Y.catch(W);
	let ze = h?.selfAsAdmin && !Ne.test(l) ? Y.then((e) => {
		let t = Fe(l, e.userId);
		return P() || Le(t), t;
	}) : void 0;
	ze?.catch(W);
	let Be = (e) => !!(e && e.session.phase !== "direct-pending"), He = (e, t) => t ? !!e : Be(e), Ue = (e) => e.session.phase === "direct-active" || Bo(e.session) && e.session.verified, We = (e) => {
		let t = A();
		return t && e === t ? M() : J.get(e)?.userId ?? D?.getPeerUserId(e) ?? e;
	}, Ge = (e) => {
		let t = A();
		return t && e === t ? M() || void 0 : J.get(e)?.userId ?? D?.getPeerUserId(e);
	}, Ke = (e, t) => {
		let n = 0;
		for (let [r, i] of J) r !== t && Be(i) && We(r) === e && n++;
		return n;
	}, qe = (e, t, n) => {
		let r = t.emittedUserId;
		if (!r || r === n) {
			t.emittedUserId = n, !r && !P() && Z?.setUserPresence(n, !0);
			return;
		}
		let i = M(), a = Ke(r, e) === 0, o = Ke(n, e) === 0;
		t.emittedUserId = n, P() || (a && (!i || r !== i) && (De({
			userId: r,
			peerId: e
		}), Z?.setUserPresence(r, !1), Z?.onUserLeft(r)), o && (!i || n !== i) && (Z?.setUserPresence(n, !0), Z?.onPeerJoined(e, n, Ye(e)), K({
			userId: n,
			peerId: e,
			roles: st(e)
		})));
	}, Je = (e, t) => {
		if (!t) return;
		let n = J.get(e);
		n && !Ue(n) && n.userId !== t && (n.userId = t, R(), Be(n) && qe(e, n, t));
	}, Ye = (e) => J.get(e)?.session.phase === "direct-active", Xe = (e) => Be(J.get(e)), Ze = (e) => J.has(e), X = (e, t = !1) => {
		let n = J.get(e)?.session;
		if (n && n.phase !== "virtual-only") return n.phase === "direct-active" || t ? n.peer : void 0;
	}, Qe = (e = !1) => {
		let t = [];
		for (let [n, r] of J) He(r, e) && t.push(n);
		return t;
	}, $e = (e = !0) => {
		let t = [];
		for (let n of J.keys()) {
			let r = X(n, !e);
			r && t.push([n, r]);
		}
		return t;
	}, et = (e = !0) => $e(e).map((e) => e[0]), tt = (e, t) => {
		switch (delete t.deferredReady, t.session.phase) {
			case "virtual-upgrading":
				t.session = {
					phase: "virtual-only",
					virtual: t.session.virtual
				}, R();
				return;
			case "direct-pending":
			case "direct-active":
				J.delete(e), R();
				return;
			case "virtual-only": return;
			default: c(t.session);
		}
	}, nt = (e, t) => {
		let n = [];
		for (let [r, i] of J) He(i, t) && We(r) === e && n.push(r);
		return n;
	}, rt = (e) => {
		let t = nt(e, !1);
		return t.length ? t : nt(e, !0);
	}, it = (e, t = !1) => {
		if (!e) return;
		let n = [], r = /* @__PURE__ */ new Set(), i = (e) => {
			r.has(e) || (r.add(e), n.push(e));
		};
		for (let n of Array.isArray(e) ? e : [e]) if (He(J.get(n), t)) i(n);
		else {
			let e = nt(n, t);
			e.length ? e.forEach(i) : i(n);
		}
		return n;
	}, at = (e, t = !1) => He(J.get(e), t) ? e : nt(e, t).sort((e, t) => {
		let n = Ye(e);
		return n === Ye(t) ? N(e, t) : n ? -1 : 1;
	})[0], ot = (e) => !!(e && T?.isPeerBanned(e)), st = (e = A()) => T?.getPeerRoles(e) ?? Po, Z = null, ct = (e, t, n) => {
		if (P()) return;
		let r = M();
		n && (!r || t !== r) && Z?.setUserPresence(t, !0), Z?.onPeerJoined(e, t, Ye(e));
		let i = st(e);
		Se({
			peerId: e,
			userId: t,
			roles: i
		}), n && (!r || t !== r) && K({
			userId: t,
			peerId: e,
			roles: i
		});
	}, lt = (e, t, n, r) => {
		if (!t) return;
		let i = M();
		Z?.onPeerDisconnected(e), pe(e), P() || (we({
			peerId: e,
			userId: r
		}), n && (!i || r !== i) && (De({
			userId: r,
			peerId: e
		}), Z?.setUserPresence(r, !1), Z?.onUserLeft(r)));
	}, ut = W, dt = (e, t) => {
		let n = it(e);
		return (n ? Array.isArray(n) ? n : [n] : Qe(!1)).flatMap((e) => Xe(e) ? [Promise.resolve(t(e, X(e, !1)))] : (F(e), []));
	}, ft = (e) => {
		let t = !1, n = () => {
			r();
		}, r = li(e, 40, 150, () => {
			t = !0, se.delete(n);
		});
		t || se.add(n);
	}, pt = (e, t, n) => {
		let r = X(e, !0);
		r && (!t || r === t || n === z) && Pt.send("", { target: e }).catch(W), kt(e, t, n);
	}, mt = (e, t) => {
		t !== z && Ae({
			code: "peer-error",
			peerId: e,
			message: q(t, "peer error"),
			cause: t
		});
	}, ht = (e, t) => {
		Ze(e) && mt(e, t), pt(e, void 0, t);
	}, gt = to({
		iterate: dt,
		isActive: Xe,
		onPeerError: ht,
		preparePeer: (e) => {
			let t = X(e, !1);
			return t ? Promise.resolve(t) : D ? D.prepareMediaPeer(e) : Promise.reject(te);
		},
		getPeerUserId: We,
		onPeerMediaPinChange: (e, t) => {
			D?.setPeerMediaPinned(e, t);
		}
	}), { makeAction: _t, makeInternalAction: vt, makeInternalRequestAction: yt, handleData: bt, clearPeer: xt, clearListeners: St } = ja({
		getPeerIds: Qe,
		canReceiveFromPeer: (e, t) => !ot(e) && (Xe(e) || Jt.canReceiveFromPeer(e, t)),
		onPeerError: ht,
		getTransport: (e, t) => {
			let n = J.get(e)?.session;
			if (n) switch (n.phase) {
				case "direct-active": return n.transport;
				case "direct-pending": return t ? n.transport : void 0;
				case "virtual-upgrading": return t ? n.transport : n.virtual;
				case "virtual-only": return n.virtual;
				default: return c(n);
			}
		},
		broadcastInline: (e, t, n) => D ? D.broadcastInline(e, t, n) : !1,
		registerActionAuthority: (e, t) => {
			if (!T) throw le("action role gating");
			D?.registerActionAuthority(e, t);
		},
		getLocalActionCert: (e, t) => T ? T.getLocalActionCert(e, t) : Promise.resolve(null),
		authorizePeerAction: (e, t, n) => T ? T.authorizePeerAction(e, t, n) : !1,
		getPeerRoles: (e) => st(e),
		getPeerUserId: We,
		resolveSendTarget: it,
		resolveRequestTarget: at,
		onUnknownType: (e) => {
			e === "@_state" && !P() && Et();
		},
		...p === void 0 ? {} : { maxReceiveBytes: p }
	}), Ct = async () => (await Qt, [await Y, await T?.getAuthorityInfo()]), [wt, Tt] = Ve(512, 8), Et = () => {
		if (!Z) {
			let e = Ao({
				appId: o,
				getRoomId: () => w,
				getSelfId: A,
				getLocalUserId: M,
				ensureReady: async () => {
					let [e, t] = await Ct();
					return {
						selfId: A(),
						user: e,
						roomId: t?.roomId ?? w
					};
				},
				hasRolesPlugin: () => _,
				getRolesProvider: () => T,
				getScaleProvider: () => D,
				isPeerActive: Xe,
				isPeerPendingHandshake: (e) => !(!Jt.getPeer(e) || Ye(e)),
				isDirectPeer: Ye,
				getDirectPeerIds: () => et(!0),
				isUserOnline: (e) => {
					let t = M();
					return !!(t && e === t || Ke(e) > 0);
				},
				getKnownPeerUserId: Ge,
				isPeerBanned: (e) => !!(e && ot(e)),
				getPeerRoles: (e) => st(e),
				makeInternalAction: vt,
				onInvalidRecord: (e) => {
					let t = A();
					e && e !== t && wt(e) && (Tt(e), ht(e, je("excessive invalid state records")));
				}
			});
			if (P()) e.destroy();
			else {
				x && e.setUserPresence(x, !0);
				for (let [t, n] of J) Be(n) && e.setUserPresence(We(t), !0);
			}
			Z = e;
		}
		return Z;
	}, Dt = (e) => {
		let t = J.get(e);
		if (!t) return [
			!1,
			!1,
			We(e),
			void 0
		];
		let n = Be(t), r = t.emittedUserId ?? t.userId ?? D?.getPeerUserId(e) ?? e, i = t.session.phase === "virtual-only" ? void 0 : t.session.peer, a = Vo(t.session) ? t.session.virtual : null;
		J.delete(e), a?.close?.();
		let o = n && Ke(r, e) === 0;
		return n && R(), [
			n,
			o,
			r,
			i
		];
	}, Ot = (e, t) => {
		Z?.clearPeer(e), xt(e, t), gt.clearPeer(e);
	}, kt = (e, n, r) => {
		let i = r === void 0 ? te : Te(r, ee), a = i === z, o = X(e, !0);
		if (n) {
			if (o !== n) {
				if (a) {
					if (D?.markPeerBanned(e), !Ze(e)) return;
				} else return;
			}
		} else if (!Ze(e)) {
			a && D?.markPeerBanned(e);
			return;
		}
		let s = J.get(e);
		if (!a && o && s?.session.phase === "virtual-upgrading") {
			Wt(e, i), Z?.clearPeer(e), tt(e, s), o.destroy(), D?.removeDirectPeer(e, o, i), t(e, !1);
			return;
		}
		a && D?.markPeerBanned(e), Wt(e, i), Ot(e, i);
		let [c, l, u, d] = Dt(e);
		lt(e, c, l, u), d ? ((a || r === oe) && !P() ? ft(d) : d.destroy(), D?.removeDirectPeer(e, d, i), t(e, !a && r !== oe)) : c && D?.removeDirectPeer(e, void 0, i);
	}, At = () => {
		if (zo(S)) return S.promise;
		let { promise: e, resolve: t, reject: r } = Promise.withResolvers();
		return S = {
			phase: "leaving",
			promise: e
		}, (async () => {
			m?.(), Lt.clear();
			for (let e of Qe(!0)) Jt.clearPeer(e, ae);
			_e();
			let t = D ? et(!1).filter((e) => {
				let t = J.get(e)?.session;
				return t && t.phase !== "virtual-only" && t.transport.isOpen;
			}) : void 0, r = J.size > 0 && (!t || t.length > 0), i = new AbortController();
			r && Pt.send("", {
				...t ? { target: t } : {},
				signal: i.signal
			}).catch(W), D && await D.announceLeave(), r && await new Promise((e) => {
				setTimeout(e, jo);
			}), i.abort();
			try {
				D?.destroy();
				for (let e of se) e();
				se.clear();
				let e = Qe(!0);
				for (let t of e) {
					let e = J.get(t);
					if (!e) continue;
					let n = e.session.phase === "virtual-only" ? null : e.session.peer, r = Vo(e.session) ? e.session.virtual : null;
					J.delete(t), n?.destroy(), r?.close?.();
				}
				J.clear(), R();
				for (let t of e) Ot(t, ae);
			} finally {
				S = {
					phase: "left",
					promise: e
				};
				for (let e of [
					...ce,
					gt.clearListeners,
					St,
					() => Z?.destroy()
				]) e();
				try {
					ut();
				} finally {
					n();
				}
			}
		})().then(t, r), e;
	}, jt = yt("ping");
	jt.onRequest(() => "");
	let Mt = vt("signal"), Nt = vt("stream", { maxPayloadBytes: 65536 }), Pt = vt("leave", {
		sendToPending: !0,
		receiveWhilePending: !0
	}), Ft = vt("hsdata", {
		sendToPending: !0,
		receiveWhilePending: !0,
		maxPayloadBytes: 65536
	}), It = vt("hsready", {
		sendToPending: !0,
		receiveWhilePending: !0,
		maxPayloadBytes: 131072
	}), Lt = /* @__PURE__ */ new Map(), Rt = E(256), zt = (e = !1, t) => {
		let n = /* @__PURE__ */ new Set([M()]);
		for (let [e, t] of J) Be(t) && n.add(We(e));
		if (e) for (let [e, r] of Lt) e !== t && n.add(r);
		return n;
	}, Bt = (e, t = !1) => {
		if (d === void 0 || Xe(e)) return !1;
		let n = zt(t, e), r = J.get(e)?.userId ?? D?.getPeerUserId(e) ?? Rt.get(e) ?? e;
		return !n.has(r) && n.size >= d;
	}, Vt = (e) => {
		let t = J.get(e)?.userId ?? D?.getPeerUserId(e) ?? Rt.get(e);
		return !ot(A()) && !ot(e) && !(t !== void 0 && Bt(e, !0));
	}, Ht = (e, t, n) => {
		if (X(e, !0) !== t) return;
		let r = n === ne, i = r ? z : oe;
		if (r) D?.markPeerBanned(e);
		else {
			let t = J.get(e)?.userId ?? D?.getPeerUserId(e);
			t && Rt.set(e, t);
		}
		let a = r ? T?.getBanReason(We(e)) ?? T?.getBanReason(e) : void 0;
		Jt.clearPeer(e, i), Z?.clearPeer(e), Lt.delete(e), It.send({
			ok: !1,
			err: n,
			...a === void 0 ? {} : { reason: a }
		}, { target: e }).catch(W).finally(() => {
			X(e, !0) === t && kt(e, t, i);
		});
	}, Ut = (e, t) => ot(e) ? (Ht(e, t, ne), !1) : d === void 0 || Xe(e) ? !0 : Bt(e, !0) ? (Ht(e, t, B), !1) : (Lt.set(e, We(e)), !0), Wt = (e, t) => {
		Jt.clearPeer(e, t), Lt.delete(e);
	}, Gt = (e, t) => {
		if (e && typeof e == "object" && e.ok === !0) {
			if (Jt.getPeer(t) && !Ye(t) && !ot(t) && !Bt(t)) {
				Et().stageHandshakeUserState(t, e, () => {
					!P() && Jt.getPeer(t) && $t("", t);
				});
				return;
			}
			$t("", t);
		} else $t(e, t);
	}, Kt = (e, t, n) => {
		if (n && X(e, !0) !== n) return;
		let r = J.get(e);
		if (!r || !Bo(r.session)) return;
		if (r.userId = t.userId, R(), ot(e) || ot(t.userId)) throw D?.markPeerBanned(e), z;
		let i = r.deferredReady;
		delete r.deferredReady, r.session = {
			...r.session,
			verified: !0
		}, D?.setPeerSignPublicKey(e, t.peerPubKey), i !== void 0 && queueMicrotask(() => {
			let t = J.get(e);
			t && Ue(t) && (!n || X(e, !0) === n) && Gt(i, e);
		});
	}, qt = {
		get selfId() {
			return A();
		},
		appId: o,
		initialRoomId: l,
		password: u,
		...d === void 0 ? {} : { maxUsers: d },
		getRoomId: () => w,
		setEffectiveRoomId: Le,
		getLocalEndpointIdentity: () => Pe,
		getLocalUserIdentity: () => Y,
		getPeerUserId: We,
		getKnownPeerUserId: Ge,
		getUserPeerIds: rt,
		setPeerUserId: Je,
		getActivePeerIds: () => Qe(!1),
		getDirectActivePeerIds: () => et(!0),
		getAllPeerIds: () => Qe(!0),
		isPeerActive: Xe,
		getPeerHandle: X,
		kickPeer: (e, t) => pt(e, void 0, t),
		emitError: Ae,
		makeInternalAction: vt,
		deliverRawData: (e, t) => {
			ot(e) || bt(e, t);
		},
		getRolesProvider: () => T,
		getScaleProvider: () => D,
		activateVirtualPeer: (e, t) => {
			if (!I() || ot(e) || Bt(e, !0)) return t.close?.(), !1;
			if (Ye(e)) return t.close?.(), !0;
			let n = J.get(e), r = Be(n), i = n?.userId ?? D?.getPeerUserId(e) ?? e, a = !r && Ke(i, e) === 0;
			if (!n) J.set(e, {
				session: {
					phase: "virtual-only",
					virtual: t
				},
				userId: i,
				emittedUserId: i
			});
			else switch (n.userId = i, n.session.phase) {
				case "virtual-only":
					n.session.virtual !== t && n.session.virtual.close?.(), n.session = {
						phase: "virtual-only",
						virtual: t
					};
					break;
				case "virtual-upgrading":
					n.session.virtual !== t && n.session.virtual.close?.(), n.session = {
						...n.session,
						virtual: t
					};
					break;
				case "direct-pending":
					n.session = {
						phase: "virtual-upgrading",
						virtual: t,
						peer: n.session.peer,
						transport: n.session.transport,
						verified: n.session.verified
					}, n.emittedUserId = i;
					break;
				case "direct-active": break;
				default: c(n.session);
			}
			return R(), r || ct(e, i, a), !0;
		},
		deactivateVirtualPeer: (e, t) => {
			if (Ye(e)) return;
			let n = J.get(e);
			if (!n || !Vo(n.session)) return;
			let r = Te(t, ee), i = n.emittedUserId ?? n.userId ?? D?.getPeerUserId(e) ?? e, a = n.session.virtual;
			n.session.phase === "virtual-upgrading" ? (n.session = {
				phase: "direct-pending",
				peer: n.session.peer,
				transport: n.session.transport,
				verified: n.session.verified
			}, delete n.emittedUserId) : J.delete(e), a.close?.();
			let o = Ke(i, e) === 0;
			R(), Ze(e) || Ot(e, r), lt(e, !0, o, i);
		},
		purgeBannedUserState: (e) => {
			Z?.purgeBannedUser(e);
		},
		onRolesChanged: R,
		onPeerActivated: (e, t) => ue(e, t, () => $e(!0)),
		onPeerDeactivated: fe,
		onRoomIdChanged: me,
		onLeave: ge
	}, Jt = Wa({
		selfIdP: Ie,
		onPeerHandshake: Va({
			endpointIdentityP: Pe,
			appId: o,
			roomId: ze ?? l,
			getUserIdentity: () => Y,
			onVerified: Kt
		}).run,
		onHandshakeError: (e, t) => {
			t === z || ot(e) || Ae({
				code: "handshake-failed",
				peerId: e,
				message: q(t, "handshake failed"),
				cause: t
			});
		},
		deferResponderReady: d !== void 0,
		sendHandshakeData: (e, t, n) => Ft.send(e, {
			target: t,
			...n === void 0 ? {} : { metadata: n }
		}),
		sendHandshakeReady: (e, t) => It.send(e, { target: t }),
		onLocalHandshakePassed: (e, t) => ot(e) ? (Ht(e, t, ne), !1) : !Bt(e) || (Ht(e, t, B), !1),
		acquireAdmissionSlot: (e, t) => X(e, !0) !== t || P() ? !1 : Ut(e, t),
		beforeSendHandshakeReady: (e, t) => X(e, !0) === t && !ot(e) && Z ? Z.prepareHandshakeReady(e) : void 0,
		onActivate: (e, t) => {
			if (ot(e)) {
				Lt.delete(e), pt(e, t, z);
				return;
			}
			if (Bt(e)) {
				Ht(e, t, B);
				return;
			}
			let n = J.get(e);
			if (Lt.delete(e), !n || !Bo(n.session) || n.session.peer !== t) return;
			let r = n.session.phase === "virtual-upgrading", i = n.session.phase === "virtual-upgrading" ? n.session.virtual : null, a = n.userId ?? e;
			n.userId = a, delete n.deferredReady;
			let o = !r && Ke(a, e) === 0;
			n.session = {
				phase: "direct-active",
				peer: t,
				transport: n.session.transport
			}, i?.close?.(), R(), D?.addDirectPeer(e, t), de(e, t), t.setHandlers({ signal: (n) => {
				X(e, !1) === t && Mt.send(n, { target: e }).catch(W);
			} }), r ? (qe(e, n, a), Z?.onPeerJoined(e, a, !0)) : (n.emittedUserId = a, ct(e, a, o));
		},
		onFailure: (e, t, n) => {
			Lt.delete(e), n === z ? Ht(e, t, ne) : pt(e, t, n);
		}
	}), Yt, Xt, Zt = null;
	if (h) try {
		let e = h.setup(qt, ze);
		T = e.provider, Yt = e.api;
	} catch (e) {
		Zt = { error: e }, Me({
			code: "plugin-failed",
			plugin: "roles",
			message: q(e, "roles setup failed"),
			cause: e
		});
	}
	if (g && !Zt) try {
		let e = g.setup(qt);
		D = e.provider, Xt = e.api;
	} catch (e) {
		Zt = { error: e }, Me({
			code: "plugin-failed",
			plugin: "scale",
			message: q(e, "scale setup failed"),
			cause: e
		});
	}
	let Qt = Zt ? Promise.reject(Zt.error) : U([
		Pe,
		Y,
		...ze ? [ze] : []
	]).then(W);
	Qt.catch(W), D && !Zt && Et();
	let $t = (e, t) => {
		if (!P()) {
			if (e && typeof e == "object" && e.ok === !1) {
				if (!Jt.getPeer(t) || Ye(t)) return;
				if (e.err === "room full") {
					Jt.clearPeer(t, oe), Ae({
						code: "room-full",
						peerId: t,
						message: B
					}), kt(t, X(t, !0), oe);
					return;
				}
				if (e.err === "peer banned") {
					let n = typeof e.reason == "string" && e.reason.length <= 512 ? e.reason : void 0;
					Jt.clearPeer(t, z), Ae(re(n, t)), pt(t, X(t, !0), z);
					return;
				}
			}
			Jt.receiveReady(t);
		}
	};
	Mt.onMessage((e, { peerId: t }) => {
		X(t, !1)?.signal(e);
	}), Nt.onMessage((e, { peerId: t }) => {
		gt.receiveStreamMeta(e, t);
	}), Pt.onMessage((e, { peerId: t }) => kt(t, void 0, ie)), Ft.onMessage((e, { peerId: t, metadata: n }) => {
		P() || Jt.receiveData(e, t, n);
	}), It.onMessage((e, { peerId: t }) => {
		if (P()) return;
		let n = J.get(t);
		!n || !Ue(n) ? n && Bo(n.session) && !n.session.verified && Jt.getPeer(t) && (n.deferredReady = e) : Gt(e, t);
	}), e((e, t) => {
		if (!I() || !Vt(t)) {
			e.destroy();
			return;
		}
		let n = J.get(t);
		if (n) switch (n.session.phase) {
			case "virtual-only":
				Z?.clearPeer(t);
				break;
			case "direct-pending":
			case "virtual-upgrading": {
				let r = n.session.peer;
				if (r === e) return;
				let i = s("peer replaced");
				r.destroy(), Wt(t, i), Z?.clearPeer(t);
				let a = J.get(t);
				a && X(t, !0) === r && tt(t, a);
				break;
			}
			case "direct-active": {
				let r = n.session.peer;
				if (r === e) return;
				let i = s("peer replaced");
				r.destroy(), Wt(t, i);
				let [a, o, c] = Dt(t);
				Ot(t, i), lt(t, a, o, c), D?.removeDirectPeer(t, r, i);
				break;
			}
			default: c(n.session);
		}
		let r = ui(e, () => {
			let e = J.get(t)?.session;
			return !!(e && e.phase !== "virtual-only" && e.transport === r);
		}), i = J.get(t);
		i?.session.phase === "virtual-only" ? (delete i.deferredReady, i.session = {
			phase: "virtual-upgrading",
			virtual: i.session.virtual,
			peer: e,
			transport: r,
			verified: !1
		}) : J.set(t, { session: {
			phase: "direct-pending",
			peer: e,
			transport: r,
			verified: !1
		} }), Jt.addPeer(t, e), e.setHandlers({
			data: (n) => {
				X(t, !0) !== e || ot(t) || D?.handleFrame(t, n) || bt(t, n);
			},
			stream: (e) => {
				ot(t) || gt.receiveRemoteStream(t, e);
			},
			close: () => kt(t, e, te),
			error: (n) => {
				L("peer", n), X(t, !0) === e && mt(t, n), kt(t, e, n);
			}
		}), Jt.start(t, e);
	}), ye && (ut = Io(() => {
		At().catch(W);
	}));
	let en = {
		ready: Qt,
		makeAction: _t,
		makeState: ((e, t, n) => Et().makeState(e, t, n)),
		makeUserState: ((e, t, n) => Et().makeUserState(e, t, n)),
		leave: At,
		ping: async (e) => {
			let t = Date.now();
			return await jt.request("", { target: e }), Date.now() - t;
		},
		getSelf: async () => {
			let [e, t] = await Ct();
			return {
				peerId: A(),
				userId: e.userId,
				identityPersistence: e.persistence ?? "none",
				roomId: t?.roomId ?? w,
				baseRoomId: t?.baseRoomId ?? l,
				isAdmin: t?.isAdmin ?? !1,
				roles: t?.roles ?? []
			};
		},
		getPeers: () => xe(Qe(!1).map((e) => {
			let t = X(e, !1), n = !!t;
			return [e, {
				userId: We(e),
				connection: t ? t.connection : null,
				direct: n,
				hops: n ? 1 : D?.getRoute(e)?.hops ?? 2,
				roles: [...st(e)]
			}];
		})),
		getUsers: () => {
			if (O) return O;
			let e = M(), t = {};
			for (let n of Qe(!1)) {
				let r = We(n);
				e && r === e || (t[r] ?? (t[r] = {
					peerIds: [],
					roles: st(r)
				})).peerIds.push(n);
			}
			let n = {};
			for (let [e, r] of be(t)) n[e] = Object.freeze({
				peerIds: Object.freeze(r.peerIds),
				roles: Object.isFrozen(r.roles) ? r.roles : Object.freeze([...r.roles])
			});
			return O = Object.freeze(n), O;
		},
		addStream: (e, t = {}) => gt.addStream(e, t, Nt.send),
		removeStream: (e, t = {}) => {
			gt.removeStream(e, t.target);
		},
		replaceTrack: (e, t, n = {}) => gt.replaceTrack(e, t, n.target),
		...Yt,
		...Xt,
		onPeerJoin: (e, t) => ve(e, t, () => Qe(!1).map((e) => [{
			peerId: e,
			userId: We(e),
			roles: [...st(e)]
		}])),
		onPeerLeave: Ce,
		onUserJoin: (e, t) => G(e, t, () => {
			let e = M(), t = [], n = /* @__PURE__ */ new Set();
			for (let r of Qe(!1)) {
				let i = We(r);
				e && i === e || n.has(i) || (n.add(i), t.push([{
					userId: i,
					peerId: r,
					roles: [...st(r)]
				}]));
			}
			return t;
		}),
		onUserLeave: Ee,
		onPeerStream: gt.onPeerStream,
		onError: Oe
	};
	return j(en, [
		"onPeerJoin",
		"onPeerLeave",
		"onUserJoin",
		"onUserLeave",
		"onPeerStream",
		"onError",
		...Yt ? ["onRoleChange"] : []
	]), [en, {
		localEndpointP: Pe,
		effectiveRoomIdP: ze,
		hasSetupFailed: () => C,
		getScaleProvider: () => D,
		setOnScaleTargetsChanged: (e) => {
			D?.setOnTargetsChanged(e);
		},
		canConnectPeer: Vt,
		emitError: (e) => {
			P() || ke(e);
		}
	}];
}, Uo = 5333, Wo = [
	233,
	533,
	1333
], Go = (e, t) => {
	let n = { ...e };
	for (let [e, r] of be(t)) r !== void 0 && (n[e] = r);
	return n;
}, Ko = (e, t) => {
	let n = e.get(t);
	return n || (n = /* @__PURE__ */ new Map(), e.set(t, n)), n;
}, qo = ({ defaultConfig: e, init: t, subscribe: r, announce: i }) => {
	let o = _n(), l = /* @__PURE__ */ new Map();
	return ((u, d, ...f) => {
		if (!u) throw s("config map required");
		if (f.length > 0 && f[0] !== void 0) throw s("joinRoom takes 2 arguments; register error listeners via room.onError(fn)");
		let p = e ? Go(e, u) : u, { appId: m } = p;
		if (!m) throw me("appId");
		if (!d) throw me("roomId");
		if (p.maxReceiveBytes !== void 0 && !Re(p.maxReceiveBytes)) throw H("maxReceiveBytes");
		if (p.maxUsers !== void 0 && !Re(p.maxUsers)) throw H("maxUsers");
		An(p);
		let h = l.get(m)?.get(d);
		if (h?.phase === "occupied") throw s(`already joined room "${d}" for appId "${m}"`);
		h?.phase === "leaving" && h.finalizeCleanup();
		let g = { phase: "active" }, _ = "unconfirmed", v = d, y, b = W, x = W, S = W, C = () => g.phase !== "active", w = /* @__PURE__ */ new Map(), T = [], E = (e) => Ee(n, m, e), D = (e) => {
			let t = l.get(m);
			if (!t) return;
			let n = t.get(d);
			if (n && e(n) && t.delete(d), v !== d) {
				let n = t.get(v);
				n && e(n) && t.delete(v);
			}
			t.size === 0 && l.delete(m);
		}, O = () => {
			if (g.phase !== "left") {
				g = {
					phase: "left",
					relaysStopped: !1
				}, b = W, D((e) => e.phase === "occupied" && e.room === j || e.phase === "leaving" && e.finalizeCleanup === O);
				for (let e of w.values()) e.connectedPeer && !e.connectedPeer.isDead && e.connectedPeer.destroy(), e.answeringPeer && !e.answeringPeer.isDead && e.answeringPeer.destroy(), ea(e), Yi(e), e.connection = { phase: "disconnected" };
				w.clear(), S();
			}
		}, k = (e) => {
			for (let t of e) t.announce.phase === "active" && (t.announce.timer = G(t.announce.timer));
		}, A = [], [j, M] = Ho((e) => {
			b = e;
		}, (e, t = !0) => {
			if (g.phase === "left") return;
			let n = w.get(e);
			n?.connectedPeer && Qi(n, n.connectedPeer), Ki(w), t && x();
		}, O, {
			clientId: o,
			appId: m,
			roomId: d,
			...p.password === void 0 ? {} : { password: p.password },
			...p.maxUsers === void 0 ? {} : { maxUsers: p.maxUsers },
			...p.use === void 0 ? {} : { use: p.use },
			...p.identity === void 0 ? {} : { identity: p.identity },
			...p.maxReceiveBytes === void 0 ? {} : { maxReceiveBytes: p.maxReceiveBytes },
			onBeforeLeave: () => {
				g.phase === "active" && (g = { phase: "leaving-flush" }), k(A);
				let e = Ko(l, m), t = {
					phase: "leaving",
					finalizeCleanup: O
				}, n = e.get(d);
				if (n && n.phase === "occupied" && n.room !== j || e.set(d, t), v !== d) {
					let n = e.get(v);
					n && n.phase === "occupied" && n.room !== j || e.set(v, t);
				}
			}
		});
		try {
			let e = M.localEndpointP.then((e) => e.peerId);
			e.catch(W);
			let n = (e) => {
				g.phase !== "left" && M.emitError(e);
			}, o = {
				config: p,
				appId: m,
				roomId: d,
				peerId: ""
			}, u = M.effectiveRoomIdP?.then((e) => {
				if (v = e, o.roomId = e, e !== d && g.phase === "active") {
					let t = Ko(l, m), n = t.get(e);
					n?.phase === "leaving" && n.finalizeCleanup(), t.has(e) || t.set(e, {
						phase: "occupied",
						room: j
					});
				}
				return e;
			});
			u?.catch(W);
			let f = (e) => {
				let t = u ? u.then(e) : e(d);
				return t.catch(W), t;
			}, h = f((e) => pt(E(e))), D = U([u ?? Promise.resolve(d), e]).then(([e, t]) => (y = t, o.peerId = t, pt(Ee(E(e), t))));
			D.catch(W);
			let O = f((e) => ht(p.password ?? "", m, e)), N = (e) => async (t, n, r) => ({
				type: t.type,
				sdp: await e(O, t.sdp, bi(t.type, n, r))
			}), F = N(vt), I = N(_t), L = !1, R = !1, { checkout: ee, getOffers: te, claimLeased: ne, reclaimLeased: z, destroy: re } = sa(() => ya(!0, p)), ie = async (e, t, n) => {
				let r = await e.getOffer();
				if (!r || r.type !== "offer") throw s("failed to get offer for peer");
				return (await I(r, t, n)).sdp;
			}, ae = (e, t) => {
				if (C()) {
					e.destroy();
					return;
				}
				let n = na(w, t);
				if (n.connectedPeer && n.connectedPeer !== e) {
					if (Ai(n.connectedPeer) !== "stale") {
						e.destroy();
						return;
					}
					$i(n);
				}
				Zi(n, e), b(e, t), ea(n), e.isDead && n.connectedPeer === e && (Qi(n, e), Ki(w));
			}, B = !!p.passive, oe = W, se = W;
			x = () => {
				oe(), B || !L || R || (R = !0, queueMicrotask(() => {
					R = !1, g.phase === "active" && se();
				}));
			};
			let { handleMessage: ce, dialPeer: V } = ra({
				appId: m,
				getRoomId: () => v,
				config: p,
				peerStates: w,
				getRootTopicPlaintext: () => E(v),
				rootTopicP: h,
				selfTopicP: D,
				toPlain: F,
				toCipher: I,
				isLeaving: C,
				onError: n,
				checkoutOffers: ee,
				claimLeasedOffer: ne,
				reclaimLeasedOffer: z,
				encryptOffer: ie,
				initPeer: ya,
				connectPeer: ae,
				disconnectPeer: (e, t) => {
					if (g.phase === "left") return;
					let n = w.get(t);
					n?.connectedPeer === e && ($i(n), Ki(w), x());
				},
				announceIntervals: T,
				announceIntervalMs: Uo,
				getSelfIdNow: () => y,
				selfIdP: e,
				onPeerDiscovered: (e) => {
					M.canConnectPeer(e) && M.getScaleProvider()?.notePeerDiscovered(e) && oe();
				},
				shouldConnectPeer: (e, t) => M.canConnectPeer(e) && (M.getScaleProvider()?.shouldConnectPeer(e, t) ?? !0)
			});
			oe = () => {
				let e = M.getScaleProvider();
				if (!(C() || B || !e)) for (let t of e.getTargetNeighbors()) V(t);
			};
			let H = t(p);
			A = (Array.isArray(H) ? H : [H]).map((e) => {
				let t = Promise.resolve(e);
				return t.catch(W), {
					rawItem: e,
					relayP: t,
					leaseReleased: !1,
					subscription: { phase: "booting" },
					announce: { phase: "waiting" },
					gen: 0,
					intervalMs: Uo,
					attempts: 0,
					errors: 0,
					initial: "pending"
				};
			});
			let le = (e) => {
				e.leaseReleased || (e.leaseReleased = !0, gr(e.rawItem));
			};
			S = () => {
				if (!(g.phase === "left" && g.relaysStopped)) {
					g = {
						phase: "left",
						relaysStopped: !0
					}, k(A);
					for (let e of A) {
						let t = e.subscription;
						e.subscription = { phase: "closed" }, e.gen += 1, e.announce = { phase: "closed" }, t.phase === "subscribed" && t.unsub(), t.phase !== "subscribing" && le(e);
					}
					re();
				}
			};
			let ue = A.length, de = (e) => {
				_ === "error-reported" || M.hasSetupFailed() || C() || (_ = "error-reported", queueMicrotask(() => {
					!C() && !M.hasSetupFailed() && n({
						code: "relay-failed",
						message: q(e, "all signaling relays failed"),
						appId: m,
						roomId: v,
						...e === void 0 ? {} : { cause: e }
					});
				}));
			}, fe = (e) => {
				_ === "unconfirmed" && ue > 0 && A.every((e) => e.subscription.phase === "boot-failed") && de(e);
			}, pe = (e, t) => {
				switch (e.subscription.phase) {
					case "booting":
					case "subscribing":
						e.subscription = { phase: "boot-failed" }, fe(t);
						return;
					case "subscribed":
					case "closed":
					case "boot-failed": return;
					default: c(e.subscription);
				}
			};
			A.forEach((e) => {
				let t = e.relayP[a];
				typeof t == "function" && t().then((t) => {
					t && pe(e, t);
				});
			});
			let me = A.map(async (t, n) => {
				let i, a;
				try {
					[i, a] = await U([h, D]);
				} catch {
					return t.subscription = { phase: "closed" }, le(t), W;
				}
				if (C()) return t.subscription = { phase: "closed" }, le(t), W;
				let s;
				try {
					s = await t.relayP;
				} catch (e) {
					return pe(t, e), le(t), W;
				}
				if (C()) return t.subscription = { phase: "closed" }, le(t), W;
				t.subscription = { phase: "subscribing" };
				try {
					let c = await r(s, i, a, ce(n), (t) => e.then((e) => te(t, (t, n) => ie(t, e, n))), o);
					return C() || ((e) => e.subscription.phase === "closed")(t) ? (c(), t.subscription = { phase: "closed" }, le(t), W) : (t.subscription = {
						phase: "subscribed",
						unsub: c
					}, _ === "unconfirmed" && (_ = "healthy"), c);
				} catch (e) {
					return t.subscription = { phase: "boot-failed" }, le(t), fe(e), W;
				}
			});
			return B || U([h, D]).then(([e, t]) => {
				if (C()) return;
				let n = (e, t) => !C() && e.announce.phase === "active" && e.gen === t, r = async (a, s, c, l) => {
					if (!n(s, l)) return;
					let u, d = s.initial === "pending";
					try {
						u = await i(a, e, t, o), s.errors = 0, d && (s.initial = "succeeded");
					} catch (e) {
						if (C() || s.announce.phase === "closed") return;
						if (s.errors === 0 && p.relayConfig?.warnOnRelayFailure !== !1 && P(`announce failed - ${q(e, "")}`), s.errors += 1, d) {
							s.initial = "failed";
							let t = A.some((e) => e.initial === "succeeded"), n = ue > 0 && A.every((e) => e.subscription.phase === "boot-failed" || e.announce.phase !== "waiting" && e.initial !== "pending");
							!t && n && de(e);
						}
					}
					if (!n(s, l)) return;
					if (typeof u == "number") T[c] = u, s.intervalMs = u;
					else if (typeof u == "object" && u) {
						if ("stopAnnouncing" in u) {
							s.announce = { phase: "closed" };
							return;
						}
						s.intervalMs = u.nextAnnounceMs, L || (L = u.reannounceOnDisconnect === !0);
					}
					let f = s.attempts++, m = Wo[f] ?? (f === 3 && typeof u == "object" ? Uo : void 0), h = typeof m == "number" ? Math.min(s.intervalMs, m) : s.intervalMs, g = setTimeout(() => {
						s.announce.phase === "active" && s.announce.timer === g && (s.announce.timer = null), r(a, s, c, l);
					}, h);
					K(g), s.announce.phase === "active" ? s.announce.timer = g : clearTimeout(g);
				};
				se = () => {
					k(A), A.forEach((e, t) => {
						if (e.subscription.phase !== "subscribed" || e.announce.phase === "closed") return;
						let i = ++e.gen;
						e.attempts = 0, e.announce = {
							phase: "active",
							timer: null
						}, e.relayP.then((a) => {
							a && n(e, i) && r(a, e, t, i);
						}, W);
					});
				}, me.forEach((e, t) => {
					let i = A[t];
					i && e.then((e) => {
						if (C() || e === W || i.announce.phase !== "waiting") return;
						let { gen: a } = i;
						i.announce = {
							phase: "active",
							timer: null
						}, i.relayP.then((e) => {
							e && n(i, a) && r(e, i, t, a);
						}, W);
					}, W);
				});
			}, W), M.setOnScaleTargetsChanged((e) => {
				if (!C() && !B) for (let t of e) V(t);
			}), Ko(l, m).set(d, {
				phase: "occupied",
				room: j
			}), j;
		} catch (e) {
			throw g = {
				phase: "left",
				relaysStopped: !1
			}, S(), j.leave().catch(W), e;
		}
	});
}, Jo = 6e4, Yo = (e, t, n, r) => ({
	kind: t,
	appId: e.appId,
	roomId: e.roomId,
	rootTopic: n,
	selfTopic: r,
	peerId: e.peerId
}), Xo = ({ defaultConfig: e, steadyAnnounceIntervalMs: t = Jo, reannounceOnDisconnect: n = !0, init: r, subscribeTopic: i, publishTopic: a }) => qo({
	...e === void 0 ? {} : { defaultConfig: e },
	init: r,
	subscribe: async (e, t, n, r, o, s) => {
		let c = !1, l = (r, i) => {
			if (!c) try {
				Promise.resolve(a(e, r, i, Yo(s, "signal", t, n))).catch(W);
			} catch {}
		}, u = (e, t) => {
			if (!c) return r(e, t, l);
		}, d = await i(e, n, u, Yo(s, "self", t, n)), f;
		try {
			f = await i(e, t, u, Yo(s, "root", t, n));
		} catch (e) {
			throw c = !0, d(), e;
		}
		return () => {
			c || (c = !0, d(), f());
		};
	},
	announce: async (e, r, i, o) => {
		let s = await a(e, r, { peerId: o.peerId }, Yo(o, "announce", r, i));
		return typeof s == "number" ? s : typeof s == "object" && s ? "stopAnnouncing" in s ? s : {
			nextAnnounceMs: s.nextAnnounceMs ?? t,
			reannounceOnDisconnect: s.reannounceOnDisconnect ?? n
		} : {
			nextAnnounceMs: t,
			reannounceOnDisconnect: n
		};
	}
});
// \0@oxc-project+runtime@0.156.0/helpers/esm/typeof.js
function Zo(e) {
	"@babel/helpers - typeof";
	return Zo = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, Zo(e);
}
// \0@oxc-project+runtime@0.156.0/helpers/esm/toPrimitive.js
function Qo(e, t) {
	if (Zo(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (Zo(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
// \0@oxc-project+runtime@0.156.0/helpers/esm/toPropertyKey.js
function $o(e) {
	var t = Qo(e, "string");
	return Zo(t) == "symbol" ? t : t + "";
}
// \0@oxc-project+runtime@0.156.0/helpers/esm/defineProperty.js
function es(e, t, n) {
	return (t = $o(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
// node_modules/@noble/secp256k1/index.js
var ts = Object.freeze, ns = 115792089237316195423570985008687907853269984665640564039457584007908834671663n, rs = 115792089237316195423570985008687907852837564279074904382605163141518161494337n, is = 55066263022277343669578718895168534326250603453777594175500187360389116729240n, as = 32670510020758816978083085130507043184471273380659243275938904335757337482424n, os = ts({
	p: ns,
	n: rs,
	h: 1n,
	a: 0n,
	b: 7n,
	Gx: is,
	Gy: as
}), ss = 32, cs = (e) => e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array" && e.BYTES_PER_ELEMENT === 1, ls = (e, t, n = "") => {
	if (cs(e) && (t === void 0 || e.length === t)) return e;
	let r = cs(e), i = t === void 0 ? "" : ` of length ${t}`, a = r ? `length=${e.length}` : `type=${typeof e}`, o = (n ? `"${n}" ` : "") + "expected Uint8Array" + i + ", got " + a;
	throw r ? RangeError(o) : TypeError(o);
}, us = (e) => Uint8Array.from(e), ds = (e, t, n) => us(ls(e, n, t)), fs = (e, t) => e.toString(16).padStart(t, "0"), ps = (e) => {
	let t = "";
	for (let n of ls(e)) t += fs(n, 2);
	return t;
}, ms = (e) => {
	let t = "hex invalid";
	if (typeof e != "string") throw TypeError(t);
	if (e.length % 2 || !/^[\da-f]*$/i.test(e)) throw RangeError(t);
	let n = new Uint8Array(e.length / 2);
	for (let t = 0, r = 0; t < n.length; t++, r += 2) {
		let i = e.charCodeAt(r), a = e.charCodeAt(r + 1);
		n[t] = ((i & 15) + (i >> 6) * 9) * 16 + (a & 15) + (a >> 6) * 9;
	}
	return n;
}, hs = () => {
	let e = globalThis?.crypto?.subtle;
	if (e) return e;
	throw Error("crypto.subtle must be defined, consider polyfill");
}, gs = (...e) => {
	let t = 0;
	for (let n of e) t += ls(n).length;
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.length;
	return n;
}, _s = (e = ss) => {
	let t = globalThis?.crypto;
	if (typeof t?.getRandomValues != "function") throw Error("crypto.getRandomValues must be defined, consider polyfill");
	return t.getRandomValues(new Uint8Array(e));
}, vs = BigInt, ys = (e, t, n, r = "bad number: out of range") => {
	if (typeof e != "bigint") throw TypeError(r);
	if (t <= e && e < n) return e;
	throw RangeError(r);
}, Q = (e, t = ns) => (e %= t) >= 0n ? e : t + e, bs = (e) => Q(e, rs), xs = (e, t) => {
	if (e === 0n) throw Error("invert: expected non-zero number");
	if (t <= 1n) throw Error("invert: expected modulus > 1, got " + t);
	let n = Q(e, t), r = t, i = 0n, a = 1n;
	for (; n !== 0n;) {
		let e = r / n, t = r - n * e, o = i - a * e;
		r = n, n = t, i = a, a = o;
	}
	if (r !== 1n) throw Error("invert: does not exist");
	return Q(i, t);
}, Ss = (e) => {
	let t = Us[e];
	if (typeof t != "function") throw Error("hashes." + e + " not set");
	return t;
}, Cs = (e, t, n) => ls(Ss(e)(t, n), ss, "digest"), ws = async (e, t, n) => ls(await Ss(e)(t, n), ss, "digest"), Ts = (e) => {
	if (e instanceof Ps) return e;
	throw TypeError("Point expected");
}, Es = "bad point: not on curve", Ds = (e) => Q(Q(e * e) * e + 7n), Os = (e) => ys(e, 0n, ns), ks = (e) => ys(e, 1n, ns), As = (e) => ys(e, 1n, rs), js = (e) => !(e & 1n), Ms = (e) => Uint8Array.of(js(e) ? 2 : 3), Ns = (e) => {
	let t = Ds(ks(e)), n = 1n;
	for (let e = t, r = 115792089237316195423570985008687907853269984665640564039457584007908834671664n / 4n; r > 0n; r >>= 1n) r & 1n && (n = n * e % ns), e = e * e % ns;
	if (Q(n * n) !== t) throw Error("sqrt invalid");
	return new Ps(e, js(n) ? n : Q(-n), 1n);
}, Ps = class e {
	constructor(e, t, n) {
		es(this, "X", void 0), es(this, "Y", void 0), es(this, "Z", void 0), this.X = Os(e), this.Y = ks(t), this.Z = Os(n), ts(this);
	}
	static CURVE() {
		return os;
	}
	static fromAffine(t) {
		let { x: n, y: r } = t;
		return n === 0n && r === 0n ? Is : new e(n, r, 1n);
	}
	static fromBytes(t) {
		ls(t);
		let n = t.length, r = t[0], i = zs(t, 1, 33);
		try {
			if (n === 33 && (r === 2 || r === 3)) {
				let e = Ns(i);
				return r === 3 ? e.negate() : e;
			}
			if (n === 65 && r === 4) return new e(i, zs(t, 33, 65), 1n).assertValidity();
		} catch {
			throw Error(Es);
		}
		throw Error(Es);
	}
	static fromHex(t) {
		return e.fromBytes(ms(t));
	}
	get x() {
		return this.toAffine().x;
	}
	get y() {
		return this.toAffine().y;
	}
	equals(e) {
		let { X: t, Y: n, Z: r } = this, { X: i, Y: a, Z: o } = Ts(e);
		return Q(t * o) === Q(i * r) && Q(n * o) === Q(a * r);
	}
	is0() {
		return this.Z === 0n;
	}
	negate() {
		return new e(this.X, Q(-this.Y), this.Z);
	}
	double() {
		return this.add(this);
	}
	add(t) {
		let { X: n, Y: r, Z: i } = this, { X: a, Y: o, Z: s } = Ts(t), c = 0n, l = 0n, u = 0n, d = 0n, f = Q(7n * 3n), p = Q(n * a), m = Q(r * o), h = Q(i * s), g = Q(n + r), _ = Q(a + o);
		g = Q(g * _), _ = Q(p + m), g = Q(g - _), _ = Q(n + i);
		let v = Q(a + s);
		return _ = Q(_ * v), v = Q(p + h), _ = Q(_ - v), v = Q(r + i), l = Q(o + s), v = Q(v * l), l = Q(m + h), v = Q(v - l), d = Q(c * _), l = Q(f * h), d = Q(l + d), l = Q(m - d), d = Q(m + d), u = Q(l * d), m = Q(p + p), m = Q(m + p), h = Q(c * h), _ = Q(f * _), m = Q(m + h), h = Q(p - h), h = Q(c * h), _ = Q(_ + h), p = Q(m * _), u = Q(u + p), p = Q(v * _), l = Q(g * l), l = Q(l - p), p = Q(g * m), d = Q(v * d), d = Q(d + p), new e(l, u, d);
	}
	subtract(e) {
		return this.add(Ts(e).negate());
	}
	multiply(e, t = !0) {
		if (!t && e === 0n) return Is;
		if (As(e), e === 1n) return this;
		if (this.equals(Fs)) return hc(e).p;
		let n = Is, r = Fs, i = this;
		for (let a = 0; t ? a < 256 : e > 0n; a++) e & 1n ? n = n.add(i) : t && (r = r.add(i)), i = i.double(), e >>= 1n;
		return n;
	}
	multiplyUnsafe(e) {
		return this.multiply(e, !1);
	}
	toAffine() {
		let { X: e, Y: t, Z: n } = this;
		if (n === 0n) return {
			x: 0n,
			y: 0n
		};
		if (n === 1n) return {
			x: e,
			y: t
		};
		let r = xs(n, ns);
		if (Q(n * r) !== 1n) throw Error("inverse invalid");
		return {
			x: Q(e * r),
			y: Q(t * r)
		};
	}
	assertValidity() {
		let { x: e, y: t } = this.toAffine();
		if (ks(e), ks(t), Q(t * t) !== Ds(e)) throw Error(Es);
		return this;
	}
	toBytes(e = !0) {
		let { x: t, y: n } = this.assertValidity().toAffine(), r = Bs(t);
		return e ? gs(Ms(n), r) : gs(Uint8Array.of(4), r, Bs(n));
	}
	toHex(e) {
		return ps(this.toBytes(e));
	}
};
es(Ps, "BASE", void 0), es(Ps, "ZERO", void 0);
var Fs = new Ps(is, as, 1n), Is = new Ps(0n, 1n, 0n);
Ps.BASE = Fs, Ps.ZERO = Is;
var Ls = (e, t, n) => Fs.multiply(t, !1).add(e.multiply(n, !1)).assertValidity(), Rs = (e) => vs("0x" + (ps(e) || "0")), zs = (e, t, n) => Rs(e.subarray(t, n)), Bs = (e) => ms(fs(ys(e, 0n, 2n ** 256n), 64)), Vs = (e) => ys(Rs(ls(e, ss, "secret key")), 1n, rs, "invalid secret key: outside of range"), Hs = "SHA-256", Us = {
	hmacSha256Async: async (e, t) => {
		let n = hs(), r = await n.importKey("raw", e, {
			name: "HMAC",
			hash: Hs
		}, !1, ["sign"]);
		return new Uint8Array(await n.sign("HMAC", r, t));
	},
	hmacSha256: void 0,
	sha256Async: async (e) => new Uint8Array(await hs().digest(Hs, e)),
	sha256: void 0
}, Ws = (e) => {
	if (e = e === void 0 ? _s(48) : e, ls(e), e.length < 48 || e.length > 1024) throw RangeError("expected 48-1024b");
	return Bs(Q(Rs(e), rs - 1n) + 1n);
}, Gs = (e) => (t) => {
	let n = Ws(t);
	return {
		secretKey: n,
		publicKey: e(n)
	};
}, Ks = (e) => Uint8Array.from("BIP0340/" + e, (e) => e.charCodeAt(0)), qs = (e, ...t) => {
	let n = Cs("sha256", Ks(e));
	return Cs("sha256", gs(n, n, ...t));
}, Js = (e, ...t) => ws("sha256Async", Ks(e)).then((e) => ws("sha256Async", gs(e, e, ...t))), Ys = (e) => {
	let t = Vs(e), { x: n, y: r } = Fs.multiply(t).assertValidity().toAffine();
	return {
		d: js(r) ? t : bs(-t),
		px: Bs(n)
	};
}, Xs = (e) => bs(Rs(e)), Zs = (...e) => Xs(qs("challenge", ...e)), Qs = async (...e) => Xs(await Js("challenge", ...e)), $s = (e) => Ys(e).px, ec = /* @__PURE__ */ Gs($s), tc = (e, t, n) => {
	let r = ds(e, "message"), { px: i, d: a } = Ys(t);
	return {
		m: r,
		px: i,
		d: a,
		a: ls(n, ss)
	};
}, nc = (e) => {
	let t = Xs(e);
	if (t === 0n) throw Error("sign failed: k is zero");
	let { px: n, d: r } = Ys(Bs(t));
	return {
		rx: n,
		k: r
	};
}, rc = (e, t, n, r) => gs(t, Bs(bs(e + n * r))), ic = "invalid signature produced", ac = (e, t, n = _s(ss)) => {
	let { m: r, px: i, d: a, a: o } = tc(e, t, n), { rx: s, k: c } = nc(qs("nonce", Bs(a ^ Rs(qs("aux", o))), i, r)), l = rc(c, s, Zs(s, i, r), a);
	if (!lc(l, r, i)) throw Error(ic);
	return l;
}, oc = async (e, t, n = _s(ss)) => {
	let { m: r, px: i, d: a, a: o } = tc(e, t, n), { rx: s, k: c } = nc(await Js("nonce", Bs(a ^ Rs(await Js("aux", o))), i, r)), l = rc(c, s, await Qs(s, i, r), a);
	if (!await uc(l, r, i)) throw Error(ic);
	return l;
}, sc = (e, t) => e instanceof Promise ? e.then(t) : t(e), cc = (e, t, n, r) => {
	let i = ls(e, 64, "signature"), a = ls(t, void 0, "message"), o = ls(n, ss, "publicKey"), s, c, l, u;
	try {
		s = Ns(Rs(o)), c = ks(zs(i, 0, ss)), l = As(zs(i, ss, 64)), u = gs(Bs(c), o, a);
	} catch {
		return !1;
	}
	return sc(r(u), (e) => {
		try {
			let { x: t, y: n } = Ls(s, l, bs(-e)).toAffine();
			return !(!js(n) || t !== c);
		} catch {
			return !1;
		}
	});
}, lc = (e, t, n) => cc(e, t, n, Zs), uc = async (e, t, n) => cc(e, t, n, Qs), dc = /* @__PURE__ */ ts({
	keygen: ec,
	getPublicKey: $s,
	sign: ac,
	verify: lc,
	signAsync: oc,
	verifyAsync: uc
}), fc = () => {
	let e = [], t = Fs, n = t;
	for (let r = 0; r < 33; r++) {
		n = t, e.push(n);
		for (let r = 1; r < 128; r++) n = n.add(t), e.push(n);
		t = n.double();
	}
	return e;
}, pc = void 0, mc = (e, t) => {
	let n = t.negate();
	return e ? n : t;
}, hc = (e) => {
	let t = pc || (pc = fc()), n = Is, r = Fs;
	for (let i = 0; i < 33; i++) {
		let a = Number(e & 255n);
		e >>= 8n, a > 128 && (a -= 256, e += 1n);
		let o = i * 128, s = o + Math.abs(a) - 1, c = i % 2 != 0, l = a < 0;
		a === 0 ? r = r.add(mc(c, t[o])) : n = n.add(mc(l, t[s]));
	}
	if (e !== 0n) throw Error("invalid wnaf");
	return {
		p: n,
		f: r
	};
}, gc = "EVENT", _c = 60, vc = Uint8Array.prototype.toHex, yc = typeof vc == "function" ? (e) => vc.call(e) : (e) => Array.from(e, (e) => e.toString(16).padStart(2, "0")).join(""), bc = () => Math.floor(Date.now() / 1e3), xc = () => Math.max(0, bc() - _c), Sc = () => {
	let { secretKey: e, publicKey: t } = dc.keygen();
	return {
		secretKey: e,
		pubkey: yc(t)
	};
}, Cc = (e) => {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t = Math.imul(t ^ e.charCodeAt(n), 16777619);
	return (t >>> 0) % 1e4 + 2e4;
}, wc = async (e, t, n) => {
	let r = {
		kind: Cc(e),
		tags: [["x", e]],
		created_at: bc(),
		content: t,
		pubkey: n.pubkey
	}, i = new Uint8Array(await crypto.subtle.digest("SHA-256", d(l([
		0,
		r.pubkey,
		r.created_at,
		r.kind,
		r.tags,
		r.content
	]))));
	return l([gc, {
		...r,
		id: yc(i),
		sig: yc(await dc.signAsync(i, n.secretKey))
	}]);
}, Tc = (e) => {
	throw s(`unreachable: ${String(e)}`);
}, Ec = (e) => (e !== null && clearTimeout(e), null), Dc = /*@__PURE__*/ _r((e) => e.socket, (e) => {
	qc(e), e.close?.();
}), Oc = 5, kc = 250, Ac = 6e4, jc = 9e5, Mc = 5333, Nc = /*@__PURE__*/ new Map(), Pc = /*@__PURE__*/ new WeakMap(), Fc = /*@__PURE__*/ mr(), Ic = /*@__PURE__*/ new WeakMap(), Lc = (e, t) => `${e}\0${t}`, Rc = (e) => {
	let t = Nc.get(e);
	return t ? t.signer ?? (t.signer = Sc()) : Sc();
}, zc = (e) => {
	let t = Pc.get(e);
	if (!t) return { phase: "healthy" };
	if (t.phase === "cooldown" && Date.now() >= t.untilMs) {
		let n = {
			phase: "probation",
			lastDelayMs: t.delayMs
		};
		return Pc.set(e, n), n;
	}
	return t;
}, Bc = (e) => {
	let t = zc(e);
	switch (t.phase) {
		case "retired": return jc;
		case "healthy": {
			let t = Ac;
			return Pc.set(e, {
				phase: "cooldown",
				delayMs: t,
				untilMs: Date.now() + t
			}), t;
		}
		case "cooldown":
		case "probation": {
			let n = t.phase === "cooldown" ? t.delayMs : t.lastDelayMs, r = Math.min(Math.max(Ac, n * 2), jc);
			return Pc.set(e, {
				phase: "cooldown",
				delayMs: r,
				untilMs: Date.now() + r
			}), r;
		}
		default: return Tc(t);
	}
}, Vc = (e) => {
	zc(e).phase === "probation" && Pc.set(e, { phase: "healthy" });
}, Hc = (e) => {
	let t = zc(e);
	return t.phase === "cooldown" ? Math.max(0, t.untilMs - Date.now()) : 0;
}, Uc = (e) => ({ nextAnnounceMs: e }), Wc = { stopAnnouncing: !0 }, Gc = (e) => zc(e).phase !== "retired" && (Pc.set(e, { phase: "retired" }), Dc.evict(e), qc(e), e.close?.(), !0), Kc = (e) => {
	e.flushWaiters.forEach((e) => e()), e.flushWaiters.clear();
}, qc = (e) => {
	let t = Ic.get(e);
	t && (t.flushTimer = Ec(t.flushTimer), t.retryTimer = Ec(t.retryTimer), t.sync = { phase: "unsynced" }, Kc(t), Ic.delete(e));
}, Jc = (e, t, n) => {
	let r = Ic.get(e);
	r || (r = {
		subIds: [],
		topics: /* @__PURE__ */ new Map(),
		flushTimer: null,
		flushWaiters: /* @__PURE__ */ new Set(),
		sync: { phase: "unsynced" },
		retryTimer: null,
		retryMs: Mc
	}, Ic.set(e, r));
	let i = r.topics.get(t), a = !i;
	i || (i = /* @__PURE__ */ new Set(), r.topics.set(t, i)), i.add(n), (a || r.sync.phase === "unsynced") && Xc(e, r);
}, Yc = (e, t, n) => {
	let r = Ic.get(e);
	if (!r) return !1;
	let i = r.topics.get(t);
	return !i || !i.delete(n) ? !1 : i.size > 0 || (r.topics.delete(t), delete Fc.forRelay(e)[t], r.topics.size === 0 ? (r.subIds.forEach((t) => e.send(l(["CLOSE", t]))), qc(e), !0) : (Xc(e, r), !0));
}, Xc = (e, t) => {
	t.flushTimer === null && (t.flushTimer = setTimeout(() => {
		t.flushTimer = null;
		try {
			Qc(e);
		} finally {
			Kc(t);
		}
	}, 0));
}, Zc = (e) => {
	let t = Ic.get(e);
	return !t || t.flushTimer === null ? Promise.resolve() : new Promise((e) => {
		t.flushWaiters.add(e);
	});
}, Qc = (e) => {
	let t = Ic.get(e);
	if (!t || t.topics.size === 0) return;
	t.flushTimer = Ec(t.flushTimer), t.retryTimer = Ec(t.retryTimer);
	let n = [...t.topics.keys()], r = [], i = xc();
	for (let e = 0; e < n.length; e += kc) r.push(n.slice(e, e + kc));
	for (; t.subIds.length > r.length;) {
		let n = t.subIds.pop();
		n && e.send(l(["CLOSE", n]));
	}
	let a = /* @__PURE__ */ new Set(), o = Date.now();
	r.forEach((n, r) => {
		var o;
		let s = (o = t.subIds)[r] ?? (o[r] = ve(64));
		a.add(s), e.send(l([
			"REQ",
			s,
			{
				kinds: [...new Set(n.map(Cc))],
				since: i,
				"#x": n
			}
		]));
	}), t.sync = {
		phase: "awaiting-eose",
		pendingSubIds: a,
		requestedAt: o
	}, Kc(t);
}, $c = (e) => {
	let t = Ic.get(e);
	if (t && t.topics.size > 0 && !e.isClosed) {
		if (Hc(e) > 0) {
			rl(e, !0);
			return;
		}
		Qc(e), el(e);
	}
}, el = (e) => {
	Object.entries(Fc.forRelay(e)).forEach(([t, { payload: n, getSigner: r }]) => {
		nl(e, t, n, !0, r);
	});
}, tl = (e, t) => {
	let n = zc(e);
	if (n.phase === "retired" || e.isClosed) return t ? Wc : void 0;
	let r = n.phase === "cooldown" ? Math.max(0, n.untilMs - Date.now()) : 0;
	return r > 0 || e.socket?.readyState !== 1 ? t ? Uc(Math.max(Ac, r)) : void 0 : null;
}, nl = async (e, t, n, r, i) => {
	let a = tl(e, r);
	if (a !== null) return a;
	let o = await wc(t, r ? l({
		...u(n),
		nonce: ve(8)
	}) : n, i()), s = tl(e, r);
	return s === null ? r && !Ic.get(e)?.topics.has(t) ? Uc(Ac) : (e.send(o), r ? Uc(Ac) : void 0) : s;
}, rl = (e, t) => {
	let n = Ic.get(e);
	if (!n || n.topics.size === 0 || e.isClosed || n.retryTimer !== null && !t) return;
	let r = t ? Hc(e) : n.retryMs;
	n.retryMs = Math.min(n.retryMs * 2, Ac), n.sync.phase === "synced" && (n.sync = { phase: "unsynced" }), n.retryTimer = Ec(n.retryTimer), n.retryTimer = setTimeout(() => {
		n.retryTimer = null, $c(e);
	}, Math.max(r, Mc)), K(n.retryTimer);
}, il = /*@__PURE__*/ Xo({
	init: (e) => cr(e, al, Oc, !0).map((t) => {
		let r = Dc.register(t, () => {
			let r = pr(t, (t) => {
				let i = u(t);
				if (!Array.isArray(i)) return;
				let [a, o, s, c] = i;
				if (a !== "EVENT") {
					if (a === "CLOSED" && !Ic.get(r)?.subIds.includes(o)) return;
					let t = `${n}: relay failure from ${r.url} - `, i = a === "CLOSED" && typeof s == "string" ? s : c, l = a === "OK" && s === !1, u = (l || a === "CLOSED") && i?.startsWith("rate-limited:"), d = l && i?.startsWith("duplicate:"), f = i && /^(blocked|restricted|auth-required|pow):/.test(i);
					if (a === "OK" && s === !0 && Vc(r), (l || a === "CLOSED") && f && !Gc(r)) return;
					if (u) Bc(r);
					else if (a === "EOSE") {
						let e = Ic.get(r);
						if (e && e.sync.phase === "awaiting-eose" && e.sync.pendingSubIds.delete(o) && e.sync.pendingSubIds.size === 0) {
							let { requestedAt: t } = e.sync;
							e.retryTimer = Ec(e.retryTimer), e.retryMs = Mc, e.sync = { phase: "synced" }, Date.now() - t >= 1e3 && el(r);
						}
					}
					a === "CLOSED" && !f && rl(r, !!u), !d && e.relayConfig?.warnOnRelayFailure !== !1 && (a === "NOTICE" ? console.warn(t + o) : (l || a === "CLOSED") && console.warn(t + i));
				} else if (s && typeof s == "object" && "content" in s) {
					let e = Ic.get(r);
					if (e?.subIds.includes(o) && s.tags) {
						let t = s.tags.find((e) => Array.isArray(e) && e[0] === "x");
						if (t?.[1]) {
							let n = t[1];
							e.topics.get(n)?.forEach((e) => {
								e(n, s.content);
							});
						}
					}
				}
			}, () => $c(r));
			return r;
		});
		return Dc.lease(r, r.ready);
	}),
	subscribeTopic: (e, t, n, r) => {
		let i = Lc(r.rootTopic, r.selfTopic), a = Nc.get(i);
		a ? a.refs += 1 : Nc.set(i, {
			refs: 1,
			signer: null
		});
		let o = !1, s = (e, t) => void n(e, t);
		Jc(e, t, s);
		let c = () => {
			if (o) return;
			o = !0;
			let n = Nc.get(i);
			n && (n.refs <= 1 ? Nc.delete(i) : --n.refs), Yc(e, t, s);
		};
		return r.kind === "root" ? Zc(e).then(() => c) : c;
	},
	publishTopic: (e, t, n, { kind: r, rootTopic: i, selfTopic: a }) => {
		let o = typeof n == "string" ? n : l(n), s = Lc(i, a), c = () => Rc(s);
		return r === "announce" && Ic.get(e)?.topics.has(t) && (Fc.forRelay(e)[t] = {
			payload: o,
			getSigner: c
		}), nl(e, t, o, r === "announce", c);
	}
}), al = /* @__PURE__ */ "wss://bucket.coracle.social,wss://fanfares.nostr1.com,wss://no.str.cr,wss://nostr-01.yakihonne.com,wss://nostr-pub.wellorder.net,wss://nostr.azzamo.net,wss://nostr.chaima.info,wss://nostr.data.haus,wss://nostr.hifish.org,wss://nostr.liberty.fans,wss://nostr.overmind.lol,wss://nostr.sathoarder.com,wss://nostrelay.circum.space,wss://relay.angor.io,wss://relay.ditto.pub,wss://relay.dwadziesciajeden.pl,wss://relay.fundstr.me,wss://relay.guggero.org,wss://relay.masize.com,wss://relay.minibolt.info,wss://relay.mostro.network,wss://relay.nostr.com,wss://relay.nostr.net,wss://relay.nostrhub.fr,wss://relay.notoshi.win,wss://relay.primal.net,wss://relay.snort.social,wss://relay.wavlake.com,wss://soloco.nl,wss://yabu.me".split(","), ol = function(e, t) {
	let n = e, r = cl[t], i = null, a = 0, o = null, s = [], c = {}, l = function(e, t) {
		a = n * 4 + 17, i = function(e) {
			let t = Array(e);
			for (let n = 0; n < e; n += 1) {
				t[n] = Array(e);
				for (let r = 0; r < e; r += 1) t[n][r] = null;
			}
			return t;
		}(a), u(0, 0), u(a - 7, 0), u(0, a - 7), p(), f(), h(e, t), n >= 7 && m(e), o ?? (o = v(n, r, s)), g(o, t);
	}, u = function(e, t) {
		for (let n = -1; n <= 7; n += 1) if (!(e + n <= -1 || a <= e + n)) for (let r = -1; r <= 7; r += 1) t + r <= -1 || a <= t + r || (0 <= n && n <= 6 && (r == 0 || r == 6) || 0 <= r && r <= 6 && (n == 0 || n == 6) || 2 <= n && n <= 4 && 2 <= r && r <= 4 ? i[e + n][t + r] = !0 : i[e + n][t + r] = !1);
	}, d = function() {
		let e = 0, t = 0;
		for (let n = 0; n < 8; n += 1) {
			l(!0, n);
			let r = ul.getLostPoint(c);
			(n == 0 || e > r) && (e = r, t = n);
		}
		return t;
	}, f = function() {
		for (let e = 8; e < a - 8; e += 1) i[e][6] ?? (i[e][6] = e % 2 == 0);
		for (let e = 8; e < a - 8; e += 1) i[6][e] ?? (i[6][e] = e % 2 == 0);
	}, p = function() {
		let e = ul.getPatternPosition(n);
		for (let t = 0; t < e.length; t += 1) for (let n = 0; n < e.length; n += 1) {
			let r = e[t], a = e[n];
			if (i[r][a] == null) for (let e = -2; e <= 2; e += 1) for (let t = -2; t <= 2; t += 1) e == -2 || e == 2 || t == -2 || t == 2 || e == 0 && t == 0 ? i[r + e][a + t] = !0 : i[r + e][a + t] = !1;
		}
	}, m = function(e) {
		let t = ul.getBCHTypeNumber(n);
		for (let n = 0; n < 18; n += 1) {
			let r = !e && (t >> n & 1) == 1;
			i[Math.floor(n / 3)][n % 3 + a - 8 - 3] = r;
		}
		for (let n = 0; n < 18; n += 1) {
			let r = !e && (t >> n & 1) == 1;
			i[n % 3 + a - 8 - 3][Math.floor(n / 3)] = r;
		}
	}, h = function(e, t) {
		let n = r << 3 | t, o = ul.getBCHTypeInfo(n);
		for (let t = 0; t < 15; t += 1) {
			let n = !e && (o >> t & 1) == 1;
			t < 6 ? i[t][8] = n : t < 8 ? i[t + 1][8] = n : i[a - 15 + t][8] = n;
		}
		for (let t = 0; t < 15; t += 1) {
			let n = !e && (o >> t & 1) == 1;
			t < 8 ? i[8][a - t - 1] = n : t < 9 ? i[8][15 - t - 1 + 1] = n : i[8][15 - t - 1] = n;
		}
		i[a - 8][8] = !e;
	}, g = function(e, t) {
		let n = -1, r = a - 1, o = 7, s = 0, c = ul.getMaskFunction(t);
		for (let t = a - 1; t > 0; t -= 2) for (t == 6 && --t;;) {
			for (let n = 0; n < 2; n += 1) if (i[r][t - n] == null) {
				let a = !1;
				s < e.length && (a = (e[s] >>> o & 1) == 1), c(r, t - n) && (a = !a), i[r][t - n] = a, --o, o == -1 && (s += 1, o = 7);
			}
			if (r += n, r < 0 || a <= r) {
				r -= n, n = -n;
				break;
			}
		}
	}, _ = function(e, t) {
		let n = 0, r = 0, i = 0, a = Array(t.length), o = Array(t.length);
		for (let s = 0; s < t.length; s += 1) {
			let c = t[s].dataCount, l = t[s].totalCount - c;
			r = Math.max(r, c), i = Math.max(i, l), a[s] = Array(c);
			for (let t = 0; t < a[s].length; t += 1) a[s][t] = 255 & e.getBuffer()[t + n];
			n += c;
			let u = ul.getErrorCorrectPolynomial(l), d = fl(a[s], u.getLength() - 1).mod(u);
			o[s] = Array(u.getLength() - 1);
			for (let e = 0; e < o[s].length; e += 1) {
				let t = e + d.getLength() - o[s].length;
				o[s][e] = t >= 0 ? d.getAt(t) : 0;
			}
		}
		let s = 0;
		for (let e = 0; e < t.length; e += 1) s += t[e].totalCount;
		let c = Array(s), l = 0;
		for (let e = 0; e < r; e += 1) for (let n = 0; n < t.length; n += 1) e < a[n].length && (c[l] = a[n][e], l += 1);
		for (let e = 0; e < i; e += 1) for (let n = 0; n < t.length; n += 1) e < o[n].length && (c[l] = o[n][e], l += 1);
		return c;
	}, v = function(e, t, n) {
		let r = pl.getRSBlocks(e, t), i = ml();
		for (let t = 0; t < n.length; t += 1) {
			let r = n[t];
			i.put(r.getMode(), 4), i.put(r.getLength(), ul.getLengthInBits(r.getMode(), e)), r.write(i);
		}
		let a = 0;
		for (let e = 0; e < r.length; e += 1) a += r[e].dataCount;
		if (i.getLengthInBits() > a * 8) throw "code length overflow. (" + i.getLengthInBits() + ">" + a * 8 + ")";
		for (i.getLengthInBits() + 4 <= a * 8 && i.put(0, 4); i.getLengthInBits() % 8 != 0;) i.putBit(!1);
		for (; !(i.getLengthInBits() >= a * 8 || (i.put(236, 8), i.getLengthInBits() >= a * 8));) i.put(17, 8);
		return _(i, r);
	};
	c.addData = function(e, t) {
		t = t || "Byte";
		let n = null;
		switch (t) {
			case "Numeric":
				n = hl(e);
				break;
			case "Alphanumeric":
				n = gl(e);
				break;
			case "Byte":
				n = _l(e);
				break;
			case "Kanji":
				n = vl(e);
				break;
			default: throw "mode:" + t;
		}
		s.push(n), o = null;
	}, c.isDark = function(e, t) {
		if (e < 0 || a <= e || t < 0 || a <= t) throw e + "," + t;
		return i[e][t];
	}, c.getModuleCount = function() {
		return a;
	}, c.make = function() {
		if (n < 1) {
			let e = 1;
			for (; e < 40; e++) {
				let t = pl.getRSBlocks(e, r), n = ml();
				for (let t = 0; t < s.length; t++) {
					let r = s[t];
					n.put(r.getMode(), 4), n.put(r.getLength(), ul.getLengthInBits(r.getMode(), e)), r.write(n);
				}
				let i = 0;
				for (let e = 0; e < t.length; e++) i += t[e].dataCount;
				if (n.getLengthInBits() <= i * 8) break;
			}
			n = e;
		}
		l(!1, d());
	}, c.createTableTag = function(e, t) {
		e = e || 2, t = t === void 0 ? e * 4 : t;
		let n = "";
		n += "<table style=\"", n += " border-width: 0px; border-style: none;", n += " border-collapse: collapse;", n += " padding: 0px; margin: " + t + "px;", n += "\">", n += "<tbody>";
		for (let t = 0; t < c.getModuleCount(); t += 1) {
			n += "<tr>";
			for (let r = 0; r < c.getModuleCount(); r += 1) n += "<td style=\"", n += " border-width: 0px; border-style: none;", n += " border-collapse: collapse;", n += " padding: 0px; margin: 0px;", n += " width: " + e + "px;", n += " height: " + e + "px;", n += " background-color: ", n += c.isDark(t, r) ? "#000000" : "#ffffff", n += ";", n += "\"/>";
			n += "</tr>";
		}
		return n += "</tbody>", n += "</table>", n;
	}, c.createSvgTag = function(e, t, n, r) {
		let i = {};
		typeof arguments[0] == "object" && (i = arguments[0], e = i.cellSize, t = i.margin, n = i.alt, r = i.title), e = e || 2, t = t === void 0 ? e * 4 : t, n = typeof n == "string" ? { text: n } : n || {}, n.text = n.text || null, n.id = n.text ? n.id || "qrcode-description" : null, r = typeof r == "string" ? { text: r } : r || {}, r.text = r.text || null, r.id = r.text ? r.id || "qrcode-title" : null;
		let a = c.getModuleCount() * e + t * 2, o, s, l, u, d = "", f;
		for (f = "l" + e + ",0 0," + e + " -" + e + ",0 0,-" + e + "z ", d += "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"", d += i.scalable ? "" : " width=\"" + a + "px\" height=\"" + a + "px\"", d += " viewBox=\"0 0 " + a + " " + a + "\" ", d += " preserveAspectRatio=\"xMinYMin meet\"", d += r.text || n.text ? " role=\"img\" aria-labelledby=\"" + y([r.id, n.id].join(" ").trim()) + "\"" : "", d += ">", d += r.text ? "<title id=\"" + y(r.id) + "\">" + y(r.text) + "</title>" : "", d += n.text ? "<description id=\"" + y(n.id) + "\">" + y(n.text) + "</description>" : "", d += "<rect width=\"100%\" height=\"100%\" fill=\"white\" cx=\"0\" cy=\"0\"/>", d += "<path d=\"", l = 0; l < c.getModuleCount(); l += 1) for (u = l * e + t, o = 0; o < c.getModuleCount(); o += 1) c.isDark(l, o) && (s = o * e + t, d += "M" + s + "," + u + f);
		return d += "\" stroke=\"transparent\" fill=\"black\"/>", d += "</svg>", d;
	}, c.createDataURL = function(e, t) {
		e = e || 2, t = t === void 0 ? e * 4 : t;
		let n = c.getModuleCount() * e + t * 2, r = t, i = n - t;
		return Cl(n, n, function(t, n) {
			if (r <= t && t < i && r <= n && n < i) {
				let i = Math.floor((t - r) / e), a = Math.floor((n - r) / e);
				return +!c.isDark(a, i);
			}
			return 1;
		});
	}, c.createImgTag = function(e, t, n) {
		e = e || 2, t = t === void 0 ? e * 4 : t;
		let r = c.getModuleCount() * e + t * 2, i = "";
		return i += "<img", i += " src=\"", i += c.createDataURL(e, t), i += "\"", i += " width=\"", i += r, i += "\"", i += " height=\"", i += r, i += "\"", n && (i += " alt=\"", i += y(n), i += "\""), i += "/>", i;
	};
	let y = function(e) {
		let t = "";
		for (let n = 0; n < e.length; n += 1) {
			let r = e.charAt(n);
			switch (r) {
				case "<":
					t += "&lt;";
					break;
				case ">":
					t += "&gt;";
					break;
				case "&":
					t += "&amp;";
					break;
				case "\"":
					t += "&quot;";
					break;
				default: t += r;
			}
		}
		return t;
	}, b = function(e) {
		e = e === void 0 ? 2 : e;
		let t = c.getModuleCount() * 1 + e * 2, n = e, r = t - e, i, a, o, s, l, u = {
			"██": "█",
			"█ ": "▀",
			" █": "▄",
			"  ": " "
		}, d = {
			"██": "▀",
			"█ ": "▀",
			" █": " ",
			"  ": " "
		}, f = "";
		for (i = 0; i < t; i += 2) {
			for (o = Math.floor((i - n) / 1), s = Math.floor((i + 1 - n) / 1), a = 0; a < t; a += 1) l = "█", n <= a && a < r && n <= i && i < r && c.isDark(o, Math.floor((a - n) / 1)) && (l = " "), n <= a && a < r && n <= i + 1 && i + 1 < r && c.isDark(s, Math.floor((a - n) / 1)) ? l += " " : l += "█", f += e < 1 && i + 1 >= r ? d[l] : u[l];
			f += "\n";
		}
		return t % 2 && e > 0 ? f.substring(0, f.length - t - 1) + Array(t + 1).join("▀") : f.substring(0, f.length - 1);
	};
	return c.createASCII = function(e, t) {
		if (e = e || 1, e < 2) return b(t);
		--e, t = t === void 0 ? e * 2 : t;
		let n = c.getModuleCount() * e + t * 2, r = t, i = n - t, a, o, s, l, u = Array(e + 1).join("██"), d = Array(e + 1).join("  "), f = "", p = "";
		for (a = 0; a < n; a += 1) {
			for (s = Math.floor((a - r) / e), p = "", o = 0; o < n; o += 1) l = 1, r <= o && o < i && r <= a && a < i && c.isDark(s, Math.floor((o - r) / e)) && (l = 0), p += l ? u : d;
			for (s = 0; s < e; s += 1) f += p + "\n";
		}
		return f.substring(0, f.length - 1);
	}, c.renderTo2dContext = function(e, t) {
		t = t || 2;
		let n = c.getModuleCount();
		for (let r = 0; r < n; r++) for (let i = 0; i < n; i++) e.fillStyle = c.isDark(r, i) ? "black" : "white", e.fillRect(i * t, r * t, t, t);
	}, c;
};
ol.stringToBytes = function(e) {
	let t = [];
	for (let n = 0; n < e.length; n += 1) {
		let r = e.charCodeAt(n);
		t.push(r & 255);
	}
	return t;
}, ol.createStringToBytes = function(e, t) {
	let n = function() {
		let n = xl(e), r = function() {
			let e = n.read();
			if (e == -1) throw "eof";
			return e;
		}, i = 0, a = {};
		for (;;) {
			let e = n.read();
			if (e == -1) break;
			let t = r(), o = r(), s = r(), c = String.fromCharCode(e << 8 | t);
			a[c] = o << 8 | s, i += 1;
		}
		if (i != t) throw i + " != " + t;
		return a;
	}();
	return function(e) {
		let t = [];
		for (let r = 0; r < e.length; r += 1) {
			let i = e.charCodeAt(r);
			if (i < 128) t.push(i);
			else {
				let i = n[e.charAt(r)];
				typeof i == "number" ? (i & 255) == i ? t.push(i) : (t.push(i >>> 8), t.push(i & 255)) : t.push(63);
			}
		}
		return t;
	};
};
var sl = {
	MODE_NUMBER: 1,
	MODE_ALPHA_NUM: 2,
	MODE_8BIT_BYTE: 4,
	MODE_KANJI: 8
}, cl = {
	L: 1,
	M: 0,
	Q: 3,
	H: 2
}, ll = {
	PATTERN000: 0,
	PATTERN001: 1,
	PATTERN010: 2,
	PATTERN011: 3,
	PATTERN100: 4,
	PATTERN101: 5,
	PATTERN110: 6,
	PATTERN111: 7
}, ul = function() {
	let e = [
		[],
		[6, 18],
		[6, 22],
		[6, 26],
		[6, 30],
		[6, 34],
		[
			6,
			22,
			38
		],
		[
			6,
			24,
			42
		],
		[
			6,
			26,
			46
		],
		[
			6,
			28,
			50
		],
		[
			6,
			30,
			54
		],
		[
			6,
			32,
			58
		],
		[
			6,
			34,
			62
		],
		[
			6,
			26,
			46,
			66
		],
		[
			6,
			26,
			48,
			70
		],
		[
			6,
			26,
			50,
			74
		],
		[
			6,
			30,
			54,
			78
		],
		[
			6,
			30,
			56,
			82
		],
		[
			6,
			30,
			58,
			86
		],
		[
			6,
			34,
			62,
			90
		],
		[
			6,
			28,
			50,
			72,
			94
		],
		[
			6,
			26,
			50,
			74,
			98
		],
		[
			6,
			30,
			54,
			78,
			102
		],
		[
			6,
			28,
			54,
			80,
			106
		],
		[
			6,
			32,
			58,
			84,
			110
		],
		[
			6,
			30,
			58,
			86,
			114
		],
		[
			6,
			34,
			62,
			90,
			118
		],
		[
			6,
			26,
			50,
			74,
			98,
			122
		],
		[
			6,
			30,
			54,
			78,
			102,
			126
		],
		[
			6,
			26,
			52,
			78,
			104,
			130
		],
		[
			6,
			30,
			56,
			82,
			108,
			134
		],
		[
			6,
			34,
			60,
			86,
			112,
			138
		],
		[
			6,
			30,
			58,
			86,
			114,
			142
		],
		[
			6,
			34,
			62,
			90,
			118,
			146
		],
		[
			6,
			30,
			54,
			78,
			102,
			126,
			150
		],
		[
			6,
			24,
			50,
			76,
			102,
			128,
			154
		],
		[
			6,
			28,
			54,
			80,
			106,
			132,
			158
		],
		[
			6,
			32,
			58,
			84,
			110,
			136,
			162
		],
		[
			6,
			26,
			54,
			82,
			110,
			138,
			166
		],
		[
			6,
			30,
			58,
			86,
			114,
			142,
			170
		]
	], t = 1335, n = 7973, r = {}, i = function(e) {
		let t = 0;
		for (; e != 0;) t += 1, e >>>= 1;
		return t;
	};
	return r.getBCHTypeInfo = function(e) {
		let n = e << 10;
		for (; i(n) - i(t) >= 0;) n ^= t << i(n) - i(t);
		return (e << 10 | n) ^ 21522;
	}, r.getBCHTypeNumber = function(e) {
		let t = e << 12;
		for (; i(t) - i(n) >= 0;) t ^= n << i(t) - i(n);
		return e << 12 | t;
	}, r.getPatternPosition = function(t) {
		return e[t - 1];
	}, r.getMaskFunction = function(e) {
		switch (e) {
			case ll.PATTERN000: return function(e, t) {
				return (e + t) % 2 == 0;
			};
			case ll.PATTERN001: return function(e, t) {
				return e % 2 == 0;
			};
			case ll.PATTERN010: return function(e, t) {
				return t % 3 == 0;
			};
			case ll.PATTERN011: return function(e, t) {
				return (e + t) % 3 == 0;
			};
			case ll.PATTERN100: return function(e, t) {
				return (Math.floor(e / 2) + Math.floor(t / 3)) % 2 == 0;
			};
			case ll.PATTERN101: return function(e, t) {
				return e * t % 2 + e * t % 3 == 0;
			};
			case ll.PATTERN110: return function(e, t) {
				return (e * t % 2 + e * t % 3) % 2 == 0;
			};
			case ll.PATTERN111: return function(e, t) {
				return (e * t % 3 + (e + t) % 2) % 2 == 0;
			};
			default: throw "bad maskPattern:" + e;
		}
	}, r.getErrorCorrectPolynomial = function(e) {
		let t = fl([1], 0);
		for (let n = 0; n < e; n += 1) t = t.multiply(fl([1, dl.gexp(n)], 0));
		return t;
	}, r.getLengthInBits = function(e, t) {
		if (1 <= t && t < 10) switch (e) {
			case sl.MODE_NUMBER: return 10;
			case sl.MODE_ALPHA_NUM: return 9;
			case sl.MODE_8BIT_BYTE: return 8;
			case sl.MODE_KANJI: return 8;
			default: throw "mode:" + e;
		}
		else if (t < 27) switch (e) {
			case sl.MODE_NUMBER: return 12;
			case sl.MODE_ALPHA_NUM: return 11;
			case sl.MODE_8BIT_BYTE: return 16;
			case sl.MODE_KANJI: return 10;
			default: throw "mode:" + e;
		}
		else if (t < 41) switch (e) {
			case sl.MODE_NUMBER: return 14;
			case sl.MODE_ALPHA_NUM: return 13;
			case sl.MODE_8BIT_BYTE: return 16;
			case sl.MODE_KANJI: return 12;
			default: throw "mode:" + e;
		}
		else throw "type:" + t;
	}, r.getLostPoint = function(e) {
		let t = e.getModuleCount(), n = 0;
		for (let r = 0; r < t; r += 1) for (let i = 0; i < t; i += 1) {
			let a = 0, o = e.isDark(r, i);
			for (let n = -1; n <= 1; n += 1) if (!(r + n < 0 || t <= r + n)) for (let s = -1; s <= 1; s += 1) i + s < 0 || t <= i + s || (n != 0 || s != 0) && o == e.isDark(r + n, i + s) && (a += 1);
			a > 5 && (n += 3 + a - 5);
		}
		for (let r = 0; r < t - 1; r += 1) for (let i = 0; i < t - 1; i += 1) {
			let t = 0;
			e.isDark(r, i) && (t += 1), e.isDark(r + 1, i) && (t += 1), e.isDark(r, i + 1) && (t += 1), e.isDark(r + 1, i + 1) && (t += 1), (t == 0 || t == 4) && (n += 3);
		}
		for (let r = 0; r < t; r += 1) for (let i = 0; i < t - 6; i += 1) e.isDark(r, i) && !e.isDark(r, i + 1) && e.isDark(r, i + 2) && e.isDark(r, i + 3) && e.isDark(r, i + 4) && !e.isDark(r, i + 5) && e.isDark(r, i + 6) && (n += 40);
		for (let r = 0; r < t; r += 1) for (let i = 0; i < t - 6; i += 1) e.isDark(i, r) && !e.isDark(i + 1, r) && e.isDark(i + 2, r) && e.isDark(i + 3, r) && e.isDark(i + 4, r) && !e.isDark(i + 5, r) && e.isDark(i + 6, r) && (n += 40);
		let r = 0;
		for (let n = 0; n < t; n += 1) for (let i = 0; i < t; i += 1) e.isDark(i, n) && (r += 1);
		let i = Math.abs(100 * r / t / t - 50) / 5;
		return n += i * 10, n;
	}, r;
}(), dl = function() {
	let e = Array(256), t = Array(256);
	for (let t = 0; t < 8; t += 1) e[t] = 1 << t;
	for (let t = 8; t < 256; t += 1) e[t] = e[t - 4] ^ e[t - 5] ^ e[t - 6] ^ e[t - 8];
	for (let n = 0; n < 255; n += 1) t[e[n]] = n;
	let n = {};
	return n.glog = function(e) {
		if (e < 1) throw "glog(" + e + ")";
		return t[e];
	}, n.gexp = function(t) {
		for (; t < 0;) t += 255;
		for (; t >= 256;) t -= 255;
		return e[t];
	}, n;
}(), fl = function(e, t) {
	if (e.length === void 0) throw e.length + "/" + t;
	let n = function() {
		let n = 0;
		for (; n < e.length && e[n] == 0;) n += 1;
		let r = Array(e.length - n + t);
		for (let t = 0; t < e.length - n; t += 1) r[t] = e[t + n];
		return r;
	}(), r = {};
	return r.getAt = function(e) {
		return n[e];
	}, r.getLength = function() {
		return n.length;
	}, r.multiply = function(e) {
		let t = Array(r.getLength() + e.getLength() - 1);
		for (let n = 0; n < r.getLength(); n += 1) for (let i = 0; i < e.getLength(); i += 1) t[n + i] ^= dl.gexp(dl.glog(r.getAt(n)) + dl.glog(e.getAt(i)));
		return fl(t, 0);
	}, r.mod = function(e) {
		if (r.getLength() - e.getLength() < 0) return r;
		let t = dl.glog(r.getAt(0)) - dl.glog(e.getAt(0)), n = Array(r.getLength());
		for (let e = 0; e < r.getLength(); e += 1) n[e] = r.getAt(e);
		for (let r = 0; r < e.getLength(); r += 1) n[r] ^= dl.gexp(dl.glog(e.getAt(r)) + t);
		return fl(n, 0).mod(e);
	}, r;
}, pl = function() {
	let e = [
		[
			1,
			26,
			19
		],
		[
			1,
			26,
			16
		],
		[
			1,
			26,
			13
		],
		[
			1,
			26,
			9
		],
		[
			1,
			44,
			34
		],
		[
			1,
			44,
			28
		],
		[
			1,
			44,
			22
		],
		[
			1,
			44,
			16
		],
		[
			1,
			70,
			55
		],
		[
			1,
			70,
			44
		],
		[
			2,
			35,
			17
		],
		[
			2,
			35,
			13
		],
		[
			1,
			100,
			80
		],
		[
			2,
			50,
			32
		],
		[
			2,
			50,
			24
		],
		[
			4,
			25,
			9
		],
		[
			1,
			134,
			108
		],
		[
			2,
			67,
			43
		],
		[
			2,
			33,
			15,
			2,
			34,
			16
		],
		[
			2,
			33,
			11,
			2,
			34,
			12
		],
		[
			2,
			86,
			68
		],
		[
			4,
			43,
			27
		],
		[
			4,
			43,
			19
		],
		[
			4,
			43,
			15
		],
		[
			2,
			98,
			78
		],
		[
			4,
			49,
			31
		],
		[
			2,
			32,
			14,
			4,
			33,
			15
		],
		[
			4,
			39,
			13,
			1,
			40,
			14
		],
		[
			2,
			121,
			97
		],
		[
			2,
			60,
			38,
			2,
			61,
			39
		],
		[
			4,
			40,
			18,
			2,
			41,
			19
		],
		[
			4,
			40,
			14,
			2,
			41,
			15
		],
		[
			2,
			146,
			116
		],
		[
			3,
			58,
			36,
			2,
			59,
			37
		],
		[
			4,
			36,
			16,
			4,
			37,
			17
		],
		[
			4,
			36,
			12,
			4,
			37,
			13
		],
		[
			2,
			86,
			68,
			2,
			87,
			69
		],
		[
			4,
			69,
			43,
			1,
			70,
			44
		],
		[
			6,
			43,
			19,
			2,
			44,
			20
		],
		[
			6,
			43,
			15,
			2,
			44,
			16
		],
		[
			4,
			101,
			81
		],
		[
			1,
			80,
			50,
			4,
			81,
			51
		],
		[
			4,
			50,
			22,
			4,
			51,
			23
		],
		[
			3,
			36,
			12,
			8,
			37,
			13
		],
		[
			2,
			116,
			92,
			2,
			117,
			93
		],
		[
			6,
			58,
			36,
			2,
			59,
			37
		],
		[
			4,
			46,
			20,
			6,
			47,
			21
		],
		[
			7,
			42,
			14,
			4,
			43,
			15
		],
		[
			4,
			133,
			107
		],
		[
			8,
			59,
			37,
			1,
			60,
			38
		],
		[
			8,
			44,
			20,
			4,
			45,
			21
		],
		[
			12,
			33,
			11,
			4,
			34,
			12
		],
		[
			3,
			145,
			115,
			1,
			146,
			116
		],
		[
			4,
			64,
			40,
			5,
			65,
			41
		],
		[
			11,
			36,
			16,
			5,
			37,
			17
		],
		[
			11,
			36,
			12,
			5,
			37,
			13
		],
		[
			5,
			109,
			87,
			1,
			110,
			88
		],
		[
			5,
			65,
			41,
			5,
			66,
			42
		],
		[
			5,
			54,
			24,
			7,
			55,
			25
		],
		[
			11,
			36,
			12,
			7,
			37,
			13
		],
		[
			5,
			122,
			98,
			1,
			123,
			99
		],
		[
			7,
			73,
			45,
			3,
			74,
			46
		],
		[
			15,
			43,
			19,
			2,
			44,
			20
		],
		[
			3,
			45,
			15,
			13,
			46,
			16
		],
		[
			1,
			135,
			107,
			5,
			136,
			108
		],
		[
			10,
			74,
			46,
			1,
			75,
			47
		],
		[
			1,
			50,
			22,
			15,
			51,
			23
		],
		[
			2,
			42,
			14,
			17,
			43,
			15
		],
		[
			5,
			150,
			120,
			1,
			151,
			121
		],
		[
			9,
			69,
			43,
			4,
			70,
			44
		],
		[
			17,
			50,
			22,
			1,
			51,
			23
		],
		[
			2,
			42,
			14,
			19,
			43,
			15
		],
		[
			3,
			141,
			113,
			4,
			142,
			114
		],
		[
			3,
			70,
			44,
			11,
			71,
			45
		],
		[
			17,
			47,
			21,
			4,
			48,
			22
		],
		[
			9,
			39,
			13,
			16,
			40,
			14
		],
		[
			3,
			135,
			107,
			5,
			136,
			108
		],
		[
			3,
			67,
			41,
			13,
			68,
			42
		],
		[
			15,
			54,
			24,
			5,
			55,
			25
		],
		[
			15,
			43,
			15,
			10,
			44,
			16
		],
		[
			4,
			144,
			116,
			4,
			145,
			117
		],
		[
			17,
			68,
			42
		],
		[
			17,
			50,
			22,
			6,
			51,
			23
		],
		[
			19,
			46,
			16,
			6,
			47,
			17
		],
		[
			2,
			139,
			111,
			7,
			140,
			112
		],
		[
			17,
			74,
			46
		],
		[
			7,
			54,
			24,
			16,
			55,
			25
		],
		[
			34,
			37,
			13
		],
		[
			4,
			151,
			121,
			5,
			152,
			122
		],
		[
			4,
			75,
			47,
			14,
			76,
			48
		],
		[
			11,
			54,
			24,
			14,
			55,
			25
		],
		[
			16,
			45,
			15,
			14,
			46,
			16
		],
		[
			6,
			147,
			117,
			4,
			148,
			118
		],
		[
			6,
			73,
			45,
			14,
			74,
			46
		],
		[
			11,
			54,
			24,
			16,
			55,
			25
		],
		[
			30,
			46,
			16,
			2,
			47,
			17
		],
		[
			8,
			132,
			106,
			4,
			133,
			107
		],
		[
			8,
			75,
			47,
			13,
			76,
			48
		],
		[
			7,
			54,
			24,
			22,
			55,
			25
		],
		[
			22,
			45,
			15,
			13,
			46,
			16
		],
		[
			10,
			142,
			114,
			2,
			143,
			115
		],
		[
			19,
			74,
			46,
			4,
			75,
			47
		],
		[
			28,
			50,
			22,
			6,
			51,
			23
		],
		[
			33,
			46,
			16,
			4,
			47,
			17
		],
		[
			8,
			152,
			122,
			4,
			153,
			123
		],
		[
			22,
			73,
			45,
			3,
			74,
			46
		],
		[
			8,
			53,
			23,
			26,
			54,
			24
		],
		[
			12,
			45,
			15,
			28,
			46,
			16
		],
		[
			3,
			147,
			117,
			10,
			148,
			118
		],
		[
			3,
			73,
			45,
			23,
			74,
			46
		],
		[
			4,
			54,
			24,
			31,
			55,
			25
		],
		[
			11,
			45,
			15,
			31,
			46,
			16
		],
		[
			7,
			146,
			116,
			7,
			147,
			117
		],
		[
			21,
			73,
			45,
			7,
			74,
			46
		],
		[
			1,
			53,
			23,
			37,
			54,
			24
		],
		[
			19,
			45,
			15,
			26,
			46,
			16
		],
		[
			5,
			145,
			115,
			10,
			146,
			116
		],
		[
			19,
			75,
			47,
			10,
			76,
			48
		],
		[
			15,
			54,
			24,
			25,
			55,
			25
		],
		[
			23,
			45,
			15,
			25,
			46,
			16
		],
		[
			13,
			145,
			115,
			3,
			146,
			116
		],
		[
			2,
			74,
			46,
			29,
			75,
			47
		],
		[
			42,
			54,
			24,
			1,
			55,
			25
		],
		[
			23,
			45,
			15,
			28,
			46,
			16
		],
		[
			17,
			145,
			115
		],
		[
			10,
			74,
			46,
			23,
			75,
			47
		],
		[
			10,
			54,
			24,
			35,
			55,
			25
		],
		[
			19,
			45,
			15,
			35,
			46,
			16
		],
		[
			17,
			145,
			115,
			1,
			146,
			116
		],
		[
			14,
			74,
			46,
			21,
			75,
			47
		],
		[
			29,
			54,
			24,
			19,
			55,
			25
		],
		[
			11,
			45,
			15,
			46,
			46,
			16
		],
		[
			13,
			145,
			115,
			6,
			146,
			116
		],
		[
			14,
			74,
			46,
			23,
			75,
			47
		],
		[
			44,
			54,
			24,
			7,
			55,
			25
		],
		[
			59,
			46,
			16,
			1,
			47,
			17
		],
		[
			12,
			151,
			121,
			7,
			152,
			122
		],
		[
			12,
			75,
			47,
			26,
			76,
			48
		],
		[
			39,
			54,
			24,
			14,
			55,
			25
		],
		[
			22,
			45,
			15,
			41,
			46,
			16
		],
		[
			6,
			151,
			121,
			14,
			152,
			122
		],
		[
			6,
			75,
			47,
			34,
			76,
			48
		],
		[
			46,
			54,
			24,
			10,
			55,
			25
		],
		[
			2,
			45,
			15,
			64,
			46,
			16
		],
		[
			17,
			152,
			122,
			4,
			153,
			123
		],
		[
			29,
			74,
			46,
			14,
			75,
			47
		],
		[
			49,
			54,
			24,
			10,
			55,
			25
		],
		[
			24,
			45,
			15,
			46,
			46,
			16
		],
		[
			4,
			152,
			122,
			18,
			153,
			123
		],
		[
			13,
			74,
			46,
			32,
			75,
			47
		],
		[
			48,
			54,
			24,
			14,
			55,
			25
		],
		[
			42,
			45,
			15,
			32,
			46,
			16
		],
		[
			20,
			147,
			117,
			4,
			148,
			118
		],
		[
			40,
			75,
			47,
			7,
			76,
			48
		],
		[
			43,
			54,
			24,
			22,
			55,
			25
		],
		[
			10,
			45,
			15,
			67,
			46,
			16
		],
		[
			19,
			148,
			118,
			6,
			149,
			119
		],
		[
			18,
			75,
			47,
			31,
			76,
			48
		],
		[
			34,
			54,
			24,
			34,
			55,
			25
		],
		[
			20,
			45,
			15,
			61,
			46,
			16
		]
	], t = function(e, t) {
		let n = {};
		return n.totalCount = e, n.dataCount = t, n;
	}, n = {}, r = function(t, n) {
		switch (n) {
			case cl.L: return e[(t - 1) * 4 + 0];
			case cl.M: return e[(t - 1) * 4 + 1];
			case cl.Q: return e[(t - 1) * 4 + 2];
			case cl.H: return e[(t - 1) * 4 + 3];
			default: return;
		}
	};
	return n.getRSBlocks = function(e, n) {
		let i = r(e, n);
		if (i === void 0) throw "bad rs block @ typeNumber:" + e + "/errorCorrectionLevel:" + n;
		let a = i.length / 3, o = [];
		for (let e = 0; e < a; e += 1) {
			let n = i[e * 3 + 0], r = i[e * 3 + 1], a = i[e * 3 + 2];
			for (let e = 0; e < n; e += 1) o.push(t(r, a));
		}
		return o;
	}, n;
}(), ml = function() {
	let e = [], t = 0, n = {};
	return n.getBuffer = function() {
		return e;
	}, n.getAt = function(t) {
		let n = Math.floor(t / 8);
		return (e[n] >>> 7 - t % 8 & 1) == 1;
	}, n.put = function(e, t) {
		for (let r = 0; r < t; r += 1) n.putBit((e >>> t - r - 1 & 1) == 1);
	}, n.getLengthInBits = function() {
		return t;
	}, n.putBit = function(n) {
		let r = Math.floor(t / 8);
		e.length <= r && e.push(0), n && (e[r] |= 128 >>> t % 8), t += 1;
	}, n;
}, hl = function(e) {
	let t = sl.MODE_NUMBER, n = e, r = {};
	r.getMode = function() {
		return t;
	}, r.getLength = function(e) {
		return n.length;
	}, r.write = function(e) {
		let t = n, r = 0;
		for (; r + 2 < t.length;) e.put(i(t.substring(r, r + 3)), 10), r += 3;
		r < t.length && (t.length - r == 1 ? e.put(i(t.substring(r, r + 1)), 4) : t.length - r == 2 && e.put(i(t.substring(r, r + 2)), 7));
	};
	let i = function(e) {
		let t = 0;
		for (let n = 0; n < e.length; n += 1) t = t * 10 + a(e.charAt(n));
		return t;
	}, a = function(e) {
		if ("0" <= e && e <= "9") return e.charCodeAt(0) - 48;
		throw "illegal char :" + e;
	};
	return r;
}, gl = function(e) {
	let t = sl.MODE_ALPHA_NUM, n = e, r = {};
	r.getMode = function() {
		return t;
	}, r.getLength = function(e) {
		return n.length;
	}, r.write = function(e) {
		let t = n, r = 0;
		for (; r + 1 < t.length;) e.put(i(t.charAt(r)) * 45 + i(t.charAt(r + 1)), 11), r += 2;
		r < t.length && e.put(i(t.charAt(r)), 6);
	};
	let i = function(e) {
		if ("0" <= e && e <= "9") return e.charCodeAt(0) - 48;
		if ("A" <= e && e <= "Z") return e.charCodeAt(0) - 65 + 10;
		switch (e) {
			case " ": return 36;
			case "$": return 37;
			case "%": return 38;
			case "*": return 39;
			case "+": return 40;
			case "-": return 41;
			case ".": return 42;
			case "/": return 43;
			case ":": return 44;
			default: throw "illegal char :" + e;
		}
	};
	return r;
}, _l = function(e) {
	let t = sl.MODE_8BIT_BYTE, n = ol.stringToBytes(e), r = {};
	return r.getMode = function() {
		return t;
	}, r.getLength = function(e) {
		return n.length;
	}, r.write = function(e) {
		for (let t = 0; t < n.length; t += 1) e.put(n[t], 8);
	}, r;
}, vl = function(e) {
	let t = sl.MODE_KANJI, n = ol.stringToBytes;
	(function(e, t) {
		let r = n(e);
		if (r.length != 2 || (r[0] << 8 | r[1]) != t) throw "sjis not supported.";
	})("友", 38726);
	let r = n(e), i = {};
	return i.getMode = function() {
		return t;
	}, i.getLength = function(e) {
		return ~~(r.length / 2);
	}, i.write = function(e) {
		let t = r, n = 0;
		for (; n + 1 < t.length;) {
			let r = (255 & t[n]) << 8 | 255 & t[n + 1];
			if (33088 <= r && r <= 40956) r -= 33088;
			else if (57408 <= r && r <= 60351) r -= 49472;
			else throw "illegal char at " + (n + 1) + "/" + r;
			r = (r >>> 8 & 255) * 192 + (r & 255), e.put(r, 13), n += 2;
		}
		if (n < t.length) throw "illegal char at " + (n + 1);
	}, i;
}, yl = function() {
	let e = [], t = {};
	return t.writeByte = function(t) {
		e.push(t & 255);
	}, t.writeShort = function(e) {
		t.writeByte(e), t.writeByte(e >>> 8);
	}, t.writeBytes = function(e, n, r) {
		n = n || 0, r = r || e.length;
		for (let i = 0; i < r; i += 1) t.writeByte(e[i + n]);
	}, t.writeString = function(e) {
		for (let n = 0; n < e.length; n += 1) t.writeByte(e.charCodeAt(n));
	}, t.toByteArray = function() {
		return e;
	}, t.toString = function() {
		let t = "";
		t += "[";
		for (let n = 0; n < e.length; n += 1) n > 0 && (t += ","), t += e[n];
		return t += "]", t;
	}, t;
}, bl = function() {
	let e = 0, t = 0, n = 0, r = "", i = {}, a = function(e) {
		r += String.fromCharCode(o(e & 63));
	}, o = function(e) {
		if (e < 0) throw "n:" + e;
		if (e < 26) return 65 + e;
		if (e < 52) return 97 + (e - 26);
		if (e < 62) return 48 + (e - 52);
		if (e == 62) return 43;
		if (e == 63) return 47;
		throw "n:" + e;
	};
	return i.writeByte = function(r) {
		for (e = e << 8 | r & 255, t += 8, n += 1; t >= 6;) a(e >>> t - 6), t -= 6;
	}, i.flush = function() {
		if (t > 0 && (a(e << 6 - t), e = 0, t = 0), n % 3 != 0) {
			let e = 3 - n % 3;
			for (let t = 0; t < e; t += 1) r += "=";
		}
	}, i.toString = function() {
		return r;
	}, i;
}, xl = function(e) {
	let t = e, n = 0, r = 0, i = 0, a = {};
	a.read = function() {
		for (; i < 8;) {
			if (n >= t.length) {
				if (i == 0) return -1;
				throw "unexpected end of file./" + i;
			}
			let e = t.charAt(n);
			if (n += 1, e == "=") return i = 0, -1;
			e.match(/^\s$/) || (r = r << 6 | o(e.charCodeAt(0)), i += 6);
		}
		let e = r >>> i - 8 & 255;
		return i -= 8, e;
	};
	let o = function(e) {
		if (65 <= e && e <= 90) return e - 65;
		if (97 <= e && e <= 122) return e - 97 + 26;
		if (48 <= e && e <= 57) return e - 48 + 52;
		if (e == 43) return 62;
		if (e == 47) return 63;
		throw "c:" + e;
	};
	return a;
}, Sl = function(e, t) {
	let n = e, r = t, i = Array(e * t), a = {};
	a.setPixel = function(e, t, r) {
		i[t * n + e] = r;
	}, a.write = function(e) {
		e.writeString("GIF87a"), e.writeShort(n), e.writeShort(r), e.writeByte(128), e.writeByte(0), e.writeByte(0), e.writeByte(0), e.writeByte(0), e.writeByte(0), e.writeByte(255), e.writeByte(255), e.writeByte(255), e.writeString(","), e.writeShort(0), e.writeShort(0), e.writeShort(n), e.writeShort(r), e.writeByte(0);
		let t = s(2);
		e.writeByte(2);
		let i = 0;
		for (; t.length - i > 255;) e.writeByte(255), e.writeBytes(t, i, 255), i += 255;
		e.writeByte(t.length - i), e.writeBytes(t, i, t.length - i), e.writeByte(0), e.writeString(";");
	};
	let o = function(e) {
		let t = e, n = 0, r = 0, i = {};
		return i.write = function(e, i) {
			if (e >>> i) throw "length over";
			for (; n + i >= 8;) t.writeByte(255 & (e << n | r)), i -= 8 - n, e >>>= 8 - n, r = 0, n = 0;
			r = e << n | r, n += i;
		}, i.flush = function() {
			n > 0 && t.writeByte(r);
		}, i;
	}, s = function(e) {
		let t = 1 << e, n = (1 << e) + 1, r = e + 1, a = c();
		for (let e = 0; e < t; e += 1) a.add(String.fromCharCode(e));
		a.add(String.fromCharCode(t)), a.add(String.fromCharCode(n));
		let s = yl(), l = o(s);
		l.write(t, r);
		let u = 0, d = String.fromCharCode(i[u]);
		for (u += 1; u < i.length;) {
			let e = String.fromCharCode(i[u]);
			u += 1, a.contains(d + e) ? d += e : (l.write(a.indexOf(d), r), a.size() < 4095 && (a.size() == 1 << r && (r += 1), a.add(d + e)), d = e);
		}
		return l.write(a.indexOf(d), r), l.write(n, r), l.flush(), s.toByteArray();
	}, c = function() {
		let e = {}, t = 0, n = {};
		return n.add = function(r) {
			if (n.contains(r)) throw "dup key:" + r;
			e[r] = t, t += 1;
		}, n.size = function() {
			return t;
		}, n.indexOf = function(t) {
			return e[t];
		}, n.contains = function(t) {
			return e[t] !== void 0;
		}, n;
	};
	return a;
}, Cl = function(e, t, n) {
	let r = Sl(e, t);
	for (let i = 0; i < t; i += 1) for (let t = 0; t < e; t += 1) r.setPixel(t, i, n(t, i));
	let i = yl();
	r.write(i);
	let a = bl(), o = i.toByteArray();
	for (let e = 0; e < o.length; e += 1) a.writeByte(o[e]);
	return a.flush(), "data:image/gif;base64," + a;
};
ol.stringToBytes;
// src/lib/transfer/anywhere.ts
var wl = "https://xxbobbytherizzlerxx.github.io/corvo-transfer/", Tl = "com.corvo.app/transfer/v1", El = [
	"wss://fanfares.nostr1.com",
	"wss://nostr-01.yakihonne.com",
	"wss://nostr.azzamo.net",
	"wss://no.str.cr",
	"wss://bucket.coracle.social",
	"wss://nostr.hifish.org",
	"wss://relay.primal.net",
	"wss://relay.snort.social"
], Dl = {
	list: "list",
	want: "want",
	file: "file"
}, Ol = 1073741824;
function kl(e) {
	return Array.from(crypto.getRandomValues(new Uint8Array(e)), (e) => "abcdefghijkmnopqrstuvwxyz23456789"[e % 33]).join("");
}
function Al(e) {
	let t = /^#?([a-z0-9]{6,40})\.([a-z0-9]{8,64})$/.exec(e.trim());
	return t ? {
		room: t[1],
		password: t[2]
	} : null;
}
function jl(e, t) {
	return `${wl}#d.${e}.${t}`;
}
function Ml(e) {
	let t = /^#?d\.([a-z0-9]{6,40})\.([a-z0-9]{8,64})$/.exec(e.trim());
	return t ? {
		room: t[1],
		password: t[2]
	} : null;
}
function Nl(e, t = !1) {
	return /iPad/.test(e) || t ? "iPad" : /iPhone/.test(e) ? "iPhone" : /Android/.test(e) ? /Mobile/.test(e) ? "Android phone" : "Android tablet" : /CrOS/.test(e) ? "Chromebook" : /Macintosh|Mac OS X/.test(e) ? "Mac" : /Windows/.test(e) ? "Windows PC" : /Linux/.test(e) ? "Linux PC" : "Device";
}
// transfer-web/app.ts
var $ = (e) => document.getElementById(e), Pl = (e) => e.replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), Fl = (e) => e < 1024 ? `${e} B` : e < 1048576 ? `${(e / 1024).toFixed(0)} KB` : e < 1073741824 ? `${(e / 1048576).toFixed(1)} MB` : `${(e / 1073741824).toFixed(2)} GB`, Il = (e) => (e.split(".").pop() || "").toLowerCase(), Ll = [
	"jpg",
	"jpeg",
	"png",
	"gif",
	"webp",
	"heic",
	"bmp",
	"avif"
], Rl = [
	"mp4",
	"mov",
	"mkv",
	"webm",
	"avi",
	"m4v"
], zl = (e) => {
	let t = Il(e);
	return Ll.includes(t) ? "🖼️" : Rl.includes(t) ? "🎬" : [
		"mp3",
		"wav",
		"m4a",
		"flac",
		"ogg"
	].includes(t) ? "🎵" : t === "pdf" ? "📕" : [
		"zip",
		"rar",
		"7z"
	].includes(t) ? "🗜️" : [
		"doc",
		"docx",
		"txt",
		"md",
		"rtf"
	].includes(t) ? "📄" : [
		"xls",
		"xlsx",
		"csv"
	].includes(t) ? "📊" : [
		"exe",
		"msi",
		"apk"
	].includes(t) ? "📦" : "📁";
}, Bl = /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1, Vl = /iPhone|iPad/.test(navigator.userAgent) || Bl, Hl = Nl(navigator.userAgent, Bl), Ul = matchMedia("(display-mode: standalone)").matches || navigator.standalone === !0;
function Wl(e, t) {
	$("status").textContent = e, $("dot").className = `dot${t === "wait" ? "" : ` ${t}`}`;
}
function Gl(e) {
	$("help").innerHTML = e, $("help").classList.toggle("show", !!e);
}
function Kl(e, t, n) {
	let r = document.createElement("div");
	return r.className = "file", r.innerHTML = `<div class="icon">${zl(e)}</div><div class="meta"><div class="name">${Pl(e)}</div><div class="size">${Fl(t)} · <span class="st">${Pl(n)}</span></div><div class="bar"><i></i></div></div>`, {
		row: r,
		st: r.querySelector(".st"),
		bar: r.querySelector(".bar i"),
		iconBox: r.querySelector(".icon")
	};
}
async function ql(e) {
	let t = Ll.includes(Il(e.name)) || Rl.includes(Il(e.name)), n = navigator;
	if (t && /iPhone|iPad|Android/.test(navigator.userAgent + (Bl ? " iPad" : "")) && n.canShare?.({ files: [e] })) try {
		await navigator.share({ files: [e] });
		return;
	} catch (e) {
		if (e.name === "AbortError") return;
	}
	let r = URL.createObjectURL(e), i = document.createElement("a");
	i.href = r, i.download = e.name, document.body.append(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 6e4);
}
var Jl = Al(location.hash), Yl = Ml(location.hash), Xl = "corvo.transfer.device-room";
(Jl || Yl) && history.replaceState(null, "", location.pathname), Jl ? nu(Jl) : Zl();
async function Zl() {
	let e = await tu();
	if (e.length) return eu(Ql(), e);
	if (Yl) return eu(Yl);
	try {
		let e = JSON.parse(sessionStorage.getItem(Xl) ?? "");
		if (e.room && e.password) return eu(e);
	} catch {}
	$l();
}
function Ql() {
	return {
		room: kl(12),
		password: kl(20)
	};
}
function $l() {
	$("home").hidden = !1, $("subline").hidden = !0, $("start").onclick = () => {
		$("home").hidden = !0, $("subline").hidden = !1, eu(Ql());
	};
	let e = $("paste");
	e.oninput = () => {
		let t = e.value.trim().replace(/^[^#]*/, "");
		(Ml(t) || Al(t)) && (location.hash = t, location.reload());
	};
}
function eu(e, t = []) {
	sessionStorage.setItem(Xl, JSON.stringify(e)), $("device").hidden = !1, $("subline").hidden = !1, $("title").textContent = "Corvo Transfer", Wl("Waiting for another device…", "wait");
	let n = jl(e.room, e.password), r = ol(0, "M");
	r.addData(n), r.make(), $("qr").innerHTML = r.createSvgTag({
		cellSize: 4,
		margin: 0,
		scalable: !0
	});
	let i = $("copy");
	i.onclick = async () => {
		try {
			await navigator.clipboard.writeText(n), i.textContent = "Copied ✓";
		} catch {
			prompt("Copy this link:", n);
		}
		setTimeout(() => i.textContent = "Copy link", 2e3);
	}, navigator.share && ($("share").hidden = !1, $("share").onclick = () => navigator.share({
		title: "Corvo Transfer",
		text: "Open this to swap files with me:",
		url: n
	}).catch(() => {}));
	let a = !1;
	$("add").onclick = () => {
		a = !a, u();
	};
	let o = il({
		appId: Tl,
		password: e.password,
		relayConfig: { urls: El }
	}, `d${e.room}`), s = o.makeAction("hi"), c = o.makeAction(Dl.file), l = /* @__PURE__ */ new Map();
	function u() {
		let e = l.size;
		$("invite").hidden = e > 0 && !a, $("room-peers").hidden = e === 0, $("add").textContent = a ? "Done" : "Add another device", $("peers").innerHTML = [...l.values()].map((e) => `<span class="peer">● ${Pl(e)}</span>`).join(""), $("dpick").disabled = e === 0, e ? (Gl(""), Wl(`Connected to ${e === 1 ? [...l.values()][0] : `${e} devices`}, encrypted`, "on")) : Wl("Waiting for another device…", "wait");
	}
	let d = 0, f = () => {
		clearTimeout(d), d = window.setTimeout(() => {
			l.size || Gl("Nothing has joined yet. Scan the code with the other device (its camera app works), or send it the link. If it scanned and still can't connect, one of the networks blocks direct connections (some school, work and mobile ones do): try both on the <b>same Wi-Fi</b>.");
		}, 4e4);
	};
	f(), o.onPeerJoin(({ peerId: e }) => {
		if (l.set(e, "Device"), s.send({ name: Hl }, { target: e }).catch(() => {}), u(), t.length) {
			let n = t;
			t = [];
			for (let t of n) p(t, [e]);
		}
	}), o.onPeerLeave(({ peerId: e }) => {
		l.delete(e), u(), l.size || f();
	}), s.onMessage(({ name: e }, { peerId: t }) => {
		l.has(t) && l.set(t, String(e).slice(0, 40) || "Device"), u();
	});
	async function p(e, t = [...l.keys()]) {
		let { row: n, st: r, bar: i } = Kl(e.name, e.size, "sending…");
		if ($("dups").prepend(n), e.size > 1073741824) {
			r.className = "bad", r.textContent = "too big (1 GB at most this way)";
			return;
		}
		if (!t.length) {
			r.textContent = "waiting for a device…";
			return;
		}
		let a = t.map((e) => l.get(e) ?? "Device");
		try {
			await c.send(e, {
				target: t,
				metadata: {
					name: e.name,
					size: e.size,
					id: Math.floor(Math.random() * 2 ** 31)
				},
				onProgress: (e) => i.style.width = `${(e * 100).toFixed(1)}%`
			}), i.style.width = "100%", r.className = "ok", r.textContent = `sent to ${a.length === 1 ? a[0] : `${a.length} devices`} ✓`;
		} catch {
			r.className = "bad", r.textContent = "didn't arrive";
		}
	}
	for (let e of t) {
		let { row: t, st: n } = Kl(e.name, e.size, "ready: sends when a device joins");
		n.className = "ok", $("dups").prepend(t);
	}
	$("dpick").onclick = () => $("dinput").click(), $("dinput").onchange = async () => {
		let e = $("dinput"), t = [...e.files ?? []];
		e.value = "";
		for (let e of t) await p(e);
	};
	let m = /* @__PURE__ */ new Map(), h = (e, t) => `${e}:${t?.id ?? t?.name ?? "?"}`, g = (e, t) => {
		let n = h(e, t), r = m.get(n);
		return r || (r = Kl(t?.name ?? "file", t?.size ?? 0, `from ${l.get(e) ?? "a device"}…`), m.set(n, r), $("recv-box").hidden = !1, $("recv").prepend(r.row)), r;
	};
	c.onReceive(({ byteLength: e }) => e <= Ol), c.onReceiveProgress((e, { peerId: t, metadata: n }) => {
		let r = g(t, n);
		r.bar.style.width = `${(e * 100).toFixed(1)}%`;
	}), c.onMessage((e, { peerId: t, metadata: n }) => {
		let r = n, i = g(t, r);
		m.delete(h(t, r));
		let a = r?.name ?? "file", o = e instanceof Blob ? e : new Blob([e]), s = new File([o], a, { type: o.type });
		if (i.bar.style.width = "100%", i.bar.parentElement.hidden = !0, i.st.className = "ok", i.st.textContent = `from ${l.get(t) ?? "a device"} ✓`, Ll.includes(Il(a)) && Il(a) !== "heic") {
			let e = new Image();
			e.alt = "", e.src = URL.createObjectURL(s), i.iconBox.textContent = "", i.iconBox.append(e);
		}
		let c = document.createElement("button");
		c.className = "get", c.textContent = "Save", c.onclick = async () => {
			await ql(s), c.classList.add("done"), c.textContent = "Saved";
		}, i.row.append(c), !/iPhone|iPad|Android/.test(navigator.userAgent) && !Bl && (ql(s), c.classList.add("done"), c.textContent = "Again");
	}), u();
}
async function tu() {
	if (!new URLSearchParams(location.search).has("shared") || !("caches" in window)) return [];
	history.replaceState(null, "", location.pathname);
	let e = [];
	try {
		let t = await caches.open("corvo-share");
		for (let n of await t.keys()) {
			let r = await t.match(n);
			if (r) {
				let t = await r.blob();
				e.push(new File([t], decodeURIComponent(r.headers.get("x-name") ?? "file"), { type: t.type }));
			}
			await t.delete(n);
		}
	} catch {}
	return e;
}
function nu(e) {
	$("pcmode").hidden = !1, Wl("Connecting to your PC…", "wait");
	let t = il({
		appId: Tl,
		password: e.password,
		relayConfig: { urls: El }
	}, e.room), n = t.makeAction(Dl.list), r = t.makeAction(Dl.want), i = t.makeAction(Dl.file), a = "", o = [], s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map(), l = setTimeout(() => {
		a || (Wl("Can't reach your PC yet", "off"), Gl("Still trying. Check that <b>Corvo is open</b> on your PC and Transfer is still sharing. Some school, work or mobile networks block direct connections: if it never connects, put both devices on the <b>same Wi-Fi</b> and use the Same Wi-Fi code."));
	}, 25e3);
	t.onPeerLeave(({ peerId: e }) => {
		e === a && (a = "", Wl("Your PC disconnected", "off"), $("pick").disabled = !0, Gl("Waiting for it to come back: keep this page open. If Corvo stopped sharing, press Share in Transfer again (the same code still works)."));
	}), n.onMessage((e, { peerId: t }) => {
		a = t, clearTimeout(l), Gl(""), Wl("Connected, directly and encrypted", "on"), $("pick").disabled = !1, o = e, u();
	});
	function u() {
		$("files").innerHTML = o.length ? o.map((e) => {
			let t = e.size > Ol;
			return `<div class="file"><div class="icon">${zl(e.name)}</div><div class="meta"><div class="name">${Pl(e.name)}</div><div class="size">${Fl(e.size)}${t ? " · too big for this way: use the same Wi-Fi" : ""}</div><div class="bar" hidden><i></i></div></div><button class="get${s.has(e.id) ? " done" : ""}" data-id="${e.id}"${t ? " disabled" : ""}>${s.has(e.id) ? "Again" : "Download"}</button></div>`;
		}).join("") : "<div class=\"empty\">Nothing shared yet. Drop files into Corvo's Transfer tab on your PC.</div>", $("all").hidden = o.filter((e) => e.size <= Ol).length < 2;
	}
	function d(e) {
		let t = document.querySelector(`button.get[data-id="${e}"]`);
		a && t && !c.has(e) && (c.set(e, t), t.disabled = !0, t.textContent = "…", r.send({ id: e }, { target: a }).catch(() => {
			c.delete(e), t.disabled = !1, t.textContent = "Retry";
		}));
	}
	$("files").addEventListener("click", (e) => {
		let t = e.target.closest("button.get");
		t && d(Number(t.dataset.id));
	}), $("all").addEventListener("click", () => o.filter((e) => e.size <= Ol).forEach((e) => d(e.id))), i.onReceiveProgress((e, { metadata: t }) => {
		let n = t, r = n?.id === void 0 ? void 0 : c.get(n.id), i = r?.parentElement?.querySelector(".bar");
		r && i && (i.hidden = !1, i.firstElementChild.style.width = `${(e * 100).toFixed(1)}%`, r.textContent = `${Math.round(e * 100)}%`);
	}), i.onMessage(async (e, { metadata: t }) => {
		let n = t;
		if (!n) return;
		let r = e instanceof Blob ? e : new Blob([e]), i = URL.createObjectURL(r), a = document.createElement("a");
		if (a.href = i, a.download = n.name, document.body.append(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(i), 6e4), n.id !== void 0) {
			s.add(n.id);
			let e = c.get(n.id);
			c.delete(n.id), e && (e.disabled = !1, e.classList.add("done"), e.textContent = "Again");
		}
	}), $("pick").onclick = () => $("input").click(), $("input").onchange = async () => {
		let e = $("input"), t = [...e.files ?? []];
		e.value = "";
		for (let e of t) await f(e);
	};
	async function f(e) {
		let { row: t, st: n, bar: r } = Kl(e.name, e.size, "sending…");
		if ($("ups").prepend(t), e.size > 1073741824) n.className = "bad", n.textContent = "too big for this way: use the same Wi-Fi";
		else if (!a) n.className = "bad", n.textContent = "not connected to your PC";
		else try {
			await i.send(e, {
				target: a,
				metadata: {
					name: e.name,
					size: e.size
				},
				onProgress: (e) => r.style.width = `${(e * 100).toFixed(1)}%`
			}), r.style.width = "100%", n.className = "ok", n.textContent = "on your PC ✓";
		} catch {
			n.className = "bad", n.textContent = "didn't arrive";
		}
	}
}
if (Vl && ($("tip").textContent = "On iPhone, downloads go to the Files app (Downloads); photos can be saved to Photos. Files go straight between your devices, encrypted."), "serviceWorker" in navigator && navigator.serviceWorker.register("./sw.js").catch(() => {}), !Ul) {
	let e = null;
	addEventListener("beforeinstallprompt", (t) => {
		t.preventDefault(), e = t, $("install").hidden = !1;
	}), $("install-btn").onclick = async () => {
		e && (await e.prompt(), (await e.userChoice).outcome === "accepted" && ($("install").hidden = !0), e = null);
	}, addEventListener("appinstalled", () => $("install").hidden = !0), Vl && ($("install").hidden = !1, $("install-btn").hidden = !0, $("install-text").innerHTML = "<b>Get the app</b>Tap <b style=\"display:inline\">Share</b> ⬆️ below, then <b style=\"display:inline\">Add to Home Screen</b>.");
}
