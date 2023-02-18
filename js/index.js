// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const minWeight = document.querySelector('.minweight__input'); // минимальный вес для фильтрации
const maxWeight = document.querySelector('.maxweight__input'); // максимальный вес для фильтрации
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

let prev = [];

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

// вспомагательная функция, задаем класс с цветом по строке с цветом
const colorClassByName = (name) =>{
  const color_classes = ["fruit_violet", "fruit_green", "fruit_carmazin", "fruit_yellow", "fruit_lightbrown"]

  switch(name){
  case "фиолетовый":
    return color_classes[0]
  case "зеленый":
    return color_classes[1]
  case "розово-красный":
    return color_classes[2]
  case "желтый":
    return color_classes[3]
  case "светло-коричневый":
    return color_classes[4]
  default:
    return "fruit_magenta"
  }
}

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // очищаем fruitsList от вложенных элементов,
  fruitsList.innerHTML = ""
  // чтобы заполнить актуальными данными из fruits
  for (let i = 0; i < fruits.length; i++) {
    // формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    let d1 = document.createElement('div')
    let t1 = document.createTextNode("index: " + i)
    d1.appendChild(t1)
    let d2 = document.createElement('div')
    let t2 = document.createTextNode("kind: " + fruits[i].kind)
    d2.appendChild(t2)
    let d3 = document.createElement('div')
    let t3 = document.createTextNode("color: " + fruits[i].color)
    d3.appendChild(t3)
    let d4 = document.createElement('div')
    let t4 = document.createTextNode("weight (кг): " + fruits[i].weight)
    d4.appendChild(t4)
    let info = document.createElement('div')
    info.className = "fruit__info"
    info.appendChild(d1)
    info.appendChild(d2)
    info.appendChild(d3)
    info.appendChild(d4)
    let li = document.createElement('li');
    li.className = "fruit__item" + " " + colorClassByName(fruits[i].color)
    li.appendChild(info)
    fruitsList.appendChild(li)
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  prev = fruits

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
      let randomFruit = getRandomInt(0, fruits.length - 1);
      let fruitsNewArr = fruits.splice(randomFruit, 1)[0];
      result.push(fruitsNewArr);
     }
    fruits = result;

    if (JSON.stringify(prev) === JSON.stringify(fruits)) {
      alert('Порядок не изменился!');
    };
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  fruits = JSON.parse(fruitsJSON)
  let result = fruits.filter((item) => {
    if(item.weight >= Number(minWeight.value) && item.weight <= Number(maxWeight.value))
      return item
  });
  fruits = result;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  // допишите функцию сравнения двух элементов по цвету
  // сравниваем цвет как текст
  return a.color < b.color
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    //  функция сортировки пузырьком
    for (let j = arr.length - 1; j > 0; j--) {
      for (let i = 0; i < j; i++) {
        if (comparation(arr[i+1], arr[i])) {
          let temp = arr[i]
          arr[i] = arr[i + 1]
          arr[i + 1] = temp
        }
      }
    }
  },

  quickSort(arr, comparation) {
    // вспомогательная функция для быстрой сортировки
    function partition(arr, start, end, comparation){
    // берем последний элемент подмассива
    const pivotValue = arr[end];
    let pivotIndex = start; 
    for (let i = start; i < end; i++) {
        if (comparation(arr[i], pivotValue)) {
          // меняем элементы местами
          [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
          // переходим к следующему элементу
          pivotIndex++;
        }
    }
    
    // переносим элемент в средину
    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]] 
    return pivotIndex;
  };

    // функция быстрой сортировки
    stack = [];
    
    // добавляем весь начальный массив как неотсортированный
    stack.push(0);
    stack.push(arr.length - 1);
    
    // цикл продолжается пока массив с неотсортированными данными не пуст
    while(stack[stack.length - 1] >= 0){
        
      // получаем последний элемент
      end = stack.pop();
      start = stack.pop();
      // находим центральный элемент
      pivotIndex = partition(arr, start, end, comparation);
      
      // если слева есть неотсортированные элементы, то мы добавляем подмассив в массив
      if (pivotIndex - 1 > start){
        stack.push(start);
        stack.push(pivotIndex - 1);
      }
        
      // если справа есть неотсортированные элементы, то мы добавляем подмассив в массив
        if (pivotIndex + 1 < end){
          stack.push(pivotIndex + 1);
          stack.push(end);
        }
    }
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // переключаем значение sortKind между 'bubbleSort' / 'quickSort'
  if(sortKind == 'bubbleSort')
    sortKind = 'quickSort'
  else
    sortKind = 'bubbleSort'
  sortKindLabel.textContent = sortKind
});

sortActionButton.addEventListener('click', () => {
  // выводим в sortTimeLabel значение 'sorting...'
  sortTimeLabel.textContent = "sorting..."
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // выведим в sortTimeLabel значение sortTime
  sortTimeLabel.textContent = sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  let kind = kindInput.value
  let color = colorInput.value
  let weight = weightInput.value
  // проверяем, что все значения введены
  if(kind == ""){
    alert("Kind не задан")
  }
  if(color == ""){
    alert("Color не задан")
  }
  if(weight == ""){
    alert("Weight не задан")
  }
  // добавляем значение в массив
  fruits.push({"kind": kind, "color": color, "weight": weight})
  display();
});