<template>
  <div class="min-h-screen bg-[#f4f4f4]">
    <!-- FULL WIDTH HEADER -->
    <header
      class="fixed top-0 left-0 w-full h-[calc(55px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] bg-[#00593f] flex justify-end items-center pr-[30px] z-[999]"
    >
      <HamburgerMenu />
    </header>

    <!-- Page Content -->
    <NuxtPage />
  </div>
</template>
