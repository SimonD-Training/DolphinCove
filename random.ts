class student {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    attendClass(date: string) {
        console.log(`${this.name} has attended class on ${date}`);
    }
}
