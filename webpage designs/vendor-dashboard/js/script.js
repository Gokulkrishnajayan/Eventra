// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
  lucide.createIcons();
  
  // Initialize sidebar toggle
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
  }
  
  // Collapse/expand sidebar
  const collapseBtn = document.querySelector('.collapse-btn');
  if (collapseBtn) {
    collapseBtn.addEventListener('click', function() {
      document.querySelector('.sidebar').classList.toggle('collapsed');
    });
  }
});

// State management
let currentEditingServiceId = null;
const services = [
  { id: 1, name: 'Premium Stage Decoration', type: 'Decoration', price: 1500, status: 'Active', bookings: 12 },
  { id: 2, name: 'Wedding Catering Package', type: 'Catering', price: 2500, status: 'Active', bookings: 8 },
  { id: 3, name: 'Corporate Event Setup', type: 'Setup', price: 1200, status: 'Inactive', bookings: 3 }
];

const bookings = [
  { id: 1, customer: 'John Smith', service: 'Premium Stage Decoration', date: '2025-07-20', status: 'Pending', amount: 1500 },
  { id: 2, customer: 'Sarah Johnson', service: 'Wedding Catering Package', date: '2025-07-25', status: 'Confirmed', amount: 2500 },
  { id: 3, customer: 'Mike Davis', service: 'Corporate Event Setup', date: '2025-07-30', status: 'Completed', amount: 1200 }
];

// Service form handling
function showServiceForm(service = null) {
  document.getElementById('service-form-modal').classList.remove('hidden');
  if (service) {
    document.getElementById('service-form-title').textContent = 'Edit Service';
    document.getElementById('service-name').value = service.name;
    document.getElementById('service-type').value = service.type;
    document.getElementById('service-price').value = service.price;
    document.getElementById('service-description').value = service.description || '';
    currentEditingServiceId = service.id;
  } else {
    document.getElementById('service-form-title').textContent = 'Add New Service';
    document.getElementById('service-name').value = '';
    document.getElementById('service-type').value = 'Decoration';
    document.getElementById('service-price').value = '';
    document.getElementById('service-description').value = '';
    currentEditingServiceId = null;
  }
}

function hideServiceForm() {
  document.getElementById('service-form-modal').classList.add('hidden');
}

function saveService() {
  const name = document.getElementById('service-name').value;
  const type = document.getElementById('service-type').value;
  const price = document.getElementById('service-price').value;
  const description = document.getElementById('service-description').value;
  
  if (!name || !price) {
    alert('Please fill in all required fields');
    return;
  }
  
  if (currentEditingServiceId) {
    // In a real app, you would update the service in your data store
    alert('Service updated successfully!');
  } else {
    // In a real app, you would add the new service to your data store
    alert('Service added successfully!');
  }
  
  hideServiceForm();
}

// Booking actions
function handleBookingAction(bookingId, action) {
  // In a real app, you would update the booking status in your data store
  alert(`Booking ${action === 'accept' ? 'confirmed' : 'rejected'}!`);
}

document.addEventListener('DOMContentLoaded', function() {
  lucide.createIcons();
  
  // Initialize sidebar toggle
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const contentArea = document.querySelector('.content-area');
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
    });
  }
  
  // Handle navigation between pages without reload
  const navLinks = document.querySelectorAll('.sidebar a[data-page]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      loadPage(pageId);
      
      // Update active state
      navLinks.forEach(navLink => navLink.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Load initial page
  const initialPage = window.location.hash.substring(1) || 'dashboard';
  loadPage(initialPage);
  document.querySelector(`.sidebar a[data-page="${initialPage}"]`).classList.add('active');
});

function loadPage(pageId) {
  const contentArea = document.querySelector('.content-area');
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.add('hidden');
  });
  
  // Show requested page
  document.getElementById(`${pageId}-page`).classList.remove('hidden');
  
  // Update URL without reload
  window.history.pushState(null, null, `#${pageId}`);
  
  // Update document title
  document.title = `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} | Vendor Dashboard`;
}

// Handle back/forward navigation
window.addEventListener('popstate', function() {
  const pageId = window.location.hash.substring(1) || 'dashboard';
  loadPage(pageId);
  
  // Update active state
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`.sidebar a[data-page="${pageId}"]`).classList.add('active');
});

// Rest of your existing JavaScript...