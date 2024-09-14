import { Api, ApiListResponse } from './base/api';
import { IProductItem, IPurchasingGoods,IResposePurchasingGoods } from "../types";

export interface IAuctionAPI {
    getProductist: () => Promise<IProductItem[]>;
    getProduct: (id: string) => Promise<IProductItem>;
}

export class AuctionAPI extends Api implements IAuctionAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductist(): Promise<IProductItem[]> {
        return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getProduct(id: string): Promise<IProductItem> {
        return this.get(`/product/${id}`).then(
            (data: IProductItem) => data
        );
    }

    purchasingGoods(item: IPurchasingGoods): Promise<IResposePurchasingGoods> {
        return this.post(`/order`, item).then(
            (data:IResposePurchasingGoods) => data
        );
    }

}