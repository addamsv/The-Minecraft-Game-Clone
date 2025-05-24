type Book = {
  title: string;
  id: number;
  hasInBasket: boolean;
}

const basket: Book[] = [
  { title: "Book1", id: 1, hasInBasket: true }
]

function getBy<T, P extends keyof T>(arr: T[], prop: P, val: T[P]): T | null {
  return arr.filter(item => item[prop] === val)[0] || null;
}

// example
const res = getBy(basket, "title", "Book1")