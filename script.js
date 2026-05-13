// Clean B2B Inquiry Handler
document.addEventListener('DOMContentLoaded', () => {
  const catalogCopyBtn = document.querySelector('[data-copy]');
  
  if (catalogCopyBtn) {
    catalogCopyBtn.addEventListener('click', async () => {
      const text = catalogCopyBtn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(text);
        const originalText = catalogCopyBtn.innerText;
        catalogCopyBtn.innerText = 'Inquiry Copied';
        setTimeout(() => catalogCopyBtn.innerText = originalText, 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});