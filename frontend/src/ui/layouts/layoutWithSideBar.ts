export function layoutWithSideBarHtml(sideBarHtml: string, contentHtml: string) {
  return `
  <div class="flex h-svh">
    ${sideBarHtml}
    <main class="flex justify-center py-8 flex-grow bg-gradient-to-br from-blue-50 via-white to-white">  
      ${contentHtml}
    </main>
  </div>
  `;
}