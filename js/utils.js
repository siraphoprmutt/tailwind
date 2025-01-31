// Helper Function ให้ document.querySelector() สั้นลง
const $ = (selector) => document.querySelector(selector);

// ✅ Helper Functions สำหรับ LocalStorage
const setLocalStorage = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));
const removeLocalStorage = (...keys) =>
  keys.forEach((key) => localStorage.removeItem(key));
const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key));

const preview = (data) => {
  Object.entries(data).forEach(([selector, value]) => {
    const element = $(selector);
    if (element) {
      element.textContent = JSON.stringify(value, null, 2);
    }
  });
};

// 📌 ฟังก์ชันตรวจสอบสิทธิ์ผู้ใช้
const hasRole = (user, ...requiredRoles) => {
  if (!user?.roles) return false; // ถ้า user ไม่มี roles ให้ return false
  if (requiredRoles.length === 0) return true;
  return requiredRoles.some((role) => user.roles.includes(role));
};

// 📌 ฟังก์ชันกรองเมนูตามสิทธิ์ของ user
const getAccessibleRoutes = (user, routes) => {
  return routes.filter((route) => {
    if (route.meta.public && !route.meta.hide) return true; // เมนูที่เป็น public ใช้ได้ทุกคน
    if (
      route.meta.authenticated &&
      hasRole(user, ...(route.meta.roles || []))
    ) {
      return true; // ถ้าต้องการ authenticated และ user มี role ตรงกับที่กำหนด
    }
    return false;
  });
};

const filterRoutes = (user, routes) => {
  return routes.filter((route) => {
    const { public: isPublic, authenticated, roles } = route.meta;

    if (isPublic) return true; // ✅ เมนูสาธารณะ (ทุกคนเข้าถึงได้)
    if (authenticated && !user?.roles) return false; // ❌ ต้องล็อกอิน แต่ไม่มี role
    if (roles && !hasRole(user, ...roles)) return false; // ❌ ตรวจสอบ role
    return true;
  });
};

// ✅ ฟังก์ชันแปลง Base64 → Base64URL ที่รองรับ Unicode
const base64UrlEncode = (str) => {
  const utf8Bytes = new TextEncoder().encode(str); // แปลงเป็น Uint8Array
  let binary = "";
  utf8Bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replace(/=/g, "") // ลบ '=' ที่ใช้ padding ออก
    .replace(/\+/g, "-") // แทนที่ '+' เป็น '-'
    .replace(/\//g, "_"); // แทนที่ '/' เป็น '_'
};

// ✅ ฟังก์ชันสร้าง Signature ด้วย HMAC SHA-256
const signHmacSha256 = async (message, secret) => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
};

// ✅ ฟังก์ชันสร้าง JWT พร้อม Signature
const signJwt = async (
  payload,
  secret = "my-secret-key",
  expiration = 3600
) => {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);

  // ✅ เพิ่มเวลาหมดอายุ
  const fullPayload = { ...payload, iat: now, exp: now + expiration };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  // ✅ สร้าง Signature
  const signature = await signHmacSha256(
    `${encodedHeader}.${encodedPayload}`,
    secret
  );

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// ✅ ฟังก์ชันถอดรหัส JWT (Decode)
const decodeJwt = (token) => {
  try {
    const [header, payload, signature] = token.split(".");
    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    const isExpired = decodedPayload.exp < Date.now() / 1000;

    return { payload: decodedPayload, isExpired };
  } catch (e) {
    return { payload: null, isExpired: true };
  }
};
