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

    function toggleProfileDropdown(e) {
            e.stopPropagation();
            const dropdown = document.getElementById('profileDropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }


  document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    document.querySelectorAll('.sidebar .menu-item').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active', 'bg-primary');
      } else {
        link.classList.remove('active', 'bg-primary');
      }
    });
  });

  