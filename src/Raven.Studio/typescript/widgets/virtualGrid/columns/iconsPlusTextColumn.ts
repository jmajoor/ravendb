﻿/// <reference path="../../../../typings/tsd.d.ts"/>

import virtualColumn = require("widgets/virtualGrid/columns/virtualColumn");
import virtualGridController = require("widgets/virtualGrid/virtualGridController");
import genUtils = require("common/generalUtils");

class iconsPlusTextColumn<T> implements virtualColumn {
    width: string;
    header: string;

    private readonly dataForHtml: (obj: T) => iconPlusText[] | string;
    
    constructor(protected gridController: virtualGridController<any>, dataForHtml: (obj: T) => iconPlusText[] | string, header: string, width: string) {
        this.width = width;
        this.header = header;
        this.dataForHtml = dataForHtml;
    }

    canHandle(actionId: string): boolean {
        return false;
    }
    
    get sortable() {
        return false;
    }

    get headerAsText() {
        return this.header;
    }

    renderCell(item: T, isSelected: boolean, isSorted: boolean): string {
        const data = this.dataForHtml(item);
        let innerHtml = "";
        
        if (_.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                const iconAndText = data[i];
                innerHtml += `<span title="${genUtils.escapeHtml(iconAndText.title)}" class="${genUtils.escapeHtml(iconAndText.textClass)} margin-right margin-right-sm">
                                  <i class="${genUtils.escapeHtml(iconAndText.iconClass)} margin-right margin-right-xs"></i>${genUtils.escapeHtml(iconAndText.text)}
                              </span>`;
            }
        } else {
            innerHtml = data;
        }
        
        return `<div class="cell text-cell" style="width: ${this.width}">${innerHtml}</div>`;
    }

    toDto(): virtualColumnDto {
        return {
            type: "iconsPlusText",
            serializedValue: null,
            width: this.width,
            header: this.header
        }
    }
}

export = iconsPlusTextColumn;
