// Dev-only mock of the konext API, for previewing the UI in a web browser.
// Active ONLY when: running on web + __DEV__ + signed in as the demo user (id -1).
// Real accounts and native builds always hit the real API.
import { Platform } from "react-native";

const API = "https://konext.vercel.app/api";
const DEMO_ID = -1;

const isDemoSession = () => {
  try {
    const raw = globalThis.localStorage?.getItem("@KOOP:user");
    return raw ? JSON.parse(raw)?.id === DEMO_ID : false;
  } catch {
    return false;
  }
};

// Hand-picked Unsplash photos so each listing gets a matching image.
const PHOTOS = {
  macbook: ["1517336714731-489689fd1ca8", "1496181133206-80ce9b88a853", "1517245386807-bb43f82c33c4"],
  tech: ["1531297484001-80022131f5a1"],
  iphone: ["1511707171634-5f897ff02aa9"],
  food: ["1555939594-58d7cb561ad1", "1504674900247-0877df9cc836"],
  wedding: ["1519741497674-611481863552"],
  fashion: ["1558769132-cb1aea458c5e"],
  car: ["1503376780353-7e6692767b70", "1552519507-da3b142c6e3d"],
  salon: ["1560066984-138dadb4c035"],
  beauty: ["1556228578-8c89e6adf883"],
  construction: ["1504307651254-35680f356dfd"],
};
const img = (kind, n = 1, w = 800) => {
  const list = PHOTOS[kind];
  return `https://images.unsplash.com/photo-${list[(n - 1) % list.length]}?w=${w}&q=70&auto=format&fit=crop`;
};
const avatar = (n) => `https://i.pravatar.cc/200?img=${n}`;

