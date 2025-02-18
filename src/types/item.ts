export interface Item {
  id: string;
  price: number;
}
export interface ItemPriceResponse {
  code: number
  body: {
    id: string;
    price: number;
  };
}