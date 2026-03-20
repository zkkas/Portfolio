// ==============================================
// GABRIEL — PORTFÓLIO
// main.js
//
// Tudo que o CSS não resolve sozinho fica aqui.
// Cada função cuida de uma coisa só — fácil de
// editar depois sem quebrar o resto.
// ==============================================


// ==============================================
// CURSOR PERSONALIZADO
// O ponto segue o mouse na hora. O anel segue
// com um delay suave (calculado no requestAnimationFrame).
// ==============================================

function iniciaCursor() {
  const ponto = document.getElementById('cur');
  const anel  = document.getElementById('cur-ring');

  // se não encontrar os elementos, não faz nada
  if (!ponto || !anel) return;

  // posição atual do mouse
  let mouseX = 0, mouseY = 0;

  // posição do anel (atualiza mais devagar)
  let anelX = 0, anelY = 0;

  // atualiza a posição do ponto na hora que o mouse mexe
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    ponto.style.left = mouseX + 'px';
    ponto.style.top  = mouseY + 'px';
  });

  // o anel persegue o mouse com inércia (faz o efeito de lag)
  function animaAnel() {
    // interpolação: anel avança 11% da distância até o mouse a cada frame
    anelX += (mouseX - anelX) * 0.11;
    anelY += (mouseY - anelY) * 0.11;

    anel.style.left = anelX + 'px';
    anel.style.top  = anelY + 'px';

    requestAnimationFrame(animaAnel);
  }

  animaAnel();
}


// ==============================================
// SCROLL — NAV + BARRA DE PROGRESSO
// Quando a pessoa rola, o nav ganha fundo fosco
// e a barrinha no topo mostra o quanto já leu.
// ==============================================

function iniciaScroll() {
  const nav = document.getElementById('nav');
  const bar = document.getElementById('progress-bar');

  function aoRolar() {
    // adiciona classe "scrolled" depois de 60px de scroll
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }

    // calcula o percentual de leitura da página
    if (bar) {
      const alturaTotalScroll = document.body.scrollHeight - window.innerHeight;
      const porcentagem = alturaTotalScroll > 0
        ? (window.scrollY / alturaTotalScroll) * 100
        : 0;
      bar.style.width = porcentagem + '%';
    }
  }

  // passive: true = melhora performance do scroll no mobile
  window.addEventListener('scroll', aoRolar, { passive: true });
}


// ==============================================
// TEMA CLARO / ESCURO
// Salva a preferência no localStorage.
// Se não tem preferência salva, usa a do sistema.
// ==============================================

function iniciaTema() {
  const html  = document.documentElement;
  const botao = document.getElementById('theme-toggle');
  const CHAVE = 'gabriel-tema'; // nome da chave no localStorage

  // verifica o que foi salvo antes, ou pega a preferência do sistema
  const salvo  = localStorage.getItem(CHAVE);
  const sistema = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const temaInicial = salvo || sistema;

  html.setAttribute('data-theme', temaInicial);

  if (!botao) return;

  botao.addEventListener('click', () => {
    const atual  = html.getAttribute('data-theme');
    const proximo = atual === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', proximo);
    localStorage.setItem(CHAVE, proximo); // lembra da escolha pra próxima visita
  });
}


// ==============================================
// REVEAL AO ROLAR
// Elementos com a classe "reveal" começam invisíveis
// e aparecem com animação quando entram na tela.
// O IntersectionObserver é bem mais eficiente
// do que ficar checando a posição no scroll.
// ==============================================

function iniciaReveal() {
  const elementos = document.querySelectorAll('.reveal');

  if (!elementos.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada, indice) => {
        if (entrada.isIntersecting) {
          // delay leve e escalonado pra elementos que entram juntos
          const atraso = indice * 65;
          setTimeout(() => {
            entrada.target.classList.add('visible');
          }, atraso);

          // para de observar depois que já apareceu
          observer.unobserve(entrada.target);
        }
      });
    },
    {
      threshold: 0.12,       // aparece quando 12% do elemento está visível
      rootMargin: '0px 0px -40px 0px', // margem extra no fundo pra não disparar cedo
    }
  );

  elementos.forEach((el) => observer.observe(el));
}


// ==============================================
// BARRAS DE HABILIDADE
// Cada card tem data-level="65" (por exemplo).
// A barra anima de 0 até esse valor quando o
// card entra na tela.
// ==============================================

function iniciaBarrasDeHabilidade() {
  const cards = document.querySelectorAll('.skill-card[data-level]');

  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const card  = entrada.target;
          const nivel = card.getAttribute('data-level'); // ex: "65"
          const barra = card.querySelector('.skill-fill');

          if (barra) {
            // pequeno delay pra dar tempo da animação de reveal do card começar
            setTimeout(() => {
              barra.style.width = nivel + '%';
            }, 250);
          }

          observer.unobserve(card);
        }
      });
    },
    { threshold: 0.3 } // espera 30% do card aparecer antes de animar
  );

  cards.forEach((card) => observer.observe(card));
}


// ==============================================
// SMOOTH SCROLL — links internos (#ancora)
// O CSS já tem scroll-behavior: smooth, mas
// isso aqui garante o offset certo por causa
// do nav fixo no topo.
// ==============================================

function iniciaSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const idAlvo = link.getAttribute('href').slice(1); // remove o #
      const alvo   = document.getElementById(idAlvo);

      if (!alvo) return;

      e.preventDefault();

      // desconta a altura do nav fixo pra não ficar escondido atrás dele
      const alturaNav = document.getElementById('nav')?.offsetHeight || 80;
      const posicao   = alvo.getBoundingClientRect().top + window.scrollY - alturaNav - 12;

      window.scrollTo({ top: posicao, behavior: 'smooth' });
    });
  });
}


// ==============================================
// INICIALIZA TUDO
// Espera o DOM estar pronto pra chamar as funções.
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
  iniciaCursor();
  iniciaScroll();
  iniciaTema();
  iniciaReveal();
  iniciaBarrasDeHabilidade();
  iniciaSmoothScroll();
});