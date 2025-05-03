const canvas = document.getElementById('circuit-canvas');
const ctx    = canvas.getContext('2d');

let inputA = 0, inputB = 0;

// clear the drawing area
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// remove old buttons
function clearControls() {
  document.getElementById('input-controls').innerHTML = '';
}

// high‑level dispatcher
function selectCircuit(name) {
  // reset inputs
  inputA = inputB = 0;

  // hide converter by default, show canvas
  document.getElementById('number-converter').style.display = 'none';
  document.getElementById('circuit-canvas').style.display = 'block';
  clearControls();

  // show/hide expression label
  document.getElementById('logic-expression').style.display =
    (name === 'NumberConverter') ? 'none' : 'block';

  switch (name) {
    case 'AND':   setupGate('A • B', evaluateAND); break;
    case 'OR':    setupGate('A + B', evaluateOR);  break;
    case 'NOT':   setupGate("A′",    evaluateNOT); break;
    case 'XOR':   setupGate('A ⊕ B', evaluateXOR); break;
    case 'NAND':  setupGate('(A • B)′', evaluateNAND);break;
    case 'NOR':   setupGate('(A + B)′',evaluateNOR); break;
    case 'XNOR':  setupGate('(A ⊕ B)′',evaluateXNOR);break;
    case 'NumberConverter':
      document.getElementById('circuit-canvas').style.display = 'none';
      document.getElementById('number-converter').style.display = 'block';
      break;
  }
}

// create A/B toggle buttons and draw on change
function setupGate(expr, drawFn) {
  document.getElementById('logic-expression').innerText = 'Logic: ' + expr;
  createInputButtons(['A','B'], drawFn);
  drawFn();
}

// A/B buttons helper
function createInputButtons(inputs, onChange) {
  const c = document.getElementById('input-controls');
  c.innerHTML = '';
  inputs.forEach(name => {
    const btn = document.createElement('button');
    btn.innerText = name + ': OFF';
    btn.dataset.on = '0';
    btn.style.cssText = 'margin:5px;padding:8px 16px;background:#e74c3c;color:#fff;border:none;border-radius:4px;';
    btn.onclick = () => {
      btn.dataset.on = btn.dataset.on==='0'?'1':'0';
      const on = btn.dataset.on==='1';
      btn.innerText = `${name}: ${on?'ON':'OFF'}`;
      btn.style.background = on? '#2ecc71' : '#e74c3c';
      if (name==='A') inputA = on?1:0;
      if (name==='B') inputB = on?1:0;
      onChange();
      updateSelectedDisplay(name, on);  // Update display of selected input around canvas
    };
    c.appendChild(btn);
  });
}

// Display the selected input state around the canvas
function updateSelectedDisplay(input, state) {
  const selectedDiv = document.getElementById('selected-input');
  selectedDiv.innerHTML = `${input} is ${state ? 'ON' : 'OFF'}`;
  selectedDiv.style.position = 'absolute';
  selectedDiv.style.top = '10px';
  selectedDiv.style.left = '50%';
  selectedDiv.style.transform = 'translateX(-50%)';
  selectedDiv.style.background = '#f39c12';
  selectedDiv.style.padding = '5px 10px';
  selectedDiv.style.borderRadius = '5px';
}

// draw connection wire
function drawWire(x1,y1,x2,y2,active) {
  ctx.strokeStyle = active? 'green':'red';
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
}

// ─── Gate Evaluators ────────────────────────────────────────────────

function evaluateAND() {
  clearCanvas();
  const out = inputA & inputB;
  // gate shape
  ctx.lineWidth=2; ctx.strokeStyle='black';
  ctx.beginPath(); ctx.moveTo(150,150); ctx.lineTo(190,150);
  ctx.arc(190,200,50,-Math.PI/2,Math.PI/2); ctx.lineTo(150,250);
  ctx.closePath(); ctx.stroke();
  // wires
  drawWire(80,170,150,170,inputA);
  drawWire(80,230,150,230,inputB);
  drawWire(240,200,300,200,out);
}

function evaluateOR() {
  clearCanvas();
  const out = inputA | inputB;
  ctx.lineWidth=2; ctx.strokeStyle='black';
  ctx.beginPath();
  ctx.moveTo(150,150); ctx.quadraticCurveTo(180,200,150,250);
  ctx.moveTo(150,150); ctx.quadraticCurveTo(210,200,150,250);
  ctx.stroke();
  drawWire(80,170,150,170,inputA);
  drawWire(80,230,150,230,inputB);
  drawWire(200,200,260,200,out);
}

function evaluateNOT() {
  clearCanvas();
  const out = inputA?0:1;
  ctx.lineWidth=2; ctx.strokeStyle='black';
  ctx.beginPath(); ctx.moveTo(150,170); ctx.lineTo(190,200); ctx.lineTo(150,230);
  ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.arc(200,200,5,0,2*Math.PI); ctx.stroke();
  drawWire(80,200,150,200,inputA);
  drawWire(205,200,260,200,out);
}

function evaluateXOR() {
  clearCanvas();
  const out = inputA ^ inputB;
  // outer curve
  ctx.lineWidth=2; ctx.strokeStyle='black';
  ctx.beginPath(); ctx.moveTo(150,150); ctx.quadraticCurveTo(190,200,150,250); ctx.stroke();
  // inner XOR curve
  ctx.beginPath(); ctx.moveTo(145,150); ctx.quadraticCurveTo(185,200,145,250); ctx.stroke();
  // box lines
  ctx.beginPath(); ctx.moveTo(150,150); ctx.lineTo(220,150);
  ctx.lineTo(250,200); ctx.lineTo(220,250); ctx.lineTo(150,250); ctx.stroke();
  drawWire(80,170,150,170,inputA);
  drawWire(80,230,150,230,inputB);
  drawWire(250,200,300,200,out);
}

function evaluateNAND() {
  clearCanvas();
  const out = !(inputA & inputB) ? 1:0;
  // draw AND
  evaluateAND();
  // draw inversion circle
  ctx.beginPath(); ctx.arc(310,200,10,0,2*Math.PI); ctx.stroke();
  // output wire
  drawWire(320,200,360,200,out);
}

function evaluateNOR() {
  clearCanvas();
  const out = !(inputA | inputB) ? 1:0;
  // draw OR
  evaluateOR();
  // inversion circle
  ctx.beginPath(); ctx.arc(260,200,10,0,2*Math.PI); ctx.stroke();
  // out wire
  drawWire(270,200,320,200,out);
}

function evaluateXNOR() {
  clearCanvas();
  const out = !(inputA ^ inputB)?1:0;
  // draw XOR
  evaluateXOR();
  // inversion circle
  ctx.beginPath(); ctx.arc(300,200,10,0,2*Math.PI); ctx.stroke();
  // out wire
  drawWire(310,200,360,200,out);
}

// ── Number Converter function remains as before ──
function convertNumber() {
  let s = document.getElementById('numberInput').value;
  let b = parseInt(document.getElementById('fromBase').value,10);
  let d = parseInt(s,b);
  if (isNaN(d)) { alert('Invalid'); return; }
  document.getElementById('binOut').textContent = d.toString(2);
  document.getElementById('octOut').textContent = d.toString(8);
  document.getElementById('decOut').textContent = d.toString(10);
  document.getElementById('hexOut').textContent = d.toString(16).toUpperCase();
}
