/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace materials {
    export namespace app {
        /** 查看应用-库存收货 */
        export class GoodsReceiptViewApp extends ibas.BOViewService<IGoodsReceiptViewView, bo.GoodsReceipt> {
            /** 应用标识 */
            static APPLICATION_ID: string = "ccd77fe9-0291-4f9f-9387-883632bbb5ec";
            /** 应用名称 */
            static APPLICATION_NAME: string = "materials_app_goodsreceipt_view";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.GoodsReceipt.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = GoodsReceiptViewApp.APPLICATION_ID;
                this.name = GoodsReceiptViewApp.APPLICATION_NAME;
                this.boCode = GoodsReceiptViewApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.editDataEvent = this.editData;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.viewData)) {
                    // 创建编辑对象实例
                    this.viewData = new bo.GoodsReceipt();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showGoodsReceipt(this.viewData);
                this.view.showGoodsReceiptLines(this.viewData.goodsReceiptLines.filterDeleted());
            }
            /** 编辑数据，参数：目标数据 */
            protected editData(): void {
                let app: GoodsReceiptEditApp = new GoodsReceiptEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(this.viewData);
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.GoodsReceipt): void;
            run(): void {
                if (ibas.objects.instanceOf(arguments[0], bo.GoodsReceipt)) {
                    this.viewData = arguments[0];
                    this.show();
                } else {
                    super.run.apply(this, arguments);
                }
            }
            protected viewData: bo.GoodsReceipt;
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria | string): void {
                this.busy(true);
                let that: this = this;
                if (typeof criteria === "string") {
                    let value: string = criteria;
                    criteria = new ibas.Criteria();
                    criteria.result = 1;
                    // 添加查询条件

                }
                let boRepository: bo.BORepositoryMaterials = new bo.BORepositoryMaterials();
                boRepository.fetchGoodsReceipt({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.GoodsReceipt>): void {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            that.viewData = opRslt.resultObjects.firstOrDefault();
                            if (!that.isViewShowed()) {
                                that.show();
                            } else {
                                that.viewShowed();
                            }
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
            }
        }
        /** 视图-库存收货 */
        export interface IGoodsReceiptViewView extends ibas.IBOViewView {
            /** 显示数据 */
            showGoodsReceipt(data: bo.GoodsReceipt): void;
            /** 显示数据 */
            showGoodsReceiptLines(datas: bo.GoodsReceiptLine[]): void;
        }
        /** 库存收货连接服务映射 */
        export class GoodsReceiptLinkServiceMapping extends ibas.BOLinkServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = GoodsReceiptViewApp.APPLICATION_ID;
                this.name = GoodsReceiptViewApp.APPLICATION_NAME;
                this.boCode = GoodsReceiptViewApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOLinkServiceCaller> {
                return new GoodsReceiptViewApp();
            }
        }
    }
}