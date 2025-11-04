
  $(function () {

    // MENU
    $('.nav-link').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });


    // AOS ANIMATION
    AOS.init({
      disable: 'mobile',
      duration: 800,
      anchorPlacement: 'center-bottom'
    });


    // SMOOTH SCROLL
    $(function() {
      $('.nav-link').on('click', function(event) {
        var $anchor = $(this);
          $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 0
          }, 1000);
            event.preventDefault();
      });
    });  


    // PROJECT CAROUSEL
    var projectCarousels = $(".project-carousel");
    var baseCarouselOptions = {
      loop: true,
      margin: 30,
      dots: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      smartSpeed: 800,
      dotsClass: 'owl-dots custom-dots',
      responsive: {
        0: {
          items: 1,
          margin: 15
        },
        768: {
          items: 2,
          margin: 20
        },
        1200: {
          items: 3,
          margin: 30
        }
      }
    };

    projectCarousels.each(function(){
      var $carousel = $(this);
      var options = $.extend(true, {}, baseCarouselOptions);

      if ($carousel.hasClass('project-carousel-detailed')) {
        options.nav = true;
        options.navText = [
          '<span aria-label="Anterior"><i class="fa fa-chevron-left"></i></span>',
          '<span aria-label="Siguiente"><i class="fa fa-chevron-right"></i></span>'
        ];
      } else {
        options.nav = false;
      }

      $carousel.owlCarousel(options);
    });
  });


  // Additional interactive features for EduEtapas: subscriptions, reviews, login demo
  $(function(){

    // Open Moodle (placeholder) - replace href as needed
    $('#btn-moodle').on('click', function(e){
      e.preventDefault();
      // TODO: set real Moodle URL
      window.open('https://moodle.org', '_blank');
    });

    // Subscriptions - store in localStorage
    function getSubscriptions(){
      return JSON.parse(localStorage.getItem('edu_subscriptions') || '[]');
    }
    function saveSubscription(sub){
      const arr = getSubscriptions(); 
      arr.push(sub); 
      localStorage.setItem('edu_subscriptions', JSON.stringify(arr));
    }

    $('#subscription-form').on('submit', function(e){
      e.preventDefault();
      const sub = {
        email: $('#sub-email').val(),
        ciudad: $('#sub-ciudad').val(),
        telefono: $('#sub-telefono').val(),
        nombres: $('#sub-nombres').val(),
        apellidos: $('#sub-apellidos').val(),
        rol: $('#sub-rol').val(),
        created: new Date().toISOString()
      };
      if(!sub.email){ 
        Swal.fire({
          icon: 'warning',
          title: 'Campo requerido',
          text: 'Por favor ingresa un correo válido.',
          confirmButtonColor: '#057a8d'
        });
        return; 
      }
      saveSubscription(sub);
      
      Swal.fire({
        icon: 'success',
        title: '¡Gracias por suscribirte!',
        text: 'Te enviaremos descuentos y novedades a tu correo.',
        confirmButtonColor: '#057a8d',
        timer: 3000,
        timerProgressBar: true
      });
      this.reset();
    });

    // Reviews: localStorage with default reviews
    function getDefaultReviews() {
      return [
        {
          name: "Isabella Martínez",
          comment: "¡Extraordinaria plataforma! Los recursos para estudiantes con discapacidad visual han transformado mi manera de enseñar. El material es accesible y de altísima calidad. Mis estudiantes están más motivados que nunca.",
          rating: 5,
          created: "2025-11-02T09:15:00.000Z"
        },
        {
          name: "Ricardo Mendoza",
          comment: "Como profesor de educación especial, estos recursos son un tesoro. Las actividades están perfectamente adaptadas para diferentes niveles de aprendizaje y los materiales para TEA son excepcionales.",
          rating: 5,
          created: "2025-10-28T14:30:00.000Z"
        },
        {
          name: "Carmen Flores",
          comment: "La organización por etapas de desarrollo hace muy fácil encontrar el material adecuado. Los recursos para estimulación temprana son justo lo que necesitaba para mi clase de preescolar inclusivo.",
          rating: 5,
          created: "2025-10-15T11:20:00.000Z"
        },
        {
          name: "Diego Vargas",
          comment: "Fantástico banco de recursos. Las guías para adaptar actividades a diferentes necesidades educativas son muy claras y prácticas. Ha facilitado enormemente mi labor docente.",
          rating: 4,
          created: "2025-10-08T16:45:00.000Z"
        },
        {
          name: "Laura Sánchez",
          comment: "Los materiales para dislexia y TDAH son excelentes. La variedad de recursos y la calidad del contenido justifican totalmente la suscripción. Mi escuela está encantada con los resultados.",
          rating: 5,
          created: "2025-10-01T10:00:00.000Z"
        }
      ];
    }
    
    function getReviews(){
      let reviews = JSON.parse(localStorage.getItem('edu_reviews'));
      if (!reviews) {
        reviews = getDefaultReviews();
        localStorage.setItem('edu_reviews', JSON.stringify(reviews));
      }
      return reviews;
    }
    
    function saveReview(r){
      const arr = getReviews(); 
      arr.unshift(r); // newest first
      localStorage.setItem('edu_reviews', JSON.stringify(arr));
    }

    var selectedRating = 0;
    
    // Star hover and click handlers
    $('#star-rating .star').hover(
      function() {
        var rating = $(this).data('value');
        $('#star-rating .star').each(function(){
          var value = $(this).data('value');
          $(this).text(value <= rating ? '★' : '☆');
        });
      },
      function() {
        $('#star-rating .star').each(function(){
          var value = $(this).data('value');
          $(this).text(value <= selectedRating ? '★' : '☆');
        });
      }
    );
    
    $('#star-rating .star').click(function(){
      selectedRating = Number($(this).data('value')) || 0;
      $('#star-rating .star').each(function(){
        var value = Number($(this).data('value'));
        $(this).text(value <= selectedRating ? '★' : '☆');
      });
    });

    $('#review-form').on('submit', function(e){
      e.preventDefault();
      var name = $('#review-name').val() || 'Anónimo';
      var comment = $('#review-comment').val() || '';
      if(selectedRating === 0){ 
        Swal.fire({
          icon: 'warning',
          title: 'Calificación requerida',
          text: 'Por favor selecciona una calificación (1-5 estrellas).',
          confirmButtonColor: '#057a8d'
        });
        return; 
      }
      var review = {name:name, comment:comment, rating:selectedRating, created:new Date().toISOString()};
      saveReview(review);
      renderReviews();
      this.reset(); 
      selectedRating = 0; 
      $('#star-rating .star').text('☆');
      
      Swal.fire({
        icon: 'success',
        title: '¡Gracias por tu reseña!',
        text: 'Tu opinión nos ayuda a mejorar.',
        confirmButtonColor: '#057a8d',
        timer: 2000,
        timerProgressBar: true
      });
    });

    function renderReviews(){
      var container = $('#reviews-list'); 
      container.empty();
      var reviews = getReviews();
      if(reviews.length === 0){ 
        container.append('<p class="text-muted">Aún no hay reseñas. Sé el primero en comentar.</p>'); 
        return; 
      }
      reviews.forEach(function(r){
        var stars = '';
        for(var i=1;i<=5;i++){ stars += (i<=r.rating) ? '★' : '☆'; }
        var date = new Date(r.created).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        var el = '<div class="card mb-4" style="background:var(--white-color);border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">'
               + '<div class="d-flex justify-content-between align-items-center mb-2">'
               + '<strong class="text-primary">'+ (r.name||'Anónimo') +'</strong>'
               + '<small class="text-muted">'+ date +'</small>'
               + '</div>'
               + '<div class="mb-3" style="color:var(--secondary-color);font-size:18px;">'+stars+'</div>'
               + '<div style="color:var(--p-color);line-height:1.6">'+ (r.comment||'') +'</div>'
               + '</div>';
        container.append(el);
      });
    }

    // initial render
    renderReviews();

    // Login form functionality
    $('#login-form').on('submit', function(e){
      e.preventDefault();
      const email = $('#login-email').val();
      const password = $('#login-password').val();

      if (!email || !password) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos requeridos',
          text: 'Por favor completa todos los campos.',
          confirmButtonColor: '#057a8d'
        });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Swal.fire({
          icon: 'error',
          title: 'Email inválido',
          text: 'Por favor ingresa un correo electrónico válido.',
          confirmButtonColor: '#057a8d'
        });
        return;
      }

      Swal.fire({
        icon: 'info',
        title: 'Acceso demo',
        text: 'Esto es una demostración visual. La autenticación real se integrará con el backend.',
        confirmButtonColor: '#057a8d',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        confirmButtonText: 'Entendido'
      }).then((result) => {
        if (result.isConfirmed) {
          $('#loginModal').modal('hide');
        }
      });
    });

  // Toggle password visibility
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('loginPassword');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');

  if(togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function(e) {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.querySelector('i').classList.toggle('fa-eye');
      this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // También permitir toggle con la tecla Enter
    togglePassword.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
      }
    });
  }

  // Manejar el clic en "Olvidaste tu contraseña"
  if(forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      // Aquí puedes mostrar un formulario de recuperación de contraseña
      const email = document.getElementById('loginEmail').value;
      if(email) {
        // Si hay un email ingresado, lo pre-llenamos en el formulario de recuperación
        alert('Se enviará un correo de recuperación a: ' + email);
      } else {
        // Si no hay email, pedimos que lo ingresen primero
        document.getElementById('loginEmail').focus();
        // Añadir clase para destacar el campo
        document.getElementById('loginEmail').classList.add('is-invalid');
        setTimeout(() => {
          document.getElementById('loginEmail').classList.remove('is-invalid');
        }, 3000);
      }
    });
  }    // Input focus effects
    $('.form-control').on('focus', function() {
      $(this).closest('.input-group').addClass('focused');
    }).on('blur', function() {
      $(this).closest('.input-group').removeClass('focused');
    });

    // Register button click
    $('#btn-register').on('click', function(){
      Swal.fire({
        icon: 'info',
        title: 'Registro demo',
        html: 'Por ahora solo visual. El registro real se conectará con el servidor o Moodle.<br><br>' +
              '<small class="text-muted">Los registros estarán disponibles próximamente</small>',
        confirmButtonColor: '#057a8d',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        confirmButtonText: 'Entendido'
      });
    });

    // Interceptar botón de descarga
    $('#btn-descarga').on('click', function(e) {
      e.preventDefault();
      Swal.fire({
        title: 'Descargando recurso...',
        text: 'El archivo comenzará a descargarse en un momento',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      }).then(() => {
        // Iniciar la descarga real
        window.location.href = $(this).attr('href');
      });
    });

  });




