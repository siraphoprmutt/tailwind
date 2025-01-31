// 📌 ตัวแปรเก็บเส้นทางเมนู
const routes = [
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

const router = (_path) => {
  if (!_path) {
    console.warn("❌ ไม่พบ path");
    return false;
  }
  const path = _path === "/" ? "/tailwind/" : `/tailwind${_path}`;
  return (window.location.href = path);
};
