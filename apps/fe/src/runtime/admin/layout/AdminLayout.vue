<template>
  <div
    class="min-h-screen bg-[#F9F9F9] font-sans antialiased text-[#434654] flex"
  >
    <!-- Mobile Sidebar Backdrop Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        @click="closeMobileMenu"
      />
    </Transition>

    <!-- Aside - SideNavBar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex flex-col justify-between w-72 bg-[#F9F9F9] border-r border-[#C3C6D6] p-4 transition-transform duration-300 ease-in-out h-dvh lg:h-screen lg:sticky lg:top-0 lg:inset-y-auto lg:z-30 lg:shrink-0',
        isMobileMenuOpen
          ? 'translate-x-0 shadow-2xl'
          : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Top Section: Brand & Nav Links -->
      <div class="flex flex-col flex-1 min-h-0 overflow-y-auto">
        <!-- Brand / Header -->
        <div class="flex items-center justify-between pb-8">
          <NuxtLink
            :to="{ name: 'admin-products' }"
            class="group flex flex-col focus:outline-none"
            @click="closeMobileMenu"
          >
            <span
              class="text-2xl font-bold tracking-tight text-[#003D9B] group-hover:opacity-90 transition-opacity"
            >
              TechPulse
            </span>
            <span class="text-sm font-normal text-[#434654] mt-0.5">
              Admin Console
            </span>
          </NuxtLink>

          <!-- Mobile Close Button -->
          <button
            type="button"
            class="p-1.5 -mr-1 text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg lg:hidden transition-colors focus:outline-none"
            aria-label="Close Sidebar"
            @click="closeMobileMenu"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Navigation Links List -->
        <nav class="flex-1 space-y-1">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.to"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors duration-150',
              isActiveRoute(item.to)
                ? 'bg-[#DAE2FF] text-[#0040A2] font-bold shadow-xs'
                : 'font-semibold text-[#434654] hover:bg-slate-200/60 hover:text-[#003D9B]',
            ]"
            @click="closeMobileMenu"
          >
            <!-- eslint-disable vue/no-v-html -->
            <span
              class="w-5 h-5 shrink-0 flex items-center justify-center transition-colors [&>svg]:w-5 [&>svg]:h-5"
              :class="
                isActiveRoute(item.to) ? 'text-[#0040A2]' : 'text-[#434654]'
              "
              v-html="item.icon"
            />
            <span>{{ item.name }}</span>
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <!-- Main Wrapper (TopBar + Content Area) -->
    <div class="flex-1 flex flex-col min-w-0 min-h-screen">
      <!-- Header - TopNavBar -->
      <header
        class="sticky top-0 z-30 h-16 bg-[#F9F9F9]/80 backdrop-blur-md border-b border-[#C3C6D6] px-4 sm:px-6 flex items-center justify-between shadow-xs transition-colors"
      >
        <!-- Left: Mobile Toggle & Page Context -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg lg:hidden transition-colors focus:outline-none"
            aria-label="Open Sidebar"
            @click="openMobileMenu"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <!-- Right: Trailing Actions & Profile -->
        <div class="flex items-center gap-3 sm:gap-4">
          <!-- Profile Dropdown Container -->
          <div ref="profileDropdownRef" class="relative">
            <button
              type="button"
              class="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-200/60 transition-colors focus:outline-none"
              aria-label="User Profile Menu"
              @click="toggleProfileMenu"
            >
              <!-- Avatar Circle -->
              <div
                class="w-8 h-8 rounded-full border border-[#C3C6D6] bg-slate-200 overflow-hidden flex items-center justify-center text-xs font-bold text-[#003D9B] shadow-xs"
              >
                <span>{{ userInitials }}</span>
              </div>

              <!-- Admin Name & Chevron (Hidden on small mobile) -->
              <div class="hidden md:flex flex-col text-left">
                <span
                  class="text-xs font-semibold text-slate-800 line-clamp-1 leading-tight"
                >
                  {{ user?.fullName || 'Administrator' }}
                </span>
                <span
                  class="text-[10px] text-slate-500 font-medium leading-tight"
                >
                  {{ user?.role || 'Super Admin' }}
                </span>
              </div>

              <svg
                class="w-4 h-4 text-slate-500 transition-transform duration-200 hidden md:block"
                :class="isProfileMenuOpen ? 'rotate-180' : ''"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Profile Dropdown Menu -->
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-if="isProfileMenuOpen"
                class="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-sm focus:outline-none"
              >
                <div class="px-4 py-2 border-b border-slate-100">
                  <p class="font-semibold text-slate-800 truncate">
                    {{ user?.fullName || 'Administrator' }}
                  </p>
                  <p class="text-xs text-slate-500 truncate">
                    {{ user?.email || 'admin@techpulse.com' }}
                  </p>
                </div>

                <button
                  type="button"
                  class="w-full flex items-center gap-2.5 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                  @click="handleLogout"
                >
                  <svg
                    class="w-4 h-4 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Main Page Content Area -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useAdminAuth } from '#imports';

// Layout state
const isMobileMenuOpen = ref(false);
const isProfileMenuOpen = ref(false);
const profileDropdownRef = ref<HTMLElement | null>(null);

const route = useRoute();
const { user, logout } = useAdminAuth();

const openMobileMenu = () => {
  isMobileMenuOpen.value = true;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const handleLogout = async () => {
  isProfileMenuOpen.value = false;
  closeMobileMenu();
  await logout('/admin/login');
};

// Close dropdown on outside click
const handleClickOutside = (event: MouseEvent) => {
  if (
    profileDropdownRef.value &&
    !profileDropdownRef.value.contains(event.target as Node)
  ) {
    isProfileMenuOpen.value = false;
  }
};

// Prevent background scroll when mobile sidebar drawer is open
watch(isMobileMenuOpen, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
});

// Auto close mobile menu on route navigation
watch(
  () => route.path,
  () => {
    closeMobileMenu();
  },
);

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});

// User Initials computed
const userInitials = computed(() => {
  if (!user.value?.fullName) return 'AD';
  return user.value.fullName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

// Navigation items
const navigationItems = [
  {
    id: 'categories',
    name: 'Categories',
    to: '/admin/categories',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>',
  },
  {
    id: 'products',
    name: 'Products',
    to: '/admin/products',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>',
  },
  {
    id: 'orders',
    name: 'Orders',
    to: '/admin/orders',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>',
  },
  {
    id: 'vouchers',
    name: 'Vouchers',
    to: '/admin/vouchers',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>',
  },
  {
    id: 'reviews',
    name: 'Reviews',
    to: '/admin/reviews',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>',
  },
];

// Helper to determine if a route is active
const isActiveRoute = (path: string) => {
  if (!route.path) return false;
  if (
    path === '/admin/products' &&
    (route.path === '/admin' || route.path === '/admin/products')
  ) {
    return true;
  }
  return route.path.startsWith(path);
};
</script>
