export interface ProviderItem {
    _id: string,
    name: string,
    address: string,
    tel: string
    __v: number,
    id: string
}
  
export interface ProviderJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: ProviderItem[]
}

export interface BookingItem {
    _id: string;
    nameLastname: string;
    tel: string;
    venue: string;
    bookDate: string;
}