// 📌 ตัวแปรเก็บเส้นทางเมนู
let routes = [
  {
    path: "/",
    name: "home",
    title: "Home",
    icon: "fas fa-home",
    layout: "default",
    meta: { public: true },
  },
  {
    path: "/login/",
    name: "login",
    title: "Login",
    icon: "fas fa-sign-in-alt",
    layout: "default",
    meta: { public: true, authenticated: false, hide: true },
  },
  {
    path: "/register/",
    name: "register",
    title: "Register",
    icon: "fas fa-sign-out-alt",
    layout: "default",
    meta: { public: true, hide: true },
  },
  {
    path: "/about/",
    name: "about",
    title: "About",
    icon: "fas fa-info-circle",
    layout: "default",
    meta: { public: true },
  },
  {
    path: "/contact/",
    name: "contact",
    title: "Contact",
    icon: "fas fa-phone",
    layout: "default",
    meta: { public: true },
  },
  {
    path: "/services/",
    name: "services",
    title: "Services",
    icon: "fas fa-cogs",
    layout: "dashboard",
    meta: { public: false, authenticated: true, roles: ["admin"] },
    children: [],
  },
];

// ตรวจสอบว่า root มีค่าเริ่มต้นที่ถูกต้อง และไม่มี `/` ซ้ำซ้อน
const root = "/tailwind".replace(/\/$/, ""); // ตัด `/` ท้ายสุดออกถ้ามี

if (root !== "/") {
  routes = routes.map((route) => {
    let normalizedPath = route.path.replace(/^\/+/, ""); // ตัด `/` ที่ขึ้นต้นออก
    return {
      ...route,
      path: `${root}/${normalizedPath}`, // ป้องกัน `/` ซ้ำซ้อน
    };
  });
}

const router = (_path) => {
  if (typeof _path !== "string" || !_path.trim()) {
    console.warn("❌ ไม่พบ path หรือ path ไม่ถูกต้อง");
    return false;
  }

  let normalizedPath = _path.replace(/^\/+/, ""); // ตัด `/` ที่ขึ้นต้นออก
  const newPath = normalizedPath === "" ? root : `${root}/${normalizedPath}`;

  console.log(`🔄 กำลังนำทางไปที่: ${newPath}`);
  window.location.href = newPath;
  return true;
};
