document.addEventListener("DOMContentLoaded", () => {
  const [toggleBtn, hideBtn, authBtn, menu, sidebar] = [
    ".sidebar-toggle",
    ".sidebar-hide",
    ".auth-btn",
    ".menu",
    ".sidebar",
  ].map($);

  // ✅ โหลดเมนู Sidebar
  menu &&
    renderMenu(routes.filter((route) => !route.meta.hide && route.meta.public));

  // ✅ โหลดสถานะ Sidebar
  sidebar && loadSidebarState();

  // ✅ โหลดข้อมูลผู้ใช้
  loadUserProfile();

  // ✅ ตรวจสอบก่อนเพิ่ม event listener
  toggleBtn?.addEventListener("click", toggleSidebarSize);
  hideBtn?.addEventListener("click", toggleSidebarVisibility);
  authBtn?.addEventListener("click", toggleAuth);
});
