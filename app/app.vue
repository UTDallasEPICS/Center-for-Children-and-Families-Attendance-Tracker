<template>
  <div class="min-h-screen bg-[#f4f4f4]">
    <!-- FULL WIDTH HEADER -->
    <header class="fixed w-full z-20 top-0 start-0 bg-[#E87500]">
      <nav class="bg-neutral-primary">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-x1 p-4">
          <!-- put the link here i forgor-->
          <a href="link" class="flex items-center space-x-3 rtl:space-x-reverse"> 
            <!-- images for navbar like utd logo-->
          </a>
        </div>
      </nav>
      <nav class="bg-neutral-secondary-soft border-y border-default border-default">
        <div class="max-w-screen-xl px-4 py-3 mx-auto">
          <div class="flex items-center">
            <ul class="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
              <!-- where to add links and sections on navbar-->
              <li>
                <a href="#" class="text-heading hover:underline" aria-current="page">Check In</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <!-- Page Content -->
    <NuxtPage />
  </div>
</template>


