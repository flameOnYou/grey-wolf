export default class Bar{
    constructor(
        public timestamp:number,
        public open:number,
        public high:number,
        public low:number,
        public close:number,
        public volume:number,
        public turnover?: number
    ){

    }

}