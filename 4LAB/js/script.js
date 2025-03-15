function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }
  
  setTimeout(function() {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  }, 3000);

  // Переключение темы
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  themeToggle.textContent = isDark ? '🌕' : '🌑';
  setCookie('theme', isDark ? 'dark' : 'light', 365);
});

// Тема из куки
const savedTheme = getCookie('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
  themeToggle.textContent = '🌕';
}

// Лента отзывов
let reviews = [
  { name: "Екатерина, 300м от вас", text: "Каждая ссора с мужем превращается в захватывающую драму, теперь я могу заниматься любимым делом с еще большим интересом!!!!!", rating: 5, date: new Date(), image: null },
  { name: "Даня, 15 лет", text: "MainCharacter™ - лучшее, что случилось со мной в жизни! После каждой катки в доте я слушаю душераздирающий рэп. Кажется, меня выгоняют из дома", rating: 5, date: new Date(), image: null },
  { name: "яся", text: "норм", rating: 2.5, date: new Date(), image: null }
];

const reviewsList = document.getElementById('reviewsList');
const reviewForm = document.getElementById('reviewForm');
const sortReviews = document.getElementById('sortReviews');
const filterReviews = document.getElementById('filterReviews');

function renderReviews() {
  reviewsList.innerHTML = '';
  const filteredReviews = reviews.filter(review => {
    const ratingFilter = filterReviews.value;
    return ratingFilter === 'all' || review.rating == ratingFilter;
  });

  const sortedReviews = filteredReviews.sort((a, b) => {
    if (sortReviews.value === 'date') {
      return b.date - a.date;
    } else {
      return b.rating - a.rating;
    }
  });

  sortedReviews.forEach(review => {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    reviewItem.innerHTML = `
      <strong>${review.name}</strong> (Оценка: ${review.rating})<br>
      <p>${review.text}</p>
      ${review.image ? `<img src="${review.image}" alt="Изображение отзыва">` : ''}
      <small>${review.date.toLocaleString()}</small>
    `;
    reviewsList.appendChild(reviewItem);
  });
}

reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('reviewName').value;
  const text = document.getElementById('reviewText').value;
  const rating = parseInt(document.getElementById('reviewRating').value);
  const imageFile = document.getElementById('reviewImage').files[0];

  if (name && text && rating >= 1 && rating <= 5) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const newReview = {
        name,
        text,
        rating,
        date: new Date(),
        image: e.target.result
      };
      reviews.push(newReview);
      setCookie('reviews', JSON.stringify(reviews), 365);
      renderReviews();
      reviewForm.reset();
    };
    if (imageFile) {
      reader.readAsDataURL(imageFile);
    } else {
      const newReview = {
        name,
        text,
        rating,
        date: new Date(),
        image: null
      };
      reviews.push(newReview);
      setCookie('reviews', JSON.stringify(reviews), 365);
      renderReviews();
      reviewForm.reset();
    }
  }
});

sortReviews.addEventListener('change', renderReviews);
filterReviews.addEventListener('change', renderReviews);

//Отзывы из куки
const savedReviews = getCookie('reviews');
if (savedReviews) {
  reviews = JSON.parse(savedReviews);
}

renderReviews();