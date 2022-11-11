const $ = document.querySelector.bind(document);
      const $$ = document.querySelectorAll.bind(document);

      const player = $('.player')
      const cd = $('.cd')
      const heading = $("header h2");
      const cdThumb = $(".cd-thumb");
      const audio = $("#audio");
      const playBtn = $('.btn-toggle-play')
      const progress = $('#progress')
      const prevBtn = $('.btn-prev')
      const nextBtn = $('.btn-next')
      const randomBtn = $('.btn-random')
      const repeatBtn = $('.btn-repeat')
      const playlist = $('.playlist')


      function skip(value) {
        audio.currentTime += value;
      }

      const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,

        songs: [
          {
            name: 'Someone You Loved',
            // singer: 'ETS 2022',
            path: "X2Download.app - Lewis Capaldi - Someone You Loved (128 kbps).mp3",
            image: "https://cdn.memevui.com/2022-04/20/con-meo-voi-nu-cuoi-tren-moi_medium.jpg",
          },
          {
            name: 'I\'ll Be There',
            // singer: 'ETS 2022',
            path: "X2Download.app - I'll Be There - Gabriela Bee (Lyrics) (128 kbps).mp3",

            image: "https://tiengdong.com/wp-content/uploads/www_tiengdong_com-meme-meo-cam-phong-lon.jpg",
          },
          {
            name: 'Like My Father',
            // singer: 'ETS 2022',
            path: "X2Download.app - Jax - Like My Father (Lyrics_Vietsub) (128 kbps).mp3",
            image: "https://kynguyenlamdep.com/wp-content/uploads/2022/08/meme-meo-nham-hiem.jpg",
          },
          {
            name: 'Cash Cash',
            // singer: 'ETS 2022',
            path: "X2Download.app - [Vietsub+Lyric] Cash Cash - Hero feat. Christina Perri (128 kbps).mp3",
            image: "https://docthuvi.com/static/img/meme-meo-khoc-la-gi-co-nguon-goc-tu-dau-va-cac-bien-the-hai-huoc-tu-cong-dong-mang-881c72-3.jpg",
          },
          // {
          //   name: 'Test 05',
          //   singer: 'ETS 2022',
          //   path: "../Test 05.mp3",
          //   image: "https://anhdep123.com/wp-content/uploads/2021/02/anh-meo-hai-huoc-265x198.jpg",
          // },
          // {
          //   name: 'Test 06',
          //   singer: 'ETS 2022',
          //   path: "../Test 06.mp3",
          //   image: "https://media.coolmate.me/cdn-cgi/image/quality=80/uploads/October2021/meme-cheems-25.jpg",
          // },
          // {
          //   name: 'Test 07',
          //   singer: 'ETS 2022',
          //   path: "../Test 07.mp3",
          //   image:
          //     "https://znews-photo.zingcdn.me/w660/Uploaded/aeixrdbkxq/2021_02_22/a5.jpg",
          // },
          // {
          //   name: 'Test 08',
          //   singer: 'ETS 2022',
          //   path: "../Test 08.mp3",
          //   image:
          //   "https://i.pinimg.com/originals/b9/6f/0f/b96f0f12229417ea487e77463b29f6f8.jpg",
          // },
          // {
          //   name: 'Test 09',
          //   singer: 'ETS 2022',
          //   path: "../Test 09.mp3",
          //   image:
          //   "https://memehay.com/meme/20210704/cheems-cam-sung-noi-may-nghi-co-chuyen-ngon-an-vay-sao.webp",
          // },
          // {
          //   name: 'Test 10',
          //   singer: 'ETS 2022',
          //   path: "../Test 10.mp3",
          //   image:
          //     "https://i.pinimg.com/236x/6e/6b/45/6e6b45855e74b2ac938d6aed6de80836.jpg",
          // },
        ],

        render: function () {
          const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                      <div
                        class="thumb"
                        style="
                          background-image: url('${song.image}');
                        ">
                      </div>
                      <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                      </div>
                      <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                      </div>
                    </div>
            `;
          });
          $(".playlist").innerHTML = htmls.join("\n");
        },
        
        defineProperties: function () {
          Object.defineProperty(this, "currentSong", {
            get: function () {
              return this.songs[this.currentIndex];
            },
          });
        },
        
        handleEvents: function () {
          const _this = this
          const cdWidth = cd.offsetWidth;

          const cdThumbAnimate = cdThumb.animate(
            [{transform: "rotate(360deg)"}], {
              duration: 10000,
              interations: Infinity
            })
          cdThumbAnimate.pause()

          document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCDwidth = cdWidth - scrollTop;

            cd.style.width = newCDwidth > 0 ? newCDwidth + "px" : 0;
            cd.style.opacity = newCDwidth / cdWidth;
          };

          playBtn.onclick = function() {
            if (_this.isPlaying) {
              audio.pause()
            } else {
              audio.play()
            }
          }
          audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
          }
          audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
          }
          audio.ontimeupdate = function () {
            if (audio.duration) {
              const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
              progress.value = progressPercent
            }
          }
          progress.onchange = function(e) {
            const seekTime = audio.duration/100 * e.target.value
            audio.currentTime = seekTime
          }
          nextBtn.onclick = function() {
            if (_this.isRandom) {
              _this.playRandomSong()
            }else{
              _this.nextSong()
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
          }
          prevBtn.onclick = function() {
            if (_this.isRandom) {
              _this.playRandomSong()
            }else{
              _this.prevSong()
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
          }
          randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom)
          }
          repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active", _this.isRepeat)
          }
          audio.onended = function() {
            if (_this.isRepeat) {
              audio.play();
            } else {
              nextBtn.click();
            }
          }
          playlist.onclick = function(e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".option")) {
              if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong();
                _this.render();
                audio.play();
              }
              if (e.target.closest(".option")){

              }
            }
          }
        },
        scrollToActiveSong: function () {
            setTimeout(() => {
                $(".song.active").scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });
            }, 300);
        },
        loadCurrentSong: function () {
          heading.textContent = this.currentSong.name;
          cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
          audio.src = this.currentSong.path;         
        },
        nextSong: function() {
          this.currentIndex++;
          if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
          } 
          this.loadCurrentSong()
        },
        prevSong: function() {
          this.currentIndex--;
          if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1;
          } 
          this.loadCurrentSong()
        },
        playRandomSong: function() {
          let newIndex;
          do {
            newIndex = Math.floor(Math.random()*this.songs.length)
          } while (newIndex === this.currentIndex)
          this.currentIndex = newIndex
          this.loadCurrentSong()
        },
        start: function () {
          // định nghĩa các thuộc tính cho object
          this.defineProperties();

          // lắng nghe xử lý các sự kiện
          this.handleEvents();

          // load current song
          this.loadCurrentSong();

          //render playlist
          this.render();
        },
      };

      app.start();
