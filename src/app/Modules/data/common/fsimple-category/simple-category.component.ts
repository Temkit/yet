import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatDialog } from "@angular/material/dialog";
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from "@angular/material/tree";
import { SelectionModel } from "@angular/cdk/collections";
import { S3Service } from "./../../../../private/aws/s3.service";
import { map, flatMap } from "rxjs/operators";
import { AdditemComponent } from "./additem/additem.component";
import { CheckListDatabaseService } from "src/app/private/soft/CheckListDatabase.service";
import { CrudService } from "src/app/private/firebase/crud.service";

@Component({
  selector: "fapp-simple-category",
  templateUrl: "./simple-category.component.html",
  styleUrls: ["./simple-category.component.css"],
})
export class SimpleCategoryComponent implements OnInit {
  tmp_objectConfig;
  objectConfig;

  urlItem;
  render;
  init = true;

  isNewTree = false;
  isChild = false;
  tree;
  selectedNodesFromForm = [];

  oldTree;

  flatNodeMap = new Map<any, any>();
  nestedNodeMap = new Map<any, any>();
  selectedParent: any | null = null;
  newItemName = "";
  treeControl: FlatTreeControl<any>;
  treeFlattener: MatTreeFlattener<any, any>;
  dataSource: MatTreeFlatDataSource<any, any>;
  checklistSelection = new SelectionModel<any>(true);
  domain;
  group;
  link;

  @Output() patch: EventEmitter<object> = new EventEmitter<object>();
  @Input() set config(val) {
    if (val) {
      this.link = localStorage.getItem("group");
      this.tmp_objectConfig = JSON.parse(val);

      this.isChild = this.tmp_objectConfig.isChild;
      this.urlItem = this.tmp_objectConfig.specification;

      this.render = this.S3Service.getSpec(
        this.domain +
          "/" +
          this.link +
          "/categories/" +
          this.tmp_objectConfig.specification +
          ".form.json"
      ).pipe(
        flatMap((data: any) => {
          this.objectConfig = JSON.parse(data.Body.toString());
          return this.__g_.getDocument(this.objectConfig.query.path);
        }),
        map((data: any) => {
          console.log(data);
          if (data) {
            this.tree = data.data().tree;
            console.log(this.tree);
            this.isNewTree = false;
          } else {
            this.isNewTree = true;
            this.tree = [
              {
                item: { name: "__", _id: "category" },
                level: 0,
                children: [],
              },
            ];
          }

          this.database.initialize(this.tree);

          if (this.isChild && this.selectedNodesFromForm) {
            this.addSelectedNode(
              this.database.data,
              this.selectedNodesFromForm
            );
            this.init = false;
          }

          this.treeControl.expandAll();

          return this.objectConfig;
        })
      );
    }
  }

  @Input()
  set value(val) {
    if (val) {
      this.selectedNodesFromForm =
        JSON.parse(val) !== null ? JSON.parse(val) : [];
    }
  }

  constructor(
    private database: CheckListDatabaseService,
    private S3Service: S3Service,
    public dialog: MatDialog,
    private __g_: CrudService
  ) {
    this.domain = localStorage.getItem("domain");
  }

  ngOnInit(): void {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<any>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this.database.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });

    this.checklistSelection.changed.subscribe((node) => {
      if (!this.init) {
        this.emit();
      }
    });
  }

  getLevel = (node: any) => node.level;
  isExpandable = (node: any) => node.expandable;
  getChildren = (node: any): any[] => node.children;
  hasChild = (_: number, _nodeData: any) => _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: any) => _nodeData.item === "";

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: any, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : ({} as any);
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: any): boolean {
    const descendants = this.treeControl.getDescendants(node);

    if (descendants.length === 0) {
      return this.checklistSelection.isSelected(node);
    }

    return descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: any): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: any): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: any): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: any): void {
    let parent: any | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: any): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    /*    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    ); */
    if (nodeSelected /* && !descAllSelected */) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected /* && descAllSelected */) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: any): any | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: any) {
    const parentNode = this.flatNodeMap.get(node);
    this.checklistSelection.deselect(node);
    this.database.insertItem(parentNode!, "");
    this.treeControl.expand(node);
  }

  openDialog(item): void {
    const dialogRef = this.dialog.open(AdditemComponent, {
      width: "800px",
      height: "600px",
      data: {
        origine: item,
        config: {
          type: "category",
          item: this.urlItem,
        },
        value: item.item,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveNode(result.origine, result.item);
      }
    });
  }

  /** Select the category so we can insert the new item. */
  deleteItem(node) {
    const parentNode = this.flatNodeMap.get(node);
    this.database.deleteItem(this.dataSource.data[0], parentNode);
    this.database.data.filter((e) => e);

    this.saveTree();
  }

  /** Save the node to database */
  saveNode(node, itemValue) {
    const nestedNode = this.flatNodeMap.get(node);
    if (itemValue && Object.keys(itemValue).includes("_id")) {
      this.database.updateItem(nestedNode!, itemValue);
    } else if (
      itemValue &&
      typeof itemValue === "object" &&
      !Object.keys(itemValue).includes("_id")
    ) {
      this.database.updateItem(nestedNode!, itemValue);
    } else {
      this.database.updateItem(nestedNode!, {
        name: itemValue,
      });
    }
    this.saveTree();
  }

  saveTree() {
    this.__g_.put(this.objectConfig.query, {
      tree: this.database.data,
    });
  }

  emit() {
    const valueEmit = [];

    this.checklistSelection.selected.map((node) => {
      const parentNode = this.flatNodeMap.get(node);
      valueEmit.push(parentNode._id);
    });

    const obj = {};
    obj[this.objectConfig.valueToEmit] = valueEmit;

    this.patch.emit(obj);
  }

  addSelectedNode(data, select) {
    data.map((node) => {
      select.map((selected) => {
        if (node._id === selected) {
          this.checklistSelection.select(this.nestedNodeMap.get(node));
        } else if (node.children.length > 0) {
          return this.addSelectedNode(node.children, select);
        }
      });
    });
  }
}
