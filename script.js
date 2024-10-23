// Selecciona los elementos del DOM necesarios para la funcionalidad de la aplicación
const input = document.querySelector("input"); // Campo de entrada para agregar nuevos todos
const addbutton = document.querySelector(".add-button"); // Botón para añadir el nuevo todo
const todosHtml = document.querySelector(".todos"); // Contenedor que muestra la lista de todos
const emptyImage = document.querySelector(".empty-svg"); // Imagen que se muestra cuando no hay todos
const deleteAllButton = document.querySelector(".delete-all"); // Botón para eliminar todos los todos
const filters = document.querySelectorAll(".filter"); // Botones para aplicar filtros a la lista de todos

// Recupera la lista de todos desde el localStorage o inicializa una lista vacía
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
let filter = ''; // Variable para guardar el filtro actual

// Muestra la lista de todos al cargar la página
showTodos();

function getTodoHtml(todo, index) {
    // Si hay un filtro activo y el todo no coincide con el filtro, no lo renderiza
    if (filter && filter !== todo.status) {
        return ''; // Devuelve una cadena vacía si el todo no cumple con el filtro
    }
    // Define si el checkbox debe estar marcado como 'checked'
    let checked = todo.status === "completed" ? "checked" : "";
    // Genera el HTML para un todo individual
    return `
        <li class="todo">
            <label for="${index}">
                <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
                <span class="${checked}">${todo.name}</span>
            </label>
            <button class="delete-btn" data-index="${index}" onclick="remove(this)">
                <i class="fa fa-times"></i>
            </button>
        </li>
    `;
}

function showTodos() {
    // Muestra todos los todos o la imagen de vacío según el estado de la lista
    if (todosJson.length === 0) {
        todosHtml.innerHTML = ''; // Limpia el contenedor si no hay todos
        emptyImage.style.display = 'block'; // Muestra la imagen de vacío
    } else {
        todosHtml.innerHTML = todosJson.map(getTodoHtml).join(''); // Renderiza la lista de todos
        emptyImage.style.display = 'none'; // Oculta la imagen de vacío
    }
}

function addTodo(todo) {
    input.value = ""; // Limpia el campo de entrada después de agregar un nuevo todo
    todosJson.unshift({ name: todo, status: "pending" }); // Añade el nuevo todo a la lista
    localStorage.setItem("todos", JSON.stringify(todosJson)); // Guarda la lista actualizada en localStorage
    showTodos(); // Actualiza la vista de la lista de todos
}

// Maneja el evento keyup en el campo de entrada para añadir un todo cuando se presiona Enter
input.addEventListener("keyup", e => {
    let todo = input.value.trim(); // Obtiene el valor del campo de entrada sin espacios en blanco
    if (!todo || e.key !== "Enter") {
        return; // Sale si el campo está vacío o no se presionó Enter
    }
    addTodo(todo); // Llama a la función para añadir el nuevo todo
});

// Maneja el evento click en el botón de añadir para agregar un nuevo todo
addbutton.addEventListener("click", () => {
    let todo = input.value.trim(); // Obtiene el valor del campo de entrada sin espacios en blanco
    if (!todo) {
        return; // Sale si el campo está vacío
    }
    addTodo(todo); // Llama a la función para añadir el nuevo todo
});

function updateStatus(todo) {
    let todoName = todo.nextElementSibling; // Selecciona el elemento <span> asociado al checkbox
    if (todo.checked) {
        todoName.classList.add("checked"); // Marca el todo como completado
        todosJson[todo.id].status = "completed"; // Actualiza el estado en la lista
    } else {
        todoName.classList.remove("checked"); // Desmarca el todo
        todosJson[todo.id].status = "pending"; // Restaura el estado en la lista
    }
    localStorage.setItem("todos", JSON.stringify(todosJson)); // Guarda los cambios en localStorage
}

function remove(todo) {
    const index = todo.dataset.index; // Obtiene el índice del todo a eliminar
    todosJson.splice(index, 1); // Elimina el todo de la lista
    showTodos(); // Actualiza la vista de la lista de todos
    localStorage.setItem("todos", JSON.stringify(todosJson)); // Guarda los cambios en localStorage
}

// Maneja el clic en los botones de filtro para cambiar el filtro activo
filters.forEach(function (el) {
    el.addEventListener("click", (e) => {
        if (el.classList.contains('activate')) {
            el.classList.remove('activate'); // Desactiva el filtro si ya está activo
            filter = ''; // Elimina el filtro
        } else {
            filters.forEach(tag => tag.classList.remove('activate')); // Desactiva otros filtros
            el.classList.add('activate'); // Activa el filtro seleccionado
            filter = e.target.dataset.filter; // Establece el filtro actual
        }
        showTodos(); // Muestra los todos aplicando el filtro
    });
});

// Maneja el clic en el botón para eliminar todos los todos
deleteAllButton.addEventListener("click", () => {
    todosJson = []; // Limpia la lista de todos
    localStorage.setItem("todos", JSON.stringify(todosJson)); // Guarda la lista vacía en localStorage
    showTodos(); // Actualiza la vista para reflejar la lista vacía
});
