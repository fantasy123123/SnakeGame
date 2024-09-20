//定义食物类
class Food{
    element:HTMLElement;

    constructor(){
        //获取food元素
        this.element=document.querySelector('#food')!;
    }

    get X(){
        return this.element.offsetLeft;
    }
    get Y(){
        return this.element.offsetTop;
    }

    change(){
        let top=Math.round(Math.random()*29)*10;
        let left=Math.round(Math.random()*29)*10;

        this.element.style.left=left + 'px';
        this.element.style.top=top + 'px' ;
    }
}


//定义比分盘
class ScorePanel{
    score:number=0;
    level:number=1;
    scoreEle:HTMLElement;
    levelEle:HTMLElement;
    maxLevel:number;
    upScore:number

    constructor(maxLevel:number=10,upScore:number=10){
        this.scoreEle=document.querySelector('#score')!
        this.levelEle=document.querySelector('#level')!
        this.maxLevel=maxLevel;
        this.upScore=upScore;
    }

    addScore(){
        this.scoreEle.innerHTML=++this.score+'';
        if(this.score%this.upScore===0)
        {
            this.levelUp();
        }
    }

    levelUp(){
        if(this.level<this.maxLevel)
        {
            this.levelEle.innerHTML=++this.level+'';
        }
    }

}


//创建蛇类
class Snake{
    head:HTMLElement;
    body:HTMLCollection
    element:HTMLElement

    constructor(){
        this.element=document.querySelector('#snake')!;
        this.head=document.querySelector('#snake > div')as HTMLElement;
        this.body=document.getElementById('snake')!.getElementsByTagName('div');
    }

    get X(){
        return this.head.offsetLeft;
    }

    get Y(){
        return this.head.offsetTop;
    }

    set X(value:number){

        if(this.X===value)
        {
            return;
        }

        if(value<0||value>290)
        {
            throw new Error('蛇撞墙了！');
        }

        if(this.body[1]&&(this.body[1]as HTMLElement).offsetLeft===value)
        {
            if(value>this.X)
            {
                value=this.X-10;
            }
            else
            {
                value=this.X+10;
            }
        }

        this.moveBody();

        this.head.style.left=value+'px';

        this.checkHead();
    }

    set Y(value:number){
        if(this.Y===value)
        {
            return;
        }

        if(value<0||value>290)
        {
            throw new Error('蛇撞墙了！');
        }

        if(this.body[1]&&(this.body[1]as HTMLElement).offsetTop===value)
        {
            if(value>this.Y)
            {
                value=this.Y-10;
            }
            else
            {
                value=this.Y+10;
            }
        }

        this.moveBody();

        this.head.style.top=value+'px';

        this.checkHead();
    }

    addBody(){
        this.element.insertAdjacentHTML('beforeend','<div></div>')
    }

    moveBody()
    {
        for(let i=this.body.length-1;i>0;i--)
        {
            let x=(this.body[i-1]as HTMLElement).offsetLeft;
            let y=(this.body[i-1]as HTMLElement).offsetTop;

            (this.body[i]as HTMLElement).style.left=x+'px';
            (this.body[i]as HTMLElement).style.top=y+'px';
        }
    }

    checkHead(){
        for(let i=1;i<this.body.length;i++)
        {
            let bd=this.body[i]as HTMLElement;
            if(this.X===bd.offsetLeft&&this.Y===bd.offsetTop)
            {
                throw new Error('撞到自己了！')
            }
        }
    }
}

class GameControl{
    snake:Snake;
    food:Food;
    scorePanel:ScorePanel;
    direction:string='';
    isLive=true;
    n=0;

    constructor(){
    this.snake=new Snake();
    this.food=new Food();
    this.scorePanel=new ScorePanel(10,2);

    this.init();
    }


    init(){
        document.addEventListener('keydown',this.keydownHandler.bind(this));
        
    }

    keydownHandler(event:KeyboardEvent){
    this.direction=event.key;
    if(this.n!=0)
    {
    clearTimeout(this.n);
    }
    this.run();
    }

    run()
    {
    let x=this.snake.X;
    let y=this.snake.Y;

    switch(this.direction)
    {
        case 'ArrowUp':
        y-=10;
        
            break;

        case 'ArrowDown':
        y+=10;
       
            break;

        case 'ArrowLeft':
        x-=10;    
       
           break;

        case 'ArrowRight':
        x+=10;    
       
           break;
    }

    this.checkEat(x,y);

    try{
        this.snake.X=x;
        this.snake.Y=y; 
    } catch(e){
        this.isLive=false; 
        alert(e.message+'GameOver!');
       
    }

    if(this.isLive)
       {
         this.n= setTimeout(this.run.bind(this),300-(this.scorePanel.level-1)*30)
       }
    }

    checkEat(x:number,y:number){
       if(x===this.food.X&&y===this.food.Y){
        this.food.change();
        this.scorePanel.addScore();
        this.snake.addBody();
       }
    }

}

const game=new GameControl()
game.init();