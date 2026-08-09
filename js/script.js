/* ================================================================
   ESSENCE STUDIO — Script principal
================================================================ */

(function () {
  'use strict';

  // ==================== DOM ELEMENTS ====================
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const faqItems = document.querySelectorAll('.faq-item');
  const modals = document.querySelectorAll('.modal');

  // ==================== HEADER SCROLL ====================
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    updateActiveNavLink();
  }

  // ==================== ACTIVE NAV LINK ON SCROLL ====================
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;

    let currentId = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  // ==================== MOBILE MENU ====================
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('hamburger--active');
    nav.classList.toggle('nav--open');
  });

  // Fecha o menu ao clicar em um link
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('hamburger--active');
      nav.classList.remove('nav--open');
    });
  });

  // Fecha o menu ao clicar fora
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('hamburger--active');
      nav.classList.remove('nav--open');
    }
  });

  // ==================== TABS DE PROCEDIMENTOS ====================
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = this.getAttribute('data-tab');

      // Atualiza tabs
      tabs.forEach(function (t) { t.classList.remove('tab--active'); });
      this.classList.add('tab--active');

      // Atualiza conteúdos
      tabContents.forEach(function (content) { content.classList.remove('tab-content--active'); });
      var activeContent = document.getElementById('tab-' + target);
      if (activeContent) {
        activeContent.classList.add('tab-content--active');
      }
    });
  });

  // ==================== FAQ ACCORDION ====================
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-item__question');
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('faq-item--open');

      // Fecha todos
      faqItems.forEach(function (faq) { faq.classList.remove('faq-item--open'); });

      // Abre o clicado (se não estava aberto)
      if (!isOpen) {
        item.classList.add('faq-item--open');
      }
    });
  });

  // ==================== MODALS ====================
  function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('modal--open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('modal--open');
      document.body.style.overflow = '';
    }
  }

  function closeAllModals() {
    modals.forEach(function (modal) {
      modal.classList.remove('modal--open');
    });
    document.body.style.overflow = '';
  }

  // Fechar modal pelo botão X
  document.querySelectorAll('.modal__close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modalId = this.getAttribute('data-close');
      closeModal(modalId);
    });
  });

  // Fechar modal clicando no overlay
  document.querySelectorAll('.modal__overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function () {
      closeAllModals();
    });
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // ==================== BOTÕES QUE ABREM MODAIS ====================
  var openQuiz = document.getElementById('open-quiz');
  if (openQuiz) {
    openQuiz.addEventListener('click', function () { openModal('modal-quiz'); });
  }

  var openGuide = document.getElementById('open-guide');
  if (openGuide) {
    openGuide.addEventListener('click', function () { openModal('modal-guide'); });
  }

  var openPreCadastro = document.getElementById('open-pre-cadastro');
  if (openPreCadastro) {
    openPreCadastro.addEventListener('click', function () { openModal('modal-pre-cadastro'); });
  }

  var openVoucher = document.getElementById('open-voucher');
  if (openVoucher) {
    openVoucher.addEventListener('click', function () { openModal('modal-voucher'); });
  }

  // Botão "Agende" no header também abre modal de agendamento (scroll)
  var headerAgende = document.querySelector('.btn--header');
  if (headerAgende) {
    headerAgende.addEventListener('click', function (e) {
      e.preventDefault();
      var schedule = document.getElementById('schedule');
      if (schedule) {
        schedule.scrollIntoView({ behavior: 'smooth' });
      }
      hamburger.classList.remove('hamburger--active');
      nav.classList.remove('nav--open');
    });
  }

  // ==================== QUIZ DIAGNÓSTICO ====================
  var quizForm = document.getElementById('quiz-form');
  var quizResult = document.getElementById('quiz-result');
  var quizResultText = document.getElementById('quiz-result-text');

  if (quizForm) {
    quizForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var selects = quizForm.querySelectorAll('select');
      var faceShape = selects[0].value;
      var thickness = selects[1].value;
      var gaps = selects[2].value;
      var style = selects[3].value;

      var result = '';

      // Lógica do diagnóstico
      if (faceShape === 'oval') {
        result = 'Seu rosto oval é considerado o formato mais versátil! ' +
          'Fica linda com sobrancelhas levemente arqueadas e angulosas, ' +
          'com um arco suave no meio da sobrancelha.';
      } else if (faceShape === 'redondo') {
        result = 'Para rostos redondos, o ideal são sobrancelhas com arco mais alto e ângulos definidos, ' +
          'o que ajuda a alongar visualmente o rosto. Fuja de formatos muito arredondados.';
      } else if (faceShape === 'quadrado') {
        result = 'Rostos quadrados harmonizam com sobrancelhas mais grossas e um arco bem definido, ' +
          'que suaviza os ângulos da mandíbula. Um formato levemente curvado é perfeito para você.';
      } else if (faceShape === 'coracao') {
        result = 'Para rosto em formato de coração, sobrancelhas arredondadas e com curvatura suave ' +
          'ajudam a equilibrar a testa mais larga e o queixo mais fino. Evite arcos muito marcados.';
      } else if (faceShape === 'longo') {
        result = 'Rostos longos ficam incríveis com sobrancelhas mais retas e horizontais, ' +
          'com pouca curvatura. Isso ajuda a "encurtar" visualmente o rosto e dar mais equilíbrio.';
      }

      // Personalização por espessura
      if (thickness === 'fino') {
        result += ' Como seus fios são finos, recomendamos o Design com Henna para dar mais presença sem pesar.';
      } else if (thickness === 'grosso') {
        result += ' Seus fios naturalmente grossos permitem um design mais definido com efeito esfumado.';
      } else {
        result += ' Seus fios médios são versáteis — tanto o design fio a fio quanto a micropigmentação trarão ótimos resultados.';
      }

      // Personalização por falhas
      if (gaps === 'muitas') {
        result += ' Como você tem muitas falhas, a Micropigmentação (Nanoblading) pode ser a melhor escolha para um resultado duradouro e natural.';
      } else if (gaps === 'sim') {
        result += ' Para corrigir as falhas pontuais, o Design Fio a Fio com henna resolve perfeitamente.';
      } else {
        result += ' Com sobrancelhas cheias, um design de manutenção para definir o formato já fará toda diferença.';
      }

      // Personalização por estilo
      if (style === 'natural') {
        result += ' Por fim, seu estilo natural combina com um design leve e sutil, que realça sem artificialidade.';
      } else if (style === 'definido') {
        result += ' Seu estilo definido pede traços precisos e contornos marcados — o esfumado é ideal para você.';
      } else {
        result += ' Seu estilo marcante fica incrível com sobrancelhas mais preenchidas e um arco bem desenhado.';
      }

      quizResultText.textContent = result;
      quizForm.style.display = 'none';
      quizResult.style.display = 'block';
    });
  }

  // ==================== FORMULÁRIO DE AGENDAMENTO ====================
  var scheduleForm = document.getElementById('schedule-form');
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('s-name').value.trim();
      var procedure = document.getElementById('s-procedure');
      var procName = procedure.options[procedure.selectedIndex].text;
      var procValue = procedure.value;
      var dateValue = document.getElementById('s-date').value;
      var timeValue = document.getElementById('s-time').value;
      var phoneValue = document.getElementById('s-phone').value.trim();
      var notesValue = document.getElementById('s-notes').value.trim();

      // Envia para o backend
      fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: name,
          whatsapp: phoneValue,
          procedimento: procName,
          data: dateValue,
          horario: timeValue,
          observacoes: notesValue
        })
      })
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.sucesso) {
          // Monta mensagem para WhatsApp
          var message =
            'Olá, Essence Studio! 💫%0A%0A' +
            'Gostaria de agendar um horário:%0A' +
            '👤 Nome: ' + encodeURIComponent(name) + '%0A' +
            '💆‍♀️ Procedimento: ' + encodeURIComponent(procName) + '%0A' +
            '📅 Data: ' + encodeURIComponent(dateValue) + '%0A' +
            '⏰ Horário: ' + encodeURIComponent(timeValue);

          if (notesValue) {
            message += '%0A📝 Obs: ' + encodeURIComponent(notesValue);
          }

          var whatsappUrl = 'https://wa.me/5582996829318?text=' + message;
          window.open(whatsappUrl, '_blank');

          scheduleForm.reset();
          showToast('Agendamento enviado com sucesso! ✅');
        } else {
          showToast('Erro ao enviar. Tente novamente.');
        }
      })
      .catch(function() {
        showToast('Servidor não encontrado. Abrindo WhatsApp...');
        // Fallback: abre WhatsApp mesmo sem backend
        var message =
          'Olá, Essence Studio! 💫%0A%0A' +
          'Gostaria de agendar um horário:%0A' +
          '👤 Nome: ' + encodeURIComponent(name) + '%0A' +
          '💆‍♀️ Procedimento: ' + encodeURIComponent(procName) + '%0A' +
          '📅 Data: ' + encodeURIComponent(dateValue) + '%0A' +
          '⏰ Horário: ' + encodeURIComponent(timeValue);
        var whatsappUrl = 'https://wa.me/5582996829318?text=' + message;
        window.open(whatsappUrl, '_blank');
        scheduleForm.reset();
      });
    });
  }

  // ==================== PRÉ-CADASTRO ====================
  var preCadastroForm = document.getElementById('pre-cadastro-form');
  if (preCadastroForm) {
    preCadastroForm.addEventListener('submit', function (e) {
      e.preventDefault();
      closeModal('modal-pre-cadastro');
      preCadastroForm.reset();
      showToast('Pré-cadastro enviado com sucesso! Entraremos em contato.');
    });
  }

  // ==================== VOUCHER ====================
  var voucherForm = document.getElementById('voucher-form');
  if (voucherForm) {
    voucherForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = voucherForm.querySelectorAll('input')[0].value.trim();
      var presenteada = voucherForm.querySelectorAll('input')[1].value.trim();

      // Simula geração de voucher
      closeModal('modal-voucher');
      voucherForm.reset();
      showToast('🎁 Voucher gerado com sucesso para ' + presenteada + '! Enviamos no seu WhatsApp.');
    });
  }

  // ==================== GUIA DE MANUTENÇÃO ====================
  var guideForm = document.querySelector('.guide-form');
  if (guideForm) {
    guideForm.addEventListener('submit', function (e) {
      e.preventDefault();
      closeModal('modal-guide');
      showToast('📧 Guia enviado para seu e-mail! Confira sua caixa de entrada.');
    });
  }

  // ==================== NEWSLETTER ====================
  var newsletterForm = document.querySelector('.footer__newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = newsletterForm.querySelector('input');
      var email = emailInput.value.trim();
      emailInput.value = '';
      showToast('✨ Bem-vinda à nossa comunidade! Você receberá nossas novidades em ' + email);
    });
  }

  // ==================== TOAST NOTIFICATION ====================
  function showToast(message) {
    // Remove toast existente
    var existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Força reflow para a animação
    toast.offsetHeight;
    toast.classList.add('toast--visible');

    setTimeout(function () {
      toast.classList.remove('toast--visible');
      setTimeout(function () {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 400);
    }, 3500);
  }

  // ==================== SWIPER (GALERIA ANTES E DEPOIS) ====================
  // eslint-disable-next-line no-undef
  if (typeof Swiper !== 'undefined') {
    new Swiper('.gallery-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 2.5,
          spaceBetween: 28,
        },
      },
    });
  }

  // ==================== SCROLL REVEAL (ANIMAÇÃO SUAVE) ====================
  function revealOnScroll() {
    var revealElements = document.querySelectorAll(
      '.diff-card, .testimonial-card, .procedure-card, .blog-card, .about__content, .schedule-form, .schedule-info-card'
    );

    revealElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var windowHeight = window.innerHeight;
      if (rect.top < windowHeight - 60 && !el.classList.contains('animate-in')) {
        el.classList.add('animate-in');
      }
    });
  }

  // ==================== MÁSCARA DE TELEFONE ====================
  function applyPhoneMask(input) {
    input.addEventListener('input', function () {
      var value = this.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length <= 2) {
        this.value = value.length ? '(' + value : '';
      } else if (value.length <= 7) {
        this.value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
      } else {
        this.value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
      }
    });
  }

  var phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(applyPhoneMask);

  // ==================== INIT ====================
  window.addEventListener('scroll', onScroll);
  window.addEventListener('load', function () {
    onScroll();
    revealOnScroll();
  });

  // Dispara reveal no scroll
  var revealTimeout;
  window.addEventListener('scroll', function () {
    if (revealTimeout) clearTimeout(revealTimeout);
    revealTimeout = setTimeout(revealOnScroll, 50);
  });

})();