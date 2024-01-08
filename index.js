const cellId = {
  left_top: "ltc",
  left_middle: "lmc",
  left_down: "ldc",
  top: "tc",
  middle: "mc",
  down: "dc",
  right_top: "rtc",
  right_middle: "rmc",
  right_down: "rdc"
}

function lida_com_insercao(letra, lin, col) {
  if (matriz_do_jogo[lin][col] !== "") {
    return [ja_inserido_txt, "", ""];
  }
  matriz_do_jogo[lin][col] = letra;
  let ganhou = false;

  ganhou = ganhou_jogo(letra, [0, 0], [0, 1]); //linha horizontal sup
  if (ganhou) return [ganhou_txt, cellId.left_top, cellId.right_top];

  ganhou = ganhou_jogo(letra, [0, 0], [1, 0]); //linha vertical esq
  if (ganhou) return [ganhou_txt, cellId.left_top, cellId.left_down];

  ganhou = ganhou_jogo(letra, [0, 0], [1, 1]); //linha diagonal esq superior dir inferior
  if (ganhou) return [ganhou_txt, cellId.left_top, cellId.right_down];

  ganhou = ganhou_jogo(letra, [0, 2], [1, 0]); //linha vertical direita
  if (ganhou) return [ganhou_txt, cellId.right_top, cellId.right_down];

  ganhou = ganhou_jogo(letra, [0, 2], [1, -1]); //linha diagonal direita superior esquerda inferior
  if (ganhou) return [ganhou_txt, cellId.right_top, cellId.left_down];

  ganhou = ganhou_jogo(letra, [2, 0], [0, 1]); //linha horizontal inferior
  if (ganhou) return [ganhou_txt, cellId.left_down, cellId.right_down];

  ganhou = ganhou_jogo(letra, [0, 1], [1, 0]); //linha vertical central
  if (ganhou) return [ganhou_txt, cellId.top, cellId.down];

  ganhou = ganhou_jogo(letra, [1, 0], [0, 1]); //linha horizontal central
  if (ganhou) return [ganhou_txt, cellId.left_middle, cellId.right_middle];

  return jogo_velhou() ? [velhou_txt, "", ""] : [continua_txt, "", ""];
}

function ganhou_jogo(letra, [lin, col], [lin_inc, col_inc]) {
  let passos = 0;
  while (lin >= 0 && lin < 3 && col >= 0 && col < 3) {
    if (matriz_do_jogo[lin][col] != letra) {
      return false;
    }
    lin += lin_inc;
    col += col_inc;
    passos++;
  }
  return passos === 3;
}

function jogo_velhou() {
  for (let i = 0; i < matriz_do_jogo.length; i++) {
    for (let j = 0; j < matriz_do_jogo[i].length; j++) {
      if (matriz_do_jogo[i][j] == "") return false;
    }
  }
  return true;
}

function inserir(target, letra) {
  [lin, col] = pega_posicao_pos_id(target.id);

  const [status, ini_id, fim_id] = lida_com_insercao(letra, lin, col);

  if (status !== ja_inserido_txt) {
    target.innerText = letra;
  }

  lidando_com_resposta_insercao(status, ini_id, fim_id)
}

function pega_posicao_pos_id(id) {
  let pos = [-1, -1];
  switch (id) {
    case cellId.left_top:
      pos = [0, 0];
      break;
    case cellId.top:
      pos = [0, 1];
      break;
    case cellId.right_top:
      pos = [0, 2];
      break;
    case cellId.left_middle:
      pos = [1, 0];
      break;
    case cellId.middle:
      pos = [1, 1];
      break;
    case cellId.right_middle:
      pos = [1, 2];
      break;
    case cellId.left_down:
      pos = [2, 0];
      break;
    case cellId.down:
      pos = [2, 1];
      break;
    case cellId.right_down:
      pos = [2, 2];
      break;
  }
  return pos;
}

function pega_jogador_da_rodada() {
  return jogar_p1 ? p1 : p2;
}

function mostra_vez() {
  mostra_vez_h1.innerText =
    "VEZ DO JOGADOR: " + pega_jogador_da_rodada();
}

function click_na_celula(e) {
  e.preventDefault();
  inserir(e.target, pega_jogador_da_rodada());
}

function entrou_na_celula(e) {
  e.preventDefault();
  const cell = document.getElementById(e.target.id);
  if (cell.innerHTML.trim() !== "") return;
  cell.innerHTML = `<span>${pega_jogador_da_rodada()}</span>`;
}

