// Импорт библиотек
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

// API ключ
const API_KEY = '37350286-5f3aac9a725d44d4223b6e61c';

// Форма поиска
const searchForm = document.getElementById('search-form');
const searchInput = searchForm.querySelector('input');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

// Параметры запроса
let searchQuery = '';
let page = 1;
const perPage = 40;

// Инициализация SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a');

// Функция для выполнения запроса и обновления галереи
const fetchImages = async () => {
   if (images.length === perPage) {
    loadMoreBtn.style.display = 'block';
    applyButtonStyles(); // Добавьте вызов функции applyButtonStyles()
  } else {
    loadMoreBtn.style.display = 'none';
  }
    try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });

    const images = response.data.hits;

    if (images.length === 0) {
      if (page === 1) {
        gallery.innerHTML = '';
        Notiflix.Notify.failure(
          "Sorry, there are no images matching your search query. Please try again."
        );
      } else {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
    } else {
      if (page === 1) {
        gallery.innerHTML = '';
      }

      const cardsMarkup = images
        .map(
          ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
            `<a href="${largeImageURL}">
               <div class="photo-card">
                 <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                 <div class="info">
                   <p class="info-item"><b>Likes:</b> ${likes}</p>
                   <p class="info-item"><b>Views:</b> ${views}</p>
                   <p class="info-item"><b>Comments:</b> ${comments}</p>
                   <p class="info-item"><b>Downloads:</b> ${downloads}</p>
                 </div>
               </div>
             </a>`
        )
        .join('');

      gallery.insertAdjacentHTML('beforeend', cardsMarkup);

      if (page === 1) {
        lightbox.refresh();
      }

      if (images.length === perPage) {
        loadMoreBtn.style.display = 'block';
      } else {
        loadMoreBtn.style.display = 'none';
      }
    }
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.');
  }
};

// Обработчик сабмита формы
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  searchQuery = searchInput.value.trim();
  page = 1;
  loadMoreBtn.style.display = 'none';
  fetchImages();
});

// Обработчик клика на кнопку "Load more"
loadMoreBtn.addEventListener('click', () => {
  page += 1;
  fetchImages();
});



function applyButtonStyles() {
  const loadMoreBtn = document.querySelector('.load-more');
  loadMoreBtn.classList.add('button-center');
}
