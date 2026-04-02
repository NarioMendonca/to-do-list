export const sideBarHtml = 
`
<aside class="flex flex-col grow-0 border-r border-r-gray-200">
  <div class="flex gap-2 p-4 font-semibold border-b border-b-gray-200">
    <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg">
    <use href="/icons/icons.svg#circle-check"></use>
    </svg>
    Todo List
  </div>
  <div class="p-2">
    <ul class="flex flex-col gap-2">
      <li class="flex items-center gap-3 px-4 py-2 text-md font-medium rounded-lg w-60 text-blue-600 bg-blue-50 hover:bg-gray-100">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
          <use href="/icons/icons.svg#inbox"></use>
          </svg>
          Entrada
      </li>
      <li class="flex items-center gap-3 px-4 py-2 text-md font-medium rounded-lg w-60 hover:bg-gray-100">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
          <use href="/icons/icons.svg#calendar"></use>
          </svg>
          Hoje
      </li>
      <li class="flex items-center gap-3 px-4 py-2 text-md font-medium rounded-lg w-60 hover:bg-gray-100">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
          <use href="/icons/icons.svg#tag"></use>
          </svg>
          Etiquetas
      </li>
    </ul>
  </div>
  <div class="lists grow">
  </div>
  <div class="account">
    <div class="user-pic">

    </div>
    <div class="flex gap-2 items-center p-4 border-t border-t-gray-200 cursor-pointer">
    <div class="rounded-full bg-blue-500 w-8 h-8">
    </div>
    <div class="flex flex-col">
        <div class="text-gray-700 -mb-1">Usuário</div>
        <span class="text-sm text-gray-700">Gerenciar minha conta</span>
    </div>
    </div>
  </div>
</aside>
`