const MIN = 60 * 1000;
const ago = (ms) => {
  const m = Math.round(ms / MIN);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.round(h / 24)} j`;
};
const at = (msAgo) => new Date(Date.now() - msAgo).toISOString();

/* ───────────────────────── Seed data ───────────────────────── */
const USERS = [
  { id: 101, display_name: "Grace Mbuyi", shop_name: "Grace Couture", ville: "Kinshasa", phone: "0810000101", profile: avatar(47), shop_profile: img("fashion", 1, 1000), shop_desc: "Robes en pagne sur mesure, retouches et créations pour mariages et cérémonies.", shop_add: "Av. de la Libération 24, Gombe", shop_email: "grace@couture.cd", shop_whatsapp: "0810000101", shop_tiktok: "@gracecouture" },
  { id: 102, display_name: "Patrick Ilunga", shop_name: "Ilunga Tech", ville: "Lubumbashi", phone: "0820000102", profile: avatar(12), shop_profile: img("tech", 1, 1000), shop_desc: "Réparation smartphones et laptops, vente d'accessoires. Diagnostic gratuit.", shop_add: "Bd Kamanyola 88, Lubumbashi", shop_email: "contact@ilungatech.cd", shop_whatsapp: "0820000102" },
  { id: 103, display_name: "Sarah Kabila", shop_name: "Saveurs du Congo", ville: "Kinshasa", phone: "0830000103", profile: avatar(45), shop_profile: img("food", 2, 1000), shop_desc: "Traiteur pour événements : liboke, pondu, poulet mayo. Livraison à domicile.", shop_add: "Rue Kasa-Vubu 5, Bandalungwa", shop_whatsapp: "0830000103", shop_facebook: "SaveursDuCongo" },
  { id: 104, display_name: "Jonathan Tshibanda", shop_name: "BTP Tshibanda", ville: "Kolwezi", phone: "0840000104", profile: avatar(33), shop_profile: img("construction", 1, 1000), shop_desc: "Maçonnerie, carrelage et finitions. Devis sous 24 h.", shop_add: "Quartier Mutoshi, Kolwezi", shop_whatsapp: "0840000104" },
  { id: 105, display_name: "Esther Nzuzi", shop_name: "Glow Beauty", ville: "Goma", phone: "0850000105", profile: avatar(32), shop_profile: img("beauty", 1, 1000), shop_desc: "Soins du visage, tresses et maquillage professionnel.", shop_add: "Av. du Lac 12, Goma", shop_email: "hello@glowbeauty.cd", shop_whatsapp: "0850000105" },
  { id: 106, display_name: "David Mukendi", shop_name: "Auto Mukendi", ville: "Likasi", phone: "0860000106", profile: avatar(15), shop_profile: img("car", 2, 1000), shop_desc: "Pièces détachées et entretien toutes marques.", shop_add: "Route de Kambove, Likasi", shop_whatsapp: "0860000106" },
];

const SREQS = [
  { by: 102, label: "Je vends un MacBook Pro M3 14\" — 16 Go / 512 Go, comme neuf", desc: "Acheté en mars, sous garantie. Boîte et chargeur d'origine.", images: [img("macbook", 1), img("macbook", 2), img("macbook", 3)], links: "https://www.apple.com/macbook-pro/", t: 12 * MIN, comments: 4, views: 132, likes: 9 },
  { by: 103, label: "Traiteur disponible pour mariages ce week-end (jusqu'à 200 invités)", desc: "Menu congolais complet, service et vaisselle inclus.", images: [img("food", 1), img("food", 2)], t: 45 * MIN, comments: 7, views: 248, likes: 21 },
  { by: 101, label: "Besoin d'une couturière pour 6 robes de demoiselles d'honneur", images: [img("wedding", 1)], t: 2 * 60 * MIN, comments: 2, views: 87, likes: 5 },
  { by: 104, label: "Cherche électricien qualifié pour chantier à Kolwezi — 2 semaines", desc: "Installation complète d'un immeuble R+2. Rémunération à discuter.", images: [], t: 3 * 60 * MIN, comments: 3, views: 64, likes: 2 },
  { by: 106, label: "Toyota RAV4 2018 à vendre — 78 000 km, entretien à jour", images: [img("car", 1), img("car", 2)], t: 5 * 60 * MIN, comments: 11, views: 410, likes: 34 },
  { by: 105, label: "Promo tresses : -20 % toute la semaine au salon Glow Beauty", images: [img("salon", 1)], t: 8 * 60 * MIN, comments: 5, views: 176, likes: 18 },
  { by: 102, label: "iPhone 15 Pro 256 Go, bleu titane — échange possible", images: [img("iphone", 1)], t: 26 * 60 * MIN, comments: 6, views: 301, likes: 15 },
  { by: 103, label: "Recherche livreur à moto pour Bandalungwa et environs", images: [], t: 30 * 60 * MIN, comments: 1, views: 52, likes: 3 },
];

const userById = (id) => USERS.find((u) => u.id === id);

let nextId = 1000;
const db = {
  sreqs: SREQS.map((s, i) => ({
    id: 500 + i,
    user_id: s.by,
    label: s.label,
    desc: s.desc || "",
    images: s.images,
    links: s.links || "",
    created_at: at(s.t),
    comments_count: s.comments,
    views_count: s.views,
    likes_count: s.likes,
  })),
  comments: [],
  messages: [],
};

// Comments on a few listings and shops
const SAMPLE_COMMENTS = [
  "Toujours disponible ? Je suis très intéressé.",
  "Service impeccable, je recommande à 100 % 🙌",
  "Quel est votre meilleur prix ?",
  "Livraison possible à Limete ?",
  "Merci pour la rapidité, très professionnel.",
  "Envoyez-moi plus de photos svp.",
];
db.sreqs.forEach((s, i) => {
  for (let k = 0; k < Math.min(s.comments_count, 4); k++) {
    db.comments.push({
      id: nextId++,
      item_id: s.id,
      item_type: "sreq",
      posted_by_id: USERS[(i + k + 1) % USERS.length].id,
      comment: SAMPLE_COMMENTS[(i + k) % SAMPLE_COMMENTS.length],
      created_at: at((k + 1) * 20 * MIN),
    });
  }
});
USERS.forEach((u, i) => {
  for (let k = 0; k < 3; k++) {
    db.comments.push({
      id: nextId++,
      item_id: u.id,
      item_type: "shop",
      posted_by_id: USERS[(i + k + 1) % USERS.length].id,
      comment: SAMPLE_COMMENTS[(i + k + 2) % SAMPLE_COMMENTS.length],
      created_at: at((k + 2) * 3 * 60 * MIN),
    });
  }
});

// Conversations with the demo user
const THREADS = [
  [102, [["them", "Bonjour ! Le MacBook est toujours disponible 👍", 90], ["me", "Super, vous le laissez à combien ?", 80], ["them", "1 650 $, négociable si vous passez aujourd'hui.", 25]]],
  [103, [["me", "Bonjour, vous faites aussi les anniversaires ?", 300], ["them", "Oui bien sûr ! Pour combien de personnes ?", 240], ["me", "Environ 50.", 200], ["them", "Parfait, je vous envoie le menu ce soir 🍽️", 180]]],
  [105, [["them", "Votre rendez-vous de samedi 10 h est confirmé ✨", 1500]]],
  [106, [["me", "Le RAV4 a déjà eu un accident ?", 3000], ["them", "Non, jamais. Carnet d'entretien complet.", 2900]]],
];
THREADS.forEach(([uid, msgs]) =>
  msgs.forEach(([who, content, minAgo]) =>
    db.messages.push({
      id: nextId++,
      from_id: who === "me" ? DEMO_ID : uid,
      to_id: who === "me" ? uid : DEMO_ID,
      content,
      created_at: at(minAgo * MIN),
    })
  )
);

/* ───────────────────────── Serializers ───────────────────────── */
const withAgo = (o) => ({ ...o, timeAgo: ago(Date.now() - new Date(o.created_at).getTime()) });

const demoUser = () => {
  try {
    return JSON.parse(globalThis.localStorage.getItem("@KOOP:user")) || {};
  } catch {
    return {};
  }
};
const anyUser = (id) => (id === DEMO_ID ? { ...demoUser(), id: DEMO_ID } : userById(id));

const sreqOut = (s) => withAgo({ ...s, user_data: anyUser(s.user_id) || {} });

const shopsOut = () =>
  USERS.map((u) => ({
    ...u,
    items_count: db.sreqs.filter((s) => s.user_id === u.id).length,
    comments_count: db.comments.filter((c) => c.item_type === "shop" && c.item_id === u.id).length,
  }));

const sortNewest = (a, b) => new Date(b.created_at) - new Date(a.created_at);

const messagesOut = (userId) => {
  const byContact = {};
  db.messages
    .filter((m) => m.from_id === userId || m.to_id === userId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .forEach((m) => {
      const other = m.from_id === userId ? m.to_id : m.from_id;
      if (!byContact[other]) byContact[other] = [userById(other) || null];
      byContact[other].push(withAgo({ ...m, me: m.from_id === userId }));
    });
  return byContact;
};

/* ───────────────────────── Router ───────────────────────── */
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

async function handle(url, init = {}) {
  const u = new URL(url);
  const path = u.pathname.replace(/^\/api/, "");
  const q = Object.fromEntries(u.searchParams);
  const method = (init.method || "GET").toUpperCase();
  const body = init.body ? JSON.parse(init.body) : {};

  if (method === "GET" && path === "/shops") return json(shopsOut());

  if (method === "GET" && path === "/sreq") {
    const list = db.sreqs.filter((s) => !q.user_id || String(s.user_id) === q.user_id).sort(sortNewest);
    return json(list.map(sreqOut));
  }

  if (method === "GET" && path === "/items") return json([]);

  if (method === "GET" && path === "/comments") {
    const list = db.comments
      .filter((c) => String(c.item_id) === q.item_id && c.item_type === q.item_type)
      .sort(sortNewest)
      .map((c) => withAgo({ ...c, user_data: anyUser(c.posted_by_id) || {} }));
    return json(list);
  }

  if (method === "GET" && path === "/messages") return json(messagesOut(Number(q.user_id)));

  if (method === "POST" && path === "/messages/send") {
    const m = { id: nextId++, ...body, created_at: new Date().toISOString() };
    db.messages.push(m);
    return json(m);
  }

  if (method === "POST" && path === "/comments/post") {
    const c = { id: nextId++, ...body, created_at: new Date().toISOString() };
    db.comments.push(c);
    const s = db.sreqs.find((x) => x.id === body.item_id);
    if (s && body.item_type === "sreq") s.comments_count++;
    return json([c]);
  }

  if (method === "POST" && path === "/sreq/send") {
    const s = {
      id: nextId++,
      user_id: body.user_id ?? DEMO_ID,
      label: body.label,
      desc: body.desc || "",
      images: body.images || [],
      links: body.links || "",
      created_at: new Date().toISOString(),
      comments_count: 0,
      views_count: 0,
      likes_count: 0,
    };
    db.sreqs.push(s);
    return json(s);
  }

  if (path === "/sreq/remove") {
    db.sreqs = db.sreqs.filter((s) => String(s.id) !== q.item_id);
    return json({ ok: true });
  }

  return null; // unhandled → real network
}

if (Platform.OS === "web" && __DEV__ && typeof globalThis.fetch === "function") {
  const realFetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input?.url;
    if (url && url.startsWith(API) && isDemoSession()) {
      const res = await handle(url, init);
      if (res) {
        await new Promise((r) => setTimeout(r, 250 + Math.random() * 350)); // feel like a network
        return res;
      }
    }
    return realFetch(input, init);
  };
  console.log("[KOOP mock] Demo-session API mock installed (web dev only)");
}
