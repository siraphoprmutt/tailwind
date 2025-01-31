// 📌 sidebar.js - จัดการ Sidebar
const sidebar = $(".sidebar");
const mainContent = $(".main-content");
const menuContainer = $(".menu");

// ✅ สร้างเมนูแบบไดนามิก
const renderMenu = (_routes) => {
  if (!menuContainer) {
    console.error("❌ ไม่พบ .menu ใน DOM");
    return;
  }

  const path = window.location.pathname;
  const active = (route) => {
    return route === path ? "bg-gray-200" : "";
  };

  menuContainer.innerHTML = _routes
    .map(
      (route) => `
        <li>
          <a href="${route.path}" class="${active(
        route.path
      )} flex items-center space-x-3 p-2 rounded hover:bg-gray-200 transition">
            <i class="${route.icon}"></i>
            <span class="text-gray-800 group-[.collapsed]:hidden">${
              route.title
            }</span>
          </a>
        </li>
      `
    )
    .join("");
};

// ✅ โหลดสถานะ Sidebar จาก localStorage
const loadSidebarState = () => {
  // console.log("🌟 loadSidebarState");
  if (!sidebar || !mainContent) return;

  const state = localStorage.getItem("sidebarState") || "open";
  sidebar.classList.remove("hidden", "w-20", "w-64", "collapsed");
  mainContent.classList.remove("ml-20", "ml-64");

  if (state === "collapsed") {
    sidebar.classList.add("collapsed", "w-20");
    mainContent.classList.add("ml-20");
  } else if (state === "hidden") {
    sidebar.classList.add("hidden");
  } else {
    sidebar.classList.add("w-64");
    mainContent.classList.add("ml-64");
  }
};

// ✅ ฟังก์ชันย่อ/ขยาย Sidebar
const toggleSidebarSize = () => {
  // console.log("🌟 toggleSidebarSize");
  if (!sidebar || !mainContent) return; // ✅ ตรวจสอบก่อนใช้งาน
  sidebar.classList.toggle("collapsed");
  if (sidebar.classList.contains("w-64")) {
    sidebar.classList.replace("w-64", "w-20");
    mainContent.classList.replace("ml-64", "ml-20");
    localStorage.setItem("sidebarState", "collapsed");
  } else {
    sidebar.classList.replace("w-20", "w-64");
    mainContent.classList.replace("ml-20", "ml-64");
    localStorage.setItem("sidebarState", "open");
  }
};

// ✅ ฟังก์ชันซ่อน/แสดง Sidebar
const toggleSidebarVisibility = () => {
  // console.log("🌟 toggleSidebarVisibility");
  if (!sidebar || !mainContent) return; // ✅ ตรวจสอบก่อนใช้งาน
  if (sidebar.classList.contains("hidden")) {
    sidebar.classList.remove("hidden");
    mainContent.classList.add("ml-64");
    localStorage.setItem("sidebarState", "open");
  } else {
    sidebar.classList.add("hidden");
    mainContent.classList.remove("ml-64");
    localStorage.setItem("sidebarState", "hidden");
  }
};
