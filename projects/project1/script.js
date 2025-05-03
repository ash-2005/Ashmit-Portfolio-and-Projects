// Global Variables
let array = [];
let isPaused = false;
let currentAlgorithm = null;
let speed = 5;
let elementCount = 10; // Controlled via + and - buttons

let stackArray = [];
let queueArray = [];

// Sleep Helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get speed from slider
function getSleepTime() {
  let slider = document.getElementById('speed');
  return (11 - parseInt(slider.value)) * 100;
}

// Draw visual bars
function drawArray(structure = array) {
    const container = document.getElementById('visualization-area');
    container.innerHTML = '';
  
    const maxBars = structure.length;
    const maxValue = Math.max(...structure);
    const availableHeight = container.clientHeight - 20; // total area minus bottom padding
    const barWidth = Math.max(5, Math.min(30, (container.clientWidth - 20) / maxBars - 6));
  
    structure.forEach(value => {
      const bar = document.createElement('div');
      bar.classList.add('bar');
  
      // Normalized height (leave 10px top margin)
      const normalizedHeight = (value / maxValue) * (availableHeight - 10);
      bar.style.height = `${normalizedHeight}px`;
  
      bar.style.width = `${barWidth}px`;
      container.appendChild(bar);
    });
  }
  

// Select Algorithm
function selectAlgorithm(algorithm) {
  currentAlgorithm = algorithm;
  resetData();
  const info = {
    bubble: 'Bubble Sort: Compare and swap adjacent items.',
    selection: 'Selection Sort: Find min and put it in place.',
    insertion: 'Insertion Sort: Insert elements into the sorted section.',
    merge: 'Merge Sort: Divide and conquer approach.',
    quick: 'Quick Sort: Partition around pivot.',
    heap: 'Heap Sort: Build heap and sort.',
    stackArray: 'Stack (Array): LIFO - Last In, First Out.',
    queueArray: 'Queue (Array): FIFO - First In, First Out.',
    linearSearch: 'Linear Search: Check each element sequentially.'
  };
  document.getElementById('algo-info').innerText = info[algorithm] || 'Algorithm Selected.';
}

// Reset and create new data
function resetData() {
  isPaused = true; // Automatically pause
  array = [];
  if (['stackArray', 'queueArray'].includes(currentAlgorithm)) {
    stackArray = [];
    queueArray = [];
    drawArray([]);
    return;
  }
  for (let i = 0; i < elementCount; i++) {
    array.push(Math.floor(Math.random() * 100) + 10);
  }
  drawArray();
}

// Start Visualization
async function startVisualization() {
  isPaused = false;
  speed = getSleepTime();
  
  if (['stackArray'].includes(currentAlgorithm)) {
    await visualizeStack();
  } else if (['queueArray'].includes(currentAlgorithm)) {
    await visualizeQueue();
  } else if (currentAlgorithm === 'linearSearch') {
    await visualizeLinearSearch();
  } else {
    await sortArray();
  }
}

// Pause Visualization
function pauseVisualization() {
  isPaused = true;
}

// Increase / Decrease Elements
function increaseElements() {
  if (elementCount < 30) {
    elementCount++;
    updateElementDisplay();
    resetData();
  }
}

function decreaseElements() {
  if (elementCount > 1) {
    elementCount--;
    updateElementDisplay();
    resetData();
  }
}

function updateElementDisplay() {
  document.getElementById('elementCountDisplay').innerText = elementCount;
}

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

// General Sorting Functions
async function sortArray() {
  if (currentAlgorithm === 'bubble') await bubbleSort();
  else if (currentAlgorithm === 'selection') await selectionSort();
  else if (currentAlgorithm === 'insertion') await insertionSort();
  else if (currentAlgorithm === 'merge') await mergeSort(0, array.length - 1);
  else if (currentAlgorithm === 'quick') await quickSort(0, array.length - 1);
  else if (currentAlgorithm === 'heap') await heapSort();
  drawArray();
}

// Bubble Sort
async function bubbleSort() {
  let bars = document.getElementsByClassName('bar');
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (isPaused) return;
      bars[j].classList.add('compare');
      bars[j + 1].classList.add('compare');
      await sleep(speed);

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        drawArray();
        bars = document.getElementsByClassName('bar');
      }

      bars[j].classList.remove('compare');
      bars[j + 1].classList.remove('compare');
    }
    bars[array.length - i - 1].classList.add('sorted');
  }
}

// Selection Sort
async function selectionSort() {
  let bars = document.getElementsByClassName('bar');
  for (let i = 0; i < array.length; i++) {
    let min = i;
    for (let j = i + 1; j < array.length; j++) {
      if (isPaused) return;
      bars[j].classList.add('compare');
      await sleep(speed);
      if (array[j] < array[min]) min = j;
      bars[j].classList.remove('compare');
    }
    [array[i], array[min]] = [array[min], array[i]];
    drawArray();
    bars = document.getElementsByClassName('bar');
    bars[i].classList.add('sorted');
  }
}

// Insertion Sort
async function insertionSort() {
  let bars = document.getElementsByClassName('bar');
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      if (isPaused) return;
      array[j + 1] = array[j];
      drawArray();
      bars = document.getElementsByClassName('bar');
      bars[j].classList.add('compare');
      await sleep(speed);
      bars[j].classList.remove('compare');
      j--;
    }
    array[j + 1] = key;
    drawArray();
    bars = document.getElementsByClassName('bar');
    bars[i].classList.add('sorted');
    await sleep(speed);
  }
}

// Merge Sort
async function mergeSort(left, right) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSort(left, mid);
  await mergeSort(mid + 1, right);
  await merge(left, mid, right);
}

async function merge(left, mid, right) {
  let leftArr = array.slice(left, mid + 1);
  let rightArr = array.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;
  while (i < leftArr.length && j < rightArr.length) {
    if (isPaused) return;
    array[k++] = leftArr[i] <= rightArr[j] ? leftArr[i++] : rightArr[j++];
    drawArray();
    await sleep(speed);
  }
  while (i < leftArr.length) {
    if (isPaused) return;
    array[k++] = leftArr[i++];
    drawArray();
    await sleep(speed);
  }
  while (j < rightArr.length) {
    if (isPaused) return;
    array[k++] = rightArr[j++];
    drawArray();
    await sleep(speed);
  }
}

// Quick Sort
async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  let bars = document.getElementsByClassName('bar');

  for (let j = low; j < high; j++) {
    if (isPaused) return i + 1;
    bars[j].classList.add('compare');
    await sleep(speed);
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      drawArray();
      bars = document.getElementsByClassName('bar');
    }
    bars[j].classList.remove('compare');
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  drawArray();
  bars = document.getElementsByClassName('bar');
  bars[i + 1].classList.add('sorted');
  return i + 1;
}

// Heap Sort
async function heapSort() {
  let n = array.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    drawArray();
    await sleep(speed);
    await heapify(i, 0);
  }
}

async function heapify(n, i) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && array[l] > array[largest]) largest = l;
  if (r < n && array[r] > array[largest]) largest = r;
  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    drawArray();
    await sleep(speed);
    await heapify(n, largest);
  }
}
// Visualize Linear Search
async function visualizeLinearSearch() {
  let target = array[Math.floor(Math.random() * array.length)];
  for (let i = 0; i < array.length; i++) {
    if (isPaused) return;
    const bars = document.getElementsByClassName('bar');
    bars[i].classList.add('compare');
    await sleep(speed);
    if (array[i] === target) {
      bars[i].classList.add('sorted');
      break;
    }
    bars[i].classList.remove('compare');
  }
}

// Initial Call
resetData();
updateElementDisplay();
