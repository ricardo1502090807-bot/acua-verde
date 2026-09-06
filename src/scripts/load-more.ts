// Lógica reutilizada por NoticiasGrid.astro e InvestigacionGrid.astro.
// Antes vivía duplicada (y con el tiempo desincronizada: la versión de
// investigaciones manejaba "página vacía" y error 404, la de noticias no).
// Ahora hay una sola fuente de verdad para las dos.
const wrappers = document.querySelectorAll('.content-wrapper');

wrappers.forEach(wrapper => {
  const grid = wrapper.querySelector('.content-grid');
  const btn = wrapper.querySelector('.load-more-btn') as HTMLButtonElement | null;
  const btnContainer = wrapper.querySelector('.load-more-container');

  if (!grid || !btn) return;

  const totalPages = parseInt(wrapper.getAttribute('data-total-pages') || '1', 10);
  const contentType = wrapper.getAttribute('data-type') || 'noticia';
  let currentPage = 1;

  btn.addEventListener('click', async () => {
    currentPage++;
    btn.disabled = true;
    btn.innerText = 'Cargando...';

    try {
      const response = await fetch(`/api/more-content?type=${contentType}&page=${currentPage}`);

      if (response.ok) {
        const html = await response.text();

        // Si WordPress devolvió una página vacía, no hay más contenido: quitamos el botón.
        if (!html.trim() && btnContainer) {
          btnContainer.remove();
          return;
        }

        grid.insertAdjacentHTML('beforeend', html);
      } else if (response.status === 404 && btnContainer) {
        btnContainer.remove();
        return;
      }
    } catch (error) {
      console.error('Error al cargar más contenido:', error);
    } finally {
      btn.disabled = false;
      btn.innerText = `Cargar más ${contentType === 'noticia' ? 'noticias' : 'investigaciones'}`;

      if (currentPage >= totalPages && btnContainer) {
        btnContainer.remove();
      }
    }
  });
});