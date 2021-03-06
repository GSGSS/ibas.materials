package org.colorcoding.ibas.materials.logic;

import org.colorcoding.ibas.bobas.common.ConditionOperation;
import org.colorcoding.ibas.bobas.common.ConditionRelationship;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.data.emDirection;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.bobas.mapping.LogicContract;
import org.colorcoding.ibas.materials.bo.material.IMaterial;
import org.colorcoding.ibas.materials.bo.materialinventory.IMaterialInventory;
import org.colorcoding.ibas.materials.bo.materialinventory.MaterialInventory;
import org.colorcoding.ibas.materials.data.emItemType;
import org.colorcoding.ibas.materials.repository.BORepositoryMaterials;

@LogicContract(IMaterialWarehouseInventoryContract.class)
public class MaterialWarehouseInventoryService
		extends MaterialInventoryBusinessLogic<IMaterialWarehouseInventoryContract, IMaterialInventory> {
	@Override
	protected IMaterialInventory fetchBeAffected(IMaterialWarehouseInventoryContract contract) {
		// 检查物料
		IMaterial material = this.checkMaterial(contract.getItemCode());
		// 虚拟物料，不生成库存记录
		if (material.getPhantomItem() == emYesNo.YES) {
			throw new BusinessLogicException(String
					.format(I18N.prop("msg_mm_material_is_phantom_item_can't_create_journal"), material.getCode()));
		}
		// 非库存物料，不生成库存记录
		if (material.getInventoryItem() == emYesNo.NO) {
			throw new BusinessLogicException(String.format(
					I18N.prop("msg_mm_material_is_not_inventory_item_can't_create_journal"), material.getCode()));
		}
		// 服务物料，不生成库存记录
		if (material.getItemType() == emItemType.SERVICES) {
			throw new BusinessLogicException(String
					.format(I18N.prop("msg_mm_material_is_service_item_can't_create_journal"), material.getCode()));
		}
		// 检查仓库
		this.checkWarehouse(contract.getWarehouse());
		// 检查物料库存记录
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(MaterialInventory.PROPERTY_ITEMCODE.getName());
		condition.setOperation(ConditionOperation.EQUAL);
		condition.setValue(contract.getItemCode());
		condition = criteria.getConditions().create();
		condition.setRelationship(ConditionRelationship.AND);
		condition.setAlias(MaterialInventory.PROPERTY_WAREHOUSE.getName());
		condition.setOperation(ConditionOperation.EQUAL);
		condition.setValue(contract.getWarehouse());

		IMaterialInventory materialInventory = this.fetchBeAffected(criteria, IMaterialInventory.class);
		if (materialInventory == null) {
			BORepositoryMaterials boRepository = new BORepositoryMaterials();
			boRepository.setRepository(super.getRepository());
			IOperationResult<IMaterialInventory> operationResult = boRepository.fetchMaterialInventory(criteria);
			if (operationResult.getError() != null) {
				throw new BusinessLogicException(operationResult.getError());
			}
			materialInventory = operationResult.getResultObjects().firstOrDefault();
		}
		if (materialInventory == null) {
			materialInventory = new MaterialInventory();
			materialInventory.setItemCode(contract.getItemCode());
			materialInventory.setWarehouse(contract.getWarehouse());
		}
		return materialInventory;
	}

	@Override
	protected void impact(IMaterialWarehouseInventoryContract contract) {
		IMaterialInventory materialInventory = this.getBeAffected();
		Decimal onHand = materialInventory.getOnHand();
		if (contract.getDirection() == emDirection.OUT) {
			onHand = onHand.subtract(contract.getQuantity());
		} else {
			onHand = onHand.add(contract.getQuantity());
		}
		materialInventory.setOnHand(onHand);
	}

	@Override
	protected void revoke(IMaterialWarehouseInventoryContract contract) {
		IMaterialInventory materialInventory = this.getBeAffected();
		Decimal onHand = materialInventory.getOnHand();
		if (contract.getDirection() == emDirection.OUT) {
			onHand = onHand.add(contract.getQuantity());
		} else {
			onHand = onHand.subtract(contract.getQuantity());
		}
		materialInventory.setOnHand(onHand);
	}
}
