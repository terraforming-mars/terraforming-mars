
export class User {
    public createdTime: string = new Date().toISOString().slice(0,16);
     
    constructor(
        public name: string,
        public password: string,
        public id: string
        ) {
    }
}

