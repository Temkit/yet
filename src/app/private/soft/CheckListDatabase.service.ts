import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import isEqual from "lodash/isEqual";
import { CrudToolsService } from "../crud/crud-tools.service";

@Injectable({
  providedIn: "root",
})
export class CheckListDatabaseService {
  dataChange = new BehaviorSubject<any[]>([]);

  get data(): any[] {
    return this.dataChange.value;
  }

  constructor(private ct: CrudToolsService) {}

  initialize(tree) {
    this.dataChange.next(tree);
  }

  /** Add an item to to-do list */
  insertItem(parent: any, name: string) {
    if (parent.children) {
      parent.children.push({
        item: name,
        _id: this.ct.makeID(6),
        children: [],
      } as any);
      this.dataChange.next(this.data);
    }
  }

  /** Add an item to to-do list */
  deleteItem(data, node) {
    if (data.children && data.children.length > 0) {
      data.children.map((n, i) => {
        if (this.deleteItem(n, node)) {
          data.children.splice(i, 1);
          console.log(data.children, i, data.children[i]);
          this.dataChange.next(this.data);
        }
      });
    }

    return isEqual(data, node);
  }

  updateItem(node, name) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}
