export const todayTodosHtml = 
`
<div class="w-180">
  <div class="flex justify-between items-center">
    <div>
      <h2 class="font-semibold text-2xl">Entrada</h2>
      <span class="text-sm text-gray-600">1 tarefas pendente</span>
    </div>
    <button class="bg-blue-600 text-white h-12 rounded-xl px-6 transition-colors hover:bg-blue-700">
      Adicionar tarefa
    </button>
  </div>
  <div class="flex flex-col gap-2 py-6">
    <div class="flex justify-between items-center p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md cursor-pointer">
      <div class="flex gap-2 items-center">
        <svg class="text-gray-400 h-5 w-5" xmlns="http://www.w3.org/2000/svg">
            <use href="/icons/icons.svg#circle"></use>
        </svg>
        Revisar projeto inteiro
      </div>
      <div class="h-3 w-3 border-r-2 border-r-gray-500 border-b-2 border-b-gray-500 rotate-45 -translate-y-1"></div>
      </div>
    </div>
    <div class="finished-tasks-wrap">
      <div class="text-sm text-gray-600 font-medium mb-4">Concluídas (1)</div>
      <div class="finished-tasks">
        <div class="flex justify-between items-center p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md cursor-pointer">
          <div class="flex gap-2 line-through text-gray-600 items-center">
            <svg class="text-blue-600 h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <use href="/icons/icons.svg#circle-check"></use>
            </svg>
            Revisar projeto inteiro
          </div>
        </div>
      </div>
    </div>
</div>
`