function saiu_da_celula(e) {
  e.preventDefault();
  const cell = document.getElementById(e.target.id);
  const span = cell.querySelector("span");
  if (span === null) return;
  cell.innerHTML = "";
}

function pega_cords_no_doc(cell) {
  return {
    x: cell.offsetLeft + cell.offsetWidth / 2,
    y: cell.offsetTop + cell.offsetHeight / 2,
  };
}

function cria_linha(id_ini, id_fim) {
  const cords_ini = pega_cords_no_doc(document.getElementById(id_ini));
  const cords_fim = pega_cords_no_doc(document.getElementById(id_fim));

  const ini_x = cords_ini.x;
  const ini_y = cords_ini.y;
  const fim_x = cords_fim.x;
  const fim_y = cords_fim.y;

  line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", ini_x);
  line.setAttribute("y1", ini_y);
  line.setAttribute("x2", fim_x);
  line.setAttribute("y2", fim_y);
  line.setAttribute("stroke", "orange");
  line.setAttribute("stroke-width", 5);
  line.setAttribute("id", "linha");
  const linesvg = document.getElementById("line");
  linesvg.append(line);
  interval_line = setInterval(() => {
    updateLine(id_ini, id_fim)
  }, 200);
}

function updateLine(id_ini, id_fim){
  const cords_ini = pega_cords_no_doc(document.getElementById(id_ini));
  const cords_fim = pega_cords_no_doc(document.getElementById(id_fim));
  const ini_x = cords_ini.x;
  const ini_y = cords_ini.y;
  const fim_x = cords_fim.x;
  const fim_y = cords_fim.y;
  line.x1.baseVal.value = ini_x;
  line.y1.baseVal.value = ini_y;
  line.x2.baseVal.value = fim_x;
  line.y2.baseVal.value = fim_y;
}

function lidando_com_resposta_insercao(resp, id_ini, id_fim) {
  if (resp === continua_txt) {
    jogar_p1 = !jogar_p1;
    mostra_vez();
    return;
  } else if (resp === ja_inserido_txt) {
    mostra_vez_h1.innerText = resp;
    setTimeout(() => {
      mostra_vez();
    }, 2000);
    return;
  }

  cellsArray.forEach((cell) => {
    cell.style.userSelect = "none";
  });

  mostra_vez_h1.innerText = resp;
  btn_iniciar.innerText = "Reiniciar JOgo da velha";
  btn_iniciar.style.display = "block";

  cellsArray.forEach((cell) => {
    cell.removeEventListener("click", click_na_celula);
    cell.removeEventListener("mouseenter", entrou_na_celula);
    cell.removeEventListener("mouseleave", saiu_da_celula);
  });

  if (resp === ganhou_txt) {
    cria_linha(id_ini, id_fim);
  }
}

function inicia_jogo() {
  if (interval_line) {
    clearInterval(interval_line);
    const linha = document.getElementById("linha");
    if (linha) {
      linha.remove();
    }
  }

  btn_iniciar.style.display = "none";
  for (let i = 0; i < matriz_do_jogo.length; i++) {
    for (let j = 0; j < matriz_do_jogo[i].length; j++) {
      matriz_do_jogo[i][j] = "";
    }
  }

  cellsArray.forEach((cell) => {
    cell.innerText = "";
  });

  jogar_p1 = true;
  mostra_vez(mostra_vez_h1);
  mostra_vez_h1.style.display = "block";
  jogo_container.style.display = "grid";
  btn_iniciar.style.display = "none";
  cellsArray.forEach((cell) => {
    cell.addEventListener("click", click_na_celula);
    cell.addEventListener("mouseenter", entrou_na_celula);
    cell.addEventListener("mouseleave", saiu_da_celula);
  });
}

const matriz_do_jogo = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let interval_line = null;
let line = null;


const ganhou_txt = "ganhou";
const velhou_txt = "velhou";
const continua_txt = "continua";
const ja_inserido_txt = "posição já inserida";

var jogar_p1 = true;
var p1 = "x";
var p2 = "O";

const jogo_container = document.getElementById("jogo");

const mostra_vez_h1 = document.getElementById("mostra-vez");

const btn_iniciar = document.getElementById("iniciar");

const cellsArray = Array.from(document.getElementsByClassName("cell"));

jogo_container.style.display = "none";

mostra_vez_h1.style.display = "none";

btn_iniciar.innerText = "Iniciar Jogo da Velha";

btn_iniciar.addEventListener("click", (event) => {
  event.preventDefault();
  inicia_jogo();
});

inicia_jogo();