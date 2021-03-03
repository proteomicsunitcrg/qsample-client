import { UserShort } from './UserShort';
import { LastAction } from './LastAction';
import { Product } from './Product';
import { Field } from './Field';

export class Request {
  id: number;
  created_by: UserShort;
  group: string;
  classs: string;
  date_created: string;
  status: string;
  account: string;
  total: number;
  delivery_date: string;
  delivery_location: string;
  comment: string;
  last_action: LastAction;
  products: Product[];
  fields: Field[];

  constructor(id: number, created_by: UserShort, group: string, classs: string, date_created: string, status: string, account: string, total: number, delivery_date: string, delivery_location: string, comment: string, last_action: LastAction, products: Product[], fields: Field[]) {
    this.id = id;
    this.created_by = created_by;
    this.group = group;
    this.classs = classs;
    this.date_created = date_created;
    this.status = status;
    this.account = account;
    this.total = total;
    this.delivery_date = delivery_date;
    this.delivery_location = delivery_location;
    this.comment = comment;
    this.last_action = last_action;
    this.products = products;
    this.fields = fields
  }
}
