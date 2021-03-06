/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace materials {
    export namespace ui {
        export namespace c {
            /**
             * 编辑视图-库存收货
             */
            export class GoodsReceiptEditView extends ibas.BOEditView implements app.IGoodsReceiptEditView {
                /** 删除数据事件 */
                deleteDataEvent: Function;
                /** 新建数据事件，参数1：是否克隆 */
                createDataEvent: Function;
                /** 添加库存收货-行事件 */
                addGoodsReceiptLineEvent: Function;
                /** 删除库存收货-行事件 */
                removeGoodsReceiptLineEvent: Function;
                /** 选择库存收货单价格清单 */
                chooseGoodsReceiptMaterialPriceListEvent: Function;
                /** 选择库存收货单行物料事件 */
                chooseGoodsReceiptLineMaterialEvent: Function;
                /** 选择库存收货单行仓库事件 */
                chooseGoodsReceiptlineWarehouseEvent: Function;
                /** 选择库存收货单行物料序列事件 */
                chooseGoodsReceiptLineMaterialSerialEvent: Function;
                /** 选择库存收货单行物料批次事件 */
                chooseGoodsReceiptLineMaterialBatchEvent: Function;

                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    let formTop: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("materials_title_general") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_docentry") }),
                            new sap.m.Input("", {
                                editable: false,
                            }).bindProperty("value", {
                                path: "docEntry",
                            }),
                            /*
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_pricelist") }),
                            new sap.m.ex.BOInput("", {
                                boText: "name",
                                boKey: "objectKey",
                                boCode: ibas.config.applyVariables(bo.BO_CODE_MATERIALPRICELIST),
                                repositoryName: bo.BO_REPOSITORY_MATERIALS,
                                valueHelpRequest: function (): void {
                                    that.fireViewEvents(that.chooseGoodsReceiptMaterialPriceListEvent);
                                },
                                bindingValue: {
                                    path: "priceList"
                                }
                            }),
                            */
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_ordertype") }),
                            new sap.m.ex.SmartField("", {
                                width: "100%",
                                boType: bo.GoodsReceipt.name,
                                propertyName: "OrderType",
                                bindingValue: {
                                    path: "orderType"
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_reference1") }),
                            new sap.m.Input("", {}).bindProperty("value", {
                                path: "reference1"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_reference2") }),
                            new sap.m.Input("", {}).bindProperty("value", {
                                path: "reference2"
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("materials_title_status") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_documentstatus") }),
                            new sap.m.Select("", {
                                items: openui5.utils.createComboBoxItems(ibas.emDocumentStatus),
                            }).bindProperty("selectedKey", {
                                path: "documentStatus",
                                type: "sap.ui.model.type.Integer",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_canceled") }),
                            new sap.m.Select("", {
                                items: openui5.utils.createComboBoxItems(ibas.emYesNo),
                            }).bindProperty("selectedKey", {
                                path: "canceled",
                                type: "sap.ui.model.type.Integer",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_documentdate") }),
                            new sap.m.DatePicker("", {
                                valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                            }).bindProperty("dateValue", {
                                path: "documentDate",
                            }),
                        ]
                    });
                    this.selectWarehouse = new sap.m.ex.BOSelect("", {
                        boText: "name",
                        boKey: "code",
                        blank: true,
                        boCode: ibas.config.applyVariables(bo.BO_CODE_WAREHOUSE),
                        repositoryName: bo.BO_REPOSITORY_MATERIALS,
                        criteria: app.conditions.warehouse.create(),
                    });
                    this.tableGoodsReceiptLine = new sap.ui.table.Table("", {
                        toolbar: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_add"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://add",
                                    press: function (): void {
                                        that.fireViewEvents(that.addGoodsReceiptLineEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_remove"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://less",
                                    press: function (): void {
                                        that.fireViewEvents(that.removeGoodsReceiptLineEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.GoodsReceiptLine>(that.tableGoodsReceiptLine)
                                        );
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.MenuButton("", {
                                    icon: "sap-icon://tags",
                                    text: ibas.strings.format("{0}/{1}",
                                        ibas.i18n.prop("materials_material_batch"), ibas.i18n.prop("materials_material_serial")),
                                    menu: new sap.m.Menu("", {
                                        items: [
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("materials_material_batch"),
                                                press: function (): void {
                                                    that.fireViewEvents(that.chooseGoodsReceiptLineMaterialBatchEvent);
                                                }
                                            }),
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("materials_material_serial"),
                                                press: function (): void {
                                                    that.fireViewEvents(that.chooseGoodsReceiptLineMaterialSerialEvent);
                                                }
                                            }),
                                        ]
                                    })
                                }),
                                new sap.m.ToolbarSpacer(""),
                                new sap.m.Label("", {
                                    wrapping: false,
                                    text: ibas.i18n.prop("bo_warehouse")
                                }),
                                this.selectWarehouse,
                            ]
                        }),
                        enableSelectAll: false,
                        selectionBehavior: sap.ui.table.SelectionBehavior.Row,
                        visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 8),
                        rows: "{/rows}",
                        columns: [
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_goodsreceiptline_lineid"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "lineId",
                                }),
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_goodsreceiptline_linestatus"),
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: openui5.utils.createComboBoxItems(ibas.emDocumentStatus),
                                }).bindProperty("selectedKey", {
                                    path: "lineStatus",
                                    type: "sap.ui.model.type.Integer",
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_goodsreceiptline_itemcode"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    showValueHelp: true,
                                    valueHelpRequest: function (): void {
                                        that.fireViewEvents(that.chooseGoodsReceiptLineMaterialEvent,
                                            // 获取当前对象
                                            this.getBindingContext().getObject()
                                        );
                                    }
                                }).bindProperty("value", {
                                    path: "itemCode"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_goodsreceiptline_itemdescription"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "itemDescription"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_goodsreceiptline_warehouse"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    showValueHelp: true,
                                    valueHelpRequest: function (): void {
                                        that.fireViewEvents(that.chooseGoodsReceiptlineWarehouseEvent,
                                            // 获取当前对象
                                            this.getBindingContext().getObject()
                                        );
                                    }
                                }).bindProperty("value", {
                                    path: "warehouse"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_goodsreceiptline_quantity"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    type: sap.m.InputType.Number
                                }).bindProperty("value", {
                                    path: "quantity",
                                    type: new openui5.datatype.Quantity(),
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_goodsreceiptline_uom"),
                                template: new sap.m.Text("", {
                                    width: "100%",
                                    wrapping: false
                                }).bindProperty("text", {
                                    path: "uom"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_goodsreceiptline_price"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    type: sap.m.InputType.Number
                                }).bindProperty("value", {
                                    path: "price",
                                    type: new openui5.datatype.Price(),
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_goodsreceiptline_currency"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                }).bindProperty("value", {
                                    path: "currency"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_goodsreceiptline_linetotal"),
                                template: new sap.m.Text("", {
                                    width: "100%",
                                    wrapping: false
                                }).bindProperty("text", {
                                    path: "lineTotal",
                                    type: new openui5.datatype.Sum(),
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_goodsreceiptline_reference1"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "reference1",
                                }),
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_goodsreceiptline_reference2"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "reference2",
                                }),
                            }),
                        ]
                    });
                    let formMiddle: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_goodsreceiptline") }),
                            this.tableGoodsReceiptLine,
                        ]
                    });
                    let formBottom: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("materials_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_dataowner") }),
                            new sap.m.ex.DataOwnerInput("", {
                                bindingValue: {
                                    path: "dataOwner"
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_project") }),
                            new sap.m.ex.ProjectInput("", {
                                bindingValue: {
                                    path: "project"
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_organization") }),
                            new sap.m.ex.OrganizationInput("", {
                                bindingValue: {
                                    path: "organization"
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_remarks") }),
                            new sap.m.TextArea("", {
                                rows: 3,
                            }).bindProperty("value", {
                                path: "remarks",
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("materials_title_total") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_goodsreceipt_documenttotal") }),
                            new sap.m.Input("", {
                                editable: false,
                            }).bindProperty("value", {
                                path: "documentTotal",
                                type: new openui5.datatype.Sum(),
                            }),
                            new sap.m.Input("", {
                                editable: false,
                            }).bindProperty("value", {
                                path: "documentCurrency"
                            }),
                        ]
                    });
                    this.layoutMain = new sap.ui.layout.VerticalLayout("", {
                        content: [
                            formTop,
                            formMiddle,
                            formBottom,
                        ]
                    });
                    this.page = new sap.m.Page("", {
                        showHeader: false,
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_save"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://save",
                                    press: function (): void {
                                        that.fireViewEvents(that.saveDataEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_delete"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://delete",
                                    press: function (): void {
                                        that.fireViewEvents(that.deleteDataEvent);
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.MenuButton("", {
                                    text: ibas.strings.format("{0}/{1}",
                                        ibas.i18n.prop("shell_data_new"), ibas.i18n.prop("shell_data_clone")),
                                    icon: "sap-icon://create",
                                    type: sap.m.ButtonType.Transparent,
                                    menu: new sap.m.Menu("", {
                                        items: [
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("shell_data_new"),
                                                icon: "sap-icon://create",
                                                press: function (): void {
                                                    // 创建新的对象
                                                    that.fireViewEvents(that.createDataEvent, false);
                                                }
                                            }),
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("shell_data_clone"),
                                                icon: "sap-icon://copy",
                                                press: function (): void {
                                                    // 复制当前对象
                                                    that.fireViewEvents(that.createDataEvent, true);
                                                }
                                            }),
                                        ],
                                    })
                                }),
                            ]
                        }),
                        content: [this.layoutMain]
                    });
                    return this.page;
                }
                private page: sap.m.Page;
                private tableGoodsReceiptLine: sap.ui.table.Table;
                private layoutMain: sap.ui.layout.VerticalLayout;
                private selectWarehouse: sap.m.Select;
                get defaultWarehouse(): string {
                    return this.selectWarehouse.getSelectedKey();
                }
                set defaultWarehouse(value: string) {
                    this.selectWarehouse.setSelectedKey(value);
                }
                /** 改变视图状态 */
                private changeViewStatus(data: bo.GoodsReceipt): void {
                    if (ibas.objects.isNull(data)) {
                        return;
                    }
                    // 新建时：禁用删除，
                    if (data.isNew) {
                        if (this.page.getSubHeader() instanceof sap.m.Toolbar) {
                            openui5.utils.changeToolbarSavable(<sap.m.Toolbar>this.page.getSubHeader(), true);
                            openui5.utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                        }
                    }
                    // 不可编辑：已批准，
                    if (data.approvalStatus === ibas.emApprovalStatus.APPROVED) {
                        if (this.page.getSubHeader() instanceof sap.m.Toolbar) {
                            openui5.utils.changeToolbarSavable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                            openui5.utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                        }
                        openui5.utils.changeFormEditable(this.layoutMain, false);
                    }
                }

                /** 显示数据 */
                showGoodsReceipt(data: bo.GoodsReceipt): void {
                    this.layoutMain.setModel(new sap.ui.model.json.JSONModel(data));
                    this.layoutMain.bindObject("/");
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.layoutMain, data);
                    // 改变视图状态
                    this.changeViewStatus(data);
                }
                /** 显示数据 */
                showGoodsReceiptLines(datas: bo.GoodsReceiptLine[]): void {
                    this.tableGoodsReceiptLine.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.tableGoodsReceiptLine, datas);
                }
            }
        }
    }
}