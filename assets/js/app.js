/**
 * 2C = Two of Clubs (Tréboles)
 * 2D = Two of Diamonds (Diamantes)
 * 2H = Two of Hearts (Corazones)
 * 2S = Two of Spades (Picas)
 */

const moduloJuego = (() => {
  'use strict'
  
  // V A R I A B L E S   G E N E R A L E S 
  let deck         = [];
  const tipos      = ["C", "D", "H", "S"],
        especiales = ["A", "J", "Q", "K"];

  let puntosJugadores = [];

  // R E F E R E N C I A S   H T M L
  const btnNuevo   = document.querySelector('#btnNuevo'),
        btnPedir   = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener');

  const puntosHTML         = document.querySelectorAll('small'),
        divCartasJugadores = document.querySelectorAll('.divCartas');

  // F U N C I O N E S 
  // Esta funcion Inicia el juego
  const iniciarJuego = (numJugadores = 2) => {
    deck = crearDeck();

    puntosJugadores = [];
    for(let i = 0; i < numJugadores; i++){
      puntosJugadores.push(0);
    }

    puntosHTML.forEach(elem => elem.innerText = 0);

    divCartasJugadores.forEach(elem => elem.innerHTML = '');

    btnPedir.disabled   = false;
    btnDetener.disabled = false;
  }

  // Esta funcion crea un nuevo deck
  const crearDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        deck.push(i + tipo);
      }
    }

    for (let tipo of tipos) {
      for (let esp of especiales) {
        deck.push(esp + tipo);
      }
    }

    return _.shuffle(deck);
  }

  // Esta funcion me permite tomar una carta
  const pedirCarta = () => {
    if (deck.length === 0){
      throw 'No hay cartas en el deck'
    }
    return deck.pop();
  }
  
  // Esta funcion me permite darle valor numerico a las cartas
  const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);
    return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10
            : valor * 1;
  }

  // Esta funcion acumula los puntos de los jugadores
  // Turno: 0 = primer jugador y el ultimo será la cumputadora
  const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
    puntosHTML[turno].innerText = puntosJugadores[turno];
    return puntosJugadores[turno];
  }

  // Funcion para agregar cartas al html
  const crearCarta = (carta, turno) => {
    // <img src="assets/cartas/2C.png" class="carta" alt="" />
    const imgCartas = document.createElement('img');
    imgCartas.src = `assets/cartas/${carta}.png`;
    imgCartas.classList.add('carta');
    divCartasJugadores[turno].append(imgCartas);
  }

  // Funcion de las alertar del ganador
  const ganador = () => {
    const [puntosMin, puntosComputadora] = puntosJugadores;
    
    setTimeout(() => {
      if(puntosComputadora === puntosMin ){
        alert('Empate');
      }else if(puntosMin > 21){
        alert('La computadora Ganó');
      }else if (puntosComputadora > 21){
        alert('Ganaste!!!');
      }else{
        alert('La computadora ganó')
      }
    }, 250);
  }

  // turno computadora
  const turnoPC = (puntosMin) =>{    
    let puntosComputadora = 0;

    do{
      const carta = pedirCarta();
      puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
      crearCarta(carta, puntosJugadores.length - 1);

    } while((puntosComputadora < puntosMin) && (puntosMin <= 21));
    ganador();
  }

  // E V E N T O S
  // Botón Pedir cartas
  btnPedir.addEventListener('click', () => {
    const carta = pedirCarta(),
          puntosJugador = acumularPuntos(carta, 0);

    crearCarta(carta, 0);
    
    if(puntosJugador > 21){
      console.warn('Lo siento perdiste');
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoPC(puntosJugador);
    }else if (puntosJugador === 21){
      console.warn('21!, Ganaste!');
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoPC(puntosJugador);
    }
    
  });

  // Botón Detener
  btnDetener.addEventListener('click', () => {
    btnPedir.disabled   = true;
    btnDetener.disabled = true;

    turnoPC(puntosJugadores[0]);
  });

  return {
    nuevoJuego: iniciarJuego
  }

})();




