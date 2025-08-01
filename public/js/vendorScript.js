

  // === ICON INITIALIZATION ===
  lucide.createIcons();

  // === SIDEBAR TOGGLE AND RESPONSIVENESS ===
  function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
  }

  function checkScreenSize() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (window.innerWidth < 992) {
      mobileMenuBtn?.classList.remove('d-none');
    } else {
      mobileMenuBtn?.classList.add('d-none');
      document.querySelector('.sidebar')?.classList.remove('active');
    }
  }

  window.addEventListener('resize', checkScreenSize);
  checkScreenSize();

  // === FULLCALENDAR SETUP (ON PAGE LOAD OR MODAL) ===
  document.addEventListener('DOMContentLoaded', function () {
    const calendarModal = document.getElementById('calendarModal');
    let calendar;

    function renderCalendar() {
      const calendarEl = document.getElementById('calendar');
      if (!calendarEl) return;

      calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        height: 'auto',
        events: [
          { title: 'Wedding Photography', start: '2025-08-12', end: '2025-08-12', color: '#6366f1' },
          { title: 'Birthday Shoot', start: '2025-08-18', end: '2025-08-18', color: '#10b981' },
          { title: 'Corporate Event', start: '2025-08-22', end: '2025-08-22', color: '#3b82f6' },
          { title: 'Unavailable', start: '2025-09-05', end: '2025-09-08', color: '#ef4444', display: 'background' }
        ],
        dayMaxEvents: 2,
        dayMaxEventRows: 2
      });

      calendar.render();
    }

    if (calendarModal) {
      calendarModal.addEventListener('shown.bs.modal', renderCalendar);
      calendarModal.addEventListener('hidden.bs.modal', () => calendar?.destroy());
    } else {
      renderCalendar();
    }
  });

  // === SWIPER IMAGE GALLERY FOR SERVICES ===
  let serviceGallerySwiper = null;

  function initServiceGallery() {
    serviceGallerySwiper = new Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }

  function loadServiceImages(serviceId) {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    if (!swiperWrapper) return;

    swiperWrapper.innerHTML = '';
    const images = serviceId === 1
      ? [
          'https://source.unsplash.com/random/800x600/?wedding,photography',
          'https://source.unsplash.com/random/800x600/?wedding,photoshoot',
          'https://source.unsplash.com/random/800x600/?wedding,camera'
        ]
      : [
          'https://source.unsplash.com/random/800x600/?ballroom',
          'https://source.unsplash.com/random/800x600/?wedding,hall',
          'https://source.unsplash.com/random/800x600/?event,venue'
        ];

    images.forEach(img => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `<img src="${img}" alt="Service Image">`;
      swiperWrapper.appendChild(slide);
    });

    if (serviceGallerySwiper) {
      serviceGallerySwiper.update();
    } else {
      initServiceGallery();
    }
  }

  const serviceGalleryModal = document.getElementById('serviceGalleryModal');
  serviceGalleryModal?.addEventListener('shown.bs.modal', () => {
    if (serviceGallerySwiper) serviceGallerySwiper.update();
  });

  // function updateServiceForm() {
  //   const serviceType = document.getElementById('serviceTypeSelect').value;
  //   const venueForm = document.getElementById('venueForm');
  //   const otherServiceForm = document.getElementById('otherServiceForm');

  //   venueForm.classList.remove('active');
  //   otherServiceForm.classList.remove('active');

  //   if (serviceType === 'venue') {
  //     venueForm.classList.add('active');
  //     document.getElementById('specificServiceType').value = 'Venue';
  //   } else if (serviceType === 'other') {
  //     otherServiceForm.classList.add('active');
  //     document.getElementById('specificServiceTypelabel').style='display: block;';
  //     document.getElementById('specificServiceType').style='display: block;';
  //     document.getElementById('specificServiceType').value = '';
  //   } else {
  //     otherServiceForm.classList.add('active');
  //     document.getElementById('specificServiceTypelabel').style='display: none;';
  //     document.getElementById('specificServiceType').style='display: none;';
  //     document.getElementById('specificServiceType').value =
  //       serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
  //   }
  // }

  // function showEditModal(serviceId) {
  //   const editModal = new bootstrap.Modal(document.getElementById('editServiceModal'));
  //   editModal.show();
  // }

  // === TOAST NOTIFICATION ===
  function showToast(message, type = 'info') {
    const toastContainer = getOrCreateToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  }

  function getOrCreateToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container position-fixed top-0 end-0 p-3';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
    return container;
  }

  // === EXPORT REPORT (SIMULATION) ===
  function exportReport() {
    showToast('Exporting report... This may take a moment.', 'info');
    setTimeout(() => {
      showToast('Report exported successfully!', 'success');
    }, 2000);
  }

  // === REVIEW/REPLY MANAGEMENT ===
  function editReply(id) {
    document.getElementById(`reply-${id}`).classList.add('d-none');
    document.getElementById(`edit-form-${id}`).classList.remove('d-none');
    document.getElementById(`actions-${id}`).classList.add('d-none');
    lucide.createIcons();
  }

  function cancelEdit(id) {
    document.getElementById(`reply-${id}`).classList.remove('d-none');
    document.getElementById(`edit-form-${id}`).classList.add('d-none');
    document.getElementById(`actions-${id}`).classList.remove('d-none');
  }

  function saveReply(id) {
    const textarea = document.getElementById(`edit-textarea-${id}`);
    const newText = textarea.value.trim();
    if (newText) {
      document.querySelector(`#reply-${id} .reply-text`).textContent = newText;
      cancelEdit(id);
      showToast('Reply updated successfully!', 'success');
    } else {
      showToast('Please enter a reply message.', 'error');
    }
  }

  function showAddForm(id) {
    document.getElementById(`add-form-${id}`).classList.remove('d-none');
    document.getElementById(`actions-${id}`).classList.add('d-none');
    document.getElementById(`add-textarea-${id}`).focus();
    lucide.createIcons();
  }

  function cancelAdd(id) {
    const form = document.getElementById(`add-form-${id}`);
    form.classList.add('d-none');
    document.getElementById(`actions-${id}`).classList.remove('d-none');
    document.getElementById(`add-textarea-${id}`).value = '';
  }

  function addReply(id) {
    const textarea = document.getElementById(`add-textarea-${id}`);
    const replyText = textarea.value.trim();

    if (replyText) {
      document.getElementById(`reply-text-${id}`).textContent = replyText;
      document.getElementById(`reply-date-${id}`).textContent = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      document.getElementById(`reply-${id}`).classList.remove('d-none');
      document.getElementById(`add-form-${id}`).classList.add('d-none');
      document.getElementById(`actions-${id}`).innerHTML = `
        <button class="btn btn-sm btn-outline-primary" onclick="editNewReply(${id})">
          <i data-lucide="edit" class="lucide me-1"></i> Edit Reply
        </button>
      `;
      document.getElementById(`actions-${id}`).classList.remove('d-none');
      textarea.value = '';
      lucide.createIcons();
      showToast('Reply added successfully!', 'success');
    } else {
      showToast('Please enter a reply message.', 'error');
    }
  }

  function editNewReply(id) {
    const currentText = document.getElementById(`reply-text-${id}`).textContent;
    const reply = document.getElementById(`reply-${id}`);
    const actions = document.getElementById(`actions-${id}`);

    const form = document.createElement('div');
    form.className = 'edit-reply-form';
    form.id = `edit-new-form-${id}`;
    form.innerHTML = `
      <div class="mb-2">
        <label class="form-label fw-semibold">Edit Your Reply</label>
        <textarea class="form-control" rows="3" id="edit-new-textarea-${id}">${currentText}</textarea>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-primary" onclick="saveNewReply(${id})">
          <i data-lucide="check" class="lucide me-1"></i> Save
        </button>
        <button class="btn btn-sm btn-outline-secondary" onclick="cancelEditNew(${id})">
          <i data-lucide="x" class="lucide me-1"></i> Cancel
        </button>
      </div>
    `;

    reply.classList.add('d-none');
    actions.classList.add('d-none');
    reply.parentNode.insertBefore(form, actions);
    lucide.createIcons();
  }

  function cancelEditNew(id) {
    document.getElementById(`reply-${id}`).classList.remove('d-none');
    document.getElementById(`actions-${id}`).classList.remove('d-none');
    document.getElementById(`edit-new-form-${id}`).remove();
  }

  function saveNewReply(id) {
    const newText = document.getElementById(`edit-new-textarea-${id}`).value.trim();
    if (newText) {
      document.getElementById(`reply-text-${id}`).textContent = newText;
      cancelEditNew(id);
      showToast('Reply updated successfully!', 'success');
    } else {
      showToast('Please enter a reply message.', 'error');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      const linkPath = link.getAttribute('href');

      // Normalize paths (remove trailing slash)
      const normalizedCurrent = currentPath.replace(/\/$/, '');
      const normalizedLink = linkPath.replace(/\/$/, '');

      // Check if the current path starts with the link path
      if (normalizedCurrent === normalizedLink || normalizedCurrent.startsWith(normalizedLink)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });

  
 document.addEventListener('DOMContentLoaded', function () {
    lucide.createIcons();
  });

  let swiperInstance;

  function loadServiceImagesFromArray(btn) {
    const imageList = JSON.parse(btn.getAttribute('data-images') || '[]');
    const wrapper = document.querySelector('#serviceGalleryModal .swiper-wrapper');
    wrapper.innerHTML = '';

    if (imageList.length > 0) {
      imageList.forEach(filename => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `<img src="/uploads/${filename}" class="img-fluid rounded w-100" alt="Service Image">`;
        wrapper.appendChild(slide);
      });
    } else {
      wrapper.innerHTML = '<div class="text-muted text-center p-4">No images uploaded.</div>';
    }

    // Init or update Swiper
    if (swiperInstance) {
      swiperInstance.update();
    } else {
      swiperInstance = new Swiper('.swiper', {
        loop: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('serviceGalleryModal'));
    modal.show();
  }

  function selectFilter(type, value) {
    if (type === 'category') {
      document.getElementById('categoryInput').value = value;
    } else if (type === 'status') {
      document.getElementById('statusInput').value = value;
    }
    document.querySelector('form').submit();
  }

  function updateServiceForm() {
    const type = document.getElementById('serviceTypeSelect').value;
    const shared = document.getElementById('sharedFields');
    const venue = document.getElementById('venueSection');
    const customType = document.getElementById('specificServiceTypeWrapper');

    // Reset visibility
    shared.style.display = type ? 'block' : 'none';
    venue.style.display = type === 'venue' ? 'block' : 'none';
    customType.style.display = type === 'other' ? 'block' : 'none';
  }


  document.addEventListener('DOMContentLoaded', updateServiceForm);

  function openEditModal(serviceId) {
    fetch(`/vendor/services/${serviceId}`)
      .then(res => res.json())
      .then(service => {
        const form = document.getElementById('editServiceForm');
        document.getElementById('editServiceId').value = service._id; // Set hidden input

        // Fill other fields like before...
        form.name.value = service.name || '';
        form.pricing.value = service.price || '';
        form.contactNumber.value = service.contactNumber || '';
        form.description.value = service.description || '';
        form.availabilityStart.value = service.availability?.start?.slice(0, 10) || '';
        form.availabilityEnd.value = service.availability?.end?.slice(0, 10) || '';
        form.active.checked = service.available;

        // Service type + Venue-specific
        const type = service.category?.toLowerCase();
        const select = document.getElementById("editServiceTypeSelect");
        const isOther = !['venue', 'catering', 'photography', 'decoration', 'entertainment'].includes(type);
        select.value = isOther ? 'other' : type;
        toggleEditServiceFields();
        if (isOther) form.specificServiceType.value = service.category;

        if (type === 'venue') {
          form.location.value = service.location || '';
          form.mapCoordinates.value = service.mapCoordinates || '';
          form.capacity.value = service.capacity || '';
          const amenities = service.amenities || [];
          ['Parking', 'AC', 'Stage', 'Lighting', 'Sound System', 'Catering'].forEach(name => {
            const checkbox = document.querySelector(`#editAmenity${name.replace(/\s/g, '')}`);
            if (checkbox) checkbox.checked = amenities.includes(name);
          });
        }

        renderExistingImages(service.images || []);
        new bootstrap.Modal(document.getElementById('editServiceModal')).show();
      })
      .catch(err => console.error('Error loading service:', err));

    document.getElementById('editServiceForm').addEventListener('submit', function () {
      const select = document.getElementById('editServiceTypeSelect');
      const hiddenInput = document.getElementById('hiddenServiceTypeInput');
      hiddenInput.value = select.value;
    });

  }


  function renderExistingImages(images) {
    const container = document.getElementById('existingImagesContainer');
    container.innerHTML = '';
    images.forEach(img => {
      const div = document.createElement('div');
      div.className = 'position-relative';
      div.innerHTML = `
        <img src="/uploads/${img}" class="rounded" style="width: 80px; height: 80px; object-fit: cover;">
        <button type="button" class="btn-close position-absolute top-0 end-0 bg-white p-1 border rounded-circle"
          onclick="removeImage('${img}', this)">
        </button>`;
      container.appendChild(div);
    });
  }

  function removeImage(filename, btn) {
    btn.closest('div').remove(); // visually remove
    // optionally: store filenames to delete on form submit
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = 'deletedImages';
    hidden.value = filename;
    document.getElementById('editServiceForm').appendChild(hidden);
  }

  function toggleEditServiceFields() {
    const type = document.getElementById("editServiceTypeSelect")?.value;
    const venueSection = document.getElementById("editVenueFields");
    const specificWrapper = document.getElementById("editSpecificTypeWrapper");

    if (type === 'venue') {
      venueSection.style.display = 'block';
      specificWrapper.style.display = 'none';
    } else if (type === 'other') {
      venueSection.style.display = 'none';
      specificWrapper.style.display = 'block';
    } else {
      venueSection.style.display = 'none';
      specificWrapper.style.display = 'none';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    toggleEditServiceFields();
    document.getElementById("editServiceTypeSelect")?.addEventListener("change", toggleEditServiceFields);
  });


  function showDeleteConfirmation() {
    // Hide the edit modal first
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editServiceModal'));
    if (editModal) editModal.hide();

    // Set the serviceId into hidden input
    const serviceId = document.getElementById('editServiceId').value;
    document.getElementById('confirmDeleteServiceId').value = serviceId;

    // Show the delete confirmation modal
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    confirmModal.show();
  }

  function reopenEditModal() {
    const editModal = new bootstrap.Modal(document.getElementById('editServiceModal'));
    editModal.show();
  }




  function deleteServiceConfirmed() {
    // TODO: Connect this to actual deletion logic via service ID
    console.log('Service deletion confirmed. Connect this to backend later.');

    // Close modals after delete
    bootstrap.Modal.getInstance(document.getElementById('editServiceModal')).hide();
    bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal')).hide();

    // Optionally show success toast or reload the page
  }
