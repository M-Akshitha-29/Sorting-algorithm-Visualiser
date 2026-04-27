const container = document.getElementById("arrayContainer");
const algorithmSelect = document.getElementById("algorithmSelect");
const infoPanel = document.getElementById("infoPanel");
const javaCode = document.getElementById("javaCode");

let array = [];
let originalArray = [];
let steps = [];
let stepIndex = 0;
let interval = null;

const algorithmInfo = {
  bubble: {
    time: "Best: O(n), Average: O(n²), Worst: O(n²)",
    space: "O(1)",
    stable: "Yes",
    desc: "Repeatedly compares adjacent elements and swaps them.",
    code: `static void bubbleSort(int arr[]){
 for(int i=0;i<arr.length-1;i++){
  for(int j=0;j<arr.length-i-1;j++){
   if(arr[j] > arr[j+1]){
    int temp = arr[j];
    arr[j] = arr[j+1];
    arr[j+1] = temp;
   }
  }
 }
}`
  },

  selection: {
    time: "Best: O(n²), Average: O(n²), Worst: O(n²)",
    space: "O(1)",
    stable: "No",
    desc: "Finds minimum element and places it at correct position.",
    code: `static void selectionSort(int arr[]){
 for(int i=0;i<arr.length-1;i++){
  int min=i;
  for(int j=i+1;j<arr.length;j++){
   if(arr[j] < arr[min]) min=j;
  }
  int temp=arr[i];
  arr[i]=arr[min];
  arr[min]=temp;
 }
}`
  },

  insertion: {
    time: "Best: O(n), Average: O(n²), Worst: O(n²)",
    space: "O(1)",
    stable: "Yes",
    desc: "Builds sorted array by inserting elements one by one.",
    code: `static void insertionSort(int arr[]){
 for(int i=1;i<arr.length;i++){
  int key=arr[i];
  int j=i-1;
  while(j>=0 && arr[j] > key){
   arr[j+1]=arr[j];
   j--;
  }
  arr[j+1]=key;
 }
}`
  }
};

function generateArray(size = 10){
  array = Array.from({length:size}, () =>
    Math.floor(Math.random() * 99) + 1
  );

  originalArray = [...array];
  steps = [];
  stepIndex = 0;

  renderArray();
}

function renderArray(highlights = {}){
  container.innerHTML = "";

  array.forEach((value,index) => {
    const box = document.createElement("div");
    box.className = "bar";
    box.textContent = value;

    if(highlights.compare?.includes(index)) box.classList.add("compare");
    if(highlights.swap?.includes(index)) box.classList.add("swap");
    if(highlights.sorted?.includes(index)) box.classList.add("sorted");

    container.appendChild(box);
  });
}

function saveStep(arr, highlights = {}){
  steps.push({
    array:[...arr],
    highlights
  });
}

function bubbleSortSteps(arr){
  let a = [...arr];

  for(let i=0;i<a.length;i++){
    for(let j=0;j<a.length-i-1;j++){
      saveStep(a,{compare:[j,j+1]});

      if(a[j] > a[j+1]){
        [a[j],a[j+1]] = [a[j+1],a[j]];
        saveStep(a,{swap:[j,j+1]});
      }
    }

    saveStep(a,{sorted:[a.length-i-1]});
  }
}

function selectionSortSteps(arr){
  let a = [...arr];

  for(let i=0;i<a.length;i++){
    let min = i;

    for(let j=i+1;j<a.length;j++){
      saveStep(a,{compare:[min,j]});
      if(a[j] < a[min]) min = j;
    }

    [a[i],a[min]] = [a[min],a[i]];
    saveStep(a,{swap:[i,min]});
    saveStep(a,{sorted:[i]});
  }
}

function insertionSortSteps(arr){
  let a = [...arr];

  for(let i=1;i<a.length;i++){
    let key = a[i];
    let j = i-1;

    while(j>=0 && a[j] > key){
      saveStep(a,{compare:[j,j+1]});
      a[j+1] = a[j];
      j--;
      saveStep(a,{swap:[j+1]});
    }

    a[j+1] = key;
    saveStep(a,{sorted:[i]});
  }
}

function prepareSteps(){
  steps = [];

  const algo = algorithmSelect.value;

  if(algo === "bubble") bubbleSortSteps(array);
  if(algo === "selection") selectionSortSteps(array);
  if(algo === "insertion") insertionSortSteps(array);

  stepIndex = 0;
  updateInfo();
}

function showStep(index){
  if(steps[index]){
    array = [...steps[index].array];
    renderArray(steps[index].highlights);
  }
}

function autoPlay(){
  clearInterval(interval);

  interval = setInterval(() => {
    if(stepIndex < steps.length){
      showStep(stepIndex++);
    }else{
      clearInterval(interval);
    }
  }, document.getElementById("speedSlider").value);
}

function updateInfo(){
  const algo = algorithmSelect.value;
  const info = algorithmInfo[algo];

  infoPanel.innerHTML = `
    <h3>${algo.toUpperCase()} SORT</h3>
    <p><strong>Time Complexity:</strong> ${info.time}</p>
    <p><strong>Space Complexity:</strong> ${info.space}</p>
    <p><strong>Stable:</strong> ${info.stable}</p>
    <p>${info.desc}</p>
  `;

  javaCode.textContent = info.code;
}

document.getElementById("generateBtn").onclick = () => generateArray();

document.getElementById("setArrayBtn").onclick = () => {
  const values = document.getElementById("customArray").value
    .split(",")
    .map(Number)
    .filter(n => !isNaN(n));

  if(values.length){
    array = [...values];
    originalArray = [...values];
    steps = [];
    stepIndex = 0;
    renderArray();
  }
};

document.getElementById("resetBtn").onclick = () => {
  array = [...originalArray];
  renderArray();
};

document.getElementById("prevBtn").onclick = () => {
  if(stepIndex > 0) showStep(--stepIndex);
};

document.getElementById("nextBtn").onclick = () => {
  if(steps.length === 0) prepareSteps();
  if(stepIndex < steps.length) showStep(stepIndex++);
};

document.getElementById("autoPlayBtn").onclick = () => {
  if(steps.length === 0) prepareSteps();
  autoPlay();
};

document.getElementById("pauseBtn").onclick = () => clearInterval(interval);

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

algorithmSelect.onchange = updateInfo;

generateArray();
updateInfo();