export class Point{
    x:number;
    y:number;
    length:number;
    
    constructor(x:number, y:number) { 
        this.x = x 
        this.y = y
        this.length = 0;
    } 
}

export class CrossHair{
    x:number=0;
    y:number=0;
    paneTag:any;
    
    constructor() { 
    } 
}