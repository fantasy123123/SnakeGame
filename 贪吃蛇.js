//定义食物类
var Food = /** @class */ (function () {
    function Food() {
        //获取food元素
        this.element = document.querySelector('#food');
    }
    Object.defineProperty(Food.prototype, "X", {
        get: function () {
            return this.element.offsetLeft;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Food.prototype, "Y", {
        get: function () {
            return this.element.offsetTop;
        },
        enumerable: false,
        configurable: true
    });
    Food.prototype.change = function () {
        var top = Math.round(Math.random() * 29) * 10;
        var left = Math.round(Math.random() * 29) * 10;
        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
    };
    return Food;
}());
//定义比分盘
var ScorePanel = /** @class */ (function () {
    function ScorePanel(maxLevel, upScore) {
        if (maxLevel === void 0) { maxLevel = 10; }
        if (upScore === void 0) { upScore = 10; }
        this.score = 0;
        this.level = 1;
        this.scoreEle = document.querySelector('#score');
        this.levelEle = document.querySelector('#level');
        this.maxLevel = maxLevel;
        this.upScore = upScore;
    }
    ScorePanel.prototype.addScore = function () {
        this.scoreEle.innerHTML = ++this.score + '';
        if (this.score % this.upScore === 0) {
            this.levelUp();
        }
    };
    ScorePanel.prototype.levelUp = function () {
        if (this.level < this.maxLevel) {
            this.levelEle.innerHTML = ++this.level + '';
        }
    };
    return ScorePanel;
}());
//创建蛇类
var Snake = /** @class */ (function () {
    function Snake() {
        this.element = document.querySelector('#snake');
        this.head = document.querySelector('#snake > div');
        this.body = document.getElementById('snake').getElementsByTagName('div');
    }
    Object.defineProperty(Snake.prototype, "X", {
        get: function () {
            return this.head.offsetLeft;
        },
        set: function (value) {
            if (this.X === value) {
                return;
            }
            if (value < 0 || value > 290) {
                throw new Error('蛇撞墙了！');
            }
            if (this.body[1] && this.body[1].offsetLeft === value) {
                if (value > this.X) {
                    value = this.X - 10;
                }
                else {
                    value = this.X + 10;
                }
            }
            this.moveBody();
            this.head.style.left = value + 'px';
            this.checkHead();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snake.prototype, "Y", {
        get: function () {
            return this.head.offsetTop;
        },
        set: function (value) {
            if (this.Y === value) {
                return;
            }
            if (value < 0 || value > 290) {
                throw new Error('蛇撞墙了！');
            }
            if (this.body[1] && this.body[1].offsetTop === value) {
                if (value > this.Y) {
                    value = this.Y - 10;
                }
                else {
                    value = this.Y + 10;
                }
            }
            this.moveBody();
            this.head.style.top = value + 'px';
            this.checkHead();
        },
        enumerable: false,
        configurable: true
    });
    Snake.prototype.addBody = function () {
        this.element.insertAdjacentHTML('beforeend', '<div></div>');
    };
    Snake.prototype.moveBody = function () {
        for (var i = this.body.length - 1; i > 0; i--) {
            var x = this.body[i - 1].offsetLeft;
            var y = this.body[i - 1].offsetTop;
            this.body[i].style.left = x + 'px';
            this.body[i].style.top = y + 'px';
        }
    };
    Snake.prototype.checkHead = function () {
        for (var i = 1; i < this.body.length; i++) {
            var bd = this.body[i];
            if (this.X === bd.offsetLeft && this.Y === bd.offsetTop) {
                throw new Error('撞到自己了！');
            }
        }
    };
    return Snake;
}());
var GameControl = /** @class */ (function () {
    function GameControl() {
        this.direction = '';
        this.isLive = true;
        this.n = 0;
        this.snake = new Snake();
        this.food = new Food();
        this.scorePanel = new ScorePanel(10, 2);
        this.init();
    }
    GameControl.prototype.init = function () {
        document.addEventListener('keydown', this.keydownHandler.bind(this));
    };
    GameControl.prototype.keydownHandler = function (event) {
        this.direction = event.key;
        if(this.n!=0)
        {
        clearTimeout(this.n);
        }
        this.run();
    };
    GameControl.prototype.run = function () {
        var x = this.snake.X;
        var y = this.snake.Y;
        switch (this.direction) {
            case 'ArrowUp' :
                y -= 10;
    
                break;
            case 'ArrowDown' :
                y += 10;
               
                break;
            case 'ArrowLeft' :
                x -= 10;
           
                break;
            case 'ArrowRight' :
                x += 10;
                
                break;
        }
        this.checkEat(x, y);
        try {
            this.snake.X = x;
            this.snake.Y = y;
        }
        catch (e) {
            this.isLive = false;
            alert(e.message + 'GameOver!');
        }
        if (this.isLive) {
            this.n = setTimeout(this.run.bind(this), 300 - (this.scorePanel.level - 1) * 30);
        }
    };
    GameControl.prototype.checkEat = function (x, y) {
        if (x === this.food.X && y === this.food.Y) {
            this.food.change();
            this.scorePanel.addScore();
            this.snake.addBody();
        }
    };
    return GameControl;
}());
var game = new GameControl();
game.init();
