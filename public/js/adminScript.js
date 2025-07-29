
                // Section switching
        function showSection(sectionId) {
            // Hide all sections
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Remove active class from all menu items
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => item.classList.remove('active'));
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            
            // Add active class to clicked menu item
            event.target.classList.add('active');
        }

        // Sidebar toggle
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('open');
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            const sidebar = document.getElementById('sidebar');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            
            if (window.innerWidth <= 768 && 
                !sidebar.contains(event.target) && 
                !menuBtn.contains(event.target) && 
                sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });

        // Tab switching functions
        function changeVenueTab(tabName) {
            const tabs = document.querySelectorAll('#venues .tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            // In a real app, you would filter the venue list here
        }

        function changeVendorTab(tabName) {
            const tabs = document.querySelectorAll('#vendors .tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            // In a real app, you would filter the vendor list here
        }

        function changeBookingTab(tabName) {
            const tabs = document.querySelectorAll('#bookings .tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            // In a real app, you would filter the booking list here
        }

        function changePaymentTab(tabName) {
            const tabs = document.querySelectorAll('#payments .tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            // In a real app, you would filter the payment list here
        }

        function changeFeedbackTab(tabName) {
            const tabs = document.querySelectorAll('#feedback .tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            // In a real app, you would filter the feedback list here
        }

        function changeReportTab(tabName) {
            const tabs = document.querySelectorAll('#reports .tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            // In a real app, you would change the report type here
        }

        function changeSettingTab(tabName) {
            const tabs = document.querySelectorAll('#settings .tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            // In a real app, you would show different settings sections here
        }

        // Modal functions
        function showUserModal() {
            document.getElementById('userModal').classList.add('active');
        }

        function showVenueImportModal() {
            document.getElementById('venueModal').classList.add('active');
        }

        function showBookingModal() {
            document.getElementById('bookingModal').classList.add('active');
        }

        function showPaymentModal() {
            document.getElementById('paymentModal').classList.add('active');
        }

        function showFeedbackModal() {
            document.getElementById('feedbackModal').classList.add('active');
        }

        function showPricingModal() {
            document.getElementById('pricingModal').classList.add('active');
        }

        function showNotifications() {
            document.getElementById('notificationsModal').classList.add('active');
        }

        function hideModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        function toggleProfileMenu() {
            // In a real app, this would show a dropdown menu
            alert('Profile menu would open here');
        }

        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('active');
            }
        });

  document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    document.querySelectorAll('.sidebar .menu-item').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active'); // optional cleanup
      }
    });
  });

