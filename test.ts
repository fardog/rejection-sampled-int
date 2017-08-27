import * as rand from './'

let int: number 

int = rand.sync()
int = rand.sync({min: 0, max: 10})
int = rand.sync({min: 0})
int = rand.sync({max: 1000})

rand().then((int: number) => {})
rand({min: 0, max: 100}).then((int: number) => {})
rand({min: 0}).then((int: number) => {})
rand({max: 1000}).then((int: number) => {})

rand((err: Error, int: number) => {})
rand({min: 0, max: 100}, (err: Error, int: number) => {})
rand({min: 0}, (err: Error, int: number) => {})
rand({max: 10}, (err: Error, int: number) => {})
