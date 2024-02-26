const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById('filter')
const formBtn = itemForm.querySelector('button')
let isEditingMode = false;

function displayItems() {
  const itemsFromStorage = getItemFromStorage();
  // get items from local storage and put on the page
  itemsFromStorage.forEach(item => addItemToDOM(item));
  resetUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  //Validate Input

  if (newItem == "") {
    alert("Please add an item");
    return;
  }

  //Check for edit mode
  if(isEditingMode) {
    const itemTodEdit = itemList.querySelector('edit-mode');
    removeItemFromStorage(itemTodEdit.textContent);
    itemTodEdit.classList.remove('edit-mode')
    itemTodEdit.remove();
    isEditingMode = false
  } else {
    if (checkItemExists(newItem)) {
        alert('That item already exists!')
        return;
    }
  }

  //Create item DOM element
  addItemToDOM(newItem)

  //Add item to local storage
  addItemToStorage(newItem);

  resetUI();

  itemInput.value = "";

}


function addItemToDOM(item) {
  //Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));
  console.log(li);

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  //add li to dom
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}


function addItemToStorage(item) {
  const itemsFromStorage = getItemFromStorage();
 
  //Add new item to array
  itemsFromStorage.push(item);
  //Convert to JSON string and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemFromStorage() {
    let itemsFromStorage;
  //Check to see if there is no items in storage
  if (localStorage.getItem("items") == null) {
    //Create empty array
    itemsFromStorage = [];
  } else {
    //convert into an array
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
      removeItem(e.target.parentElement.parentElement);
    } else {
      setItemToEdit(e.target);
    }
}

function checkItemExists(item) {
  const itemsFromStorage = getItemFromStorage()
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
  .querySelectorAll('li')
  .forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode')
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22'
  itemInput.value = item.textContent;
}

function removeItem(item) {
  console.log(item)
  if(confirm('Are you sure')){
    //Remove item from DOM
    item.remove();

    //Remove item from Storage
    removeItemFromStorage(item.textContent);
     
    resetUI();
  }
}


function removeItemFromStorage(item) {
  let itemsFromStorage = getItemFromStorage();
  //Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  //RE-set to localStorage
  localStorage.setItem('items',JSON.stringify(itemsFromStorage));
  console.log(itemsFromStorage)
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild)
  }
  //Clear from local storage
  localStorage.removeItem('items');
  resetUI();
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");

  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLowerCase();

    //if text matches itemName then it will be a negative 1
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
      console.log(true)
    } else {
      item.style.display = "none";
    }
  })

}
function resetUI() {
  itemInput.value = '';
    const items = itemList.querySelectorAll("li");

    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = "block";
        itemFilter.style.display = "block";
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    isEditingMode = false;
}


//Initialize app
function init () {
  //Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);
  resetUI();
}

 

 init()