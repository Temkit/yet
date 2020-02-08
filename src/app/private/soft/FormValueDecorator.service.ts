import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import transform from "lodash/transform";
import isEqual from "lodash/isEqual";
import isObject from "lodash/isObject";
import { FormVars } from "../interfaces/form.vars";
import { AuthService } from "../aws/auth.service";
import { QueryService } from "../crud/query.service";
import { CrudToolsService } from "../crud/crud-tools.service";
import isEqualWith from "lodash/isEqualWith";
import { isArray } from "util";
import { SnsService } from "../aws/sns.service";
import { OneService } from "../crud/one.service";

@Injectable({
  providedIn: "root"
})
export class FormValueDecoratorService {
  public vars = {
    Properties: [],
    SameFormAsStart: true,
    Specification: {},
    Tabs: {},
    newForm: true,
    FirstCall: true,
    Item: {},
    files: {}
  } as FormVars;

  constructor(
    private authService: AuthService,
    private __q_: QueryService,
    private __o_: OneService,
    private sns: SnsService,
    private ct: CrudToolsService
  ) {}

  getValue(property, item) {
    let value = null;

    switch (true) {
      case property.type === "bondecommande":
        let tmpItem = {};
        if (item != null) {
          tmpItem = item;
        }
        tmpItem["type"] = "Devis";
        tmpItem["property"] = property;
        value = JSON.stringify(tmpItem);
        break;
      case property.type === "order-handler" ||
        property.type === "order-handler-free" ||
        property.type === "tags" ||
        property.type === "item-handler" ||
        property.type === "simpleCategory" ||
        property.type === "polygone" ||
        property.type === "autocompleteArrayInput":
        if (item != null && item.hasOwnProperty(property.name)) {
          value = item[property.name];
        } else {
          value = [];
        }
        break;
      case property.type === "select" || property.type === "editor":
        value =
          item != null && item.hasOwnProperty(property.name)
            ? item[property.name]
            : property.value;
        break;
      case property.type === "autocomplete" ||
        property.type === "custom" ||
        property.type === "autocompletetagsinput":
        value =
          item != null && item.hasOwnProperty(property.name)
            ? JSON.stringify(item[property.name])
            : null;
        break;
      case property.type === "sns-subscription":
        value =
          item != null && item.hasOwnProperty(property.name)
            ? item[property.name]
            : {
                TopicARN: undefined,
                value: []
              };
        break;

      case property.type === "date" && property.disabled === false:
        value =
          item != null &&
          item.hasOwnProperty(property.name) &&
          item[property.name] !== "0000-00-00 00:00:00"
            ? item[property.name]
            : null;
        break;
      case property.name === "author":
        value =
          item != null && item.hasOwnProperty(property.name)
            ? item[property.name]
            : this.authService.Cache.getItem("user");
        break;
      case property.name === "reference" ||
        property.name === "code_client" ||
        property.name === "code_fournisseur":
        if (item == null && property.value.includes("ORDER")) {
          value =
            item != null && item.hasOwnProperty(property.name)
              ? item[property.name]
              : this.__q_
                  .count$(
                    property.count.TableName,
                    property.count.Region,
                    property.count.IndexName,
                    property.count.KeyConditionExpression,
                    property.count.FilterExpression,
                    property.count.ExpressionAttributeNames,
                    property.count.ExpressionAttributeValues
                  )
                  .pipe(
                    map(data => {
                      let actualCount = data.Count + 1;
                      let count = "";
                      const length = 6 - actualCount.toString().length;

                      for (let i = 0; i < length; i++) {
                        count = "0" + count;
                      }

                      return count + "" + actualCount;
                    })
                  );
        } else if (item == null && property.value.includes("GEN")) {
          value = property.value
            .replace("{{GEN}}", this.ct.makeID(4) + "-" + this.ct.id(4))
            .toString()
            .toLowerCase();
        } else {
          value = item[property.name];
        }
        break;
      case property.type === "image":
        if (item != null && item.hasOwnProperty(property.name)) {
          value = item[property.name];
        }
        break;
      case property.name === "_id" ||
        property.name === "index" ||
        property.name === "ref":
        if (item == null || !item.hasOwnProperty(property.name)) {
          this.vars.newForm = true;

          if (property.value.includes("GEN")) {
            value = property.value
              .replace(
                "{{GEN}}",
                new Date().getUTCMonth() +
                  "" +
                  new Date().getUTCFullYear() +
                  this.ct.id(2) +
                  "t" +
                  new Date().getUTCFullYear()
              )
              .toString()
              .toLowerCase();
          } else if (property.value) {
            value = property.value;
          }
        } else {
          value = item[property.name];
        }

        break;
      case property.type === "date" && property.disabled === true:
        value = new Date().getTime();
        break;
      default:
        if (property.type) {
          value =
            item != null && item.hasOwnProperty(property.name)
              ? item[property.name]
              : this.vars.ValueToParentForm != null &&
                this.vars.ValueToParentForm.hasOwnProperty(property.name)
              ? this.vars.ValueToParentForm[property.name]
              : property.hasOwnProperty("value")
              ? property.value
              : null;
        }
    }
    return value;
  }

  public difference(object, base) {
    return this.changes(object, base);
  }

  private changes(object, base) {
    const _this_ = this;
    return transform(object, function(result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] =
          isObject(value) && isObject(base[key] && !isArray(value))
            ? _this_.changes(value, base[key])
            : value;
      }
    });
  }

  customizer(objValue, othValue) {
    if (
      (objValue === undefined && othValue === false) ||
      "<p>" + objValue + "</p>" === othValue
    ) {
      return true;
    }
  }

  isDifferent(oldForm, newForm) {
    return isEqualWith(oldForm, newForm, this.customizer);
  }
}
