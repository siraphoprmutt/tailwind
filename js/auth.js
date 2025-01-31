// 📌 auth.js - จัดการ Login / Logout
const fakeUser = {
  iss: "Online JWT Builder",
  iat: 1738264939,
  exp: 1769800939,
  aud: "www.example.com",
  sub: "jrocket@example.com",
  firstname: "Johnny",
  username: "admin",
  email: "jrocket@example.com",
  roles: ["user", "admin"],
  avatar: "https://i.pravatar.cc/150?img=3",
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MzgyNjQ5MzksImV4cCI6MTc2OTgwMDkzOSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImZpcnN0bmFtZSI6IkpvaG5ueSIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXSwiYXZhdGFyIjoiaHR0cHM6Ly9pLnByYXZhdGFyLmNjLzE1MD9pbWc9MyJ9.hNzWZKGVhH8n8A1NOCgUPUrJGHQZvkuhz6XUxhIDvYg",
};

const toggleAuth = () => {
  if (localStorage.getItem("jwtToken")) {
    console.log("🚪 Logging out...");
    localStorage.removeItem("jwtToken");
    router("/login/");
  } else {
    console.log("🔑 Redirecting to Login...");
    router("/login/");
  }
};

const loadUserProfile = () => {
  checkAuthRedirect(); // เรียกตรวจสอบสิทธิ์ก่อน

  const token = localStorage.getItem("jwtToken");
  const { payload, isExpired } = token
    ? decodeJwt(token)
    : { payload: null, isExpired: true };
  const isGuest = !token || isExpired;

  const userProfile = payload;
  const authBtn = $(".auth-btn");
  const userNameEl = $(".user-name");
  const userAvatarEl = $(".user-avatar");

  updateUI({
    authBtn,
    userNameEl,
    userAvatarEl,
    isGuest,
    userProfile,
  });
  if (!token) return;
  const accessibleRoutes = getAccessibleRoutes(userProfile, routes);
  console.log("✅ Accessible Routes:", accessibleRoutes);
  renderMenu(accessibleRoutes);
};

const checkAuthRedirect = () => {
  const token = localStorage.getItem("jwtToken");
  const { payload, isExpired } = token
    ? decodeJwt(token)
    : { payload: null, isExpired: true };
  const isGuest = !token || isExpired;

  const currentPath = window.location.pathname;
  const matchRoute = routes.find((route) => route.path === currentPath);
  const isAuthorized = hasRole(payload, ...(matchRoute?.meta?.roles || []));

  // console.log("🔍 Checking Auth:");
  // console.log("Token:", token);
  // console.log("Is Expired:", isExpired);
  // console.log("Current Path:", currentPath);
  // console.log("Matched Route:", matchRoute);
  // console.log("isAuthorized:", isAuthorized);

  if (!matchRoute) return; // ไม่เจอ route, ปล่อยให้ 404 handler จัดการ

  // ✅ กรณีไม่มี token และหน้าไม่ใช่ public → บังคับไป login
  if (isGuest && !matchRoute.meta?.public) {
    console.log("🔴 Unauthorized: Redirecting to /login/");
    return router("/login/");
  }

  // ✅ กรณีล็อกอินแล้วแต่เข้าหน้า login หรือ register → ให้ไปหน้าแรก
  if (!isGuest && ["/login/", "/register/"].includes(currentPath)) {
    console.log("🔄 Already Authenticated: Redirecting to /");
    return router("/");
  }

  // console.log("✅ Access Granted: Staying on", currentPath);
};

// ✅ ฟังก์ชันอัปเดต UI
const updateUI = ({ userNameEl, userAvatarEl, isGuest, userProfile }) => {
  if (isGuest) {
    $(".user-profile")?.classList.add("hidden");
    return;
  }
  userAvatarEl.src = userProfile.avatar;
  userNameEl.textContent = userProfile.name;
  $(".btn-login")?.classList.add("hidden");
};
