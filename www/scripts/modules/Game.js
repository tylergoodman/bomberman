var Bomberman, Game;

Game = (function() {
  function Game() {
    var $el, phaser, titlescreen;
    $el = $('#game');
    titlescreen = {
      preload: function() {
        this.game.load.image('background', 'images/titlescreenfinal.png');
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        return this.game.scale.setScreenSize();
      },
      create: function() {
        var background, game, rescale;
        background = phaser.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        game = this.game;
        rescale = (function() {
          var left, top;
          left = ($el.width() - game.scale.width) / 2;
          top = ($el.height() - game.scale.height) / 2;
          return $(game.canvas).css({
            'left': left,
            'top': top,
            'position': 'relative'
          });
        }).debounce(100);
        rescale();
        return $(window).on('resize', rescale);
      }
    };
    this.phaser = phaser = new Phaser.Game(1375, 825, Phaser.AUTO, $el[0], titlescreen);
  }

  return Game;

})();

Bomberman = new Game;
